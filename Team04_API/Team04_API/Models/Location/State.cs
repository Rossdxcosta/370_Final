namespace Team04_API.Models.Location
{
    public class State
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string State_Code { get; set; }
        public int Country_ID { get; set; }
        public List<City> Cities { get; set; }

        //Virtual
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual Country Country { get; set; }
    }
}
