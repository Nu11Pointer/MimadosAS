namespace EntityLayer
{
    public class BranchOfficePhone
    {
        public int Id { get; set; }

        public int BranchOfficeId { get; set; }

        public string PhoneNumber { get; set; }

        public bool Active { get; set; }
    }
}
