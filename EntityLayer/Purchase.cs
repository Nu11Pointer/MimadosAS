using System;

namespace EntityLayer
{
    public class Purchase
    {
        public int ProductId { get; set; }

        public int SupplierId { get; set; }

        public int Quantity { get; set; }

        public decimal PurchasePrice { get; set; }

        public DateTime TimeStamp { get; set; }

        public bool Active { get; set; }
    }
}
