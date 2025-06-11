using GoalTracker.API.Models;
using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System; // Required for DateTime

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
            if (string.IsNullOrEmpty(task.UserId))
            {
                return BadRequest("UserId is required for creating a task.");
            }
            task.CreatedAt = DateTime.UtcNow;
            await _kanbanTaskService.CreateAsync(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        // PUT: api/kanbantasks/{id}
        /// <summary>
        /// Updates an existing Kanban task.
        /// This method now creates a new KanbanTask object based on the existing one,
        /// then applies only the explicitly provided updates from the payload,
        /// ensuring all other properties are preserved.
        /// </summary>
        /// <param name="id">The ID of the task to update.</param>
        /// <param name="taskUpdatePayload">A partial KanbanTask object with fields to update.</param>
        /// <returns>No content on successful update, or NotFound if task does not exist.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] KanbanTask taskUpdatePayload)
        {
            var existingTask = await _kanbanTaskService.GetByIdAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            // Create a new task object based on the existing one to ensure all original properties are carried over.
            // This avoids issues with partial model binding leaving required fields as default/null.
            var taskToUpdate = new KanbanTask
            {
                Id = existingTask.Id, // Preserve existing ID
                Title = existingTask.Title,
                Description = existingTask.Description,
                Priority = existingTask.Priority,
                Color = existingTask.Color,
                Category = existingTask.Category,
                UserId = existingTask.UserId, // CRITICAL: Preserve the correct UserId
                Deadline = existingTask.Deadline, // Preserve existing deadline
                CreatedAt = existingTask.CreatedAt, // Preserve existing creation date
                Status = existingTask.Status, // Start with existing status
                OrderIndex = existingTask.OrderIndex // Start with existing orderIndex
            };

            // Now, apply updates from the incoming payload (taskUpdatePayload)
            // only for the properties that are expected to change in a drag-and-drop.

            // Update Status if it's explicitly provided and different from the current value.
            // Check for null or empty string to ensure it was actually sent.
            if (!string.IsNullOrEmpty(taskUpdatePayload.Status) && taskUpdatePayload.Status != existingTask.Status)
            {
                taskToUpdate.Status = taskUpdatePayload.Status;
            }

            // Update OrderIndex:
            // Floats default to 0. We'll update it if the value in the payload is different.
            // This handles cases where orderIndex might be 0 but a new 0 is sent.
            if (taskUpdatePayload.OrderIndex != existingTask.OrderIndex)
            {
                // Corrected line: Access OrderIndex directly from taskToUpdate
                taskToUpdate.OrderIndex = taskUpdatePayload.OrderIndex;
            }


            // Call the service to update the task using the fully-formed 'taskToUpdate' object.
            // The service will use the 'id' (from the route) to find the document,
            // and replace it with 'taskToUpdate'.
            await _kanbanTaskService.UpdateAsync(id, taskToUpdate);

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