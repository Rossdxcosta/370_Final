using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Team04_API.Data;
using Team04_API.Models.Feedback;
using Microsoft.EntityFrameworkCore;
using Team04_API.Models.DTOs;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly dataDbContext _context;

        public FeedbackController(dataDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback(Feedback feedback)
        {
            if (feedback.Chatbot_Log_ID.HasValue)
            {
                var existingFeedback = await _context.ClientFeedbacks
                    .FirstOrDefaultAsync(f => f.Chatbot_Log_ID == feedback.Chatbot_Log_ID);

                if (existingFeedback != null)
                {
                    return BadRequest("Feedback already exists for this chatbot log.");
                }
            }

            if (feedback.Ticket_ID.HasValue)
            {
                var existingFeedback = await _context.ClientFeedbacks
                    .FirstOrDefaultAsync(f => f.Ticket_ID == feedback.Ticket_ID);

                if (existingFeedback != null)
                {
                    return BadRequest("Feedback already exists for this Ticket");
                }
            }

            var Feedback = new Client_Feedback {Ticket_ID = feedback.Ticket_ID, Feedback_Date_Created = feedback.Feedback_Date_Created, Client_ID = feedback.Client_ID, Client_Feedback_Detail = feedback.Client_Feedback_Detail };

            _context.ClientFeedbacks.Add(Feedback);
            await _context.SaveChangesAsync();
            return Ok();
        }

        public class Feedback
        {
            public int Client_Feedback_ID { get; set; }
            public required string Client_Feedback_Detail { get; set; }
            public int? Ticket_ID { get; set; }
            public DateTime Feedback_Date_Created {  get; set; } 
            public Guid Client_ID { get; set; }
            public int? Chatbot_Log_ID {  get; set; }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client_Feedback>>> GetAllFeedbacks()
        {
            return await _context.ClientFeedbacks.ToListAsync();
        }

        [HttpGet("chatbot-logs")]
        public async Task<ActionResult<IEnumerable<ChatbotLogDto>>> GetChatbotLogs()
        {
            var logs = await _context.ChatbotLogs
                .Select(log => new ChatbotLogDto
                {
                    Chatbot_Log_ID = log.Chatbot_Log_ID,
                    Conversation_Title = log.Conversation_Title
                })
                .ToListAsync();

            return Ok(logs);
        }
    }
}
