using Microsoft.AspNetCore.Authorization;

namespace AI_PMS.API.Authorization
{
    [AttributeUsage(
        AttributeTargets.Class | AttributeTargets.Method,
        AllowMultiple = true,
        Inherited = true)]
    public class RequirePermissionAttribute : AuthorizeAttribute
    {
        public const string PolicyPrefix = "Permission:";

        public RequirePermissionAttribute(string permission)
        {
            if (string.IsNullOrWhiteSpace(permission))
            {
                throw new ArgumentException(
                    "Permission name cannot be empty.",
                    nameof(permission));
            }

            Policy = $"{PolicyPrefix}{permission}";
        }
    }
}