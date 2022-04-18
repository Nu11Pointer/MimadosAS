namespace EntityLayer
{
    public class Supplier
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public Municipality Municipality { get; set; }

        public bool Active { get; set; }
    }
}
