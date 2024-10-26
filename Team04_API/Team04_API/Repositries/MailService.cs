using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal;
using Microsoft.Extensions.Options;
using MimeKit;
//using System.Net.Mail;

//using SendGrid.Helpers.Mail;
//using SendGrid;
using Team04_API.Models.Email;

namespace Team04_API.Repositries
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettingsOptions)
        {
            _mailSettings = mailSettingsOptions.Value;
        }

        public async Task<bool> SendMail(MailData mailData)
        {
                        
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailboxAddress emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
                    emailMessage.From.Add(emailFrom);
                    MailboxAddress emailTo = new MailboxAddress(mailData.EmailToName, mailData.EmailToId);
                    emailMessage.To.Add(emailTo);

                    //emailMessage.Cc.Add(new MailboxAddress("Cc Receiver", "cc@example.com"));
                    //emailMessage.Bcc.Add(new MailboxAddress("Bcc Receiver", "bcc@example.com"));

                    emailMessage.Subject = mailData.EmailSubject;

                    BodyBuilder emailBodyBuilder = new BodyBuilder();
   
                    emailBodyBuilder.HtmlBody = mailData.EmailBody;

                    //System.Net.Mail.Attachment emaiAttachment = new System.Net.Mail.Attachment(new MemoryStream(mailData.EmailAttachments), "Report.pdf", "application/pdf");
                    if (mailData.EmailAttachments != null)
                    {
                        foreach (var item in mailData.EmailAttachments)
                        {
                            emailBodyBuilder.Attachments.Add("ReportData.pdf", item);
                        }
                        
                    }
                   

                    emailMessage.Body = emailBodyBuilder.ToMessageBody();
                    //this is the SmtpClient from the Mailkit.Net.Smtp namespace, not the System.Net.Mail one
                    using (SmtpClient mailClient = new SmtpClient())
                    {
                        await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                        mailClient.Authenticate(_mailSettings.UserName, _mailSettings.Password);
                        mailClient.Send(emailMessage);
                        mailClient.Disconnect(true);
                    }
                }

                return true;
            }
            catch (Exception)
            {
                // Exception Details
                return false;
            }
            
        }
    }
}
