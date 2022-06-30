using System.Globalization;

namespace EntityLayer
{
    public class Earning
    {
        private readonly string[] _Label = new string[]
        { "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" };

        public string Label
        {
            get
            {
                return _Label[Month - 1];
            }
        }

        public int Month { get; set; }

        public int Year { get; set; }

        public decimal SubTotal { get; set; }

        public string StringSubTotal
        {
            get { return SubTotal.ToString("C2", new CultureInfo("es-Ni")); }
        }
    }
}
