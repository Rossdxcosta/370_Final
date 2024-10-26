using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Account_Requests;
using Team04_API.Repositries;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly dataDbContext _context;
        private readonly IMethodsRepo _repo;
        private readonly IUserMethods userMethods;

        public UsersController(dataDbContext context, IMethodsRepo repo, IUserMethods userMethods)
        {
            _context = context;
            _repo = repo;
            this.userMethods = userMethods;
        }

        // GET: api/Users/GetAllUsers
        [HttpGet("GetAllUsers")]
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _repo.GetAllUsers();
        }

        // GET: api/Users/GetUserByID/5
        [HttpGet("GetUserByID/{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser(UserDTO user)
        {

            var response = await _repo.RegisterUser(user);
            return Ok(response);
        }

        [HttpPost("DeactivateRequest")]
        public async Task<IActionResult> DeactivateRequest(DeactivationRequestDTO deactivationtRequestDTO)
        {

            var response = await _repo.RequestDeactivateAccount(deactivationtRequestDTO);
            return Ok(response);
        }

        [HttpPost("DeactivateAccount/{UserID}")]
        public async Task<IActionResult> DeactivateAccount(Guid UserID)
        {

            var response = await _repo.DeActivateUser(UserID);
            return Ok(response);
        }

        [HttpGet("ViewAllDeactivationRequests")]
        public async Task<IActionResult> ViewAllDeactivationRequests()
        {

            var response = await _repo.ViewDeactivationRequests();
            return Ok(response);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDTO user)
        {
            var response = await _repo.Login(user);
            return Ok(response);
        }

        //ADD ACOUNT REQUEST
        [HttpPost("AddUserAccountRequest")]
        public async Task<User_Account_Requests> CreateAccountRequest(User_Account_Requests request)
        {
            return await _repo.CreateAccountRequest(request);
        }

        [HttpGet("GetAllAccountRequests")]
        public async Task<IEnumerable<AccountRequestDTO>> GetAccountRequests()
        {
            var all_requests = await _context.User_Account_Requests.Where(e => e.Request_Type_ID == 1).Include(e => e.user).Include(e => e.Role).ToListAsync();

            List<AccountRequestDTO> filtered_requests = new List<AccountRequestDTO>();

            foreach (var request in all_requests)
            {
                if (request != null && request.Role_ID != 4 && request.Role_ID != 5)
                {
                    filtered_requests.Add( new AccountRequestDTO { request = request, currentUserRole = await _context.User.Where(e => e.User_ID == request.User_ID).Select(e => e.role).FirstAsync() });
                }
            }

            return filtered_requests;
        }

        [HttpGet("GetLanguages")]
        public async Task<ActionResult<IEnumerable<Language>>> GetLanguage()
        {
            return await _context.Language.ToListAsync();
        }

        [HttpGet("GetTitles")]
        public async Task<ActionResult<IEnumerable<Title>>> GetTitles()
        {
            return await _context.Title.ToListAsync();
        }

        
        private bool UserExists(Guid id)
        {
            return _context.User.Any(e => e.User_ID == id);
        }

        [HttpPost("CheckPassword")]
        public async Task<IActionResult> CheckPassword(LoginDTO login)
        {
            return Ok(await userMethods.CheckPassword(login));
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO cPass)
        {
            return Ok(await userMethods.ChangePassword(cPass));
        }

        [HttpPost("CheckOtp")]
        public async Task<IActionResult> CheckOtp(LoginDTO loginDTO)
        {
            return Ok(await userMethods.CheckOtp(loginDTO));
        }

        [HttpPost("SendOtp")]
        public async Task<IActionResult> SendOtp(LoginDTO loginDTO)
        {
            return Ok(await userMethods.SendOtp(loginDTO));
        }

        [HttpPost("SendCEOtp")]
        public async Task<IActionResult> SendCEOtp(LoginDTO loginDTO)
        {
            return Ok(await userMethods.SendCEOtp(loginDTO));
        }

        [HttpPost("ReactivateAccount")]
        public async Task<IActionResult> ReactivateAccount(LoginDTO loginDTO)
        {
            return Ok(await userMethods.ReactivateAccount(loginDTO));
        }

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UpdateUserDTO updateUserDTO)
        {
            return Ok(await userMethods.UpdateUser(updateUserDTO));
        }
    }
}
