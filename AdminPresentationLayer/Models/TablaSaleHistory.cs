using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdminPresentationLayer.Models
{
    public class TablaSaleHistory
    {
        public List<EntityLayer.Sale> Sale { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
    }
}