namespace EntityLayer
{
    public class BranchOfficePhone
    {
        public int Id { get; set; }

        public BranchOffice BranchOffice { get; set; }

        public string PhoneNumber { get; set; }

        public bool Active { get; set; }
    }
}
