using GoalTracker.API.Models;
using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoalTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationsController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Notification>>> GetByUser(string userId)
        {
            var notifications = await _notificationService.GetByUserIdAsync(userId);
            return Ok(notifications);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Notification notification)
        {
            await _notificationService.CreateAsync(notification);
            return CreatedAtAction(nameof(GetByUser), new { userId = notification.UserId }, notification);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(string id)
        {
            await _notificationService.MarkAsReadAsync(id);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _notificationService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _notificationService.DeleteAsync(id);
            return NoContent();
        }
    }
}
