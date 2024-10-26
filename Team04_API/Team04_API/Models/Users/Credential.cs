using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Users.Account_Requests;

namespace Team04_API.Models.Users
{
    public class Credential
    {
        [Key]
        public Guid Credential_ID { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        [ForeignKey(nameof(OTP.id))]
        public int? Otp {  get; set; }
        //public string? Otp { get; set }
        public string? Security_Answer { get; set; }

        [ForeignKey(nameof(User.User_ID))]
        public Guid User_ID { get; set; }

        //public DateTime? OTPExpiration { get; set; }

        //Virtual items
        public virtual User? User { get; set; }

        public virtual OTP? uOTP { get; set; }
        
    }
}
