using DotNetProject.Interfaces;
using DotNetProject.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DotNetProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;

        public OrdersController(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        /// <summary>
        /// Endpoint 1: Get all orders
        /// </summary>
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            try
            {
                var orders = await _orderRepository.GetAllOrdersAsync();
                return Ok(new { success = true, data = orders });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint 2: Get order by ID
        /// </summary>
        [HttpGet]
        [Route("getbyid/{id}")]
        public async Task<ActionResult<Order>> GetOrderById(int id)
        {
            try
            {
                var order = await _orderRepository.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { success = false, message = "Order not found" });
                }
                return Ok(new { success = true, data = order });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint 3: Create a new order
        /// </summary>
        [HttpPost]
        [Route("create")]
        public async Task<ActionResult> CreateOrder([FromBody] Order order)
        {
            try
            {
                if (order == null)
                {
                    return BadRequest(new { success = false, message = "Order cannot be null" });
                }
                
                await _orderRepository.CreateOrderAsync(order);
                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, new { success = true, message = "Order created successfully" });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
