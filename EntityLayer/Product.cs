namespace EntityLayer
{
    public class Product
    {
        public int Id { get; set; }

        public ProductBrand ProductBrand { get; set; }

        public ProductCategory ProductCategory { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal SalePrice { get; set; }

        public int Stock { get; set; }

        public bool Active { get; set; }
    }
}
