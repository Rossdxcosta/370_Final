using Team04_API.Models;
using Team04_API.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Team04_API.Models.DTOs.ServiceResponses;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Role;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Data;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using NuGet.Protocol;
using Team04_API.Models.Ticket;
using NuGet.Common;
using Microsoft.AspNetCore.Http.HttpResults;
using Team04_API.Models.Users.Account_Requests;
using Azure.Core;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Newtonsoft.Json;
using Team04_API.Models.Report;
using Team04_API.Models.FAQ;
using Team04_API.Models.Feedback;
using Team04_API.Models.VDI;

namespace Team04_API.Repositries
{
    public class MethodsRepo(dataDbContext _DbContext, IConfiguration config, IPasswordHash passwordHash, IUserMethods userMethods) : IMethodsRepo
    {        
        public async Task<LoginResponse> RegisterUser (UserDTO user )
        {
            //Checks if there is a user acompanied with a credential
            if (user == null)
                return new LoginResponse(false, null!, "Please Complete the form");

            var testRole = await _DbContext.Role.Where(e=>e.Name == "Guest").FirstOrDefaultAsync();

            if (testRole == null)
            {
                await _DbContext.Role.AddAsync(new Role() { Name = "Guest", Role_Description = "Basic role assigned to new users" });
                await _DbContext.SaveChangesAsync();
            }

            testRole = await _DbContext.Role.Where(e => e.Name == "Guest").FirstOrDefaultAsync();
            var lang = await _DbContext.Language.Where(e => e.Language_ID == user.LanguageID).FirstOrDefaultAsync();
            var title = await _DbContext.Title.Where(e => e.Title_ID == user.TitleID).FirstOrDefaultAsync();
            //var securityQ = await _DbContext.Security_Question.Where(e => e.Security_Question_ID == user.Security_Question_ID).FirstOrDefaultAsync();

            var userID = new Guid();
            var CredentialID = new Guid();

            var aCredential = new Credential()
            {
                Username = user.Email,
                Password = passwordHash.Hash(user.Password),
                User_ID = userID,
                Credential_ID = CredentialID,
                //security_Question_ID = user.Security_Question_ID,
                //Security_Answer = passwordHash.Hash(user.Security_Answer.ToLower()),
                //security_Question = securityQ,
            };

            
            var newUser = new User()
            {
                User_ID = userID,
                User_Name = user.Name,
                User_Surname = user.Surname,
                email = user.Email,
                role = testRole,
                User_DOB = user.DOB,
                User_LastLogin = DateTime.UtcNow.AddHours(2),
                Login_Status_ID = 1,
                isActive = true,
                Language_ID = user.LanguageID,
                Title_ID = user.TitleID,
                Credential_ID = CredentialID,
                Credential = aCredential,
                title = title,
                language = lang,
                profile_icon = user.image,
                
                
            };
            

            //TODO: Try to implement password complexity check


            if (_DbContext.User.Any(u => u.email == user.Email))
                return new LoginResponse(false, null!, "Email already on system");

            await _DbContext.AddAsync(aCredential);

            LoginDTO loginDTO = new LoginDTO { Email = user.Email };

            await _DbContext.User.AddAsync(newUser);

            await _DbContext.SaveChangesAsync();


            //aCredential.recovery_Code = codes;

            await _DbContext.SaveChangesAsync();


            if (!_DbContext.User.Any(u => u.email == user.Email))
                return new LoginResponse(true, null!, "User was added but did not retrieve their information from the database");

            var userSession = new UserSession(newUser.User_ID, newUser.User_Name + ' ' + newUser.User_Surname, newUser.email, newUser.role.Name);

            string token = GenerateToken(userSession);

            return new LoginResponse(true, token, "Created successfully");

        }

        

/*
        public  Task<LoginResponse> UpdateUser(UserDTO userDTO)

        {
            return new LoginResponse(false, null!, "");

        }
*/
        

        public async Task<LoginResponse> Login(LoginDTO loginDTO)
        {
            if(loginDTO == null)
                return new LoginResponse(false, null!, "Please enter values");
            //Fetch user
            var User = await _DbContext.User.Where(a => a.email == loginDTO.Email).FirstOrDefaultAsync();

            //Check that result is not null
            if (User == null)
                return new LoginResponse(false, null!, "User not found");

            //Fetch user credential
            var Credential = await _DbContext.Credential.Where(a => a.User_ID == User.User_ID).FirstOrDefaultAsync();
            
            //Check that result is not null
            if (Credential == null)
                return new LoginResponse(false, null!, "User does not have a credential");
            
            //TODO: Check password hash
            if (!passwordHash.Verify(User.Credential?.Password, loginDTO.Password))
                return new LoginResponse(false, null!, "Password does not match");

            //var Roles = (await _DbContext.User.Where(a => a.User_ID == User.User_ID).Order().LastOrDefaultAsync()).role.ToList();

            //Check if the user has a role id
            if (User.Role_ID == null || User.Role_ID < 1)
                return new LoginResponse(false, null!, "User does not have a role");

            if (User.isActive == false)
                return new LoginResponse(false, null!, "Deactivated");


            try
            {
                var role = await _DbContext.Role.Where(e => e.Id == User.Role_ID).FirstOrDefaultAsync();
                //Check if the role exists
                if(role == null || role.Name == null)
                    return new LoginResponse(false, null!, "user does not exist");

                //Create a new token format
                var userSession = new UserSession(User.User_ID, User.User_Name + ' ' + User.User_Surname, User.email, role.Name);

                User.User_LastLogin = DateTime.UtcNow.AddHours(2);

                await _DbContext.SaveChangesAsync();

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
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            /*if (getUsersDTO == null)
                return new UserListResponse(false, null!, "Please fill in the form");*/

            return await _DbContext.User.Include(e => e.role).Include(e => e.Department).ToListAsync();
        }

        public async Task<IActionResult> GetUser(GetUsersDTO getUsersDTO)
        {
            var user = await _DbContext.User.FindAsync(getUsersDTO.Id);

            if (user == null)
                return new NotFoundResult();

            return new OkObjectResult(user);
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

        public async Task<User_Account_Requests> CreateAccountRequest(User_Account_Requests request)
        {
            try
            {
                await _DbContext.User_Account_Requests.AddAsync(request);
                await _DbContext.SaveChangesAsync();

                return request;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IActionResult> RequestDeactivateAccount(DeactivationRequestDTO deactivationRequestDTO)
        {
            if (deactivationRequestDTO == null)
                return new BadRequestResult();

            var aUser = await _DbContext.User.FindAsync(deactivationRequestDTO.UserID);
            if (aUser == null)
                return new BadRequestResult();

            var userRole = await _DbContext.Role.FindAsync(aUser.Role_ID);

            if (userRole == null)
                return new BadRequestResult();

            var requestType = await _DbContext.Request_Type.FindAsync(deactivationRequestDTO.RequestType);

            if (requestType == null)
                return new BadRequestResult();

            var Request = new User_Account_Requests() { request_type = requestType, Role = userRole, user = aUser, Reason = deactivationRequestDTO.Reason, User_ID= aUser.User_ID, Request_Date = DateTime.UtcNow };

            await _DbContext.User_Account_Requests.AddAsync(Request);

            await _DbContext.SaveChangesAsync();


            return new OkResult();
        }

        //----------------------------------------------------------------------------------------------------------------------------------------
        //                                                              SUPER ADMIN TASKS
        //----------------------------------------------------------------------------------------------------------------------------------------

        public async Task<IEnumerable<User>> GetAllAdmins()
        {
            try
            {
                var result = await _DbContext.User.Where(e => e.role.Name == "Admin").ToListAsync();
                return result;
            }
            catch (Exception)
            {
                throw;
            } 
        }

        public async Task<User?> GetAdminById(Guid Employee_ID)
        {
            try
            {
                var admins = await _DbContext.User.Where(e => e.role.Name == "Admin").ToListAsync();
                var employee = await _DbContext.User.Where(e => e.User_ID == Employee_ID).FirstAsync();

                if (employee != null && admins != null && admins.Contains(employee))
                {
                    return employee;
                }

                return null;
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<User?> AssignAdmin(Guid User_ID)
        {
            try
            {
                var user = await _DbContext.User.Where(e => e.User_ID == User_ID).FirstAsync();
                var role = await _DbContext.Role.Where(e => e.Name == "Admin").FirstOrDefaultAsync();

                if (role == null)
                {
                    var adminRole = new Role() { Name = "Admin", Role_Description = "Role assigned to administrators" };
                    await _DbContext.Role.AddAsync(adminRole);
                    await _DbContext.SaveChangesAsync();
                }

                role = await _DbContext.Role.Where(e => e.Name == "Admin").FirstAsync();

                if (user != null && user.Role_ID != role.Id)
                {
                    user.role = role;
                    await _DbContext.SaveChangesAsync();
                    return user;
                }

                return null;
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<User?> UpdateAdmin(Guid User_ID, User newUser)
        {
            try
            {
                var user = await _DbContext.User.Where(e => e.User_ID == User_ID).FirstAsync();

                if (user != null && newUser != null)
                {
                    user.User_Name = newUser.User_Name;
                    user.User_Surname = newUser.User_Surname;
                    user.User_DOB = newUser.User_DOB;
                    user.email = newUser.email;
                    user.phone = newUser.phone;
                    user.Role_ID = newUser.Role_ID;
                    user.Department_ID = newUser.Department_ID;

                    await _DbContext.SaveChangesAsync();
                }

                return user;
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<IActionResult> DeleteAdmin(Guid User_ID)
        {
            try
            {
                var user = await _DbContext.User.Where(e => e.User_ID == User_ID).FirstAsync();
                var role = await _DbContext.Role.Where(e => e.Name == "Guest").FirstAsync();

                if (user != null)
                {
                    user.role = role;
                    await _DbContext.SaveChangesAsync();
                }

                return new OkObjectResult(user);
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        //ROLE MANAGEMENT

        public async Task<IEnumerable<Role>> GetAllRoles()
        {
            return await _DbContext.Role.ToListAsync();
        }

        public async Task<Role?> GetRoleByID(int Role_ID)
        {
            try
            {
                var role = await _DbContext.Role.Where(e => e.Id == Role_ID).FirstOrDefaultAsync();

                return role;
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<Role> AddRole(RoleDTO role)
        {
            try
            {
                Role newRole = new Role() { Name = role.Name, Role_Description = role.Role_Description};
                var result = await _DbContext.Role.AddAsync(newRole);
                await _DbContext.SaveChangesAsync();

                return newRole;
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<Role?> UpdateRole(int Role_ID, RoleDTO newRole)
        {
            try
            {
                Role updatedRole = new Role() { Name = newRole.Name, Role_Description = newRole.Role_Description };

                var role = await _DbContext.Role.Where(e => e.Id == Role_ID).FirstAsync();

                if (role != null)
                {
                    role.Name = updatedRole.Name;
                    role.Role_Description = updatedRole.Role_Description;

                    await _DbContext.SaveChangesAsync();

                    return role;
                }

                return null;
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<IActionResult> DeleteRole(int Role_ID)
        {
            try
            {
                var role = await _DbContext.Role.Where(e => e.Id == Role_ID).FirstOrDefaultAsync();

                if (role != null)
                {
                    _DbContext.Role.Remove(role);
                }
                
                await _DbContext.SaveChangesAsync();

                return new OkObjectResult(role);
            }
            catch (Exception e)
            {
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<IEnumerable<AccountRequestDTO>> ViewAdminRequests()
        {
            List<AccountRequestDTO> result = new List<AccountRequestDTO>();
            var requests = await _DbContext.User_Account_Requests.Where(e => (e.Role.Name.ToLower() == "admin") || (e.Role.Name.ToLower() == "superadmin")).Where(e => e.Request_Type_ID == 1).Include(e => e.Role).Include(e => e.user).Include(e => e.request_type).ToListAsync();

            if (requests != null)
            {
                foreach (var request in requests)
                {
                    result.Add(new AccountRequestDTO { request = request, currentUserRole = await _DbContext.Role.Where(e => e.Id == request.user.Role_ID).FirstOrDefaultAsync() });
                }
            }

            return result;
        }

        public async Task<bool> AcceptAccountRequest(int requestId)
        {
            try
            {
                var request = await _DbContext.User_Account_Requests
                    .Include(r => r.Role)
                    .Include(r => r.user)
                    .Include(r => r.request_type)
                    .FirstOrDefaultAsync(r => r.Request_ID == requestId);

                if (request != null)
                {
                    var user = request.user;
                    var role = request.Role;

                    user.role = role;
                    _DbContext.User.Update(user);

                    _DbContext.User_Account_Requests.Remove(request);

                    await _DbContext.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<VDI_RequestDTO>> GetAllVDIRequests()
        {
            var vdiRequests = await _DbContext.VDI_Request
                .Include(r => r.Client) 
                .Include(r => r.VDI)    
                .Select(r => new VDI_RequestDTO
                {
                    VDI_Request_ID = r.VDI_Request_ID,
                    ClientName = $"{r.Client.User_Name}",
                    VDI_ID = r.VDI_ID
                })
                .ToListAsync();

            return vdiRequests;
        }



        /*----------------------------------------------------------------------------------------------------
                                                    Admin Tasks
        ----------------------------------------------------------------------------------------------------*/

        public async Task AddUserRole(Role role)
        {
            _DbContext.Role.Add(role);
            await _DbContext.SaveChangesAsync();
        }

        public async Task<bool> UpdateUserRole(Guid userId, int roleId)
        {
            var user = await _DbContext.User.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.Role_ID = roleId;
            //_DbContext.User.Update(user);
            await _DbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveUserRole(Guid userId)
        {
            var user = await _DbContext.User.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.Role_ID = 1; // This brase will set the role to zero or a default value we can set indicating no role
            _DbContext.User.Update(user);
            await _DbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<User_Account_Requests>> ViewDeactivationRequests()
        {
            var requests = await _DbContext.User_Account_Requests.Where(e => e.Request_Type_ID == 2).Include(e => e.Role).Include(e => e.user).Include(e => e.request_type).ToListAsync();

            return requests;
        }

        public async Task<IActionResult> DeActivateUser(Guid Id)
        {
            var user =  await _DbContext.User.Where(u => u.User_ID == Id).FirstOrDefaultAsync();
            if (user == null)
            {
                return new NotFoundResult();
            }
            try
            {
                var requests = await _DbContext.User_Account_Requests
                    .Include(r => r.Role)
                    .Include(r => r.user)
                    .Include(r => r.request_type)
                    .Where(r => r.user.User_ID == Id)
                    .ToListAsync();

                 _DbContext.RemoveRange(requests);
                await _DbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                return new BadRequestResult();
            }
            try
            {
                user.isActive = false;
                await _DbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                return new BadRequestResult();
            }


            return new OkResult();

        }

        /*----------------------------------------------------------------------------------------------------
                                                    Ticket Tasks
        ----------------------------------------------------------------------------------------------------*/

        /*public async Task<IEnumerable<Ticket>> GetAllTickets()
        {
            var tickets = await _DbContext.Ticket
                .Include(t => t.Employee)
                .Include(t => t.Client)
                .Include(t => t.Priority)
                .Include(t => t.Tag)
                .Include(t => t.Ticket_Status)
                .ToListAsync();

            Console.WriteLine($"Retrieved {tickets.Count()} tickets");
            return tickets;
        }*/ //New method as ActionResult Below
        public async Task<IActionResult> GetAllTickets()
        {
            try
            {
                var tickets = await _DbContext.Ticket
                    .Include(t => t.Employee)
                    .Include(t => t.Client)
                    .Include(t => t.Priority)
                    .Include(t => t.Tag)
                    .Include(t => t.Ticket_Status)
                    //.Include(t => t.TicketGroups)
                    .ToListAsync();

                return new OkObjectResult(tickets);
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        public async Task<Ticket?> GetTicketById(int id)
        {
            return await _DbContext.Ticket.FindAsync();
        }

        //Getting all the tckets for a logged in client
        public async Task<IEnumerable<Ticket>> GetTicketsByClientId(Guid clientId)
        {
            return await _DbContext.Ticket
                .Where(t => t.Client_ID == clientId)
                .Include(t => t.Ticket_Status)
                .Include(t => t.Client)
                .ToListAsync();
        }

        public async Task<IActionResult> AddTicket(TicketDTO ticket)
        {
           
                Console.WriteLine($"Incoming Ticket: {JsonConvert.SerializeObject(ticket)}");
                var tag = await _DbContext.Tag.FindAsync(ticket.Tag_ID);

                var employees = await _DbContext.User.Where(e => e.Role_ID == 3).ToListAsync();
                Dictionary<Guid, int> dict_ticket_count = new Dictionary<Guid, int>(); 

                foreach (var employee in employees) { 
                    var tickets = await _DbContext.Ticket.Where(e => e.Assigned_Employee_ID == employee.User_ID).ToListAsync();
                    dict_ticket_count.Add(employee.User_ID, tickets.Count);
                }

                var ticket_count = from entry in dict_ticket_count orderby entry.Value select entry;
                var selected_employee = ticket_count.First().Key;

                Ticket newTicket = new Ticket
                {
                    Client_ID = ticket.Client_ID,
                    Assigned_Employee_ID = selected_employee,
                    //DONT DELETE
                    //Chatbot_Log_ID = ticket.Chatbot_Log_ID,
                    Tag_ID = ticket.Tag_ID,
                    Priority_ID = ticket.Priority_ID,
                    Ticket_Status_ID = ticket.Ticket_Status_ID,
                    //To_do_List_ID = ticket.To_do_List_ID,
                    Ticket_Description = ticket.Ticket_Description,
                    Ticket_Date_Created = DateTime.UtcNow,
                    //Ticket_Date_Resolved = ticket.Ticket_Date_Resolved,
                    Ticket_Subscription = ticket.Ticket_Subscription,
                    //Anomaly_ID = ticket.Anomaly_ID
                    Tag = tag,
                    isOpen = true
                };

                var result = await _DbContext.Ticket.AddAsync(newTicket);
                await _DbContext.SaveChangesAsync();

                return new OkResult();
          
        }


        // This method is useless and can be removed, confirm @rico?
        /*public async Task<Ticket?> UpdateTicket(int id, Ticket ticket)
        {
            var existingTicket = await _DbContext.Ticket.FindAsync(id);
            if (existingTicket == null) return null;

            // Ticket Updates
            int status_old = _DbContext.Ticket.Find(id).Ticket_Status_ID;
            int status_new = ticket.Ticket_Status_ID;

            if (status_old != status_new) 
            {
                _DbContext.Ticket_Updates.Add(new Ticket_Updates
                {
                    Ticket_ID = id,
                    Ticket_Status_Old_ID = status_old,
                    Ticket_Status_New_ID = status_new,
                    DateOfChange = DateTime.Now,
                    hasBeenDismissed = false
                }); 
            }

            // Edit Ticket
            existingTicket.Client_ID = ticket.Client_ID;
            existingTicket.Assigned_Employee_ID = ticket.Assigned_Employee_ID;
            existingTicket.Chatbot_Log_ID = ticket.Chatbot_Log_ID;
            existingTicket.Tag_ID = ticket.Tag_ID;
            existingTicket.Priority_ID = ticket.Priority_ID;
            //existingTicket.Anomaly_ID = ticket.Anomaly_ID;
            existingTicket.Ticket_Status_ID = ticket.Ticket_Status_ID;
            existingTicket.To_do_List_ID = ticket.To_do_List_ID;
            existingTicket.Ticket_Description = ticket.Ticket_Description;
            existingTicket.Ticket_Date_Created = ticket.Ticket_Date_Created;
            existingTicket.Ticket_Date_Resolved = ticket.Ticket_Date_Resolved;
            existingTicket.Ticket_Subscription = ticket.Ticket_Subscription;

            await _DbContext.SaveChangesAsync();
            return existingTicket;
        }*/

        public async Task<bool> DeleteTicket(int id)
        {
            var ticket = await _DbContext.Ticket.FindAsync();
            if (ticket == null) return false;

            _DbContext.Ticket.Remove(ticket);
            return true;
        }

        public async Task<IActionResult> SearchTickets(Guid userId, string? status, DateTime? dateCreated)
        {
            var query = _DbContext.Ticket
                .Include(t => t.Employee)
                .Include(t => t.Client)
                .Include(t => t.Priority)
                .Include(t => t.Tag)
                .Include(t => t.Ticket_Status)
                .Where(t => t.Client_ID == userId) 
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.Ticket_Status.Status_Name.Contains(status));
            }

            if (dateCreated.HasValue)
            {
                query = query.Where(t => t.Ticket_Date_Created.Date == dateCreated.Value.Date);
            }

            var tickets = await query.ToListAsync();

            var ticketDTOs = tickets.Select(t => new TicketDTO
            {
                Ticket_ID = t.Ticket_ID,
                Client_ID = t.Client_ID,
                Tag_ID = t.Tag_ID,
                Priority_ID = t.Priority_ID,
                Ticket_Status_ID = t.Ticket_Status_ID,
                Ticket_Description = t.Ticket_Description,
                Ticket_Date_Created = t.Ticket_Date_Created,
                Ticket_Subscription = t.Ticket_Subscription,
                Ticket_Status_Name = t.Ticket_Status.Status_Name 
            }).ToList();

            return new OkObjectResult(ticketDTOs);
        }

        public async Task<IEnumerable<Priority>> GetAllPriorities()
        {
            return await _DbContext.Priority.ToListAsync();
        }

        public async Task<IEnumerable<Ticket_Status>> GetAllStatuses()
        {
            return await _DbContext.Ticket_Status.ToListAsync();
        }

        public async Task<IEnumerable<Tag>> GetAllTags()
        {
            return await _DbContext.Tag.ToListAsync();
        }

        // FAQs
        public async Task<IEnumerable<FAQ>> GetAllFAQs()
        {
            return await _DbContext.FAQs.Include(f => f.FAQ_Category).ToListAsync();
        }

        public async Task<FAQ?> GetFAQByID(int id)
        {
            return await _DbContext.FAQs.Include(f => f.FAQ_Category).FirstOrDefaultAsync(f => f.FAQ_ID == id);
        }

        public async Task<FAQ> AddFAQ(FAQ faq)
        {
            _DbContext.FAQs.Add(faq);
            await _DbContext.SaveChangesAsync();
            return faq;
        }

        public async Task<FAQ?> UpdateFAQ(int id, FAQ faq)
        {
            var existingFAQ = await _DbContext.FAQs.FindAsync(id);
            if (existingFAQ == null) return null;

            existingFAQ.FAQ_Question = faq.FAQ_Question;
            existingFAQ.FAQ_Answer = faq.FAQ_Answer;
            existingFAQ.FAQ_Category_ID = faq.FAQ_Category_ID;

            await _DbContext.SaveChangesAsync();
            return existingFAQ;
        }

        public async Task<bool> DeleteFAQ(int id)
        {
            var faq = await _DbContext.FAQs.FindAsync(id);
            if (faq == null) return false;

            _DbContext.FAQs.Remove(faq);
            await _DbContext.SaveChangesAsync();
            return true;
        }

        // FAQ Categories
        public async Task<IEnumerable<FAQ_Category>> GetAllFAQCategories()
        {
            return await _DbContext.FAQ_Categories.Include(c => c.FAQs).ToListAsync();
        }

        public async Task<FAQ_Category?> GetFAQCategoryByID(int id)
        {
            return await _DbContext.FAQ_Categories.Include(c => c.FAQs).FirstOrDefaultAsync(c => c.FAQ_Category_ID == id);
        }

        public async Task<FAQ_Category> AddFAQCategory(FAQ_Category category)
        {
            _DbContext.FAQ_Categories.Add(category);
            await _DbContext.SaveChangesAsync();
            return category;
        }

        public async Task<FAQ_Category?> UpdateFAQCategory(int id, FAQ_Category category)
        {
            var existingCategory = await _DbContext.FAQ_Categories.FindAsync(id);
            if (existingCategory == null) return null;

            existingCategory.FAQ_Category_Name = category.FAQ_Category_Name;
            existingCategory.FAQ_Category_Description = category.FAQ_Category_Description;

            await _DbContext.SaveChangesAsync();
            return existingCategory;
        }

        public async Task<bool> DeleteFAQCategory(int id)
        {
            var category = await _DbContext.FAQ_Categories.FindAsync(id);
            if (category == null) return false;

            _DbContext.FAQ_Categories.Remove(category);
            await _DbContext.SaveChangesAsync();
            return true;
        }

        //Client
        public async Task<Client_Feedback> CreateAsync(Client_Feedback feedback)
        {
            _DbContext.ClientFeedbacks.Add(feedback);
            await _DbContext.SaveChangesAsync();
            return feedback;
        }
        public async Task<Client_Feedback> GetByIdAsync(int id)
        {
            return await _DbContext.ClientFeedbacks.FindAsync(id);
        }
    }
}
