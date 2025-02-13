using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrugController : ControllerBase
    {

        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;

        public DrugController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

        }

        [HttpPost("getdrugs")]
        public async Task<IActionResult> GetDrugs()
        {

            List<drugsDTO> drugs = await _pharmDL.GetAllDrugs();

            return Ok(new { data = drugs });

        }

        [HttpPost("adddrug")]
        public async Task<IActionResult> AddDrug([FromBody] drugsDTO drug)
        {
            // Make sure we got something
            if (drug == null)
            {
                return BadRequest(new { message = "Null input" });
            }

            // Make sure none of the properties are null
            if (_sanitization.HasNullProperty(drug))
            {
                return BadRequest(new { message = "Submission has a null property" });
            }

            // Call the DL
            string result = await _pharmDL.AddDrugAsync(drug);

            // Check the result
            if (string.Equals(result, "Drug added"))
            {
                return Ok(result);
            }
            else if (result.Equals("Drug not added"))
            {
                return BadRequest(new { message = "Drug not added, please make sure DIN number is unique" }); //DIN number is only fail scenario besides an exception being throwns
            }
            else
            {
                return BadRequest(new { message = "Drug could not be added." }); //display this if exception occured
            }
        }

        [HttpPost("editdrug")]
        public async Task<IActionResult> EditDrug([FromBody] drugsDTO drug)
        {
            // Check that the DIN isn't null
            if (drug == null || drug.DIN == null)
            {
                return BadRequest(new { message = "Null Drug" });
            }

            // Make sure none of the attributes are null
            if (_sanitization.HasNullProperty(drug))
            {
                return BadRequest(new { message = "Submission has a null property" });
            }


            // Call DL
            string result = await _pharmDL.EditDrugAsync(drug);

            if (string.Equals(result, "Drug updated"))
            {
                return Ok();
            }
            else
            {
                return BadRequest(new { message = result });
            }

        }

        [HttpPost("deletedrug")]
        public async Task<IActionResult> DeleteDrug([FromBody] drugsDTO drug)
        {
            // Check that the DIN isn't null
            if (drug == null || drug.DIN == null)
            {
                return BadRequest(new { message = "Null Drug" });
            }

            // Call DL
            string result = await _pharmDL.DeleteDrugAsync(drug.DIN);

            if (string.Equals(result, "Drug Deleted"))
            {
                return Ok();
            }
            else
            {
                return BadRequest(new { message = result });
            }

        }

        [HttpPost("bulkdrug")]
        public async Task<IActionResult> BulkDrug([FromBody] List<drugsDTO> drugs)
        {
            List<string> results = new List<string>();
            try
            {
                foreach (drugsDTO drug in drugs)
                {

                    // Make sure we got something
                    if (drug == null)
                    {
                        return BadRequest(new { message = "Null input" });
                    }

                    // Make sure none of the properties are null
                    if (_sanitization.HasNullProperty(drug))
                    {
                        return BadRequest(new { message = "Submission has a null property" });
                    }

                    string result = await _pharmDL.AddDrugAsync(drug);

                    // If there was an issue with adding the drug, add it to results
                    // We don't want to clutter the response with successes
                    if (!string.Equals(result, "Drug added"))
                    {
                        results.Add(result + "\n");
                    }
                }
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
