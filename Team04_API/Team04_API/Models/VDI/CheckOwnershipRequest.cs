namespace Team04_API.Models.VDI
{
    public class CheckOwnershipRequest
    {
        public Guid ClientID { get; set; }
        public int VDIID { get; set; }
    }

}
