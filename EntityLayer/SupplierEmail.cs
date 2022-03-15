namespace EntityLayer
{
    public class SupplierEmail
    {
        public int Id { get; set; }

        public int SupplierId { get; set; }

        public string Email { get; set; }

        public bool Active { get; set; }
    }
}
