using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Team04_API.Data;
using Team04_API.Models.Ticket;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriorityController : ControllerBase
    {
        private readonly dataDbContext _context;

        public PriorityController(dataDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Priority>>> GetPriorities()
        {
            return await _context.Priority.ToListAsync();
        }

        [HttpPost("UpdateBreachTime")]
        public async Task<IActionResult> UpdateBreachTime([FromBody] Priority priority)
        {
            if (priority == null)
            {
                return BadRequest("Priority is required.");
            }

            var existingPriority = await _context.Priority.FindAsync(priority.Priority_ID);
            if (existingPriority == null)
            {
                return NotFound();
            }

            existingPriority.BreachTime = priority.BreachTime;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}