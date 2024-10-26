using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Repositries;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        private readonly dataDbContext context;
        private readonly IMethodsRepo repo;

        public RequestController(dataDbContext _context, IMethodsRepo _repo)
        {
            context = _context;
            repo = _repo;
        }

        [HttpPut("AcceptAccountRequest/{requestId}")]
        public async Task<IActionResult> AcceptRequest(int requestId)
        {
            var result = await repo.AcceptAccountRequest(requestId);

            return Ok(result);
        }

        [HttpPut("DenyAccountRequest/{requestId}")]
        public async Task<IActionResult> DenyRequest(int requestId)
        {
            var result = await context.User_Account_Requests.Where(e => e.Request_ID == requestId).ExecuteDeleteAsync();
            return Ok(result);
        }
    }
}
