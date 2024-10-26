namespace Team04_API.Models.Users.Account_Requests
{
    public class OTP
    {
        public int id { get; set; }
        public Guid? userID { get; set; }
        public string email { get; set; } = string.Empty;
        public string pin { get; set; } = string.Empty;

        //Virtual

        public virtual Credential? userC { get; set; }
    }
}
