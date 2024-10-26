using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Department
{
    [PrimaryKey(nameof(Department), nameof(Location))]
    public class DepartmentLocation
    {
        public int Department_ID { get; set; }
        public int Location_ID { get; set; }

        //VIRTUAL ITEMS
        public virtual Department? Department { get; set; }
        public virtual Location.Location? Location { get; set; }
    }
}
