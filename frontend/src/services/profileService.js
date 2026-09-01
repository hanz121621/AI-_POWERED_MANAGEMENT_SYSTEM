
// ============================================================
// AIPMS PROFILE SERVICE
//
// PM-PROFILE-001 — Update Profile
//
// IMPORTANT
// ------------------------------------------------------------
// This service does NOT use:
//   - localStorage
//   - sessionStorage
//   - hard-coded user IDs
//   - hard-coded profile data
//
// The authenticated user's identity comes from the backend
// through the authenticated request.
//
// Authorization is enforced by the backend.
// The frontend only sends the authenticated request.
// ============================================================


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5043";


// ============================================================
// API ERROR
// ============================================================

class ProfileApiError extends Error {
    constructor(
        message,
        status = null,
        code = null,
        details = null
    ) {
        super(message);

        this.name = "ProfileApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}


// ============================================================
// URL HELPER
// ============================================================

const buildUrl = (endpoint) => {
    const base = API_BASE_URL.replace(/\/+$/, "");

    const path = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

    return `${base}${path}`;
};


// ============================================================
// RESPONSE PARSER
// ============================================================

const parseResponse = async (response) => {
    const contentType =
        response.headers.get("content-type") || "";

    let body = null;

    try {
        if (
            contentType.includes(
                "application/json"
            )
        ) {
            body = await response.json();
        } else {
            const text = await response.text();

            body = text
                ? text
                : null;
        }
    } catch {
        body = null;
    }


    // ----------------------------------------------------------
    // ERROR RESPONSE
    // ----------------------------------------------------------

    if (!response.ok) {
        const errorCode =
            body?.code ??
            body?.errorCode ??
            body?.error ??
            body?.title ??
            `HTTP_${response.status}`;

        const message =
            body?.message ??
            body?.detail ??
            body?.title ??
            (
                typeof body === "string"
                    ? body
                    : "Unable to process profile request."
            );

        throw new ProfileApiError(
            message,
            response.status,
            errorCode,
            body
        );
    }

    return body;
};


// ============================================================
// API REQUEST
// ============================================================
//
// accessToken is intentionally supplied by the caller.
//
// Example:
//
// const result = await getMyProfile(
//     accessToken
// );
//
// This service does NOT retrieve the token from
// localStorage or sessionStorage.
// ============================================================

const apiRequest = async (
    endpoint,
    {
        accessToken = null,
        method = "GET",
        body = undefined,
        signal = undefined,
    } = {}
) => {

    const headers = {
        Accept: "application/json",
    };


    // ----------------------------------------------------------
    // JSON BODY
    // ----------------------------------------------------------

    if (body !== undefined) {
        headers["Content-Type"] =
            "application/json";
    }


    // ----------------------------------------------------------
    // AUTHENTICATION
    // ----------------------------------------------------------

    if (
        accessToken &&
        typeof accessToken === "string"
    ) {
        headers.Authorization =
            `Bearer ${accessToken}`;
    }


    // ----------------------------------------------------------
    // REQUEST
    // ----------------------------------------------------------

    const response = await fetch(
        buildUrl(endpoint),
        {
            method,
            headers,

            credentials: "include",

            body:
                body !== undefined
                    ? JSON.stringify(body)
                    : undefined,

            signal,
        }
    );

    return parseResponse(response);
};


// ============================================================
// RESPONSE DATA EXTRACTION
// ============================================================

const extractData = (response) => {

    if (
        response === null ||
        response === undefined
    ) {
        return null;
    }


    if (
        typeof response === "object" &&
        Object.prototype.hasOwnProperty.call(
            response,
            "data"
        )
    ) {
        return response.data;
    }


    return response;
};


// ============================================================
// ERROR RESPONSE
// ============================================================

const errorResponse = (
    error,
    defaultMessage
) => {

    console.error(
        "[ProfileService]",
        error
    );

    return {
        success: false,

        error:
            error?.code ??
            error?.message ??
            defaultMessage,

        message:
            error?.message ??
            defaultMessage,

        status:
            error?.status ?? null,

        code:
            error?.code ?? null,

        data: null,
    };
};


// ============================================================
// VALIDATION HELPERS
// ============================================================

const validateAccessToken = (
    accessToken
) => {

    if (
        !accessToken ||
        typeof accessToken !== "string"
    ) {
        return {
            valid: false,

            error:
                "AUTHENTICATION_REQUIRED",

            message:
                "Authentication is required.",
        };
    }


    return {
        valid: true,
    };
};


// ============================================================
// NORMALIZE PROFILE
// ============================================================
//
// The frontend does not create profile values.
//
// It only normalizes the structure returned by
// the backend so the UI can consume it consistently.
//
// Role and permissions are returned for display only.
// They must NOT be sent back as editable fields.
// ============================================================

const normalizeProfile = (
    response
) => {

    const data =
        extractData(response);


    if (
        !data ||
        typeof data !== "object"
    ) {
        return null;
    }


    return {
        ...data,

        id:
            data.id ??
            data.userId ??
            null,

        userId:
            data.userId ??
            data.id ??
            null,

        fullName:
            data.fullName ??
            data.name ??
            "",

        email:
            data.email ??
            "",

        phoneNumber:
            data.phoneNumber ??
            data.phone ??
            "",

        profilePicture:
            data.profilePicture ??
            data.profileImageUrl ??
            data.avatarUrl ??
            null,

        role:
            data.role ??
            data.roleName ??
            null,

        permissions:
            Array.isArray(
                data.permissions
            )
                ? data.permissions
                : [],
    };
};


// ============================================================
// GET CURRENT MANAGER PROFILE
//
// PM-PROFILE-001
//
// The backend identifies the current authenticated
// Manager from the authentication context.
//
// No user ID is supplied by the frontend.
// ============================================================

export const getMyProfile = async (
    accessToken = null,
    signal = undefined
) => {

    const auth =
        validateAccessToken(
            accessToken
        );


    if (!auth.valid) {
        return {
            success: false,
            error: auth.error,
            message: auth.message,
            data: null,
        };
    }


    try {

        const response =
            await apiRequest(
                "/api/profile/me",
                {
                    accessToken,
                    signal,
                }
            );


        const profile =
            normalizeProfile(
                response
            );


        return {
            success: true,
            data: profile,
            profile,
        };

    } catch (error) {

        return errorResponse(
            error,
            "Unable to load your profile."
        );
    }
};


// ============================================================
// UPDATE CURRENT MANAGER PROFILE
//
// PM-PROFILE-001
//
// IMPORTANT
// ------------------------------------------------------------
// The request intentionally does NOT contain:
//
// - userId
// - role
// - permissions
// - organizationId
// - teamId
// - projectId
//
// The backend identifies the current user from the
// authenticated request.
//
// This prevents the frontend from attempting to update
// another user's profile or change authorization data.
// ============================================================

export const updateMyProfile = async (
    profileData = {},
    accessToken = null,
    signal = undefined
) => {

    const auth =
        validateAccessToken(
            accessToken
        );


    if (!auth.valid) {
        return {
            success: false,
            error: auth.error,
            message: auth.message,
            data: null,
        };
    }


    if (
        !profileData ||
        typeof profileData !== "object"
    ) {
        return {
            success: false,

            error:
                "PROFILE_DATA_REQUIRED",

            message:
                "Profile information is required.",

            data: null,
        };
    }


    try {

        // ------------------------------------------------------
        // Only permitted profile fields are sent.
        // ------------------------------------------------------

        const payload = {
            fullName:
                profileData.fullName ??
                "",

            phoneNumber:
                profileData.phoneNumber ??
                "",

            email:
                profileData.email ??
                "",

            profilePicture:
                profileData.profilePicture ??
                null,
        };


        const response =
            await apiRequest(
                "/api/profile/me",
                {
                    accessToken,

                    method: "PUT",

                    body: payload,

                    signal,
                }
            );


        const profile =
            normalizeProfile(
                response
            );


        return {
            success: true,

            data: profile,

            profile,

            message:
                response?.message ??
                "Profile updated successfully.",
        };

    } catch (error) {

        return errorResponse(
            error,
            "Unable to update your profile."
        );
    }
};


// ============================================================
// CHANGE PASSWORD
//
// PM-PROFILE-001 — Alternative Flow A3
//
// The current authenticated user is identified by
// the access token.
//
// The frontend never sends a user ID.
//
// Backend is responsible for:
//
// - validating current password
// - validating new password
// - password policy
// - password hashing
// - security rules
// ============================================================

export const changeMyPassword = async (
    currentPassword,
    newPassword,
    accessToken = null,
    signal = undefined
) => {

    const auth =
        validateAccessToken(
            accessToken
        );


    if (!auth.valid) {
        return {
            success: false,
            error: auth.error,
            message: auth.message,
            data: null,
        };
    }


    if (
        !currentPassword ||
        typeof currentPassword !== "string"
    ) {
        return {
            success: false,

            error:
                "CURRENT_PASSWORD_REQUIRED",

            message:
                "Current password is required.",

            data: null,
        };
    }


    if (
        !newPassword ||
        typeof newPassword !== "string"
    ) {
        return {
            success: false,

            error:
                "NEW_PASSWORD_REQUIRED",

            message:
                "New password is required.",

            data: null,
        };
    }


    try {

        const response =
            await apiRequest(
                "/api/profile/me/password",
                {
                    accessToken,

                    method: "PUT",

                    body: {
                        currentPassword,
                        newPassword,
                    },

                    signal,
                }
            );


        return {
            success: true,

            data:
                extractData(
                    response
                ),

            message:
                response?.message ??
                "Password updated successfully.",
        };

    } catch (error) {

        return errorResponse(
            error,
            "Unable to change your password."
        );
    }
};


// ============================================================
// UPDATE PROFILE PICTURE
//
// Optional endpoint if the backend supports a dedicated
// profile-picture operation.
//
// The authenticated user is identified from the token.
// ============================================================

export const updateMyProfilePicture = async (
    profilePicture,
    accessToken = null,
    signal = undefined
) => {

    const auth =
        validateAccessToken(
            accessToken
        );


    if (!auth.valid) {
        return {
            success: false,
            error: auth.error,
            message: auth.message,
            data: null,
        };
    }


    if (
        profilePicture === null ||
        profilePicture === undefined ||
        profilePicture === ""
    ) {
        return {
            success: false,

            error:
                "PROFILE_PICTURE_REQUIRED",

            message:
                "Profile picture is required.",

            data: null,
        };
    }


    try {

        const response =
            await apiRequest(
                "/api/profile/me/picture",
                {
                    accessToken,

                    method: "PUT",

                    body: {
                        profilePicture,
                    },

                    signal,
                }
            );


        const profile =
            normalizeProfile(
                response
            );


        return {
            success: true,

            data: profile,

            profile,

            message:
                response?.message ??
                "Profile picture updated successfully.",
        };

    } catch (error) {

        return errorResponse(
            error,
            "Unable to update your profile picture."
        );
    }
};


// ============================================================
// PROFILE VALIDATION
//
// This is UI-level validation only.
//
// Backend validation remains authoritative.
// ============================================================

export const validateProfileForm = (
    profileData = {}
) => {

    const errors = {};


    const fullName =
        String(
            profileData.fullName ?? ""
        ).trim();


    const email =
        String(
            profileData.email ?? ""
        ).trim();


    const phoneNumber =
        String(
            profileData.phoneNumber ?? ""
        ).trim();


    // ----------------------------------------------------------
    // FULL NAME
    // ----------------------------------------------------------

    if (!fullName) {
        errors.fullName =
            "Full name is required.";
    }


    // ----------------------------------------------------------
    // EMAIL
    // ----------------------------------------------------------

    if (!email) {

        errors.email =
            "Email address is required.";

    } else {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {
            errors.email =
                "Please enter a valid email address.";
        }
    }


    // ----------------------------------------------------------
    // PHONE
    // ----------------------------------------------------------

    if (!phoneNumber) {
        errors.phoneNumber =
            "Phone number is required.";
    }


    return {
        valid:
            Object.keys(errors)
                .length === 0,

        errors,
    };
};


// ============================================================
// PASSWORD VALIDATION
//
// Only basic frontend validation is performed here.
//
// The backend remains responsible for the actual password
// policy.
// ============================================================

export const validatePasswordForm = (
    currentPassword,
    newPassword,
    confirmPassword
) => {

    const errors = {};


    if (!currentPassword) {
        errors.currentPassword =
            "Current password is required.";
    }


    if (!newPassword) {
        errors.newPassword =
            "New password is required.";
    }


    if (!confirmPassword) {
        errors.confirmPassword =
            "Please confirm your new password.";
    }


    if (
        newPassword &&
        confirmPassword &&
        newPassword !== confirmPassword
    ) {
        errors.confirmPassword =
            "Passwords do not match.";
    }


    return {
        valid:
            Object.keys(errors)
                .length === 0,

        errors,
    };
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    updateMyProfilePicture,
    validateProfileForm,
    validatePasswordForm,
};

