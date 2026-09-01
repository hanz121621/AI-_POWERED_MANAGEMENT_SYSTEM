// ============================================================
// AIPMS - PROJECT REPORT SERVICE
// src/services/projectReportService.js
//
// Manager Reporting API Service
// ============================================================

import axios from "axios";

// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5024";

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ============================================================
// AUTH HEADER
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
// RESPONSE HANDLER
// ============================================================

const handleResponse = (response) => {
    return response?.data ?? response;
};

// ============================================================
// ERROR HANDLER
// ============================================================

const handleError = (error) => {
    const status = error?.response?.status;

    const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.title;

    if (status === 401) {
        throw new Error(
            "AUTHENTICATION_REQUIRED"
        );
    }

    if (status === 403) {
        throw new Error(
            "ACCESS_DENIED"
        );
    }

    if (status === 404) {
        throw new Error(
            "REPORT_NOT_FOUND"
        );
    }

    throw new Error(
        serverMessage ||
        error?.message ||
        "Unable to load project report."
    );
};

// ============================================================
// GET AUTHORIZED MANAGER PROJECTS
// ============================================================

export const getAuthorizedManagerProjects =
    async (accessToken) => {
        try {
            const response = await api.get(
                "/api/projects/manager",
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };

// ============================================================
// GET PROJECT DASHBOARD
// ============================================================

export const getProjectDashboard =
    async (
        projectId,
        accessToken
    ) => {
        try {
            if (!projectId) {
                throw new Error(
                    "PROJECT_ID_REQUIRED"
                );
            }

            const response = await api.get(
                `/api/projects/${projectId}/dashboard`,
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };

// ============================================================
// GET PROJECT RISKS AND ISSUES
// ============================================================

export const getProjectRisksAndIssues =
    async (
        projectId,
        accessToken
    ) => {
        try {
            if (!projectId) {
                throw new Error(
                    "PROJECT_ID_REQUIRED"
                );
            }

            const response = await api.get(
                `/api/projects/${projectId}/risks`,
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };

// ============================================================
// GET PROJECT SPRINTS
// ============================================================

export const getProjectSprints =
    async (
        projectId,
        accessToken
    ) => {
        try {
            if (!projectId) {
                throw new Error(
                    "PROJECT_ID_REQUIRED"
                );
            }

            const response = await api.get(
                `/api/projects/${projectId}/sprints`,
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };

// ============================================================
// GET SPRINT PROGRESS
// ============================================================

export const getSprintProgress =
    async (
        projectId,
        sprintId,
        accessToken
    ) => {
        try {
            if (!projectId) {
                throw new Error(
                    "PROJECT_ID_REQUIRED"
                );
            }

            if (!sprintId) {
                throw new Error(
                    "SPRINT_ID_REQUIRED"
                );
            }

            const response = await api.get(
                `/api/projects/${projectId}/sprints/${sprintId}/progress`,
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };

// ============================================================
// GET PROJECT TIMELINE
// ============================================================

export const getProjectTimeline =
    async (
        projectId,
        accessToken
    ) => {
        try {
            if (!projectId) {
                throw new Error(
                    "PROJECT_ID_REQUIRED"
                );
            }

            const response = await api.get(
                `/api/projects/${projectId}/timeline`,
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };

// ============================================================
// GET TEAM PERFORMANCE
// ============================================================

export const getTeamPerformance =
    async (
        projectId,
        accessToken
    ) => {
        try {
            if (!projectId) {
                throw new Error(
                    "PROJECT_ID_REQUIRED"
                );
            }

            const response = await api.get(
                `/api/projects/${projectId}/team-performance`,
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };

// ============================================================
// GET AI PROJECT SUMMARY
// ============================================================

export const getAIProjectSummary =
    async (
        projectId,
        accessToken
    ) => {
        try {
            if (!projectId) {
                throw new Error(
                    "PROJECT_ID_REQUIRED"
                );
            }

            const response = await api.get(
                `/api/projects/${projectId}/ai-summary`,
                {
                    headers:
                        getHeaders(accessToken),
                }
            );

            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    };