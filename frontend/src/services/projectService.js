
import api from "@/services/api";


export const PROJECT_STATUS_NAMES = {
    Active: "Active",
    Planning: "Planning",
    Completed: "Completed",
    Archived: "Archived",
    Pending: "Pending",
    Approved: "Approved",
    Rejected: "Rejected",
};



function normalizeProject(project) {
    if (!project) {
        return null;
    }

    return {
        ...project,

        // ----------------------------------------------------
        // PROJECT ID
        // ----------------------------------------------------

        id:
            project?.id ??
            project?.projectId ??
            project?.ProjectId,

        projectId:
            project?.projectId ??
            project?.id ??
            project?.ProjectId,

        // ----------------------------------------------------
        // BASIC INFORMATION
        // ----------------------------------------------------

        name:
            project?.name ??
            project?.projectName ??
            "",

        description:
            project?.description ??
            "",

        // ----------------------------------------------------
        // STATUS
        //
        // Backend may return:
        //
        // statusId
        // statusName
        // status
        // ----------------------------------------------------

        statusId:
            project?.statusId ??
            project?.StatusId ??
            null,

        statusName:
            project?.statusName ??
            project?.statusNameDisplay ??
            project?.status ??
            project?.Status ??
            "",

        status:
            project?.status ??
            project?.statusName ??
            project?.Status ??
            "",

        // ----------------------------------------------------
        // MANAGER
        //
        // IMPORTANT:
        // Keep both ID and name.
        // ----------------------------------------------------

        managerId:
            project?.managerId ??
            project?.ManagerId ??
            project?.manager?.id ??
            project?.manager?.userId ??
            null,

        managerName:
            project?.managerName ??
            project?.ManagerName ??
            project?.manager?.fullName ??
            project?.manager?.name ??
            project?.manager ??
            "",

        // ----------------------------------------------------
        // TEAM
        // ----------------------------------------------------

        teamId:
            project?.teamId ??
            project?.TeamId ??
            project?.team?.id ??
            project?.team?.teamId ??
            null,

        teamName:
            project?.teamName ??
            project?.TeamName ??
            project?.team?.name ??
            project?.team ??
            "",

        // ----------------------------------------------------
        // PRIORITY
        // ----------------------------------------------------

        priorityId:
            project?.priorityId ??
            project?.PriorityId ??
            null,

        priorityName:
            project?.priorityName ??
            project?.PriorityName ??
            project?.priority ??
            "",

        // ----------------------------------------------------
        // DATES
        // ----------------------------------------------------

        startDate:
            project?.startDate ??
            project?.StartDate ??
            null,

        deadline:
            project?.deadline ??
            project?.Deadline ??
            null,

        // ----------------------------------------------------
        // OPTIONAL FRONTEND FIELDS
        //
        // These may be supplied by the backend.
        // ----------------------------------------------------

        progress:
            project?.progress ??
            project?.Progress ??
            0,

        tasks:
            project?.tasks ??
            project?.taskCount ??
            project?.Tasks ??
            0,

        activeTasks:
            project?.activeTasks ??
            project?.activeTaskCount ??
            0,

        createdAt:
            project?.createdAt ??
            project?.CreatedAt ??
            null,

        updatedAt:
            project?.updatedAt ??
            project?.UpdatedAt ??
            null,
    };
}

// ============================================================
// NORMALIZE PROJECT LIST
// ============================================================

function normalizeProjectList(data) {
    let projects = [];

    // --------------------------------------------------------
    // Backend returns:
    //
    // [ {...}, {...} ]
    // --------------------------------------------------------

    if (Array.isArray(data)) {
        projects = data;
    }

    // --------------------------------------------------------
    // Possible wrapper:
    //
    // { projects: [...] }
    // --------------------------------------------------------

    else if (
        Array.isArray(data?.projects)
    ) {
        projects = data.projects;
    }

    // --------------------------------------------------------
    // Possible wrapper:
    //
    // { data: [...] }
    // --------------------------------------------------------

    else if (
        Array.isArray(data?.data)
    ) {
        projects = data.data;
    }

    // --------------------------------------------------------
    // Possible wrapper:
    //
    // { items: [...] }
    // --------------------------------------------------------

    else if (
        Array.isArray(data?.items)
    ) {
        projects = data.items;
    }

    return projects
        .map(normalizeProject)
        .filter(Boolean);
}

// ============================================================
// ERROR HELPER
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

    // --------------------------------------------------------
    // 401
    // --------------------------------------------------------

    if (
        response.status === 401
    ) {
        return (
            data?.message ||
            data?.detail ||
            "Unauthorized. Please login again."
        );
    }

    // --------------------------------------------------------
    // 403
    // --------------------------------------------------------

    if (
        response.status === 403
    ) {
        return (
            data?.message ||
            data?.detail ||
            "You do not have permission to perform this action."
        );
    }

    // --------------------------------------------------------
    // 404
    // --------------------------------------------------------

    if (
        response.status === 404
    ) {
        return (
            data?.message ||
            data?.detail ||
            "Project was not found."
        );
    }

    // --------------------------------------------------------
    // Validation errors
    // --------------------------------------------------------

    if (
        data?.errors &&
        typeof data.errors ===
            "object"
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

    // --------------------------------------------------------
    // ProblemDetails
    // --------------------------------------------------------

    if (data?.detail) {
        return data.detail;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.message) {
        return data.message;
    }

    if (
        typeof data ===
        "string"
    ) {
        return data;
    }

    return fallback;
}

// ============================================================
// GET ALL PROJECTS
//
// GET /api/projects
// ============================================================

export async function getProjects() {
    try {
        console.log(
            "========== GET PROJECTS =========="
        );

        console.log(
            "GET:",
            "/projects"
        );

        const response =
            await api.get(
                "/projects"
            );

        console.log(
            "PROJECTS RESPONSE:",
            response.data
        );

        const projects =
            normalizeProjectList(
                response.data
            );

        console.log(
            "NORMALIZED PROJECTS:",
            projects
        );

        console.log(
            "=================================="
        );

        return projects;
    } catch (error) {
        console.error(
            "GET PROJECTS ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load projects."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// GET ACTIVE PROJECTS
//
// GET /api/projects/active
// ============================================================

export async function getActiveProjects() {
    try {
        const response =
            await api.get(
                "/projects/active"
            );

        return normalizeProjectList(
            response.data
        );
    } catch (error) {
        console.error(
            "GET ACTIVE PROJECTS ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load active projects."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// GET ARCHIVED PROJECTS
//
// GET /api/projects/archived
// ============================================================

export async function getArchivedProjects() {
    try {
        const response =
            await api.get(
                "/projects/archived"
            );

        return normalizeProjectList(
            response.data
        );
    } catch (error) {
        console.error(
            "GET ARCHIVED PROJECTS ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load archived projects."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// GET PROJECT BY ID
//
// GET /api/projects/{id}
//
// IMPORTANT:
// This requires the PROJECT UUID.
//
// Do NOT pass the project name.
// ============================================================

export async function getProjectById(
    projectId
) {
    if (!projectId) {
        throw new Error(
            "Project ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/projects/${projectId}`
            );

        return normalizeProject(
            response.data
        );
    } catch (error) {
        console.error(
            "GET PROJECT ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load project."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// CREATE PROJECT
//
// POST /api/projects
//
// Backend request:
//
// {
//     name,
//     description,
//     statusId,
//     managerId,
//     teamId,
//     priorityId,
//     startDate,
//     deadline
// }
//
// IMPORTANT:
// managerId and teamId must be UUIDs.
// ============================================================

export async function createProject(
    projectData
) {
    if (!projectData) {
        return {
            success: false,
            error:
                "Project information is required.",
        };
    }

    try {
        const requestData = {
            name:
                String(
                    projectData.name ||
                        ""
                ).trim(),

            description:
                String(
                    projectData.description ||
                        ""
                ).trim(),

            statusId:
                projectData.statusId ||
                null,

            managerId:
                projectData.managerId ||
                null,

            teamId:
                projectData.teamId ||
                null,

            priorityId:
                projectData.priorityId ??
                null,

            startDate:
                projectData.startDate ||
                null,

            deadline:
                projectData.deadline ||
                null,
        };

        console.log(
            "================================================"
        );

        console.log(
            "CREATE PROJECT BACKEND REQUEST"
        );

        console.log(
            "POST:",
            "/projects"
        );

        console.log(
            "REQUEST DATA:",
            requestData
        );

        console.log(
            "MANAGER ID:",
            requestData.managerId
        );

        console.log(
            "TEAM ID:",
            requestData.teamId
        );

        console.log(
            "================================================"
        );

        const response =
            await api.post(
                "/projects",
                requestData
            );

        console.log(
            "CREATE PROJECT SUCCESS:",
            response.data
        );

        return {
            success: true,

            project:
                normalizeProject(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project created successfully.",
        };
    } catch (error) {
        console.error(
            "================================================"
        );

        console.error(
            "CREATE PROJECT ERROR"
        );

        console.error(
            "STATUS:",
            error?.response?.status
        );

        console.error(
            "REQUEST URL:",
            error?.config?.url
        );

        console.error(
            "REQUEST BODY:",
            error?.config?.data
        );

        console.error(
            "BACKEND RESPONSE:",
            error?.response?.data
        );

        console.error(
            "================================================"
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to create project."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// UPDATE PROJECT
//
// PUT /api/projects/{id}
// ============================================================

export async function updateProject(
    projectId,
    projectData
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!projectData) {
        return {
            success: false,
            error:
                "Project information is required.",
        };
    }

    try {
        const requestData = {
            name:
                projectData.name,

            description:
                projectData.description,

            statusId:
                projectData.statusId ??
                null,

            managerId:
                projectData.managerId ??
                null,

            teamId:
                projectData.teamId ??
                null,

            priorityId:
                projectData.priorityId ??
                null,

            startDate:
                projectData.startDate ??
                null,

            deadline:
                projectData.deadline ??
                null,
        };

        const response =
            await api.put(
                `/projects/${projectId}`,
                requestData
            );

        return {
            success: true,

            project:
                normalizeProject(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE PROJECT ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update project."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// DELETE PROJECT
//
// DELETE /api/projects/{id}
// ============================================================

export async function deleteProject(
    projectId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    try {
        const response =
            await api.delete(
                `/projects/${projectId}`
            );

        return {
            success: true,

            message:
                response.data?.message ||
                "Project deleted successfully.",
        };
    } catch (error) {
        console.error(
            "DELETE PROJECT ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to delete project."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// APPROVE PROJECT
//
// POST /api/projects/{id}/approve
// ============================================================

export async function approveProject(
    projectId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    try {
        const response =
            await api.post(
                `/projects/${projectId}/approve`
            );

        return {
            success: true,

            project:
                normalizeProject(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project approved successfully.",
        };
    } catch (error) {
        console.error(
            "APPROVE PROJECT ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to approve project."
                ),
        };
    }
}

// ============================================================
// REJECT PROJECT
//
// POST /api/projects/{id}/reject
// ============================================================

export async function rejectProject(
    projectId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    try {
        const response =
            await api.post(
                `/projects/${projectId}/reject`
            );

        return {
            success: true,

            project:
                normalizeProject(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project rejected successfully.",
        };
    } catch (error) {
        console.error(
            "REJECT PROJECT ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to reject project."
                ),
        };
    }
}

// ============================================================
// CHANGE PROJECT STATUS
//
// PUT /api/projects/{id}/status
//
// Backend:
//
// {
//     statusId: "UUID"
// }
//
// IMPORTANT:
// The frontend must provide the STATUS UUID.
// ============================================================

export async function changeProjectStatus(
    projectId,
    statusId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!statusId) {
        return {
            success: false,
            error:
                "Status ID is required.",
        };
    }

    try {
        const response =
            await api.put(
                `/projects/${projectId}/status`,
                {
                    statusId,
                }
            );

        return {
            success: true,

            project:
                normalizeProject(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project status updated successfully.",
        };
    } catch (error) {
        console.error(
            "CHANGE PROJECT STATUS ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update project status."
                ),
        };
    }
}

// ============================================================
// ARCHIVE PROJECT
//
// There is NO dedicated:
//
// POST /api/projects/{id}/archive
//
// in the Swagger you provided.
//
// Therefore archive must be done through:
//
// PUT /api/projects/{id}/status
//
// with the backend's Archived status UUID.
//
// ============================================================

export async function archiveProject(
    projectId,
    archivedStatusId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!archivedStatusId) {
        return {
            success: false,
            error:
                "Archived status ID is required.",
        };
    }

    return changeProjectStatus(
        projectId,
        archivedStatusId
    );
}

// ============================================================
// RESTORE PROJECT
//
// Restore is also implemented through the status endpoint.
//
// Pass the backend UUID for the desired active status.
// ============================================================

export async function restoreProject(
    projectId,
    activeStatusId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!activeStatusId) {
        return {
            success: false,
            error:
                "Active status ID is required.",
        };
    }

    return changeProjectStatus(
        projectId,
        activeStatusId
    );
}

// ============================================================
// ASSIGN MANAGER
//
// POST /api/projects/{id}/assign-manager
//
// Body:
//
// {
//     managerId: UUID
// }
// ============================================================

export async function assignProjectManager(
    projectId,
    managerId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!managerId) {
        return {
            success: false,
            error:
                "Manager ID is required.",
        };
    }

    try {
        const response =
            await api.post(
                `/projects/${projectId}/assign-manager`,
                {
                    managerId,
                }
            );

        return {
            success: true,

            project:
                normalizeProject(
                    response.data
                ),

            message:
                response.data?.message ||
                "Manager assigned successfully.",
        };
    } catch (error) {
        console.error(
            "ASSIGN MANAGER ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to assign manager."
                ),
        };
    }
}

// ============================================================
// UPDATE PROJECT MANAGER
//
// PUT /api/projects/{id}/manager
//
// Body:
//
// {
//     managerId: UUID
// }
// ============================================================

export async function updateProjectManager(
    projectId,
    managerId
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!managerId) {
        return {
            success: false,
            error:
                "Manager ID is required.",
        };
    }

    try {
        const response =
            await api.put(
                `/projects/${projectId}/manager`,
                {
                    managerId,
                }
            );

        return {
            success: true,

            project:
                normalizeProject(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project manager updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE PROJECT MANAGER ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update project manager."
                ),
        };
    }
}

// ============================================================
// GET PROJECT MANAGER
//
// GET /api/projects/{id}/manager
// ============================================================

export async function getProjectManager(
    projectId
) {
    if (!projectId) {
        throw new Error(
            "Project ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/projects/${projectId}/manager`
            );

        return response.data;
    } catch (error) {
        console.error(
            "GET PROJECT MANAGER ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load project manager."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// GET PROJECTS BY MANAGER
//
// GET /api/projects/manager/{managerId}
//
// IMPORTANT:
// managerId must be the UUID.
// ============================================================

export async function getProjectsByManager(
    managerId
) {
    if (!managerId) {
        throw new Error(
            "Manager ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/projects/manager/${managerId}`
            );

        return normalizeProjectList(
            response.data
        );
    } catch (error) {
        console.error(
            "GET PROJECTS BY MANAGER ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load manager projects."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// GET PROJECTS BY MANAGER NAME
//
// FRONTEND HELPER
//
// The backend does NOT provide:
//
// GET /api/projects/manager/name/{name}
//
// So if the UI only has a manager name,
// first obtain the manager's UUID from the
// users/team service, then call the backend
// using that UUID.
//
// This helper accepts a manager object:
//
// {
//     id: "...",
//     fullName: "Hana Nigussie"
// }
//
// OR:
//
// {
//     userId: "...",
//     fullName: "Hana Nigussie"
// }
//
// ============================================================

export async function getProjectsByManagerUser(
    manager
) {
    const managerId =
        manager?.id ??
        manager?.userId ??
        manager?.managerId;

    if (!managerId) {
        throw new Error(
            "Manager ID is required. The manager name cannot be used as the API identifier."
        );
    }

    return getProjectsByManager(
        managerId
    );
}

// ============================================================
// GET PROJECT STATISTICS
//
// Uses backend project list.
//
// ============================================================

export async function getProjectStatistics() {
    const projects =
        await getProjects();

    return {
        totalProjects:
            projects.length,

        activeProjects:
            projects.filter(
                (project) =>
                    String(
                        project?.statusName ||
                        project?.status ||
                        ""
                    )
                        .toLowerCase() ===
                    "active"
            ).length,

        archivedProjects:
            projects.filter(
                (project) =>
                    String(
                        project?.statusName ||
                        project?.status ||
                        ""
                    )
                        .toLowerCase() ===
                    "archived"
            ).length,

        completedProjects:
            projects.filter(
                (project) =>
                    String(
                        project?.statusName ||
                        project?.status ||
                        ""
                    )
                        .toLowerCase() ===
                    "completed"
            ).length,
    };
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getProjects,
    getActiveProjects,
    getArchivedProjects,

    getProjectById,

    createProject,
    updateProject,
    deleteProject,

    approveProject,
    rejectProject,

    changeProjectStatus,
    archiveProject,
    restoreProject,

    assignProjectManager,
    updateProjectManager,

    getProjectManager,
    getProjectsByManager,
    getProjectsByManagerUser,

    getProjectStatistics,
};