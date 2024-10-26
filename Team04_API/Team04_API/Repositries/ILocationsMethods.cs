using Microsoft.AspNetCore.Mvc;
using Team04_API.Models.DTOs.CountriesDTOs;
using Team04_API.Models.Location;

namespace Team04_API.Repositries
{
    public interface ILocationsMethods
    {
        Task<IActionResult> LoadLocations(ImportLocationsDTO importLocationsDTO);

        Task<IEnumerable<Country>> GetLocations();
    }
}
