using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoalTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SummaryController : ControllerBase
    {
        private readonly SummaryService _summaryService;

        public SummaryController(SummaryService summaryService)
        {
            _summaryService = summaryService;
        }

        [HttpGet("goals/{userId}/completed-count")]
        public async Task<IActionResult> GetCompletedGoalsCount(string userId)
        {
            var count = await _summaryService.GetCompletedGoalsCountAsync(userId);
            return Ok(new { completedGoals = count });
        }

        [HttpGet("tasks/{userId}/completed-count")]
        public async Task<IActionResult> GetCompletedTasksCount(string userId)
        {
            var count = await _summaryService.GetCompletedTasksCountAsync(userId);
            return Ok(new { completedTasks = count });
        }

        // 🔒 Tymczasowo zakomentowane — metody są nieaktywne
        // [HttpGet("goals/{userId}/completions-by-day")]
        // public async Task<IActionResult> GetGoalCompletionsByDay(string userId)
        // {
        //     var data = await _summaryService.GetGoalCompletionsByDayAsync(userId);
        //     return Ok(data);
        // }

        // [HttpGet("tasks/{userId}/completions-by-day")]
        // public async Task<IActionResult> GetTaskCompletionsByDay(string userId)
        // {
        //     var data = await _summaryService.GetTaskCompletionsByDayAsync(userId);
        //     return Ok(data);
        // }
    }
}