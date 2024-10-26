using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Team04_API.Models.Software
{
    [PrimaryKey(nameof(VDI), nameof(Software))]
    public class Software_VDI
    {
        public int VDI_ID { get; set; }
        public int Software_ID { get; set; }

        //VIRTUAL ITEMS
        public virtual VDI.VDI? VDI { get; set; }
        public virtual Software? Software { get; set; }
    }
}
