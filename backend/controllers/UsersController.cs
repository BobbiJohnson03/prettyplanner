using GoalTracker.API.Models;
using GoalTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoalTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }
        [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] User user)
{
    var existing = await _userService.GetByEmailAsync(user.Email);
    if (existing != null)
        return BadRequest(new { message = "Email already in use." });

    await _userService.CreateAsync(user);
    return Ok(user);
}

[HttpPost("logout")]
public IActionResult Logout()
{
    return Ok(new { message = "User logged out." });
}


[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest login)
{
    var user = await _userService.GetByEmailAsync(login.Email);
    if (user == null || user.PasswordHash != login.Password)
    {
        return Unauthorized(new { message = "Invalid email or password." });
    }

    // JWT token handling can be added here later
    return Ok(new { user, token = "placeholder-token" });
}


        [HttpGet]
        public async Task<ActionResult<List<User>>> Get() =>
            Ok(await _userService.GetAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Post(User user)
        {
            await _userService.CreateAsync(user);
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, User user)
        {
            var existing = await _userService.GetByIdAsync(id);
            if (existing is null) return NotFound();

            user.Id = id;
            await _userService.UpdateAsync(id, user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null) return NotFound();

            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}
