
using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using System.Reflection.Metadata;
using PdfSharp;
using System.Drawing.Printing;
using System.Runtime.Versioning;
using System.Drawing;
using System.Runtime.CompilerServices;
using PdfSharp.Snippets.Drawing;
namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrinterController : Controller
    {

        [SupportedOSPlatform("windows")]
        [HttpGet("Test")]
        public IActionResult TestPrint()
        {
            try
            {
                //If printer will not print but it is visible on network make sure to update printer IP in Windows Printer Properties on the Ports Tab
                PageSettings pageSettings = new PageSettings();
                Margins mg = new Margins(0, 0, 0, 0);
                pageSettings.Margins = mg;
                PrinterResolution printerResolution = new PrinterResolution();
                printerResolution.X = 203;
                printerResolution.Y = 203;
                pageSettings.PrinterResolution = printerResolution;

                String ExpectedPrinter = "ZDesigner ZT231-203dpi ZPL";
                foreach (String PrinterList in PrinterSettings.InstalledPrinters)
                {
                    Console.Write(PrinterList);
                    if (PrinterList == ExpectedPrinter)
                    {
                        Console.WriteLine(" --- This is the printer we will print from");
                    }
                    else
                    {
                        Console.WriteLine("");
                    }
                }
                PrintDocument pd = new PrintDocument();
                pd.PrinterSettings.PrinterName = ExpectedPrinter;
                pd.DefaultPageSettings = pageSettings;
                pd.PrintPage += Pd_PrintPageTEST;//sends the file to be printed when we run the Print() command
                if (pd.PrinterSettings.IsValid)
                {
                    pd.Print();
                }
                else
                {
                    return BadRequest("No Valid Printer Detected");
                }

                return Ok("This Should Print");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Failed to Print");
            }
        }
    
        

        [SupportedOSPlatform("windows")]
        private void Pd_PrintPageTEST(object sender, PrintPageEventArgs e)
        {
            Bitmap bitmap = new Bitmap(@"C:\Users\Sadik\Desktop\TestJPG.jpg");
            Image img = (Image)bitmap;
            e.Graphics.DrawImage(img, e.MarginBounds);//e.MarginBounds makes sure the image stays within the label margins set in Page Settings
        }
    }
}
