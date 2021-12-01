using Microsoft.AspNetCore.Authorization;
using ReviewAPI.Auth;
using System.Threading.Tasks;

namespace ReviewAPI
{
    public record SameUserRequirement : IAuthorizationRequirement;

    public class SameUserAuthorizationHandler : AuthorizationHandler<SameUserRequirement, IUserOwnedResource>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SameUserRequirement requirement, IUserOwnedResource resource)
        {
            if (context.User.IsInRole("Admin") || context.User.FindFirst(CustomClaims.UserId)?.Value == resource.User.Id)
                context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
