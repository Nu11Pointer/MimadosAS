namespace EntityLayer
{
    public class SupplierEmail
    {
        public int Id { get; set; }

        public Supplier Supplier { get; set; }

        public string Email { get; set; }

        public bool Active { get; set; }
    }
}
