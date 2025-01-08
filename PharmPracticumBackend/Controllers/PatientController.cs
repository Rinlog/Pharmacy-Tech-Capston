using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {

        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;

        public PatientController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

        }

        [HttpPost("getpatients")]
        public async Task<IActionResult> GetPatients()
        {

            List<patientsDTO> patients = await _pharmDL.GetAllPatients();

            return Ok(new { data = patients });

        }

        [HttpPost("addpatient")]
        public async Task<IActionResult> AddPatient([FromBody] patientsDTO patient)
        {
            // Make sure we got something
            if (patient == null)
            {
                return BadRequest(new { message = "Null input" });
            }

            // Make sure none of the properties are null
            if(_sanitization.HasNullProperty(patient))
            {
                return BadRequest(new { message = "Submission has a null property" });
            }

            // Call the DL
            string result = await _pharmDL.AddPatientAsync(patient);

            Console.WriteLine("Called DL:" + result);

            // Check the result
            if (string.Equals(result, "Patient added"))
            {
                return Ok(result);
            }

            return BadRequest(new { message = "Patient could not be added." });
        }

        [HttpPost("editpatient")]
        public async Task<IActionResult> EditPatient([FromBody] patientsDTO patient)
        {
            // Check that the PPR isn't null
            if (patient == null || patient.PPR == null)
            {
                return BadRequest(new { message = "Null Patient" });
            }

            // Make sure none of the attributes are null
            if(_sanitization.HasNullProperty(patient))
            {
                return BadRequest(new { message = "Submission has a null property" });
            }
            

            // Call DL
            string result = await _pharmDL.EditPatientAsync(patient);

            if (string.Equals(result, "Patient updated"))
            {
                return Ok();
            }
            else
            {
                return BadRequest(new { message = result });
            }

        }

        [HttpPost("deletepatient")]
        public async Task<IActionResult> DeletePatient([FromBody] patientsDTO patient)
        {
            // Check that the PPR isn't null
            if(patient == null || patient.PPR == null)
            {
                return BadRequest(new { message = "Null Patient" });
            }
            
            // Call DL
            string result = await _pharmDL.DeletePatientAsync(patient.PPR);

            if (string.Equals(result,"Patient Deleted"))
            {
                return Ok();
            }
            else
            {
                return BadRequest(new {message = result});
            }

        }

        [HttpPost("bulkpatient")]
        public async Task<IActionResult> BulkPatient([FromBody] List<patientsDTO> patients)
        {
            List<string> results = new List<string>();
            Console.WriteLine("Buulkpatient");
            try
            {
                foreach(patientsDTO patient in patients)
                {
                    Console.WriteLine($"Patient {patient.FName}");
                    string result = await _pharmDL.AddPatientAsync(patient);

                    // If there was an issue with adding the patient, add it to results
                    // We don't want to clutter the response with successes
                    if (!string.Equals(result, "Patient added"))
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

            return Ok(new {data = results });
        }
    }
}
