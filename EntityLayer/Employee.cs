namespace EntityLayer
{
    public class Employee
    {
        public int Id { get; set; }

        public EmployeePosition EmployeePosition { get; set; }

        public BranchOffice BranchOffice { get; set; }

        public string IdentityCard { get; set; }

        public string Name { get; set; }

        public string SurName { get; set; }

        public string FullName { get { return $"{SurName} {Name}"; } }

        public string Address { get; set; }

        public Municipality Municipality { get; set; }

        public bool Active { get; set; }
    }
}
