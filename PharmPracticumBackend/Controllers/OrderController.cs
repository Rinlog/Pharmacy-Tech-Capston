using Microsoft.AspNetCore.Mvc;
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

        public OrderController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

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

    }
}
