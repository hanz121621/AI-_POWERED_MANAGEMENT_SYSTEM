
import api from "./api";

// ============================================================
// SPRINT SERVICE
// Backend Controller:
// /api/Sprint
// ============================================================

// ============================================================
// CREATE SPRINT
// POST: /api/Sprint
// ============================================================

export const createSprint = async (sprintData) => {
    const response = await api.post("/Sprint", sprintData);
    return response.data;
};

// ============================================================
// GET ALL SPRINTS
// GET: /api/Sprint
// ============================================================

export const getAllSprints = async () => {
    const response = await api.get("/Sprint");
    return response.data;
};

// ============================================================
// GET SPRINT BY ID
// GET: /api/Sprint/{id}
// ============================================================

export const getSprintById = async (id) => {
    const response = await api.get(`/Sprint/${id}`);
    return response.data;
};

// ============================================================
// GET PROJECT SPRINTS
// GET: /api/Sprint/project/{projectId}
// ============================================================

export const getProjectSprints = async (projectId) => {
    const response = await api.get(
        `/Sprint/project/${projectId}`
    );

    return response.data;
};

// ============================================================
// UPDATE SPRINT
// PUT: /api/Sprint/{id}
// ============================================================

export const updateSprint = async (id, sprintData) => {
    const response = await api.put(
        `/Sprint/${id}`,
        sprintData
    );

    return response.data;
};

// ============================================================
// DELETE SPRINT
// DELETE: /api/Sprint/{id}
// ============================================================

export const deleteSprint = async (id) => {
    const response = await api.delete(
        `/Sprint/${id}`
    );

    return response.data;
};

// ============================================================
// ASSIGN SPRINT TO TEAM
// PUT: /api/Sprint/{sprintId}/team/{teamId}
// ============================================================

export const assignSprintToTeam = async (
    sprintId,
    teamId
) => {
    const response = await api.put(
        `/Sprint/${sprintId}/team/${teamId}`
    );

    return response.data;
};

// ============================================================
// START SPRINT
// PUT: /api/Sprint/{sprintId}/start
// ============================================================

export const startSprint = async (sprintId) => {
    const response = await api.put(
        `/Sprint/${sprintId}/start`
    );

    return response.data;
};

// ============================================================
// COMPLETE SPRINT
// POST: /api/Sprint/{sprintId}/complete
// ============================================================

export const completeSprint = async (sprintId) => {
    const response = await api.post(
        `/Sprint/${sprintId}/complete`
    );

    return response.data;
};

// ============================================================
// GET SPRINT BACKLOG
// GET: /api/Sprint/{projectId}/{sprintId}/backlog
// ============================================================

export const getSprintBacklog = async (
    projectId,
    sprintId,
    filters = {}
) => {
    const response = await api.get(
        `/Sprint/${projectId}/${sprintId}/backlog`,
        {
            params: {
                status: filters.status,
                priority: filters.priority,
                assignedDeveloperId:
                    filters.assignedDeveloperId,
                deadline: filters.deadline,
                createdAfter: filters.createdAfter,
                search: filters.search,
                descending:
                    filters.descending ?? false,
            },
        }
    );

    return response.data;
};

// ============================================================
// CONTRIBUTOR / STAFF
// VIEW MY SPRINTS
// GET: /api/Sprint/my-sprints
// ============================================================

export const getMySprints = async () => {
    const response = await api.get(
        "/Sprint/my-sprints"
    );

    return response.data;
};

// ============================================================
// CONTRIBUTOR / STAFF
// VIEW MY SPRINT TASKS
// GET: /api/Sprint/my-sprints/{sprintId}
// ============================================================

export const getMySprintTasks = async (sprintId) => {
    const response = await api.get(
        `/Sprint/my-sprints/${sprintId}`
    );

    return response.data;
};

// ============================================================
// CONTRIBUTOR / STAFF
// VIEW MY SPRINT PROGRESS
// GET: /api/Sprint/my-sprints/{sprintId}/progress
// ============================================================

export const getMySprintProgress = async (sprintId) => {
    const response = await api.get(
        `/Sprint/my-sprints/${sprintId}/progress`
    );

    return response.data;
};

// ============================================================
// SPRINT REPORT / PROGRESS
// GET:
// /api/reports/projects/{projectId}/sprints/{sprintId}
// ============================================================

export const getSprintProgressReport = async (
    projectId,
    sprintId
) => {
    const response = await api.get(
        `/reports/projects/${projectId}/sprints/${sprintId}`
    );

    return response.data;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

const sprintService = {
    createSprint,
    getAllSprints,
    getSprintById,
    getProjectSprints,
    updateSprint,
    deleteSprint,
    assignSprintToTeam,
    startSprint,
    completeSprint,
    getSprintBacklog,
    getMySprints,
    getMySprintTasks,
    getMySprintProgress,
    getSprintProgressReport,
};

export default sprintService;

