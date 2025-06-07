using FluentValidation;
using GoalTracker.API.Models;

public class CategoryValidator : AbstractValidator<Category>
{
    public CategoryValidator()
    {
        RuleFor(c => c.Name).NotEmpty().MaximumLength(50);
        RuleFor(c => c.Color).Matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
        RuleFor(c => c.UserId).NotEmpty();
    }
}