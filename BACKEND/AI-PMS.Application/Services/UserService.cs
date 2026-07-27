using AI_PMS.Application.DTOs.Users;
using AI_PMS.Application.Interfaces;
using AI_PMS.Domain.Entities;
using AI_PMS.Infrastructure.Repositories;
using AI_PMS.Infrastructure.Security;

namespace AI_PMS.Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserRepository _userRepository;
        private readonly PasswordHasher _passwordHasher;

        public UserService(UserRepository userRepository, PasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                throw new Exception("Email already exists.");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = _passwordHasher.HashPassword(dto.Password),
                Role = dto.Role,
                PhoneNumber = dto.PhoneNumber,
                Bio = dto.Bio,
                OrganizationId = dto.OrganizationId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.AddAsync(user);

            return MapToUserDto(createdUser);
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            return user == null ? null : MapToUserDto(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(MapToUserDto);
        }

        public async Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.ProfileImage = dto.ProfileImage;
            user.Bio = dto.Bio;
            user.Role = dto.Role;
            user.OrganizationId = dto.OrganizationId;
            user.UpdatedAt = DateTime.UtcNow;

            var updatedUser = await _userRepository.UpdateAsync(user);

            return MapToUserDto(updatedUser);
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            return await _userRepository.DeleteAsync(user);
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            return new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                ProfileImage = user.ProfileImage,
                Bio = user.Bio
            };
        }

        public async Task<bool> AssignRoleAsync(AssignRoleDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.UserId);

            if (user == null)
            {
                return false;
            }

            user.Role = dto.Role;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ActivateUserAsync(ActivateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.UserId);

            if (user == null)
            {
                return false;
            }

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return true;
        }

        public async Task<bool> DeactivateUserAsync(DeactivateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.UserId);

            if (user == null)
            {
                return false;
            }

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return true;
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                PhoneNumber = user.PhoneNumber,
                ProfileImage = user.ProfileImage,
                Bio = user.Bio,
                OrganizationId = user.OrganizationId,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}