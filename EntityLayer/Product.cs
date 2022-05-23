namespace EntityLayer
{
    public class Product
    {
        public int Id { get; set; }

        public ProductBrand ProductBrand { get; set; }

        public ProductCategory ProductCategory { get; set; }

        public ProductPackaging ProductPackaging { get; set; }

        public ProductMeasurementUnit ProductMeasurementUnit { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal NetContent { get; set; }

        public string StringNetContent
        {
            get 
            {
                if (ProductMeasurementUnit == null || ProductPackaging == null)
                {
                    return "";
                }
                return $"{ProductPackaging.Name} de {NetContent:F2} {ProductMeasurementUnit.Symbol}";
            }
        }

        public decimal SalePrice { get; set; }

        public int Stock { get; set; }

        public bool Active { get; set; }
    }
}
