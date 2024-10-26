namespace Team04_API.Models.Email
{
    public class MailData
    {
        public string EmailToId { get; set; } = string.Empty;
        public string EmailToName { get; set; } = string.Empty;
        public string EmailSubject { get; set; } = string.Empty;
        public string EmailBody { get; set; } = string.Empty;
        public List<byte[]>? EmailAttachments { get; set; }
    }
}
