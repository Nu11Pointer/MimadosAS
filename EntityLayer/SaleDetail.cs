namespace EntityLayer
{
    public class SaleDetail
    {
        public int SaleId { get; set; }

        public int ProductId { get; set; }

        public decimal SalePrice { get; set; }

        public int Quantity { get; set; }

        public bool Active { get; set; }
    }
}
