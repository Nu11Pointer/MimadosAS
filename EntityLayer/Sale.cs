using System;

namespace EntityLayer
{
    public class Sale
    {
        public int Id { get; set; }

        public int CurrencyId { get; set; }

        public int PaymentTypeId { get; set; }

        public int CustomerId { get; set; }

        public int EmployeeId { get; set; }

        public decimal Payment { get; set; }

        public DateTime TimeStamp { get; set; }

        public bool Active { get; set; }
    }
}
