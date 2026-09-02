
import axios from "axios";

// ============================================================
// API CLIENT
// ============================================================

const api = axios.create({
    baseURL:
        "http://localhost:5043/api",

    headers: {
        "Content-Type":
            "application/json",

        Accept:
            "application/json",
    },
});

// ============================================================
// TOKEN STORAGE KEYS
// ============================================================

const TOKEN_KEYS = [
    "token",
    "accessToken",
    "aipms_access_token",
];

// ============================================================
// AUTH OBJECT STORAGE KEYS
// ============================================================

const AUTH_KEYS = [
    "auth",
    "authData",
    "aipms_auth",
];

// ============================================================
// GET ACCESS TOKEN
// ============================================================

function getAccessToken() {
    // --------------------------------------------------------
    // 1. Direct token storage
    // --------------------------------------------------------

    for (
        const key of TOKEN_KEYS
    ) {
        const value =
            localStorage.getItem(
                key
            );

        if (
            value &&
            String(value).trim()
        ) {
            return String(
                value
            ).trim();
        }
    }

    // --------------------------------------------------------
    // 2. Authentication objects
    // --------------------------------------------------------

    for (
        const key of AUTH_KEYS
    ) {
        try {
            const stored =
                localStorage.getItem(
                    key
                );

            if (!stored) {
                continue;
            }

            const parsed =
                JSON.parse(
                    stored
                );

            const token =
                parsed?.accessToken ??
                parsed?.token ??
                parsed?.access_token ??
                null;

            if (
                token &&
                String(token).trim()
            ) {
                return String(
                    token
                ).trim();
            }
        } catch (error) {
            console.warn(
                `Unable to parse localStorage "${key}".`
            );
        }
    }

    return null;
}

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
    (config) => {
        const token =
            getAccessToken();

        console.log(
            "========== API REQUEST =========="
        );

        console.log(
            "METHOD:",
            config.method?.toUpperCase()
        );

        console.log(
            "URL:",
            config.url
        );

        console.log(
            "TOKEN:",
            token
                ? "AVAILABLE"
                : "NOT FOUND"
        );

        // ----------------------------------------------------
        // Do not attach token to login request.
        // ----------------------------------------------------

        if (
            token &&
            config.url !==
                "/Auth/login"
        ) {
            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;

            console.log(
                "AUTHORIZATION:",
                "Bearer token attached"
            );
        } else if (
            config.url ===
            "/Auth/login"
        ) {
            console.log(
                "AUTHORIZATION:",
                "Login request - no token required"
            );
        } else {
            console.warn(
                "AUTHORIZATION:",
                "No token available"
            );
        }

        console.log(
            "================================="
        );

        return config;
    },

    (error) => {
        return Promise.reject(
            error
        );
    }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status =
            error?.response?.status;

        // ----------------------------------------------------
        // 401
        // ----------------------------------------------------

        if (status === 401) {
            console.error(
                "========== 401 UNAUTHORIZED =========="
            );

            console.error(
                "METHOD:",
                error?.config?.method?.toUpperCase()
            );

            console.error(
                "URL:",
                error?.config?.url
            );

            console.error(
                "AUTHORIZATION HEADER:",
                error?.config?.headers
                    ?.Authorization
                    ? "SENT"
                    : "NOT SENT"
            );

            console.error(
                "BACKEND RESPONSE:",
                error?.response?.data
            );

            console.error(
                "======================================="
            );

            // IMPORTANT:
            // Do NOT clear localStorage here.
            //
            // This prevents a random 401 from immediately
            // destroying the login session.
        }

        // ----------------------------------------------------
        // 403
        // ----------------------------------------------------

        if (status === 403) {
            console.error(
                "========== 403 FORBIDDEN =========="
            );

            console.error(
                "METHOD:",
                error?.config?.method?.toUpperCase()
            );

            console.error(
                "URL:",
                error?.config?.url
            );

            console.error(
                "BACKEND RESPONSE:",
                error?.response?.data
            );

            console.error(
                "==================================="
            );
        }

        // ----------------------------------------------------
        // 500+
        // ----------------------------------------------------

        if (
            status &&
            status >= 500
        ) {
            console.error(
                "========== SERVER ERROR =========="
            );

            console.error(
                "STATUS:",
                status
            );

            console.error(
                "URL:",
                error?.config?.url
            );

            console.error(
                "BACKEND RESPONSE:",
                error?.response?.data
            );

            console.error(
                "=================================="
            );
        }

        return Promise.reject(
            error
        );
    }
);
// ============================================================
// AI
// ============================================================

export const generateAIResponse = async (prompt) => {
    const response = await api.post(
        "/AI/generate",
        {
            prompt: prompt,
        }
    );

    return response.data;
};
// ============================================================
// EXPORT
// ============================================================
export default api;
