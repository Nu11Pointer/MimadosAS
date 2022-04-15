namespace EntityLayer
{
    public class CustomerEmail
    {
        public int Id { get; set; }

        public Customer Customer { get; set; }

        public string Email { get; set; } = "";

        public bool Active { get; set; }
    }
}
