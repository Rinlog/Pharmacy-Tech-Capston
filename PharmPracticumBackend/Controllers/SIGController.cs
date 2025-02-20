using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;

namespace PharmPracticumBackend.Controllers { 

    [Route("api/[controller]")]
    [ApiController]

    public class SIGController : Controller
    {
        private readonly PharmDL _PharmDL;
        public SIGController(PharmDL pharmDL)
        {
            _PharmDL = pharmDL;
        }

        [HttpPost("getSIGs")]
        public IActionResult getSIGS()
        {

            return Ok(_PharmDL.getAllSIGS());
        }
    }
}
