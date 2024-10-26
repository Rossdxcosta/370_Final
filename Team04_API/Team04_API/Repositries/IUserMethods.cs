using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using System.ComponentModel;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Models.Email;
using Team04_API.Models.Users;
using static Team04_API.Models.DTOs.ServiceResponses;

namespace Team04_API.Repositries
{
    public interface IUserMethods
    {
        Task<bool> SendOtp(LoginDTO loginDTO);
        Task<bool> SendCEOtp(LoginDTO loginDTO);
        Task<bool> CheckOtp(LoginDTO loginDTO);
        Task<LoginResponse> CheckPassword (LoginDTO loginDTO);
        Task<bool> ChangePassword (ChangePasswordDTO changePasswordDTO);
        Task<LoginResponse> ReactivateAccount (LoginDTO loginDTO);
        Task<bool> UpdateUser (UpdateUserDTO userDTO);
    }
}
