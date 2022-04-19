using System;

namespace EntityLayer
{
    public class Purchase
    {
        public Product Product { get; set; }

        public Supplier Supplier { get; set; }

        public int Quantity { get; set; }

        public decimal PurchasePrice { get; set; }

        public DateTime TimeStamp { get; set; }

        public string StringTimeStamp { get; set; }

        public bool Active { get; set; }
    }
}
