using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Role;

namespace Team04_API.Models.FAQ
{
    public class FAQ
    {
        [Key]
        public int FAQ_ID { get; set; }
        public string FAQ_Question { get; set; } = string.Empty;
        public string FAQ_Answer { get; set; } = string.Empty ;

        [ForeignKey(nameof(FAQ_Category.FAQ_Category_ID))]
        public int FAQ_Category_ID { get; set; }

        [ForeignKey(nameof(User.User_ID))]
        public Guid User_ID { get; set; }

        //virtual
        public virtual FAQ_Category? FAQ_Category { get; set; }
        public virtual User? User { get; set;}
    }
}
