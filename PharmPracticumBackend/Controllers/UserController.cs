using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;
using System.Data.SqlClient;
using System.Reflection;
using System.Runtime.Versioning;
using System.Text.RegularExpressions;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;

        public UserController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] loginDTO login)
        {

            //clean the email input
            string email = _sanitization.SanitizeEmail(login.Email);

            //run DL command
            authUserDTO user = await _pharmDL.ValidateUserAsync(email, login.Password);
            //if we don't get a real user, we return that info
            switch (user.UserId)
            {
                case "expired": 
                    return Ok(new { message = "Account has expired" });
                case "account removed":
                    return Ok(new { message = "Account has been removed" });
                case "password error":
                    return Ok(new { message = "Account can not be logged into currently" });
                case "account inactive":
                    return Ok(new { message = "Account currently not active" });
                case "":
                    return Ok(new { message = "Wrong email or password entered." });
                default:
                    break;
            }

            return Ok(new { data = user });

        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] signupDTO signup)
        {

            //confirm a non-empty submission
            if(_sanitization.HasNullProperty(signup))
            {
                // Something is empty, we can't sign this user up
                return BadRequest(new { message = "Submission has a null property" });
            }

            //hash password
            PasswordHasher<object> hasher = new PasswordHasher<object>();

            string hashPass = hasher.HashPassword(null, signup.Password);

            //check if user is an Admin
            bool isAdmin = false;

            string adminExt = "nbcc.ca";

            string adminPattern = $"^[a-zA-Z0-9._%+-]+@{Regex.Escape(adminExt)}$";

            if (Regex.IsMatch(signup.Email, adminPattern))
            {
                isAdmin = true;
            }


            signup.Password = hashPass;

            // DL call
            string result = await _pharmDL.SignupUserAsync(signup, isAdmin);

            //if email already exists, return here
            if (string.Equals(result, "Email already exists"))
            {
                return BadRequest(new { message = result });
            }
            //successful insert
            else if (string.Equals(result, "User added successfully"))
            {

                string id = await _pharmDL.GetIDByEmailAsync(signup.Email);
                string code = await _pharmDL.CreateCode(id, "Confirmation");

                // Make sure nothing went wrong with generating and inserting the code
                if (code != null)
                {
                    _pharmDL.SendEmail(signup.Email, code, id, "Confirmation");
                    return Ok(new { message = result });
                }
                else
                {
                    return BadRequest(new { message = "Something went wrong, please try again"});
                }

            }
            //otherwise unsuccessful insert
            else
            {
                return BadRequest(new { message = result });
            }

        }

        [HttpPost("confirmation")]
        public async Task<IActionResult> Confirmation([FromBody] confirmationDTO confirmation)
        {
            // Get the code and ID from the DTO
            string codeString = confirmation.Code;
            string userID = confirmation.UserID;

            if(!int.TryParse(codeString, out int code))
            {
                return BadRequest(new { message = "Code is not a number" });
            }

            // Check the data, BadRequest if its null
            if (userID == null)
            {
                return BadRequest(new { message = "Null input" });
            }

            // Check if the user is already active
            bool active = await _pharmDL.IsUserActive(userID);
            if (active)
            {
                return BadRequest(new { message = "User already active" });
            }

            // Call the DL
            bool success = await _pharmDL.ConfirmAccountAsync(code, userID);
            if (success)
            {
                return Ok(new { message = "Account confirmed" });
            }
            else
            {
                return BadRequest(new { message = "Did not find user/code pair" });
            }
        }

        [HttpPost("resetrequest")]
        public async Task<IActionResult> ResetRequest([FromBody] resetRequestDTO resetRequest)
        {
            // Get the email from the DTO
            string email = resetRequest.Email;

            // Make sure the email isnt null
            if(email == null)
            {
                return BadRequest(new { message = "Null input" });
            }

            // Call the DL to get the ID
            string id = await _pharmDL.GetIDByEmailAsync(email);

            // Make sure we actually got an ID back
            if(id == "")
            {
                return BadRequest(new { message = "Email not registered" });
            }

            // Generate a code for password reset
            string code = await _pharmDL.CreateCode(id, "Reset");

            // Make sure nothing went wrong with generating and inserting the code
            if (code != null)
            {
                // If nothing went wrong, send the email
                _pharmDL.SendEmail(email, code, id, "Reset");
                return Ok(new { message = "Password reset email sent" });
            }
            else
            {
                return BadRequest(new { message = "Unable to complete request"});
            }
        }

        [HttpPost("passwordreset")]
        public async Task<IActionResult> PasswordReset([FromBody] passwordResetDTO passwordReset)
        {
            string newPassword = passwordReset.Password;
            string userID = passwordReset.UserID;
            string code = passwordReset.Code;

            // Make sure the new password isnt null
            if(newPassword == null)
            {
                return BadRequest(new { message = "Null input" });
            }

            // Hash the password
            PasswordHasher<object> hasher = new PasswordHasher<object>();

            string hashPass = hasher.HashPassword(null, newPassword);

            bool success = await _pharmDL.ConfirmResetAsync(code, userID, hashPass);

            return Ok(new { message = "We did it: " + success });
        }

        [HttpPost("bulkadd")]
        public async Task<IActionResult> BulkUserAdd([FromBody] List<bulkUserDTO> users)
        {

            List<string> results = new List<string>();

            //sanitize data
            foreach (bulkUserDTO userDTO in users)
            {
                userDTO.FirstName = _sanitization.SanitizeName(userDTO.FirstName);
                userDTO.LastName = _sanitization.SanitizeName(userDTO.LastName);
                userDTO.Email = _sanitization.SanitizeEmail(userDTO.Email);
                userDTO.Campus = _sanitization.SanitizeName(userDTO.Campus);

                //ensure email is valid nbcc email
                string pattern = @"\b[A-Za-z0-9._%+-]+@(?:nbcc|mynbcc)\.ca\b";

                if (!Regex.IsMatch(userDTO.Email, pattern)) userDTO.ShouldInsert = "N";
                else userDTO.ShouldInsert = "Y";

                Console.WriteLine(userDTO.Email + " " + userDTO.FirstName + " " + userDTO.ShouldInsert);

            }

            //run insert
            users = await _pharmDL.BulkUserAsync(users);

            //check results
            foreach (bulkUserDTO userDTO in users)
            {
                results.Add(userDTO.InsertResult);
            }

            //send confirmation for any successes
            foreach (bulkUserDTO user in users)
            {
                if (user.IsInserted != null && user.IsInserted.Equals("Y"))
                {
                    string id = await _pharmDL.GetIDByEmailAsync(user.Email);
                    string code = await _pharmDL.CreateCode(id, "Confirmation");

                    if (code != null)
                    {
                        _pharmDL.SendEmail(user.Email, code, id, "Confirmation");
                    }
                }
            }
            
            return Ok(new { data = results });

        }

        [HttpPost("bulkpassset")]
        //if user was bulk added, they need to set pass
        public async Task<IActionResult> BulkPassSet([FromBody] string UserID)
        {

            Console.WriteLine("About to run check");
            //does the user need to set a pass?
            bool allow = await _pharmDL.AllowPassSet(UserID);
            Console.WriteLine("Check resulted in " + allow);
            return Ok(new { data = allow });
            
        }

    }
}
