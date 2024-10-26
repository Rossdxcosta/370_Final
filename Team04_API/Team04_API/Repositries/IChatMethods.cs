using Microsoft.AspNetCore.Mvc;
using Team04_API.Models.Chatbot;
using Team04_API.Models.DTOs.MessageDTO;

namespace Team04_API.Repositries
{
    public interface IChatMethods
    {
        Task<IActionResult> StartChat(Guid email);
        Task<IActionResult> HandOverToAgent(ClaimChatDTO claimChat);
        Task<IActionResult> SaveChatMessages(MessagesDTO messagesDTO);
        Task<List<Chatbot_Log>> Getlogs();
        Task<List<Chatbot_Log>> GetEmployeetLogs(Guid guid);
        Task<List<Chatbot_Log>> GetClientLogs(Guid guid);
    }
}
