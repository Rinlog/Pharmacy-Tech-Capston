namespace PharmPracticumBackend.DTO
{
    public class ordersDTO
    {
        public string? RxNum { get; set; }
        public string? PPR { get; set; }
        public string? DIN { get; set; }
        public string? PhysicianID { get; set; }
        public string? Status { get; set; }
        public string? Initiator { get; set; }
        public string? Verifier { get; set; }
        public string? DateSubmitted { get; set; }
        public string? DateLastChanged { get; set; }
        public string? DateVerified { get; set; }
        public string? SIG { get; set; }
        public string? SIGDescription { get; set; }
        public string? Form { get; set; }
        public string? Route { get; set; }
        public string? PrescribedDose { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
        public string? Quantity { get; set; }
        public string? StartDate { get; set; }
        public string? StartTime { get; set; }
        public string? OrderImage { get; set; }
        public string? PrintStatusID { get; set; }
        public string? Comments { get; set; }
    }
}
