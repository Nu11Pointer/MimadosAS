namespace EntityLayer
{
    public class Employee
    {
        public int Id { get; set; }

        public int EmployeePositionId { get; set; }

        public int BranchOfficeId { get; set; }

        public string IdentityCard { get; set; }

        public string Name { get; set; }

        public string SurName { get; set; }

        public string Address { get; set; }

        public int MunicipalityId { get; set; }

        public bool Active { get; set; }
    }
}
