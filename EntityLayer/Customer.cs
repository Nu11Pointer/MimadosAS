namespace EntityLayer
{
    public class Customer
    {
        public int Id { get; set; }

        public string IdentityCard { get; set; }

        public string Name { get; set; }

        public string SurName { get; set; }

        public string Address { get; set; }

        public Municipality Municipality { get; set; }

        public bool Active { get; set; }
    }
}
