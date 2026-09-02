import api from "./api"; // Reuse the existing, correctly configured api instance

// ============================================================
// AI SERVICE CONFIGURATION
// ============================================================

// Set to FALSE now that the real backend is built and running!
const AI_FRONTEND_MOCK_MODE = false; 

// ============================================================
// NEW: AI-001 GET AI SUGGESTIONS (With optional filters)
// ============================================================
export const getAiSuggestions = async (filters = {}) => {
    if (AI_FRONTEND_MOCK_MODE) {
        return { success: true, data: [] };
    }
    try {
        const response = await api.get("/aisuggestions", { params: filters });
        return response.data;
    } catch (error) {
        console.error("GET AI SUGGESTIONS ERROR:", error);
        throw error;
    }
};

// ============================================================
// NEW: AI-001 VIEW AI SUGGESTION (Records access activity)
// ============================================================
export const viewAiSuggestion = async (id) => {
    if (AI_FRONTEND_MOCK_MODE) {
        return { success: true, data: { id, viewedAt: new Date().toISOString() } };
    }
    try {
        const response = await api.get(`/aisuggestions/${id}/view`);
        return response.data;
    } catch (error) {
        console.error("VIEW AI SUGGESTION ERROR:", error);
        throw error;
    }
};

// ============================================================
// NEW: AI CONNECTION TEST
// ============================================================
export const testAiConnection = async (prompt) => {
    if (AI_FRONTEND_MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true, response: "Mock AI is online and ready!" };
    }
    try {
        const response = await api.post("/ai/test", { prompt });
        return response.data;
    } catch (error) {
        console.error("AI TEST ERROR:", error);
        throw error;
    }
};

// ============================================================
// EXISTING: GET MANAGER ASSIGNED PROJECTS
// ============================================================
export async function getManagerProjects() {
    if (AI_FRONTEND_MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [
            { id: 1, name: "AI-Powered Project Management System", description: "AI-powered project management platform.", status: "Active" },
            { id: 2, name: "FieldSync", description: "Offline-first rural reporting system.", status: "Active" },
        ];
    }
    try {
        const response = await api.get("/projects/assigned");
        return response.data;
    } catch (error) {
        console.error("Failed to load manager projects:", error);
        throw new Error(error.response?.data?.message || "Unable to load assigned projects.");
    }
}

// ============================================================
// EXISTING: AI-001 GET AI RECOMMENDATIONS
// ============================================================
export async function getAIRecommendations(projectId) {
    if (AI_FRONTEND_MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return { recommendations: [] };
    }
    try {
        const response = await api.get(`/ai/recommendations/${encodeURIComponent(projectId)}`);
        return response.data;
    } catch (error) {
        console.error("Failed to retrieve AI recommendations:", error);
        throw new Error(error.response?.data?.message || "Unable to generate AI recommendations.");
    }
}

export async function refreshAIRecommendations(projectId) {
    return getAIRecommendations(projectId);
}

// ============================================================
// EXISTING: AI-002 PREDICT PROJECT RISK
// ============================================================
export async function predictProjectRisk(projectId) {
    if (AI_FRONTEND_MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        return { riskLevel: "Unknown", riskScore: null, summary: "No risk prediction available.", supportingFactors: [] };
    }
    try {
        const response = await api.get(`/ai/risk/${encodeURIComponent(projectId)}`);
        return response.data;
    } catch (error) {
        console.error("Failed to predict project risk:", error);
        throw new Error(error.response?.data?.message || "Unable to predict project risk.");
    }
}

export async function refreshProjectRiskPrediction(projectId) {
    return predictProjectRisk(projectId);
}

// ============================================================
// EXISTING: GET AI HISTORY
// ============================================================
export async function getAIHistory(projectId) {
    if (AI_FRONTEND_MOCK_MODE) {
        return { history: [] };
    }
    try {
        const response = await api.get(`/ai/history/${encodeURIComponent(projectId)}`);
        return response.data;
    } catch (error) {
        console.error("Failed to load AI history:", error);
        throw new Error(error.response?.data?.message || "Unable to load AI history.");
    }
}

// ============================================================
// DEFAULT EXPORT
// ============================================================
const aiService = {
    getManagerProjects,
    getAIRecommendations,
    refreshAIRecommendations,
    predictProjectRisk,
    refreshProjectRiskPrediction,
    getAIHistory,
    getAiSuggestions,
    viewAiSuggestion,
    testAiConnection,
};

export default aiService;