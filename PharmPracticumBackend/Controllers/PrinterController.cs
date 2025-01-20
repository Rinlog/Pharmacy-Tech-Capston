
using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using System.Drawing.Printing;
using System.Runtime.Versioning;
using System.Drawing;
using PharmPracticumBackend.DTO;
using PdfSharp;
using PdfSharp.Pdf;
using PdfSharp.Drawing;
using System.Text.Json.Serialization;
namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrinterController : Controller
    {
        readonly PharmDL _PharmDL;
        static Bitmap? fileToPrint;
        public PrinterController(PharmDL pharmDL) {
            _PharmDL = pharmDL;
        }

        [SupportedOSPlatform("windows")]
        [HttpPost("PrintOrder")]
        public IActionResult PrintOrder([FromBody] String OrderID)
        {
            try
            {
                ordersDTO ordersDTO = _PharmDL.GetOrderByID(OrderID);
                if (ordersDTO.RxNum == null) { return BadRequest("Could not find order with Order ID " + OrderID); }
                Bitmap img = CreateOrderImage(ordersDTO);
                return StartPrint(img);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Could not print... please try again later");
            }

        }
        [SupportedOSPlatform("windows")]
        [HttpGet("PrintToPDF")]
        public IActionResult PrintToPDF([FromQuery] String OrderID)
        {
            try
            {
                ordersDTO ordersDTO = _PharmDL.GetOrderByID(OrderID);
                if (ordersDTO.RxNum == null) { return BadRequest("Could not find order with Order ID " + OrderID); }
                Bitmap img = CreateOrderImage(ordersDTO);
                img.Save("PrintTOPDF.jpg"); //saves the image we dynamically generate

                PdfDocument pdfDocument = new PdfDocument();
                pdfDocument.Info.Title = "PDF Copy of Order " + ordersDTO.RxNum;
                PdfPage page = pdfDocument.AddPage();
                XGraphics gfx = XGraphics.FromPdfPage(page);

                var Ximg = XBitmapImage.FromFile("PrintTOPDF.jpg"); //reads the image to insert it into the pdf
                gfx.DrawImage(Ximg, 50, 50);
                Console.WriteLine("Made it to back end");
                gfx.Save();
                pdfDocument.Save("PrintedPDF.pdf"); //saves the pdf so we can send it back to the frontend
                var stream = new FileStream(@"PrintedPDF.pdf", FileMode.Open);
                return File(stream, "application/pdf","PDF Copy of Order" + ordersDTO.RxNum);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Failed to print to pdf");
            }

        }
        //MAIN METHOD FOR PRINTING, Should be called by an api method
        [SupportedOSPlatform("windows")]
        private IActionResult StartPrint(Bitmap file)
        {
            try
            {
                fileToPrint = file;
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
                pd.PrintPage += Pd_PrintPage;//sends the file to be printed when we run the Print() command
                if (pd.PrinterSettings.IsValid)
                {
                    pd.Print();
                }
                else
                {
                    return BadRequest("No valid printers detected");
                }

                return Ok("Succefullly Printed Label");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Failed to print");
            }
        }

        //handles the Print() commmand sending the file to print
        [SupportedOSPlatform("windows")]
        private void Pd_PrintPage(object sender, PrintPageEventArgs e)
        {
            Image img = (Image)fileToPrint;
            e.Graphics.DrawImage(img, e.MarginBounds);//e.MarginBounds makes sure the image stays within the label margins set in Page Settings
        }

        //creates an image from all the order information that we can then print
        [SupportedOSPlatform("windows")]
        private Bitmap CreateOrderImage(ordersDTO order)
        {
            Bitmap img = null;
            try
            {
                patientsDTO patient = _PharmDL.GetPatientbyID(order.PPR);
                drugsDTO drug = _PharmDL.GetDrugByID(order.DIN);

                img = DrawImage(patient, drug, order);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return img;
        }
        [SupportedOSPlatform("windows")]
        private Bitmap DrawImage(patientsDTO patient, drugsDTO drug, ordersDTO order)
        {
            try
            {
                Bitmap bitmap = new Bitmap(600, 400);
                Graphics drawing = Graphics.FromImage(bitmap);
                drawing.Clear(Color.White);
                Brush textBrush = new SolidBrush(Color.Black);
                int NumberOfLinesToDraw = 18;
                Font font = new Font("Arial", 15);
                Font BoldFont = new Font("Arial", 15, FontStyle.Bold);

                for (int i = 0; i < NumberOfLinesToDraw; i++)
                {
                    PointF StartingPoint = new PointF(2, i * 20);
                    PointF RightSideTextPoint = new PointF(295, i * 20); //use this if the first letter is a character
                    PointF RightSideNumberPoint = new PointF(292, i * 20); //use this if the first letter is a number
                    switch (i)
                    {
                        case 0:
                            drawing.DrawString(patient.UnitNumber + " " + patient.RoomNumber, font, textBrush, StartingPoint);
                            drawing.DrawString(patient.HospitalName, BoldFont, textBrush, RightSideTextPoint);
                            break;
                        case 1:
                        case 9:
                        case 16:
                            drawing.DrawString(patient.LName + ", " + patient.FName, font, textBrush, StartingPoint);
                            drawing.DrawString(patient.PPR, font, textBrush, RightSideNumberPoint);
                            break;
                        case 2:
                        case 11:
                            drawing.DrawString(drug.Name, font, textBrush, StartingPoint);
                            break;
                        case 3:
                        case 12:
                            drawing.DrawString(drug.Dosage, font, textBrush, StartingPoint);
                            break;
                        case 4:
                        case 15:
                            drawing.DrawString(".....................................................................................................", font, textBrush, StartingPoint);
                            break;
                        case 5:
                            drawing.DrawString(drug.DIN, font, textBrush, StartingPoint);
                            drawing.DrawString(order.RxNum, font, textBrush, RightSideNumberPoint);
                            break;
                        case 6:
                            drawing.DrawString("Printing:1", font, textBrush, StartingPoint);
                            drawing.DrawString("FILL BY: " + order.Initiator, font, textBrush, RightSideTextPoint);
                            break;
                        case 7:
                            Pen BarCodePen = new Pen(textBrush, 2f);
                            PointF StartingPointCopy = StartingPoint;
                            StartingPointCopy.X += 10f;
                            StartingPointCopy.Y += 5f;
                            PointF EndPoint = StartingPoint;
                            EndPoint.X += 10f;
                            EndPoint.Y += 35f;
                            for (int j = 0; j < 40; j++)
                            {
                                drawing.DrawLine(BarCodePen, StartingPointCopy, EndPoint);
                                EndPoint.X += +5f;
                                StartingPointCopy.X += 5f;
                            }
                            break;
                        case 8:
                            drawing.DrawString("CHECK BY: " + order.Verifier, font, textBrush, RightSideTextPoint);
                            break;
                        case 10:
                        case 17:
                            drawing.DrawString(patient.UnitNumber + " " + patient.RoomNumber, font, textBrush, StartingPoint);
                            drawing.DrawString(order.RxNum, font, textBrush, RightSideNumberPoint);
                            break;
                        case 13:
                            drawing.DrawString(drug.DIN, font, textBrush, StartingPoint);
                            break;
                        case 14:
                            drawing.DrawString("FILL BY:" + order.Initiator + " " + order.DateSubmitted.Substring(0, 9), font, textBrush, StartingPoint);
                            drawing.DrawString("CHECK BY:" + order.Verifier + " " + order.DateVerified.Substring(0, 9), font, textBrush, RightSideTextPoint);
                            break;

                    }

                }


                drawing.Save();

                textBrush.Dispose();
                drawing.Dispose();
                return bitmap;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return null;
        }
    }
}
