using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Team04_API.Data;
using Team04_API.Models.Ticket.To_do_List;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Team04_API.Models.DTOs;

namespace Team04_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoListController : ControllerBase
    {
        private readonly dataDbContext _context;

        public ToDoListController(dataDbContext context)
        {
            _context = context;
        }

        [HttpPost("{ticketId}/checklists")]
        public async Task<IActionResult> CreateChecklist(int ticketId, [FromBody] To_do_List checklist)
        {
            checklist.Ticket_ID = ticketId;
            _context.To_do_List.Add(checklist);
            try
            {
                await _context.SaveChangesAsync();
                // Return the newly created checklist with its generated ID
                return Ok(checklist);
            }
            catch (DbUpdateException ex)
            {
                // Log the error with detailed information
                Console.WriteLine($"Error creating checklist: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "An error occurred while saving the checklist.", detail = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                // Log the error with detailed information
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }




        [HttpPost("{ticketId}/notes")]
        public async Task<IActionResult> CreateNote(int ticketId, [FromBody] ToDoListDTO noteDto)
        {
            // Logging the received payload
            Console.WriteLine("Received payload:");
            Console.WriteLine($"Ticket_ID: {noteDto.Ticket_ID}");
            Console.WriteLine($"Note_Description: {noteDto.Note_Description}");

            if (noteDto.Ticket_ID != ticketId || string.IsNullOrEmpty(noteDto.Note_Description))
            {
                return BadRequest("Invalid note payload.");
            }

            var note = new To_do_List_Items
            {
                Ticket_ID = ticketId,
                Note_Description = noteDto.Note_Description
            };

            _context.To_do_List_Items.Add(note);
            await _context.SaveChangesAsync();
            return Ok(note);
        }


        [HttpGet("{ticketId}/checklists")]
        public async Task<IActionResult> GetChecklists(int ticketId)
        {
            var checklists = await _context.To_do_List
                .Where(c => c.Ticket_ID == ticketId)
                .ToListAsync();

            if (checklists == null || !checklists.Any())
            {
                return NotFound();
            }

            return Ok(checklists);
        }

        [HttpGet("{ticketId}/notes")]
        public async Task<IActionResult> GetNotes(int ticketId)
        {
            var notes = await _context.To_do_List_Items
                .Where(n => n.Ticket_ID == ticketId)
                .ToListAsync();

            if (notes == null || !notes.Any())
            {
                return NotFound();
            }

            return Ok(notes);
        }

        [HttpPut("checklists/{checklistId}")]
        public async Task<IActionResult> UpdateChecklist(int checklistId, [FromBody] To_do_List checklist)
        {
            var existingChecklist = await _context.To_do_List.FindAsync(checklistId);
            if (existingChecklist == null)
            {
                return NotFound();
            }

            existingChecklist.Item_Description = checklist.Item_Description;
            existingChecklist.Is_Completed = checklist.Is_Completed;

            _context.To_do_List.Update(existingChecklist);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(existingChecklist);
            }
            catch (DbUpdateException ex)
            {
                // Log the error with detailed information
                Console.WriteLine($"Error updating checklist: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "An error occurred while updating the checklist.", detail = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                // Log the error with detailed information
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }



        [HttpPut("notes/{noteId}")]
        public async Task<IActionResult> UpdateNote(int noteId, [FromBody] To_do_List_Items note)
        {
            var existingNote = await _context.To_do_List_Items.FindAsync(noteId);
            if (existingNote == null)
            {
                return NotFound();
            }

            existingNote.Ticket_ID = note.Ticket_ID;
            existingNote.Ticket = note.Ticket;
            existingNote.To_Do_Note_ID = note.To_Do_Note_ID;
            existingNote.Note_Description = note.Note_Description;

            _context.To_do_List_Items.Update(existingNote);
            await _context.SaveChangesAsync();

            return Ok(existingNote);
        }

        [HttpDelete("checklists/{checklistId}")]
        public async Task<IActionResult> DeleteChecklist(int checklistId)
        {
            var checklist = await _context.To_do_List.FindAsync(checklistId);
            if (checklist == null)
            {
                return NotFound();
            }

            _context.To_do_List.Remove(checklist);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("notes/{noteId}")]
        public async Task<IActionResult> DeleteNote(int noteId)
        {
            var note = await _context.To_do_List_Items.FindAsync(noteId);
            if (note == null)
            {
                return NotFound();
            }

            _context.To_do_List_Items.Remove(note);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{ticketId}/todolist")]
        public async Task<IActionResult> DeleteToDoList(int ticketId)
        {
            var checklists = _context.To_do_List.Where(c => c.Ticket_ID == ticketId);
            var notes = _context.To_do_List_Items.Where(n => n.Ticket_ID == ticketId);

            _context.To_do_List.RemoveRange(checklists);
            _context.To_do_List_Items.RemoveRange(notes);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }

}   

