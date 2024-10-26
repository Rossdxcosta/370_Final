using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using Team04_API.Data;
using Team04_API.Models.Chatbot;
using Team04_API.Models.DTOs.MessageDTO;
using Team04_API.Repositries;

namespace Team04_API.Services
{
    public class ChatHub : Hub
    {
        private readonly dataDbContext _context;
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;
        private readonly IChatMethods chatMethods;

        public ChatHub(dataDbContext context, IDictionary<string, UserConnection> connections, IChatMethods chatMethods)
        {
            _context = context;
            _botUser = "Bot";
            _connections = connections;
            this.chatMethods = chatMethods;
        }
        public async Task SendMessage(string receiverId, string message)
        {

            var senderId = Context.UserIdentifier;
            /*var newMessage = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = message,
                Timestamp = DateTime.UtcNow,
                IsGroupMessage = false
            };

            _context.Messages.Add(newMessage);
            await _context.SaveChangesAsync();*/

            await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
        }

        public async Task JoinGroup(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections[Context.ConnectionId] = userConnection;

            var user = _context.User.Where(a => a.User_ID == Guid.Parse(userConnection.UserID)).FirstOrDefault();

            //await Clients.Group(userConnection.Room).SendAsync("Send", $"{Context.ConnectionId}", $"{user.User_Name} {user.User_Surname} hass joined");
        }

        public async Task SendGroupMessage(string groupId, string message, string username, int userRole)
        {
            Console.WriteLine("The error is not here");
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                await Clients.Group(userConnection.Room).SendAsync("Send", $"{username}", $"{message}", $"{groupId}", $"{userRole}", $"{DateTime.UtcNow}");
            }
           /* try
            {
                var chat = _context.Chatbot_Log.Where(a => a.ChatUUID == Guid.Parse(groupId)).FirstOrDefault();

                var messageOBJ = new Message { messageText = message, messageType = userRole, senderID = Guid.Parse(userID) };

                chat.chat.Messages.Add(messageOBJ);

                await _context.SaveChangesAsync(userID);
            }
            catch (Exception)
            {
                Console.WriteLine("bruh");
                throw;
            }*/
            
        }

        public async Task SendChats()
        {
            var Chats = chatMethods.Getlogs();
            await Clients.All.SendAsync("OpenChats", Chats);

        }


    }
}
