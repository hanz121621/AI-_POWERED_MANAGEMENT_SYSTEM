import api from "./api";

export const generateAIResponse = async (prompt) => {
    const response = await api.post("/AI/generate", {
        prompt,
    });

    return response.data;
};