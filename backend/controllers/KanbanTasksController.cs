using GoalTracker.API.Models;
using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoalTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KanbanTasksController : ControllerBase
    {
        private readonly KanbanTaskService _kanbanTaskService;

        public KanbanTasksController(KanbanTaskService kanbanTaskService)
        {
            _kanbanTaskService = kanbanTaskService;
        }

        // GET: api/kanbantasks/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<KanbanTask>>> GetByUser(string userId)
        {
            var tasks = await _kanbanTaskService.GetByUserIdAsync(userId);
            return Ok(tasks);
        }

        // GET: api/kanbantasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<KanbanTask>> Get(string id)
        {
            var task = await _kanbanTaskService.GetByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        // POST: api/kanbantasks
       [HttpPost]
public async Task<IActionResult> Post(KanbanTask task)
{
    task.CreatedAt = DateTime.UtcNow;  // Ensure createdAt is set
    await _kanbanTaskService.CreateAsync(task);
    return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
}

        // PUT: api/kanbantasks/{id}
   [HttpPut("{id}")]
public async Task<IActionResult> Put(string id, KanbanTask task)
{
    var existing = await _kanbanTaskService.GetByIdAsync(id);
    if (existing == null) return NotFound();

    task.Id = id;
    task.CreatedAt = existing.CreatedAt;  // Preserve original creation date
    await _kanbanTaskService.UpdateAsync(id, task);
    return NoContent();
}
        // DELETE: api/kanbantasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var task = await _kanbanTaskService.GetByIdAsync(id);
            if (task == null) return NotFound();

            await _kanbanTaskService.DeleteAsync(id);
            return NoContent();
        }
    }
}
