using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Team04_API.Data;
using Team04_API.Models;
using Team04_API.Models.Ticket;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Team04_API.Models.DTOs;
using Team04_API.Models.Users;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EscalationRequestsController : ControllerBase
    {
        private readonly dataDbContext _context;

        public EscalationRequestsController(dataDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetEscalationRequests")]
        public async Task<IActionResult> GetEscalationRequests()
        {
            try
            {
                var escalations = await _context.TicketEscalation
                    .Include(te => te.PreviousEmployee)
                    .Include(te => te.Ticket)
                    .ThenInclude(t => t.Priority)
                    .Include(te => te.Ticket)
                    .ThenInclude(t => t.Tag)
                    .Where(te => te.New_Employee_ID == null) // Filter out accepted requests
                    .Select(te => new EscalationRequestDto
                    {
                        EscalationId = te.Escalation_ID,
                        TicketId = te.Ticket_ID,
                        PreviousEmployeeName = te.PreviousEmployee.User_Name,
                        PreviousEmployeeSurname = te.PreviousEmployee.User_Surname,
                        ReasonForEscalation = te.ReasonForEscalation,
                        DateOfEscalation = te.Date_of_Escalation,
                        PriorityName = te.Ticket.Priority.Priority_Name,
                        TagName = te.Ticket.Tag.Tag_Name,
                        TicketDescription = te.Ticket.Ticket_Description,
                        DepartmentId = te.Ticket.Tag.Department_ID // Handle nullable DepartmentId
                    })
                    .ToListAsync();

                return Ok(escalations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        [HttpPost("process")]
        public async Task<IActionResult> ProcessEscalationRequest([FromBody] ProcessEscalationRequestModel model)
        {
            try
            {
                var escalation = await _context.TicketEscalation.FindAsync(model.EscalationId);
                if (escalation == null)
                {
                    return NotFound();
                }

                if (model.Accept)
                {
                    if (model.NewEmployeeId == null)
                    {
                        return BadRequest(new { message = "NewEmployeeId is required when accepting the request." });
                    }

                    var ticket = await _context.Ticket.FindAsync(escalation.Ticket_ID);
                    if (ticket != null)
                    {
                        ticket.Assigned_Employee_ID = model.NewEmployeeId.Value;
                        escalation.New_Employee_ID = model.NewEmployeeId.Value;
                        await _context.SaveChangesAsync();
                    }
                }
                else
                {
                    _context.TicketEscalation.Remove(escalation);
                    await _context.SaveChangesAsync();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        [HttpPost("CreateEscalationRequest")]
        public IActionResult CreateEscalationRequest([FromBody] CreateEscalationRequestModel model)
        {
            try
            {
                var escalation = new TicketEscalation
                {
                    Ticket_ID = model.TicketId,
                    Previous_Employee_ID = model.PreviousEmployeeId,
                    ReasonForEscalation = model.ReasonForEscalation,
                    Date_of_Escalation = model.DateOfEscalation,
                    New_Employee_ID = null // Initially, this will be null until assigned by an admin
                };

                _context.TicketEscalation.Add(escalation);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the error (you can use a logging framework for this)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetEmployeesByDepartment/{departmentId}")]
        public async Task<IActionResult> GetEmployeesByDepartment(int departmentId)
        {
            try
            {
                var employees = await _context.User
                    .Where(u => u.Department_ID == departmentId && (u.Role_ID == 3 || u.Role_ID == 4))
                    .ToListAsync();

                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



    }

    public class CreateEscalationRequestModel
    {
        public int TicketId { get; set; }
        public Guid PreviousEmployeeId { get; set; }
        public string ReasonForEscalation { get; set; }
        public DateTime DateOfEscalation { get; set; }
    }

    public class ProcessEscalationRequestModel
    {
        public int EscalationId { get; set; }
        public bool Accept { get; set; }
        public Guid? NewEmployeeId { get; set; }
    }
}
