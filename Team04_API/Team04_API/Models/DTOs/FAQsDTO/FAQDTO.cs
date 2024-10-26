namespace Team04_API.Models.DTOs.FAQsDTO
{
    public class FAQDto
    {
        public int faQ_ID { get; set; }
        public string? faQ_Question { get; set; }
        public string? faQ_Answer { get; set; }
        public int faQ_Category_ID { get; set; }
        public string? faQ_Category_Name { get; set; }
        public string? User_ID { get; set; } // Add this property
    }
}
