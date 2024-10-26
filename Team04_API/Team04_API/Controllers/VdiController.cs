using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.VDI;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VdiController : ControllerBase
    {
        private readonly dataDbContext _context;

        public VdiController(dataDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VDI>> GetVDIById(int id)
        {
            var vdi = await _context.VDI.FindAsync(id);

            if (vdi == null)
            {
                return NotFound();
            }

            return vdi;
        }

        [HttpPost]
        [Route("CreateVDI")]
        public async Task<ActionResult<VDI>> CreateVDI(VDI vdi)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _context.VDI.AddAsync(vdi);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetVDIById), new { id = vdi.VDI_ID }, vdi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetAllVDI")]
        public async Task<ActionResult<IEnumerable<VDI>>> GetAllVDI()
        {
            try
            {
                var vdis = await _context.VDI.ToListAsync();
                return Ok(vdis);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetAllVDITypes")]
        public async Task<ActionResult<IEnumerable<VDI_Type>>> GetAllVDITYPES()
        {
            try
            {
                var types = await _context.VDI_Type.ToListAsync();
                return Ok(types);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("UpdateVDI/{id}")]
        public async Task<IActionResult> UpdateVDI(int id, VDI updatedVDI)
        {
            if (id != updatedVDI.VDI_ID)
            {
                return BadRequest();
            }

            _context.Entry(updatedVDI).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VDIExists(id))
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

        private bool VDIExists(int id)
        {
            return _context.VDI.Any(e => e.VDI_ID == id);
        }

        [HttpDelete]
        [Route("DeleteVDI/{id}")]
        public async Task<IActionResult> DeleteVDI(int id)
        {
            try
            {
                var vdi = await _context.VDI.FindAsync(id);
                if (vdi == null)
                {
                    return NotFound();
                }

                _context.VDI.Remove(vdi);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

       

        [HttpPost]
        [Route("RequestVDI")]
        public async Task<IActionResult> RequestVDI([FromQuery] int vdiID, [FromQuery] Guid clientID)
        {
            try
            {
                var userExists = _context.User.Any(u => u.User_ID == clientID);
                if (!userExists)
                {
                    return BadRequest("Invalid clientID: No corresponding user found.");
                }

                Console.WriteLine($"Received vdiID: {vdiID}, clientID: {clientID}");

                var existingRental = await _context.VDI_Request
                    .AnyAsync(r => r.Client_ID == clientID && r.VDI_ID == vdiID);

                if (existingRental)
                {
                    return BadRequest("You are already renting this VDI.");
                }

                var vdiRequest = new VDI_Request
                {
                    Client_ID = clientID,
                    VDI_ID = vdiID,
                    Request_Date = DateTime.UtcNow
                };
                await _context.VDI_Request.AddAsync(vdiRequest);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "VDI request created successfully", VDI_Request_ID = vdiRequest.VDI_Request_ID });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        [HttpPost]
        [Route("CheckClientVDIOwnership")]
        public async Task<IActionResult> CheckClientVDIOwnership([FromBody] CheckOwnershipRequest request)
        {
            try
            {
                if (request.ClientID == Guid.Empty || request.VDIID <= 0)
                {
                    return BadRequest("Invalid client ID or VDI ID.");
                }

                var ownershipExists = await _context.Client_VDI
                    .AnyAsync(c => c.Client_ID == request.ClientID && c.VDI_ID == request.VDIID);

                return Ok(new { IsOwned = ownershipExists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }
    }
}
