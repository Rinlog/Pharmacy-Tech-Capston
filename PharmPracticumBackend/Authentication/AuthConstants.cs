namespace PharmPracticumBackend.Authentication
{
    public  class AuthConstants
    {
        private readonly string key;

        public AuthConstants(IConfiguration configuration)
        {
            key = configuration.GetValue<String>("ExpectedHash:Hash");
        }
        


    }
}
