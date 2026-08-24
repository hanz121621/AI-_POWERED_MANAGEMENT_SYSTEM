const USERS_KEY = "aipms_users";
const ACTIVITY_KEY = "aipms_activity_logs";
const PROJECTS_KEY = "aipms_projects";
const TEAMS_KEY = "aipms_teams";
const TASKS_KEY = "aipms_tasks";
const CURRENT_USER_KEY = "aipms_current_user";

// ============================================================
// ACTIVITY LOG STORAGE SETTINGS
// ============================================================

// Maximum number of activity records kept in localStorage.
//
// Keeping this bounded is important because localStorage is
// normally limited to only a few MB per origin.
const MAX_ACTIVITY_LOGS = 500;

// If storage is almost full, this is the first smaller size
// we try before progressively reducing the history.
const SAFE_ACTIVITY_LOGS = 250;

// Maximum length of device information.
//
// navigator.userAgent can become unnecessarily large and every
// activity record stores a copy of it.
const MAX_DEVICE_INFO_LENGTH = 500;

// ============================================================
// SAFE LOCAL STORAGE HELPERS
// ============================================================

const getStoredArray = (key) => {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return [];
        }

        const parsed = JSON.parse(value);

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Failed to load ${key}:`, error);

        return [];
    }
};

// ============================================================
// SAFE LOCAL STORAGE WRITE
// ============================================================
//
// This helper prevents QuotaExceededError from breaking the
// application.
//
// It progressively reduces the number of activity records until
// localStorage accepts the new value.
//
// ============================================================

const saveActivityLogsSafely = (
    logs
) => {
    if (!Array.isArray(logs)) {
        return {
            success: false,
            error: "Activity logs must be an array.",
        };
    }

    // --------------------------------------------------------
    // Remove invalid values first.
    // --------------------------------------------------------

    let sanitizedLogs = logs.filter(
        (item) =>
            item &&
            typeof item === "object"
    );

    // --------------------------------------------------------
    // Keep only the newest MAX_ACTIVITY_LOGS records.
    // --------------------------------------------------------

    sanitizedLogs =
        sanitizedLogs.slice(
            -MAX_ACTIVITY_LOGS
        );

    // --------------------------------------------------------
    // Try several storage sizes.
    //
    // This makes the function resilient if other application
    // data is already consuming most of localStorage.
    // --------------------------------------------------------

    const attempts = [
        MAX_ACTIVITY_LOGS,
        SAFE_ACTIVITY_LOGS,
        100,
        50,
        25,
        10,
        5,
        1,
        0,
    ];

    for (
        const limit of attempts
    ) {
        try {
            const recordsToSave =
                limit === 0
                    ? []
                    : sanitizedLogs.slice(
                          -limit
                      );

            localStorage.setItem(
                ACTIVITY_KEY,
                JSON.stringify(
                    recordsToSave
                )
            );

            return {
                success: true,
                data: recordsToSave,
                storedCount:
                    recordsToSave.length,
            };
        } catch (error) {
            const isQuotaError =
                error?.name ===
                    "QuotaExceededError" ||
                error?.code ===
                    22;

            if (!isQuotaError) {
                console.error(
                    "Failed to save activity logs:",
                    error
                );

                return {
                    success: false,
                    error:
                        error?.message ||
                        "Unable to save activity logs.",
                };
            }

            // Continue with a smaller number of records.
        }
    }

    return {
        success: false,
        error:
            "Unable to save activity logs because browser storage is full.",
    };
};

// ============================================================
// SANITIZE ACTIVITY LOG
// ============================================================

const sanitizeActivityLog = (
    log
) => {
    if (
        !log ||
        typeof log !== "object"
    ) {
        return null;
    }

    const sanitized = {
        ...log,
    };

    // --------------------------------------------------------
    // Limit device information.
    // --------------------------------------------------------

    if (
        sanitized.details &&
        typeof sanitized.details ===
            "object"
    ) {
        sanitized.details = {
            ...sanitized.details,
        };

        if (
            typeof sanitized.details
                .deviceInfo === "string"
        ) {
            sanitized.details.deviceInfo =
                sanitized.details.deviceInfo.slice(
                    0,
                    MAX_DEVICE_INFO_LENGTH
                );
        }
    }

    return sanitized;
};

// ============================================================
// GET USERS
// ============================================================

const getStoredUsers = () => {
    return getStoredArray(
        USERS_KEY
    );
};

// ============================================================
// GET ACTIVITY LOGS
// ============================================================

const getStoredActivityLogs = () => {
    return getStoredArray(
        ACTIVITY_KEY
    );
};

// ============================================================
// GET CURRENT USER
// ============================================================

const getCurrentUser = () => {
    try {
        const value =
            localStorage.getItem(
                CURRENT_USER_KEY
            );

        return value
            ? JSON.parse(value)
            : null;
    } catch (error) {
        console.error(
            "Failed to load current user:",
            error
        );

        return null;
    }
};

// ============================================================
// GET REPORT FILTER OPTIONS
// MON-001
// ============================================================

export const getReportFilterOptions = (
    options = {}
) => {
    try {
        // ----------------------------------------------------
        // The Reports.jsx component can pass users/projects/
        // teams directly.
        //
        // If they are not supplied, fall back to localStorage.
        // ----------------------------------------------------

        const users =
            Array.isArray(
                options?.users
            )
                ? options.users
                : getStoredUsers();

        const projects =
            Array.isArray(
                options?.projects
            )
                ? options.projects
                : getStoredArray(
                      PROJECTS_KEY
                  );

        const teams =
            Array.isArray(
                options?.teams
            )
                ? options.teams
                : getStoredArray(
                      TEAMS_KEY
                  );

        return {
            success: true,

            data: {
                users: users.map(
                    (user) => ({
                        id:
                            user?.id ??
                            user?._id ??
                            user?.userId ??
                            "",

                        name:
                            user?.fullName ||
                            user?.name ||
                            user?.username ||
                            user?.email ||
                            "Unknown User",

                        email:
                            user?.email ||
                            "",

                        role:
                            user?.role ||
                            user?.Role ||
                            "Unknown",
                    })
                ),

                projects:
                    projects.map(
                        (project) => ({
                            id:
                                project?.id ??
                                project?._id ??
                                project?.projectId ??
                                "",

                            name:
                                project?.name ||
                                project?.title ||
                                project?.projectName ||
                                "Unnamed Project",
                        })
                    ),

                teams: teams.map(
                    (team) => ({
                        id:
                            team?.id ??
                            team?._id ??
                            team?.teamId ??
                            "",

                        name:
                            team?.name ||
                            team?.title ||
                            team?.teamName ||
                            "Unnamed Team",
                    })
                ),
            },
        };
    } catch (error) {
        console.error(
            "Failed to load report filter options:",
            error
        );

        return {
            success: false,

            error:
                "Unable to load report filter options. Please try again.",

            data: {
                users: [],
                projects: [],
                teams: [],
            },
        };
    }
};

// ============================================================
// RECORD REPORT ACCESS
// MON-001 / BR5
// ============================================================
//
// IMPORTANT:
//
// Report access logging must NEVER break report viewing.
//
// If localStorage is full, this function returns success:false
// but does not throw the error to Reports.jsx.
// ============================================================

export const recordReportAccess = (
    reportData = {}
) => {
    try {
        const data =
            reportData &&
            typeof reportData ===
                "object"
                ? reportData
                : {};

        // ----------------------------------------------------
        // Existing activity records
        // ----------------------------------------------------

        const existingLogs =
            getStoredActivityLogs();

        // ----------------------------------------------------
        // Current user
        //
        // Prefer the user supplied by Reports.jsx.
        // Otherwise fall back to localStorage.
        // ----------------------------------------------------

        const currentUser =
            data.currentUser ||
            getCurrentUser();

        // ----------------------------------------------------
        // Report information
        // ----------------------------------------------------

        const reportType =
            data.reportType ||
            data.type ||
            "System Report";

        const filters =
            data.filters || {};

        const reportSummary =
            data.reportSummary ||
            data.summary ||
            {};

        // ----------------------------------------------------
        // Device information
        // ----------------------------------------------------

        let deviceInfo =
            data.deviceInfo ||
            (
                typeof navigator !==
                "undefined"
                    ? navigator.userAgent
                    : null
            );

        if (
            typeof deviceInfo ===
            "string"
        ) {
            deviceInfo =
                deviceInfo.slice(
                    0,
                    MAX_DEVICE_INFO_LENGTH
                );
        }

        // ----------------------------------------------------
        // CREATE ACTIVITY RECORD
        // ----------------------------------------------------

        const activityLog =
            sanitizeActivityLog({
                id:
                    `activity-${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2, 9)}`,

                action:
                    "REPORT_ACCESSED",

                targetUserId:
                    data.targetUserId ??
                    null,

                targetUserEmail:
                    data.targetUserEmail ??
                    null,

                performedBy:
                    currentUser?.email ||
                    currentUser?.fullName ||
                    currentUser?.name ||
                    data.performedBy ||
                    "System",

                performedById:
                    currentUser?.id ||
                    currentUser?._id ||
                    currentUser?.userId ||
                    data.performedById ||
                    null,

                createdAt:
                    new Date().toISOString(),

                details: {
                    module:
                        data.module ||
                        "Monitoring & Reports",

                    description:
                        data.description ||
                        `Accessed ${reportType}`,

                    reportType,

                    filters,

                    summary:
                        reportSummary,

                    role:
                        currentUser?.role ||
                        currentUser?.Role ||
                        data.role ||
                        null,

                    ipAddress:
                        data.ipAddress ||
                        null,

                    deviceInfo,
                },
            });

        if (!activityLog) {
            return {
                success: false,
                error:
                    "Unable to create activity record.",
                data: null,
            };
        }

        // ----------------------------------------------------
        // ADD NEWEST RECORD
        // ----------------------------------------------------

        const updatedLogs = [
            ...existingLogs,
            activityLog,
        ];

        // ----------------------------------------------------
        // SAFE SAVE
        // ----------------------------------------------------

        const saveResult =
            saveActivityLogsSafely(
                updatedLogs
            );

        if (!saveResult.success) {
            console.warn(
                "Report access was not stored because browser storage is full:",
                saveResult.error
            );

            // IMPORTANT:
            //
            // Do not throw.
            //
            // Report viewing must continue even if activity
            // logging cannot be persisted.
            return {
                success: false,
                error:
                    saveResult.error ||
                    "Unable to store report access.",
                data: activityLog,
            };
        }

        console.log(
            "Report access recorded successfully:",
            activityLog
        );

        return {
            success: true,
            data: activityLog,
            storedCount:
                saveResult.storedCount,
        };
    } catch (error) {
        // ----------------------------------------------------
        // Logging must never break the application.
        // ----------------------------------------------------

        console.error(
            "Failed to record report access:",
            error
        );

        return {
            success: false,

            error:
                error?.message ||
                "Unable to record report access.",

            data: null,
        };
    }
};

// ============================================================
// GET ACTIVITY LOGS
// MON-002 — READ-ONLY
// ============================================================

export const getActivityLogs = ({
    startDate = "",
    endDate = "",
    user = "",
    action = "",
    module = "",
} = {}) => {
    try {
        const logs =
            getStoredActivityLogs();

        const filteredLogs =
            logs.filter(
                (item) => {
                    // ------------------------------------------------
                    // USER FILTER
                    // ------------------------------------------------

                    if (user) {
                        const performedBy =
                            item.performedBy ||
                            item.userEmail ||
                            item.user?.email ||
                            "";

                        const targetUserEmail =
                            item.targetUserEmail ||
                            item.targetUser?.email ||
                            "";

                        const performedById =
                            item.performedById ||
                            item.userId ||
                            "";

                        const targetUserId =
                            item.targetUserId ||
                            "";

                        if (
                            performedBy !==
                                user &&
                            targetUserEmail !==
                                user &&
                            performedById !==
                                user &&
                            targetUserId !==
                                user
                        ) {
                            return false;
                        }
                    }

                    // ------------------------------------------------
                    // ACTION FILTER
                    // ------------------------------------------------

                    if (action) {
                        const activityAction =
                            String(
                                item.action ||
                                    ""
                            ).toLowerCase();

                        if (
                            activityAction !==
                            String(
                                action
                            ).toLowerCase()
                        ) {
                            return false;
                        }
                    }

                    // ------------------------------------------------
                    // MODULE FILTER
                    // ------------------------------------------------

                    if (module) {
                        const activityModule =
                            item.module ||
                            item.details?.module ||
                            "";

                        if (
                            String(
                                activityModule
                            ).toLowerCase() !==
                            String(
                                module
                            ).toLowerCase()
                        ) {
                            return false;
                        }
                    }

                    // ------------------------------------------------
                    // DATE FILTER
                    // ------------------------------------------------

                    if (
                        startDate ||
                        endDate
                    ) {
                        const activityDate =
                            new Date(
                                item.createdAt ||
                                    item.timestamp ||
                                    item.date
                            );

                        if (
                            Number.isNaN(
                                activityDate.getTime()
                            )
                        ) {
                            return false;
                        }

                        if (startDate) {
                            const start =
                                new Date(
                                    startDate
                                );

                            start.setHours(
                                0,
                                0,
                                0,
                                0
                            );

                            if (
                                activityDate <
                                start
                            ) {
                                return false;
                            }
                        }

                        if (endDate) {
                            const end =
                                new Date(
                                    endDate
                                );

                            end.setHours(
                                23,
                                59,
                                59,
                                999
                            );

                            if (
                                activityDate >
                                end
                            ) {
                                return false;
                            }
                        }
                    }

                    return true;
                }
            );

        return {
            success: true,

            data: filteredLogs
                .slice()
                .reverse(),
        };
    } catch (error) {
        console.error(
            "Failed to load activity logs:",
            error
        );

        return {
            success: false,

            error:
                "Unable to load activity logs. Please try again.",

            data: [],
        };
    }
};

// ============================================================
// GET SINGLE ACTIVITY LOG
// MON-002
// ============================================================

export const getActivityLogById = (
    activityId
) => {
    try {
        const logs =
            getStoredActivityLogs();

        const activity =
            logs.find(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(
                        activityId
                    )
            );

        if (!activity) {
            return {
                success: false,

                error:
                    "Activity record not found.",

                data: null,
            };
        }

        return {
            success: true,
            data: activity,
        };
    } catch (error) {
        console.error(
            "Failed to load activity record:",
            error
        );

        return {
            success: false,

            error:
                "Unable to load activity record. Please try again.",

            data: null,
        };
    }
};

// ============================================================
// GET ACTIVITY FILTER OPTIONS
// MON-002
// ============================================================

export const getActivityLogFilterOptions =
    () => {
        try {
            const logs =
                getStoredActivityLogs();

            const users = [
                ...new Set(
                    logs
                        .map(
                            (item) =>
                                item.performedBy ||
                                item.userEmail ||
                                item.user?.email
                        )
                        .filter(Boolean)
                ),
            ];

            const actions = [
                ...new Set(
                    logs
                        .map(
                            (item) =>
                                item.action
                        )
                        .filter(Boolean)
                ),
            ];

            const modules = [
                ...new Set(
                    logs
                        .map(
                            (item) =>
                                item.module ||
                                item.details?.module
                        )
                        .filter(Boolean)
                ),
            ];

            return {
                success: true,

                data: {
                    users,
                    actions,
                    modules,
                },
            };
        } catch (error) {
            console.error(
                "Failed to load activity filter options:",
                error
            );

            return {
                success: false,

                error:
                    "Unable to load activity filter options.",

                data: {
                    users: [],
                    actions: [],
                    modules: [],
                },
            };
        }
    };

// ============================================================
// GENERATE SYSTEM REPORT
// MON-001
// ============================================================

export const generateSystemReport = (
    options = {}
) => {
    try {
        // ----------------------------------------------------
        // Support both the old service API and the Reports.jsx
        // API.
        //
        // Old:
        // {
        //   startDate,
        //   endDate,
        //   project,
        //   team,
        //   user
        // }
        //
        // New:
        // {
        //   filters,
        //   users,
        //   projects,
        //   teams,
        //   tasks,
        //   activityLogs,
        //   auditLogs,
        //   aiUsage,
        //   currentUser
        // }
        // ----------------------------------------------------

        const filters =
            options.filters || {};

        const startDate =
            options.startDate ??
            filters.dateFrom ??
            "";

        const endDate =
            options.endDate ??
            filters.dateTo ??
            "";

        const project =
            options.project ??
            (
                filters.projectId !==
                "all"
                    ? filters.projectId
                    : ""
            );

        const team =
            options.team ??
            (
                filters.teamId !==
                "all"
                    ? filters.teamId
                    : ""
            );

        const user =
            options.user ??
            (
                filters.userId !==
                "all"
                    ? filters.userId
                    : ""
            );

        // ----------------------------------------------------
        // Use supplied arrays when Reports.jsx provides them.
        // Otherwise use localStorage.
        // ----------------------------------------------------

        const users =
            Array.isArray(
                options.users
            )
                ? options.users
                : getStoredUsers();

        const activityLogs =
            Array.isArray(
                options.activityLogs
            )
                ? options.activityLogs
                : getStoredActivityLogs();

        const projects =
            Array.isArray(
                options.projects
            )
                ? options.projects
                : getStoredArray(
                      PROJECTS_KEY
                  );

        const teams =
            Array.isArray(
                options.teams
            )
                ? options.teams
                : getStoredArray(
                      TEAMS_KEY
                  );

        const tasks =
            Array.isArray(
                options.tasks
            )
                ? options.tasks
                : getStoredArray(
                      TASKS_KEY
                  );

        // ========================================================
        // USERS
        // ========================================================

        const totalUsers =
            users.length;

        const activeUsers =
            users.filter(
                (item) =>
                    item?.status ===
                        "Active" ||
                    item?.status ===
                        "active" ||
                    item?.active ===
                        true ||
                    item?.isActive ===
                        true
            ).length;

        const inactiveUsers =
            Math.max(
                0,
                totalUsers -
                    activeUsers
            );

        // ========================================================
        // PROJECTS
        // ========================================================

        const filteredProjects =
            projects.filter(
                (item) => {
                    // --------------------------------------------
                    // PROJECT
                    // --------------------------------------------

                    if (project) {
                        const itemId =
                            String(
                                item?.id ??
                                    item?._id ??
                                    item?.projectId ??
                                    ""
                            );

                        const itemName =
                            item?.name ||
                            item?.title ||
                            item?.projectName ||
                            "";

                        if (
                            itemId !==
                                String(
                                    project
                                ) &&
                            itemName !==
                                project
                        ) {
                            return false;
                        }
                    }

                    // --------------------------------------------
                    // TEAM
                    // --------------------------------------------

                    if (team) {
                        const teamId =
                            item?.teamId ||
                            item?.team?.id;

                        const teamName =
                            item?.teamName ||
                            item?.team?.name;

                        if (
                            String(
                                teamId ?? ""
                            ) !==
                                String(
                                    team
                                ) &&
                            teamName !==
                                team
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );

        const projectStatusSummary =
            filteredProjects.reduce(
                (summary, item) => {
                    const status =
                        item?.status ||
                        item?.projectStatus ||
                        "Unknown";

                    summary[status] =
                        (summary[status] ||
                            0) + 1;

                    return summary;
                },
                {}
            );

        // ========================================================
        // TEAMS
        // ========================================================

        const filteredTeams =
            teams.filter(
                (item) => {
                    if (!team) {
                        return true;
                    }

                    return (
                        String(
                            item?.id ??
                                item?._id ??
                                item?.teamId ??
                                ""
                        ) ===
                            String(
                                team
                            ) ||
                        item?.name ===
                            team ||
                        item?.title ===
                            team ||
                        item?.teamName ===
                            team
                    );
                }
            );

        // ========================================================
        // TASKS
        // ========================================================

        const filteredTasks =
            tasks.filter(
                (item) => {
                    // --------------------------------------------
                    // PROJECT
                    // --------------------------------------------

                    if (project) {
                        const projectId =
                            item?.projectId ||
                            item?.project?.id;

                        const projectName =
                            item?.projectName ||
                            item?.project?.name;

                        if (
                            String(
                                projectId ??
                                    ""
                            ) !==
                                String(
                                    project
                                ) &&
                            projectName !==
                                project
                        ) {
                            return false;
                        }
                    }

                    // --------------------------------------------
                    // TEAM
                    // --------------------------------------------

                    if (team) {
                        const teamId =
                            item?.teamId ||
                            item?.team?.id;

                        const teamName =
                            item?.teamName ||
                            item?.team?.name;

                        if (
                            String(
                                teamId ??
                                    ""
                            ) !==
                                String(
                                    team
                                ) &&
                            teamName !==
                                team
                        ) {
                            return false;
                        }
                    }

                    // --------------------------------------------
                    // USER
                    // --------------------------------------------

                    if (user) {
                        const userId =
                            item?.userId ||
                            item?.assignedTo?.id ||
                            item?.assigneeId;

                        const userEmail =
                            item?.userEmail ||
                            item?.assignedTo?.email ||
                            item?.assignee?.email;

                        if (
                            String(
                                userId ??
                                    ""
                            ) !==
                                String(
                                    user
                                ) &&
                            userEmail !==
                                user
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );

        const totalTasks =
            filteredTasks.length;

        const completedTasks =
            filteredTasks.filter(
                (item) => {
                    const status =
                        String(
                            item?.status ||
                                ""
                        ).toLowerCase();

                    return (
                        status ===
                            "completed" ||
                        status ===
                            "done"
                    );
                }
            ).length;

        const incompleteTasks =
            Math.max(
                0,
                totalTasks -
                    completedTasks
            );

        const taskCompletionPercentage =
            totalTasks > 0
                ? Math.round(
                      (completedTasks /
                          totalTasks) *
                          100
                  )
                : 0;

        // ========================================================
        // USER ACTIVITY
        // ========================================================

        const filteredActivityLogs =
            activityLogs.filter(
                (item) => {
                    // --------------------------------------------
                    // USER
                    // --------------------------------------------

                    if (user) {
                        const performedBy =
                            item?.performedBy ||
                            item?.userEmail ||
                            item?.user?.email ||
                            "";

                        const targetUserEmail =
                            item?.targetUserEmail ||
                            item?.targetUser?.email ||
                            "";

                        const performedById =
                            item?.performedById ||
                            item?.userId ||
                            "";

                        const targetUserId =
                            item?.targetUserId ||
                            "";

                        if (
                            performedBy !==
                                user &&
                            targetUserEmail !==
                                user &&
                            String(
                                performedById
                            ) !==
                                String(
                                    user
                                ) &&
                            String(
                                targetUserId
                            ) !==
                                String(
                                    user
                                )
                        ) {
                            return false;
                        }
                    }

                    // --------------------------------------------
                    // DATE
                    // --------------------------------------------

                    if (
                        startDate ||
                        endDate
                    ) {
                        const activityDate =
                            new Date(
                                item?.createdAt ||
                                    item?.timestamp ||
                                    item?.date
                            );

                        if (
                            Number.isNaN(
                                activityDate.getTime()
                            )
                        ) {
                            return false;
                        }

                        if (
                            startDate
                        ) {
                            const start =
                                new Date(
                                    `${startDate}T00:00:00`
                                );

                            if (
                                activityDate <
                                start
                            ) {
                                return false;
                            }
                        }

                        if (
                            endDate
                        ) {
                            const end =
                                new Date(
                                    `${endDate}T23:59:59.999`
                                );

                            if (
                                activityDate >
                                end
                            ) {
                                return false;
                            }
                        }
                    }

                    return true;
                }
            );

        // ========================================================
        // USER ACTIVITY SUMMARY
        // ========================================================

        const userActivitySummary =
            filteredActivityLogs.reduce(
                (summary, item) => {
                    const performedBy =
                        item?.performedBy ||
                        "Unknown";

                    summary[
                        performedBy
                    ] =
                        (
                            summary[
                                performedBy
                            ] || 0
                        ) + 1;

                    return summary;
                },
                {}
            );

        // ========================================================
        // AI USAGE
        // ========================================================

        const aiActivityLogs =
            filteredActivityLogs.filter(
                (item) => {
                    const action =
                        String(
                            item?.action ||
                                ""
                        ).toLowerCase();

                    const module =
                        String(
                            item?.module ||
                                item?.details
                                    ?.module ||
                                ""
                        ).toLowerCase();

                    return (
                        action.includes(
                            "ai"
                        ) ||
                        action.includes(
                            "risk"
                        ) ||
                        action.includes(
                            "conflict"
                        ) ||
                        action.includes(
                            "decompose"
                        ) ||
                        module.includes(
                            "ai"
                        )
                    );
                }
            );

        const aiUsageStatistics = {
            totalAIUsage:
                aiActivityLogs.length,

            taskDecomposition:
                aiActivityLogs.filter(
                    (item) =>
                        String(
                            item?.action ||
                                ""
                        )
                            .toLowerCase()
                            .includes(
                                "decompose"
                            )
                ).length,

            riskAnalysis:
                aiActivityLogs.filter(
                    (item) =>
                        String(
                            item?.action ||
                                ""
                        )
                            .toLowerCase()
                            .includes(
                                "risk"
                            )
                ).length,

            conflictDetection:
                aiActivityLogs.filter(
                    (item) =>
                        String(
                            item?.action ||
                                ""
                        )
                            .toLowerCase()
                            .includes(
                                "conflict"
                            )
                ).length,
        };

        // ========================================================
        // RETURN REPORT
        // ========================================================

        return {
            success: true,

            data: {
                users: {
                    total:
                        totalUsers,

                    active:
                        activeUsers,

                    inactive:
                        inactiveUsers,
                },

                projects: {
                    total:
                        filteredProjects.length,

                    statusSummary:
                        projectStatusSummary,

                    data:
                        filteredProjects,
                },

                teams: {
                    total:
                        filteredTeams.length,

                    data:
                        filteredTeams,
                },

                tasks: {
                    total:
                        totalTasks,

                    completed:
                        completedTasks,

                    incomplete:
                        incompleteTasks,

                    completionPercentage:
                        taskCompletionPercentage,

                    data:
                        filteredTasks,
                },

                userActivity: {
                    totalActivities:
                        filteredActivityLogs.length,

                    summary:
                        userActivitySummary,

                    recent:
                        filteredActivityLogs
                            .slice(-10)
                            .reverse(),

                    data:
                        filteredActivityLogs,
                },

                aiUsage:
                    aiUsageStatistics,
            },
        };
    } catch (error) {
        console.error(
            "Failed to generate system reports:",
            error
        );

        return {
            success: false,

            error:
                "Unable to generate system reports. Please try again.",

            data: {
                users: {
                    total: 0,
                    active: 0,
                    inactive: 0,
                },

                projects: {
                    total: 0,
                    statusSummary: {},
                    data: [],
                },

                teams: {
                    total: 0,
                    data: [],
                },

                tasks: {
                    total: 0,
                    completed: 0,
                    incomplete: 0,
                    completionPercentage: 0,
                    data: [],
                },

                userActivity: {
                    totalActivities: 0,
                    summary: {},
                    recent: [],
                    data: [],
                },

                aiUsage: {
                    totalAIUsage: 0,
                    taskDecomposition: 0,
                    riskAnalysis: 0,
                    conflictDetection: 0,
                },
            },
        };
    }
};