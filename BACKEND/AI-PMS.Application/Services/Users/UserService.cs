using AI_PMS.Application.DTOs.Users;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Users;
using AI_PMS.Application.Validators;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Security;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Enums;



namespace AI_PMS.Application.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IActivityLogService _activityLogService;

        public UserService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IActivityLogService activityLogService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _activityLogService = activityLogService;
        }

        // =========================================================
        // CREATE USER
        // =========================================================

        public async Task<UserDto?> CreateUserAsync(
            CreateUserDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            // -----------------------------------------------------
            // PASSWORD VALIDATION
            // -----------------------------------------------------

            if (dto.Password != dto.ConfirmPassword)
            {
                throw new InvalidOperationException(
                    "Password and confirmation password do not match.");
            }

            // -----------------------------------------------------
            // FULL NAME VALIDATION
            // -----------------------------------------------------

            if (!FullNameValidator.IsValid(dto.FullName))
            {
                throw new InvalidOperationException(
                    "Please enter a valid full name containing at least first name and father's name.");
            }

            // -----------------------------------------------------
            // NORMALIZE EMAIL
            // -----------------------------------------------------

            var normalizedEmail =
                dto.Email.Trim().ToLowerInvariant();

            // -----------------------------------------------------
            // EMAIL DUPLICATE CHECK
            // -----------------------------------------------------

            var existingUser =
                await _userRepository.GetByEmailAsync(
                    normalizedEmail);

            if (existingUser != null)
            {
                return null;
            }

            // -----------------------------------------------------
            // NORMALIZE PHONE
            // -----------------------------------------------------

            var normalizedPhone =
                string.IsNullOrWhiteSpace(dto.PhoneNumber)
                    ? null
                    : dto.PhoneNumber.Trim();

            // -----------------------------------------------------
            // PHONE DUPLICATE CHECK
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(normalizedPhone))
            {
                var users =
                    await _userRepository.GetAllAsync();

                var phoneExists =
                    users.Any(u =>
                        !string.IsNullOrWhiteSpace(
                            u.PhoneNumber)
                        &&
                        string.Equals(
                            u.PhoneNumber.Trim(),
                            normalizedPhone,
                            StringComparison.OrdinalIgnoreCase));

                if (phoneExists)
                {
                    throw new InvalidOperationException(
                        "A user with this phone number already exists.");
                }
            }

          // =====================================================
// CONTRIBUTOR VALIDATION
// =====================================================

if (dto.Role == Role.Contributor)
{
    // -----------------------------------------------------
    // CONTRIBUTOR TYPE IS REQUIRED
    // -----------------------------------------------------

    if (!dto.ContributorTypeId.HasValue)
    {
        throw new InvalidOperationException(
            "Contributor Type is required for Contributor users.");
    }

    // -----------------------------------------------------
    // CONTRIBUTOR SUBTYPE IS REQUIRED
    // -----------------------------------------------------

    if (!dto.ContributorSubTypeId.HasValue)
    {
        throw new InvalidOperationException(
            "Contributor Sub Type is required for Contributor users.");
    }

    // -----------------------------------------------------
    // VALIDATE TYPE + SUBTYPE RELATIONSHIP
    // -----------------------------------------------------
    //
    // Example:
    //
    // Type:
    // Developer
    //
    // Subtype:
    // Backend Developer
    //
    // Backend Developer MUST belong to Developer.
    //
    // -----------------------------------------------------

    var classificationExists =
        await _userRepository
            .ContributorClassificationExistsAsync(
                dto.ContributorTypeId.Value,
                dto.ContributorSubTypeId.Value);

    if (!classificationExists)
    {
        throw new InvalidOperationException(
            "The selected Contributor Sub Type does not belong to the selected Contributor Type.");
    }
}

            // =====================================================
            // NON-CONTRIBUTOR USERS
            // =====================================================

            Guid? contributorTypeId =
                dto.Role == Role.Contributor
                    ? dto.ContributorTypeId
                    : null;

            Guid? contributorSubTypeId =
                dto.Role == Role.Contributor
                    ? dto.ContributorSubTypeId
                    : null;

            // =====================================================
            // CREATE ENTITY
            // =====================================================

            var user = new User
            {
                Id = Guid.NewGuid(),

                FullName =
                    dto.FullName.Trim(),

                Email =
                    normalizedEmail,

                PasswordHash =
                    _passwordHasher.HashPassword(
                        dto.Password),

                Role =
                    dto.Role,

                // IMPORTANT:
                // Save the status received from frontend.
                IsActive =
                    dto.IsActive,

                PhoneNumber =
                    normalizedPhone,

                Bio =
                    string.IsNullOrWhiteSpace(dto.Bio)
                        ? null
                        : dto.Bio.Trim(),

                // IMPORTANT:
                // Save contributor type.
                ContributorTypeId =
                    contributorTypeId,

                // IMPORTANT:
                // Save contributor subtype.
                ContributorSubTypeId =
                    contributorSubTypeId,

                CreatedAt =
                    DateTime.UtcNow
            };

            // =====================================================
            // SAVE
            // =====================================================

            var createdUser =
                await _userRepository.AddAsync(user);

            // =====================================================
            // RETURN DTO
            // =====================================================

            return MapToDto(createdUser);
        }

        // =========================================================
        // GET ALL USERS
        // =========================================================

        public async Task<IEnumerable<UserDto>>
            GetAllUsersAsync()
        {
            var users =
                await _userRepository.GetAllAsync();

            return users.Select(MapToDto);
        }

        // =========================================================
        // GET USER BY ID
        // =========================================================

        public async Task<UserDto?> GetUserByIdAsync(
            Guid id)
        {
            var user =
                await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            return MapToDto(user);
        }

        // =========================================================
        // UPDATE USER
        // =========================================================

        public async Task<bool> UpdateUserAsync(
            Guid id,
            UpdateUserDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            var user =
                await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            // -----------------------------------------------------
            // FULL NAME
            // -----------------------------------------------------

            if (!FullNameValidator.IsValid(dto.FullName))
            {
                throw new InvalidOperationException(
                    "Please enter a valid full name containing at least first name and father's name.");
            }

            var normalizedName =
                dto.FullName.Trim();

            // -----------------------------------------------------
            // EMAIL
            // -----------------------------------------------------

            var normalizedEmail =
                dto.Email.Trim().ToLowerInvariant();

            // -----------------------------------------------------
            // PHONE
            // -----------------------------------------------------

            var normalizedPhone =
                string.IsNullOrWhiteSpace(dto.PhoneNumber)
                    ? null
                    : dto.PhoneNumber.Trim();

            // -----------------------------------------------------
            // BIO
            // -----------------------------------------------------

            var normalizedBio =
                string.IsNullOrWhiteSpace(dto.Bio)
                    ? null
                    : dto.Bio.Trim();

            // -----------------------------------------------------
            // EMAIL DUPLICATE CHECK
            // -----------------------------------------------------

            var existingUser =
                await _userRepository.GetByEmailAsync(
                    normalizedEmail);

            if (
                existingUser != null
                &&
                existingUser.Id != id)
            {
                throw new InvalidOperationException(
                    "A user with this email already exists.");
            }

            // -----------------------------------------------------
            // PHONE DUPLICATE CHECK
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(normalizedPhone))
            {
                var users =
                    await _userRepository.GetAllAsync();

                var phoneExists =
                    users.Any(u =>
                        u.Id != id
                        &&
                        !string.IsNullOrWhiteSpace(
                            u.PhoneNumber)
                        &&
                        string.Equals(
                            u.PhoneNumber.Trim(),
                            normalizedPhone,
                            StringComparison.OrdinalIgnoreCase));

                if (phoneExists)
                {
                    throw new InvalidOperationException(
                        "A user with this phone number already exists.");
                }
            }

            // =====================================================
            // CONTRIBUTOR VALIDATION
            // =====================================================

           // =====================================================
// CONTRIBUTOR VALIDATION
// =====================================================

if (dto.Role == Role.Contributor)
{
    // -----------------------------------------------------
    // CONTRIBUTOR TYPE IS REQUIRED
    // -----------------------------------------------------

    if (!dto.ContributorTypeId.HasValue)
    {
        throw new InvalidOperationException(
            "Contributor Type is required for Contributor users.");
    }

    // -----------------------------------------------------
    // CONTRIBUTOR SUBTYPE IS REQUIRED
    // -----------------------------------------------------

    if (!dto.ContributorSubTypeId.HasValue)
    {
        throw new InvalidOperationException(
            "Contributor Sub Type is required for Contributor users.");
    }

    // -----------------------------------------------------
    // VALIDATE CONTRIBUTOR TYPE
    // -----------------------------------------------------

    var contributorTypeExists =
        await _userRepository
            .ContributorTypeExistsAsync(
                dto.ContributorTypeId.Value);

    if (!contributorTypeExists)
    {
        throw new InvalidOperationException(
            "The selected Contributor Type does not exist or is inactive.");
    }

    // -----------------------------------------------------
    // VALIDATE CONTRIBUTOR SUBTYPE
    // -----------------------------------------------------

    var contributorSubTypeExists =
        await _userRepository
            .ContributorSubTypeExistsAsync(
                dto.ContributorSubTypeId.Value);

    if (!contributorSubTypeExists)
    {
        throw new InvalidOperationException(
            "The selected Contributor Sub Type does not exist or is inactive.");
    }

    // -----------------------------------------------------
    // VALIDATE TYPE ↔ SUBTYPE RELATIONSHIP
    // -----------------------------------------------------

    var classificationExists =
        await _userRepository
            .ContributorClassificationExistsAsync(
                dto.ContributorTypeId.Value,
                dto.ContributorSubTypeId.Value);

    if (!classificationExists)
    {
        throw new InvalidOperationException(
            "The selected Contributor Sub Type does not belong to the selected Contributor Type.");
    }
}

            Guid? contributorTypeId =
                dto.Role == Role.Contributor
                    ? dto.ContributorTypeId
                    : null;

            Guid? contributorSubTypeId =
                dto.Role == Role.Contributor
                    ? dto.ContributorSubTypeId
                    : null;

            // =====================================================
            // NO CHANGE CHECK
            // =====================================================

            var noChanges =
                string.Equals(
                    user.FullName?.Trim(),
                    normalizedName,
                    StringComparison.OrdinalIgnoreCase)

                &&

                string.Equals(
                    user.Email?.Trim(),
                    normalizedEmail,
                    StringComparison.OrdinalIgnoreCase)

                &&

                user.Role == dto.Role

                &&

                user.IsActive == dto.IsActive

                &&

                user.ContributorTypeId ==
                    contributorTypeId

                &&

                user.ContributorSubTypeId ==
                    contributorSubTypeId

                &&

                string.Equals(
                    user.PhoneNumber?.Trim(),
                    normalizedPhone,
                    StringComparison.OrdinalIgnoreCase)

                &&

                string.Equals(
                    user.Bio?.Trim(),
                    normalizedBio,
                    StringComparison.OrdinalIgnoreCase);

            if (noChanges)
            {
                throw new InvalidOperationException(
                    "No changes were made. The submitted information is already the same.");
            }

            // =====================================================
            // APPLY CHANGES
            // =====================================================

            user.FullName =
                normalizedName;

            user.Email =
                normalizedEmail;

            user.Role =
                dto.Role;

            user.IsActive =
                dto.IsActive;

            user.ContributorTypeId =
                contributorTypeId;

            user.ContributorSubTypeId =
                contributorSubTypeId;

            user.PhoneNumber =
                normalizedPhone;

            user.Bio =
                normalizedBio;

            user.UpdatedAt =
                DateTime.UtcNow;

            // =====================================================
            // SAVE
            // =====================================================

            await _userRepository.UpdateAsync(user);

            return true;
        }

        // =========================================================
        // DELETE USER
        // =========================================================

        public async Task<bool> DeleteUserAsync(
            Guid id)
        {
            var user =
                await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteAsync(user);

            return true;
        }

        // =========================================================
        // CHANGE USER STATUS
        // =========================================================

        public async Task<bool> ChangeUserStatusAsync(
            Guid id,
            bool isActive)
        {
            var user =
                await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            if (user.IsActive == isActive)
            {
                throw new InvalidOperationException(
                    isActive
                        ? "User is already active."
                        : "User is already inactive.");
            }

            user.IsActive =
                isActive;

            user.UpdatedAt =
                DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return true;
        }

        // =========================================================
        // CHANGE USER ROLE
        // =========================================================

        public async Task<bool> ChangeUserRoleAsync(
            Guid id,
            Role role)
        {
            var user =
                await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            if (user.Role == role)
            {
                throw new InvalidOperationException(
                    $"User already has the {role} role.");
            }

            user.Role =
                role;

            // If changing away from Contributor,
            // clear contributor classification.
            if (role != Role.Contributor)
            {
                user.ContributorTypeId = null;
                user.ContributorSubTypeId = null;
            }

            user.UpdatedAt =
                DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return true;
        }

        // =========================================================
        // GET MY PROFILE
        // =========================================================

        public async Task<UserDto?> GetMyProfileAsync(
            Guid userId)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            await _activityLogService.CreateAsync(
                userId,
                "PROFILE_VIEWED",
                "Profile",
                userId,
                "User",
                "User viewed their profile.");

            return MapToDto(user);
        }

        // =========================================================
        // UPDATE MY PROFILE
        // =========================================================

        public async Task<bool> UpdateMyProfileAsync(
            Guid userId,
            UpdateProfileDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            if (!FullNameValidator.IsValid(dto.FullName))
            {
                throw new InvalidOperationException(
                    "Please enter a valid full name containing at least first name and father's name.");
            }

            var normalizedName =
                dto.FullName.Trim();

            var normalizedPhone =
                string.IsNullOrWhiteSpace(dto.PhoneNumber)
                    ? null
                    : dto.PhoneNumber.Trim();

            var normalizedBio =
                string.IsNullOrWhiteSpace(dto.Bio)
                    ? null
                    : dto.Bio.Trim();

            // -----------------------------------------------------
            // PHONE DUPLICATE CHECK
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(normalizedPhone))
            {
                var users =
                    await _userRepository.GetAllAsync();

                var phoneExists =
                    users.Any(u =>
                        u.Id != userId
                        &&
                        !string.IsNullOrWhiteSpace(
                            u.PhoneNumber)
                        &&
                        string.Equals(
                            u.PhoneNumber.Trim(),
                            normalizedPhone,
                            StringComparison.OrdinalIgnoreCase));

                if (phoneExists)
                {
                    throw new InvalidOperationException(
                        "A user with this phone number already exists.");
                }
            }

            // -----------------------------------------------------
            // NO CHANGE CHECK
            // -----------------------------------------------------

            var noChanges =
                string.Equals(
                    user.FullName?.Trim(),
                    normalizedName,
                    StringComparison.OrdinalIgnoreCase)

                &&

                string.Equals(
                    user.PhoneNumber?.Trim(),
                    normalizedPhone,
                    StringComparison.OrdinalIgnoreCase)

                &&

                string.Equals(
                    user.Bio?.Trim(),
                    normalizedBio,
                    StringComparison.OrdinalIgnoreCase)

                &&

                string.Equals(
                    user.ProfileImage,
                    dto.ProfileImage,
                    StringComparison.Ordinal);

            if (noChanges)
            {
                throw new InvalidOperationException(
                    "No changes were made. The submitted profile information is already the same.");
            }

            // -----------------------------------------------------
            // APPLY
            // -----------------------------------------------------

            user.FullName =
                normalizedName;

            user.PhoneNumber =
                normalizedPhone;

            user.Bio =
                normalizedBio;

            user.ProfileImage =
                dto.ProfileImage;

            user.UpdatedAt =
                DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            await _activityLogService.CreateAsync(
                userId,
                "PROFILE_UPDATED",
                "Profile",
                userId,
                "User",
                "User updated their profile.");

            return true;
        }

        // =========================================================
        // ENTITY → DTO
        // =========================================================

        private static UserDto MapToDto(
            User user)
        {
            return new UserDto
            {
                Id =
                    user.Id,

                FullName =
                    user.FullName,

                Email =
                    user.Email,

                Role =
                    user.Role,

                IsActive =
                    user.IsActive,

                PhoneNumber =
                    user.PhoneNumber,

                ProfileImage =
                    user.ProfileImage,

                Bio =
                    user.Bio,

                // =================================================
                // CONTRIBUTOR TYPE
                // =================================================

                ContributorTypeId =
                    user.ContributorTypeId,

                ContributorTypeName =
                    user.ContributorType?.Name,

                // =================================================
                // CONTRIBUTOR SUBTYPE
                // =================================================

                ContributorSubTypeId =
                    user.ContributorSubTypeId,

                ContributorSubTypeName =
                    user.ContributorSubType?.Name,

                // =================================================
                // AUDIT
                // =================================================

                CreatedAt =
                    user.CreatedAt,

                UpdatedAt =
                    user.UpdatedAt
            };
        }
    }
}