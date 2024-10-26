using Team04_API.Models.Users.Account_Requests;
using Team04_API.Models.Users.Role;

namespace Team04_API.Models.DTOs.UserDTOs
{
    public class AccountRequestDTO
    {
        public required User_Account_Requests request { get; set; }
        public required Role currentUserRole { get; set; }
    }
}
