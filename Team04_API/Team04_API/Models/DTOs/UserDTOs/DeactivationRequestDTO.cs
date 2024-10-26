namespace Team04_API.Models.DTOs.UserDTOs
{
    public class DeactivationRequestDTO
    {
        public Guid UserID { get; set; }
        public int RequestType { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
