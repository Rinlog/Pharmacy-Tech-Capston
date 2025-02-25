using Microsoft.AspNetCore.Mvc;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.Sanitization;

namespace PharmPracticumBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerifyController : ControllerBase
    {
        private readonly PharmDL _pharmDL;
        private readonly SanitizationClass _sanitization;

        public VerifyController(PharmDL pharmDL)
        {

            _pharmDL = pharmDL;
            _sanitization = new SanitizationClass();

        }

        [HttpPost("verifyorder")]
        public async Task<IActionResult> VerifyOrder(orderStatusChangeDTO order)
        {
            // Make sure the status passed in matches the API call
            if(!string.Equals(order.Status, "Verified")){
                // Status mismatch, just return BadRequest
                return BadRequest(new { message = "Status does not match the called function" });
            }

            bool success = await _pharmDL.ChangeOrderStatus(order);

            if (!success)
            {
                return BadRequest(new { message = "Something went wrong" });
            }

            return Ok(new { message = "Status changed successfully" });

        }

        [HttpPost("rejectorder")]
        public async Task<IActionResult> RejectOrder(orderStatusChangeDTO order)
        {
            // Make sure the status passed in matches the API call
            if (!string.Equals(order.Status, "Rejected"))
            {
                // Status mismatch, just return BadRequest
                return BadRequest(new { message = "Status does not match the called function" });
            }
            ordersDTO ordersDTO = _pharmDL.GetOrderByID(order.RxNum);
            if (ordersDTO == null)
            {
                return BadRequest("Order not found");
            }
            bool success = await _pharmDL.ChangeOrderStatus(order);
            bool sendNotification = _pharmDL.addNotification("The order " + order.RxNum + " that you created has been rejected, click to start amending the order", ordersDTO.Initiator);
           
            if (!success || !sendNotification)
            {
                return BadRequest(new { message = "Something went wrong" });
            }

            return Ok(new { message = "Status changed successfully" });

        }
    }
}
