using Microsoft.EntityFrameworkCore;
using Quartz;
using Team04_API.Data;
using Team04_API.Models.Report;
using Team04_API.Repositries;

namespace Team04_API.Services
{
    public interface IReportService
    {
        
    }
    public class GroupedReportJob : IJob
    {
        private readonly IReportingMethod _reportService;
        private readonly dataDbContext _dbContext;

        public GroupedReportJob(IReportingMethod reportService, dataDbContext dbContext)
        {
            _reportService = reportService;
            _dbContext = dbContext;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            // Get all reports due in the next hour (or whatever time frame you choose)
            var now = DateTime.UtcNow;
            var oneHourLater = now.AddHours(1);

            var dueReports =  _dbContext.employeeReports
                .Where(r => r.NextDueDate <= oneHourLater).Include(a => a.Report_Interval).Include(a => a.Report_Type)
                .ToList();

            await _reportService.GenerateGroupedReport(dueReports);

           /* foreach (var employeeReports in dueReports)
            {
                var employeeID = employeeReports.Key;
                var reportIds = employeeReports.Select(r => r.Report_ID).ToList();
                await _reportService.GenerateAndSendGroupedReports(employeeReports, );

                // Update NextDueDate for each report
                foreach (var report in employeeReports)
                {
                    report.NextDueDate = report.NextDueDate.AddDays(report.Report_Interval.Report_Interval_Value);
                }
            }*/

            await _dbContext.SaveChangesAsync();
        }
    }

    public class SendReportJob(IReportingMethod reportingMethod) : IJob
    {
        private readonly IReportingMethod reportingMethod = reportingMethod;

        public async Task Execute(IJobExecutionContext context)
        {
            JobDataMap datamap = context.JobDetail.JobDataMap;
            int reportId = datamap.GetInt("ReportId");

            //await reportingMethod.GernerateReport("Report ID");
            //await reportingMethod.GernerateReport();
        }
    }

    public class DynamicJobSchedulerService
    {
        private readonly ISchedulerFactory _schedulerFactory;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public DynamicJobSchedulerService(ISchedulerFactory schedulerFactory, IServiceScopeFactory serviceScopeFactory)
        {
            _schedulerFactory = schedulerFactory;
            _serviceScopeFactory = serviceScopeFactory;
        }
        public async Task LoadAndScheduleReports()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<dataDbContext>();

           /* var reports = await dbContext.employeeReports.Include(c => c.Report_Interval).Include(c => c.Report_Type).ToListAsync();
            Console.WriteLine($"This is some delicious placeholder text");

            foreach (var report in reports)
            {
                await ScheduleReportJob(report);
            }

            await ScheduleGroupedReportJob();*/
        }

        public async Task ScheduleReportJob(EmployeeReport report)
        {
            IScheduler scheduler = await _schedulerFactory.GetScheduler();

            string jobKey = $"ReportJob_{report.Report_ID}";
            string triggerKey = $"ReportTrigger_{report.Report_ID}";

            JobDataMap jobDataMap = new JobDataMap
    {
        { "ReportId", report.Report_ID }
    };

            // Check if the job already exists
            var existingJob = await scheduler.GetJobDetail(new JobKey(jobKey));

            if (existingJob != null)
            {
                // If the job exists, delete it and its associated triggers
                await scheduler.DeleteJob(new JobKey(jobKey));
            }

            // Create a new job
            IJobDetail job = JobBuilder.Create<SendReportJob>()
                .WithIdentity(jobKey)
                .SetJobData(jobDataMap)
                .Build();

            // Default to daily if interval is not set
            int intervalInHours = 24;

            if (report.Report_Interval != null && report.Report_Interval.Report_Interval_Value > 0)
            {
                intervalInHours = report.Report_Interval.Report_Interval_Value * 24;
            }

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity(triggerKey)
                .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInHours(intervalInHours)
                    .RepeatForever())
                .Build();

            await scheduler.ScheduleJob(job, trigger);
        }

        public async Task UnscheduleReportJob(int reportId)
        {
            IScheduler scheduler = await _schedulerFactory.GetScheduler();
            await scheduler.UnscheduleJob(new TriggerKey($"ReportTrigger_{reportId}"));
        }

        public async Task ScheduleGroupedReportJob()
        {
            IScheduler scheduler = await _schedulerFactory.GetScheduler();

            IJobDetail job = JobBuilder.Create<GroupedReportJob>()
                .WithIdentity("GroupedReportJob")
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("GroupedReportTrigger")
                .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInMinutes(1)  // Run every 15 minutes
                    .RepeatForever())
                .Build();

            await scheduler.ScheduleJob(job, trigger);
        }
    }

    public class ReportManagementService
    {
        private readonly dataDbContext _dbContext;
        private readonly DynamicJobSchedulerService _jobScheduler;

        public ReportManagementService(dataDbContext dbContext, DynamicJobSchedulerService jobScheduler)
        {
            _dbContext = dbContext;
            _jobScheduler = jobScheduler;
        }

        public async Task CreateRecurringReport(EmployeeReport report)
        {
            report.NextDueDate = DateTime.UtcNow.AddDays(report.Report_Interval.Report_Interval_Value);
            _dbContext.employeeReports.Add(report);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateRecurringReport(EmployeeReport report)
        {
            report.NextDueDate = DateTime.UtcNow.AddDays(report.Report_Interval.Report_Interval_Value);
            _dbContext.employeeReports.Update(report);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteRecurringReport(int reportId)
        {
            var report = await _dbContext.employeeReports.FindAsync(reportId);
            if (report != null)
            {
                _dbContext.employeeReports.Remove(report);
                await _dbContext.SaveChangesAsync();

                await _jobScheduler.UnscheduleReportJob(reportId);
            }
        }


    }
}
