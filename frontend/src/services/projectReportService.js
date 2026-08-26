
// ============================================================
// PROJECT REPORT SERVICE
// REPORT-001 — View Project Dashboard
// REPORT-002 — View Project Timeline
// REPORT-003 — View Risk and Issues
// ============================================================

// ============================================================
// STORAGE KEYS
// ============================================================

const PROJECTS_KEY = "aipms_projects";
const SPRINTS_KEY = "aipms_sprints";
const TASKS_KEY = "aipms_tasks";
const RISKS_KEY = "aipms_risks";
const ISSUES_KEY = "aipms_issues";
const MILESTONES_KEY = "aipms_milestones";

// ============================================================
// POSSIBLE AUTH KEYS
// ============================================================
// Your application has used aipms_current_user, but this
// service also checks the common keys used by the existing
// AIPMS authentication flow.
// ============================================================

const CURRENT_USER_KEYS = [
    "aipms_current_user",
    "aipms_currentUser",
    "aipms_user",
    "currentUser",
    "current_user",
    "user",
];

// ============================================================
// STORAGE HELPERS
// ============================================================

const parseStorageValue = (raw) => {
    if (
        raw === null ||
        raw === undefined ||
        raw === ""
    ) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
};

const readStorage = (
    key,
    fallback = []
) => {
    try {
        const raw =
            localStorage.getItem(key);

        if (!raw) {
            return fallback;
        }

        const parsed =
            JSON.parse(raw);

        if (Array.isArray(parsed)) {
            return parsed;
        }

        if (
            parsed &&
            typeof parsed === "object"
        ) {
            if (
                Array.isArray(
                    parsed.data
                )
            ) {
                return parsed.data;
            }

            if (
                Array.isArray(
                    parsed.items
                )
            ) {
                return parsed.items;
            }

            if (
                Array.isArray(
                    parsed.projects
                )
            ) {
                return parsed.projects;
            }

            if (
                Array.isArray(
                    parsed.records
                )
            ) {
                return parsed.records;
            }
        }

        return fallback;
    } catch (error) {
        console.error(
            `[ProjectReportService] Failed to read ${key}:`,
            error
        );

        return fallback;
    }
};

// ============================================================
// CURRENT USER
// ============================================================

const getCurrentUser = () => {
    // --------------------------------------------------------
    // 1. localStorage
    // --------------------------------------------------------

    for (
        const key of CURRENT_USER_KEYS
    ) {
        try {
            const raw =
                localStorage.getItem(
                    key
                );

            if (!raw) {
                continue;
            }

            const parsed =
                parseStorageValue(
                    raw
                );

            if (
                parsed &&
                typeof parsed ===
                    "object"
            ) {
                // Some applications store:
                // { user: {...} }
                if (
                    parsed.user &&
                    typeof parsed.user ===
                        "object"
                ) {
                    return parsed.user;
                }

                if (
                    parsed.currentUser &&
                    typeof parsed.currentUser ===
                        "object"
                ) {
                    return parsed.currentUser;
                }

                return parsed;
            }
        } catch (error) {
            console.warn(
                `Unable to read auth key ${key}:`,
                error
            );
        }
    }

    // --------------------------------------------------------
    // 2. sessionStorage
    // --------------------------------------------------------

    for (
        const key of CURRENT_USER_KEYS
    ) {
        try {
            const raw =
                sessionStorage.getItem(
                    key
                );

            if (!raw) {
                continue;
            }

            const parsed =
                parseStorageValue(
                    raw
                );

            if (
                parsed &&
                typeof parsed ===
                    "object"
            ) {
                if (
                    parsed.user &&
                    typeof parsed.user ===
                        "object"
                ) {
                    return parsed.user;
                }

                if (
                    parsed.currentUser &&
                    typeof parsed.currentUser ===
                        "object"
                ) {
                    return parsed.currentUser;
                }

                return parsed;
            }
        } catch (error) {
            console.warn(
                `Unable to read session auth key ${key}:`,
                error
            );
        }
    }

    return null;
};

// ============================================================
// NORMALIZATION
// ============================================================

const normalizeId = (
    value
) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
};

const normalizeText = (
    value
) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase();
};

const sameId = (
    first,
    second
) => {
    const a =
        normalizeId(first);

    const b =
        normalizeId(second);

    return (
        a !== "" &&
        b !== "" &&
        a === b
    );
};

// ============================================================
// GENERIC ID
// ============================================================

const getId = (
    item
) => {
    if (!item) {
        return "";
    }

    return (
        item.id ??
        item._id ??
        item.projectId ??
        item.projectID ??
        item.sprintId ??
        item.sprintID ??
        item.taskId ??
        item.taskID ??
        item.riskId ??
        item.riskID ??
        item.issueId ??
        item.issueID ??
        item.milestoneId ??
        item.milestoneID ??
        ""
    );
};

// ============================================================
// PROJECT ID
// ============================================================

const getProjectId = (
    item
) => {
    if (!item) {
        return "";
    }

    return (
        item.projectId ??
        item.projectID ??
        item.project_id ??
        item.project?.id ??
        item.project?._id ??
        item.project?.projectId ??
        item.project?.projectID ??
        ""
    );
};

// ============================================================
// CURRENT USER IDS
// ============================================================

const getUserIds = (
    user
) => {
    if (!user) {
        return [];
    }

    const values = [
        user.id,
        user._id,
        user.userId,
        user.userID,
        user.managerId,
        user.managerID,
        user.employeeId,
        user.employeeID,
    ];

    return [
        ...new Set(
            values
                .filter(
                    (value) =>
                        normalizeId(
                            value
                        ) !== ""
                )
                .map(
                    normalizeId
                )
        ),
    ];
};

// ============================================================
// CURRENT USER EMAILS
// ============================================================

const getUserEmails = (
    user
) => {
    if (!user) {
        return [];
    }

    const values = [
        user.email,
        user.userEmail,
        user.managerEmail,
        user.emailAddress,
    ];

    return [
        ...new Set(
            values
                .filter(
                    (value) =>
                        normalizeText(
                            value
                        ) !== ""
                )
                .map(
                    normalizeText
                )
        ),
    ];
};

// ============================================================
// CURRENT USER NAMES
// ============================================================

const getUserNames = (
    user
) => {
    if (!user) {
        return [];
    }

    const values = [
        user.name,
        user.fullName,
        user.username,
        user.userName,
        user.displayName,
    ];

    return [
        ...new Set(
            values
                .filter(
                    (value) =>
                        normalizeText(
                            value
                        ) !== ""
                )
                .map(
                    normalizeText
                )
        ),
    ];
};

// ============================================================
// ROLE
// ============================================================

const isManager = (
    user
) => {
    const role =
        normalizeText(
            user?.role ??
                user?.userRole ??
                user?.accountRole
        );

    return (
        role === "manager" ||
        role ===
            "project manager" ||
        role ===
            "project_manager" ||
        role ===
            "project-manager"
    );
};

// ============================================================
// COLLECT MANAGER IDS
// ============================================================

const collectManagerIds = (
    project
) => {
    const ids = [];

    const add = (
        value
    ) => {
        if (
            value === null ||
            value === undefined
        ) {
            return;
        }

        if (
            typeof value ===
            "object"
        ) {
            add(value.id);
            add(value._id);
            add(value.userId);
            add(value.userID);
            add(value.managerId);
            add(value.managerID);
            add(
                value.projectManagerId
            );
            add(
                value.projectManagerID
            );
            return;
        }

        const id =
            normalizeId(value);

        if (id) {
            ids.push(id);
        }
    };

    add(
        project?.managerId
    );

    add(
        project?.managerID
    );

    add(
        project?.assignedManagerId
    );

    add(
        project?.assignedManagerID
    );

    add(
        project?.projectManagerId
    );

    add(
        project?.projectManagerID
    );

    add(
        project?.manager
    );

    add(
        project?.projectManager
    );

    add(
        project?.assignedManager
    );

    if (
        Array.isArray(
            project?.managerIds
        )
    ) {
        project.managerIds.forEach(
            add
        );
    }

    if (
        Array.isArray(
            project?.managerIDs
        )
    ) {
        project.managerIDs.forEach(
            add
        );
    }

    if (
        Array.isArray(
            project?.assignedManagerIds
        )
    ) {
        project.assignedManagerIds.forEach(
            add
        );
    }

    if (
        Array.isArray(
            project?.projectManagerIds
        )
    ) {
        project.projectManagerIds.forEach(
            add
        );
    }

    return [
        ...new Set(ids),
    ];
};

// ============================================================
// COLLECT MANAGER EMAILS
// ============================================================

const collectManagerEmails = (
    project
) => {
    const emails = [];

    const add = (
        value
    ) => {
        if (
            value === null ||
            value === undefined
        ) {
            return;
        }

        if (
            typeof value ===
            "object"
        ) {
            add(value.email);
            add(value.userEmail);
            add(value.managerEmail);
            return;
        }

        const email =
            normalizeText(value);

        if (
            email &&
            email.includes("@")
        ) {
            emails.push(
                email
            );
        }
    };

    add(
        project?.managerEmail
    );

    add(
        project?.manager?.email
    );

    add(
        project?.projectManager?.email
    );

    add(
        project?.assignedManager?.email
    );

    if (
        Array.isArray(
            project?.managerEmails
        )
    ) {
        project.managerEmails.forEach(
            add
        );
    }

    if (
        Array.isArray(
            project?.projectManagerEmails
        )
    ) {
        project.projectManagerEmails.forEach(
            add
        );
    }

    if (
        Array.isArray(
            project?.assignedManagerEmails
        )
    ) {
        project.assignedManagerEmails.forEach(
            add
        );
    }

    return [
        ...new Set(emails),
    ];
};

// ============================================================
// COLLECT MANAGER NAMES
// ============================================================

const collectManagerNames = (
    project
) => {
    const names = [];

    const add = (
        value
    ) => {
        if (
            value === null ||
            value === undefined
        ) {
            return;
        }

        if (
            typeof value ===
            "object"
        ) {
            add(value.name);
            add(value.fullName);
            add(value.username);
            add(value.userName);
            add(value.displayName);
            return;
        }

        const name =
            normalizeText(value);

        if (
            name &&
            !name.includes("@")
        ) {
            names.push(name);
        }
    };

    add(
        project?.manager
    );

    add(
        project?.projectManager
    );

    add(
        project?.assignedManager
    );

    add(
        project?.managerName
    );

    add(
        project?.managerFullName
    );

    add(
        project?.projectManagerName
    );

    add(
        project?.projectManagerFullName
    );

    add(
        project?.assignedManagerName
    );

    return [
        ...new Set(names),
    ];
};

// ============================================================
// PROJECT AUTHORIZATION
// ============================================================

const projectBelongsToManager = (
    project,
    currentUser
) => {
    if (
        !project ||
        !currentUser
    ) {
        return false;
    }

    const userIds =
        getUserIds(
            currentUser
        );

    const userEmails =
        getUserEmails(
            currentUser
        );

    const userNames =
        getUserNames(
            currentUser
        );

    const managerIds =
        collectManagerIds(
            project
        );

    const managerEmails =
        collectManagerEmails(
            project
        );

    const managerNames =
        collectManagerNames(
            project
        );

    // ID authorization
    if (
        userIds.some(
            (userId) =>
                managerIds.some(
                    (managerId) =>
                        sameId(
                            userId,
                            managerId
                        )
                )
        )
    ) {
        return true;
    }

    // Email authorization
    if (
        userEmails.some(
            (userEmail) =>
                managerEmails.includes(
                    userEmail
                )
        )
    ) {
        return true;
    }

    // Name authorization
    if (
        userNames.some(
            (userName) =>
                managerNames.includes(
                    userName
                )
        )
    ) {
        return true;
    }

    return false;
};

// ============================================================
// AUTHENTICATION VALIDATION
// ============================================================

const requireManager = () => {
    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        throw new Error(
            "AUTHENTICATION_REQUIRED"
        );
    }

    if (
        !isManager(
            currentUser
        )
    ) {
        throw new Error(
            "ACCESS_DENIED"
        );
    }

    return currentUser;
};

// ============================================================
// AUTHORIZED PROJECTS
// ============================================================

export const getAuthorizedManagerProjects =
    async () => {
        try {
            const currentUser =
                requireManager();

            const projects =
                readStorage(
                    PROJECTS_KEY,
                    []
                );

            const authorizedProjects =
                projects.filter(
                    (project) =>
                        projectBelongsToManager(
                            project,
                            currentUser
                        )
                );

            console.log(
                "[REPORTS] Current Manager:",
                currentUser
            );

            console.log(
                "[REPORTS] Total projects:",
                projects.length
            );

            console.log(
                "[REPORTS] Authorized projects:",
                authorizedProjects.length
            );

            return {
                success: true,
                data:
                    authorizedProjects,
            };
        } catch (error) {
            console.error(
                "Failed to load manager projects:",
                error
            );

            return {
                success: false,
                error:
                    error?.message ||
                    "Unable to load authorized projects.",
                data: [],
            };
        }
    };

// ============================================================
// GET AUTHORIZED PROJECT
// ============================================================

const getAuthorizedProject = (
    projectId
) => {
    const currentUser =
        requireManager();

    const projects =
        readStorage(
            PROJECTS_KEY,
            []
        );

    const project =
        projects.find(
            (item) =>
                sameId(
                    getId(item),
                    projectId
                )
        );

    if (!project) {
        throw new Error(
            "PROJECT_NOT_FOUND"
        );
    }

    if (
        !projectBelongsToManager(
            project,
            currentUser
        )
    ) {
        throw new Error(
            "ACCESS_DENIED"
        );
    }

    return {
        project,
        currentUser,
    };
};

// ============================================================
// REPORT-001
// PROJECT DASHBOARD
// ============================================================

export const getProjectDashboard =
    async (
        projectId
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    data: null,
                };
            }

            const {
                project,
            } =
                getAuthorizedProject(
                    projectId
                );

            const sprints =
                readStorage(
                    SPRINTS_KEY,
                    []
                ).filter(
                    (sprint) =>
                        sameId(
                            getProjectId(
                                sprint
                            ),
                            projectId
                        )
                );

            const tasks =
                readStorage(
                    TASKS_KEY,
                    []
                ).filter(
                    (task) =>
                        sameId(
                            getProjectId(
                                task
                            ),
                            projectId
                        )
                );

            const totalTasks =
                tasks.length;

            const completedTasks =
                tasks.filter(
                    (task) => {
                        const status =
                            normalizeText(
                                task?.status
                            );

                        return (
                            status.includes(
                                "complete"
                            ) ||
                            status.includes(
                                "done"
                            )
                        );
                    }
                ).length;

            const inProgressTasks =
                tasks.filter(
                    (task) => {
                        const status =
                            normalizeText(
                                task?.status
                            );

                        return (
                            status.includes(
                                "progress"
                            ) ||
                            status.includes(
                                "active"
                            )
                        );
                    }
                ).length;

            const pendingTasks =
                tasks.filter(
                    (task) => {
                        const status =
                            normalizeText(
                                task?.status
                            );

                        return (
                            status.includes(
                                "pending"
                            ) ||
                            status ===
                                "todo" ||
                            status ===
                                "to do"
                        );
                    }
                ).length;

            const now =
                new Date();

            const overdueTasks =
                tasks.filter(
                    (task) => {
                        const dueDate =
                            task?.dueDate ??
                            task?.deadline ??
                            task?.endDate;

                        if (!dueDate) {
                            return false;
                        }

                        const date =
                            new Date(
                                dueDate
                            );

                        if (
                            Number.isNaN(
                                date.getTime()
                            )
                        ) {
                            return false;
                        }

                        const status =
                            normalizeText(
                                task?.status
                            );

                        const completed =
                            status.includes(
                                "complete"
                            ) ||
                            status.includes(
                                "done"
                            );

                        return (
                            date < now &&
                            !completed
                        );
                    }
                );

            const blockedTasks =
                tasks.filter(
                    (task) => {
                        const status =
                            normalizeText(
                                task?.status
                            );

                        return (
                            status.includes(
                                "blocked"
                            ) ||
                            task?.isBlocked ===
                                true
                        );
                    }
                );

            const activeSprint =
                sprints.find(
                    (sprint) => {
                        const status =
                            normalizeText(
                                sprint?.status
                            );

                        return (
                            status.includes(
                                "active"
                            ) ||
                            status.includes(
                                "progress"
                            ) ||
                            status.includes(
                                "ongoing"
                            )
                        );
                    }
                ) ?? null;

            const overallProgress =
                totalTasks > 0
                    ? Math.round(
                          (completedTasks /
                              totalTasks) *
                              100
                      )
                    : null;

            let sprintProgress =
                null;

            if (
                activeSprint
            ) {
                const sprintId =
                    getId(
                        activeSprint
                    );

                const sprintTasks =
                    tasks.filter(
                        (task) =>
                            sameId(
                                task?.sprintId ??
                                    task?.sprintID ??
                                    task?.sprint?.id ??
                                    task?.sprint?._id,
                                sprintId
                            )
                    );

                const completed =
                    sprintTasks.filter(
                        (task) => {
                            const status =
                                normalizeText(
                                    task?.status
                                );

                            return (
                                status.includes(
                                    "complete"
                                ) ||
                                status.includes(
                                    "done"
                                )
                            );
                        }
                    ).length;

                if (
                    sprintTasks.length >
                    0
                ) {
                    sprintProgress =
                        Math.round(
                            (completed /
                                sprintTasks.length) *
                                100
                        );
                }
            }

            const upcomingDeadlines =
                tasks
                    .filter(
                        (task) =>
                            task?.dueDate ||
                            task?.deadline ||
                            task?.endDate
                    )
                    .sort(
                        (
                            first,
                            second
                        ) =>
                            new Date(
                                first?.dueDate ??
                                    first?.deadline ??
                                    first?.endDate
                            ) -
                            new Date(
                                second?.dueDate ??
                                    second?.deadline ??
                                    second?.endDate
                            )
                    )
                    .slice(
                        0,
                        10
                    );

            return {
                success: true,

                data: {
                    project,

                    overallProgress,

                    projectProgress:
                        overallProgress,

                    progress:
                        overallProgress,

                    activeSprint,

                    sprintProgress,

                    taskStatistics: {
                        total:
                            totalTasks,

                        completed:
                            completedTasks,

                        inProgress:
                            inProgressTasks,

                        pending:
                            pendingTasks,

                        overdue:
                            overdueTasks,

                        blocked:
                            blockedTasks,
                    },

                    overdueTasks,

                    blockedTasks,

                    upcomingDeadlines,

                    projectActivity:
                        [],

                    teamProgress:
                        null,

                    teamLeaderProgress:
                        null,

                    teamWorkload:
                        null,
                },
            };
        } catch (error) {
            console.error(
                "getProjectDashboard:",
                error
            );

            return {
                success: false,
                error:
                    error?.message ||
                    "Unable to load project dashboard.",
                data: null,
            };
        }
    };

// ============================================================
// REPORT-002
// PROJECT TIMELINE
// ============================================================

export const getProjectTimeline =
    async (
        projectId
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    data: null,
                };
            }

            const {
                project,
            } =
                getAuthorizedProject(
                    projectId
                );

            const sprints =
                readStorage(
                    SPRINTS_KEY,
                    []
                ).filter(
                    (sprint) =>
                        sameId(
                            getProjectId(
                                sprint
                            ),
                            projectId
                        )
                );

            const milestones =
                readStorage(
                    MILESTONES_KEY,
                    []
                ).filter(
                    (milestone) =>
                        sameId(
                            getProjectId(
                                milestone
                            ),
                            projectId
                        )
                );

            const tasks =
                readStorage(
                    TASKS_KEY,
                    []
                ).filter(
                    (task) =>
                        sameId(
                            getProjectId(
                                task
                            ),
                            projectId
                        )
                );

            const totalTasks =
                tasks.length;

            const completedTasks =
                tasks.filter(
                    (task) => {
                        const status =
                            normalizeText(
                                task?.status
                            );

                        return (
                            status.includes(
                                "complete"
                            ) ||
                            status.includes(
                                "done"
                            )
                        );
                    }
                ).length;

            const currentProgress =
                totalTasks > 0
                    ? Math.round(
                          (completedTasks /
                              totalTasks) *
                              100
                      )
                    : null;

            const now =
                new Date();

            const timelineItems = [
                ...milestones.map(
                    (item) => ({
                        ...item,
                        timelineType:
                            "Milestone",
                        timelineDate:
                            item?.deadline ??
                            item?.dueDate ??
                            item?.endDate,
                    })
                ),

                ...sprints.map(
                    (item) => ({
                        ...item,
                        timelineType:
                            "Sprint",
                        timelineDate:
                            item?.endDate ??
                            item?.deadline,
                    })
                ),

                ...tasks.map(
                    (item) => ({
                        ...item,
                        timelineType:
                            "Task",
                        timelineDate:
                            item?.dueDate ??
                            item?.deadline ??
                            item?.endDate,
                    })
                ),
            ];

            const overdueItems =
                timelineItems.filter(
                    (item) => {
                        if (
                            !item.timelineDate
                        ) {
                            return false;
                        }

                        const date =
                            new Date(
                                item.timelineDate
                            );

                        if (
                            Number.isNaN(
                                date.getTime()
                            )
                        ) {
                            return false;
                        }

                        const status =
                            normalizeText(
                                item?.status
                            );

                        const completed =
                            status.includes(
                                "complete"
                            ) ||
                            status.includes(
                                "done"
                            );

                        return (
                            date < now &&
                            !completed
                        );
                    }
                );

            return {
                success: true,

                data: {
                    project,

                    projectStartDate:
                        project?.startDate ??
                        project?.startAt ??
                        project?.start_date ??
                        null,

                    projectDeadline:
                        project?.endDate ??
                        project?.deadline ??
                        project?.dueDate ??
                        project?.end_date ??
                        null,

                    milestones,

                    sprints,

                    currentProgress,

                    overdueItems,

                    timelineItems,
                },
            };
        } catch (error) {
            console.error(
                "getProjectTimeline:",
                error
            );

            return {
                success: false,
                error:
                    error?.message ||
                    "Unable to load project timeline.",
                data: null,
            };
        }
    };

// ============================================================
// REPORT-003
// RISKS AND ISSUES
// ============================================================

export const getProjectRisksAndIssues =
    async (
        projectId
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    data: [],
                };
            }

            getAuthorizedProject(
                projectId
            );

            const risks =
                readStorage(
                    RISKS_KEY,
                    []
                );

            const issues =
                readStorage(
                    ISSUES_KEY,
                    []
                );

            const projectRisks =
                risks
                    .filter(
                        (risk) =>
                            sameId(
                                getProjectId(
                                    risk
                                ),
                                projectId
                            )
                    )
                    .map(
                        (risk) => ({
                            ...risk,
                            type:
                                risk?.type ??
                                "Risk",
                        })
                    );

            const projectIssues =
                issues
                    .filter(
                        (issue) =>
                            sameId(
                                getProjectId(
                                    issue
                                ),
                                projectId
                            )
                    )
                    .map(
                        (issue) => ({
                            ...issue,
                            type:
                                issue?.type ??
                                "Issue",
                        })
                    );

            return {
                success: true,

                data: [
                    ...projectRisks,
                    ...projectIssues,
                ],

                risks:
                    projectRisks,

                issues:
                    projectIssues,
            };
        } catch (error) {
            console.error(
                "getProjectRisksAndIssues:",
                error
            );

            return {
                success: false,
                error:
                    error?.message ||
                    "Unable to load project risks and issues.",
                data: [],
            };
        }
    };

// ============================================================
// ALIASES
// ============================================================

export const getProjectRiskIssues =
    getProjectRisksAndIssues;

export const getRisksAndIssues =
    getProjectRisksAndIssues;

// ============================================================
// DEBUG FUNCTION
// ============================================================

export const debugProjectReportAuth =
    () => {
        const currentUser =
            getCurrentUser();

        const projects =
            readStorage(
                PROJECTS_KEY,
                []
            );

        const result =
            projects.map(
                (project) => ({
                    id:
                        getId(
                            project
                        ),

                    name:
                        project?.name ??
                        project?.title ??
                        project?.projectName ??
                        "Unnamed project",

                    managerId:
                        project?.managerId,

                    assignedManagerId:
                        project?.assignedManagerId,

                    projectManagerId:
                        project?.projectManagerId,

                    managerEmail:
                        project?.managerEmail,

                    manager:
                        project?.manager,

                    projectManager:
                        project?.projectManager,

                    authorized:
                        projectBelongsToManager(
                            project,
                            currentUser
                        ),
                })
            );

        console.log(
            "========== AIPMS REPORT AUTH DEBUG =========="
        );

        console.log(
            "Current user:",
            currentUser
        );

        console.log(
            "Current user IDs:",
            getUserIds(
                currentUser
            )
        );

        console.log(
            "Current user emails:",
            getUserEmails(
                currentUser
            )
        );

        console.log(
            "All projects:",
            projects
        );

        console.table(
            result
        );

        console.log(
            "Authorized projects:",
            result.filter(
                (item) =>
                    item.authorized
            )
        );

        console.log(
            "=============================================="
        );

        return {
            currentUser,

            totalProjects:
                projects.length,

            authorizedProjects:
                result.filter(
                    (item) =>
                        item.authorized
                ),

            projects:
                result,
        };
    };

// ============================================================
// BROWSER DEBUG
// ============================================================

if (
    typeof window !==
    "undefined"
) {
    window.debugAipmsProjectReports =
        debugProjectReportAuth;
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getAuthorizedManagerProjects,

    getProjectDashboard,

    getProjectTimeline,

    getProjectRisksAndIssues,

    getProjectRiskIssues,

    getRisksAndIssues,

    debugProjectReportAuth,
};

