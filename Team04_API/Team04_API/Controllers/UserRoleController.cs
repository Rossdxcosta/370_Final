using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Models;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Role;
using Team04_API.Repositries;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly IMethodsRepo _repo;

        public UserRoleController(IMethodsRepo repo)
        {
            _repo = repo;
        }

        //GET ROLE BY ID
        [HttpGet]
        public async Task<IActionResult> GetRoleByID(int Role_ID)
        {
            try
            {
                var result = await _repo.GetRoleByID(Role_ID);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        //GET ALL ROLES
        [HttpGet("GetAllRoles")]
        /*[Authorize(Roles = "SuperAdmin")]*/
        public async Task<IEnumerable<Role>> GetAllRoles()
        {
            var result = await _repo.GetAllRoles();

            return result;
        }

        //GET ALL USERS
        [HttpGet("GetAllUsers")]
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var result = await _repo.GetAllUsers();
            return result;
        }

        //REMOVE ROLE
        [HttpPut("RemoveUserRole")]
        public async Task<IActionResult> RemoveUserRole([FromBody] RemoveUserRoleRequest request)
        {
            if (request == null || request.UserId == Guid.Empty)
            {
                return BadRequest("Invalid request data.");
            }

            var result = await _repo.RemoveUserRole(request.UserId);
            if (result)
            {
                return Ok("User role removed successfully.");
            }
            else
            {
                return StatusCode(500, "An error occurred while removing the user role.");
            }
        }

        //UPDATE ROLE
        [HttpPut("UpdateUserRole")]
        public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleRequest request)
        {
            if (request == null || request.UserId == Guid.Empty || request.RoleId <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            var result = await _repo.UpdateUserRole(request.UserId, request.RoleId);
            if (result)
            {
                return Ok("User role updated successfully.");
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the user role.");
            }
        }
    }

    public class UpdateUserRoleRequest
    {
        public Guid UserId { get; set; }
        public int RoleId { get; set; }
    }
    public class RemoveUserRoleRequest
    {
        public Guid UserId { get; set; }
    }

}

