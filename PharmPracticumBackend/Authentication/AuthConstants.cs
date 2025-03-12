namespace PharmPracticumBackend.Authentication
{
    public  class AuthConstants
    {
        public readonly string key;
        public readonly string header = "Key-Auth";
        public AuthConstants(IConfiguration configuration)
        {
            key = configuration.GetValue<String>("ExpectedHash:Hash");
        }
        


    }
}
