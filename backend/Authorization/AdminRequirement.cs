using Microsoft.AspNetCore.Authorization;

namespace backend.Authorization
{
    public class AdminRequirement : IAuthorizationRequirement
    {
        public string RequiredRole { get; }

        public AdminRequirement(string requiredRole = "Admin")
        {
            RequiredRole = requiredRole;
        }
    }

    public class AdminAuthorizationHandler : AuthorizationHandler<AdminRequirement>
    {
        private readonly ILogger<AdminAuthorizationHandler> _logger;

        public AdminAuthorizationHandler(ILogger<AdminAuthorizationHandler> logger)
        {
            _logger = logger;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            AdminRequirement requirement)
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                _logger.LogWarning("User is not authenticated");
                context.Fail();
                return Task.CompletedTask;
            }

            var userRole = context.User.FindFirst("Role")?.Value;
            var userIsActive = context.User.FindFirst("IsActive")?.Value;

            if (string.IsNullOrEmpty(userRole))
            {
                _logger.LogWarning("User role not found in claims");
                context.Fail();
                return Task.CompletedTask;
            }

            if (userIsActive != "True")
            {
                _logger.LogWarning("User account is inactive");
                context.Fail();
                return Task.CompletedTask;
            }

            if (userRole == requirement.RequiredRole || userRole == "SuperAdmin")
            {
                _logger.LogInformation("User {UserId} authorized as {Role}", 
                    context.User.FindFirst("sub")?.Value, userRole);
                context.Succeed(requirement);
            }
            else
            {
                _logger.LogWarning("User {UserId} with role {UserRole} denied access to {RequiredRole}", 
                    context.User.FindFirst("sub")?.Value, userRole, requirement.RequiredRole);
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}




