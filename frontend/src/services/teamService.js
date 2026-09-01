
import api from "./api";
import { getCurrentUser } from "@/services/authService";

// ============================================================
// TEAM SERVICE
// Backend Controller:
// /api/Team
//
// Uses the centralized Axios API client from ./api
// JWT authentication is handled automatically by api.js.
// ============================================================

// ============================================================
// ROLE IDS
// ============================================================

export const ROLE_IDS = {
    ADMIN: 1,
    MANAGER: 2,
    CONTRIBUTOR: 3,
};

// ============================================================
// ROLE NAMES
// ============================================================

export const ROLE_NAMES = {
    1: "Admin",
    2: "Manager",
    3: "Contributor",
};

// ============================================================
// GET ROLE NAME
// ============================================================

export function getRoleName(roleId) {
    const numericRoleId = Number(roleId);

    return ROLE_NAMES[numericRoleId] || "Unknown";
}

// ============================================================
// SAFE USER ID
// ============================================================

function getUserId(user) {
    if (!user) {
        return null;
    }

    return (
        user.id ??
        user.userId ??
        user.UserId ??
        user.Id ??
        null
    );
}

// ============================================================
// GET USER ROLE ID
// ============================================================

function getUserRoleId(user) {
    if (!user) {
        return null;
    }

    // --------------------------------------------------------
    // Direct role ID
    // --------------------------------------------------------

    const directRoleId =
        user.roleId ??
        user.RoleId ??
        user.roleID ??
        user.RoleID;

    if (
        directRoleId !== undefined &&
        directRoleId !== null
    ) {
        const numericRoleId = Number(directRoleId);

        if (!Number.isNaN(numericRoleId)) {
            return numericRoleId;
        }
    }

    // --------------------------------------------------------
    // Nested role object
    // --------------------------------------------------------

    if (
        typeof user.role === "object" &&
        user.role !== null
    ) {
        const nestedRoleId =
            user.role.id ??
            user.role.roleId ??
            user.role.RoleId;

        if (
            nestedRoleId !== undefined &&
            nestedRoleId !== null
        ) {
            const numericRoleId = Number(nestedRoleId);

            if (!Number.isNaN(numericRoleId)) {
                return numericRoleId;
            }
        }
    }

    // --------------------------------------------------------
    // PascalCase nested role
    // --------------------------------------------------------

    if (
        typeof user.Role === "object" &&
        user.Role !== null
    ) {
        const nestedRoleId =
            user.Role.id ??
            user.Role.roleId ??
            user.Role.RoleId;

        if (
            nestedRoleId !== undefined &&
            nestedRoleId !== null
        ) {
            const numericRoleId = Number(nestedRoleId);

            if (!Number.isNaN(numericRoleId)) {
                return numericRoleId;
            }
        }
    }

    return null;
}

// ============================================================
// GET USER ROLE
// ============================================================

function getUserRole(user) {
    const roleId = getUserRoleId(user);

    if (roleId !== null) {
        return getRoleName(roleId).toLowerCase();
    }

    const role =
        user?.role ??
        user?.Role ??
        "";

    if (typeof role === "string") {
        return role.trim().toLowerCase();
    }

    return "";
}

// ============================================================
// CHECK ADMIN
// ============================================================

function isAdmin(user) {
    const roleId = getUserRoleId(user);

    if (roleId !== null) {
        return roleId === ROLE_IDS.ADMIN;
    }

    return getUserRole(user) === "admin";
}

// ============================================================
// CHECK MANAGER
// ============================================================

function isManager(user) {
    const roleId = getUserRoleId(user);

    if (roleId !== null) {
        return roleId === ROLE_IDS.MANAGER;
    }

    return getUserRole(user) === "manager";
}

// ============================================================
// CHECK CONTRIBUTOR
// ============================================================

function isContributor(user) {
    const roleId = getUserRoleId(user);

    if (roleId !== null) {
        return roleId === ROLE_IDS.CONTRIBUTOR;
    }

    return getUserRole(user) === "contributor";
}

// ============================================================
// CHECK ALLOWED TEAM MEMBER
//
// Team members can be Contributors.
// "developer" is retained for compatibility with existing data.
// ============================================================

function isAllowedTeamMember(user) {
    const roleId = getUserRoleId(user);

    if (roleId === ROLE_IDS.CONTRIBUTOR) {
        return true;
    }

    const role = getUserRole(user);

    return (
        role === "contributor" ||
        role === "developer"
    );
}

// ============================================================
// USER DISPLAY NAME
// ============================================================

function getUserName(user) {
    return (
        user?.fullName ??
        user?.FullName ??
        user?.name ??
        user?.Name ??
        user?.username ??
        user?.Username ??
        user?.email ??
        user?.Email ??
        "Unknown User"
    );
}

// ============================================================
// USER EMAIL
// ============================================================

function getUserEmail(user) {
    return (
        user?.email ??
        user?.Email ??
        ""
    );
}

// ============================================================
// GET USERS SAFELY
//
// Uses authService.getUsers() when available.
// This is only for selecting managers/team members.
// Teams themselves remain backend-managed.
// ============================================================

async function getUsersSafely() {
    try {
        const authService =
            await import("@/services/authService");

        if (
            typeof authService.getUsers ===
            "function"
        ) {
            const users =
                await authService.getUsers();

            return Array.isArray(users)
                ? users
                : [];
        }
    } catch (error) {
        console.warn(
            "authService.getUsers() is not available:",
            error
        );
    }

    // --------------------------------------------------------
    // Compatibility fallback
    // --------------------------------------------------------

    try {
        const storedUsers =
            localStorage.getItem("users") ||
            localStorage.getItem("aipms_users");

        if (storedUsers) {
            const parsed =
                JSON.parse(storedUsers);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.warn(
            "Unable to read compatibility user data:",
            error
        );
    }

    return [];
}

// ============================================================
// NORMALIZE TEAM MEMBER
// ============================================================

export function normalizeTeamMember(member) {
    if (!member) {
        return null;
    }

    const userId =
        member.userId ??
        member.UserId ??
        member.id ??
        member.Id ??
        null;

    const fullName =
        member.fullName ??
        member.FullName ??
        member.name ??
        member.Name ??
        "Unknown User";

    const email =
        member.email ??
        member.Email ??
        "";

    const contributorTypeId =
        member.contributorTypeId ??
        member.ContributorTypeId ??
        null;

    const contributorTypeName =
        member.contributorTypeName ??
        member.ContributorTypeName ??
        "";

    const contributorSubTypeId =
        member.contributorSubTypeId ??
        member.ContributorSubTypeId ??
        null;

    const contributorSubTypeName =
        member.contributorSubTypeName ??
        member.ContributorSubTypeName ??
        null;

    const joinedAt =
        member.joinedAt ??
        member.JoinedAt ??
        null;

    const isActive =
        member.isActive ??
        member.IsActive ??
        true;

    const role =
        member.role ??
        member.Role ??
        "Contributor";

    return {
        userId,
        fullName,
        email,

        contributorTypeId,
        contributorTypeName,

        contributorSubTypeId,
        contributorSubTypeName,

        joinedAt,
        isActive,

        // ----------------------------------------------------
        // Existing UI compatibility
        // ----------------------------------------------------

        id: userId,
        name: fullName,
        role,

        contributorType:
            contributorTypeName,

        contributorSubType:
            contributorSubTypeName,

        addedAt:
            joinedAt,
    };
}

// ============================================================
// NORMALIZE TEAM
// ============================================================

export function normalizeTeam(team) {
    if (!team) {
        return null;
    }

    const id =
        team.id ??
        team.Id ??
        null;

    const name =
        team.name ??
        team.Name ??
        "";

    const description =
        team.description ??
        team.Description ??
        "";

    const managerId =
        team.managerId ??
        team.ManagerId ??
        null;

    const managerName =
        team.managerName ??
        team.ManagerName ??
        null;

    const managerEmail =
        team.managerEmail ??
        team.ManagerEmail ??
        "";

    const isActive =
        team.isActive ??
        team.IsActive ??
        true;

    const createdAt =
        team.createdAt ??
        team.CreatedAt ??
        null;

    const updatedAt =
        team.updatedAt ??
        team.UpdatedAt ??
        null;

    // --------------------------------------------------------
    // Members
    // --------------------------------------------------------

    const rawMembers =
        Array.isArray(team.members)
            ? team.members
            : Array.isArray(team.Members)
                ? team.Members
                : [];

    const normalizedMembers =
        rawMembers
            .map(normalizeTeamMember)
            .filter(Boolean);

    // --------------------------------------------------------
    // Counts
    // --------------------------------------------------------

    const memberCount =
        team.memberCount ??
        team.MemberCount ??
        normalizedMembers.length;

    const developerCount =
        team.developerCount ??
        team.DeveloperCount ??
        0;

    const staffCount =
        team.staffCount ??
        team.StaffCount ??
        0;

    // --------------------------------------------------------
    // Created date
    // --------------------------------------------------------

    let createdDate = "";

    if (createdAt) {
        const date = new Date(createdAt);

        if (!Number.isNaN(date.getTime())) {
            createdDate =
                date.toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }
                );
        }
    }

    return {
        id,
        name,
        description,

        managerId,
        managerName,
        managerEmail,

        isActive,

        createdAt,
        updatedAt,

        memberCount:
            Number(memberCount) || 0,

        developerCount:
            Number(developerCount) || 0,

        staffCount:
            Number(staffCount) || 0,

        members:
            normalizedMembers,

        // ----------------------------------------------------
        // Existing UI compatibility
        // ----------------------------------------------------

        manager:
            managerName ||
            "Not assigned",

        teamLeader:
            managerName ||
            "Not assigned",

        teamLeaderId:
            managerId,

        teamLeaderEmail:
            managerEmail,

        organization:
            team.organization ??
            team.Organization ??
            "Africom Technology",

        status:
            isActive
                ? "Active"
                : "Inactive",

        createdDate,

        totalMembers:
            Number(memberCount) || 0,

        active:
            isActive,
    };
}

// ============================================================
// GUID VALIDATION
// ============================================================

function isValidGuid(value) {
    if (!value) {
        return false;
    }

    const guid =
        String(value).trim();

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        guid
    );
}

// ============================================================
// BUILD MEMBER DTO
// ============================================================

function buildMemberDto(member) {
    if (!member) {
        throw new Error(
            "Member information is required."
        );
    }

    const userId =
        member.userId ??
        member.UserId ??
        member.id ??
        member.Id ??
        null;

    const contributorTypeId =
        member.contributorTypeId ??
        member.ContributorTypeId ??
        member.typeId ??
        member.TypeId ??
        member.contributorType?.id ??
        member.contributorType?.Id ??
        null;

    const contributorSubTypeId =
        member.contributorSubTypeId ??
        member.ContributorSubTypeId ??
        member.subTypeId ??
        member.SubTypeId ??
        member.contributorSubType?.id ??
        member.contributorSubType?.Id ??
        null;

    if (!isValidGuid(userId)) {
        throw new Error(
            "The selected member has an invalid User ID."
        );
    }

    if (!isValidGuid(contributorTypeId)) {
        throw new Error(
            "Please select a valid Contributor Type."
        );
    }

    if (
        contributorSubTypeId &&
        !isValidGuid(contributorSubTypeId)
    ) {
        throw new Error(
            "The selected Contributor Sub-Type is invalid."
        );
    }

    return {
        userId:
            String(userId),

        contributorTypeId:
            String(contributorTypeId),

        contributorSubTypeId:
            contributorSubTypeId
                ? String(contributorSubTypeId)
                : null,
    };
}

// ============================================================
// BUILD CREATE TEAM DTO
// ============================================================

function buildCreateTeamDto(teamData) {
    if (!teamData) {
        throw new Error(
            "Team data is required."
        );
    }

    const name =
        String(
            teamData.name || ""
        ).trim();

    if (!name) {
        throw new Error(
            "Team name is required."
        );
    }

    const managerId =
        teamData.managerId &&
        isValidGuid(teamData.managerId)
            ? String(teamData.managerId)
            : null;

    const dto = {
        name,

        description:
            String(
                teamData.description || ""
            ).trim() || null,

        managerId,

        members: [],
    };

    const members =
        Array.isArray(teamData.members)
            ? teamData.members
            : [];

    if (members.length > 0) {
        dto.members =
            members.map(
                buildMemberDto
            );
    }

    return dto;
}

// ============================================================
// BUILD UPDATE TEAM DTO
// ============================================================

function buildUpdateTeamDto(updatedTeam) {
    if (!updatedTeam) {
        throw new Error(
            "Team data is required."
        );
    }

    const name =
        String(
            updatedTeam.name || ""
        ).trim();

    if (!name) {
        throw new Error(
            "Team name is required."
        );
    }

    const managerId =
        updatedTeam.managerId;

    if (
        managerId &&
        !isValidGuid(managerId)
    ) {
        throw new Error(
            "The selected manager has an invalid User ID."
        );
    }

    const dto = {
        name,

        description:
            String(
                updatedTeam.description || ""
            ).trim() || null,

        managerId:
            managerId
                ? String(managerId)
                : null,

        isActive:
            updatedTeam.isActive ??
            (
                String(
                    updatedTeam.status ||
                    "Active"
                ).toLowerCase() ===
                "active"
            ),
    };

    const members =
        Array.isArray(updatedTeam.members)
            ? updatedTeam.members
            : [];

    // --------------------------------------------------------
    // Only include members with complete DTO information
    // --------------------------------------------------------

    if (members.length > 0) {
        const validMembers =
            members.filter(
                (member) => {
                    const userId =
                        member.userId ??
                        member.UserId ??
                        member.id ??
                        member.Id;

                    const typeId =
                        member.contributorTypeId ??
                        member.ContributorTypeId;

                    return (
                        userId &&
                        typeId
                    );
                }
            );

        if (validMembers.length > 0) {
            dto.members =
                validMembers.map(
                    buildMemberDto
                );
        }
    }

    return dto;
}

// ============================================================
// GET ALL TEAMS
// TEAM-004
// GET: /api/Team
// ============================================================

export async function getTeams() {
    try {
        const response =
            await api.get("/Team");

        const data =
            response.data;

        const teams =
            Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.items)
                        ? data.items
                        : [];

        return teams
            .map(normalizeTeam)
            .filter(Boolean);
    } catch (error) {
        console.error(
            "Unable to get teams:",
            error
        );

        throw error;
    }
}

// ============================================================
// GET TEAM BY ID
// GET: /api/Team/{teamId}
// ============================================================

export async function getTeamById(teamId) {
    if (!teamId) {
        return null;
    }

    try {
        const response =
            await api.get(
                `/Team/${teamId}`
            );

        return normalizeTeam(
            response.data
        );
    } catch (error) {
        if (
            error?.response?.status === 404
        ) {
            return null;
        }

        throw error;
    }
}

// ============================================================
// CREATE TEAM
// TEAM-001
// POST: /api/Team
// ============================================================

export async function createTeam(
    teamData,
    options = {}
) {
    try {
        const dto =
            buildCreateTeamDto(
                teamData
            );

        const response =
            await api.post(
                "/Team",
                dto
            );

        return {
            success: true,

            code:
                "TEAM_CREATED",

            message:
                "Team created successfully.",

            team:
                normalizeTeam(
                    response.data
                ),
        };
    } catch (error) {
        console.error(
            "Unable to create team:",
            error
        );

        return {
            success: false,

            code:
                "TEAM_CREATE_ERROR",

            message:
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                error?.message ||
                "Unable to create team. Please try again.",

            error:
                error?.message ||
                "Unknown error.",
        };
    }
}

// ============================================================
// UPDATE TEAM
// TEAM-002
// PUT: /api/Team/{teamId}
// ============================================================

export async function updateTeam(
    updatedTeam,
    options = {}
) {
    try {
        if (!updatedTeam?.id) {
            return {
                success: false,

                code:
                    "INVALID_TEAM_ID",

                message:
                    "Team ID is required.",
            };
        }

        const dto =
            buildUpdateTeamDto(
                updatedTeam
            );

        const response =
            await api.put(
                `/Team/${updatedTeam.id}`,
                dto
            );

        return {
            success: true,

            code:
                "TEAM_UPDATED",

            message:
                "Team updated successfully.",

            team:
                normalizeTeam(
                    response.data
                ),
        };
    } catch (error) {
        console.error(
            "Unable to update team:",
            error
        );

        return {
            success: false,

            code:
                "TEAM_UPDATE_ERROR",

            message:
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                error?.message ||
                "Unable to update team. Please try again.",

            error:
                error?.message ||
                "Unknown error.",
        };
    }
}

// ============================================================
// DELETE TEAM
// TEAM-003
// DELETE: /api/Team/{teamId}
// ============================================================

export async function deleteTeam(
    teamId,
    options = {}
) {
    try {
        if (!teamId) {
            return {
                success: false,

                code:
                    "INVALID_TEAM_ID",

                message:
                    "Team ID is required.",
            };
        }

        await api.delete(
            `/Team/${teamId}`
        );

        return {
            success: true,

            code:
                "TEAM_DELETED",

            message:
                "Team deleted successfully.",
        };
    } catch (error) {
        console.error(
            "Unable to delete team:",
            error
        );

        return {
            success: false,

            code:
                "TEAM_DELETE_ERROR",

            message:
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                error?.message ||
                "Unable to delete team. Please try again.",

            error:
                error?.message ||
                "Unknown error.",
        };
    }
}

// ============================================================
// GET AVAILABLE MANAGERS
// TEAM-005
// ============================================================

export async function getAvailableManagers(
    teamId = null
) {
    try {
        const [
            users,
            teams,
        ] = await Promise.all([
            getUsersSafely(),
            getTeams(),
        ]);

        const managers =
            users.filter(
                isManager
            );

        // Managers already assigned to
        // another team cannot be selected.

        const assignedManagerIds =
            new Set(
                teams
                    .filter(
                        (team) => {
                            if (
                                String(team.id) ===
                                String(teamId)
                            ) {
                                return false;
                            }

                            return Boolean(
                                team.managerId
                            );
                        }
                    )
                    .map(
                        (team) =>
                            String(
                                team.managerId
                            )
                    )
            );

        return managers.filter(
            (manager) => {
                const managerId =
                    getUserId(manager);

                if (!managerId) {
                    return false;
                }

                return !assignedManagerIds.has(
                    String(managerId)
                );
            }
        );
    } catch (error) {
        console.error(
            "Unable to get available managers:",
            error
        );

        throw error;
    }
}

// ============================================================
// ASSIGN MANAGER
// TEAM-005
// PUT: /api/Team/{teamId}/manager/{managerId}
// ============================================================

export async function assignManagerToTeam(
    teamId,
    managerId,
    options = {}
) {
    try {
        if (!teamId) {
            return {
                success: false,

                code:
                    "INVALID_TEAM_ID",

                message:
                    "Team ID is required.",
            };
        }

        if (!managerId) {
            return {
                success: false,

                code:
                    "INVALID_MANAGER_ID",

                message:
                    "Manager ID is required.",
            };
        }

        if (!isValidGuid(managerId)) {
            return {
                success: false,

                code:
                    "INVALID_MANAGER_ID",

                message:
                    "The selected manager has an invalid User ID.",
            };
        }

        // ----------------------------------------------------
        // Verify manager role when user data is available.
        // ----------------------------------------------------

        const users =
            await getUsersSafely();

        const manager =
            users.find(
                (user) =>
                    String(
                        getUserId(user)
                    ) ===
                    String(managerId)
            );

        if (
            manager &&
            !isManager(manager)
        ) {
            return {
                success: false,

                code:
                    "INVALID_MANAGER_ROLE",

                message:
                    "Only users with Manager role can be assigned.",
            };
        }

        const response =
            await api.put(
                `/Team/${teamId}/manager/${managerId}`
            );

        return {
            success: true,

            code:
                "MANAGER_ASSIGNED",

            message:
                response?.data?.message ||
                response?.data?.Message ||
                "Manager assigned successfully.",

            manager,

            team:
                await getTeamById(
                    teamId
                ),
        };
    } catch (error) {
        console.error(
            "Unable to assign manager:",
            error
        );

        return {
            success: false,

            code:
                "MANAGER_ASSIGN_ERROR",

            message:
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                error?.message ||
                "Unable to assign manager. Please try again.",

            error:
                error?.message ||
                "Unknown error.",
        };
    }
}

// ============================================================
// COMPATIBILITY ALIAS
// ============================================================

export const assignTeamManager =
    assignManagerToTeam;

// ============================================================
// REMOVE MANAGER
// ============================================================
//
// Uses the existing Team PUT endpoint with managerId = null.
// ============================================================

export async function removeManagerFromTeam(
    teamId,
    options = {}
) {
    try {
        if (!teamId) {
            return {
                success: false,

                code:
                    "INVALID_TEAM_ID",

                message:
                    "Team ID is required.",
            };
        }

        const team =
            await getTeamById(
                teamId
            );

        if (!team) {
            return {
                success: false,

                code:
                    "TEAM_NOT_FOUND",

                message:
                    "Team not found.",
            };
        }

        if (!team.managerId) {
            return {
                success: false,

                code:
                    "MANAGER_NOT_ASSIGNED",

                message:
                    "This team does not have a manager.",
            };
        }

        const dto = {
            name:
                team.name,

            description:
                team.description ||
                null,

            managerId:
                null,

            isActive:
                team.isActive ??
                true,
        };

        const members =
            Array.isArray(team.members)
                ? team.members
                : [];

        const validMembers =
            members.filter(
                (member) =>
                    member.userId &&
                    member.contributorTypeId
            );

        if (
            validMembers.length > 0
        ) {
            dto.members =
                validMembers.map(
                    buildMemberDto
                );
        }

        const response =
            await api.put(
                `/Team/${teamId}`,
                dto
            );

        return {
            success: true,

            code:
                "MANAGER_REMOVED",

            message:
                "Manager removed successfully.",

            team:
                normalizeTeam(
                    response.data
                ),
        };
    } catch (error) {
        console.error(
            "Unable to remove manager:",
            error
        );

        return {
            success: false,

            code:
                "MANAGER_REMOVE_ERROR",

            message:
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                error?.message ||
                "Unable to remove manager. Please try again.",

            error:
                error?.message ||
                "Unknown error.",
        };
    }
}

// ============================================================
// GET TEAM MEMBERS
// GET: /api/Team/{teamId}/members
// ============================================================

export async function getTeamMembers(
    teamId
) {
    if (!teamId) {
        return [];
    }

    try {
        const response =
            await api.get(
                `/Team/${teamId}/members`
            );

        const data =
            response.data;

        const members =
            Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.items)
                        ? data.items
                        : [];

        return members
            .map(
                normalizeTeamMember
            )
            .filter(Boolean);
    } catch (error) {
        console.error(
            "Unable to get team members:",
            error
        );

        throw error;
    }
}

// ============================================================
// GET AVAILABLE TEAM MEMBERS
// TEAM-006
// ============================================================

export async function getAvailableTeamMembers(
    teamId
) {
    try {
        if (!teamId) {
            return [];
        }

        const [
            users,
            teams,
            currentMembers,
        ] = await Promise.all([
            getUsersSafely(),
            getTeams(),
            getTeamMembers(teamId),
        ]);

        // ----------------------------------------------------
        // Current team members
        // ----------------------------------------------------

        const currentMemberIds =
            new Set(
                currentMembers.map(
                    (member) =>
                        String(
                            member.userId
                        )
                )
            );

        // ----------------------------------------------------
        // Users already belonging to another team
        // ----------------------------------------------------

        const usersInOtherTeams =
            new Set();

        teams.forEach(
            (team) => {
                if (
                    String(team.id) ===
                    String(teamId)
                ) {
                    return;
                }

                const members =
                    Array.isArray(
                        team.members
                    )
                        ? team.members
                        : [];

                members.forEach(
                    (member) => {
                        const id =
                            member.userId ??
                            member.id ??
                            member.UserId ??
                            member.Id;

                        if (id) {
                            usersInOtherTeams.add(
                                String(id)
                            );
                        }
                    }
                );
            }
        );

        // ----------------------------------------------------
        // Filter eligible contributors
        // ----------------------------------------------------

        return users
            .filter(
                isAllowedTeamMember
            )
            .filter(
                (user) => {
                    const id =
                        getUserId(user);

                    if (!id) {
                        return false;
                    }

                    const normalizedId =
                        String(id);

                    return (
                        !currentMemberIds.has(
                            normalizedId
                        ) &&
                        !usersInOtherTeams.has(
                            normalizedId
                        )
                    );
                }
            );
    } catch (error) {
        console.error(
            "Unable to get available team members:",
            error
        );

        throw error;
    }
}

// ============================================================
// GET TEAM MEMBER CANDIDATES
// TEAM-006
// ============================================================

export async function getTeamMemberCandidates(
    teamId
) {
    try {
        const users =
            await getUsersSafely();

        const currentMembers =
            teamId
                ? await getTeamMembers(
                    teamId
                )
                : [];

        const memberIds =
            new Set(
                currentMembers.map(
                    (member) =>
                        String(
                            member.userId
                        )
                )
            );

        return users
            .filter(
                isAllowedTeamMember
            )
            .map(
                (user) => {
                    const userId =
                        getUserId(user);

                    return {
                        ...user,

                        id:
                            userId,

                        userId,

                        name:
                            getUserName(
                                user
                            ),

                        email:
                            getUserEmail(
                                user
                            ),

                        role:
                            getUserRole(
                                user
                            ),

                        isCurrentMember:
                            userId
                                ? memberIds.has(
                                    String(
                                        userId
                                    )
                                )
                                : false,
                    };
                }
            );
    } catch (error) {
        console.error(
            "Unable to get team member candidates:",
            error
        );

        throw error;
    }
}

// ============================================================
// ADD MEMBER TO TEAM
// TEAM-006
// POST: /api/Team/{teamId}/members
// ============================================================

export async function addMemberToTeam(
    teamId,
    userId,
    options = {}
) {
    try {
        if (!teamId) {
            return {
                success: false,

                code:
                    "INVALID_TEAM_ID",

                message:
                    "Team ID is required.",
            };
        }

        if (!userId) {
            return {
                success: false,

                code:
                    "INVALID_USER_ID",

                message:
                    "User ID is required.",
            };
        }

        const memberDto =
            buildMemberDto({
                userId,

                contributorTypeId:
                    options.contributorTypeId,

                contributorSubTypeId:
                    options.contributorSubTypeId,
            });

        const response =
            await api.post(
                `/Team/${teamId}/members`,
                memberDto
            );

        return {
            success: true,

            code:
                "MEMBER_ADDED",

            message:
                response?.data?.message ||
                response?.data?.Message ||
                "Member added successfully.",

            team:
                await getTeamById(
                    teamId
                ),
        };
    } catch (error) {
        console.error(
            "Unable to add team member:",
            error
        );

        return {
            success: false,

            code:
                "MEMBER_ADD_ERROR",

            message:
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                error?.message ||
                "Unable to add member. Please try again.",

            error:
                error?.message ||
                "Unknown error.",
        };
    }
}

// ============================================================
// ADD MULTIPLE MEMBERS
// TEAM-006
// ============================================================

export async function addMembersToTeam(
    teamId,
    members,
    options = {}
) {
    if (
        !Array.isArray(members) ||
        members.length === 0
    ) {
        return {
            success: false,

            code:
                "NO_USERS_SELECTED",

            message:
                "Please select at least one member.",
        };
    }

    try {
        const addedMembers = [];
        const errors = [];

        for (
            const selectedMember
            of members
        ) {
            try {
                const userId =
                    selectedMember?.userId ??
                    selectedMember?.UserId ??
                    selectedMember?.id ??
                    selectedMember?.Id ??
                    selectedMember;

                const contributorTypeId =
                    selectedMember?.contributorTypeId ??
                    selectedMember?.ContributorTypeId ??
                    options.contributorTypeId;

                const contributorSubTypeId =
                    selectedMember?.contributorSubTypeId ??
                    selectedMember?.ContributorSubTypeId ??
                    options.contributorSubTypeId;

                const result =
                    await addMemberToTeam(
                        teamId,
                        userId,
                        {
                            contributorTypeId,
                            contributorSubTypeId,
                        }
                    );

                if (
                    result.success
                ) {
                    addedMembers.push(
                        selectedMember
                    );
                } else {
                    errors.push({
                        userId,

                        message:
                            result.message,
                    });
                }
            } catch (error) {
                errors.push({
                    userId:
                        selectedMember?.userId ??
                        selectedMember?.id,

                    message:
                        error?.message ||
                        "Unable to add member.",
                });
            }
        }

        const team =
            await getTeamById(
                teamId
            );

        // ----------------------------------------------------
        // Nothing was added
        // ----------------------------------------------------

        if (
            addedMembers.length === 0
        ) {
            return {
                success: false,

                code:
                    "NO_MEMBERS_ADDED",

                message:
                    errors[0]?.message ||
                    "Unable to add members.",

                errors,

                team,
            };
        }

        return {
            success: true,

            code:
                "MEMBERS_ADDED",

            message:
                addedMembers.length === 1
                    ? "Member added successfully."
                    : `${addedMembers.length} members added successfully.`,

            team,

            addedMembers,

            errors,
        };
    } catch (error) {
        console.error(
            "Unable to add multiple team members:",
            error
        );

        return {
            success: false,

            code:
                "MEMBERS_ADD_ERROR",

            message:
                error?.message ||
                "Unable to add members. Please try again.",

            errors: [
                {
                    message:
                        error?.message ||
                        "Unknown error.",
                },
            ],
        };
    }
}

// ============================================================
// IS TEAM MEMBER
// ============================================================

export async function isTeamMember(
    teamId,
    userId
) {
    try {
        if (!teamId || !userId) {
            return false;
        }

        const members =
            await getTeamMembers(
                teamId
            );

        return members.some(
            (member) =>
                String(
                    member.userId
                ) ===
                String(userId)
        );
    } catch (error) {
        console.error(
            "Unable to check team membership:",
            error
        );

        return false;
    }
}

// ============================================================
// REMOVE MEMBER FROM TEAM
// TEAM-007
// DELETE: /api/Team/{teamId}/members/{userId}
// ============================================================

export async function removeMemberFromTeam(
    teamId,
    userId,
    options = {}
) {
    try {
        if (!teamId) {
            return {
                success: false,

                code:
                    "INVALID_TEAM_ID",

                message:
                    "Team ID is required.",
            };
        }

        if (!userId) {
            return {
                success: false,

                code:
                    "INVALID_USER_ID",

                message:
                    "User ID is required.",
            };
        }

        const members =
            await getTeamMembers(
                teamId
            );

        const removedMember =
            members.find(
                (member) =>
                    String(
                        member.userId
                    ) ===
                    String(userId)
            );

        if (!removedMember) {
            return {
                success: false,

                code:
                    "USER_NOT_TEAM_MEMBER",

                message:
                    "User is not part of this team.",
            };
        }

        const response =
            await api.delete(
                `/Team/${teamId}/members/${userId}`
            );

        return {
            success: true,

            code:
                "MEMBER_REMOVED",

            message:
                response?.data?.message ||
                response?.data?.Message ||
                "Member removed successfully.",

            removedMember,

            team:
                await getTeamById(
                    teamId
                ),
        };
    } catch (error) {
        console.error(
            "Unable to remove team member:",
            error
        );

        return {
            success: false,

            code:
                "REMOVE_MEMBER_ERROR",

            message:
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                error?.message ||
                "Unable to remove member. Please try again.",

            error:
                error?.message ||
                "Unknown error.",
        };
    }
}

// ============================================================
// GET TEAM MEMBER COUNT
// ============================================================

export async function getTeamMemberCount(
    teamId
) {
    try {
        const team =
            await getTeamById(
                teamId
            );

        return (
            Number(
                team?.memberCount
            ) ||
            team?.members?.length ||
            0
        );
    } catch {
        return 0;
    }
}

// ============================================================
// GET TOTAL TEAM MEMBERS
// ============================================================

export async function getTotalTeamMembers() {
    try {
        const teams =
            await getTeams();

        return teams.reduce(
            (
                total,
                team
            ) =>
                total +
                (
                    Number(
                        team.memberCount
                    ) ||
                    team.members?.length ||
                    0
                ),
            0
        );
    } catch {
        return 0;
    }
}

// ============================================================
// GET TEAM STATISTICS
// ============================================================

export async function getTeamStatistics() {
    try {
        const teams =
            await getTeams();

        const totalTeams =
            teams.length;

        const activeTeams =
            teams.filter(
                (team) =>
                    team.isActive === true
            ).length;

        const inactiveTeams =
            totalTeams -
            activeTeams;

        const totalMembers =
            teams.reduce(
                (
                    total,
                    team
                ) =>
                    total +
                    (
                        Number(
                            team.memberCount
                        ) || 0
                    ),
                0
            );

        const teamsWithManagers =
            teams.filter(
                (team) =>
                    Boolean(
                        team.managerId
                    )
            ).length;

        const teamsWithoutManagers =
            totalTeams -
            teamsWithManagers;

        const totalDevelopers =
            teams.reduce(
                (
                    total,
                    team
                ) =>
                    total +
                    (
                        Number(
                            team.developerCount
                        ) || 0
                    ),
                0
            );

        const totalStaff =
            teams.reduce(
                (
                    total,
                    team
                ) =>
                    total +
                    (
                        Number(
                            team.staffCount
                        ) || 0
                    ),
                0
            );

        return {
            totalTeams,
            activeTeams,
            inactiveTeams,

            totalMembers,

            teamsWithManagers,
            teamsWithoutManagers,

            totalDevelopers,
            totalStaff,
        };
    } catch (error) {
        console.error(
            "Unable to get team statistics:",
            error
        );

        throw error;
    }
}

// ============================================================
// CURRENT USER
// ============================================================

export {
    getCurrentUser,
};

// ============================================================
// DEFAULT SERVICE OBJECT
// ============================================================

const teamService = {
    // Team CRUD
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,

    // Manager management
    getAvailableManagers,
    assignManagerToTeam,
    assignTeamManager,
    removeManagerFromTeam,

    // Team members
    getTeamMembers,
    getAvailableTeamMembers,
    getTeamMemberCandidates,

    addMemberToTeam,
    addMembersToTeam,

    isTeamMember,
    removeMemberFromTeam,

    // Statistics
    getTeamMemberCount,
    getTotalTeamMembers,
    getTeamStatistics,

    // Normalizers
    normalizeTeam,
    normalizeTeamMember,

    // Roles
    getRoleName,

    // Current user
    getCurrentUser,
};

export default teamService;

