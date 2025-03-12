using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;

        public LogController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

        }

        [HttpPost("getlogs")]
        public async Task<IActionResult> GetLogs([FromBody] logRequestDTO request)
        {
            string? startDate = request.StartDate;
            string? endDate = request.EndDate;

            Console.WriteLine("API hit");
            // Check if the start date is valid
            if (!DateOnly.TryParse(startDate, out _))
            {
                return BadRequest(new { message = "Invalid start date format" });
            }

            Console.WriteLine("Start date valid");

            // If the end date is not empty, check if its valid
            if (!string.IsNullOrEmpty(endDate))
            {
                if (!DateOnly.TryParse(endDate, out _))
                {
                    return BadRequest(new { message = "Invalid end date format" });
                }
            }

            Console.WriteLine("End date valid or empty");

            List<logsDTO> logs = await _pharmDL.GetSpecifiedLogs(startDate, endDate);

            Console.WriteLine("Logs gotten");

            return Ok(new { data = logs });

        }
    }
}
