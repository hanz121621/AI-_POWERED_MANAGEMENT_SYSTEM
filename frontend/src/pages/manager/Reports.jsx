// ============================================================
// PROJECT REPORT SERVICE
//
// REPORT-001 — View Project Dashboard
// REPORT-002 — View Project Timeline
// REPORT-003 — View Risk and Issues
// REPORT-004 — View Sprint Progress
//
// IMPORTANT
// ------------------------------------------------------------
// This service DOES NOT use:
//   - localStorage
//   - sessionStorage
//   - hard-coded projects
//   - hard-coded sprints
//   - hard-coded tasks
//   - hard-coded users
//
// All report information comes from the backend API.
//
// Authorization must be enforced by the backend.
// The frontend only sends the authenticated request.
// ============================================================

// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5043";

// ============================================================
// API ERROR
// ============================================================

class ReportApiError extends Error {
    constructor(
        message,
        status = null,
        code = null,
        details = null
    ) {
        super(message);

        this.name = "ReportApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

// ============================================================
// URL HELPER
// ============================================================

const buildUrl = (
    endpoint
) => {
    const base =
        API_BASE_URL.replace(
            /\/$/,
            ""
        );

    const path =
        endpoint.startsWith("/")
            ? endpoint
            : `/${endpoint}`;

    return `${base}${path}`;
};

// ============================================================
// RESPONSE PARSER
// ============================================================

const parseResponse = async (
    response
) => {
    const contentType =
        response.headers.get(
            "content-type"
        ) || "";

    let body = null;

    try {
        if (
            contentType.includes(
                "application/json"
            )
        ) {
            body =
                await response.json();
        } else {
            const text =
                await response.text();

            body =
                text
                    ? text
                    : null;
        }
    } catch {
        body = null;
    }

    if (!response.ok) {
        const errorCode =
            body?.code ??
            body?.errorCode ??
            body?.error ??
            body?.title ??
            `HTTP_${response.status}`;

        const message =
            body?.message ??
            body?.detail ??
            body?.title ??
            (
                typeof body ===
                "string"
                    ? body
                    : "Unable to load report data."
            );

        throw new ReportApiError(
            message,
            response.status,
            errorCode,
            body
        );
    }

    return body;
};

// ============================================================
// API REQUEST
// ============================================================
//
// accessToken is intentionally supplied by the caller.
// This service does NOT read the token from localStorage.
//
// Example:
//
// const token = authContext.accessToken;
//
// getAuthorizedManagerProjects(token);
//
// ============================================================

const apiRequest = async (
    endpoint,
    {
        accessToken = null,
        method = "GET",
        body = undefined,
        signal = undefined,
    } = {}
) => {
    const headers = {
        Accept:
            "application/json",
    };

    if (body !== undefined) {
        headers[
            "Content-Type"
        ] =
            "application/json";
    }

    if (
        accessToken &&
        typeof accessToken ===
            "string"
    ) {
        headers.Authorization =
            `Bearer ${accessToken}`;
    }

    const response =
        await fetch(
            buildUrl(
                endpoint
            ),
            {
                method,
                headers,
                credentials:
                    "include",
                body:
                    body !==
                    undefined
                        ? JSON.stringify(
                              body
                          )
                        : undefined,
                signal,
            }
        );

    return parseResponse(
        response
    );
};

// ============================================================
// API DATA EXTRACTION
// ============================================================
//
// Supports common ASP.NET response formats:
//
// {
//   success: true,
//   data: {...}
// }
//
// or:
//
// {
//   data: {...}
// }
//
// or:
//
// [...]
// ============================================================

const extractData = (
    response
) => {
    if (
        response ===
        null ||
        response ===
            undefined
    ) {
        return null;
    }

    if (
        Object.prototype.hasOwnProperty.call(
            response,
            "data"
        )
    ) {
        return response.data;
    }

    return response;
};

// ============================================================
// ARRAY EXTRACTION
// ============================================================

const extractArray = (
    response,
    possibleKeys = []
) => {
    const data =
        extractData(
            response
        );

    if (
        Array.isArray(data)
    ) {
        return data;
    }

    if (
        data &&
        typeof data ===
            "object"
    ) {
        for (
            const key of possibleKeys
        ) {
            if (
                Array.isArray(
                    data[key]
                )
            ) {
                return data[key];
            }
        }
    }

    return [];
};

// ============================================================
// DATE HELPERS
// ============================================================

const getDateValue = (
    item,
    fields
) => {
    if (!item) {
        return null;
    }

    for (
        const field of fields
    ) {
        if (
            item[field] !==
                null &&
            item[field] !==
                undefined &&
            item[field] !==
                ""
        ) {
            return item[field];
        }
    }

    return null;
};

// ============================================================
// STATUS HELPERS
// ============================================================
//
// IMPORTANT:
// These functions DO NOT create task statuses.
//
// They only interpret the status returned by the backend.
//
// For REPORT-004, the preferred implementation is that
// the backend already returns task statistics.
//
// If raw tasks are returned, these helpers provide a
// defensive frontend calculation without inventing records.
// ============================================================

const normalizeStatus = (
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

const isCompletedStatus = (
    status
) => {
    const value =
        normalizeStatus(
            status
        );

    return (
        value.includes(
            "complete"
        ) ||
        value === "done"
    );
};

const isInProgressStatus = (
    status
) => {
    const value =
        normalizeStatus(
            status
        );

    return (
        value.includes(
            "progress"
        ) ||
        value === "active"
    );
};

const isPendingStatus = (
    status
) => {
    const value =
        normalizeStatus(
            status
        );

    return (
        value.includes(
            "pending"
        ) ||
        value === "todo" ||
        value === "to do"
    );
};

const isBlockedStatus = (
    status
) => {
    const value =
        normalizeStatus(
            status
        );

    return value.includes(
        "blocked"
    );
};

// ============================================================
// COMPLETION PERCENTAGE
// ============================================================

const calculateCompletionPercentage =
    (
        totalTasks,
        completedTasks
    ) => {
        const total =
            Number(
                totalTasks
            ) || 0;

        const completed =
            Number(
                completedTasks
            ) || 0;

        if (total <= 0) {
            return 0;
        }

        return Math.round(
            Math.min(
                Math.max(
                    completed /
                        total *
                        100,
                    0
                ),
                100
            )
        );
    };

// ============================================================
// SPRINT TASK STATISTICS
// ============================================================
//
// Used only when the backend returns actual tasks rather
// than pre-calculated statistics.
//
// No task is created or hard-coded here.
// ============================================================

const calculateTaskStatistics = (
    tasks = []
) => {
    if (
        !Array.isArray(tasks)
    ) {
        return {
            total: 0,
            completed: 0,
            inProgress: 0,
            pending: 0,
            blocked: 0,
            overdue: 0,
        };
    }

    const now =
        new Date();

    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let blocked = 0;
    let overdue = 0;

    tasks.forEach(
        (task) => {
            const status =
                task?.status ??
                task?.taskStatus ??
                task?.statusName;

            if (
                isCompletedStatus(
                    status
                )
            ) {
                completed += 1;
            }

            if (
                isInProgressStatus(
                    status
                )
            ) {
                inProgress += 1;
            }

            if (
                isPendingStatus(
                    status
                )
            ) {
                pending += 1;
            }

            if (
                isBlockedStatus(
                    status
                ) ||
                task?.isBlocked ===
                    true
            ) {
                blocked += 1;
            }

            const dueDate =
                getDateValue(
                    task,
                    [
                        "dueDate",
                        "deadline",
                        "endDate",
                    ]
                );

            if (dueDate) {
                const date =
                    new Date(
                        dueDate
                    );

                if (
                    !Number.isNaN(
                        date.getTime()
                    ) &&
                    date < now &&
                    !isCompletedStatus(
                        status
                    )
                ) {
                    overdue += 1;
                }
            }
        }
    );

    return {
        total:
            tasks.length,

        completed,

        inProgress,

        pending,

        blocked,

        overdue,
    };
};

// ============================================================
// NORMALIZE SPRINT PROGRESS RESPONSE
// ============================================================
//
// The backend should ideally return something similar to:
//
// {
//   sprint,
//   totalTasks,
//   completedTasks,
//   inProgressTasks,
//   pendingTasks,
//   blockedTasks,
//   overdueTasks,
//   completionPercentage
// }
//
// This function accepts several reasonable backend shapes
// without creating any fake data.
// ============================================================

const normalizeSprintProgress =
    (
        response
    ) => {
        const data =
            extractData(
                response
            );

        if (
            !data ||
            typeof data !==
                "object"
        ) {
            return {
                sprint: null,
                tasks: [],
                taskStatistics:
                    calculateTaskStatistics(
                        []
                    ),
                completionPercentage: 0,
            };
        }

        const sprint =
            data.sprint ??
            data.sprintDetails ??
            data;

        const tasks =
            Array.isArray(
                data.tasks
            )
                ? data.tasks
                : Array.isArray(
                      data.items
                  )
                ? data.items
                : [];

        const rawStatistics =
            data.taskStatistics ??
            data.statistics ??
            data.taskStats ??
            null;

        const calculated =
            calculateTaskStatistics(
                tasks
            );

        const totalTasks =
            rawStatistics?.total ??
            rawStatistics?.totalTasks ??
            data.totalTasks ??
            calculated.total;

        const completedTasks =
            rawStatistics?.completed ??
            rawStatistics?.completedTasks ??
            data.completedTasks ??
            calculated.completed;

        const inProgressTasks =
            rawStatistics?.inProgress ??
            rawStatistics?.inProgressTasks ??
            data.inProgressTasks ??
            calculated.inProgress;

        const pendingTasks =
            rawStatistics?.pending ??
            rawStatistics?.pendingTasks ??
            data.pendingTasks ??
            calculated.pending;

        const blockedTasks =
            rawStatistics?.blocked ??
            rawStatistics?.blockedTasks ??
            data.blockedTasks ??
            calculated.blocked;

        const overdueTasks =
            rawStatistics?.overdue ??
            rawStatistics?.overdueTasks ??
            data.overdueTasks ??
            calculated.overdue;

        const completionPercentage =
            data.completionPercentage ??
            data.completionPercent ??
            data.progressPercentage ??
            data.progress ??
            calculateCompletionPercentage(
                totalTasks,
                completedTasks
            );

        return {
            ...data,

            sprint,

            tasks,

            taskStatistics: {
                total:
                    Number(
                        totalTasks
                    ) || 0,

                completed:
                    Number(
                        completedTasks
                    ) || 0,

                inProgress:
                    Number(
                        inProgressTasks
                    ) || 0,

                pending:
                    Number(
                        pendingTasks
                    ) || 0,

                blocked:
                    Number(
                        blockedTasks
                    ) || 0,

                overdue:
                    Number(
                        overdueTasks
                    ) || 0,
            },

            totalTasks:
                Number(
                    totalTasks
                ) || 0,

            completedTasks:
                Number(
                    completedTasks
                ) || 0,

            inProgressTasks:
                Number(
                    inProgressTasks
                ) || 0,

            pendingTasks:
                Number(
                    pendingTasks
                ) || 0,

            blockedTasks:
                Number(
                    blockedTasks
                ) || 0,

            overdueTasks:
                Number(
                    overdueTasks
                ) || 0,

            completionPercentage:
                Number(
                    completionPercentage
                ) || 0,
        };
    };

// ============================================================
// ERROR RESPONSE
// ============================================================

const errorResponse = (
    error,
    defaultMessage
) => {
    console.error(
        "[ProjectReportService]",
        error
    );

    return {
        success: false,

        error:
            error?.code ??
            error?.message ??
            defaultMessage,

        message:
            error?.message ??
            defaultMessage,

        status:
            error?.status ??
            null,

        data: null,
    };
};

// ============================================================
// REPORT-001
// AUTHORIZED MANAGER PROJECTS
// ============================================================
//
// Backend responsibility:
//   - Authenticate current user
//   - Verify Manager role
//   - Return only projects assigned to that Manager
//
// No frontend authorization based on localStorage.
// ============================================================

export const getAuthorizedManagerProjects =
    async (
        accessToken = null,
        signal = undefined
    ) => {
        try {
            const response =
                await apiRequest(
                    "/api/reports/projects/manager",
                    {
                        accessToken,
                        signal,
                    }
                );

            const projects =
                extractArray(
                    response,
                    [
                        "projects",
                        "items",
                        "records",
                    ]
                );

            return {
                success: true,

                data:
                    projects,

                projects,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load manager projects."
            );
        }
    };

// ============================================================
// GET PROJECT DASHBOARD
// REPORT-001
// ============================================================

export const getProjectDashboard =
    async (
        projectId,
        accessToken = null,
        signal = undefined
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    message:
                        "Project ID is required.",
                    data: null,
                };
            }

            const response =
                await apiRequest(
                    `/api/reports/projects/${encodeURIComponent(
                        projectId
                    )}/dashboard`,
                    {
                        accessToken,
                        signal,
                    }
                );

            const data =
                extractData(
                    response
                );

            return {
                success: true,
                data,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load project dashboard."
            );
        }
    };

// ============================================================
// REPORT-002
// PROJECT TIMELINE
// ============================================================

export const getProjectTimeline =
    async (
        projectId,
        accessToken = null,
        signal = undefined
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    message:
                        "Project ID is required.",
                    data: null,
                };
            }

            const response =
                await apiRequest(
                    `/api/reports/projects/${encodeURIComponent(
                        projectId
                    )}/timeline`,
                    {
                        accessToken,
                        signal,
                    }
                );

            const data =
                extractData(
                    response
                );

            return {
                success: true,
                data,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load project timeline."
            );
        }
    };

// ============================================================
// REPORT-003
// RISKS AND ISSUES
// ============================================================

export const getProjectRisksAndIssues =
    async (
        projectId,
        accessToken = null,
        signal = undefined
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    message:
                        "Project ID is required.",
                    data: [],
                };
            }

            const response =
                await apiRequest(
                    `/api/reports/projects/${encodeURIComponent(
                        projectId
                    )}/risks-issues`,
                    {
                        accessToken,
                        signal,
                    }
                );

            const data =
                extractData(
                    response
                );

            const risks =
                Array.isArray(
                    data?.risks
                )
                    ? data.risks
                    : [];

            const issues =
                Array.isArray(
                    data?.issues
                )
                    ? data.issues
                    : [];

            const combined =
                Array.isArray(
                    data
                )
                    ? data
                    : [
                          ...risks,
                          ...issues,
                      ];

            return {
                success: true,

                data:
                    combined,

                risks,

                issues,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load project risks and issues."
            );
        }
    };

// ============================================================
// REPORT-003 ALIASES
// ============================================================

export const getProjectRiskIssues =
    getProjectRisksAndIssues;

export const getRisksAndIssues =
    getProjectRisksAndIssues;

// ============================================================
// REPORT-004
// GET PROJECT SPRINTS
// ============================================================
//
// The backend must return only sprints belonging to the
// requested project and accessible by the current Manager.
//
// Business Rule:
// Manager can view only Sprints belonging to assigned
// projects.
// ============================================================

export const getProjectSprints =
    async (
        projectId,
        accessToken = null,
        signal = undefined
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    message:
                        "Project ID is required.",
                    data: [],
                };
            }

            const response =
                await apiRequest(
                    `/api/reports/projects/${encodeURIComponent(
                        projectId
                    )}/sprints`,
                    {
                        accessToken,
                        signal,
                    }
                );

            const sprints =
                extractArray(
                    response,
                    [
                        "sprints",
                        "items",
                        "records",
                    ]
                );

            return {
                success: true,

                data:
                    sprints,

                sprints,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load project sprints."
            );
        }
    };

// ============================================================
// REPORT-004
// GET SPRINT PROGRESS
// ============================================================
//
// Main use case:
// View Sprint Progress
//
// Expected backend responsibility:
//
// 1. Verify authenticated Manager
// 2. Verify project exists
// 3. Verify Manager is assigned to project
// 4. Verify sprint belongs to project
// 5. Retrieve actual Sprint
// 6. Retrieve actual Tasks
// 7. Retrieve configured Sprint status
// 8. Retrieve configured Task statuses
// 9. Calculate task statistics
// 10. Return latest data
//
// Expected response can be:
//
// {
//   sprint: {...},
//   tasks: [...],
//   totalTasks: 10,
//   completedTasks: 5,
//   inProgressTasks: 2,
//   pendingTasks: 2,
//   blockedTasks: 1,
//   overdueTasks: 0,
//   completionPercentage: 50
// }
// ============================================================

export const getSprintProgress =
    async (
        projectId,
        sprintId,
        accessToken = null,
        signal = undefined
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    message:
                        "Project ID is required.",
                    data: null,
                };
            }

            if (!sprintId) {
                return {
                    success: false,
                    error:
                        "SPRINT_ID_REQUIRED",
                    message:
                        "Sprint ID is required.",
                    data: null,
                };
            }

            const response =
                await apiRequest(
                    `/api/reports/projects/${encodeURIComponent(
                        projectId
                    )}/sprints/${encodeURIComponent(
                        sprintId
                    )}/progress`,
                    {
                        accessToken,
                        signal,
                    }
                );

            const data =
                normalizeSprintProgress(
                    response
                );

            return {
                success: true,

                data,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load sprint progress."
            );
        }
    };

// ============================================================
// REPORT-004
// GET SPRINT PROGRESS BY SPRINT ID
// ============================================================
//
// Convenience function for pages where the selected
// project is already known but only sprintId is available.
//
// NOTE:
// Prefer getSprintProgress(projectId, sprintId)
// because the project boundary is part of the authorization
// contract.
// ============================================================

export const getSprintProgressById =
    async (
        sprintId,
        accessToken = null,
        signal = undefined
    ) => {
        try {
            if (!sprintId) {
                return {
                    success: false,
                    error:
                        "SPRINT_ID_REQUIRED",
                    message:
                        "Sprint ID is required.",
                    data: null,
                };
            }

            const response =
                await apiRequest(
                    `/api/reports/sprints/${encodeURIComponent(
                        sprintId
                    )}/progress`,
                    {
                        accessToken,
                        signal,
                    }
                );

            const data =
                normalizeSprintProgress(
                    response
                );

            return {
                success: true,
                data,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load sprint progress."
            );
        }
    };

// ============================================================
// REPORT-004
// GET SPRINT TASKS
// ============================================================
//
// Useful when the Sprint Progress page needs to display the
// individual tasks underneath the statistics.
//
// The API must return actual Sprint tasks.
// ============================================================

export const getSprintTasks =
    async (
        projectId,
        sprintId,
        accessToken = null,
        signal = undefined
    ) => {
        try {
            if (!projectId) {
                return {
                    success: false,
                    error:
                        "PROJECT_ID_REQUIRED",
                    message:
                        "Project ID is required.",
                    data: [],
                };
            }

            if (!sprintId) {
                return {
                    success: false,
                    error:
                        "SPRINT_ID_REQUIRED",
                    message:
                        "Sprint ID is required.",
                    data: [],
                };
            }

            const response =
                await apiRequest(
                    `/api/reports/projects/${encodeURIComponent(
                        projectId
                    )}/sprints/${encodeURIComponent(
                        sprintId
                    )}/tasks`,
                    {
                        accessToken,
                        signal,
                    }
                );

            const tasks =
                extractArray(
                    response,
                    [
                        "tasks",
                        "items",
                        "records",
                    ]
                );

            return {
                success: true,

                data:
                    tasks,

                tasks,

                taskStatistics:
                    calculateTaskStatistics(
                        tasks
                    ),
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load sprint tasks."
            );
        }
    };

// ============================================================
// REPORT-004
// GET SPRINT STATUS OPTIONS
// ============================================================
//
// IMPORTANT:
// Status values are NOT hard-coded.
//
// They come from the backend configuration.
//
// This is useful for displaying the configured sprint
// status in filters, badges, or status legends.
// ============================================================

export const getSprintStatusOptions =
    async (
        accessToken = null,
        signal = undefined
    ) => {
        try {
            const response =
                await apiRequest(
                    "/api/reports/sprint-statuses",
                    {
                        accessToken,
                        signal,
                    }
                );

            const statuses =
                extractArray(
                    response,
                    [
                        "statuses",
                        "items",
                        "records",
                    ]
                );

            return {
                success: true,

                data:
                    statuses,

                statuses,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load sprint statuses."
            );
        }
    };

// ============================================================
// REPORT-004
// GET TASK STATUS OPTIONS
// ============================================================
//
// IMPORTANT:
// Task statuses are NOT hard-coded.
//
// The backend supplies the configured statuses.
// ============================================================

export const getTaskStatusOptions =
    async (
        accessToken = null,
        signal = undefined
    ) => {
        try {
            const response =
                await apiRequest(
                    "/api/reports/task-statuses",
                    {
                        accessToken,
                        signal,
                    }
                );

            const statuses =
                extractArray(
                    response,
                    [
                        "statuses",
                        "items",
                        "records",
                    ]
                );

            return {
                success: true,

                data:
                    statuses,

                statuses,
            };
        } catch (error) {
            return errorResponse(
                error,
                "Unable to load task statuses."
            );
        }
    };

// ============================================================
// REPORT-004
// REFRESH SPRINT PROGRESS
// ============================================================
//
// Because the request goes directly to the API every time,
// this always requests the latest available backend data.
//
// No local cache is used.
// ============================================================

export const refreshSprintProgress =
    async (
        projectId,
        sprintId,
        accessToken = null,
        signal = undefined
    ) => {
        return getSprintProgress(
            projectId,
            sprintId,
            accessToken,
            signal
        );
    };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    // REPORT-001
    getAuthorizedManagerProjects,
    getProjectDashboard,

    // REPORT-002
    getProjectTimeline,

    // REPORT-003
    getProjectRisksAndIssues,
    getProjectRiskIssues,
    getRisksAndIssues,

    // REPORT-004
    getProjectSprints,
    getSprintProgress,
    getSprintProgressById,
    getSprintTasks,
    getSprintStatusOptions,
    getTaskStatusOptions,
    refreshSprintProgress,
};