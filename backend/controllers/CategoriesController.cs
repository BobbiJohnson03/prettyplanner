using GoalTracker.API.Models;
using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoalTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoriesController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Category>>> GetByUser(string userId)
        {
            var categories = await _categoryService.GetByUserIdAsync(userId);
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Category category)
        {
            await _categoryService.CreateAsync(category);
            return CreatedAtAction(nameof(GetByUser), new { userId = category.UserId }, category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, Category category)
        {
            var existing = await _categoryService.GetByIdAsync(id);
            if (existing is null) return NotFound();

            category.Id = id;
            await _categoryService.UpdateAsync(id, category);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category is null) return NotFound();

            await _categoryService.DeleteAsync(id);
            return NoContent();
        }
    }
}
