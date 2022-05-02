using System;
using System.Collections.Generic;

namespace EntityLayer
{
    public class Sale
    {
        public int Id { get; set; }

        public Currency Currency { get; set; }

        public PaymentType PaymentType { get; set; }

        public Customer Customer { get; set; }

        public Employee Employee { get; set; }

        public List<SaleDetail> SaleDetails { get; set; }

        public decimal Payment { get; set; }

        public DateTime TimeStamp { get; set; }

        public bool Active { get; set; }

    }
}
