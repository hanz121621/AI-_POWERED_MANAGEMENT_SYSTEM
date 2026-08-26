
// ============================================================
// AIPMS USER SERVICE
// BACKEND API VERSION
// ============================================================

import api from "@/services/api";

// ============================================================
// ROLE CONSTANTS
// Backend enum:
// Admin       = 1
// Manager     = 2
// Contributor = 3
// ============================================================

export const USER_ROLES = {
    ADMIN: 1,
    MANAGER: 2,
    CONTRIBUTOR: 3,
};

// ============================================================
// NORMALIZE ROLE
// Supports numeric and string backend values.
// ============================================================

export function normalizeUserRole(role) {
    if (
        role === 1 ||
        role === "1" ||
        String(role).trim().toLowerCase() === "admin"
    ) {
        return "Admin";
    }

    if (
        role === 2 ||
        role === "2" ||
        String(role).trim().toLowerCase() === "manager"
    ) {
        return "Manager";
    }

    if (
        role === 3 ||
        role === "3" ||
        String(role).trim().toLowerCase() === "contributor"
    ) {
        return "Contributor";
    }

    return "";
}

// ============================================================
// NORMALIZE USER
// ============================================================

export function normalizeUser(user) {
    if (!user) {
        return null;
    }

    return {
        ...user,

        id:
            user?.id ??
            user?.userId ??
            user?.Id ??
            user?.UserId,

        userId:
            user?.userId ??
            user?.id ??
            user?.Id ??
            user?.UserId,

        fullName:
            user?.fullName ??
            user?.name ??
            user?.userName ??
            user?.username ??
            user?.FullName ??
            "",

        email:
            user?.email ??
            user?.Email ??
            "",

        role: normalizeUserRole(
            user?.role ??
            user?.Role
        ),

        // ====================================================
        // ACCOUNT STATUS
        // ====================================================

        isActive:
            user?.isActive ??
            user?.IsActive ??
            true,

        // ====================================================
        // CONTACT
        // ====================================================

        phoneNumber:
            user?.phoneNumber ??
            user?.PhoneNumber ??
            null,

        bio:
            user?.bio ??
            user?.Bio ??
            null,

        // ====================================================
        // CONTRIBUTOR
        // ====================================================

        contributorTypeId:
            user?.contributorTypeId ??
            user?.ContributorTypeId ??
            null,

        contributorSubTypeId:
            user?.contributorSubTypeId ??
            user?.ContributorSubTypeId ??
            null,

        contributorType:
            user?.contributorType ??
            user?.ContributorType ??
            user?.contributorTypeName ??
            user?.ContributorTypeName ??
            null,

        contributorSubType:
            user?.contributorSubType ??
            user?.ContributorSubType ??
            user?.contributorSubTypeName ??
            user?.ContributorSubTypeName ??
            null,

        // ====================================================
        // OTHER POSSIBLE BACKEND FIELDS
        // ====================================================

        contributorTypeDefinitionId:
            user?.contributorTypeDefinitionId ??
            user?.ContributorTypeDefinitionId ??
            null,

        developerSpecializationId:
            user?.developerSpecializationId ??
            user?.DeveloperSpecializationId ??
            null,

        staffSpecializationId:
            user?.staffSpecializationId ??
            user?.StaffSpecializationId ??
            null,
    };
}

// ============================================================
// GET API ERROR MESSAGE
// ============================================================

function getApiErrorMessage(
    error,
    fallback = "Unable to complete the request."
) {
    const response =
        error?.response;

    if (!response) {
        return (
            error?.message ||
            fallback
        );
    }

    const data =
        response.data;

    console.error(
        "API ERROR STATUS:",
        response.status
    );

    console.error(
        "API ERROR DATA:",
        data
    );

    // ASP.NET validation errors
    if (
        data?.errors &&
        typeof data.errors === "object"
    ) {
        const messages = [];

        Object.entries(
            data.errors
        ).forEach(
            ([field, fieldMessages]) => {
                if (
                    Array.isArray(
                        fieldMessages
                    )
                ) {
                    fieldMessages.forEach(
                        (message) => {
                            messages.push(
                                `${field}: ${message}`
                            );
                        }
                    );
                } else if (
                    fieldMessages
                ) {
                    messages.push(
                        `${field}: ${fieldMessages}`
                    );
                }
            }
        );

        if (
            messages.length > 0
        ) {
            return messages.join(
                "\n"
            );
        }
    }

    return (
        data?.detail ||
        data?.title ||
        data?.message ||
        (
            typeof data === "string"
                ? data
                : fallback
        )
    );
}

// ============================================================
// GET ALL USERS
// GET /api/Users
// ============================================================

export async function getAllUsers() {
    try {
        const response =
            await api.get(
                "/Users"
            );

        console.log(
            "========== GET USERS =========="
        );

        console.log(
            "STATUS:",
            response.status
        );

        console.log(
            "RAW USERS RESPONSE:",
            response.data
        );

        const data =
            response.data;

        let users = [];

        if (
            Array.isArray(data)
        ) {
            users = data;
        } else if (
            Array.isArray(
                data?.users
            )
        ) {
            users = data.users;
        } else if (
            Array.isArray(
                data?.data
            )
        ) {
            users = data.data;
        } else if (
            Array.isArray(
                data?.items
            )
        ) {
            users = data.items;
        } else if (
            Array.isArray(
                data?.result
            )
        ) {
            users = data.result;
        }

        const normalizedUsers =
            users
                .map(
                    normalizeUser
                )
                .filter(Boolean);

        console.log(
            "NORMALIZED USERS:",
            normalizedUsers
        );

        console.log(
            "USER COUNTS:",
            {
                total:
                    normalizedUsers.length,

                admins:
                    normalizedUsers.filter(
                        (user) =>
                            user.role ===
                            "Admin"
                    ).length,

                managers:
                    normalizedUsers.filter(
                        (user) =>
                            user.role ===
                            "Manager"
                    ).length,

                contributors:
                    normalizedUsers.filter(
                        (user) =>
                            user.role ===
                            "Contributor"
                    ).length,

                active:
                    normalizedUsers.filter(
                        (user) =>
                            user.isActive !==
                            false
                    ).length,

                inactive:
                    normalizedUsers.filter(
                        (user) =>
                            user.isActive ===
                            false
                    ).length,
            }
        );

        console.log(
            "================================"
        );

        return normalizedUsers;
    } catch (error) {
        console.error(
            "GET USERS ERROR:",
            error
        );

        console.error(
            "GET USERS RESPONSE:",
            error?.response?.data
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load users."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// GET USERS
// ============================================================

export async function getUsers() {
    return getAllUsers();
}

// ============================================================
// GET USERS BY ROLE
// ============================================================

export async function getUsersByRole(
    role
) {
    const users =
        await getAllUsers();

    const normalizedRole =
        normalizeUserRole(
            role
        );

    if (!normalizedRole) {
        return users;
    }

    return users.filter(
        (user) =>
            normalizeUserRole(
                user?.role
            ) ===
            normalizedRole
    );
}

// ============================================================
// GET ADMINS
// ============================================================

export async function getAdmins() {
    return getUsersByRole(
        USER_ROLES.ADMIN
    );
}

// ============================================================
// GET MANAGERS
// ============================================================

export async function getManagers() {
    return getUsersByRole(
        USER_ROLES.MANAGER
    );
}

// ============================================================
// GET CONTRIBUTORS
// ============================================================

export async function getContributors() {
    return getUsersByRole(
        USER_ROLES.CONTRIBUTOR
    );
}

// ============================================================
// GET ACTIVE USERS
// ============================================================

export async function getActiveUsers() {
    const users =
        await getAllUsers();

    return users.filter(
        (user) =>
            user?.isActive !== false
    );
}

// ============================================================
// GET INACTIVE USERS
// ============================================================

export async function getInactiveUsers() {
    const users =
        await getAllUsers();

    return users.filter(
        (user) =>
            user?.isActive === false
    );
}

// ============================================================
// GET USER BY ID
// ============================================================

export async function getUserById(
    userId
) {
    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/Users/${userId}`
            );

        return normalizeUser(
            response.data
        );
    } catch (error) {
        console.error(
            "GET USER ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load user."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// GET USER BY EMAIL
// ============================================================

export async function getUserByEmail(
    email
) {
    if (!email) {
        return null;
    }

    const users =
        await getAllUsers();

    const normalizedEmail =
        String(email)
            .trim()
            .toLowerCase();

    return (
        users.find(
            (user) =>
                String(
                    user?.email || ""
                )
                    .trim()
                    .toLowerCase() ===
                normalizedEmail
        ) || null
    );
}

// ============================================================
// CREATE USER
//
// IMPORTANT:
// These are the fields sent to the backend:
//
// fullName
// email
// password
// confirmPassword
// role
// contributorTypeId
// contributorSubTypeId
// phoneNumber
// bio
// isActive
// permissions

































// ============================================================
// CREATE USER
// POST /api/Users
// ============================================================

export async function createUser(userData) {
    if (!userData) {
        return {
            success: false,
            error: "User information is required.",
        };
    }

    try {
        const role =
            typeof userData.role === "number"
                ? userData.role
                : normalizeUserRole(userData.role) === "Admin"
                ? USER_ROLES.ADMIN
                : normalizeUserRole(userData.role) === "Manager"
                ? USER_ROLES.MANAGER
                : USER_ROLES.CONTRIBUTOR;

        const requestData = {
            fullName:
                String(userData.fullName || "").trim(),

            email:
                String(userData.email || "")
                    .trim()
                    .toLowerCase(),

            password:
                userData.password,

            confirmPassword:
                userData.confirmPassword,

            role,

            // ==================================================
            // IMPORTANT
            // THESE NAMES MUST MATCH CreateUserDto.cs
            // ==================================================

            isActive:
                userData.isActive !== undefined
                    ? Boolean(userData.isActive)
                    : true,

            contributorTypeId:
                userData.contributorTypeId || null,

            contributorSubTypeId:
                userData.contributorSubTypeId || null,

            phoneNumber:
                userData.phoneNumber || null,

            bio:
                userData.bio || null,
        };

        console.log(
            "========== CREATE USER REQUEST =========="
        );

        console.log(
            "REQUEST DATA:",
            requestData
        );

        console.log(
            "ROLE:",
            requestData.role
        );

        console.log(
            "IS ACTIVE:",
            requestData.isActive
        );

        console.log(
            "CONTRIBUTOR TYPE ID:",
            requestData.contributorTypeId
        );

        console.log(
            "CONTRIBUTOR SUBTYPE ID:",
            requestData.contributorSubTypeId
        );

        console.log(
            "=========================================="
        );

        const response =
            await api.post(
                "/Users",
                requestData
            );

        console.log(
            "CREATE USER RESPONSE:",
            response.data
        );

        return {
            success: true,

            user:
                response.data,

            message:
                response.data?.message ||
                "User created successfully.",
        };
    } catch (error) {
        console.error(
            "========== CREATE USER ERROR =========="
        );

        console.error(
            "ERROR:",
            error
        );

        console.error(
            "STATUS:",
            error?.response?.status
        );

        console.error(
            "BACKEND RESPONSE:",
            error?.response?.data
        );

        console.error(
            "========================================"
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to create user."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}







// ============================================================
// UPDATE USER
// ============================================================

export async function editUser(
    userId,
    updatedUser
) {
    if (!userId) {
        return {
            success: false,
            error:
                "User ID is required.",
        };
    }

    try {
        const response =
            await api.put(
                `/Users/${userId}`,
                updatedUser
            );

        return {
            success: true,

            user:
                normalizeUser(
                    response.data
                ),

            message:
                response.data?.message ||
                "User updated successfully.",
        };
    } catch (error) {
        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update user."
                ),
        };
    }
}

// ============================================================
// DELETE USER
// ============================================================

export async function removeUser(
    userId
) {
    if (!userId) {
        return {
            success: false,
            error:
                "User ID is required.",
        };
    }

    try {
        const response =
            await api.delete(
                `/Users/${userId}`
            );

        return {
            success: true,

            message:
                response.data?.message ||
                "User deleted successfully.",
        };
    } catch (error) {
        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to delete user."
                ),
        };
    }
}

// ============================================================
// CHANGE STATUS
// ============================================================

export async function changeUserStatus(
    userId,
    isActive
) {
    if (!userId) {
        return {
            success: false,
            error:
                "User ID is required.",
        };
    }

    try {
        const response =
            await api.patch(
                `/Users/${userId}/status`,
                null,
                {
                    params: {
                        isActive:
                            Boolean(
                                isActive
                            ),
                    },
                }
            );

        return {
            success: true,

            message:
                response.data?.message ||
                "User status updated successfully.",
        };
    } catch (error) {
        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update user status."
                ),
        };
    }
}

// ============================================================
// CHANGE ROLE
// ============================================================

export async function changeUserRole(
    userId,
    role
) {
    if (!userId) {
        return {
            success: false,
            error:
                "User ID is required.",
        };
    }

    try {
        const normalizedRole =
            normalizeUserRole(
                role
            );

        if (!normalizedRole) {
            return {
                success: false,
                error:
                    "A valid user role is required.",
            };
        }

        const numericRole =
            normalizedRole ===
            "Admin"
                ? USER_ROLES.ADMIN
                : normalizedRole ===
                  "Manager"
                ? USER_ROLES.MANAGER
                : USER_ROLES.CONTRIBUTOR;

        const response =
            await api.patch(
                `/Users/${userId}/role`,
                null,
                {
                    params: {
                        role:
                            numericRole,
                    },
                }
            );

        return {
            success: true,

            message:
                response.data?.message ||
                "User role changed successfully.",
        };
    } catch (error) {
        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to change user role."
                ),
        };
    }
}

// ============================================================
// MY PROFILE
// ============================================================

export async function getMyProfile() {
    try {
        const response =
            await api.get(
                "/Users/profile"
            );

        return normalizeUser(
            response.data
        );
    } catch (error) {
        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load profile."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// UPDATE MY PROFILE
// ============================================================

export async function updateMyProfile(
    profileData
) {
    try {
        const response =
            await api.put(
                "/Users/profile",
                {
                    fullName:
                        profileData.fullName,

                    phoneNumber:
                        profileData.phoneNumber ||
                        null,

                    bio:
                        profileData.bio ||
                        null,

                    profileImage:
                        profileData.profileImage ||
                        null,
                }
            );

        return {
            success: true,

            message:
                response.data?.message ||
                "Profile updated successfully.",
        };
    } catch (error) {
        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update profile."
                ),
        };
    }
}

// ============================================================
// SEARCH USERS
// ============================================================

export async function searchUsers(
    searchTerm = ""
) {
    const users =
        await getAllUsers();

    const term =
        String(searchTerm)
            .trim()
            .toLowerCase();

    if (!term) {
        return users;
    }

    return users.filter(
        (user) =>
            [
                user?.fullName,
                user?.email,
                user?.role,
                user?.phoneNumber,
                user?.bio,
                user?.contributorType,
                user?.contributorSubType,
            ].some(
                (value) =>
                    String(
                        value || ""
                    )
                        .toLowerCase()
                        .includes(term)
            )
    );
}

// ============================================================
// USER STATISTICS
// ============================================================

export async function getUserStatistics() {
    const users =
        await getAllUsers();

    return {
        totalUsers:
            users.length,

        activeUsers:
            users.filter(
                (user) =>
                    user?.isActive !==
                    false
            ).length,

        inactiveUsers:
            users.filter(
                (user) =>
                    user?.isActive ===
                    false
            ).length,

        adminCount:
            users.filter(
                (user) =>
                    user?.role ===
                    "Admin"
            ).length,

        managerCount:
            users.filter(
                (user) =>
                    user?.role ===
                    "Manager"
            ).length,

        contributorCount:
            users.filter(
                (user) =>
                    user?.role ===
                    "Contributor"
            ).length,
    };
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getAllUsers,
    getUsers,
    getUserById,
    getUserByEmail,
    getUsersByRole,
    getActiveUsers,
    getInactiveUsers,
    getAdmins,
    getManagers,
    getContributors,

    createUser,
    editUser,
    removeUser,

    changeUserStatus,
    changeUserRole,

    getMyProfile,
    updateMyProfile,

    searchUsers,
    getUserStatistics,

    normalizeUserRole,
    normalizeUser,
};
