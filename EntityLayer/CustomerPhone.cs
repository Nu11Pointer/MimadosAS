namespace EntityLayer
{
    public class CustomerPhone
    {
        public int Id { get; set; }

        public Customer Customer { get; set; }

        public string PhoneNumber { get; set; } = "";

        public bool Active { get; set; }
    }
}
