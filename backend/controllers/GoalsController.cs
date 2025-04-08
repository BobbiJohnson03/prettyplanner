using GoalTracker.API.Models;
using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoalTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase
    {
        private readonly GoalService _goalService;

        public GoalsController(GoalService goalService)
        {
            _goalService = goalService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Goal>>> Get() =>
            Ok(await _goalService.GetAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Goal>> Get(string id)
        {
            var goal = await _goalService.GetByIdAsync(id);
            if (goal is null) return NotFound();
            return Ok(goal);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Goal goal)
        {
            await _goalService.CreateAsync(goal);
            return CreatedAtAction(nameof(Get), new { id = goal.Id }, goal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, Goal goal)
        {
            var existing = await _goalService.GetByIdAsync(id);
            if (existing is null) return NotFound();

            goal.Id = id;
            await _goalService.UpdateAsync(id, goal);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var goal = await _goalService.GetByIdAsync(id);
            if (goal is null) return NotFound();

            await _goalService.DeleteAsync(id);
            return NoContent();
        }
    }
}
