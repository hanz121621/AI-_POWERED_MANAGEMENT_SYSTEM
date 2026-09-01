import api from "@/services/api";

// ============================================================
// PROJECT STATUS NAMES
// ============================================================

export const PROJECT_STATUS_NAMES = {
    Active: "Active",
    Planning: "Planning",
    Completed: "Completed",
    Archived: "Archived",
    Pending: "Pending",
    Approved: "Approved",
    Rejected: "Rejected",
};

// ============================================================
// EMPTY PROJECT SPECIFICATION
// ============================================================

export const EMPTY_PROJECT_SPECIFICATION = {
    objectives: "",
    scope: "",
    functionalRequirements: "",
    nonFunctionalRequirements: "",
    deliverables: "",
    technologyStack: "",
    assumptions: "",
    constraints: "",
};

// ============================================================
// ERROR HELPER
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

    if (response.status === 401) {
        return (
            data?.message ||
            data?.detail ||
            "Unauthorized. Please login again."
        );
    }

    // --------------------------------------------------------
    // 403
    // --------------------------------------------------------

    if (response.status === 403) {
        return (
            data?.message ||
            data?.detail ||
            "You do not have permission to perform this action."
        );
    }

    // --------------------------------------------------------
    // 404
    // --------------------------------------------------------

    if (response.status === 404) {
        return (
            data?.message ||
            data?.detail ||
            "The requested resource was not found."
        );
    }

    // --------------------------------------------------------
    // Validation errors
    // --------------------------------------------------------

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

    if (typeof data === "string") {
        return data;
    }

    return fallback;
}

// ============================================================
// NORMALIZE PROJECT
// ============================================================

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
            project?.ProjectId ??
            null,

        projectId:
            project?.projectId ??
            project?.id ??
            project?.ProjectId ??
            null,

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

    // Backend returns:
    // [ {...}, {...} ]

    if (Array.isArray(data)) {
        projects = data;
    }

    // Possible wrapper:
    // { projects: [...] }

    else if (
        Array.isArray(data?.projects)
    ) {
        projects = data.projects;
    }

    // Possible wrapper:
    // { data: [...] }

    else if (
        Array.isArray(data?.data)
    ) {
        projects = data.data;
    }

    // Possible wrapper:
    // { items: [...] }

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
// NORMALIZE PROJECT SPECIFICATION
// ============================================================

function normalizeProjectSpecification(data) {
    if (!data) {
        return null;
    }

    return {
        ...data,

        id:
            data?.id ??
            data?.specificationId ??
            data?.SpecificationId ??
            null,

        specificationId:
            data?.specificationId ??
            data?.SpecificationId ??
            data?.id ??
            null,

        projectId:
            data?.projectId ??
            data?.ProjectId ??
            null,

        objectives:
            data?.objectives ??
            data?.Objectives ??
            "",

        scope:
            data?.scope ??
            data?.Scope ??
            "",

        functionalRequirements:
            data?.functionalRequirements ??
            data?.FunctionalRequirements ??
            "",

        nonFunctionalRequirements:
    data?.nonFunctionalRequirements ??
    data?.NonFunctionalRequirements ??
    "",

        deliverables:
            data?.deliverables ??
            data?.Deliverables ??
            "",

        technologyStack:
            data?.technologyStack ??
            data?.TechnologyStack ??
            "",

        assumptions:
            data?.assumptions ??
            data?.Assumptions ??
            "",

        constraints:
            data?.constraints ??
            data?.Constraints ??
            "",
    };
}

// ============================================================
// GET ALL PROJECTS
//
// GET /api/projects
// ============================================================

export async function getProjects() {
    try {
        const response = await api.get(
            "/projects"
        );

        return normalizeProjectList(
            response.data
        );
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
        const response = await api.get(
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
        const response = await api.get(
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
        const response = await api.get(
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
            name: String(
                projectData.name || ""
            ).trim(),

            description: String(
                projectData.description || ""
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

        const response = await api.post(
            "/projects",
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
                "Project created successfully.",
        };
    } catch (error) {
        console.error(
            "CREATE PROJECT ERROR:",
            error
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

        const response = await api.put(
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
            error: "Project ID is required.",
        };
    }

    try {
        const response = await api.post(
            `/projects/${projectId}/approve`
        );

        return {
            success: true,

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

            error: getApiErrorMessage(
                error,
                "Unable to approve project."
            ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
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
            error: "Project ID is required.",
        };
    }

    try {
        const response = await api.post(
            `/projects/${projectId}/reject`
        );

        return {
            success: true,

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

            error: getApiErrorMessage(
                error,
                "Unable to reject project."
            ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// CHANGE PROJECT STATUS
//
// PUT /api/projects/{id}/status
//
// Body:
// {
//     statusId: "UUID"
// }
// ============================================================







export async function changeProjectStatus(
    projectId,
    statusId,
    notes = null
) {
    if (!projectId) {
        return {
            success: false,
            error: "Project ID is required.",
        };
    }

    if (!statusId) {
        return {
            success: false,
            error: "Status ID is required.",
        };
    }

    try {
        const response = await api.put(
            `/projects/${projectId}/status`,
            {
                statusId,
                notes,
            }
        );

        return {
            success: true,

            project: normalizeProject(
                response.data?.project ??
                response.data?.data ??
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

            error: getApiErrorMessage(
                error,
                "Unable to update project status."
            ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// GET MY PROJECTS
//
// GET /api/projects/my-projects
//
// Intended for authenticated Manager.
// ============================================================

export async function getMyProjects() {
    try {
        const response =
            await api.get(
                "/projects/my-projects"
            );

        return normalizeProjectList(
            response.data
        );
    } catch (error) {
        console.error(
            "GET MY PROJECTS ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load your projects."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// ARCHIVE PROJECT
//
// PUT /api/projects/{id}/status
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
// PUT /api/projects/{id}/status
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
// ASSIGN PROJECT MANAGER
//
// POST /api/projects/{id}/assign-manager
//
// Body:
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
// GET PROJECTS BY MANAGER USER
//
// Frontend helper.
// Accepts:
//
// {
//     id: "...",
//     fullName: "..."
// }
//
// OR
//
// {
//     userId: "...",
//     fullName: "..."
// }
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
// PROJECT SPECIFICATION
// ============================================================
//
// GET    /api/projects/{projectId}/specification
// POST   /api/projects/{projectId}/specification
// PUT    /api/projects/{projectId}/specification
// DELETE /api/projects/{projectId}/specification
//
// ============================================================

// ============================================================
// GET PROJECT SPECIFICATION
// ============================================================

export async function getProjectSpecification(
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
                `/projects/${projectId}/specification`
            );

        return normalizeProjectSpecification(
            response.data
        );
    } catch (error) {
        console.error(
            "GET PROJECT SPECIFICATION ERROR:",
            error
        );

        throw new Error(
            getApiErrorMessage(
                error,
                "Unable to load project specification."
            ),
            {
                cause: error,
            }
        );
    }
}

// ============================================================
// CREATE PROJECT SPECIFICATION
// ============================================================

export async function createProjectSpecification(
    projectId,
    specificationData
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!specificationData) {
        return {
            success: false,
            error:
                "Project specification information is required.",
        };
    }

    try {
        const requestData = {
            objectives:
                String(
                    specificationData.objectives ||
                    ""
                ).trim(),

            scope:
                String(
                    specificationData.scope ||
                    ""
                ).trim(),

            functionalRequirements:
                String(
                    specificationData.functionalRequirements ||
                    ""
                ).trim(),

            nonFunctionalRequirements:
                String(
                    specificationData.nonFunctionalRequirements ||
                    ""
                ).trim(),

            deliverables:
                String(
                    specificationData.deliverables ||
                    ""
                ).trim(),

            technologyStack:
                String(
                    specificationData.technologyStack ||
                    ""
                ).trim(),

            assumptions:
                String(
                    specificationData.assumptions ||
                    ""
                ).trim(),

            constraints:
                String(
                    specificationData.constraints ||
                    ""
                ).trim(),
        };

        const response =
            await api.post(
                `/projects/${projectId}/specification`,
                requestData
            );

        return {
            success: true,

            specification:
                normalizeProjectSpecification(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project specification created successfully.",
        };
    } catch (error) {
        console.error(
            "CREATE PROJECT SPECIFICATION ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to create project specification."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// UPDATE PROJECT SPECIFICATION
// ============================================================

export async function updateProjectSpecification(
    projectId,
    specificationData
) {
    if (!projectId) {
        return {
            success: false,
            error:
                "Project ID is required.",
        };
    }

    if (!specificationData) {
        return {
            success: false,
            error:
                "Project specification information is required.",
        };
    }

    try {
        const requestData = {
            objectives:
                String(
                    specificationData.objectives ||
                    ""
                ).trim(),

            scope:
                String(
                    specificationData.scope ||
                    ""
                ).trim(),

            functionalRequirements:
                String(
                    specificationData.functionalRequirements ||
                    ""
                ).trim(),

            nonFunctionalRequirements:
                String(
                    specificationData.nonFunctionalRequirements ||
                    ""
                ).trim(),

            deliverables:
                String(
                    specificationData.deliverables ||
                    ""
                ).trim(),

            technologyStack:
                String(
                    specificationData.technologyStack ||
                    ""
                ).trim(),

            assumptions:
                String(
                    specificationData.assumptions ||
                    ""
                ).trim(),

            constraints:
                String(
                    specificationData.constraints ||
                    ""
                ).trim(),
        };

        const response =
            await api.put(
                `/projects/${projectId}/specification`,
                requestData
            );

        return {
            success: true,

            specification:
                normalizeProjectSpecification(
                    response.data
                ),

            message:
                response.data?.message ||
                "Project specification updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE PROJECT SPECIFICATION ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to update project specification."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}



// ============================================================
// UPDATE PROJECT TIMELINE
//
// PUT /api/projects/{projectId}/timeline
// ============================================================

export async function updateProjectTimeline(
    projectId,
    timelineData
) {
    if (!projectId) {
        return {
            success: false,
            error: "Project ID is required.",
        };
    }

    if (!timelineData) {
        return {
            success: false,
            error: "Timeline information is required.",
        };
    }

    try {
        const response = await api.put(
            `/projects/${projectId}/timeline`,
            timelineData
        );

        return {
            success: true,

            project: normalizeProject(
                response.data?.data ??
                response.data
            ),

            message:
                response.data?.message ||
                "Project timeline updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE PROJECT TIMELINE ERROR:",
            error
        );

        return {
            success: false,

            error: getApiErrorMessage(
                error,
                "Unable to update project timeline."
            ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}
// ============================================================
// DELETE PROJECT SPECIFICATION
// ============================================================

export async function deleteProjectSpecification(
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
                `/projects/${projectId}/specification`
            );

        return {
            success: true,

            message:
                response.data?.message ||
                "Project specification deleted successfully.",
        };
    } catch (error) {
        console.error(
            "DELETE PROJECT SPECIFICATION ERROR:",
            error
        );

        return {
            success: false,

            error:
                getApiErrorMessage(
                    error,
                    "Unable to delete project specification."
                ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}


   // ============================================================
// UPDATE PROJECT DEADLINE
//
// PUT /api/projects/{projectId}/deadline
// ============================================================

export async function updateProjectDeadline(
    projectId,
    deadlineData
) {
    if (!projectId) {
        return {
            success: false,
            error: "Project ID is required.",
        };
    }

    if (!deadlineData) {
        return {
            success: false,
            error: "Deadline information is required.",
        };
    }

    try {
        const response = await api.put(
            `/projects/${projectId}/deadline`,
            deadlineData
        );

        return {
            success: true,

            project: normalizeProject(
                response.data?.data ??
                response.data
            ),

            message:
                response.data?.message ||
                "Project deadline updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE PROJECT DEADLINE ERROR:",
            error
        );

        return {
            success: false,

            error: getApiErrorMessage(
                error,
                "Unable to update project deadline."
            ),

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}
// ============================================================
// DEFAULT EXPORT
// ============================================================
export default {
    // Projects
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

    getMyProjects,

    // Timeline / Deadline
    updateProjectTimeline,
    updateProjectDeadline,

    // Manager
    assignProjectManager,
    updateProjectManager,
    getProjectManager,

    getProjectsByManager,
    getProjectsByManagerUser,

    getProjectStatistics,

    // Project Specification
    getProjectSpecification,
    createProjectSpecification,
    updateProjectSpecification,
    deleteProjectSpecification,
};