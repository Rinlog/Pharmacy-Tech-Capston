using System.Text.RegularExpressions;
using System.Xml.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PharmPracticumBackend.Sanitization
{
    public class SanitizationClass
    {

        //clean email input
        public string SanitizeEmail(string email)
        {

            //trim whitespace
            email = email.Trim();

            //to lower
            email = email.ToLower();

            //remove special chars
            string regexPattern = @"[^a-zA-Z0-9._%+-@]";

            string sanitizedEmail = Regex.Replace(email, regexPattern, "");

            return sanitizedEmail;

        }

        // general sanitization function
        public string SanitizeInput(string input)
        {
            //Regex pattern allows numbers (0-9), uppercase letters (A-Z), lowercase letters (a-z), period (.), apostrophe ('), hyphen/dash (-), and spaces
            string pattern = @"[^0-9A-Za-z.'\s-]";

            string sanitizedInput = Regex.Replace(input, pattern, "");

            return sanitizedInput;

        }

        //clean personal names
        public string SanitizeName(string name)
        {
            //Regex pattern allows uppercase letters (A-Z), lowercase letters (a-z), period (.), apostrophe ('), hyphen/dash (-), and spaces
            string pattern = @"[^A-Za-z.'\s-]";

            string sanitizedName = Regex.Replace(name, pattern, "");

            return sanitizedName;

        }

        public string SanitizeUserID(string userID)
        {
            //regex pattern allows upercase letters, lowercase letters and numbers
            string pattern = @"[^0-9a-zA-Z]";

            string sanitizedID = Regex.Replace(userID, pattern, "");

            return sanitizedID;

        }

        public string SanitizeNumber(string number)
        {
            //regex pattern allows numbers
            string pattern = @"[^0-9]";

            string sanitizedNumber = Regex.Replace(number, pattern, "");

            return sanitizedNumber;

        }

        public string SanitizePhysicianID(string id)
        {

            // Regex pattern allows only the format FLXXXX, where F and L are initials, and XXXX is a four digit number
            string pattern = @"^[A-Z]{2}\d{4}$";

            string sanitizedPhysician = Regex.Match(id, pattern).Value;

            return sanitizedPhysician;

        }

        public string SanitizeDose(string dose)
        {

            string pattern = @"^[A-Za-z0-9/.\-' ]+$";

            string sanitizedDose = Regex.Match(dose, pattern).Value;

            return sanitizedDose;

        }

        public string SanitizeDate(string date)
        {

            string pattern = @"^[\d\-:.\s]+$";

            string sanitizedDate = Regex.Match(date, pattern).Value;

            return sanitizedDate;

        }

        public string SanitizeTime(string time)
        {

            // Regex pattern allows two digits followed by a colon and two more digits (ex. 11:11)
            string pattern = @"^\d{2}:\d{2}$";

            string sanitizedDate = Regex.Match(time, pattern).Value;

            return sanitizedDate;

        }

        public string SanitizeComments(string comments)
        {

            // Regex pattern allows numbers (0-9), uppercase letters (A-Z), lowercase letters (a-z), period (.), apostrophe ('), hyphen/dash (-), spaces and slashes (/)
            string pattern = @"^[A-Za-z0-9.'/\s-]+$";

            string sanitizedComments = Regex.Match(comments, pattern).Value;

            return sanitizedComments;

        }

        public bool HasNullProperty<T>(T obj)
        {
            var type = obj.GetType();
            var properties = type.GetProperties();

            foreach (var property in properties)
            {
                if (property.GetValue(obj) == null)
                {
                    return true;
                }
            }

            return false;
        }


    }
}
