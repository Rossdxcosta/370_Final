using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team04_API.Models.Ticket;
using Team04_API.Data;
using Team04_API.Models.DTOs;
using System.Text.Json;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketGroupController : ControllerBase
    {
        private readonly dataDbContext _context;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public TicketGroupController(dataDbContext context)
        {
            _context = context;
            _jsonSerializerOptions = new JsonSerializerOptions
            {
                // Configure the serializer to handle reference loops
                ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve,
                WriteIndented = true // Optional: For better readability in debugging
            };
        }

        // Get all ticket groups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketGroupDTO>>> GetAllTicketGroups()
        {
            var ticketGroups = await _context.TicketGroup
                .Select(tg => new TicketGroupDTO
                {
                    TicketGroup_ID = tg.TicketGroup_ID,
                    Name = tg.Name,
                    Description = tg.Description,
                    DateCreated = tg.DateCreated,
                    Tickets = tg.Tickets.Select(t => new TicketDTO
                    {
                        Ticket_ID = t.Ticket_ID,
                        Client_ID = t.Client_ID,
                        Tag_ID = t.Tag_ID,
                        Priority_ID = t.Priority_ID,
                        Ticket_Status_ID = t.Ticket_Status_ID,
                        Ticket_Status_Name = t.Ticket_Status.Status_Name,
                        Ticket_Description = t.Ticket_Description,
                        Ticket_Date_Created = t.Ticket_Date_Created,
                        Ticket_Subscription = t.Ticket_Subscription
                    }).ToList()
                })
                .ToListAsync();

            return Ok(ticketGroups);
        }

        // Get ticket group
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketGroupDTO>> GetTicketGroup(int id)
        {
            try
            {
                var ticketGroupDTO = await _context.TicketGroup
                    .Where(tg => tg.TicketGroup_ID == id)
                    .Select(tg => new TicketGroupDTO
                    {
                        TicketGroup_ID = tg.TicketGroup_ID,
                        Name = tg.Name,
                        Description = tg.Description,
                        DateCreated = tg.DateCreated,
                        Tickets = tg.Tickets.Select(t => new TicketDTO
                        {
                            Ticket_ID = t.Ticket_ID,
                            Client_ID = t.Client_ID,
                            Tag_ID = t.Tag_ID,
                            Priority_ID = t.Priority_ID,
                            Ticket_Status_ID = t.Ticket_Status_ID,
                            Ticket_Status_Name = t.Ticket_Status.Status_Name,
                            Ticket_Description = t.Ticket_Description,
                            Ticket_Date_Created = t.Ticket_Date_Created,
                            Ticket_Subscription = t.Ticket_Subscription
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (ticketGroupDTO == null)
                {
                    return NotFound();
                }

                return Ok(ticketGroupDTO);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in GetTicketGroup: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{groupId}/Tickets")]
        public async Task<ActionResult<IEnumerable<TicketDTO>>> GetTicketsByGroupId(int groupId)
        {
            var ticketGroup = await _context.TicketGroup
                .Include(tg => tg.Tickets)
                .Where(tg => tg.TicketGroup_ID == groupId)
                .Select(tg => new TicketGroupDTO
                {
                    Tickets = tg.Tickets.Select(t => new TicketDTO
                    {
                        Ticket_ID = t.Ticket_ID,
                        Client_ID = t.Client_ID,
                        Tag_ID = t.Tag_ID,
                        Priority_ID = t.Priority_ID,
                        Ticket_Status_ID = t.Ticket_Status_ID,
                        Ticket_Status_Name = t.Ticket_Status.Status_Name,
                        Ticket_Description = t.Ticket_Description,
                        Ticket_Date_Created = t.Ticket_Date_Created,
                        Ticket_Subscription = t.Ticket_Subscription
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (ticketGroup == null)
            {
                return NotFound();
            }

            return Ok(ticketGroup.Tickets);
        }

        // Add ticket group
        [HttpPost]
        public async Task<ActionResult<TicketGroup>> AddTicketGroup(TicketGroup ticketGroup)
        {
            _context.TicketGroup.Add(ticketGroup);
            await _context.SaveChangesAsync();

            // Return the created resource
            return CreatedAtAction(nameof(GetTicketGroup), new { id = ticketGroup.TicketGroup_ID }, ticketGroup);
        }

        // Update ticket group
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicketGroup(int id, TicketGroup ticketGroup)
        {
            if (id != ticketGroup.TicketGroup_ID)
            {
                return BadRequest();
            }

            _context.Entry(ticketGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketGroupExists(id))
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

        // Delete ticket group
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicketGroup(int id)
        {
            var ticketGroup = await _context.TicketGroup.FindAsync(id);
            if (ticketGroup == null)
            {
                return NotFound();
            }

            _context.TicketGroup.Remove(ticketGroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Add ticket to ticket group
        [HttpPost("{groupId}/AddTicket/{ticketId}")]
        public async Task<IActionResult> AddTicketToGroup(int groupId, int ticketId)
        {
            var ticketGroup = await _context.TicketGroup
                .Include(tg => tg.Tickets)
                .FirstOrDefaultAsync(tg => tg.TicketGroup_ID == groupId);
            var ticket = await _context.Ticket.FindAsync(ticketId);

            if (ticketGroup == null || ticket == null)
            {
                return NotFound();
            }

            if (ticketGroup.Tickets.Any(t => t.Ticket_ID == ticketId))
            {
                return BadRequest("Ticket already in the group.");
            }

            ticketGroup.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Remove ticket from ticket group
        [HttpPost("{groupId}/RemoveTicket/{ticketId}")]
        public async Task<IActionResult> RemoveTicketFromGroup(int groupId, int ticketId)
        {
            // Find the ticket group and ticket
            var ticketGroup = await _context.TicketGroup
                .Include(tg => tg.Tickets)
                .FirstOrDefaultAsync(tg => tg.TicketGroup_ID == groupId);
            var ticket = await _context.Ticket.FindAsync(ticketId);

            if (ticketGroup == null || ticket == null)
            {
                return NotFound();
            }

            // Check if the ticket is in the group
            var ticketToRemove = ticketGroup.Tickets.FirstOrDefault(t => t.Ticket_ID == ticketId);
            if (ticketToRemove == null)
            {
                return BadRequest("Ticket not found in the group.");
            }

            // Remove the ticket from the group
            ticketGroup.Tickets.Remove(ticketToRemove);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool TicketGroupExists(int id)
        {
            return _context.TicketGroup.Any(e => e.TicketGroup_ID == id);
        }
    }
}
