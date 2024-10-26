using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Team04_API.Data;
using Team04_API.Models.DTOs.ScheduledReportsDTOs;
using Team04_API.Models.Report;
using Team04_API.Services;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleReportsController(dataDbContext _dbContext, DynamicJobSchedulerService _jobScheduler, IHttpContextAccessor httpContextAccessor) : ControllerBase
    {
        private readonly dataDbContext dbContext = _dbContext;
        private readonly DynamicJobSchedulerService jobScheduler = _jobScheduler;
        private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;

        [HttpGet]
        public async Task<ActionResult<List<UserReportPreferenceDto>>> GetUserReportPreferences()
        {

            var userId = Guid.Parse(httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value) ;
            var preferences = await _dbContext.employeeReports
                .Where(r => r.Employee_ID == userId)
                .Select(r => new UserReportPreferenceDto
                {
                    ReportId = r.Report_ID,
                    ReportTypeId = r.Report_Type_ID,
                    ReportTypeName = r.Report_Type.Report_Type_Name,
                    IntervalId = r.Report_Interval_ID,
                    IntervalName = r.Report_Interval.Report_Interval_Name
                })
                .ToListAsync();

            return Ok(preferences);
        }

        [HttpPost]
        public async Task<ActionResult> SetUserReportPreferences(List<SetReportPreferenceDto> preferences)
        {
            var userId = Guid.Parse(httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Fetch all existing preferences for the user
            var existingPreferences = await _dbContext.employeeReports
                .Where(r => r.Employee_ID == userId)
                .ToListAsync();

            // Case 1: If no preferences are provided, delete all existing preferences
            if (preferences == null || !preferences.Any())
            {
                if (existingPreferences.Any())
                {
                    // Remove all existing preferences
                    _dbContext.employeeReports.RemoveRange(existingPreferences);

                    // Unschedule all related jobs
                    foreach (var preference in existingPreferences)
                    {
                        await _jobScheduler.UnscheduleReportJob(preference.Report_ID);
                    }

                    try
                    {
                        await _dbContext.SaveChangesAsync();
                    }
                    catch (DbUpdateException ex)
                    {
                        return StatusCode(500, "An error occurred while deleting your preferences. Please try again.");
                    }
                }

                return Ok("All preferences removed successfully.");
            }

            // Case 2: Handle non-empty preferences
            // Validate that all ReportTypeIds and IntervalIds exist in the database
            var validReportTypeIds = await _dbContext.Report_Type.Select(rt => rt.Report_Type_ID).ToListAsync();
            var validIntervalIds = await _dbContext.Report_Interval.Select(ri => ri.Report_Interval_ID).ToListAsync();

            var invalidPreferences = preferences.Where(p =>
                !validReportTypeIds.Contains(p.ReportTypeId) ||
                !validIntervalIds.Contains(p.IntervalId)).ToList();

            if (invalidPreferences.Any())
            {
                return BadRequest($"Invalid ReportTypeIds or IntervalIds: {string.Join(", ", invalidPreferences.Select(p => $"ReportTypeId: {p.ReportTypeId}, IntervalId: {p.IntervalId}"))}");
            }

            // Track IDs of existing preferences that match the preferences sent from the frontend
            var matchedReportTypeIds = new List<int>();

            foreach (var preference in preferences)
            {
                var existingPreference = existingPreferences.FirstOrDefault(r => r.Report_Type_ID == preference.ReportTypeId);

                if (existingPreference != null)
                {
                    matchedReportTypeIds.Add(preference.ReportTypeId);  // Track matched IDs

                    // Update the interval if it has changed
                    if (existingPreference.Report_Interval_ID != preference.IntervalId)
                    {
                        existingPreference.Report_Interval_ID = preference.IntervalId;
                        _dbContext.employeeReports.Update(existingPreference);
                        await _jobScheduler.ScheduleReportJob(existingPreference);
                    }
                }
                else
                {
                    // Add new preference if not found in existing preferences
                    var newPreference = new EmployeeReport
                    {
                        Employee_ID = userId,
                        Report_Type_ID = preference.ReportTypeId,
                        Report_Interval_ID = preference.IntervalId,
                        Report_Date_Created = DateTime.UtcNow,
                        Report_Title = $"User Report {preference.ReportTypeId}",
                        Report_Description = "User configured report",
                        NextDueDate = DateTime.UtcNow.AddMinutes(1),
                    };
                    _dbContext.employeeReports.Add(newPreference);
                }
            }

            // Identify and delete preferences that were not matched
            var preferencesToDelete = existingPreferences.Where(ep => !matchedReportTypeIds.Contains(ep.Report_Type_ID)).ToList();
            foreach (var preferenceToDelete in preferencesToDelete)
            {
                _dbContext.employeeReports.Remove(preferenceToDelete);
                await _jobScheduler.UnscheduleReportJob(preferenceToDelete.Report_ID);
            }

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while saving your preferences. Please try again.");
            }

            return Ok("Preferences updated successfully.");
        }



        [HttpDelete]
        public async Task<ActionResult> DeleteUserReportPreferences([FromBody] List<int> reportTypeIds)
        {
            var userId = Guid.Parse(httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var preferencesToDelete = await _dbContext.employeeReports
                .Where(r => r.Employee_ID == userId && reportTypeIds.Contains(r.Report_Type_ID))
                .ToListAsync();

            _dbContext.employeeReports.RemoveRange(preferencesToDelete);
            await _dbContext.SaveChangesAsync();

            // Unschedule the jobs
            foreach (var preference in preferencesToDelete)
            {
                await _jobScheduler.UnscheduleReportJob(preference.Report_ID);
            }

            return Ok();
        }



    }
}

