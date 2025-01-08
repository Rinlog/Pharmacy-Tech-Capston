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


        [HttpPost("test")]
        public async Task<IActionResult> TestConnection()
        {

            Console.Write("Did we log?");

            string result = await _pharmDL.CanIConnect();


            return Ok(new { message = result });

        }

    }
}
