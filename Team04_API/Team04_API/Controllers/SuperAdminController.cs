using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.Audit;
using Team04_API.Models.Department;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Account_Requests;
using Team04_API.Models.Users.Role;
using Team04_API.Models.VDI;
using Team04_API.Repositries;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuperAdminController : ControllerBase
    {
        private readonly dataDbContext context;
        private readonly IMethodsRepo repo;

        public SuperAdminController(dataDbContext _context, IMethodsRepo _repo)
        {
            context = _context;
            repo = _repo;
        }

        [HttpGet("GetAllAdmins")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IEnumerable<User>> GetAllAdmins()
        {
            var result = await repo.GetAllAdmins();

            return result;
        }

        [HttpGet("GetAdminByID{User_ID}")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> GetAdminByID(Guid User_ID)
        {
            var result = await repo.GetAdminById(User_ID);

            return Ok(result);
        }

        [HttpPut("AssignAdmin/{User_ID}")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> AssignAdmin(Guid User_ID)
        {
            var result = await repo.AssignAdmin(User_ID);

            return Ok(result);
        }

        [HttpPut("UpdateAdmin/{User_ID}")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> UpdateAdmin(Guid User_ID, User admin)
        {
            var result = await repo.UpdateAdmin(User_ID, admin);

            return Ok(result);
        }

        [HttpDelete("DeleteAdmin/{User_ID}")]
        public async Task<IActionResult> DeleteAdmin(Guid User_ID)
        {
            var result = await repo.DeleteAdmin(User_ID);

            return Ok(result);
        }

        [HttpGet("GetAllRoles")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IEnumerable<Role>> GetAllRoles()
        {
            var result = await repo.GetAllRoles();

            return result;
        }

        [HttpGet("GetRoleByID/{Role_ID}")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> GetRoleByID(int Role_ID)
        {
            var result = await repo.GetRoleByID(Role_ID);

            return Ok(result);
        }

        [HttpPost("AddRole")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> AddRole(RoleDTO role)
        {
            var result = await repo.AddRole(role);

            return Ok(result);
        }

        [HttpPut("UpdateRole/{Role_ID}")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> UpdateRole(int Role_ID, RoleDTO role)
        {
            var result = await repo.UpdateRole(Role_ID, role);

            return Ok(result);
        }

        [HttpDelete("DeleteRole/{Role_ID}")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IActionResult> DeleteRole(int Role_ID)
        {
            var result = await repo.DeleteRole(Role_ID);

            return Ok(result);
        }

        [HttpGet("GetAllDepartments")]
        public async Task<IEnumerable<Department>> GetAllDepartments()
        {
            return await context.Department.ToListAsync();
        }

        [HttpGet("ViewAdminRequests")]
        public async Task<IEnumerable<AccountRequestDTO>> ViewAdminRequests()
        {
            return await repo.ViewAdminRequests();
        }

        [HttpPut("AcceptAdminRequest/{requestId}")]
        public async Task<IActionResult> AcceptAdminRequest(int requestId)
        {
            var result = await repo.AcceptAccountRequest(requestId);
            return Ok(result);
        }

        [HttpPut("DenyAdminRequest/{requestId}")]
        public async Task<IActionResult> DenyAdminRequest(int requestId)
        {
            var result = await context.User_Account_Requests.Where(e => e.Request_ID == requestId).ExecuteDeleteAsync();
            return Ok(result);
        }

        [HttpGet("ViewAuditLog")]
        public async Task<List<Audit>> ViewAuditLog()
        {
            var result = await context.AuditLogs.ToListAsync();

            return result;
        }

        [HttpPost]
        [Route("ApproveVDIRequest")]
        public async Task<IActionResult> ApproveVDIRequest([FromQuery] int vdiRequestID)
        {
            try
            {
                var vdiRequest = await context.VDI_Request.FirstOrDefaultAsync(r => r.VDI_Request_ID == vdiRequestID);

                if (vdiRequest == null)
                {
                    return NotFound("VDI request not found.");
                }

                var existingRental = await context.Client_VDI
                    .AnyAsync(c => c.Client_ID == vdiRequest.Client_ID && c.VDI_ID == vdiRequest.VDI_ID);

                if (existingRental)
                {
                    return BadRequest("This VDI is already rented by the client.");
                }

                var rentedVDI = new Client_VDI
                {
                    Client_ID = vdiRequest.Client_ID,
                    VDI_ID = vdiRequest.VDI_ID,
                };

                context.Client_VDI.Add(rentedVDI);
                context.VDI_Request.Remove(vdiRequest); 
                await context.SaveChangesAsync();

                return Ok(new { Message = "VDI request approved and VDI rented successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.InnerException?.Message ?? ex.Message}");
            }

        }

        [HttpPut("DenyVDIRequest")]
        public async Task<IActionResult> DenyVDIRequest([FromQuery] int vdiRequestID)
        {
            try
            {
                var vdiRequest = await context.VDI_Request.FirstOrDefaultAsync(r => r.VDI_Request_ID == vdiRequestID);

                if (vdiRequest == null)
                {
                    return NotFound("VDI request not found.");
                }


                context.VDI_Request.Remove(vdiRequest);
                await context.SaveChangesAsync();

                return Ok(new { Message = "VDI request denied successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        [HttpGet("GetAllVDIRequests")]
        public async Task<IActionResult> GetAllVDIRequests()
        {
            var result = await repo.GetAllVDIRequests();
            return Ok(result);
        }

        [HttpGet("GetAllSoftwareRequests")]
        public async Task<IActionResult> GetAllSoftwareRequests()
        {
            var result = await repo.GetAllVDIRequests();
            return Ok(result);
        }

    }
}
