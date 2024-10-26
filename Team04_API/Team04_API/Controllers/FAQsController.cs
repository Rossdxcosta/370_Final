using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.DTOs.FAQsDTO;
using Team04_API.Models.FAQ;

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FAQsController : ControllerBase
    {
        private readonly dataDbContext _context;

        public FAQsController(dataDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllFAQs")]
        public async Task<ActionResult<IEnumerable<FAQDto>>> GetAllFAQs()
        {
            var faqs = await _context.FAQs
                .Include(f => f.FAQ_Category)
                .Select(f => new FAQDto
                {
                    faQ_ID = f.FAQ_ID,
                    faQ_Question = f.FAQ_Question,
                    faQ_Answer = f.FAQ_Answer,
                    faQ_Category_ID = f.FAQ_Category.FAQ_Category_ID,
                    faQ_Category_Name = f.FAQ_Category.FAQ_Category_Name
                })
                .ToListAsync();

            return Ok(faqs);
        }

        [HttpGet("GetFAQByID/{id}")]
        public async Task<ActionResult<FAQDto>> GetFAQByID(int id)
        {
            var faq = await _context.FAQs
                .Include(f => f.FAQ_Category)
                .Select(f => new FAQDto
                {
                    faQ_ID = f.FAQ_ID,
                    faQ_Question = f.FAQ_Question,
                    faQ_Answer = f.FAQ_Answer,
                    faQ_Category_ID = f.FAQ_Category.FAQ_Category_ID,
                    faQ_Category_Name = f.FAQ_Category.FAQ_Category_Name
                })
                .FirstOrDefaultAsync(f => f.faQ_ID == id);

            if (faq == null)
            {
                return NotFound();
            }

            return Ok(faq);
        }

        [HttpPost("AddFAQ")]
        public async Task<ActionResult<FAQDto>> AddFAQ(FAQDto faqDto)
        {
            var faq = new FAQ
            {
                FAQ_Question = faqDto.faQ_Question,
                FAQ_Answer = faqDto.faQ_Answer,
                FAQ_Category_ID = faqDto.faQ_Category_ID,
                User_ID = Guid.Parse(faqDto.User_ID) // User ID received from frontend
            };

            _context.FAQs.Add(faq);
            await _context.SaveChangesAsync();

            faqDto.faQ_ID = faq.FAQ_ID;

            return CreatedAtAction(nameof(GetFAQByID), new { id = faqDto.faQ_ID }, faqDto);
        }

        [HttpPut("UpdateFAQ/{id}")]
        public async Task<IActionResult> UpdateFAQ(int id, FAQDto faqDto)
        {
            if (id != faqDto.faQ_ID)
            {
                return BadRequest();
            }

            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null)
            {
                return NotFound();
            }

            faq.FAQ_Question = faqDto.faQ_Question;
            faq.FAQ_Answer = faqDto.faQ_Answer;
            faq.FAQ_Category_ID = faqDto.faQ_Category_ID;
            faq.User_ID = Guid.Parse(faqDto.User_ID); // User ID received from frontend

            _context.Entry(faq).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FAQExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("DeleteFAQ/{id}")]
        public async Task<IActionResult> DeleteFAQ(int id)
        {
            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null)
            {
                return NotFound();
            }

            _context.FAQs.Remove(faq);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("GetAllFAQCategories")]
        public async Task<ActionResult<IEnumerable<FAQCategoryDto>>> GetAllFAQCategories()
        {
            var categories = await _context.FAQ_Categories
                .Select(c => new FAQCategoryDto
                {
                    faQ_Category_ID = c.FAQ_Category_ID,
                    faQ_Category_Name = c.FAQ_Category_Name,
                    faQ_Category_Description = c.FAQ_Category_Description
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("GetFAQCategoryByID/{id}")]
        public async Task<ActionResult<FAQCategoryDto>> GetFAQCategoryByID(int id)
        {
            var category = await _context.FAQ_Categories
                .Select(c => new FAQCategoryDto
                {
                    faQ_Category_ID = c.FAQ_Category_ID,
                    faQ_Category_Name = c.FAQ_Category_Name,
                    faQ_Category_Description = c.FAQ_Category_Description
                })
                .FirstOrDefaultAsync(c => c.faQ_Category_ID == id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        [HttpPost("AddFAQCategory")]
        public async Task<ActionResult<FAQCategoryDto>> AddFAQCategory(FAQCategoryDto categoryDto)
        {
            var category = new FAQ_Category
            {
                FAQ_Category_Name = categoryDto.faQ_Category_Name,
                FAQ_Category_Description = categoryDto.faQ_Category_Description
            };

            _context.FAQ_Categories.Add(category);
            await _context.SaveChangesAsync();

            categoryDto.faQ_Category_ID = category.FAQ_Category_ID;

            return CreatedAtAction(nameof(GetFAQCategoryByID), new { id = categoryDto.faQ_Category_ID }, categoryDto);
        }

        [HttpPut("UpdateFAQCategory/{id}")]
        public async Task<IActionResult> UpdateFAQCategory(int id, FAQCategoryDto categoryDto)
        {
            if (id != categoryDto.faQ_Category_ID)
            {
                return BadRequest();
            }

            var category = await _context.FAQ_Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            category.FAQ_Category_Name = categoryDto.faQ_Category_Name;
            category.FAQ_Category_Description = categoryDto.faQ_Category_Description;

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FAQCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("DeleteFAQCategory/{id}")]
        public async Task<IActionResult> DeleteFAQCategory(int id)
        {
            var category = await _context.FAQ_Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.FAQ_Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Trying an extra method
        [HttpGet("GetFAQsAndCategories")]
        public async Task<ActionResult<IEnumerable<FAQWithCategoryDTO>>> GetFAQsAndCategories()
        {
            var faqsWithCategories = await _context.FAQs
                .Include(f => f.FAQ_Category)
                .Select(f => new FAQWithCategoryDTO
                {
                    FAQId = f.FAQ_ID,
                    Question = f.FAQ_Question,
                    Answer = f.FAQ_Answer,
                    CategoryId = f.FAQ_Category.FAQ_Category_ID,
                    CategoryName = f.FAQ_Category.FAQ_Category_Name,
                    CategoryDescription = f.FAQ_Category.FAQ_Category_Description
                })
                .ToListAsync();

            return Ok(faqsWithCategories);
        }


        private bool FAQExists(int id)
        {
            return _context.FAQs.Any(e => e.FAQ_ID == id);
        }

        private bool FAQCategoryExists(int id)
        {
            return _context.FAQ_Categories.Any(e => e.FAQ_Category_ID == id);
        }
    }
}
