
import api from "./api";

export const generateAIResponse = async (prompt) => {
    const response = await api.post("/AI/generate", {
        prompt,
    });

    return response.data;
};
import axios from "axios";

// ============================================================
// AI SERVICE
// AI-001: View AI Recommendations
// AI-002: Predict Project Risk
// ============================================================
//
// FRONTEND DEVELOPMENT MODE
// ------------------------------------------------------------
// Set this to false when the backend is ready.
//
// true  = frontend works without backend
// false = use real .NET backend APIs
// ============================================================

const AI_FRONTEND_MOCK_MODE = false; // 🌟 Turn off mock data
const API_BASE_URL = "http://localhost:5043/api"; // 🌟 Match your actual backend port

// ============================================================
// AXIOS CLIENT
// ============================================================

const aiApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ============================================================
// AUTHORIZATION
// ============================================================

aiApi.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("aipms_token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================
// FRONTEND MOCK PROJECTS
// ============================================================
//
// Used ONLY while frontend development mode is enabled.
//
// These are project records for UI testing.
// They are not stored in localStorage.
// ============================================================

const MOCK_MANAGER_PROJECTS = [
    {
        id: 1,
        name: "AI-Powered Project Management System",
        description:
            "AI-powered project management platform.",
        status: "Active",
    },
    {
        id: 2,
        name: "FieldSync",
        description:
            "Offline-first rural reporting system.",
        status: "Active",
    },
    {
        id: 3,
        name: "Library Management System",
        description:
            "Digital library management application.",
        status: "In Progress",
    },
];

// ============================================================
// AI-001 MOCK RECOMMENDATIONS
// ============================================================
//
// Used only for frontend UI testing.
// ============================================================

const MOCK_RECOMMENDATIONS = {
    1: [
        {
            id: "rec-1",
            title: "Review Sprint Progress",
            type: "Info",
            description:
                "Review the current sprint progress and prioritize remaining work before the sprint deadline.",
        },
        {
            id: "rec-2",
            title: "Monitor Task Delays",
            type: "Risk",
            description:
                "Monitor delayed tasks and address blockers that could affect planned project completion.",
        },
    ],

    2: [
        {
            id: "rec-3",
            title: "Review Offline Synchronization",
            type: "Recommendation",
            description:
                "Review synchronization activity and ensure pending offline records are processed when connectivity is available.",
        },
    ],

    3: [
        {
            id: "rec-4",
            title: "Review Remaining Development Tasks",
            type: "Info",
            description:
                "Review incomplete development tasks and prioritize work required for the next milestone.",
        },
    ],
};

// ============================================================
// AI-002 MOCK RISK PREDICTIONS
// ============================================================
//
// Used only for frontend UI testing.
// ============================================================

const MOCK_RISK_PREDICTIONS = {
    1: {
        riskLevel: "Medium",
        riskScore: 58,
        summary:
            "The project has a moderate risk based on project progress and remaining work.",
        supportingFactors: [
            {
                id: "factor-1",
                name: "Sprint Progress",
                description:
                    "Some planned sprint work remains incomplete.",
            },
            {
                id: "factor-2",
                name: "Task Progress",
                description:
                    "Remaining tasks may require additional monitoring.",
            },
            {
                id: "factor-3",
                name: "Deadline",
                description:
                    "Upcoming deadlines should be monitored closely.",
            },
        ],
    },

    2: {
        riskLevel: "Low",
        riskScore: 28,
        summary:
            "The project currently shows a relatively low predicted risk.",
        supportingFactors: [
            {
                id: "factor-4",
                name: "Project Progress",
                description:
                    "Current project progress is within an acceptable range.",
            },
            {
                id: "factor-5",
                name: "Workload",
                description:
                    "Current workload does not indicate a significant risk.",
            },
        ],
    },

    3: {
        riskLevel: "High",
        riskScore: 76,
        summary:
            "The project has an elevated predicted risk due to remaining work and schedule pressure.",
        supportingFactors: [
            {
                id: "factor-6",
                name: "Delayed Tasks",
                description:
                    "Several remaining tasks require attention.",
            },
            {
                id: "factor-7",
                name: "Deadline",
                description:
                    "The project schedule requires close monitoring.",
            },
            {
                id: "factor-8",
                name: "Current Issues",
                description:
                    "Open project issues may affect planned completion.",
            },
        ],
    },
};

// ============================================================
// GET MANAGER ASSIGNED PROJECTS
// ============================================================

export async function getManagerProjects() {

    // --------------------------------------------------------
    // FRONTEND MOCK MODE
    // --------------------------------------------------------

    if (AI_FRONTEND_MOCK_MODE) {

        await new Promise(
            (resolve) =>
                setTimeout(resolve, 500)
        );

        return MOCK_MANAGER_PROJECTS;
    }

    // --------------------------------------------------------
    // REAL BACKEND
    // --------------------------------------------------------

    try {

        const response =
            await aiApi.get(
                "/projects/assigned"
            );

        return response.data;

    } catch (error) {

        console.error(
            "Failed to load manager projects:",
            error
        );

        const status =
            error.response?.status;

        if (status === 401) {
            throw new Error(
                "Your session has expired. Please log in again."
            );
        }

        if (status === 403) {
            throw new Error(
                "You are not authorized to access manager projects."
            );
        }

        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Unable to load assigned projects."
        );
    }
}

// ============================================================
// AI-001
// GET AI RECOMMENDATIONS
// ============================================================

export async function getAIRecommendations(
    projectId
) {

    if (
        projectId === undefined ||
        projectId === null ||
        projectId === ""
    ) {
        throw new Error(
            "Project ID is required."
        );
    }

    // --------------------------------------------------------
    // FRONTEND MOCK MODE
    // --------------------------------------------------------

    if (AI_FRONTEND_MOCK_MODE) {

        await new Promise(
            (resolve) =>
                setTimeout(resolve, 800)
        );

        return {
            recommendations:
                MOCK_RECOMMENDATIONS[
                    projectId
                ] || [],
        };
    }

    // --------------------------------------------------------
    // REAL BACKEND
    // --------------------------------------------------------

    try {

        const response =
            await aiApi.get(
                `/ai/recommendations/${encodeURIComponent(
                    projectId
                )}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "Failed to retrieve AI recommendations:",
            error
        );

        const status =
            error.response?.status;

        if (status === 401) {
            throw new Error(
                "Your session has expired. Please log in again."
            );
        }

        if (status === 403) {
            throw new Error(
                "You are not authorized to view AI recommendations for this project."
            );
        }

        if (status === 404) {
            throw new Error(
                "The selected project could not be found."
            );
        }

        if (status === 500) {
            throw new Error(
                "The AI service could not generate recommendations. Please try again."
            );
        }

        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Unable to generate AI recommendations."
        );
    }
}

// ============================================================
// AI-001
// REFRESH AI RECOMMENDATIONS
// ============================================================

export async function refreshAIRecommendations(
    projectId
) {

    return getAIRecommendations(
        projectId
    );
}

// ============================================================
// AI-002
// PREDICT PROJECT RISK
// ============================================================

export async function predictProjectRisk(
    projectId
) {

    if (
        projectId === undefined ||
        projectId === null ||
        projectId === ""
    ) {
        throw new Error(
            "Project ID is required."
        );
    }

    // --------------------------------------------------------
    // FRONTEND MOCK MODE
    // --------------------------------------------------------

    if (AI_FRONTEND_MOCK_MODE) {

        await new Promise(
            (resolve) =>
                setTimeout(resolve, 1200)
        );

        return (
            MOCK_RISK_PREDICTIONS[
                projectId
            ] || {
                riskLevel: "Unknown",
                riskScore: null,
                summary:
                    "No risk prediction is currently available for this project.",
                supportingFactors: [],
            }
        );
    }

    // --------------------------------------------------------
    // REAL BACKEND
    // --------------------------------------------------------

    try {

        const response =
            await aiApi.get(
                `/ai/risk/${encodeURIComponent(
                    projectId
                )}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "Failed to predict project risk:",
            error
        );

        const status =
            error.response?.status;

        if (status === 401) {
            throw new Error(
                "Your session has expired. Please log in again."
            );
        }

        if (status === 403) {
            throw new Error(
                "You are not authorized to view risk predictions for this project."
            );
        }

        if (status === 404) {
            throw new Error(
                "The selected project could not be found."
            );
        }

        if (status === 400) {
            throw new Error(
                error.response?.data?.message ||
                "The project risk prediction request is invalid."
            );
        }

        if (
            status === 500 ||
            status === 502 ||
            status === 503
        ) {
            throw new Error(
                "The AI service could not generate the project risk prediction. Please try again."
            );
        }

        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Unable to predict project risk."
        );
    }
}

// ============================================================
// AI-002
// REFRESH PROJECT RISK
// ============================================================

export async function refreshProjectRiskPrediction(
    projectId
) {

    return predictProjectRisk(
        projectId
    );
}

// ============================================================
// GET AI HISTORY
// ============================================================

export async function getAIHistory(
    projectId
) {

    if (
        projectId === undefined ||
        projectId === null ||
        projectId === ""
    ) {
        throw new Error(
            "Project ID is required."
        );
    }

    // Frontend-only mode
    if (AI_FRONTEND_MOCK_MODE) {

        return {
            history: [],
        };
    }

    try {

        const response =
            await aiApi.get(
                `/ai/history/${encodeURIComponent(
                    projectId
                )}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "Failed to load AI history:",
            error
        );

        const status =
            error.response?.status;

        if (status === 401) {
            throw new Error(
                "Your session has expired. Please log in again."
            );
        }

        if (status === 403) {
            throw new Error(
                "You are not authorized to access AI history."
            );
        }

        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Unable to load AI history."
        );
    }
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

const aiService = {
    getManagerProjects,

    // AI-001
    getAIRecommendations,
    refreshAIRecommendations,

    // AI-002
    predictProjectRisk,
    refreshProjectRiskPrediction,

    // History
    getAIHistory,
};

export default aiService;

