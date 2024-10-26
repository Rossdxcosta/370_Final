using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Common;
using System.Collections;
using System.Collections.Concurrent;
using Team04_API.Data;
using Team04_API.Models.Chatbot;
using Team04_API.Models.Email;
using Team04_API.Repositries;

namespace Team04_API.Controllers
{
    [ApiController]
    [Route("a[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IMailService _mailService;
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly dataDbContext dbContext;
        private readonly IAnomalyDetection anomalyDetection;

        public WeatherForecastController(IMailService _MailService, ILogger<WeatherForecastController> logger, dataDbContext _dbContext, IAnomalyDetection anomalyDetection)
        {
            _mailService = _MailService;
            _logger = logger;
            dbContext = _dbContext;
            this.anomalyDetection = anomalyDetection;
        }

        //testing email
        [HttpPost]
        [Route("SendMail")]
        public Task<bool> SendMail(MailData mailData)
        {
            return _mailService.SendMail(mailData);
        }

        //testing email
        [HttpPost]
        [Route("Testanomaly")]
        public async Task<IActionResult> TestAnomaly()
        {
            var result = "dbContext.GetAnomalyReport();";
            anomalyDetection.CheckAnomaly();
            return Ok(result);
        }

        [HttpPost]
        [Route("TestChat")]
        public async Task<IActionResult> TestChat(Guid senderID, Message message)
        {
            try
            {
                var chatbot_Log = new Chatbot_Log { 
                    Chatbot_Log_ID = 1,
                    chat = new Chat { Chat_ID = 1,
                        Messages = new List<Message> { 
                            new Message { 
                                senderID = Guid.NewGuid(),
                                messageText = "Hello daar",
                                messageType = 1 } 
                        }
                    },
                    Client_ID = senderID,
                    Conversation_Date = DateTime.UtcNow,
                    Conversation_Title = "Something", 
                    Ticket_ID = 3
                };
                var result = dbContext.Chatbot_Log.AddAsync(chatbot_Log);
                await dbContext.SaveChangesAsync();

                chatbot_Log.chat.Messages.Add(message);
                await dbContext.SaveChangesAsync();

                //anomalyDetection.CheckAnomaly();
                return Ok("It Works?");
            }
            catch (Exception)
            {

                throw;
            }   
        }

        [HttpGet]
        [Route("getUserChats/{userID}")]
        public IEnumerable<Chatbot_Log> getUserChats(Guid userID)
        {
            anomalyDetection.CheckAnomaly();
            try
            {
                var result = dbContext.Chatbot_Log.Where(e => e.Client_ID == userID).ToList();
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet(Name = "GetWeatherForecast")]
        [Authorize]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }




    }
}
