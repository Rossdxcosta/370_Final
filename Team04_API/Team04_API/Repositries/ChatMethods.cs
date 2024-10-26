using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Models.DTOs.MessageDTO;
using static Team04_API.Models.DTOs.ServiceResponses;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Data;
using Team04_API.Models.Chatbot;
using Microsoft.AspNetCore.SignalR;
using Team04_API.Services;
using System.ComponentModel;

namespace Team04_API.Repositries
{
    public class ChatMethods(dataDbContext _DbContext) : IChatMethods
    {
        private readonly dataDbContext dbContext = _DbContext;
        //private readonly ChatHub hub = hub;

        public async Task<IActionResult> HandOverToAgent(ClaimChatDTO chatDTO)
        {
            if (chatDTO == null)
                return new NotFoundResult();

            var ChatLog = await dbContext.ChatbotLogs.Where(a => a.ChatUUID == chatDTO.ChatID).FirstOrDefaultAsync();

            if ( ChatLog.Agent_ID != null)
            {
                return new BadRequestObjectResult("Chat already taken");
            }

            ChatLog.Agent_ID = chatDTO.empID;

            await dbContext.SaveChangesAsync(chatDTO.empID.ToString());

            return new OkObjectResult(ChatLog.ChatUUID.ToString());
        }

        public async Task<IActionResult> SaveChatMessages(MessagesDTO messagesDTO)
        {

            if (messagesDTO == null)
                throw new ArgumentNullException(nameof(messagesDTO));


            var Log = await dbContext.ChatbotLogs.Where(a => a.ChatUUID == messagesDTO.ChatbotLogID).FirstOrDefaultAsync();

            if (Log == null)
                return new NotFoundResult();

            

            var message = new Message { messageText = messagesDTO.Message.messageText, messageType = messagesDTO.Message.messageType, name = messagesDTO.Message.name, role = messagesDTO.Message.role, senderID = messagesDTO.Message.senderID, time = DateTime.UtcNow.AddHours(2) };
            Log.chat.Messages.Add(message);

            if (Log.chat.Messages.Where(a => a.messageType == 2).Count() == 1)
            {
                Log.Conversation_Title = messagesDTO.Message.messageText;
            }

            await dbContext.SaveChangesAsync();

            return new OkObjectResult(true);

            //throw new NotImplementedException();
        }

        public async Task<IActionResult> StartChat(Guid email)
        {
            if (email == null)
                return new NotFoundResult();
            //Fetch user
            var User = await dbContext.User.Where(a => a.User_ID == email).FirstOrDefaultAsync();

            //Check that result is not null
            if (User == null)
                return new NotFoundResult();


            var ChatGUID = Guid.NewGuid();

            var Chatbotlog = new Chatbot_Log { 
                Client_ID = User.User_ID,
                Conversation_Date = DateTime.UtcNow.AddHours(2),
                ChatUUID = ChatGUID,
                Conversation_Title = "Hope this works",
                chat = new Chat { Chat_ID = 1, Messages = new List<Message>() }
            };

            await dbContext.ChatbotLogs.AddAsync(Chatbotlog);

            await dbContext.SaveChangesAsync(User.User_ID.ToString());

            return new OkObjectResult(Chatbotlog.ChatUUID);
            //throw new NotImplementedException();
        }

        public async Task<List<Chatbot_Log>> Getlogs()
        {
            var OpenChats = dbContext.Chatbot_Log.Where(a => a.isBotHandedOver && a.Agent_ID == null).ToList();
            foreach (var Chatbotlog in OpenChats)
            {
                await dbContext.Entry(Chatbotlog).ReloadAsync();
            }

            return OpenChats;
        }

        public async Task<List<Chatbot_Log>> GetClientLogs(Guid guid)
        {
            var OpenChats = dbContext.Chatbot_Log.Where(a => a.Client_ID == guid && a.isDismissed == false).ToList();
            foreach (var Chatbotlog in OpenChats)
            {
                await dbContext.Entry(Chatbotlog).ReloadAsync();
            }

            return OpenChats;
        }

        public async Task<List<Chatbot_Log>> GetEmployeetLogs(Guid guid)
        {
            var OpenChats = dbContext.Chatbot_Log.Where(a => a.Agent_ID == guid).ToList();
            foreach (var Chatbotlog in OpenChats)
            {
                await dbContext.Entry(Chatbotlog).ReloadAsync();
            }

            return OpenChats;
        }

    }
}
