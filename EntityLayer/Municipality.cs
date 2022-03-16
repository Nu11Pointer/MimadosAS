namespace EntityLayer
{
    public class Municipality
    {
        public int Id { get; set; }

        public Department Department { get; set; }

        public string Name { get; set; }

        public bool Active { get; set; }
    }
}
