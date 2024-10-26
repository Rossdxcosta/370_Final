namespace Team04_API.Models.Software
{
    public class SoftwareRequestDto
    {
        public Guid Client_ID { get; set; }
        public int Software_ID { get; set; }
        public DateTime Request_Date { get; set; }
    }
}
