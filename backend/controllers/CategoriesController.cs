using GoalTracker.API.Models;
using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GoalTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        private readonly KanbanTaskService _kanbanTaskService;

        public CategoriesController(CategoryService categoryService, KanbanTaskService kanbanTaskService)
        {
            _categoryService = categoryService;
            _kanbanTaskService = kanbanTaskService;
        }

        // ✅ Get all categories for a user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Category>>> GetByUser(string userId)
        {
            var categories = await _categoryService.GetByUserIdAsync(userId);
            return Ok(categories);
        }

        // ✅ Create a new category
        [HttpPost]
        public async Task<IActionResult> Post(Category category)
        {
            await _categoryService.CreateAsync(category);
            return CreatedAtAction(nameof(GetByUser), new { userId = category.UserId }, category);
        }

        // ✅ Update existing category
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, Category category)
        {
            var existing = await _categoryService.GetByIdAsync(id);
            if (existing is null) return NotFound();

            category.Id = id;
            await _categoryService.UpdateAsync(id, category);
            return NoContent();
        }

        // ✅ Delete category and its related Kanban tasks
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category is null) return NotFound();

            // 🧼 Delete related KanbanTasks with the same category name and userId
            await _kanbanTaskService.DeleteByCategoryAsync(category.UserId, category.Name);

            // 🗑️ Delete the category itself
            await _categoryService.DeleteAsync(id);

            return NoContent();
        }
    }
}
