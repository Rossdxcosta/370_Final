using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.Software;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SoftwareController : ControllerBase
    {
        private readonly dataDbContext _context;

        public SoftwareController(dataDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("CreateSoftware")]
        public async Task<Software> CreateSoftware(Software software)
        {
            try
            {
                await _context.Software.AddAsync(software);
                await _context.SaveChangesAsync();

                return software;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("GetAllSoftware")]
        public async Task<IEnumerable<Software>> GetAllSoftware()
        {
            return await _context.Software.ToListAsync();
        }

        [HttpPut]
        [Route("UpdateSoftware")]
        public async Task<Software> UpdateSoftware(Software updatedSoftware)
        {
            try
            {
                var software = await _context.Software.FindAsync(updatedSoftware.Software_ID);
                software.Software_Name = updatedSoftware.Software_Name;
                software.Software_Description = updatedSoftware.Software_Description;

                await _context.SaveChangesAsync();

                return software;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpDelete]
        [Route("DeleteSoftware/{id}")]
        public async Task<IActionResult> DeleteSoftware(int id)
        {
            try
            {
                _context.Software.Where(e => e.Software_ID == id).ExecuteDelete();
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("RequestSoftware")]
        public async Task<IActionResult> RequestSoftware(int softID, Guid clientID)
        {
            try
            {
                var existingRequest = await _context.Software_Request
                    .FirstOrDefaultAsync(r => r.Client_ID == clientID && r.Software_ID == softID);

                if (existingRequest != null)
                {
                    return BadRequest("You have already requested this software.");
                }

                var result = await _context.Software_Request.AddAsync(
                    new Software_Request { Client_ID = clientID, Software_ID = softID, Request_Date = DateTime.UtcNow }
                );
                await _context.SaveChangesAsync();

                return Ok(result);
            }
            catch (Exception)
            {
                throw; 
            }
        }


    }
}
