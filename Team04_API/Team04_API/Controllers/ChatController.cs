using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Team04_API.Data;
using Team04_API.Models.Chatbot;
using Team04_API.Models.DTOs.MessageDTO;
using Team04_API.Models.Users;
using Team04_API.Repositries;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatMethods chatMethods;
        private readonly dataDbContext dbContext;
        private readonly IReportingMethod reportingMethods;
        private readonly IAnomalyDetection anomalyDetection;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ChatController(IChatMethods chatMethods, dataDbContext dbContext, IReportingMethod reportingMethods, IAnomalyDetection anomalyDetection, IHttpContextAccessor httpContextAccessor) {
            this.chatMethods = chatMethods;
            this.dbContext = dbContext;
            this.reportingMethods = reportingMethods;
            this.anomalyDetection = anomalyDetection;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("TestGPT")]
        public void TestGPT()
        {
            anomalyDetection.CheckAnomaly();
        }

        [HttpGet("TestAnomalystuff")]
        public async Task<IActionResult> Testanomaly()
        {
            return Ok(await dbContext.GetAnomalyReport());
        }

        [HttpGet("GETPDF")]
        public Task<IResult> GetPDF()
        {
            return reportingMethods.GernerateReport();
        }


        [HttpGet("StartChat/{userEmail}")]
        public async Task<IActionResult> StartChat(Guid userEmail)
        {
           
            return await chatMethods.StartChat(userEmail);

        }

        [HttpPost("SendMessage")]
        public async Task<IActionResult> SendMessage(MessagesDTO messagesDTO)
        {
            return await chatMethods.SaveChatMessages(messagesDTO);
        }

        [HttpPut("ClaimChat")]
        public async Task<IActionResult> ClaimChat(ClaimChatDTO claimChat)
        {
            return await chatMethods.HandOverToAgent(claimChat);
        }

        [HttpGet("GetOpenLogs")]
        public async Task<List<Chatbot_Log>> GetOpenLogs()
        {
            return await chatMethods.Getlogs();
        }

        [HttpGet("GetClientLogs")]
        public async Task<List<Chatbot_Log>> GetClientLogs()
        {
            return await chatMethods.GetClientLogs(Guid.Parse(httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value));
        }

        [HttpGet("GetEmployeeLogs")]
        public async Task<List<Chatbot_Log>> GetEmployeeLogs()
        {
            return await chatMethods.GetEmployeetLogs(Guid.Parse(httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value));
        }

        [HttpGet("GetLog/{ChatID}")]
        public async Task<IActionResult> GetChatLog(Guid ChatID)
        {
            var result = await dbContext.Chatbot_Log.Where(a => a.ChatUUID == ChatID).FirstOrDefaultAsync();
            return Ok(result);
        }

        [HttpGet("DismissChat/{ChatID}")]
        public async Task<IActionResult> DismissChat(Guid ChatID)
        {
            var chat = await dbContext.Chatbot_Log.Where(a => a.ChatUUID == ChatID).FirstOrDefaultAsync();
            if (chat == null)
                return BadRequest();

            chat.isDismissed = true;
            var result = await dbContext.SaveChangesAsync();

            return Ok(result);
        }

        [HttpGet("CreateHandover/{ChatID}")]
        public async Task<IActionResult> CreateHandover(Guid ChatID)
        {
            var chat = await dbContext.Chatbot_Log.Where(a => a.ChatUUID == ChatID).FirstOrDefaultAsync();
            if (chat == null)
                return BadRequest();

            chat.isBotHandedOver = true;
            var result = await dbContext.SaveChangesAsync();

            return Ok(result);
        }

    }
}
