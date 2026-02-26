using DotNetProject.Interfaces;
using DotNetProject.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DotNetProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        /// <summary>
        /// Endpoint 1: Get all products
        /// </summary>
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            try
            {
                var products = await _productRepository.GetAllProductsAsync();
                return Ok(new { success = true, data = products });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint 2: Get product by ID
        /// </summary>
        [HttpGet]
        [Route("getbyid/{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            try
            {
                var product = await _productRepository.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound(new { success = false, message = "Product not found" });
                }
                return Ok(new { success = true, data = product });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint 3: Create a new product
        /// </summary>
        [HttpPost]
        [Route("create")]
        public async Task<ActionResult> CreateProduct([FromBody] Product product)
        {
            try
            {
                if (product == null)
                {
                    return BadRequest(new { success = false, message = "Product cannot be null" });
                }
                
                await _productRepository.CreateProductAsync(product);
                return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, new { success = true, message = "Product created successfully" });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
