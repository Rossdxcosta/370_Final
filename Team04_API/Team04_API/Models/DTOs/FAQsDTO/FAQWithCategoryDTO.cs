namespace Team04_API.Models.DTOs.FAQsDTO
{
    public class FAQWithCategoryDTO
    {
        public int FAQId { get; set; }
        public string? Question { get; set; }
        public string? Answer { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryDescription { get; set; }
    }
}
