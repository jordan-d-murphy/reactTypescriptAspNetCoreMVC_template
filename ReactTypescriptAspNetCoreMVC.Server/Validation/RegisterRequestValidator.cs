using FluentValidation;
using Microsoft.AspNetCore.Identity.Data;
// using DTOs;

namespace Validation
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            // RuleFor(x => x.UserName)
            //     .NotEmpty().WithMessage("Username is required.");

            RuleFor(x => x.Email)
                .NotEmpty().EmailAddress().WithMessage("Valid email is required.");

            RuleFor(x => x.Password)
                .NotEmpty().MinimumLength(6).WithMessage("Password must be at least 6 characters.");
        }
    }
}