namespace PharmPracticumBackend.DTO
{
    public class addOrderDTO
    {

        public string? PPR {  get; set; }
        public string? DIN { get; set; }
        public string? PhysicianID { get; set; }
        public string? Initiator { get; set; }
        public string? SIG { get; set; }
        public string? SIGDescription { get; set; }
        public string? Form {  get; set; }
        public string? Route { get; set; }
        public string? Dose { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
        public string? Quantity { get; set; }
        public string? StartDate { get; set; }
        public string? StartTime { get; set; }
        public string? OrderImage { get; set; }
        public string? Comments { get; set; }
    }
}
