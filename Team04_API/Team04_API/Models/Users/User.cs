using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models;
using Team04_API.Models.FAQ;
using Team04_API.Models.Report;
using Team04_API.Models.Software;
using Team04_API.Models.Ticket;
using Team04_API.Models.Users.Account_Requests;
using Team04_API.Models.Users.Role;

namespace Team04_API.Models.Users
{
    public class User
    {
        [Key]
        public Guid User_ID { get; set; }

        public string User_Name { get; set; } = string.Empty;

        public string User_Surname { get; set; } = string.Empty;

        public string email { get; set; } = string.Empty;

        public string phone { get; set; } = string.Empty;

        public string profile_icon { get; set; } = string.Empty;

        public bool isHod {  get; set; }

        public DateTime User_DOB { get; set; }

        public DateTime User_LastLogin { get; set; }

        [ForeignKey(nameof(Department))]
        public int? Department_ID { get; set; }

        [ForeignKey(nameof(language.Language_ID))]
        public int? Language_ID { get; set; }

        [ForeignKey(nameof(title.Title_ID))]
        public int? Title_ID { get; set; }

        [ForeignKey(nameof(_status.Login_Status_ID))]
        public int? Login_Status_ID { get; set; }

        [ForeignKey(nameof(Credential.Credential_ID))]
        public Guid Credential_ID { get; set; }

        [ForeignKey(nameof(role.Id))]
        public int Role_ID { get; set; }

        public bool isActive { get; set; }

        //virtual items
        public virtual Role.Role? role { get; set; }
        public virtual Title? title { get; set; }
        //public virtual List<Ticket.Ticket>? Tickets {  get; set; }
        public virtual Language? language { get; set; }
        
        public virtual Login_Status? _status { get; set; }

        public virtual Credential? Credential { get; set; }
        public virtual Department.Department? Department { get; set; }

        public virtual List<FAQ.FAQ>? FAQs { get; set; }

        public virtual List<EmployeeReport>? EmployeeReports { get; set; }
        public List<Software.Software>? Software { get; set; }


        /*        public virtual List<Role_Request>? Role_Requests { get; set; }
        */
    }
}
