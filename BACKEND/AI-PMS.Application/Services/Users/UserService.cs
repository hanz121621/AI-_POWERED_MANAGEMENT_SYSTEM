
using AI_PMS.Application.DTOs.Users;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Users;
using AI_PMS.Application.Validators;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Security;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Enums;
using System.ComponentModel.DataAnnotations;

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

            var normalizedName =
                dto.FullName.Trim();

            if (normalizedName.Length > 100)
            {
                throw new InvalidOperationException(
                    "Full name cannot exceed 100 characters.");
            }

            // -----------------------------------------------------
            // EMAIL VALIDATION
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new InvalidOperationException(
                    "Email address is required.");
            }

            var normalizedEmail =
                dto.Email.Trim().ToLowerInvariant();

            if (!new EmailAddressAttribute()
                .IsValid(normalizedEmail))
            {
                throw new InvalidOperationException(
                    "Please enter a valid email address.");
            }

            if (normalizedEmail.Length > 150)
            {
                throw new InvalidOperationException(
                    "Email address cannot exceed 150 characters.");
            }

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
            // PHONE NORMALIZATION
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
            // BIO
            // =====================================================

            var normalizedBio =
                string.IsNullOrWhiteSpace(dto.Bio)
                    ? null
                    : dto.Bio.Trim();

            if (normalizedBio != null &&
                normalizedBio.Length > 500)
            {
                throw new InvalidOperationException(
                    "Bio cannot exceed 500 characters.");
            }

            // =====================================================
            // TECHNICAL SKILLS
            // =====================================================

            var normalizedTechnicalSkills =
                string.IsNullOrWhiteSpace(dto.TechnicalSkills)
                    ? null
                    : dto.TechnicalSkills.Trim();

            if (normalizedTechnicalSkills != null &&
                normalizedTechnicalSkills.Length > 2000)
            {
                throw new InvalidOperationException(
                    "Technical skills cannot exceed 2000 characters.");
            }

            // =====================================================
            // PROFILE IMAGE
            // =====================================================

            var normalizedProfileImage =
                string.IsNullOrWhiteSpace(dto.ProfileImage)
                    ? null
                    : dto.ProfileImage.Trim();

            // =====================================================
            // CONTRIBUTOR VALIDATION
            // =====================================================

            if (dto.Role == Role.Contributor)
            {
                // -------------------------------------------------
                // CONTRIBUTOR TYPE IS REQUIRED
                // -------------------------------------------------

                if (!dto.ContributorTypeId.HasValue)
                {
                    throw new InvalidOperationException(
                        "Contributor Type is required for Contributor users.");
                }

                // -------------------------------------------------
                // VALIDATE CONTRIBUTOR TYPE
                // -------------------------------------------------

                var contributorTypeExists =
                    await _userRepository
                        .ContributorTypeExistsAsync(
                            dto.ContributorTypeId.Value);

                if (!contributorTypeExists)
                {
                    throw new InvalidOperationException(
                        "The selected Contributor Type does not exist or is inactive.");
                }

                // -------------------------------------------------
                // CHECK WHETHER TYPE HAS SUBTYPES
                // -------------------------------------------------

                var hasSubTypes =
                    await _userRepository
                        .ContributorTypeHasSubTypesAsync(
                            dto.ContributorTypeId.Value);

                // -------------------------------------------------
                // SUBTYPE REQUIRED IF TYPE HAS SUBTYPES
                // -------------------------------------------------

                if (hasSubTypes &&
                    !dto.ContributorSubTypeId.HasValue)
                {
                    throw new InvalidOperationException(
                        "Contributor Sub Type is required for this Contributor Type.");
                }

                // -------------------------------------------------
                // VALIDATE SUBTYPE
                // -------------------------------------------------

                if (dto.ContributorSubTypeId.HasValue)
                {
                    var contributorSubTypeExists =
                        await _userRepository
                            .ContributorSubTypeExistsAsync(
                                dto.ContributorSubTypeId.Value);

                    if (!contributorSubTypeExists)
                    {
                        throw new InvalidOperationException(
                            "The selected Contributor Sub Type does not exist or is inactive.");
                    }

                    // ---------------------------------------------
                    // VALIDATE TYPE ↔ SUBTYPE RELATIONSHIP
                    // ---------------------------------------------

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
                    normalizedName,

                Email =
                    normalizedEmail,

                PasswordHash =
                    _passwordHasher.HashPassword(
                        dto.Password),

                Role =
                    dto.Role,

                IsActive =
                    dto.IsActive,

                PhoneNumber =
                    normalizedPhone,

                Bio =
                    normalizedBio,

                TechnicalSkills =
                    normalizedTechnicalSkills,

                ProfileImage =
                    normalizedProfileImage,

                ContributorTypeId =
                    contributorTypeId,

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

            // =====================================================
            // FULL NAME
            // =====================================================

            if (!FullNameValidator.IsValid(dto.FullName))
            {
                throw new InvalidOperationException(
                    "Please enter a valid full name containing at least first name and father's name.");
            }

            var normalizedName =
                dto.FullName.Trim();

            if (normalizedName.Length > 100)
            {
                throw new InvalidOperationException(
                    "Full name cannot exceed 100 characters.");
            }

            // =====================================================
            // EMAIL
            // =====================================================

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new InvalidOperationException(
                    "Email address is required.");
            }

            var normalizedEmail =
                dto.Email.Trim().ToLowerInvariant();

            if (!new EmailAddressAttribute()
                .IsValid(normalizedEmail))
            {
                throw new InvalidOperationException(
                    "Please enter a valid email address.");
            }

            if (normalizedEmail.Length > 150)
            {
                throw new InvalidOperationException(
                    "Email address cannot exceed 150 characters.");
            }

            // =====================================================
            // PHONE
            // =====================================================

            var normalizedPhone =
                string.IsNullOrWhiteSpace(dto.PhoneNumber)
                    ? null
                    : dto.PhoneNumber.Trim();

            // =====================================================
            // BIO
            // =====================================================

            var normalizedBio =
                string.IsNullOrWhiteSpace(dto.Bio)
                    ? null
                    : dto.Bio.Trim();

            if (normalizedBio != null &&
                normalizedBio.Length > 500)
            {
                throw new InvalidOperationException(
                    "Bio cannot exceed 500 characters.");
            }

            // =====================================================
            // TECHNICAL SKILLS
            // =====================================================

            var normalizedTechnicalSkills =
                string.IsNullOrWhiteSpace(dto.TechnicalSkills)
                    ? null
                    : dto.TechnicalSkills.Trim();

            if (normalizedTechnicalSkills != null &&
                normalizedTechnicalSkills.Length > 2000)
            {
                throw new InvalidOperationException(
                    "Technical skills cannot exceed 2000 characters.");
            }

            // =====================================================
            // PROFILE IMAGE
            // =====================================================

            var normalizedProfileImage =
                string.IsNullOrWhiteSpace(dto.ProfileImage)
                    ? null
                    : dto.ProfileImage.Trim();

            // =====================================================
            // EMAIL DUPLICATE CHECK
            // =====================================================

            var existingUser =
                await _userRepository.GetByEmailAsync(
                    normalizedEmail);

            if (existingUser != null &&
                existingUser.Id != id)
            {
                throw new InvalidOperationException(
                    "A user with this email already exists.");
            }

            // =====================================================
            // PHONE DUPLICATE CHECK
            // =====================================================

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

            if (dto.Role == Role.Contributor)
            {
                // -------------------------------------------------
                // CONTRIBUTOR TYPE IS REQUIRED
                // -------------------------------------------------

                if (!dto.ContributorTypeId.HasValue)
                {
                    throw new InvalidOperationException(
                        "Contributor Type is required for Contributor users.");
                }

                // -------------------------------------------------
                // VALIDATE CONTRIBUTOR TYPE
                // -------------------------------------------------

                var contributorTypeExists =
                    await _userRepository
                        .ContributorTypeExistsAsync(
                            dto.ContributorTypeId.Value);

                if (!contributorTypeExists)
                {
                    throw new InvalidOperationException(
                        "The selected Contributor Type does not exist or is inactive.");
                }

                // -------------------------------------------------
                // CHECK WHETHER TYPE HAS SUBTYPES
                // -------------------------------------------------

                var hasSubTypes =
                    await _userRepository
                        .ContributorTypeHasSubTypesAsync(
                            dto.ContributorTypeId.Value);

                // -------------------------------------------------
                // SUBTYPE REQUIRED IF TYPE HAS SUBTYPES
                // -------------------------------------------------

                if (hasSubTypes &&
                    !dto.ContributorSubTypeId.HasValue)
                {
                    throw new InvalidOperationException(
                        "Contributor Sub Type is required for this Contributor Type.");
                }

                // -------------------------------------------------
                // VALIDATE SUBTYPE
                // -------------------------------------------------

                if (dto.ContributorSubTypeId.HasValue)
                {
                    var contributorSubTypeExists =
                        await _userRepository
                            .ContributorSubTypeExistsAsync(
                                dto.ContributorSubTypeId.Value);

                    if (!contributorSubTypeExists)
                    {
                        throw new InvalidOperationException(
                            "The selected Contributor Sub Type does not exist or is inactive.");
                    }

                    // ---------------------------------------------
                    // VALIDATE TYPE ↔ SUBTYPE RELATIONSHIP
                    // ---------------------------------------------

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

                string.Equals(
                    user.TechnicalSkills?.Trim(),
                    normalizedTechnicalSkills,
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
                    user.ProfileImage?.Trim(),
                    normalizedProfileImage,
                    StringComparison.Ordinal)

                &&

                user.Role == dto.Role

                &&

                user.IsActive == dto.IsActive

                &&

                user.ContributorTypeId ==
                    contributorTypeId

                &&

                user.ContributorSubTypeId ==
                    contributorSubTypeId;

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

            user.TechnicalSkills =
                normalizedTechnicalSkills;

            user.ProfileImage =
                normalizedProfileImage;

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
            // =====================================================
            // VALIDATE USER ID
            // =====================================================

            if (userId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Invalid user identity.");
            }

            // =====================================================
            // GET USER
            // =====================================================

            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            // =====================================================
            // GET TEAM MEMBERSHIPS
            // =====================================================

            var teamMemberships =
                await _userRepository
                    .GetActiveTeamMembershipsAsync(userId);

            // =====================================================
            // GET ASSIGNED PROJECTS
            // =====================================================

            var projects =
                await _userRepository
                    .GetAssignedProjectsAsync(userId);

            // =====================================================
            // MAP USER
            // =====================================================

            var profile =
                MapToDto(user);

            // =====================================================
            // TEAM
            // =====================================================

            // A user can technically belong to more than one team,
            // so we expose the first active team as the primary
            // displayed team.

            var primaryTeam =
                teamMemberships.FirstOrDefault();

            if (primaryTeam?.Team != null)
            {
                profile.TeamId =
                    primaryTeam.Team.Id;

                profile.TeamName =
                    primaryTeam.Team.Name;
            }

            // =====================================================
            // ASSIGNED PROJECTS
            // =====================================================

            profile.AssignedProjects =
                projects.Select(project => new UserProjectDto
                {
                    Id =
                        project.Id,

                    Name =
                        project.Name,

                    Description =
                        project.Description,

                    Priority =
                        project.Priority,

                    ProgressPercentage =
                        project.ProgressPercentage,

                    StartDate =
                        project.StartDate,

                    Deadline =
                        project.Deadline
                }).ToList();

            // =====================================================
            // ACTIVITY LOG
            // =====================================================

            await _activityLogService.CreateAsync(
                userId,
                "PROFILE_VIEWED",
                "Profile",
                userId,
                "User",
                "User viewed their profile.");

            return profile;
        }

        // =========================================================
        // UPDATE MY PROFILE
        // =========================================================

        public async Task<bool> UpdateMyProfileAsync(
            Guid userId,
            UpdateProfileDto dto)
        {
            // =====================================================
            // VALIDATE REQUEST
            // =====================================================

            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            if (userId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Invalid user identity.");
            }

            // =====================================================
            // GET CURRENT AUTHENTICATED USER
            // =====================================================

            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            // =====================================================
            // FULL NAME VALIDATION
            // =====================================================

            if (string.IsNullOrWhiteSpace(dto.FullName))
            {
                throw new InvalidOperationException(
                    "Full name is required.");
            }

            if (!FullNameValidator.IsValid(dto.FullName))
            {
                throw new InvalidOperationException(
                    "Please enter a valid full name containing at least first name and father's name.");
            }

            var normalizedName =
                dto.FullName.Trim();

            if (normalizedName.Length > 100)
            {
                throw new InvalidOperationException(
                    "Full name cannot exceed 100 characters.");
            }

            // =====================================================
            // EMAIL VALIDATION
            // =====================================================

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new InvalidOperationException(
                    "Email address is required.");
            }

            var normalizedEmail =
                dto.Email.Trim().ToLowerInvariant();

            if (!new EmailAddressAttribute()
                .IsValid(normalizedEmail))
            {
                throw new InvalidOperationException(
                    "Please enter a valid email address.");
            }

            if (normalizedEmail.Length > 150)
            {
                throw new InvalidOperationException(
                    "Email address cannot exceed 150 characters.");
            }

            // =====================================================
            // EMAIL DUPLICATE CHECK
            // =====================================================

            var existingUser =
                await _userRepository.GetByEmailAsync(
                    normalizedEmail);

            if (existingUser != null &&
                existingUser.Id != userId)
            {
                throw new InvalidOperationException(
                    "A user with this email already exists.");
            }

            // =====================================================
            // PHONE NORMALIZATION
            // =====================================================

            var normalizedPhone =
                string.IsNullOrWhiteSpace(dto.PhoneNumber)
                    ? null
                    : dto.PhoneNumber.Trim();

            // =====================================================
            // PHONE DUPLICATE CHECK
            // =====================================================

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

            // =====================================================
            // BIO NORMALIZATION
            // =====================================================

            var normalizedBio =
                string.IsNullOrWhiteSpace(dto.Bio)
                    ? null
                    : dto.Bio.Trim();

            if (normalizedBio != null &&
                normalizedBio.Length > 500)
            {
                throw new InvalidOperationException(
                    "Bio cannot exceed 500 characters.");
            }

            // =====================================================
            // TECHNICAL SKILLS
            // =====================================================

            var normalizedTechnicalSkills =
                string.IsNullOrWhiteSpace(dto.TechnicalSkills)
                    ? null
                    : dto.TechnicalSkills.Trim();

            if (normalizedTechnicalSkills != null &&
                normalizedTechnicalSkills.Length > 2000)
            {
                throw new InvalidOperationException(
                    "Technical skills cannot exceed 2000 characters.");
            }

            // =====================================================
            // PROFILE IMAGE
            // =====================================================

            var normalizedProfileImage =
                string.IsNullOrWhiteSpace(dto.ProfileImage)
                    ? null
                    : dto.ProfileImage.Trim();

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
                    user.TechnicalSkills?.Trim(),
                    normalizedTechnicalSkills,
                    StringComparison.OrdinalIgnoreCase)

                &&

                string.Equals(
                    user.ProfileImage?.Trim(),
                    normalizedProfileImage,
                    StringComparison.Ordinal);

            if (noChanges)
            {
                throw new InvalidOperationException(
                    "No changes were made. The submitted profile information is already the same.");
            }

            // =====================================================
            // APPLY PROFILE CHANGES
            // =====================================================

            user.FullName =
                normalizedName;

            user.Email =
                normalizedEmail;

            user.PhoneNumber =
                normalizedPhone;

            user.Bio =
                normalizedBio;

            user.TechnicalSkills =
                normalizedTechnicalSkills;

            user.ProfileImage =
                normalizedProfileImage;

            // =====================================================
            // IMPORTANT SECURITY RULE
            // =====================================================
            //
            // DO NOT modify:
            //
            // user.Role
            // user.IsActive
            // user.ContributorTypeId
            // user.ContributorSubTypeId
            //
            // Profile update must preserve the user's
            // existing role, permissions and relationships.
            //

            user.UpdatedAt =
                DateTime.UtcNow;

            // =====================================================
            // SAVE
            // =====================================================

            await _userRepository.UpdateAsync(user);

            // =====================================================
            // ACTIVITY / AUDIT LOG
            // =====================================================

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
                // =================================================
                // BASIC INFORMATION
                // =================================================

                Id =
                    user.Id,

                FullName =
                    user.FullName,

                Email =
                    user.Email,

                // =================================================
                // SYSTEM ROLE
                // =================================================

                Role =
                    user.Role,

                IsActive =
                    user.IsActive,

                // =================================================
                // CONTACT / PROFILE
                // =================================================

                PhoneNumber =
                    user.PhoneNumber,

                ProfileImage =
                    user.ProfileImage,

                Bio =
                    user.Bio,

                // =================================================
                // PROFESSIONAL INFORMATION
                // =================================================

                TechnicalSkills =
                    user.TechnicalSkills,

                // =================================================
                // CONTRIBUTOR CLASSIFICATION
                // =================================================

                ContributorTypeId =
                    user.ContributorTypeId,

                ContributorTypeName =
                    user.ContributorType?.Name,

                ContributorSubTypeId =
                    user.ContributorSubTypeId,

                ContributorSubTypeName =
                    user.ContributorSubType?.Name,

                // =================================================
                // LOGIN INFORMATION
                // =================================================

                LastLoginAt =
                    user.LastLoginAt,

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
