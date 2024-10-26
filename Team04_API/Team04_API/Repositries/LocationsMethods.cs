using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Team04_API.Data;
using Team04_API.Models.DTOs.CountriesDTOs;
using Team04_API.Models.Location;

namespace Team04_API.Repositries
{
    public class LocationsMethods(dataDbContext _DbContext) : ILocationsMethods
    {

        public async Task<IEnumerable<Country>>  GetLocations()
        {

            var Countries = await _DbContext.Country.Include(a => a.states).ThenInclude(b => b.Cities).ToListAsync();
            return Countries;
        }

        public async Task<IActionResult> LoadLocations(ImportLocationsDTO importLocationsDTO)
        {
            foreach (var country in importLocationsDTO.Countries)
            {
                var checkcountry = await _DbContext.Country.Where(a => a.iso3Code == country.iso3).ToListAsync();

                if (!checkcountry.Any())
                {
                    var countryOBJ = new Country { Country_Name = country.Name, iso3Code = country.iso3, native = country.native, Region = country.region, phone_code = country.phone_code, SubRegion = country.subregion, states = new List<State>() };
                    await _DbContext.Country.AddAsync(countryOBJ);

                    foreach (var state in country.states)
                    {
                        var stateOBJ = new State { Name = state.Name, State_Code = state.State_code, Country_ID = countryOBJ.Country_ID, Country = countryOBJ, Cities = new List<City>() };
                        await _DbContext.States.AddAsync(stateOBJ);
                        foreach (var city in state.Cities)
                        {
                            var cityOBJ = new City { Name = city.Name, State_ID = stateOBJ.Id, State = stateOBJ };
                            await _DbContext.City.AddAsync(cityOBJ);

                        }
                    }
                    await _DbContext.SaveChangesAsync();
                }
                
            }

            

            return new OkObjectResult("Locations Imported");
            //throw new NotImplementedException();
        }
    }
}
