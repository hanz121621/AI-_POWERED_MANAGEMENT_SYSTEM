import api from "./api";

/**
 * Get tasks assigned to the currently logged-in Contributor.
 *
 * Backend:
 * GET /api/tasks/my-work
 */


export const getMyWork = async () => {
    const response = await api.get("/tasks/my-work");
    return response.data;
};

/**
 * Get a single task.
 *
 * Backend:
 * GET /api/tasks/{id}
 */
export const getTaskById = async (taskId) => {
    if (!taskId) {
        throw new Error("Task ID is required.");
    }

    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
};

/**
 * Get tasks assigned to a specific contributor.
 *
 * Backend:
 * GET /api/tasks/developer/{developerId}
 *
 * This is mainly useful for Manager/TeamLeader views.
 * The Developer Dashboard should use getMyWork().
 */
export const getContributorTasks = async (developerId) => {
    if (!developerId) {
        throw new Error("Contributor ID is required.");
    }

    const response = await api.get(`/tasks/developer/${developerId}`);
    return response.data;
};

/**
 * Get tasks assigned to the logged-in Contributor
 * for a specific sprint.
 *
 * Backend:
 * GET /api/tasks/my-sprint/{sprintId}
 */
export const getMySprintTasks = async (sprintId) => {
    if (!sprintId) {
        throw new Error("Sprint ID is required.");
    }

    const response = await api.get(`/tasks/my-sprint/${sprintId}`);
    return response.data;
};

/**
 * Update the status of a task assigned to the
 * currently logged-in Contributor.
 *
 * Backend:
 * PUT /api/tasks/{id}/status
 */
export const updateMyTaskStatus = async (taskId, status) => {
    if (!taskId) {
        throw new Error("Task ID is required.");
    }

    const response = await api.put(`/tasks/${taskId}/status`, {
        status,
    });

    return response.data;
};

/**
 * Get an AI suggestion for a task.
 *
 * Backend:
 * GET /api/tasks/{id}/ai-suggestion
 */
export const getTaskAISuggestion = async (taskId) => {
    if (!taskId) {
        throw new Error("Task ID is required.");
    }

    const response = await api.get(`/tasks/${taskId}/ai-suggestion`);
    return response.data;
};