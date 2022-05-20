using System.Globalization;

namespace EntityLayer
{
    public class PurchaseDetails
    {
        public int PurchaseId { get; set; }

        public Product Product { get; set; }

        public decimal PurchasePrice { get; set; }

        public int Quantity { get; set; }

        public bool Active { get; set; }

        public decimal Total
        {
            get
            {
                return Quantity * PurchasePrice;
            }
        }

        public string StringSalePrice
        {
            get { return PurchasePrice.ToString("C2", new CultureInfo("es-Ni")); }
        }

        public string StringTotal
        {
            get { return Total.ToString("C2", new CultureInfo("es-Ni")); }
        }
    }
}
