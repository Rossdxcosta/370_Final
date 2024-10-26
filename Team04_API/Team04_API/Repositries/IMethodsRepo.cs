using Microsoft.AspNetCore.Mvc;
using Team04_API.Models.DTOs;
using Team04_API.Models.DTOs.UserDTOs;
using Team04_API.Models.Ticket;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Account_Requests;
using Team04_API.Models.Users.Role;
using Team04_API.Models.FAQ;
using static Team04_API.Models.DTOs.ServiceResponses;
using Team04_API.Models.Feedback;
using Microsoft.EntityFrameworkCore;
using Team04_API.Models.VDI;

namespace Team04_API.Repositries
{
    public interface IMethodsRepo
    {
        // Users
        Task<LoginResponse> RegisterUser(UserDTO user);
        Task<LoginResponse> Login(LoginDTO loginDTO);
        Task<IEnumerable<User>> GetAllUsers();
        Task<IActionResult> GetUser(GetUsersDTO getUsersDTO);
        Task<User_Account_Requests> CreateAccountRequest(User_Account_Requests request);
        Task<IActionResult> RequestDeactivateAccount(DeactivationRequestDTO deactivationRequestDTO);

        // SuperAdminTasks
        Task<IEnumerable<User>> GetAllAdmins();
        Task<User?> GetAdminById(Guid User_ID);
        Task<User?> AssignAdmin(Guid User_ID);
        Task<User?> UpdateAdmin(Guid User_ID, User user);
        Task<IActionResult> DeleteAdmin(Guid User_ID);
        Task<IEnumerable<Role>> GetAllRoles();
        Task<Role?> GetRoleByID(int Role_ID);
        Task<Role> AddRole(RoleDTO role);
        Task<Role?> UpdateRole(int Role_ID, RoleDTO newRole);
        Task<IActionResult> DeleteRole(int Role_ID);
        Task<IEnumerable<AccountRequestDTO>> ViewAdminRequests();
        Task<bool> AcceptAccountRequest(int requestId);
        Task<IEnumerable<VDI_RequestDTO>> GetAllVDIRequests();

        // Admin tasks
        Task AddUserRole(Role role);
        Task<bool> UpdateUserRole(Guid userId, int roleId);
        Task<bool> RemoveUserRole(Guid userId);
        Task<IEnumerable<User_Account_Requests>> ViewDeactivationRequests();
        Task<IActionResult> DeActivateUser(Guid Id);

        // Tickets
        Task<IActionResult> GetAllTickets();
        Task<Ticket?> GetTicketById(int id);
        Task<IEnumerable<Ticket>> GetTicketsByClientId(Guid clientId);
        Task<IActionResult> AddTicket(TicketDTO ticket);
        Task<bool> DeleteTicket(int id);
        Task<IEnumerable<Priority>> GetAllPriorities();
        Task<IEnumerable<Ticket_Status>> GetAllStatuses();
        Task<IEnumerable<Tag>> GetAllTags();
        Task<IActionResult> SearchTickets(Guid userId, string? status, DateTime? dateCreated);

        // FAQs
        Task<IEnumerable<FAQ>> GetAllFAQs();
        Task<FAQ?> GetFAQByID(int id);
        Task<FAQ> AddFAQ(FAQ faq);
        Task<FAQ?> UpdateFAQ(int id, FAQ faq);
        Task<bool> DeleteFAQ(int id);

        // FAQ Categories
        Task<IEnumerable<FAQ_Category>> GetAllFAQCategories();
        Task<FAQ_Category?> GetFAQCategoryByID(int id);
        Task<FAQ_Category> AddFAQCategory(FAQ_Category category);
        Task<FAQ_Category?> UpdateFAQCategory(int id, FAQ_Category category);
        Task<bool> DeleteFAQCategory(int id);

        //CLIENT
        Task<Client_Feedback> CreateAsync(Client_Feedback feedback);
        Task<Client_Feedback> GetByIdAsync(int id);
       


    }
}
