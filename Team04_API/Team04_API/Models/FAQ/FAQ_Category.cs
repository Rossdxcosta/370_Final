using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.FAQ
{
    public class FAQ_Category
    {
        [Key]
        public int FAQ_Category_ID { get; set; }
        public string FAQ_Category_Name { get; set; } = string.Empty;
        public string FAQ_Category_Description { get; set; } = string.Empty;

        //virtual
        public virtual List<FAQ>? FAQs { get; set; }
    }
}
