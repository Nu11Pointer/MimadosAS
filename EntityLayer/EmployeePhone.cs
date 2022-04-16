namespace EntityLayer
{
    public class EmployeePhone
    {
        public int Id { get; set; }

        public Employee Employee { get; set; }

        public string PhoneNumber { get; set; }

        public bool Active { get; set; }
    }
}
