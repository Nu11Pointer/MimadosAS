using System;
using System.Collections.Generic;
using System.Globalization;

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

        public string StringTimeStamp { get; set; }

        public bool Active { get; set; }

        public decimal Total
        {
            get
            {
                decimal total = 0;

                for (int i = 0; i < SaleDetails.Count; i++)
                {
                    total += SaleDetails[i].Total;
                }
                return total;
            }
        }

        public decimal Taxes
        {
            get { return (decimal)((float)Total / 1.15 * 0.15); }
        }

        public decimal SubTotal
        {
            get { return (decimal)((float)Total / 1.15); }
        }

        public string StringTotal
        {
            get
            {
                return $"{Total.ToString("C2", new CultureInfo("es-Ni"))}";
            }
        }

        public string StringTaxes
        {
            get
            {
                return $"{Taxes.ToString("C2", new CultureInfo("es-Ni"))}";
            }
        }

        public string StringSubTotal
        {
            get
            {
                return $"{SubTotal.ToString("C2", new CultureInfo("es-Ni"))}";
            }
        }
    }
}
