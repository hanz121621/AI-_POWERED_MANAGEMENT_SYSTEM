
import axios from "axios";

// ============================================================
// API CLIENT
// ============================================================

const api = axios.create({
    baseURL: "http://localhost:5043/api",

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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

    for (const key of TOKEN_KEYS) {
        const value = localStorage.getItem(key);

        if (value && String(value).trim()) {
            return String(value).trim();
        }
    }

    // --------------------------------------------------------
    // 2. Authentication objects
    // --------------------------------------------------------

    for (const key of AUTH_KEYS) {
        try {
            const stored = localStorage.getItem(key);

            if (!stored) {
                continue;
            }

            const parsed = JSON.parse(stored);

            const token =
                parsed?.accessToken ??
                parsed?.token ??
                parsed?.access_token ??
                null;

            if (token && String(token).trim()) {
                return String(token).trim();
            }
        } catch {
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
        const token = getAccessToken();

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
            "FULL URL:",
            `${config.baseURL || ""}${config.url || ""}`
        );

        console.log(
            "TOKEN:",
            token ? "AVAILABLE" : "NOT FOUND"
        );

        // ----------------------------------------------------
        // Request body
        // ----------------------------------------------------

        if (config.data) {
            console.log(
                "REQUEST BODY:",
                config.data
            );

            try {
                console.log(
                    "REQUEST BODY JSON:",
                    JSON.stringify(
                        config.data,
                        null,
                        2
                    )
                );
            } catch {
                console.warn(
                    "Unable to stringify request body."
                );
            }
        }

        // ----------------------------------------------------
        // Attach JWT token
        // ----------------------------------------------------

        if (
            token &&
            config.url !== "/Auth/login"
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
            config.url === "/Auth/login"
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
        console.error(
            "========== REQUEST SETUP ERROR =========="
        );

        console.error(
            "ERROR:",
            error
        );

        console.error(
            "=========================================="
        );

        return Promise.reject(error);
    }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
    (response) => {
        console.log(
            "========== API RESPONSE =========="
        );

        console.log(
            "STATUS:",
            response.status
        );

        console.log(
            "METHOD:",
            response.config?.method?.toUpperCase()
        );

        console.log(
            "URL:",
            response.config?.url
        );

        console.log(
            "RESPONSE DATA:",
            response.data
        );

        try {
            console.log(
                "RESPONSE DATA JSON:",
                JSON.stringify(
                    response.data,
                    null,
                    2
                )
            );
        } catch {
            console.warn(
                "Unable to stringify response data."
            );
        }

        console.log(
            "=================================="
        );

        return response;
    },

    (error) => {
        const status =
            error?.response?.status;

        const responseData =
            error?.response?.data;

        const requestConfig =
            error?.config;

        // ----------------------------------------------------
        // GENERAL ERROR INFORMATION
        // ----------------------------------------------------

        console.error(
            "========== API ERROR =========="
        );

        console.error(
            "STATUS:",
            status ?? "NO STATUS"
        );

        console.error(
            "METHOD:",
            requestConfig?.method?.toUpperCase()
        );

        console.error(
            "URL:",
            requestConfig?.url
        );

        console.error(
            "FULL URL:",
            `${requestConfig?.baseURL || ""}${requestConfig?.url || ""}`
        );

        // ----------------------------------------------------
        // REQUEST BODY
        // ----------------------------------------------------

        if (requestConfig?.data) {
            console.error(
                "REQUEST BODY:",
                requestConfig.data
            );

            try {
                const parsedRequestData =
                    typeof requestConfig.data === "string"
                        ? JSON.parse(requestConfig.data)
                        : requestConfig.data;

                console.error(
                    "REQUEST BODY JSON:",
                    JSON.stringify(
                        parsedRequestData,
                        null,
                        2
                    )
                );
            } catch {
                console.error(
                    "Unable to parse request body."
                );
            }
        }

        // ----------------------------------------------------
        // BACKEND RESPONSE
        // ----------------------------------------------------

        console.error(
            "BACKEND RESPONSE:",
            responseData
        );

        try {
            console.error(
                "BACKEND RESPONSE JSON:",
                JSON.stringify(
                    responseData,
                    null,
                    2
                )
            );
        } catch {
            console.error(
                "Unable to stringify backend response."
            );
        }

        // ----------------------------------------------------
        // 400 BAD REQUEST
        // ----------------------------------------------------

        if (status === 400) {
            console.error(
                "========== 400 BAD REQUEST =========="
            );

            console.error(
                "The server rejected the request."
            );

            console.error(
                "This usually means the request body",
                "does not match the backend DTO or",
                "backend validation failed."
            );

            console.error(
                "REQUEST BODY:",
                requestConfig?.data
            );

            console.error(
                "BACKEND ERROR:",
                responseData
            );

            // ASP.NET Core validation errors
            if (responseData?.errors) {
                console.error(
                    "VALIDATION ERRORS:"
                );

                console.error(
                    JSON.stringify(
                        responseData.errors,
                        null,
                        2
                    )
                );
            }

            console.error(
                "===================================="
            );
        }

        // ----------------------------------------------------
        // 401 UNAUTHORIZED
        // ----------------------------------------------------

        if (status === 401) {
            console.error(
                "========== 401 UNAUTHORIZED =========="
            );

            console.error(
                "METHOD:",
                requestConfig?.method?.toUpperCase()
            );

            console.error(
                "URL:",
                requestConfig?.url
            );

            console.error(
                "AUTHORIZATION HEADER:",
                requestConfig?.headers
                    ?.Authorization
                    ? "SENT"
                    : "NOT SENT"
            );

            console.error(
                "BACKEND RESPONSE:",
                responseData
            );

            console.error(
                "======================================="
            );

            // IMPORTANT:
            // Do NOT clear localStorage here.
        }

        // ----------------------------------------------------
        // 403 FORBIDDEN
        // ----------------------------------------------------

        if (status === 403) {
            console.error(
                "========== 403 FORBIDDEN =========="
            );

            console.error(
                "METHOD:",
                requestConfig?.method?.toUpperCase()
            );

            console.error(
                "URL:",
                requestConfig?.url
            );

            console.error(
                "BACKEND RESPONSE:",
                responseData
            );

            console.error(
                "==================================="
            );
        }

        // ----------------------------------------------------
        // 404 NOT FOUND
        // ----------------------------------------------------

        if (status === 404) {
            console.error(
                "========== 404 NOT FOUND =========="
            );

            console.error(
                "The requested API endpoint was not found."
            );

            console.error(
                "URL:",
                requestConfig?.url
            );

            console.error(
                "==================================="
            );
        }

        // ----------------------------------------------------
        // 409 CONFLICT
        // ----------------------------------------------------

        if (status === 409) {
            console.error(
                "========== 409 CONFLICT =========="
            );

            console.error(
                "The server rejected the request because",
                "of a resource conflict."
            );

            console.error(
                "BACKEND RESPONSE:",
                responseData
            );

            console.error(
                "=================================="
            );
        }

        // ----------------------------------------------------
        // 422 UNPROCESSABLE ENTITY
        // ----------------------------------------------------

        if (status === 422) {
            console.error(
                "========== 422 UNPROCESSABLE ENTITY =========="
            );

            console.error(
                "The server could not process the supplied data."
            );

            console.error(
                "BACKEND RESPONSE:",
                responseData
            );

            console.error(
                "==============================================="
            );
        }

        // ----------------------------------------------------
        // 500+ SERVER ERRORS
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
                requestConfig?.url
            );

            console.error(
                "BACKEND RESPONSE:",
                responseData
            );

            console.error(
                "=================================="
            );
        }

        // ----------------------------------------------------
        // NETWORK ERROR
        // ----------------------------------------------------

        if (!error.response) {
            console.error(
                "========== NETWORK ERROR =========="
            );

            console.error(
                "The request did not receive a response."
            );

            console.error(
                "Possible causes:"
            );

            console.error(
                "1. Backend API is not running."
            );

            console.error(
                "2. Incorrect API URL."
            );

            console.error(
                "3. CORS configuration."
            );

            console.error(
                "4. Network connection problem."
            );

            console.error(
                "ERROR MESSAGE:",
                error.message
            );

            console.error(
                "==================================="
            );
        }

        console.error(
            "================================="
        );

        return Promise.reject(error);
    }
);

// ============================================================
// AI
// ============================================================

export const generateAIResponse = async (
    prompt
) => {
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
