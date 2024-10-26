using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team04_API.Models.DTOs
{
    public record class UserSession(Guid Id, string Name, string Email, string Role);
}
