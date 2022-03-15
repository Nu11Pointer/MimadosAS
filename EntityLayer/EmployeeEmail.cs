namespace EntityLayer
{
    public class EmployeeEmail
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public string Email { get; set; } = "";

        public bool Active { get; set; }
    }
}
