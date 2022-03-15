namespace EntityLayer
{
    public class CustomerPhone
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string PhoneNumber { get; set; } = "";

        public bool Active { get; set; }
    }
}
