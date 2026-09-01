// ============================================================
// AIPMS AI PREFERENCES SERVICE
// SET-005 — Manage AI Preferences
//
// Purpose:
// - Store Manager-specific AI preferences
// - Retrieve preferences for the authenticated Manager
// - Validate configurable AI preferences
// - Keep AI preferences separate from permissions/security
// ============================================================

const AI_PREFERENCES_KEY = "aipms_manager_ai_preferences";

// ============================================================
// DEFAULT AI PREFERENCES
// ============================================================

export const DEFAULT_AI_PREFERENCES = {
    enableRecommendations: true,
    enableAINotifications: true,
    enableDelayWarnings: true,
    summaryFrequency: "daily",
    recommendationDisplay: "dashboard",
    insightVisibility: true,
    notificationPriority: "important",
};

// ============================================================
// ALLOWED VALUES
// ============================================================

const VALID_SUMMARY_FREQUENCIES = [
    "realtime",
    "daily",
    "weekly",
    "never",
];

const VALID_RECOMMENDATION_DISPLAYS = [
    "dashboard",
    "notifications",
    "both",
];

const VALID_NOTIFICATION_PRIORITIES = [
    "low",
    "normal",
    "important",
    "high",
];

// ============================================================
// GET CURRENT USER
// ============================================================

const getCurrentUser = () => {
    try {
        const storedUser = localStorage.getItem(
            "aipms_current_user"
        );

        if (!storedUser) {
            return null;
        }

        return JSON.parse(storedUser);
    } catch (error) {
        console.error(
            "Failed to read current user:",
            error
        );

        return null;
    }
};

// ============================================================
// GET MANAGER ID
// ============================================================

const getManagerId = () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return null;
    }

    return (
        currentUser.id ||
        currentUser.userId ||
        currentUser.email ||
        null
    );
};

// ============================================================
// STORAGE KEY
//
// Preferences are associated with the authenticated Manager.
// ============================================================

const getStorageKey = () => {
    const managerId = getManagerId();

    if (!managerId) {
        return AI_PREFERENCES_KEY;
    }

    return `${AI_PREFERENCES_KEY}_${managerId}`;
};

// ============================================================
// NORMALIZE PREFERENCES
// ============================================================

const normalizeAIPreferences = (preferences = {}) => {
    return {
        ...DEFAULT_AI_PREFERENCES,
        ...preferences,
        enableRecommendations:
            typeof preferences.enableRecommendations ===
            "boolean"
                ? preferences.enableRecommendations
                : DEFAULT_AI_PREFERENCES.enableRecommendations,

        enableAINotifications:
            typeof preferences.enableAINotifications ===
            "boolean"
                ? preferences.enableAINotifications
                : DEFAULT_AI_PREFERENCES.enableAINotifications,

        enableDelayWarnings:
            typeof preferences.enableDelayWarnings ===
            "boolean"
                ? preferences.enableDelayWarnings
                : DEFAULT_AI_PREFERENCES.enableDelayWarnings,

        insightVisibility:
            typeof preferences.insightVisibility ===
            "boolean"
                ? preferences.insightVisibility
                : DEFAULT_AI_PREFERENCES.insightVisibility,

        summaryFrequency:
            VALID_SUMMARY_FREQUENCIES.includes(
                preferences.summaryFrequency
            )
                ? preferences.summaryFrequency
                : DEFAULT_AI_PREFERENCES.summaryFrequency,

        recommendationDisplay:
            VALID_RECOMMENDATION_DISPLAYS.includes(
                preferences.recommendationDisplay
            )
                ? preferences.recommendationDisplay
                : DEFAULT_AI_PREFERENCES.recommendationDisplay,

        notificationPriority:
            VALID_NOTIFICATION_PRIORITIES.includes(
                preferences.notificationPriority
            )
                ? preferences.notificationPriority
                : DEFAULT_AI_PREFERENCES.notificationPriority,
    };
};

// ============================================================
// VALIDATE PREFERENCES
// ============================================================

export const validateAIPreferences = (
    preferences
) => {
    if (
        !preferences ||
        typeof preferences !== "object" ||
        Array.isArray(preferences)
    ) {
        throw new Error(
            "INVALID_AI_PREFERENCES"
        );
    }

    if (
        typeof preferences.enableRecommendations !==
        "boolean"
    ) {
        throw new Error(
            "INVALID_AI_RECOMMENDATIONS"
        );
    }

    if (
        typeof preferences.enableAINotifications !==
        "boolean"
    ) {
        throw new Error(
            "INVALID_AI_NOTIFICATIONS"
        );
    }

    if (
        typeof preferences.enableDelayWarnings !==
        "boolean"
    ) {
        throw new Error(
            "INVALID_DELAY_WARNINGS"
        );
    }

    if (
        typeof preferences.insightVisibility !==
        "boolean"
    ) {
        throw new Error(
            "INVALID_INSIGHT_VISIBILITY"
        );
    }

    if (
        !VALID_SUMMARY_FREQUENCIES.includes(
            preferences.summaryFrequency
        )
    ) {
        throw new Error(
            "INVALID_SUMMARY_FREQUENCY"
        );
    }

    if (
        !VALID_RECOMMENDATION_DISPLAYS.includes(
            preferences.recommendationDisplay
        )
    ) {
        throw new Error(
            "INVALID_RECOMMENDATION_DISPLAY"
        );
    }

    if (
        !VALID_NOTIFICATION_PRIORITIES.includes(
            preferences.notificationPriority
        )
    ) {
        throw new Error(
            "INVALID_NOTIFICATION_PRIORITY"
        );
    }

    return true;
};

// ============================================================
// GET AI PREFERENCES
//
// SET-005 — Main Success Scenario Step 3
// ============================================================

export const getAIPreferences = async () => {
    try {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            throw new Error(
                "AUTHENTICATION_REQUIRED"
            );
        }

        // ----------------------------------------------------
        // BUSINESS RULE 1
        // AI preferences belong to authenticated Manager.
        // ----------------------------------------------------

        if (
            currentUser.role &&
            currentUser.role !== "Manager"
        ) {
            throw new Error(
                "ACCESS_DENIED"
            );
        }

        const storageKey = getStorageKey();

        const storedPreferences =
            localStorage.getItem(storageKey);

        if (!storedPreferences) {
            return {
                ...DEFAULT_AI_PREFERENCES,
            };
        }

        const parsedPreferences =
            JSON.parse(storedPreferences);

        return normalizeAIPreferences(
            parsedPreferences
        );
    } catch (error) {
        console.error(
            "Failed to get AI preferences:",
            error
        );

        throw error;
    }
};

// ============================================================
// UPDATE AI PREFERENCES
//
// SET-005 — Main Success Scenario Steps 5–7
// ============================================================

export const updateAIPreferences = async (
    preferences
) => {
    try {
        const currentUser = getCurrentUser();

        // ----------------------------------------------------
        // AUTHENTICATION
        // ----------------------------------------------------

        if (!currentUser) {
            throw new Error(
                "AUTHENTICATION_REQUIRED"
            );
        }

        // ----------------------------------------------------
        // BUSINESS RULE 1
        // Only authenticated Manager can update preferences.
        // ----------------------------------------------------

        if (
            currentUser.role &&
            currentUser.role !== "Manager"
        ) {
            throw new Error(
                "ACCESS_DENIED"
            );
        }

        // ----------------------------------------------------
        // NORMALIZE
        // ----------------------------------------------------

        const normalized =
            normalizeAIPreferences(
                preferences
            );

        // ----------------------------------------------------
        // VALIDATION
        //
        // SET-005 Step 6
        // ----------------------------------------------------

        validateAIPreferences(
            normalized
        );

        // ----------------------------------------------------
        // STORE
        //
        // SET-005 Step 7
        //
        // This local implementation provides the persistence
        // layer until your backend API endpoint is connected.
        // ----------------------------------------------------

        const storageKey =
            getStorageKey();

        localStorage.setItem(
            storageKey,
            JSON.stringify(normalized)
        );

        // Keep compatibility with ManagerSettings.jsx
        // and existing AIPMS local storage.
        localStorage.setItem(
            AI_PREFERENCES_KEY,
            JSON.stringify(normalized)
        );

        // ----------------------------------------------------
        // NOTIFY AI FEATURES
        //
        // SET-005 Step 8
        // ----------------------------------------------------

        window.dispatchEvent(
            new CustomEvent(
                "aipms-ai-preferences-changed",
                {
                    detail: normalized,
                }
            )
        );

        return {
            success: true,
            data: normalized,
        };
    } catch (error) {
        console.error(
            "Failed to update AI preferences:",
            error
        );

        return {
            success: false,
            error:
                error?.message ||
                "Unable to update AI preferences.",
        };
    }
};

// ============================================================
// RESET AI PREFERENCES
// ============================================================

export const resetAIPreferences = async () => {
    try {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            throw new Error(
                "AUTHENTICATION_REQUIRED"
            );
        }

        if (
            currentUser.role &&
            currentUser.role !== "Manager"
        ) {
            throw new Error(
                "ACCESS_DENIED"
            );
        }

        const defaults = {
            ...DEFAULT_AI_PREFERENCES,
        };

        const storageKey =
            getStorageKey();

        localStorage.setItem(
            storageKey,
            JSON.stringify(defaults)
        );

        localStorage.setItem(
            AI_PREFERENCES_KEY,
            JSON.stringify(defaults)
        );

        window.dispatchEvent(
            new CustomEvent(
                "aipms-ai-preferences-changed",
                {
                    detail: defaults,
                }
            )
        );

        return {
            success: true,
            data: defaults,
        };
    } catch (error) {
        console.error(
            "Failed to reset AI preferences:",
            error
        );

        return {
            success: false,
            error:
                error?.message ||
                "Unable to reset AI preferences.",
        };
    }
};

// ============================================================
// CHECK WHETHER AN AI FEATURE IS ENABLED
// ============================================================

export const isAIFeatureEnabled = async (
    feature
) => {
    const preferences =
        await getAIPreferences();

    switch (feature) {
        case "recommendations":
            return (
                preferences.enableRecommendations
            );

        case "notifications":
            return (
                preferences.enableAINotifications
            );

        case "delayWarnings":
            return (
                preferences.enableDelayWarnings
            );

        case "insights":
            return (
                preferences.insightVisibility
            );

        default:
            return false;
    }
};

// ============================================================
// GET DEFAULTS
// ============================================================

export const getDefaultAIPreferences = () => {
    return {
        ...DEFAULT_AI_PREFERENCES,
    };
};

// ============================================================
// EXPORT VALID OPTIONS
// ============================================================

export const AI_PREFERENCE_OPTIONS = {
    summaryFrequencies: [
        ...VALID_SUMMARY_FREQUENCIES,
    ],

    recommendationDisplays: [
        ...VALID_RECOMMENDATION_DISPLAYS,
    ],

    notificationPriorities: [
        ...VALID_NOTIFICATION_PRIORITIES,
    ],
};