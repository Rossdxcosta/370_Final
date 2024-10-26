using global::Team04_API.Data;
using global::Team04_API.Models.Software;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Team04_API.Models.Company;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

    namespace Team04_API.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]

        public class CompanyController : ControllerBase
        {
            private readonly dataDbContext _context;

            public CompanyController(dataDbContext context)
            {
                _context = context;
            }

            [HttpPost]
            [Route("CreateCompany")]
            public async Task<Company> CreateCompany(Company company)
            {
                try
                {
                    await _context.Company.AddAsync(company);
                    await _context.SaveChangesAsync();

                    return company;
                }
                catch (Exception)
                {

                    throw;
                }
            }

            [HttpGet]
            [Route("GetAllCompanies")]
            public async Task<IEnumerable<Company>> GetAllCompanies()
            {
                return await _context.Company.ToListAsync();
            }

        [HttpPut]
        [Route("UpdateCompany/{id}")]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] Company updatedCompany)
        {
            try
            {
                var company = await _context.Company.FindAsync(id);
                if (company == null)
                {
                    return NotFound($"Company with ID {id} not found.");
                }
                company.Company_Name = updatedCompany.Company_Name;
                await _context.SaveChangesAsync();
                return Ok(company);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpDelete]
        [Route("DeleteCompany/{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            try
            {
                var company = await _context.Company.FindAsync(id);
                if (company == null)
                {
                    return NotFound($"Company with ID {id} not found.");
                }
                _context.Company.Remove(company);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpPost]
            [Route("RequestCompany")]
            public async Task<IActionResult> RequestCompany(string companyName, Guid clientID, string companyLocation)
            {
                try
                {
                    var result = await _context.Company_Request.AddAsync(
                    new Company_Request { Client_ID = clientID, Company_Name = companyName, Location = companyLocation, Request_Date = DateTime.UtcNow });
                    await _context.SaveChangesAsync();

                    return Ok();
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }
    }