using Microsoft.AspNetCore.Mvc;
using Team04_API.Models.Company;
using Team04_API.Models.Department;
using Team04_API.Models.DTOs.Company;
using Team04_API.Models.Location;
using Team04_API.Models.Ticket;

namespace Team04_API.Repositries
{
    public interface ICompanyManagement
    {
        Task<IActionResult> CreateDepartment(Department department);
        Task<IActionResult> AddTagsToDepartment(DepartmentTagDTO tag);

        Task<IActionResult> CreateLocation(Location location);
        Task<IActionResult> CreateCompany(Company company);
        Task<IActionResult> UpdateDepartment(Department department);
        Task<IActionResult> UpdateLocation(Location location);
        Task<IActionResult> UpdateCompany(Company company);
        Task<IActionResult> DeleteDepartment(Department department);
        Task<IActionResult> DeleteLocation(Location location);
        Task<IActionResult> DeleteCompany(Company company);
        Task<IActionResult> GetDepartment(Department department);
        Task<IActionResult> GetLocation(Location location);
        Task<IActionResult> GetCompany(Company company);

    }
}
