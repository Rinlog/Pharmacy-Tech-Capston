using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;
using System.Linq.Expressions;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagementController : ControllerBase
    {

        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;

        public ManagementController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

        }

        [HttpPost("getusers")]
        public async Task<IActionResult> GetAllUsers()
        {

            List<usersDTO> users = await _pharmDL.GetAllUsers();

            return Ok(new { data = users });

        }

        [HttpPost("edituser")]
        public async Task<IActionResult> EditUser([FromBody] editedUserDTO user)
        {

            //sanitize data
            user.FName = _sanitization.SanitizeName(user.FName);

            //convert admin/active
            if (user.Admin == "Yes") user.Admin = "1";
            else user.Admin = "0";

            if (user.Active == "Yes") user.Active = "1";
            else user.Active = "0"; //changed from user.Admin to user.Active

            string result = await _pharmDL.EditUser(user);

            return Ok(new { message = result });

        }

        [HttpPost("deleteuser")]
        public async Task<IActionResult> DeleteUser([FromBody] string userID)
        {

            //clean user ID
            string sanitizedID = _sanitization.SanitizeUserID(userID);

            //return failure if cleaned ID does not have 6 chars
            if (userID.Length != 6) return Ok(new { message = "Invalid User" });

            string result = await _pharmDL.DeleteUser(userID);

            return Ok(new { message = result });

        }

        [HttpPost("getnames")]
        public async Task<IActionResult> GetNames([FromBody] namesRequestDTO request)
        {
            // Call the DL and check if there was an error
            namesRequestDTO response = await _pharmDL.GetNames(request);
            // The error is stored in the userFName field
            if (response.UserFName.Contains("Error:"))
            {
                return BadRequest(response.UserFName);
            }

            // No errors happened so return the namesRequest object
            return Ok(response);


        }

    }
}
