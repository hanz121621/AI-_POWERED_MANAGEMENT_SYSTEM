import api from "@/services/api";

export const getContributorTypes = async () => {
    const response = await api.get(
        "/ContributorTypes"
    );

    return response.data;
};

export const getActiveContributorTypes = async () => {
    const response = await api.get(
        "/ContributorTypes/active"
    );

    return response.data;
};