namespace PharmPracticumBackend.DTO
{
    public class NotificationDTO
    {
        public String NotificationID { get; set; }
        public String NMessage { get; set; }
        public String Recipient {  get; set; }
        public bool Seen { get; set; }
        public String DateAdded { get; set; }
    }
}
