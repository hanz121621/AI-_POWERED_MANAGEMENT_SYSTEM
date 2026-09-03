import api from "./api";

// ============================================================
// GET AI SUBTASKS FOR A TASK
// ============================================================

export const getTaskSubtasks = async (taskId) => {
    if (!taskId) {
        throw new Error("Task ID is required.");
    }

    const response = await api.get(
        `/subtasks/task/${taskId}`
    );

    return response.data;
};

// ============================================================
// GET SINGLE SUBTASK
// ============================================================

export const getSubtaskById = async (subTaskId) => {
    if (!subTaskId) {
        throw new Error("Subtask ID is required.");
    }

    const response = await api.get(
        `/subtasks/${subTaskId}`
    );

    return response.data;
};

// ============================================================
// UPDATE CONTRIBUTOR AI SUBTASK STATUS + PROGRESS
// ============================================================

export const updateAISubtaskStatus = async (
    subTaskId,
    status,
    progress
) => {
    if (!subTaskId) {
        throw new Error("Subtask ID is required.");
    }

    const response = await api.put(
        `/subtasks/${subTaskId}/status`,
        {
            status,
            progress,
        }
    );

    return response.data;
};