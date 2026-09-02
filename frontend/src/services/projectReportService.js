// ============================================================
// AIPMS - PROJECT REPORT SERVICE
// src/services/projectReportService.js
//
// Manager Reporting API Service
// Connected to the real ASP.NET Core backend.
// ============================================================

import axios from "axios";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5024";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ============================================================
// AUTHORIZATION
// ============================================================

const getHeaders = (accessToken) => {
    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

// ============================================================
// RESPONSE HELPERS
// ============================================================

const handleResponse = (response) => {
    return response?.data ?? response;
};

const unwrapData = (result) => {
    if (
        result &&
        typeof result === "object" &&
        Object.prototype.hasOwnProperty.call(result, "data")
    ) {
        return result.data;
    }

    return result;
};

// ============================================================
// ERROR HANDLING
// ============================================================

const handleError = (error) => {
    const status = error?.response?.status;

    const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.title;

    if (status === 401) {
        throw new Error("AUTHENTICATION_REQUIRED");
    }

    if (status === 403) {
        throw new Error("ACCESS_DENIED");
    }

    if (status === 404) {
        throw new Error("REPORT_NOT_FOUND");
    }

    throw new Error(
        serverMessage ||
        error?.message ||
        "Unable to load project report."
    );
};

// ============================================================
// 1. MANAGER PROJECTS
// ============================================================
//
// GET /api/projects/my-projects
//
// Returns projects assigned to the currently authenticated manager.
// ============================================================

export const getAuthorizedManagerProjects = async (
    accessToken
) => {
    try {
        const response = await api.get(
            "/api/projects/my-projects",
            {
                headers: getHeaders(accessToken),
            }
        );

        const result = handleResponse(response);

        return unwrapData(result);
    } catch (error) {
        handleError(error);
    }
};

// ============================================================
// 2. PROJECT DASHBOARD
// ============================================================
//
// GET /api/projects/{projectId}/dashboard
//
// Returns ProjectDashboardDto.
// ============================================================

export const getProjectDashboard = async (
    projectId,
    accessToken
) => {
    try {
        if (!projectId) {
            throw new Error("PROJECT_ID_REQUIRED");
        }

        const response = await api.get(
            `/api/projects/${projectId}/dashboard`,
            {
                headers: getHeaders(accessToken),
            }
        );

        const result = handleResponse(response);

        return unwrapData(result);
    } catch (error) {
        handleError(error);
    }
};

// ============================================================
// 3. PROJECT RISKS & ISSUES
// ============================================================
//
// GET /api/projects/{projectId}/risks-issues
// ============================================================

export const getProjectRisksAndIssues = async (
    projectId,
    accessToken,
    filters = {}
) => {
    try {
        if (!projectId) {
            throw new Error("PROJECT_ID_REQUIRED");
        }

        const response = await api.get(
            `/api/projects/${projectId}/risks-issues`,
            {
                headers: getHeaders(accessToken),
                params: filters,
            }
        );

        const result = handleResponse(response);

        return unwrapData(result);
    } catch (error) {
        handleError(error);
    }
};

// ============================================================
// 4. PROJECT SPRINTS
// ============================================================
//
// GET /api/Sprint/project/{projectId}
// ============================================================

export const getProjectSprints = async (
    projectId,
    accessToken
) => {
    try {
        if (!projectId) {
            throw new Error("PROJECT_ID_REQUIRED");
        }

        const response = await api.get(
            `/api/Sprint/project/${projectId}`,
            {
                headers: getHeaders(accessToken),
            }
        );

        const result = handleResponse(response);

        return unwrapData(result);
    } catch (error) {
        handleError(error);
    }
};

// ============================================================
// 5. SPRINT PROGRESS
// ============================================================
//
// GET
// /api/reports/projects/{projectId}/sprints/{sprintId}/progress
// ============================================================

export const getSprintProgress = async (
    projectId,
    sprintId,
    accessToken
) => {
    try {
        if (!projectId) {
            throw new Error("PROJECT_ID_REQUIRED");
        }

        if (!sprintId) {
            throw new Error("SPRINT_ID_REQUIRED");
        }

        const response = await api.get(
            `/api/reports/projects/${projectId}/sprints/${sprintId}/progress`,
            {
                headers: getHeaders(accessToken),
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// ============================================================
// 6. PROJECT TIMELINE
// ============================================================
//
// GET /api/reports/projects/{projectId}/timeline
// ============================================================

export const getProjectTimeline = async (
    projectId,
    accessToken
) => {
    try {
        if (!projectId) {
            throw new Error("PROJECT_ID_REQUIRED");
        }

        const response = await api.get(
            `/api/reports/projects/${projectId}/timeline`,
            {
                headers: getHeaders(accessToken),
            }
        );

        const result = handleResponse(response);

        return unwrapData(result);
    } catch (error) {
        handleError(error);
    }
};

// ============================================================
// 7. TEAM PERFORMANCE
// ============================================================
//
// GET /api/reports/team-performance/{teamId}
//
// TeamPerformanceReportDto:
//
// TeamId
// TeamName
// CompletionRate
// TotalTasks
// CompletedTasks
// DelayedTasks
// BlockedTasks
// TotalEstimatedHours
// TotalActualHours
// WorkloadPercentage
// TaskDistribution
// TeamLeaders
// Contributors
// GeneratedAt
// Success
// Message
// ============================================================

export const getTeamPerformance = async (
    teamId,
    accessToken,
    startDate = null,
    endDate = null
) => {
    try {
        if (!teamId) {
            throw new Error("TEAM_ID_REQUIRED");
        }

        const params = {};

        if (startDate) {
            params.startDate = startDate;
        }

        if (endDate) {
            params.endDate = endDate;
        }

        const response = await api.get(
            `/api/reports/team-performance/${teamId}`,
            {
                headers: getHeaders(accessToken),
                params,
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};
// ============================================================
// AI PROJECT SUMMARY
// ============================================================
//
// NOTE:
// This keeps compatibility with AIProjectSummary.jsx.
// The backend AI-summary endpoint has not yet been verified.
//
// Do NOT call a guessed endpoint.
// ============================================================

export const getAIProjectSummary = async () => {
    throw new Error(
        "AI_PROJECT_SUMMARY_ENDPOINT_NOT_CONFIGURED"
    );
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getAuthorizedManagerProjects,
    getProjectDashboard,
    getProjectRisksAndIssues,
    getProjectSprints,
    getSprintProgress,
    getProjectTimeline,
    getTeamPerformance,
    getAIProjectSummary,
};