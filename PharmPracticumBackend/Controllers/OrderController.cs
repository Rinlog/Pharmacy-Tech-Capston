using System.Reflection.Metadata;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using PdfSharp.Drawing;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;
        private readonly String _Environment;
        public OrderController(PharmDL pharmDL, IConfiguration configuration)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();
            _Environment = configuration.GetSection("Environment")["Status"];

        }
        [HttpPost("GetOrdersVerifiedByUser")]
        public IActionResult getOrdersVerifiedByUser([FromBody] String UserID)
        {
            List<ordersDTO> orders = _pharmDL.getOrdersVerifiedByUser(UserID);
            return Ok(orders);
        }
        [HttpPost("getorders")]
        public async Task<IActionResult> GetOrders()
        {

            List<ordersDTO> orders = await _pharmDL.GetAllOrders();
            return Ok(new { data = orders });

        }

        [HttpPost("addorder")]
        public async Task<IActionResult> AddOrder(addOrderDTO order)
        {

            //check for null
            if (_sanitization.HasNullProperty(order)) return Ok (new { message = "Order missing information." });

            //sanitize order
            order.PPR = _sanitization.SanitizeNumber(order.PPR);
            order.DIN = _sanitization.SanitizeNumber(order.DIN);
            order.PhysicianID = _sanitization.SanitizePhysicianID(order.PhysicianID);
            order.Initiator = _sanitization.SanitizeUserID(order.Initiator);
            order.SIG = _sanitization.SanitizeInput(order.SIG);
            order.SIGDescription = _sanitization.SanitizeInput(order.SIGDescription);
            order.Form = _sanitization.SanitizeInput(order.Form);
            order.Route = _sanitization.SanitizeInput(order.Route);
            order.Dose = _sanitization.SanitizeDose(order.Dose);
            order.Frequency = _sanitization.SanitizeInput(order.Frequency);
            order.Duration = _sanitization.SanitizeInput(order.Duration);
            order.Quantity = _sanitization.SanitizeInput(order.Quantity);
            order.StartDate = _sanitization.SanitizeDate(order.StartDate);
            order.StartTime = _sanitization.SanitizeTime(order.StartTime);
            order.Comments = _sanitization.SanitizeComments(order.Comments);

<<<<<<< HEAD
            Console.WriteLine(order.PPR);
            Console.WriteLine(order.DIN);
            Console.WriteLine(order.PhysicianID);

=======
>>>>>>> dev
            //Insert
            bool result = await _pharmDL.AddOrder(order);

            if (result)
            {
                return Ok(new { message = "Order successfully created." });
            }
            else
            {
                return Ok(new { message = "Order could not be created." });
            }

        }

<<<<<<< HEAD
=======
        [HttpPost("getmyorders")]
        public async Task<IActionResult> GetMyOrders([FromBody] string user)
        {
            
            List<ordersDTO> orders = new List<ordersDTO>();

            if (user != null)
            {
                orders = await _pharmDL.GetMyOrders(user);
            }
            else return Ok(new { data = "Invalid User" });

            return Ok(new { data = orders });

        }

        [HttpPost("editorder")]
        public async Task<IActionResult> EditOrder([FromBody] ordersDTO order)
        {


            //DL
            bool result = await _pharmDL.AmendOrder(order);

            if (result) return Ok(new { message = "Order successfuly amended." });
            else return Ok(new { message = "Order could not be amended." });

        }
        [HttpPost("UpdateOrderImagePathByID")]
        public IActionResult UpdateOrderImage([FromBody] string UpdateInfo)
        {
            try
            {
                //index 0 is the rx num and index 1 is the new path
                string[] OrderInfoArray = UpdateInfo.Split("~!~");
                bool result = _pharmDL.UpdateOrderImagePathByID(OrderInfoArray[0], OrderInfoArray[1]);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Failed to Update Order Image");
            }
        }
        [HttpPost("GetOrderImageByID")]
        public IActionResult GetOrderImageByID([FromBody]string RxNum)
        {
            try
            {
                return Ok(_pharmDL.GetOrderImageByID(RxNum));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //note when uploading images use FromForm instead of FromBody
        private int GetHighestNumber(FileInfo[] Files)
        {
            int GreatestNumber = 1; //just a starting point number
            foreach (FileInfo file in Files)
            {
                int.TryParse(file.Name.Substring(0, file.Name.Length - 4), out int FileIncrement);
                if (FileIncrement > GreatestNumber)
                {
                    GreatestNumber = FileIncrement; //if the number was bigger, make it the new biggest, keep going until we know the biggest
                }
            }
            Console.WriteLine(GreatestNumber);
            return GreatestNumber;
        }
        [HttpPost("addorderImage")]
        public async Task<IActionResult> AddOrderImage([FromForm] IFormFile image)
        {
            try
            {
                //incrementing orderImage name by amount of images + 1
                if (image.Length > 0)
                {
                    string filePath = "";
                    DirectoryInfo di = null;
                    FileInfo[] Files = null;

                    int GreatestNumber = 1;
                    if (_Environment == "Development")
                    {
                        di = new DirectoryInfo("../PharmFrontend/Public/images/OrderImages");
                        Files = di.GetFiles("*.jpg");
                        GreatestNumber = GetHighestNumber(Files);
                        filePath = Path.Combine("../PharmFrontend/Public/images/OrderImages", (GreatestNumber+1) + ".jpg");
                    }
                    else if (_Environment == "Deployed")
                    {
                        di = new DirectoryInfo("../PharmFrontend/images/OrderImages");
                        Files = di.GetFiles("*.jpg");
                        GreatestNumber = GetHighestNumber(Files);
                        filePath = Path.Combine("../PharmFrontend/images/OrderImages", (GreatestNumber+1) + ".jpg");
                    }
                    else
                    {
                        return BadRequest("Environment Not valid");
                    }
                    using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(fileStream);
                    }
                    return Ok("/images/OrderImages/" + (GreatestNumber + 1) + ".jpg");
                }
                else
                {
                    return BadRequest("Invalid Image sent");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("removeOrderImage")]
        //note when uploading images use FromForm instead of FromBody
        public IActionResult RemoveOrderImage([FromBody]String FrontendPath)
        {
            try
            {
                string FilePath = "";
                if (_Environment == "Development")
                {
                    FilePath = "../PharmFrontend/Public" + FrontendPath;
                }
                else if (_Environment == "Deployed")
                {
                    FilePath = "../PharmFrontend/" + FrontendPath;
                }
                else
                {
                    return BadRequest("Invalid Environment");
                }
                FileInfo file = new FileInfo(FilePath);
                if (file.Exists)
                {
                    file.Delete();
                    return Ok("File Removed");
                }
                else
                {
                    return BadRequest("Could not remove File");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest(ex.Message);
            }
        }

>>>>>>> dev
    }
}
