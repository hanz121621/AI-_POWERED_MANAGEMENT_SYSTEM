

import api from "@/services/api";

// ============================================================
// RESPONSE HELPER
// ============================================================

function unwrapResponse(response) {
    if (!response) {
        return null;
    }

    // Some controllers return:
    // { message, data }
    if (
        response.data &&
        typeof response.data === "object" &&
        Object.prototype.hasOwnProperty.call(
            response.data,
            "data"
        )
    ) {
        return response.data.data;
    }

    // Other controllers return the DTO directly.
    return response.data;
}

// ============================================================
// ERROR HELPER
// ============================================================

function getErrorMessage(error, fallbackMessage) {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData?.title) {
        return responseData.title;
    }

    if (responseData?.errors) {
        try {
            const errors = Object.values(
                responseData.errors
            )
                .flat()
                .filter(Boolean);

            if (errors.length > 0) {
                return errors.join(" ");
            }
        } catch {
            // Ignore parsing errors.
        }
    }

    if (error?.message) {
        return error.message;
    }

    return fallbackMessage;
}

// ============================================================
// USER PREFERENCES
// ============================================================

export async function getUserPreferences() {
    try {
        const response = await api.get(
            "/user-preferences"
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to load user preferences:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to load user preferences."
            )
        );
    }
}

export async function updateUserPreferences(
    payload
) {
    try {
        const response = await api.put(
            "/user-preferences",
            payload
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to update user preferences:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to update user preferences."
            )
        );
    }
}

// ============================================================
// SUPPORTED LANGUAGES
// ============================================================

export async function getSupportedLanguages() {
    try {
        const response = await api.get(
            "/user-preferences/languages"
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to load supported languages:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to load supported languages."
            )
        );
    }
}

// ============================================================
// NOTIFICATION SETTINGS
// ============================================================

export async function getNotificationSettings() {
    try {
        const response = await api.get(
            "/notification-settings"
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to load notification settings:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to load notification settings."
            )
        );
    }
}

export async function updateNotificationSettings(
    payload
) {
    try {
        const response = await api.put(
            "/notification-settings",
            payload
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to update notification settings:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to update notification settings."
            )
        );
    }
}

// ============================================================
// DASHBOARD PREFERENCES
// ============================================================

export async function getDashboardPreference() {
    try {
        const response = await api.get(
            "/preferences/dashboard"
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to load dashboard preferences:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to load dashboard preferences."
            )
        );
    }
}

export async function updateDashboardPreference(
    payload
) {
    try {
        const response = await api.put(
            "/preferences/dashboard",
            payload
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to update dashboard preferences:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to update dashboard preferences."
            )
        );
    }
}

export async function getAvailableDashboardWidgets() {
    try {
        const response = await api.get(
            "/preferences/dashboard/widgets"
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to load dashboard widgets:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to load dashboard widgets."
            )
        );
    }
}

export async function resetDashboardPreference() {
    try {
        const response = await api.post(
            "/preferences/dashboard/reset"
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to reset dashboard preferences:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to reset dashboard preferences."
            )
        );
    }
}

// ============================================================
// AI PREFERENCES
// ============================================================

export async function getAIPreference() {
    try {
        const response = await api.get(
            "/preferences/ai"
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to load AI preferences:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to load AI preferences."
            )
        );
    }
}

export async function updateAIPreference(
    payload
) {
    try {
        const response = await api.put(
            "/preferences/ai",
            payload
        );

        return unwrapResponse(response);
    } catch (error) {
        console.error(
            "Failed to update AI preferences:",
            error?.response?.data || error
        );

        throw new Error(
            getErrorMessage(
                error,
                "Failed to update AI preferences."
            )
        );
    }
}

// ============================================================
// LOAD ALL MANAGER SETTINGS
// ============================================================

export async function getManagerSettings() {
    const results = await Promise.allSettled([
        getUserPreferences(),
        getNotificationSettings(),
        getDashboardPreference(),
        getAIPreference(),
    ]);

    return {
        userPreferences:
            results[0].status === "fulfilled"
                ? results[0].value
                : null,

        notifications:
            results[1].status === "fulfilled"
                ? results[1].value
                : null,

        dashboard:
            results[2].status === "fulfilled"
                ? results[2].value
                : null,

        ai:
            results[3].status === "fulfilled"
                ? results[3].value
                : null,

        errors: results
            .map((result, index) => {
                if (result.status === "fulfilled") {
                    return null;
                }

                const names = [
                    "userPreferences",
                    "notifications",
                    "dashboard",
                    "ai",
                ];

                return {
                    section: names[index],
                    error: result.reason,
                };
            })
            .filter(Boolean),
    };
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

const managerSettingsService = {
    getUserPreferences,
    updateUserPreferences,

    getSupportedLanguages,

    getNotificationSettings,
    updateNotificationSettings,

    getDashboardPreference,
    updateDashboardPreference,
    getAvailableDashboardWidgets,
    resetDashboardPreference,

    getAIPreference,
    updateAIPreference,

    getManagerSettings,
};

export default managerSettingsService;
