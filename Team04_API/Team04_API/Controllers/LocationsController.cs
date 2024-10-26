using Microsoft.AspNetCore.Mvc;
using Team04_API.Models.DTOs.CountriesDTOs;
using Team04_API.Models.Location;
using Team04_API.Repositries;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Team04_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationsMethods locationsMethods;

        public LocationsController(ILocationsMethods locationsMethods)
        {
            this.locationsMethods = locationsMethods;
        }
        // GET: api/<LocationsController>
        [HttpGet]
        public async Task<IEnumerable<Country>> Get()
        {
            return await locationsMethods.GetLocations();
        }

        // GET api/<LocationsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<LocationsController>
        [HttpPost]
        public async Task<IActionResult> Post(ImportLocationsDTO importLocationsDTO)
        {
            return await locationsMethods.LoadLocations(importLocationsDTO);
        }

        // PUT api/<LocationsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<LocationsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
