using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team04_API.Models.Users;

namespace Team04_API.Models.DTOs
{
    public class ServiceResponses
    {
        public record class GeneralResponse(bool Flag, string Message);
        public record class LoginResponse (bool Flag, string Token, string Message);
        public record class UserListResponse (bool Flag, List<User> Users, string Message);
        public record class SUserResponse (bool Flag, User user, string Message);
    }
}
