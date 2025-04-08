// File: Models/LoginRequest.cs
namespace GoalTracker.API.Models
{
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
