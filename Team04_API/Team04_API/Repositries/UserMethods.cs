using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Team04_API.Data;
using Team04_API.Models.DTOs;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Models.Email;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Account_Requests;
using static Team04_API.Models.DTOs.ServiceResponses;

namespace Team04_API.Repositries
{
    public class UserMethods(dataDbContext _DbContext, IPasswordHash passwordHash, IMailService mailService, IConfiguration config) : IUserMethods
    {
        public async Task<bool> SendCEOtp(LoginDTO loginDTO)
        {
            if (loginDTO == null)
                return false;
            //Fetch users 
            var User = await _DbContext.User.Where(a => a.email == loginDTO.Email).FirstOrDefaultAsync();

            //Check that result is not null
            if (User == null)
                return false;

            //Fetch user credential
            var Credential = await _DbContext.Credential.Where(a => a.User_ID == User.User_ID).FirstOrDefaultAsync();

            Console.WriteLine(Credential.Otp);
            //Check that result is not null
            if (Credential == null)
                return false;

            var OTPf = _DbContext.OTP.Where(a => a.email == loginDTO.Email).ToList().LastOrDefault();
            if (OTPf != null)
            {
                _DbContext.OTP.Remove(OTPf);
            }

            Random r = new Random();
            string Otp = r.Next(0, 1000000).ToString("D6");

            string hashOtp = passwordHash.Hash(Otp);

            OTP otpObject = new OTP { email = loginDTO.Email , userC = Credential, pin = hashOtp, userID = Credential.Credential_ID};

            await _DbContext.SaveChangesAsync();

            var OTP = await _DbContext.OTP.Where(a => a.email == loginDTO.Email).FirstOrDefaultAsync();




            Credential.Otp = otpObject.id;

            Credential.uOTP = otpObject;
            _DbContext.SaveChanges();

            MailData OTPEmail = new MailData()
            {
                EmailToId = User.email,
                EmailToName = User.User_Name + " " + User.User_Surname,
                EmailSubject = "Smart Support OTP",
                EmailBody =
                "<h1>Here is your OTP</h1>" +
                "<br/>" +
                Otp +
                "<br/>" +
                "<p>Please do not share this code</p>"
            };

            await mailService.SendMail(OTPEmail);

            return true;
        }

        public async Task<bool> SendOtp (LoginDTO loginDTO)
        {
            if (loginDTO == null)
                return false;

            var OTP = _DbContext.OTP.Where(a => a.email == loginDTO.Email).ToList().LastOrDefault();
            if (OTP != null)
            {
                _DbContext.OTP.Remove(OTP);
            }

            

            var otpObject = new OTP{email = loginDTO.Email};

            Random r = new Random();
            string Otp = r.Next(0, 1000000).ToString("D6");

            string hashOtp = passwordHash.Hash(Otp);            

            otpObject.pin = hashOtp;

            await _DbContext.OTP.AddAsync(otpObject);

            await _DbContext.SaveChangesAsync();


            MailData OTPEmail = new MailData()
            {
                EmailToId = loginDTO.Email,
                EmailToName = "New User",
                EmailSubject = "Smart Support OTP",
                EmailBody =
                "<html>" +
                "<body>" +
                "<h1>Here is your OTP</h1>" +
                "<br/>" +
                Otp +
                "<br/>" +
                "<p>Please do not share this code</p>" +
                "</body>" +
                "</html>"
            };

            await mailService.SendMail(OTPEmail);

            return true;
        }

        public async Task<bool> CheckOtp(LoginDTO loginDTO)
        {
            if (loginDTO == null)
                return false;
            //Fetch users 
            var User = await _DbContext.User.Where(a => a.email == loginDTO.Email).FirstOrDefaultAsync();

            //Check that result is not null
            if (User == null)
                Console.WriteLine("No User");

            //Fetch user credential
            if(User != null)
            {
                var Credential = await _DbContext.Credential.Where(a => a.User_ID == User.User_ID).FirstOrDefaultAsync();

                Credential.Otp = null;
            }

            var OTP =  _DbContext.OTP.Where(a => a.email == loginDTO.Email).ToList().LastOrDefault();
            if (OTP == null)
            {
                return false;
            }

            if (!passwordHash.Verify(OTP.pin, loginDTO.Password))
                return false;

            _DbContext.OTP.Remove(OTP);

            //Credential.Otp = null;
            await _DbContext.SaveChangesAsync();

            return true;
        }

        public async Task<LoginResponse> CheckPassword(LoginDTO loginDTO)
        {
            if (loginDTO == null)
                return new LoginResponse(false, null!, "Please enter values");
            //Fetch users 
            var User = await _DbContext.User.Where(a => a.email == loginDTO.Email).FirstOrDefaultAsync();

            //Check that result is not null
            if (User == null)
                return new LoginResponse(false, null!, "User not found");

            //Fetch user credential
            var Credential = await _DbContext.Credential.Where(a => a.User_ID == User.User_ID).FirstOrDefaultAsync();

            Console.WriteLine(Credential.Otp);
            //Check that result is not null
            if (Credential == null)
                return new LoginResponse(false, null!, "User does not have a credential");

            //TODO: Check password hash
            if (!passwordHash.Verify(User.Credential?.Password, loginDTO.Password))
                return new LoginResponse(false, null!, "Password does not match");

            await SendCEOtp(loginDTO);

            return new LoginResponse(true, null!, "Password is correct");
        }

        public async Task<bool> ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            if (changePasswordDTO == null)
                return false;

            if (changePasswordDTO.Password != changePasswordDTO.ConfirmPassword)
                return false;

            var User = await _DbContext.User.Where(a => a.email == changePasswordDTO.Email).FirstOrDefaultAsync();

            if(User == null)
                return false;

            var Credential = await _DbContext.Credential.Where(a => a.User_ID == User.User_ID).FirstOrDefaultAsync();

            //Check that result is not null
            if (Credential == null)
                return false;

            Credential.Password = passwordHash.Hash(changePasswordDTO.ConfirmPassword);

            _DbContext.SaveChanges();

            return true;
        }

        

        public async Task<LoginResponse> ReactivateAccount(LoginDTO loginDTO)
        {
            if (loginDTO == null)
                return new LoginResponse(false, null!, "Please fill in the OTP");
            //Fetch users 
            var User = await _DbContext.User.Where(a => a.email == loginDTO.Email).FirstOrDefaultAsync();

            //Check that result is not null
            if (User == null)
                return new LoginResponse(false, null!, "User does not have a profile");

            //Fetch user credential
            var Credential = await _DbContext.Credential.Where(a => a.User_ID == User.User_ID).Include(a => a.uOTP).FirstOrDefaultAsync();

            Console.WriteLine(Credential.Otp);
            //Check that result is not null
            if (Credential == null)
                return new LoginResponse(false, null!, "User does not have a credential");

            var otpTrue = await CheckOtp(loginDTO);

            User.isActive = true;

            await _DbContext.SaveChangesAsync();

            if (otpTrue == null || otpTrue == false)
                return new LoginResponse(false, null!, "OTP Incorrect");

            try
            {
                var role = await _DbContext.Role.Where(e => e.Id == User.Role_ID).FirstOrDefaultAsync();
                //Check if the role exists
                if (role == null || role.Name == null)
                    return new LoginResponse(false, null!, "user does not exist");

                //Create a new token format
                var userSession = new UserSession(User.User_ID, User.User_Name + ' ' + User.User_Surname, User.email, role.Name);

                User.User_LastLogin = DateTime.UtcNow.AddHours(2);

                //Create a new token
                string token = GenerateToken(userSession);
                return new LoginResponse(true, token, "User has successfully logged in");
            }
            catch (Exception)
            {
                //This is incase there is an error
                return new LoginResponse(false, null!, "something went wrong");
                throw;
            }

            //return new LoginResponse(true, null, null);
        }

        private string GenerateToken(UserSession user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var userClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: userClaims,
                expires: DateTime.Now.AddDays(0.5),
                signingCredentials: credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        

        public async Task<bool> UpdateUser(UpdateUserDTO userDTO)
        {
            if (userDTO == null)
                return false;
            //Fetch users 
            var User = await _DbContext.User.Where(a => a.email == userDTO.Email).FirstOrDefaultAsync();

            //Check that result is not null
            if (User == null)
                return false;

            User.User_Name = userDTO.Name;
            User.User_Surname = userDTO.Surname;
            User.email = userDTO.Email;
            User.Language_ID = userDTO.Language_ID;
            User.phone = userDTO.Phone;
            User.Title_ID = userDTO.Title_ID;
            User.Language_ID = userDTO?.Language_ID;

            await _DbContext.SaveChangesAsync();

            return true;
            throw new NotImplementedException();
        }
    }
}
