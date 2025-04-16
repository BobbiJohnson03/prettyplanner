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

        [HttpPut("{id}/profile")]
public async Task<IActionResult> UpdateProfile(string id, [FromForm] IFormFile? avatar, [FromForm] string username)
{
    var user = await _userService.GetByIdAsync(id);
    if (user == null) return NotFound();

    // Update username
    user.Username = username;

    // Handle avatar upload
    if (avatar != null && avatar.Length > 0)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(avatar.FileName).ToLower();

        if (!allowedExtensions.Contains(extension))
            return BadRequest("Unsupported file format. Use JPG, PNG, or WEBP.");

        if (avatar.Length > 2 * 1024 * 1024)
            return BadRequest("Image size must be under 2MB.");

        var fileName = $"{Guid.NewGuid()}{extension}";
        var avatarPath = Path.Combine("wwwroot", "avatars", fileName);

        using (var stream = new FileStream(avatarPath, FileMode.Create))
        {
            await avatar.CopyToAsync(stream);
        }

        user.AvatarUrl = $"/avatars/{fileName}";
    }

    await _userService.UpdateAsync(id, user);
    return Ok(user);
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
