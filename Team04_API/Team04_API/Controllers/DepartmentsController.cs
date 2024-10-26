using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.Department;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController(dataDbContext dbContext) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] Department department)
        {
            if (department.TagIds != null && department.TagIds.Any())
            {
                department.Tag = await dbContext.Tag
                                               .Where(t => department.TagIds.Contains(t.Tag_ID))
                                               .ToListAsync();
            }

            dbContext.Department.Add(department);
            await dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department department)
        {
            if (id != department.Department_ID)
                return BadRequest();

            var existingDepartment = await dbContext.Department.Include(d => d.Tag)
                                                               .FirstOrDefaultAsync(d => d.Department_ID == id);
            if (existingDepartment == null)
                return NotFound();

            existingDepartment.Department_Name = department.Department_Name;
            existingDepartment.Department_Description = department.Department_Description;

            if (department.TagIds != null && department.TagIds.Any())
            {
                existingDepartment.Tag = await dbContext.Tag
                                                       .Where(t => department.TagIds.Contains(t.Tag_ID))
                                                       .ToListAsync();
            }
            else
            {
                existingDepartment.Tag.Clear();
            }

            await dbContext.SaveChangesAsync();
            return NoContent();
        }
        private readonly dataDbContext dbContext = dbContext;

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await dbContext.Department.Include(d => d.Tag).ToListAsync();

            List<DepartmentDTO> departmentDtos = new List<DepartmentDTO>();

            // Loop through each department and map it to a DepartmentDTO
            foreach (var department in departments)
            {
                DepartmentDTO dto = new DepartmentDTO
                {
                    Department_ID = department.Department_ID,
                    Department_Name = department.Department_Name,
                    Department_Description = department.Department_Description,
                    TagIds = department.Tag.Select(t => t.Tag_ID).ToList() // Mapping tag IDs
                };

                // Add the mapped DTO to the list
                departmentDtos.Add(dto);
            }

            return Ok(departmentDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            var department = await dbContext.Department.Include(d => d.Tag)
                            .FirstOrDefaultAsync(d => d.Department_ID == id);

            if (department == null)
                return NotFound();


            var departmentDto = new DepartmentDTO
            {
                Department_ID = department.Department_ID,
                Department_Name = department.Department_Name,
                Department_Description = department.Department_Description,
                TagIds = department.Tag.Select(t => t.Tag_ID).ToList()
            };

            return Ok(departmentDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await dbContext.Department.FindAsync(id);
            if (department == null)
                return NotFound();

            dbContext.Department.Remove(department);
            await dbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
