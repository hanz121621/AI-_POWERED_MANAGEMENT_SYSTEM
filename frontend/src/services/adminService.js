// ============================================================
// AIPMS ADMIN SERVICE
// LocalStorage version
//
// Purpose:
// - Admin Dashboard statistics
// - User/team/project/task summary data
//
// Later:
// This service can be replaced with API calls to the .NET backend.
// ============================================================

import { getUsers } from "@/services/authService";
import { getTeams } from "@/services/teamService";

// ============================================================
// STORAGE KEYS
// ============================================================

const PROJECTS_KEY = "aipms_projects";
const TASKS_KEY = "aipms_tasks";

// ============================================================
// SAFE LOCAL STORAGE READER
// ============================================================

function getStorageData(key) {
    const storedData =
        localStorage.getItem(key);

    if (!storedData) {
        return [];
    }

    try {
        const parsedData =
            JSON.parse(storedData);

        return Array.isArray(parsedData)
            ? parsedData
            : [];
    } catch (error) {
        console.error(
            `Unable to read ${key}:`,
            error
        );

        return [];
    }
}

// ============================================================
// GET DASHBOARD STATISTICS
// ============================================================

export function getAdminDashboardStats() {

    const users =
        getUsers() || [];

    const teams =
        getTeams() || [];

    const projects =
        getStorageData(
            PROJECTS_KEY
        );

    const tasks =
        getStorageData(
            TASKS_KEY
        );

    // --------------------------------------------------------
    // USER STATISTICS
    // --------------------------------------------------------

    const totalUsers =
        users.length;

    const activeUsers =
        users.filter(
            (user) =>
                user.active !== false
        ).length;

    const inactiveUsers =
        users.filter(
            (user) =>
                user.active === false
        ).length;

    const adminUsers =
        users.filter(
            (user) =>
                String(
                    user.role ||
                    ""
                ).toLowerCase() ===
                "admin"
        ).length;

    const managerUsers =
        users.filter(
            (user) =>
                String(
                    user.role ||
                    ""
                ).toLowerCase() ===
                "manager"
        ).length;

    const contributorUsers =
        users.filter(
            (user) =>
                String(
                    user.role ||
                    ""
                ).toLowerCase() ===
                "contributor"
        ).length;

    // --------------------------------------------------------
    // TEAM STATISTICS
    // --------------------------------------------------------

    const totalTeams =
        teams.length;

    const activeTeams =
        teams.filter(
            (team) =>
                String(
                    team.status ||
                    ""
                ).toLowerCase() ===
                "active"
        ).length;

    const inactiveTeams =
        teams.filter(
            (team) =>
                String(
                    team.status ||
                    ""
                ).toLowerCase() !==
                "active"
        ).length;

    const totalMembers =
        teams.reduce(
            (total, team) =>
                total +
                Number(
                    team.members || 0
                ),
            0
        );

    // --------------------------------------------------------
    // PROJECT STATISTICS
    // --------------------------------------------------------

    const totalProjects =
        projects.length;

    const activeProjects =
        projects.filter(
            (project) =>
                String(
                    project.status ||
                    ""
                ).toLowerCase() ===
                "active"
        ).length;

    // --------------------------------------------------------
    // TASK STATISTICS
    // --------------------------------------------------------

    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(
            (task) =>
                String(
                    task.status ||
                    ""
                ).toLowerCase() ===
                "completed"
        ).length;

    const pendingTasks =
        tasks.filter(
            (task) =>
                String(
                    task.status ||
                    ""
                ).toLowerCase() !==
                "completed"
        ).length;

    // --------------------------------------------------------
    // RETURN DASHBOARD DATA
    // --------------------------------------------------------

    return {

        users: {
            total:
                totalUsers,

            active:
                activeUsers,

            inactive:
                inactiveUsers,

            admins:
                adminUsers,

            managers:
                managerUsers,

            contributors:
                contributorUsers,
        },

        teams: {
            total:
                totalTeams,

            active:
                activeTeams,

            inactive:
                inactiveTeams,

            members:
                totalMembers,
        },

        projects: {
            total:
                totalProjects,

            active:
                activeProjects,
        },

        tasks: {
            total:
                totalTasks,

            completed:
                completedTasks,

            pending:
                pendingTasks,
        },

        // ----------------------------------------------------
        // COMMON SUMMARY VALUES
        // ----------------------------------------------------

        totalUsers,

        activeUsers,

        inactiveUsers,

        totalTeams,

        activeTeams,

        totalProjects,

        activeProjects,

        totalTasks,

        completedTasks,

        pendingTasks,

        totalMembers,
    };
}

// ============================================================
// GET USER SUMMARY
// ============================================================

export function getAdminUserSummary() {

    const users =
        getUsers() || [];

    return {

        total:
            users.length,

        active:
            users.filter(
                (user) =>
                    user.active !== false
            ).length,

        inactive:
            users.filter(
                (user) =>
                    user.active === false
            ).length,

        admins:
            users.filter(
                (user) =>
                    user.role === "Admin"
            ).length,

        managers:
            users.filter(
                (user) =>
                    user.role === "Manager"
            ).length,

        contributors:
            users.filter(
                (user) =>
                    user.role === "Contributor"
            ).length,
    };
}

// ============================================================
// GET TEAM SUMMARY
// ============================================================

export function getAdminTeamSummary() {

    const teams =
        getTeams() || [];

    return {

        total:
            teams.length,

        active:
            teams.filter(
                (team) =>
                    team.status === "Active"
            ).length,

        inactive:
            teams.filter(
                (team) =>
                    team.status !== "Active"
            ).length,

        members:
            teams.reduce(
                (total, team) =>
                    total +
                    Number(
                        team.members || 0
                    ),
                0
            ),
    };
}


// ============================================================
// REFRESH DASHBOARD DATA
// ============================================================

export function refreshAdminDashboard() {
    return getAdminDashboardStats();
}