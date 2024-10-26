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

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly dataDbContext _context;

        public TagsController(dataDbContext context)
        {
            _context = context;
        }

        // GET: api/Tags
        [HttpGet("GetAllTags")]
        //[Authorize(Roles = "Chatbot, Employee")]
        public async Task<ActionResult<IEnumerable<Tag>>> GetAllTags()
        {
            return await _context.Tag.ToListAsync();
        }

        // GET: api/Tags/5
        [HttpGet("GetTagByID/{id}")]
        //[Authorize(Roles = "Chatbot, Employee")]
        public async Task<ActionResult<Tag>> GetTagByID(int id)
        {
            var tag = await _context.Tag.FindAsync(id);

            if (tag == null)
            {
                return NotFound();
            }

            return tag;
        }

        // PUT: api/Tags/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("UpdateTag/{id}")]
        //[Authorize(Roles = "Chatbot, Employee")]
        public async Task<IActionResult> PutTag(int id, Tag tag)
        {
            if (id != tag.Tag_ID)
            {
                return BadRequest();
            }

            _context.Entry(tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(tag);
        }

        // POST: api/Tags
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("AddTag")]
        //[Authorize(Roles = "Chatbot, Employee")]
        public async Task<ActionResult<Tag>> PostTag(Tag tag)
        {
            _context.Tag.Add(tag);
            await _context.SaveChangesAsync();

            return Ok(tag);
        }

        // DELETE: api/Tags/5
        [HttpDelete("DeleteTag/{id}")]
        //[Authorize(Roles = "Chatbot, Employee")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tag.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tag.Remove(tag);
            await _context.SaveChangesAsync();

            return Ok(tag);
        }

        private bool TagExists(int id)
        {
            return _context.Tag.Any(e => e.Tag_ID == id);
        }
    }
}
