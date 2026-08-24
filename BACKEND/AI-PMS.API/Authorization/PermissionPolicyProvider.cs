using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace AI_PMS.API.Authorization
{
    public class PermissionPolicyProvider
        : DefaultAuthorizationPolicyProvider
    {
        public PermissionPolicyProvider(
            IOptions<AuthorizationOptions> options)
            : base(options)
        {
        }

        public override async Task<AuthorizationPolicy?>
            GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith(
                    RequirePermissionAttribute.PolicyPrefix,
                    StringComparison.OrdinalIgnoreCase))
            {
                var permission =
                    policyName.Substring(
                        RequirePermissionAttribute.PolicyPrefix.Length);

                if (string.IsNullOrWhiteSpace(permission))
                {
                    return null;
                }

                var policy =
                    new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .AddRequirements(
                            new PermissionRequirement(permission))
                        .Build();

                return await Task.FromResult(policy);
            }

            return await base.GetPolicyAsync(policyName);
        }
    }
}