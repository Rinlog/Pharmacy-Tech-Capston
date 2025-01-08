using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhysicianController : ControllerBase
    {
        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;

        public PhysicianController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

        }

        [HttpPost("getphysicians")]
        public async Task<IActionResult> GetPhysicians()
        {

            List<physiciansDTO> physicians = await _pharmDL.GetAllPhysicians();

            return Ok(new { data = physicians });

        }

        [HttpPost("addphysician")]
        public async Task<IActionResult> AddPhysician([FromBody] physiciansDTO physician)
        {
            // Make sure we got something
            if (physician == null)
            {
                return BadRequest(new { message = "Null input" });
            }

            // Make sure none of the properties are null
            if (_sanitization.HasNullProperty(physician))
            {
                return BadRequest(new { message = "Submission has a null property" });
            }

            // Call the DL
            string result = await _pharmDL.AddPhysicianAsync(physician);

            Console.WriteLine("Called DL:" + result);

            // Check the result
            if (string.Equals(result, "Physician added"))
            {
                return Ok(result);
            }

            return BadRequest(new { message = "Physician could not be added." });
        }

        [HttpPost("editphysician")]
        public async Task<IActionResult> EditPhysician([FromBody] physiciansDTO physician)
        {
            // Check that the ID isn't null
            if (physician == null || physician.PhysicianID == null)
            {
                return BadRequest(new { message = "Null Physician" });
            }

            // Make sure none of the attributes are null
            if (_sanitization.HasNullProperty(physician))
            {
                return BadRequest(new { message = "Submission has a null property" });
            }


            // Call DL
            string result = await _pharmDL.EditPhysicianAsync(physician);

            if (string.Equals(result, "Physician updated"))
            {
                return Ok();
            }
            else
            {
                return BadRequest(new { message = result });
            }

        }

        [HttpPost("deletephysician")]
        public async Task<IActionResult> DeletePhysician([FromBody] physiciansDTO physician)
        {
            // Check that the ID isn't null
            if (physician == null || physician.PhysicianID == null)
            {
                return BadRequest(new { message = "Null Physician" });
            }

            // Call DL
            string result = await _pharmDL.DeletePhysicianAsync(physician.PhysicianID);

            if (string.Equals(result, "Physician Deleted"))
            {
                return Ok();
            }
            else
            {
                return BadRequest(new { message = result });
            }

        }

        [HttpPost("bulkphysician")]
        public async Task<IActionResult> BulkPhysician([FromBody] List<physiciansDTO> physicians)
        {
            List<string> results = new List<string>();
            Console.WriteLine("Bulkphysician");
            try
            {
                foreach (physiciansDTO physician in physicians)
                {
                    Console.WriteLine($"Physician {physician.FName}");
                    string result = await _pharmDL.AddPhysicianAsync(physician);

                    // If there was an issue with adding the physician, add it to results
                    // We don't want to clutter the response with successes
                    if (!string.Equals(result, "Physician added"))
                    {
                        results.Add(result + "\n");
                    }
                }
                Console.WriteLine("We did it");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = ex.ToString() });
            }

            return Ok(new { data = results });
        }
    }
}
