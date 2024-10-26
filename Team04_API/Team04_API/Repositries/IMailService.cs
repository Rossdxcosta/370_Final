using Team04_API.Models.Email;

namespace Team04_API.Repositries
{
    public interface IMailService
    {
        Task<bool> SendMail(MailData mailData);
    }
}
