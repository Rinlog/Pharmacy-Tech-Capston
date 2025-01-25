using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemoController : ControllerBase
    {

        private readonly PharmDL _pharmDL;

        public DemoController(PharmDL pharmDL)
        {
            _pharmDL = pharmDL;
        }


        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {


            return Ok("We can connect");

        }

    }
}
