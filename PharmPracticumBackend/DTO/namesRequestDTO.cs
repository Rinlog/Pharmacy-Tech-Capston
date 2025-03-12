namespace PharmPracticumBackend.DTO
{
    public class namesRequestDTO
    {
        public string UserID { get; set; }
        public string UserFName { get; set; }
        public string UserLName { get; set; }
        public string PPR { get; set; }
        public string PatientFName { get; set; }
        public string PatientLName { get; set;}
        public string PhysicianID { get; set;}
        public string PhysicianFName { get; set; }
        public string PhysicianLName { get;set; }
        public string DIN { get; set; }

        public string DrugName { get; set; }
    }
}
