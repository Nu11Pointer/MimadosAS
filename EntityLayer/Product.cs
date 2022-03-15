namespace EntityLayer
{
    public class Product
    {
        public int Id { get; set; }

        public int ProductBrandId { get; set; }

        public int ProductCategoryId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal SalePrice { get; set; }

        public int Stock { get; set; }

        public bool Active { get; set; }
    }
}
