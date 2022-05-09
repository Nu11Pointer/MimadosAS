using System.Globalization;

namespace EntityLayer
{
    public class SaleDetail
    {
        public int SaleId { get; set; }

        public Product Product { get; set; }

        public decimal SalePrice { get; set; }

        public int Quantity { get; set; }

        public bool Active { get; set; }

        public decimal Total
        {
            get
            {
                return Quantity * SalePrice;
            }
        }

        public string StringSalePrice
        {
            get { return SalePrice.ToString("C2", new CultureInfo("es-Ni")); }
        }

        public string StringTotal
        {
            get { return Total.ToString("C2", new CultureInfo("es-Ni")); }
        }
    }
}
