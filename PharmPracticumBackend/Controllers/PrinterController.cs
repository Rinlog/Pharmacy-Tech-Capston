
using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using System.Reflection.Metadata;
using PdfSharp;
using System.Drawing;
using Ghostscript;
namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrinterController : Controller
    {
        [HttpGet("Test")]
        public IActionResult TestPrint()
        {
            try
            {
                

                return Ok("THIS SHOULD PRINT");
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to Print");
            }
        }
    }
}
