using System.Text.RegularExpressions;

namespace AI_PMS.Application.Validators
{
    public static class FullNameValidator
    {
        public static bool IsValid(string? fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName))
                return false;

            string name = fullName.Trim();

            // Must contain at least two name parts
            var parts = name.Split(
                ' ',
                StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length < 2)
                return false;

            // Only letters, spaces, apostrophes and hyphens
            if (!Regex.IsMatch(
                    name,
                    @"^[\p{L}]+(?:[ '\-][\p{L}]+)+$"))
            {
                return false;
            }

            // Every name part must contain at least 2 letters
            foreach (var part in parts)
            {
                if (part.Replace("-", "")
                        .Replace("'", "")
                        .Length < 2)
                {
                    return false;
                }
            }

            return true;
        }
    }
}