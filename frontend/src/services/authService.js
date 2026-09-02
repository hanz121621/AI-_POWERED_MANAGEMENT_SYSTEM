
import api from "@/services/api";

export const USER_ROLES = {
    ADMIN: 1,
    MANAGER: 2,
    CONTRIBUTOR: 3,
};

// ============================================================
// ROLE NORMALIZATION
// ============================================================

export function normalizeUserRole(role) {
    if (
        role === 1 ||
        role === "1" ||
        String(role ?? "")
            .trim()
            .toLowerCase() === "admin"
    ) {
        return "Admin";
    }

    if (
        role === 2 ||
        role === "2" ||
        String(role ?? "")
            .trim()
            .toLowerCase() === "manager"
    ) {
        return "Manager";
    }

    if (
        role === 3 ||
        role === "3" ||
        String(role ?? "")
            .trim()
            .toLowerCase() === "contributor"
    ) {
        return "Contributor";
    }

    return "";
}

export function normalizeRole(role) {
    return normalizeUserRole(role);
}

export function getRoleName(role) {
    return normalizeUserRole(role);
}

// ============================================================
// TOKEN
// ============================================================

export function getAccessToken() {
    return localStorage.getItem("token");
}

export function getToken() {
    return localStorage.getItem("token");
}

// ============================================================
// API ERROR
// ============================================================

function getApiErrorMessage(
    error,
    fallback = "Unable to complete the request."
) {
    const response = error?.response;

    if (!response) {
        return error?.message || fallback;
    }

    const data = response.data;

    if (
        data?.errors &&
        typeof data.errors === "object"
    ) {
        const messages = [];

        Object.entries(data.errors).forEach(
            ([field, fieldMessages]) => {
                if (Array.isArray(fieldMessages)) {
                    fieldMessages.forEach((message) => {
                        messages.push(
                            `${field}: ${message}`
                        );
                    });
                } else if (fieldMessages) {
                    messages.push(
                        `${field}: ${fieldMessages}`
                    );
                }
            }
        );

        if (messages.length > 0) {
            return messages.join("\n");
        }
    }

    return (
        data?.message ||
        data?.detail ||
        data?.title ||
        (
            typeof data === "string"
                ? data
                : fallback
        )
    );
}

// ============================================================
// NORMALIZE CONTRIBUTOR TYPE
// ============================================================
//
// Backend contributor model:
//
// ContributorType
//     Id
//     Name
//
// ContributorSubType
//     Id
//     ContributorTypeId
//     ContributorTypeName
//     Name
//
// Frontend normalized fields:
//
// contributorTypeId
// contributorTypeName
// contributorSubTypeId
// contributorSubTypeName
//
// ============================================================

function normalizeContributorType(user) {
    const contributorTypeId =
        user?.contributorTypeId ??
        user?.ContributorTypeId ??
        user?.contributorTypeDefinitionId ??
        user?.ContributorTypeDefinitionId ??
        null;

    const contributorTypeName =
        user?.contributorTypeName ??
        user?.ContributorTypeName ??
        user?.contributorTypeDefinitionName ??
        user?.ContributorTypeDefinitionName ??
        user?.contributorType ??
        user?.ContributorType ??
        null;

    const contributorSubTypeId =
        user?.contributorSubTypeId ??
        user?.ContributorSubTypeId ??
        null;

    const contributorSubTypeName =
        user?.contributorSubTypeName ??
        user?.ContributorSubTypeName ??
        null;

    return {
        contributorTypeId,
        contributorTypeName,

        contributorSubTypeId,
        contributorSubTypeName,

        // Preserve backend naming when it exists.
        contributorTypeDefinitionId:
            user?.contributorTypeDefinitionId ??
            user?.ContributorTypeDefinitionId ??
            contributorTypeId,

        contributorTypeDefinitionName:
            user?.contributorTypeDefinitionName ??
            user?.ContributorTypeDefinitionName ??
            contributorTypeName,
    };
}

// ============================================================
// NORMALIZE USER
// ============================================================

function normalizeUser(user) {
    if (!user) {
        return null;
    }

    const rawRole =
        user?.role ??
        user?.Role;

    const normalizedRole =
        normalizeUserRole(rawRole);

    const contributorType =
        normalizeContributorType(user);

    // ========================================================
    // ROLE ID
    // ========================================================

    let roleId = null;

    if (
        rawRole !== undefined &&
        rawRole !== null
    ) {
        if (typeof rawRole === "number") {
            roleId = rawRole;
        } else {
            const roleValue =
                String(rawRole)
                    .trim()
                    .toLowerCase();

            if (
                roleValue === "1" ||
                roleValue === "admin"
            ) {
                roleId = USER_ROLES.ADMIN;
            } else if (
                roleValue === "2" ||
                roleValue === "manager"
            ) {
                roleId = USER_ROLES.MANAGER;
            } else if (
                roleValue === "3" ||
                roleValue === "contributor"
            ) {
                roleId = USER_ROLES.CONTRIBUTOR;
            }
        }
    }

    return {
        ...user,

        // ========================================================
        // BASIC USER INFORMATION
        // ========================================================

        id:
            user?.id ??
            user?.Id ??
            user?.userId ??
            user?.UserId ??
            null,

        userId:
            user?.userId ??
            user?.UserId ??
            user?.id ??
            user?.Id ??
            null,

        fullName:
            user?.fullName ??
            user?.FullName ??
            user?.name ??
            user?.Name ??
            user?.userName ??
            user?.UserName ??
            user?.username ??
            "",

        email:
            user?.email ??
            user?.Email ??
            "",

        // ========================================================
        // ROLE
        // ========================================================

        role: normalizedRole,

        roleId,

        // ========================================================
        // ACCOUNT STATUS
        // ========================================================

        isActive:
            user?.isActive ??
            user?.IsActive ??
            true,

        // ========================================================
        // PROFILE
        // ========================================================

        phoneNumber:
            user?.phoneNumber ??
            user?.PhoneNumber ??
            null,

        profileImage:
            user?.profileImage ??
            user?.ProfileImage ??
            null,

        bio:
            user?.bio ??
            user?.Bio ??
            null,

        // ========================================================
        // CONTRIBUTOR TYPE
        // ========================================================

        contributorTypeId:
            contributorType.contributorTypeId,

        contributorTypeName:
            contributorType.contributorTypeName,

        contributorTypeDefinitionId:
            contributorType.contributorTypeDefinitionId,

        contributorTypeDefinitionName:
            contributorType.contributorTypeDefinitionName,

        // ========================================================
        // CONTRIBUTOR SUBTYPE
        // ========================================================

        contributorSubTypeId:
            contributorType.contributorSubTypeId,

        contributorSubTypeName:
            contributorType.contributorSubTypeName,

        // ========================================================
        // DATES
        // ========================================================

        createdAt:
            user?.createdAt ??
            user?.CreatedAt ??
            null,

        updatedAt:
            user?.updatedAt ??
            user?.UpdatedAt ??
            null,
    };
}

// ============================================================
// SAVE CURRENT USER
// ============================================================

export function saveCurrentUser(user) {
    if (!user) {
        localStorage.removeItem("user");
        return null;
    }

    const normalizedUser =
        normalizeUser(user);

    localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
    );

    return normalizedUser;
}

// ============================================================
// BACKEND ROLE
// ============================================================

function toBackendRole(role) {
    if (typeof role === "number") {
        if (
            role === USER_ROLES.ADMIN ||
            role === USER_ROLES.MANAGER ||
            role === USER_ROLES.CONTRIBUTOR
        ) {
            return role;
        }

        return USER_ROLES.CONTRIBUTOR;
    }

    const normalizedRole =
        normalizeUserRole(role);

    if (normalizedRole === "Admin") {
        return USER_ROLES.ADMIN;
    }

    if (normalizedRole === "Manager") {
        return USER_ROLES.MANAGER;
    }

    if (normalizedRole === "Contributor") {
        return USER_ROLES.CONTRIBUTOR;
    }

    return USER_ROLES.CONTRIBUTOR;
}

// ============================================================
// CURRENT USER
// ============================================================

export function getCurrentUser() {
    const storedUser =
        localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return normalizeUser(
            JSON.parse(storedUser)
        );
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

// ============================================================
// AUTHENTICATION
// ============================================================

export function isAuthenticated() {
    const token = getToken();
    const user = getCurrentUser();

    return Boolean(token && user);
}

// ============================================================
// SAVE AUTH DATA
// ============================================================

export function saveAuthData(
    token,
    user
) {
    if (token) {
        localStorage.setItem(
            "token",
            token
        );
    }

    if (user) {
        const normalizedUser =
            normalizeUser(user);

        localStorage.setItem(
            "user",
            JSON.stringify(normalizedUser)
        );

        return normalizedUser;
    }

    return null;
}

// ============================================================
// CLEAR AUTH
// ============================================================
export function clearAuthData() {
    // Remove all supported authentication/session keys
    const authKeys = [
        "token",
        "accessToken",
        "aipms_access_token",
        "user",
        "auth",
        "authData",
        "aipms_auth",
        "refreshToken",
        "userId",
    ];

    authKeys.forEach((key) => {
        localStorage.removeItem(key);
    });
}


// ============================================================
// LOGOUT
// ============================================================

export function logoutUser() {
    clearAuthData();
}

// ============================================================
// ROLE HELPERS
// ============================================================

export function hasRole(role) {
    const user = getCurrentUser();

    if (!user) {
        return false;
    }

    const requiredRole =
        normalizeUserRole(role);

    return (
        requiredRole !== "" &&
        user.role === requiredRole
    );
}

export function isAdmin() {
    return hasRole(USER_ROLES.ADMIN);
}

export function isManager() {
    return hasRole(USER_ROLES.MANAGER);
}

export function isContributor() {
    return hasRole(USER_ROLES.CONTRIBUTOR);
}

// ============================================================
// LOGIN
// ============================================================

export async function loginUser(
    email,
    password
) {
    if (!email || !password) {
        return {
            success: false,
            error:
                "Email and password are required.",
        };
    }

    try {
        // ========================================================
        // LOGIN
        // ========================================================

        const response =
            await api.post(
                "/Auth/login",
                {
                    email:
                        String(email)
                            .trim()
                            .toLowerCase(),

                    password,
                }
            );

        const data =
            response.data;

        console.log(
            "========== LOGIN =========="
        );

        console.log(
            "LOGIN STATUS:",
            response.status
        );

        console.log(
            "LOGIN RESPONSE:",
            data
        );

        // ========================================================
        // TOKEN
        // ========================================================

        const accessToken =
            data?.accessToken ??
            data?.token ??
            data?.jwtToken;

        if (!accessToken) {
            return {
                success: false,
                error:
                    "Login succeeded but no access token was returned.",
            };
        }

        localStorage.setItem(
            "token",
            accessToken
        );

        if (data?.refreshToken) {
            localStorage.setItem(
                "refreshToken",
                data.refreshToken
            );
        }

        if (data?.userId) {
            localStorage.setItem(
                "userId",
                data.userId
            );
        }

        // ========================================================
        // LOAD PROFILE
        // ========================================================

        let user = null;

        try {
            const profileResponse =
                await api.get(
                    "/Users/profile"
                );

            console.log(
                "PROFILE RESPONSE:",
                profileResponse.data
            );

            user =
                normalizeUser(
                    profileResponse.data
                );

            console.log(
                "NORMALIZED PROFILE:",
                user
            );

        } catch (profileError) {
            console.error(
                "GET PROFILE AFTER LOGIN ERROR:",
                profileError
            );
        }

        // ========================================================
        // FALLBACK
        // ========================================================

        if (!user) {
            user =
                normalizeUser({
                    id:
                        data.userId,

                    userId:
                        data.userId,

                    fullName:
                        data.fullName ??
                        data.name ??
                        "",

                    email:
                        data.email ??
                        email,

                    role:
                        data.role ??
                        data.userRole ??
                        "",

                    isActive:
                        data.isActive ??
                        true,
                });
        }

        // ========================================================
        // PROFILE REQUIRED
        // ========================================================

        if (!user) {
            clearAuthData();

            return {
                success: false,
                error:
                    "Login succeeded but user information could not be loaded.",
            };
        }

        // ========================================================
        // SAVE USER
        // ========================================================

        const savedUser =
            saveCurrentUser(user);

        console.log(
            "NORMALIZED CURRENT USER:",
            savedUser
        );

        console.log(
            "CURRENT USER ROLE:",
            savedUser?.role
        );

        console.log(
            "CURRENT USER ROLE ID:",
            savedUser?.roleId
        );

        console.log(
            "CONTRIBUTOR TYPE ID:",
            savedUser?.contributorTypeId
        );

        console.log(
            "CONTRIBUTOR TYPE:",
            savedUser?.contributorTypeName
        );

        console.log(
            "CONTRIBUTOR SUBTYPE ID:",
            savedUser?.contributorSubTypeId
        );

        console.log(
            "CONTRIBUTOR SUBTYPE:",
            savedUser?.contributorSubTypeName
        );

        console.log(
            "ACCESS TOKEN SAVED:",
            Boolean(
                localStorage.getItem("token")
            )
        );

        console.log(
            "=========================="
        );

        return {
            success: true,

            token:
                accessToken,

            accessToken,

            refreshToken:
                data.refreshToken ??
                null,

            user:
                savedUser,

            userId:
                data.userId ??
                savedUser?.id ??
                null,

            message:
                data.message ??
                "Login successful.",
        };

    } catch (error) {
        console.error(
            "LOGIN ERROR:",
            error
        );

        console.error(
            "LOGIN RESPONSE:",
            error?.response?.data
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Invalid email or password."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// USERS
// ============================================================

export async function getAllUsers() {
    try {
        const response =
            await api.get(
                "/Users"
            );

        const data =
            response.data;

        let users = [];

        if (Array.isArray(data)) {
            users = data;
        } else if (
            Array.isArray(data?.users)
        ) {
            users = data.users;
        } else if (
            Array.isArray(data?.data)
        ) {
            users = data.data;
        } else if (
            Array.isArray(data?.items)
        ) {
            users = data.items;
        }

        return users
            .map(normalizeUser)
            .filter(Boolean);

    } catch (error) {
        console.error(
            "GET USERS ERROR:",
            error
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

export async function getUsers() {
    return getAllUsers();
}

export async function getUsersByRole(
    role
) {
    const users =
        await getAllUsers();

    const normalizedRole =
        normalizeUserRole(role);

    if (!normalizedRole) {
        return users;
    }

    return users.filter(
        (user) =>
            user?.role ===
            normalizedRole
    );
}

export async function getAdmins() {
    return getUsersByRole(
        USER_ROLES.ADMIN
    );
}

export async function getManagers() {
    return getUsersByRole(
        USER_ROLES.MANAGER
    );
}

export async function getContributors() {
    return getUsersByRole(
        USER_ROLES.CONTRIBUTOR
    );
}

export async function getActiveUsers() {
    const users =
        await getAllUsers();

    return users.filter(
        (user) =>
            user?.isActive !== false
    );
}

export async function getInactiveUsers() {
    const users =
        await getAllUsers();

    return users.filter(
        (user) =>
            user?.isActive === false
    );
}

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
// ============================================================

export async function createUser(
    userData
) {
    if (!userData) {
        return {
            success: false,
            error:
                "User information is required.",
        };
    }

    try {
        const normalizedRole =
            normalizeUserRole(
                userData.role
            );

        const role =
            normalizedRole === "Admin"
                ? USER_ROLES.ADMIN
                : normalizedRole === "Manager"
                    ? USER_ROLES.MANAGER
                    : USER_ROLES.CONTRIBUTOR;

        // ========================================================
        // CONTRIBUTOR CLASSIFICATION
        // ========================================================
        //
        // Contributor:
        //     contributorTypeId
        //     contributorSubTypeId
        //
        // ========================================================

        const requestData = {
            fullName:
                String(
                    userData.fullName ||
                    ""
                ).trim(),

            email:
                String(
                    userData.email ||
                    ""
                )
                    .trim()
                    .toLowerCase(),

            password:
                userData.password,

            confirmPassword:
                userData.confirmPassword,

            role,

            contributorTypeId:
                userData.contributorTypeId ??
                userData.contributorTypeDefinitionId ??
                null,

            contributorSubTypeId:
                userData.contributorSubTypeId ??
                null,

            isActive:
                userData.isActive !== false,

            phoneNumber:
                userData.phoneNumber ||
                null,

            bio:
                userData.bio ||
                null,

            permissions:
                Array.isArray(
                    userData.permissions
                )
                    ? userData.permissions
                    : [],
        };

        console.log(
            "========================================"
        );

        console.log(
            "CREATE USER API REQUEST:"
        );

        console.log(
            JSON.stringify(
                requestData,
                null,
                2
            )
        );

        console.log(
            "========================================"
        );

        const response =
            await api.post(
                "/Users",
                requestData
            );

        console.log(
            "CREATE USER API RESPONSE:",
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
            "CREATE USER ERROR:",
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
// EDIT USER
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
        const requestData = {
            ...updatedUser,

            role:
                updatedUser?.role !==
                undefined
                    ? toBackendRole(
                        updatedUser.role
                    )
                    : undefined,

            contributorTypeId:
                updatedUser?.contributorTypeId ??
                updatedUser?.contributorTypeDefinitionId ??
                null,

            contributorSubTypeId:
                updatedUser?.contributorSubTypeId ??
                null,
        };

        const response =
            await api.put(
                `/Users/${userId}`,
                requestData
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
        console.error(
            "UPDATE USER ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update user."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
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
        console.error(
            "DELETE USER ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to delete user."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// CHANGE USER STATUS
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
        console.error(
            "CHANGE USER STATUS ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update user status."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// CHANGE USER ROLE
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

    const normalizedRole =
        normalizeUserRole(role);

    if (!normalizedRole) {
        return {
            success: false,
            error:
                "Invalid user role.",
        };
    }

    try {
        const response =
            await api.patch(
                `/Users/${userId}/role`,
                null,
                {
                    params: {
                        role:
                            normalizedRole,
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
        console.error(
            "CHANGE USER ROLE ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to change user role."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
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
        console.error(
            "GET MY PROFILE ERROR:",
            error
        );

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
    if (!profileData) {
        return {
            success: false,
            error:
                "Profile information is required.",
        };
    }

    try {
        const requestData = {
            fullName:
                String(
                    profileData.fullName ||
                    ""
                ).trim(),

            phoneNumber:
                profileData.phoneNumber ||
                null,

            bio:
                profileData.bio ||
                null,

            profileImage:
                profileData.profileImage ||
                null,
        };

        const response =
            await api.put(
                "/Users/profile",
                requestData
            );

        const currentUser =
            getCurrentUser();

        if (currentUser) {
            const updatedUser =
                normalizeUser({
                    ...currentUser,
                    ...profileData,
                });

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );
        }

        return {
            success: true,

            message:
                response.data?.message ||
                "Profile updated successfully.",
        };

    } catch (error) {
        console.error(
            "UPDATE MY PROFILE ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update profile."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
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
                user?.contributorTypeName,
                user?.contributorTypeDefinitionName,
                user?.contributorSubTypeName,
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
                    user?.isActive !== false
            ).length,

        inactiveUsers:
            users.filter(
                (user) =>
                    user?.isActive === false
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
    USER_ROLES,

    normalizeUserRole,

    normalizeRole,

    getRoleName,

    getAccessToken,

    getToken,

    getCurrentUser,

    isAuthenticated,

    saveCurrentUser,

    saveAuthData,

    clearAuthData,

    logoutUser,

    hasRole,

    isAdmin,

    isManager,

    isContributor,

    loginUser,

    getAllUsers,

    getUsers,

    getUsersByRole,

    getAdmins,

    getManagers,

    getContributors,

    getActiveUsers,

    getInactiveUsers,

    getUserById,

    getUserByEmail,

    createUser,

    editUser,

    removeUser,

    changeUserStatus,

    changeUserRole,

    getMyProfile,

    updateMyProfile,

    searchUsers,

    getUserStatistics,
};
