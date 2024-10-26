using Microsoft.AspNetCore.Mvc;
using Team04_API.Data;
using Team04_API.Models.Company;
using Team04_API.Models.Department;
using Team04_API.Models.DTOs.Company;
using Team04_API.Models.Location;

namespace Team04_API.Repositries
{
    public class CompanyManagement(dataDbContext dbContext) : ICompanyManagement
    {
        public Task<IActionResult> AddTagsToDepartment(DepartmentTagDTO tag)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> CreateCompany(Company company)
        {
            
            throw new NotImplementedException();
        }

        public Task<IActionResult> CreateDepartment(Department department)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> CreateLocation(Location location)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> DeleteCompany(Company company)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> DeleteDepartment(Department department)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> DeleteLocation(Location location)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> GetCompany(Company company)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> GetDepartment(Department department)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> GetLocation(Location location)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> UpdateCompany(Company company)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> UpdateDepartment(Department department)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> UpdateLocation(Location location)
        {
            throw new NotImplementedException();
        }
    }
}
