using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.Ticket;
using Microsoft.AspNetCore.Authorization;
using Team04_API.Repositries;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Models.DTOs;
using Team04_API.Models.Department;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly dataDbContext _context;
        private readonly IMethodsRepo _repo;


        public TicketsController(dataDbContext context, IMethodsRepo repo)
        {
            _repo = repo;
            _context = context;
        }

        // Get all tickets
        /*[HttpGet("GetAllTickets")]
        public async Task<IEnumerable<Ticket>> GetAllTickets()
        {
            return await _repo.GetAllTickets();
        }*/ //Iactionresult below
        // Get all tickets
        [HttpGet("GetAllTickets")]
        public async Task<IActionResult> GetAllTickets()
        {
            return await _repo.GetAllTickets();
        }

        // Get a ticket
        [HttpGet("GetTicketByID/{id}")]
        public async Task<ActionResult<Ticket>> GetTicketByID(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
        }

        //Get all logged in client tickets
        [HttpGet("GetTicketsByClientId/{clientId}")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTicketsByClientId(Guid clientId)
        {
            var tickets = await _repo.GetTicketsByClientId(clientId);
            if (tickets == null || !tickets.Any())
            {
                return NotFound();
            }

            return Ok(tickets);
        }

        [HttpGet("GetAllDepartments")]
        public async Task<IEnumerable<Department>> GetAllDepartments()
        {
            return await _context.Department.ToListAsync();
        }
        
        [HttpPut("UpdateTicket/{id}")]
        public async Task<IActionResult> PutTicket(int id, Ticket ticket)
        {
            var currentTicket = await _context.Ticket
                .Include(t => t.ToDoLists)
                .Include(t => t.ToDoListItems)
                .FirstOrDefaultAsync(t => t.Ticket_ID == id);

            if (currentTicket == null)
            {
                return NotFound();
            }

            // Check if status has changed
            if (currentTicket.Ticket_Status_ID != ticket.Ticket_Status_ID)
            {
                await _context.Ticket_Updates.AddAsync(new Ticket_Updates
                {
                    Ticket_ID = id,
                    Ticket_Status_Old_ID = currentTicket.Ticket_Status_ID,
                    Ticket_Status_New_ID = ticket.Ticket_Status_ID,
                    DateOfChange = DateTime.UtcNow,
                    hasBeenDismissed = false
                });
            }

            // Update only mutable properties
            currentTicket.Assigned_Employee_ID = ticket.Assigned_Employee_ID;
            currentTicket.Tag_ID = ticket.Tag_ID;
            currentTicket.Priority_ID = ticket.Priority_ID;
            currentTicket.Ticket_Status_ID = ticket.Ticket_Status_ID;
            currentTicket.Ticket_Description = ticket.Ticket_Description;
            currentTicket.Ticket_Date_Resolved = ticket.Ticket_Date_Resolved;
            currentTicket.Ticket_Subscription = ticket.Ticket_Subscription;
            if (currentTicket.Ticket_Status_ID == 3)
            {
                currentTicket.isOpen = false;
            }
            else if(currentTicket.Ticket_Status_ID == 4)
            {
                currentTicket.isOpen = true;
                currentTicket.Ticket_Date_Created = DateTime.UtcNow;
            }


            // Handle ToDoLists
            if (ticket.ToDoLists != null){
                foreach (var toDoList in ticket.ToDoLists)
                {
                    var existingToDoList = currentTicket.ToDoLists.FirstOrDefault(t => t.To_do_List_ID == toDoList.To_do_List_ID);
                    if (existingToDoList != null)
                    {
                        existingToDoList.Item_Description = toDoList.Item_Description;
                        existingToDoList.Is_Completed = toDoList.Is_Completed;
                    }
                    else
                    {
                        currentTicket.ToDoLists.Add(toDoList);
                    }
                }

                // Handle ToDoListItems
                foreach (var toDoListItem in ticket.ToDoListItems)
                {
                    var existingToDoListItem = currentTicket.ToDoListItems.FirstOrDefault(i => i.To_Do_Note_ID == toDoListItem.To_Do_Note_ID);
                    if (existingToDoListItem != null)
                    {
                        existingToDoListItem.Note_Description = toDoListItem.Note_Description;
                    }
                    else
                    {
                        currentTicket.ToDoListItems.Add(toDoListItem);
                    }
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool TicketExists(int id)
        {
            return _context.Ticket.Any(e => e.Ticket_ID == id);
        }


        /*[HttpPost("AddTicket")]
        public async Task<Ticket> AddTicket(Ticket ticket)
        {
            return await _Repo.AddTicket(ticket);
        }*/

        [HttpPost("AddTicket")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> AddTicket(TicketDTO ticket)
        {
            var result = await _repo.AddTicket(ticket);

            return Ok(result);
        }


        // Delete Ticket
        [HttpDelete("DeleteTicket/{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Ticket.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("SearchTickets")]
        public async Task<IActionResult> SearchTickets([FromQuery] string userId, [FromQuery] string? status, [FromQuery] string? dateCreated)
        {
            if (Guid.TryParse(userId, out Guid parsedUserId))
            {
                DateTime? parsedDate = null;
                if (!string.IsNullOrEmpty(dateCreated))
                {
                    if (DateTime.TryParse(dateCreated, out DateTime tempDate))
                    {
                        parsedDate = tempDate.Date;
                    }
                }

                return await _repo.SearchTickets(parsedUserId, status, parsedDate);
            }
            return BadRequest("Invalid user ID");
        }

        // ------------------------------------------------------------------------------------- Reassign Ticket
        [HttpPut("ReassignTicket/{id}")]
        public async Task<IActionResult> ReassignTicket(int id, [FromBody] ReassignTicketModel model)
        {
            var ticket = await _context.Ticket.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Assigned_Employee_ID = model.NewAssignedEmployeeId;

            _context.Entry(ticket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }



        // Update Ticket Priority
        [HttpPut("UpdateTicketPriority/{id}")]
        public async Task<IActionResult> UpdateTicketPriority(int id, [FromBody] UpdateTicketPriorityModel model)
        {
            var ticket = await _context.Ticket.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Priority_ID = model.NewPriorityId;

            _context.Entry(ticket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }




        // ---------------------------------------------------------------------------------- Get all priorities
        [HttpGet("GetAllPriorities")]
        public async Task<ActionResult<IEnumerable<Priority>>> GetAllPriorities()
        {
            return await _context.Priority.ToListAsync();
        }

        // ---------------------------------------------------------------------------------- Get all ticket statuses
        [HttpGet("GetAllTicketStatuses")]
        public async Task<ActionResult<IEnumerable<Ticket_Status>>> GetAllTicketStatuses()
        {
            return await _context.Ticket_Status.ToListAsync();
        }

        // ---------------------------------------------------------------------------------- Get Ticket Updates
        [HttpGet("GetTicketUpdatesByUserId/{clientId}")]
        public async Task<ActionResult<IEnumerable<Ticket_Updates>>> GetTicketUpdatesByUserId(Guid clientId)
        {
            return await _context.Ticket_Updates.Where(c => c.ticket.Client_ID == clientId).ToListAsync(); 
        }

        // ---------------------------------------------------------------------------------- Change has been dismissed
        [HttpPut("UpdateTicketNotifications/{id}")]
        public async Task<IActionResult> UpdateTicketNotifications(int id, [FromBody] Ticket_Updates ticketUpdates)
        {
            if (id != ticketUpdates.Ticket_Update_ID)
            {
                return BadRequest();
            }

            var update = await _context.Ticket_Updates.FindAsync(id);

            if (update == null)
            {
                return NotFound();
            }

            update.hasBeenDismissed = ticketUpdates.hasBeenDismissed;

            _context.Entry(update).CurrentValues.SetValues(ticketUpdates);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketUpdateExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool TicketUpdateExists(int id)
        {
            return _context.Ticket_Updates.Any(e => e.Ticket_Update_ID == id);
        }



        /*
         [HttpGet("GetTicketsByClientId/{clientId}")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTicketsByClientId(Guid clientId)
        {
            var tickets = await _repo.GetTicketsByClientId(clientId);
            if (tickets == null || !tickets.Any())
            {
                return NotFound();
            }

            return Ok(tickets);
        }
         */

        public class UpdateTicketPriorityModel
        {
            public int NewPriorityId { get; set; }
        }

        public class ReassignTicketModel
        {
            public Guid? NewAssignedEmployeeId { get; set; }
        }
    }
}
