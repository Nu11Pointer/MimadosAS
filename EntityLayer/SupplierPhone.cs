namespace EntityLayer
{
    public class SupplierPhone
    {
        public int Id { get; set; }

        public Supplier Supplier { get; set; }

        public string PhoneNumber { get; set; }

        public bool Active { get; set; }
    }
}
