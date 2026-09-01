
// ============================================================
// AIPMS MANAGER ACTIVITY SERVICE
//
// COMM-004 — View Activity Feed
//
// Purpose:
// - Retrieve activity records for the authenticated Manager
// - Restrict activities to authorized projects
// - Support activity filtering
// - Read existing audit/activity records
// - Never modify activity records when viewed
// ============================================================

const ACTIVITY_KEY = "aipms_activity_logs";
const USERS_KEY = "aipms_users";
const PROJECTS_KEY = "aipms_projects";
const TEAMS_KEY = "aipms_teams";

// ============================================================
// STORAGE HELPERS
// ============================================================

function readStorage(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed
            : fallback;
    } catch (error) {
        console.error(
            `Failed to read ${key}:`,
            error
        );

        return fallback;
    }
}

// ============================================================
// CURRENT USER
// ============================================================

function getCurrentUser() {
    try {
        const currentUser = localStorage.getItem(
            "aipms_current_user"
        );

        if (!currentUser) {
            return null;
        }

        return JSON.parse(currentUser);
    } catch (error) {
        console.error(
            "Failed to read current user:",
            error
        );

        return null;
    }
}

// ============================================================
// NORMALIZE ID
// ============================================================

function normalizeId(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value);
}

// ============================================================
// NORMALIZE ACTIVITY
// ============================================================

function normalizeActivity(activity, index) {
    if (!activity) {
        return null;
    }

    const activityType =
        activity.activityType ||
        activity.type ||
        activity.action ||
        activity.eventType ||
        "Activity";

    const createdAt =
        activity.createdAt ||
        activity.timestamp ||
        activity.date ||
        activity.occurredAt ||
        new Date().toISOString();

    const actorName =
        activity.performedByName ||
        activity.actorName ||
        activity.userName ||
        activity.performedBy ||
        activity.actor ||
        "System";

    const actorEmail =
        activity.performedByEmail ||
        activity.userEmail ||
        activity.targetUserEmail ||
        "";

    const projectId =
        activity.projectId ||
        activity.targetProjectId ||
        activity.project?.id ||
        "";

    const projectName =
        activity.projectName ||
        activity.project?.name ||
        activity.targetProjectName ||
        "Project";

    const teamId =
        activity.teamId ||
        activity.targetTeamId ||
        activity.team?.id ||
        "";

    const teamName =
        activity.teamName ||
        activity.team?.name ||
        activity.targetTeamName ||
        "";

    const description =
        activity.description ||
        activity.details ||
        activity.message ||
        activity.actionDescription ||
        `${activityType} occurred`;

    return {
        id:
            activity.id ||
            activity.activityId ||
            activity.logId ||
            `activity-${index}-${createdAt}`,

        activityType,

        action:
            activity.action ||
            activityType,

        description,

        createdAt,

        timestamp: createdAt,

        performedBy:
            activity.performedBy ||
            actorName,

        performedByName:
            actorName,

        performedByEmail:
            actorEmail,

        targetUserId:
            activity.targetUserId ||
            "",

        targetUserEmail:
            activity.targetUserEmail ||
            "",

        projectId:
            normalizeId(projectId),

        projectName,

        teamId:
            normalizeId(teamId),

        teamName,

        sprintId:
            activity.sprintId ||
            "",

        sprintName:
            activity.sprintName ||
            "",

        taskId:
            activity.taskId ||
            "",

        taskName:
            activity.taskName ||
            "",

        metadata:
            activity.metadata ||
            {},

        originalActivity:
            activity,
    };
}

// ============================================================
// GET MANAGER PROJECTS
// ============================================================

function getManagerProjects(manager) {
    const projects = readStorage(
        PROJECTS_KEY,
        []
    );

    const managerId =
        normalizeId(manager?.id);

    const managerEmail =
        String(
            manager?.email || ""
        ).toLowerCase();

    return projects.filter((project) => {

        const projectManagerId =
            normalizeId(
                project.managerId ||
                project.managerUserId ||
                project.projectManagerId
            );

        const projectManagerEmail =
            String(
                project.managerEmail ||
                project.manager?.email ||
                ""
            ).toLowerCase();

        const managerIds = Array.isArray(
            project.managerIds
        )
            ? project.managerIds.map(normalizeId)
            : [];

        const managerEmails = Array.isArray(
            project.managerEmails
        )
            ? project.managerEmails.map((email) =>
                String(email).toLowerCase()
            )
            : [];

        return (
            (
                managerId &&
                projectManagerId &&
                managerId === projectManagerId
            ) ||
            (
                managerEmail &&
                projectManagerEmail &&
                managerEmail === projectManagerEmail
            ) ||
            managerIds.includes(managerId) ||
            managerEmails.includes(managerEmail)
        );
    });
}

// ============================================================
// AUTHORIZED PROJECT IDS
// ============================================================

function getAuthorizedProjectIds(manager) {
    const projects =
        getManagerProjects(manager);

    return new Set(
        projects
            .map((project) =>
                normalizeId(project.id)
            )
            .filter(Boolean)
    );
}

// ============================================================
// GET AUTHORIZED ACTIVITIES
//
// Business Rule:
// Manager can only view activities belonging to
// projects assigned to that Manager.
// ============================================================

export function getManagerActivityFeed(options = {}) {

    const manager =
        options.manager ||
        getCurrentUser();

    if (!manager) {
        throw new Error(
            "AUTHENTICATION_REQUIRED"
        );
    }

    const role =
        String(manager.role || "")
            .toLowerCase();

    if (
        role !== "manager" &&
        role !== "project manager"
    ) {
        throw new Error(
            "ACCESS_DENIED"
        );
    }

    const activities =
        readStorage(
            ACTIVITY_KEY,
            []
        );

    const authorizedProjectIds =
        getAuthorizedProjectIds(manager);

    // --------------------------------------------------------
    // Normalize activity records
    // --------------------------------------------------------

    const normalizedActivities =
        activities
            .map(normalizeActivity)
            .filter(Boolean);

    // --------------------------------------------------------
    // Filter by authorized projects
    // --------------------------------------------------------

    const authorizedActivities =
        normalizedActivities.filter(
            (activity) => {

                const projectId =
                    normalizeId(
                        activity.projectId
                    );

                // If activity has a project ID,
                // it must belong to an authorized project.
                if (projectId) {
                    return authorizedProjectIds.has(
                        projectId
                    );
                }

                // Some existing activity records may not
                // contain projectId. Do not expose them
                // unless explicitly connected to the manager.
                return false;
            }
        );

    // --------------------------------------------------------
    // Sort newest first
    // --------------------------------------------------------

    authorizedActivities.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    // --------------------------------------------------------
    // Apply filters
    // --------------------------------------------------------

    let filteredActivities =
        authorizedActivities;

    if (options.projectId) {

        const projectId =
            normalizeId(
                options.projectId
            );

        filteredActivities =
            filteredActivities.filter(
                (activity) =>
                    normalizeId(
                        activity.projectId
                    ) === projectId
            );
    }

    if (options.teamId) {

        const teamId =
            normalizeId(
                options.teamId
            );

        filteredActivities =
            filteredActivities.filter(
                (activity) =>
                    normalizeId(
                        activity.teamId
                    ) === teamId
            );
    }

    if (options.activityType) {

        const type =
            String(
                options.activityType
            ).toLowerCase();

        filteredActivities =
            filteredActivities.filter(
                (activity) =>
                    String(
                        activity.activityType
                    ).toLowerCase() === type
            );
    }

    if (options.search) {

        const search =
            String(
                options.search
            )
                .trim()
                .toLowerCase();

        if (search) {

            filteredActivities =
                filteredActivities.filter(
                    (activity) => {

                        const searchableText = [
                            activity.activityType,
                            activity.action,
                            activity.description,
                            activity.projectName,
                            activity.teamName,
                            activity.sprintName,
                            activity.taskName,
                            activity.performedByName,
                            activity.performedByEmail,
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();

                        return searchableText.includes(
                            search
                        );
                    }
                );
        }
    }

    if (options.fromDate) {

        const from =
            new Date(
                options.fromDate
            );

        from.setHours(
            0,
            0,
            0,
            0
        );

        filteredActivities =
            filteredActivities.filter(
                (activity) =>
                    new Date(
                        activity.createdAt
                    ) >= from
            );
    }

    if (options.toDate) {

        const to =
            new Date(
                options.toDate
            );

        to.setHours(
            23,
            59,
            59,
            999
        );

        filteredActivities =
            filteredActivities.filter(
                (activity) =>
                    new Date(
                        activity.createdAt
                    ) <= to
            );
    }

    return filteredActivities;
}

// ============================================================
// GET ACTIVITY TYPES
//
// Types are extracted from actual stored activity records.
// They are NOT hard-coded.
// ============================================================

export function getManagerActivityTypes() {

    const manager =
        getCurrentUser();

    if (!manager) {
        throw new Error(
            "AUTHENTICATION_REQUIRED"
        );
    }

    const activities =
        getManagerActivityFeed();

    const types =
        [
            ...new Set(
                activities
                    .map(
                        (activity) =>
                            activity.activityType
                    )
                    .filter(Boolean)
            ),
        ];

    return types.sort(
        (a, b) =>
            String(a).localeCompare(
                String(b)
            )
    );
}

// ============================================================
// GET MANAGER PROJECT FILTER OPTIONS
// ============================================================

export function getManagerActivityProjects() {

    const activities =
        getManagerActivityFeed();

    const map =
        new Map();

    activities.forEach(
        (activity) => {

            if (
                !activity.projectId
            ) {
                return;
            }

            if (
                !map.has(
                    activity.projectId
                )
            ) {

                map.set(
                    activity.projectId,
                    {
                        id:
                            activity.projectId,

                        name:
                            activity.projectName,
                    }
                );
            }
        }
    );

    return Array.from(
        map.values()
    ).sort(
        (a, b) =>
            String(a.name).localeCompare(
                String(b.name)
            )
    );
}

// ============================================================
// GET MANAGER TEAM FILTER OPTIONS
// ============================================================

export function getManagerActivityTeams() {

    const activities =
        getManagerActivityFeed();

    const map =
        new Map();

    activities.forEach(
        (activity) => {

            if (
                !activity.teamId
            ) {
                return;
            }

            if (
                !map.has(
                    activity.teamId
                )
            ) {

                map.set(
                    activity.teamId,
                    {
                        id:
                            activity.teamId,

                        name:
                            activity.teamName ||
                            "Team",
                    }
                );
            }
        }
    );

    return Array.from(
        map.values()
    ).sort(
        (a, b) =>
            String(a.name).localeCompare(
                String(b.name)
            )
    );
}

// ============================================================
// GET SINGLE ACTIVITY
//
// Viewing an activity does NOT modify it.
// ============================================================

export function getManagerActivityById(
    activityId
) {

    const activities =
        getManagerActivityFeed();

    const id =
        normalizeId(
            activityId
        );

    return (
        activities.find(
            (activity) =>
                normalizeId(
                    activity.id
                ) === id
        ) || null
    );
}

// ============================================================
// EXPORT
// ============================================================

export default {
    getManagerActivityFeed,
    getManagerActivityTypes,
    getManagerActivityProjects,
    getManagerActivityTeams,
    getManagerActivityById,
};

