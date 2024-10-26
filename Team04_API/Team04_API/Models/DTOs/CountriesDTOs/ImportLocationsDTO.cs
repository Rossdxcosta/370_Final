namespace Team04_API.Models.DTOs.CountriesDTOs
{
    public class ImportLocationsDTO
    {
        public List<ACountry> Countries { get; set; }
    }

    public class ACountry
    {
        public string Name { get; set; }
        public string iso3 { get; set; }
        public string phone_code { get; set; }
        public string? native {  get; set; }
        public string region { get; set; }
        public string subregion { get; set; }

        public List<AState> states { get; set; }

    }

    public class AState
    {
        public string Name { get; set; }
        public string State_code { get; set; }
        public List<ACity> Cities { get; set; }

    }

    public class ACity
    {
        public string Name { get; set; }
    }

}
