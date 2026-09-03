import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Bell,
    Bot,
    Check,
    ChevronDown,
    Globe,
    LayoutDashboard,
    Loader2,
    Monitor,
    Moon,
    Palette,
    RotateCcw,
    Save,
    Settings as SettingsIcon,
    Sun,
} from "lucide-react";

import managerSettingsService from "@/services/managerSettingsService";
import { getCurrentUser, getMyProfile } from "@/services/authService";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";


// ============================================================
// AIPMS — MANAGER SETTINGS
//
// Use Cases:
// SET-002 — Change Language Preference
// SET-003 — Change Theme Preference
//
// Additional preference sections:
// - Notifications
// - Dashboard
// - AI Preferences
//
// IMPORTANT:
// - User preferences are persisted by the backend.
// - Theme/language are NOT stored in localStorage.
// - Authentication token may still use localStorage.
// - Database is the source of truth.
// - next-themes is used only to apply the selected theme.
// ============================================================


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {
    language: "en",
    theme: "system",

    notifications: {
        emailNotifications: true,
        sprintUpdates: true,
        taskUpdates: true,
        aiAlerts: true,
        systemNotifications: true,
    },

    notificationChannels: {
        email: true,
        inApp: true,
    },

    dashboard: {
        projectProgress: true,
        sprintProgress: true,
        projectTimeline: true,
        risksIssues: true,
        teamProgress: true,
        deadlineInformation: true,
        aiRecommendations: true,
        aiRiskPrediction: true,
        recentActivity: true,
        notifications: true,
    },

    ai: {
        aiRecommendations: true,
        aiNotifications: true,
        delayWarnings: true,
        aiInsightVisibility: true,
        summaryFrequency: "daily",
        recommendationDisplay: "detailed",
        notificationPriority: "important",
    },
};


// ============================================================
// BACKEND-SUPPORTED LANGUAGES
//
// Matches:
// SystemSetting.AvailableLanguages
//
// en,am,fr,zh,es,ar,pt,de
// ============================================================

const LANGUAGE_OPTIONS = [
    {
        code: "en",
        name: "English",
        nativeName: "English",
    },
    {
        code: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
    },
    {
        code: "fr",
        name: "French",
        nativeName: "Français",
    },
    {
        code: "zh",
        name: "Chinese",
        nativeName: "中文",
    },
    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
    },
    {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
    },
    {
        code: "pt",
        name: "Portuguese",
        nativeName: "Português",
    },
    {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
    },
];


// ============================================================
// HELPERS
// ============================================================

function cloneDefaults() {
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}


function normalizeLanguage(value) {
    const language = String(value || "")
        .trim()
        .toLowerCase();

    return LANGUAGE_OPTIONS.some(
        (item) => item.code === language
    )
        ? language
        : "en";
}


function normalizeTheme(value) {
    const theme = String(value || "")
        .trim()
        .toLowerCase();

    return ["light", "dark", "system"].includes(theme)
        ? theme
        : "system";
}


function getValue(object, ...keys) {
    if (!object) return undefined;

    for (const key of keys) {
        if (
            Object.prototype.hasOwnProperty.call(
                object,
                key
            )
        ) {
            return object[key];
        }
    }

    return undefined;
}


function toBoolean(value, fallback) {
    if (typeof value === "boolean") {
        return value;
    }

    return fallback;
}


// ============================================================
// MAP BACKEND DATA → FRONTEND SETTINGS
// ============================================================

function mapBackendToSettings(
    backendData,
    fallbackSettings = DEFAULT_SETTINGS
) {
    const next = cloneDefaults();

    // --------------------------------------------------------
    // USER PREFERENCES
    // --------------------------------------------------------

    const userPreferences =
        backendData?.userPreferences;

    const backendLanguage = getValue(
        userPreferences,
        "languagePreference",
        "LanguagePreference"
    );

    const backendTheme = getValue(
        userPreferences,
        "themePreference",
        "ThemePreference"
    );

    next.language = normalizeLanguage(
        backendLanguage ??
        fallbackSettings.language
    );

    next.theme = normalizeTheme(
        backendTheme ??
        fallbackSettings.theme
    );


    // --------------------------------------------------------
    // NOTIFICATIONS
    // --------------------------------------------------------

    const notifications =
        backendData?.notifications;

    if (notifications) {
        next.notifications.emailNotifications =
            toBoolean(
                getValue(
                    notifications,
                    "emailNotifications",
                    "EmailNotifications"
                ),
                fallbackSettings.notifications
                    .emailNotifications
            );

        next.notifications.sprintUpdates =
            toBoolean(
                getValue(
                    notifications,
                    "sprintUpdates",
                    "SprintUpdates"
                ),
                fallbackSettings.notifications
                    .sprintUpdates
            );

        next.notifications.taskUpdates =
            toBoolean(
                getValue(
                    notifications,
                    "taskUpdates",
                    "TaskUpdates"
                ),
                fallbackSettings.notifications
                    .taskUpdates
            );

        next.notifications.aiAlerts =
            toBoolean(
                getValue(
                    notifications,
                    "aiAlerts",
                    "AIAlerts"
                ),
                fallbackSettings.notifications
                    .aiAlerts
            );

        next.notifications.systemNotifications =
            toBoolean(
                getValue(
                    notifications,
                    "systemNotifications",
                    "SystemNotifications"
                ),
                fallbackSettings.notifications
                    .systemNotifications
            );

        next.notificationChannels.email =
            toBoolean(
                getValue(
                    notifications,
                    "email",
                    "Email"
                ),
                fallbackSettings.notificationChannels
                    .email
            );

        next.notificationChannels.inApp =
            toBoolean(
                getValue(
                    notifications,
                    "inApp",
                    "InApp"
                ),
                fallbackSettings.notificationChannels
                    .inApp
            );
    }


    // --------------------------------------------------------
    // DASHBOARD
    // --------------------------------------------------------

    const dashboard =
        backendData?.dashboard;

    if (dashboard) {
        const dashboardKeys = [
            "projectProgress",
            "sprintProgress",
            "projectTimeline",
            "risksIssues",
            "teamProgress",
            "deadlineInformation",
            "aiRecommendations",
            "aiRiskPrediction",
            "recentActivity",
            "notifications",
        ];

        for (const key of dashboardKeys) {
            const pascalKey =
                key.charAt(0).toUpperCase() +
                key.slice(1);

            next.dashboard[key] =
                toBoolean(
                    getValue(
                        dashboard,
                        key,
                        pascalKey
                    ),
                    fallbackSettings.dashboard[key]
                );
        }
    }


    // --------------------------------------------------------
    // AI
    // --------------------------------------------------------

    const ai = backendData?.ai;

    if (ai) {
        next.ai.aiRecommendations =
            toBoolean(
                getValue(
                    ai,
                    "aiRecommendations",
                    "AIRecommendations"
                ),
                fallbackSettings.ai.aiRecommendations
            );

        next.ai.aiNotifications =
            toBoolean(
                getValue(
                    ai,
                    "aiNotifications",
                    "AINotifications"
                ),
                fallbackSettings.ai.aiNotifications
            );

        next.ai.delayWarnings =
            toBoolean(
                getValue(
                    ai,
                    "delayWarnings",
                    "DelayWarnings"
                ),
                fallbackSettings.ai.delayWarnings
            );

        next.ai.aiInsightVisibility =
            toBoolean(
                getValue(
                    ai,
                    "aiInsightVisibility",
                    "AIInsightVisibility"
                ),
                fallbackSettings.ai.aiInsightVisibility
            );

        next.ai.summaryFrequency =
            getValue(
                ai,
                "summaryFrequency",
                "SummaryFrequency"
            ) ??
            fallbackSettings.ai.summaryFrequency;

        next.ai.recommendationDisplay =
            getValue(
                ai,
                "recommendationDisplay",
                "RecommendationDisplay"
            ) ??
            fallbackSettings.ai.recommendationDisplay;

        next.ai.notificationPriority =
            getValue(
                ai,
                "notificationPriority",
                "NotificationPriority"
            ) ??
            fallbackSettings.ai.notificationPriority;
    }

    return next;
}


// ============================================================
// PAYLOAD BUILDERS
// ============================================================

function buildUserPreferencePayload(
    settings,
    backendUserPreferences
) {
    return {
        LanguagePreference:
            normalizeLanguage(settings.language),

        ThemePreference:
            normalizeTheme(settings.theme),

        CustomThemeId:
            backendUserPreferences?.customThemeId ??
            backendUserPreferences?.CustomThemeId ??
            null,
    };
}


function buildNotificationPayload(settings) {
    return {
        EmailNotifications:
            Boolean(
                settings.notifications
                    .emailNotifications
            ),

        SprintUpdates:
            Boolean(
                settings.notifications
                    .sprintUpdates
            ),

        TaskUpdates:
            Boolean(
                settings.notifications
                    .taskUpdates
            ),

        AIAlerts:
            Boolean(
                settings.notifications
                    .aiAlerts
            ),

        SystemNotifications:
            Boolean(
                settings.notifications
                    .systemNotifications
            ),

        Email:
            Boolean(
                settings.notificationChannels
                    .email
            ),

        InApp:
            Boolean(
                settings.notificationChannels
                    .inApp
            ),
    };
}


function buildDashboardPayload(settings) {
    return {
        ProjectProgress:
            Boolean(
                settings.dashboard
                    .projectProgress
            ),

        SprintProgress:
            Boolean(
                settings.dashboard
                    .sprintProgress
            ),

        ProjectTimeline:
            Boolean(
                settings.dashboard
                    .projectTimeline
            ),

        RisksIssues:
            Boolean(
                settings.dashboard
                    .risksIssues
            ),

        TeamProgress:
            Boolean(
                settings.dashboard
                    .teamProgress
            ),

        DeadlineInformation:
            Boolean(
                settings.dashboard
                    .deadlineInformation
            ),

        AIRecommendations:
            Boolean(
                settings.dashboard
                    .aiRecommendations
            ),

        AIRiskPrediction:
            Boolean(
                settings.dashboard
                    .aiRiskPrediction
            ),

        RecentActivity:
            Boolean(
                settings.dashboard
                    .recentActivity
            ),

        Notifications:
            Boolean(
                settings.dashboard
                    .notifications
            ),
    };
}


function buildAIPayload(settings) {
    return {
        AIRecommendations:
            Boolean(
                settings.ai
                    .aiRecommendations
            ),

        AINotifications:
            Boolean(
                settings.ai
                    .aiNotifications
            ),

        DelayWarnings:
            Boolean(
                settings.ai
                    .delayWarnings
            ),

        AIInsightVisibility:
            Boolean(
                settings.ai
                    .aiInsightVisibility
            ),

        SummaryFrequency:
            settings.ai.summaryFrequency,

        RecommendationDisplay:
            settings.ai.recommendationDisplay,

        NotificationPriority:
            settings.ai.notificationPriority,
    };
}


// ============================================================
// UI COMPONENTS
// ============================================================

function SectionCard({
    icon: Icon,
    title,
    description,
    children,
}) {
    return (
        <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-start gap-4 border-b border-border p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-card-foreground">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-6">
                {children}
            </div>
        </section>
    );
}


function SettingRow({
    title,
    description,
    children,
}) {
    return (
        <div className="flex items-center justify-between gap-6 py-4">
            <div className="min-w-0">
                <h3 className="text-sm font-medium text-foreground">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div className="shrink-0">
                {children}
            </div>
        </div>
    );
}


function Toggle({
    checked,
    onChange,
    disabled = false,
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={[
                "relative inline-flex h-6 w-11 items-center rounded-full",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                checked
                    ? "bg-primary"
                    : "bg-muted",
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer",
            ].join(" ")}
        >
            <span
                className={[
                    "inline-block h-4 w-4 rounded-full bg-white shadow-sm",
                    "transition-transform",
                    checked
                        ? "translate-x-6"
                        : "translate-x-1",
                ].join(" ")}
            />
        </button>
    );
}


function SaveButton({
    onClick,
    saving,
    children = "Save Changes",
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={saving}
            className={[
                "inline-flex items-center justify-center gap-2",
                "rounded-lg bg-primary px-4 py-2",
                "text-sm font-medium text-primary-foreground",
                "transition-opacity",
                "hover:opacity-90",
                "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
        >
            {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : children}
        </button>
    );
}


// ============================================================
// MANAGER SETTINGS
// ============================================================

export default function ManagerSettings() {
    const {
        theme,
        setTheme,
    } = useTheme();

    const {
        language,
        setLanguage,
        t,
    } = useLanguage();


    // ----------------------------------------------------------
    // STATE
    // ----------------------------------------------------------

    const [settings, setSettings] = useState(
        cloneDefaults()
    );

    const [
        persistedPreferences,
        setPersistedPreferences,
    ] = useState({
        language: "en",
        theme: "system",
    });

    const [
        backendUserPreferences,
        setBackendUserPreferences,
    ] = useState(null);

    const [
        backendNotifications,
        setBackendNotifications,
    ] = useState(null);

    const [
        backendDashboard,
        setBackendDashboard,
    ] = useState(null);

    const [
        backendAI,
        setBackendAI,
    ] = useState(null);

    const [
        currentManager,
        setCurrentManager,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        savingSection,
        setSavingSection,
    ] = useState(null);

    const [
        loadError,
        setLoadError,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        activeSection,
        setActiveSection,
    ] = useState("preferences");


    // ----------------------------------------------------------
    // MANAGER PROFILE
    // ----------------------------------------------------------

    const loadManagerProfile = useCallback(
        async () => {
            try {
                const cachedUser =
                    getCurrentUser();

                if (cachedUser) {
                    setCurrentManager(
                        cachedUser
                    );
                }

                const profile =
                    await getMyProfile();

                if (profile) {
                    setCurrentManager(
                        profile
                    );
                }
            } catch (error) {
                console.warn(
                    "Unable to load manager profile:",
                    error
                );
            }
        },
        []
    );


    // ----------------------------------------------------------
    // LOAD ALL SETTINGS
    // ----------------------------------------------------------

    const loadSettings = useCallback(
        async () => {
            try {
                setIsLoading(true);
                setLoadError("");
                setSuccessMessage("");

                const user =
                    getCurrentUser();

                if (
                    !user ||
                    String(
                        user.role ||
                        user.Role ||
                        ""
                    ).toLowerCase() !==
                        "manager"
                ) {
                    throw new Error(
                        "Manager access is required."
                    );
                }

                setCurrentManager(user);

                /*
                 * IMPORTANT:
                 *
                 * Theme and language come from
                 * the backend.
                 *
                 * No localStorage preference
                 * is read here.
                 */
                const result =
                    await managerSettingsService
                        .getManagerSettings();

                const hasData =
                    Boolean(
                        result?.userPreferences ||
                        result?.notifications ||
                        result?.dashboard ||
                        result?.ai
                    );

                if (!hasData) {
                    throw new Error(
                        "Unable to load manager settings."
                    );
                }

                const mappedSettings =
                    mapBackendToSettings(
                        result,
                        DEFAULT_SETTINGS
                    );

                setSettings(
                    mappedSettings
                );

                setBackendUserPreferences(
                    result.userPreferences
                );

                setBackendNotifications(
                    result.notifications
                );

                setBackendDashboard(
                    result.dashboard
                );

                setBackendAI(
                    result.ai
                );

                // ------------------------------------------------
                // Backend is source of truth.
                // ------------------------------------------------

                const savedLanguage =
                    normalizeLanguage(
                        mappedSettings.language
                    );

                const savedTheme =
                    normalizeTheme(
                        mappedSettings.theme
                    );

                setPersistedPreferences({
                    language:
                        savedLanguage,
                    theme:
                        savedTheme,
                });

                /*
                 * Synchronize the backend values
                 * with the global application state.
                 */
                setLanguage(
                    savedLanguage
                );

                setTheme(
                    savedTheme
                );

                if (
                    Array.isArray(
                        result.errors
                    ) &&
                    result.errors.length > 0
                ) {
                    console.warn(
                        "Some manager settings sections failed:",
                        result.errors
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load manager settings:",
                    error
                );

                setLoadError(
                    error?.message ||
                    "Failed to load manager settings."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [
            setLanguage,
            setTheme,
        ]
    );


    // ----------------------------------------------------------
    // INITIAL LOAD
    // ----------------------------------------------------------

    useEffect(() => {
        loadManagerProfile();
        loadSettings();
    }, [
        loadManagerProfile,
        loadSettings,
    ]);


    // ==========================================================
    // SETTING CHANGE HELPERS
    // ==========================================================

    const updateNotification = useCallback(
        (key, value) => {
            setSettings((previous) => ({
                ...previous,

                notifications: {
                    ...previous.notifications,
                    [key]: value,
                },
            }));
        },
        []
    );


    const updateNotificationChannel =
        useCallback(
            (key, value) => {
                setSettings((previous) => ({
                    ...previous,

                    notificationChannels: {
                        ...previous.notificationChannels,
                        [key]: value,
                    },
                }));
            },
            []
        );


    const updateDashboard = useCallback(
        (key, value) => {
            setSettings((previous) => ({
                ...previous,

                dashboard: {
                    ...previous.dashboard,
                    [key]: value,
                },
            }));
        },
        []
    );


    const updateAI = useCallback(
        (key, value) => {
            setSettings((previous) => ({
                ...previous,

                ai: {
                    ...previous.ai,
                    [key]: value,
                },
            }));
        },
        []
    );


    // ==========================================================
    // SAVE LANGUAGE + THEME
    // ==========================================================

    const saveUserPreferences =
        useCallback(async () => {
            try {
                setIsSaving(true);
                setSavingSection(
                    "preferences"
                );

                setLoadError("");
                setSuccessMessage("");

                const selectedLanguage =
                    normalizeLanguage(
                        settings.language
                    );

                const selectedTheme =
                    normalizeTheme(
                        settings.theme
                    );

                const payload =
                    buildUserPreferencePayload(
                        {
                            language:
                                selectedLanguage,

                            theme:
                                selectedTheme,
                        },
                        backendUserPreferences
                    );

                /*
                 * FIRST:
                 * Persist to database.
                 */
                const updated =
                    await managerSettingsService
                        .updateUserPreferences(
                            payload
                        );

                /*
                 * SECOND:
                 * Read the values confirmed by
                 * the backend.
                 */
                const savedLanguage =
                    normalizeLanguage(
                        updated?.languagePreference ??
                        updated?.LanguagePreference ??
                        selectedLanguage
                    );

                const savedTheme =
                    normalizeTheme(
                        updated?.themePreference ??
                        updated?.ThemePreference ??
                        selectedTheme
                    );

                /*
                 * THIRD:
                 * Update local React settings state.
                 */
                setSettings(
                    (previous) => ({
                        ...previous,
                        language:
                            savedLanguage,
                        theme:
                            savedTheme,
                    })
                );

                /*
                 * FOURTH:
                 * Update the global language.
                 *
                 * This causes components using
                 * useLanguage() / t() to re-render.
                 */
                setLanguage(
                    savedLanguage
                );

                /*
                 * FIFTH:
                 * Apply the confirmed theme
                 * through next-themes.
                 */
                setTheme(
                    savedTheme
                );

                /*
                 * SIXTH:
                 * Keep the last confirmed
                 * database values in memory.
                 */
                setPersistedPreferences({
                    language:
                        savedLanguage,
                    theme:
                        savedTheme,
                });

                setBackendUserPreferences(
                    updated
                );

                setSuccessMessage(
                    t(
                        "settings.preferencesSaved"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to save user preferences:",
                    error
                );

                /*
                 * Restore last known backend
                 * state if save fails.
                 */
                setSettings(
                    (previous) => ({
                        ...previous,
                        language:
                            persistedPreferences
                                .language,
                        theme:
                            persistedPreferences
                                .theme,
                    })
                );

                setLanguage(
                    persistedPreferences
                        .language
                );

                setTheme(
                    persistedPreferences
                        .theme
                );

                setLoadError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to save language and theme preferences."
                );
            } finally {
                setIsSaving(false);
                setSavingSection(null);
            }
        }, [
            settings.language,
            settings.theme,
            backendUserPreferences,
            persistedPreferences,
            setLanguage,
            setTheme,
            t,
        ]);


    // ==========================================================
    // SAVE NOTIFICATIONS
    // ==========================================================

    const saveNotifications =
        useCallback(async () => {
            try {
                setIsSaving(true);
                setSavingSection(
                    "notifications"
                );

                setLoadError("");
                setSuccessMessage("");

                const payload =
                    buildNotificationPayload(
                        settings
                    );

                const updated =
                    await managerSettingsService
                        .updateNotificationSettings(
                            payload
                        );

                setBackendNotifications(
                    updated
                );

                setSuccessMessage(
                    t(
                        "settings.notificationSaved"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to save notification settings:",
                    error
                );

                setLoadError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to save notification settings."
                );
            } finally {
                setIsSaving(false);
                setSavingSection(null);
            }
        }, [
            settings,
            t,
        ]);


    // ==========================================================
    // SAVE DASHBOARD
    // ==========================================================

    const saveDashboard =
        useCallback(async () => {
            try {
                setIsSaving(true);
                setSavingSection(
                    "dashboard"
                );

                setLoadError("");
                setSuccessMessage("");

                const payload =
                    buildDashboardPayload(
                        settings
                    );

                const updated =
                    await managerSettingsService
                        .updateDashboardPreference(
                            payload
                        );

                setBackendDashboard(
                    updated
                );

                setSuccessMessage(
                    t(
                        "settings.dashboardSaved"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to save dashboard preferences:",
                    error
                );

                setLoadError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to save dashboard preferences."
                );
            } finally {
                setIsSaving(false);
                setSavingSection(null);
            }
        }, [
            settings,
            t,
        ]);


    // ==========================================================
    // SAVE AI
    // ==========================================================

    const saveAI =
        useCallback(async () => {
            try {
                setIsSaving(true);
                setSavingSection("ai");

                setLoadError("");
                setSuccessMessage("");

                const payload =
                    buildAIPayload(
                        settings
                    );

                const updated =
                    await managerSettingsService
                        .updateAIPreference(
                            payload
                        );

                setBackendAI(updated);

                setSuccessMessage(
                    t(
                        "settings.aiSaved"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to save AI preferences:",
                    error
                );

                setLoadError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to save AI preferences."
                );
            } finally {
                setIsSaving(false);
                setSavingSection(null);
            }
        }, [
            settings,
            t,
        ]);


    // ==========================================================
    // RESTORE DEFAULTS
    // ==========================================================

    const restoreDefaults =
        useCallback(async () => {
            try {
                setIsSaving(true);
                setSavingSection(
                    "defaults"
                );

                setLoadError("");
                setSuccessMessage("");

                const defaults =
                    cloneDefaults();

                /*
                 * User preferences
                 */
                const userPreferences =
                    await managerSettingsService
                        .updateUserPreferences(
                            buildUserPreferencePayload(
                                defaults,
                                backendUserPreferences
                            )
                        );

                /*
                 * Notifications
                 */
                let notifications =
                    backendNotifications;

                try {
                    notifications =
                        await managerSettingsService
                            .updateNotificationSettings(
                                buildNotificationPayload(
                                    defaults
                                )
                            );
                } catch (error) {
                    console.warn(
                        "Unable to reset notification settings:",
                        error
                    );
                }

                /*
                 * Dashboard
                 */
                let dashboard =
                    backendDashboard;

                try {
                    dashboard =
                        await managerSettingsService
                            .updateDashboardPreference(
                                buildDashboardPayload(
                                    defaults
                                )
                            );
                } catch (error) {
                    console.warn(
                        "Unable to reset dashboard settings:",
                        error
                    );
                }

                /*
                 * AI
                 */
                let ai =
                    backendAI;

                try {
                    ai =
                        await managerSettingsService
                            .updateAIPreference(
                                buildAIPayload(
                                    defaults
                                )
                            );
                } catch (error) {
                    console.warn(
                        "Unable to reset AI settings:",
                        error
                    );
                }

                /*
                 * Use backend-confirmed values.
                 */
                const savedLanguage =
                    normalizeLanguage(
                        userPreferences?.languagePreference ??
                        userPreferences?.LanguagePreference ??
                        "en"
                    );

                const savedTheme =
                    normalizeTheme(
                        userPreferences?.themePreference ??
                        userPreferences?.ThemePreference ??
                        "system"
                    );

                setSettings({
                    ...defaults,
                    language:
                        savedLanguage,
                    theme:
                        savedTheme,
                });

                setPersistedPreferences({
                    language:
                        savedLanguage,
                    theme:
                        savedTheme,
                });

                setBackendUserPreferences(
                    userPreferences
                );

                setBackendNotifications(
                    notifications
                );

                setBackendDashboard(
                    dashboard
                );

                setBackendAI(ai);

                /*
                 * Apply confirmed language globally.
                 */
                setLanguage(
                    savedLanguage
                );

                /*
                 * Apply confirmed theme through
                 * next-themes.
                 */
                setTheme(
                    savedTheme
                );

                setSuccessMessage(
                    t(
                        "settings.defaultsRestored"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to restore manager settings:",
                    error
                );

                setLoadError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to restore manager settings."
                );
            } finally {
                setIsSaving(false);
                setSavingSection(null);
            }
        }, [
            backendUserPreferences,
            backendNotifications,
            backendDashboard,
            backendAI,
            setLanguage,
            setTheme,
            t,
        ]);


    // ==========================================================
    // LANGUAGE OPTIONS
    // ==========================================================

    const languageOptions =
        useMemo(() => {
            return LANGUAGE_OPTIONS;
        }, []);


    // ==========================================================
    // LOADING
    // ==========================================================

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />

                    <p className="text-sm">
                        {t(
                            "settings.loading"
                        )}
                    </p>
                </div>
            </div>
        );
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <SettingsIcon className="h-5 w-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t(
                                        "settings.title"
                                    )}
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {t(
                                        "settings.description"
                                    )}
                                </p>
                            </div>
                        </div>

                        {currentManager && (
                            <p className="mt-4 text-sm text-muted-foreground">
                                {t(
                                    "settings.signedInAs"
                                )}{" "}

                                <span className="font-medium text-foreground">
                                    {currentManager.fullName ||
                                        currentManager.FullName ||
                                        currentManager.email ||
                                        currentManager.Email ||
                                        "Manager"}
                                </span>
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={restoreDefaults}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {savingSection === "defaults" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RotateCcw className="h-4 w-4" />
                        )}

                        {t(
                            "settings.restoreDefaults"
                        )}
                    </button>
                </div>


                {/* =================================================
                    MESSAGES
                ================================================== */}

                {loadError && (
                    <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {loadError}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                        <Check className="h-4 w-4 shrink-0" />
                        {successMessage}
                    </div>
                )}


                {/* =================================================
                    SECTION NAVIGATION
                ================================================== */}

                <div className="mb-8 flex gap-2 overflow-x-auto rounded-xl border border-border bg-card p-2">

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "preferences"
                            )
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection ===
                            "preferences"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Palette className="h-4 w-4" />

                        {t(
                            "settings.languageTheme"
                        )}
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "notifications"
                            )
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection ===
                            "notifications"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Bell className="h-4 w-4" />

                        {t(
                            "settings.notifications"
                        )}
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "dashboard"
                            )
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection ===
                            "dashboard"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <LayoutDashboard className="h-4 w-4" />

                        {t(
                            "settings.dashboard"
                        )}
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("ai")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection === "ai"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Bot className="h-4 w-4" />

                        {t(
                            "settings.aiPreferences"
                        )}
                    </button>
                </div>


                {/* =================================================
                    LANGUAGE + THEME
                ================================================== */}

                {activeSection ===
                    "preferences" && (
                    <div className="space-y-6">

                        {/* LANGUAGE */}

                        <SectionCard
                            icon={Globe}
                            title={t(
                                "settings.languagePreference"
                            )}
                            description={t(
                                "settings.languageDescription"
                            )}
                        >
                            <SettingRow
                                title={t(
                                    "settings.applicationLanguage"
                                )}
                                description={t(
                                    "settings.languageSavedDescription"
                                )}
                            >
                                <div className="relative">
                                    <select
                                        value={
                                            settings.language
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            const selected =
                                                normalizeLanguage(
                                                    event
                                                        .target
                                                        .value
                                                );

                                            setSettings(
                                                (
                                                    previous
                                                ) => ({
                                                    ...previous,
                                                    language:
                                                        selected,
                                                })
                                            );
                                        }}
                                        className="min-w-[190px] appearance-none rounded-lg border border-input bg-background px-4 py-2 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {languageOptions.map(
                                            (
                                                item
                                            ) => (
                                                <option
                                                    key={
                                                        item.code
                                                    }
                                                    value={
                                                        item.code
                                                    }
                                                >
                                                    {
                                                        item.nativeName
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </SettingRow>

                            <div className="mt-4 flex justify-end border-t border-border pt-4">
                                <SaveButton
                                    onClick={
                                        saveUserPreferences
                                    }
                                    saving={
                                        savingSection ===
                                        "preferences"
                                    }
                                >
                                    {t(
                                        "settings.saveLanguageTheme"
                                    )}
                                </SaveButton>
                            </div>
                        </SectionCard>


                        {/* THEME */}

                        <SectionCard
                            icon={Palette}
                            title={t(
                                "settings.themePreference"
                            )}
                            description={t(
                                "settings.themeDescription"
                            )}
                        >
                            <div className="grid gap-4 md:grid-cols-3">

                                {/* LIGHT */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettings(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                theme: "light",
                                            })
                                        )
                                    }
                                    className={[
                                        "rounded-xl border p-5 text-left transition-all",
                                        settings.theme ===
                                        "light"
                                            ? "border-primary bg-accent ring-2 ring-primary/20"
                                            : "border-border bg-card hover:bg-accent/50",
                                    ].join(" ")}
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-slate-700">
                                            <Sun className="h-5 w-5" />
                                        </div>

                                        {settings.theme ===
                                            "light" && (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-semibold">
                                        {t(
                                            "settings.light"
                                        )}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t(
                                            "settings.lightDescription"
                                        )}
                                    </p>
                                </button>


                                {/* DARK */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettings(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                theme: "dark",
                                            })
                                        )
                                    }
                                    className={[
                                        "rounded-xl border p-5 text-left transition-all",
                                        settings.theme ===
                                        "dark"
                                            ? "border-primary bg-accent ring-2 ring-primary/20"
                                            : "border-border bg-card hover:bg-accent/50",
                                    ].join(" ")}
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-900 text-white">
                                            <Moon className="h-5 w-5" />
                                        </div>

                                        {settings.theme ===
                                            "dark" && (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-semibold">
                                        {t(
                                            "settings.dark"
                                        )}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t(
                                            "settings.darkDescription"
                                        )}
                                    </p>
                                </button>


                                {/* SYSTEM */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettings(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                theme: "system",
                                            })
                                        )
                                    }
                                    className={[
                                        "rounded-xl border p-5 text-left transition-all",
                                        settings.theme ===
                                        "system"
                                            ? "border-primary bg-accent ring-2 ring-primary/20"
                                            : "border-border bg-card hover:bg-accent/50",
                                    ].join(" ")}
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                                            <Monitor className="h-5 w-5" />
                                        </div>

                                        {settings.theme ===
                                            "system" && (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-semibold">
                                        {t(
                                            "settings.system"
                                        )}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t(
                                            "settings.systemDescription"
                                        )}
                                    </p>
                                </button>
                            </div>

                            <div className="mt-6 flex justify-end border-t border-border pt-4">
                                <SaveButton
                                    onClick={
                                        saveUserPreferences
                                    }
                                    saving={
                                        savingSection ===
                                        "preferences"
                                    }
                                >
                                    {t(
                                        "settings.saveTheme"
                                    )}
                                </SaveButton>
                            </div>
                        </SectionCard>


                        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                            {t(
                                "settings.storageDescription"
                            )}
                        </div>
                    </div>
                )}


                {/* =================================================
                    NOTIFICATIONS
                ================================================== */}

                {activeSection ===
                    "notifications" && (
                    <SectionCard
                        icon={Bell}
                        title={t(
                            "settings.notificationPreferences"
                        )}
                        description={t(
                            "settings.notificationDescription"
                        )}
                    >
                        <div className="divide-y divide-border">

                            <SettingRow
                                title={t(
                                    "settings.emailNotifications"
                                )}
                                description={t(
                                    "settings.emailNotificationsDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .emailNotifications
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateNotification(
                                            "emailNotifications",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.sprintUpdates"
                                )}
                                description={t(
                                    "settings.sprintUpdatesDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .sprintUpdates
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateNotification(
                                            "sprintUpdates",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.taskUpdates"
                                )}
                                description={t(
                                    "settings.taskUpdatesDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .taskUpdates
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateNotification(
                                            "taskUpdates",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.aiAlerts"
                                )}
                                description={t(
                                    "settings.aiAlertsDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .aiAlerts
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateNotification(
                                            "aiAlerts",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.systemNotifications"
                                )}
                                description={t(
                                    "settings.systemNotificationsDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .systemNotifications
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateNotification(
                                            "systemNotifications",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.emailChannel"
                                )}
                                description={t(
                                    "settings.emailChannelDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notificationChannels
                                            .email
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateNotificationChannel(
                                            "email",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.inAppChannel"
                                )}
                                description={t(
                                    "settings.inAppChannelDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notificationChannels
                                            .inApp
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateNotificationChannel(
                                            "inApp",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-border pt-4">
                            <SaveButton
                                onClick={
                                    saveNotifications
                                }
                                saving={
                                    savingSection ===
                                    "notifications"
                                }
                            >
                                {t(
                                    "common.saveChanges"
                                )}
                            </SaveButton>
                        </div>
                    </SectionCard>
                )}


                {/* =================================================
                    DASHBOARD
                ================================================== */}

                {activeSection ===
                    "dashboard" && (
                    <SectionCard
                        icon={LayoutDashboard}
                        title={t(
                            "settings.dashboardPreferences"
                        )}
                        description={t(
                            "settings.dashboardDescription"
                        )}
                    >
                        <div className="divide-y divide-border">

                            <SettingRow
                                title={t(
                                    "settings.projectProgress"
                                )}
                                description={t(
                                    "settings.projectProgressDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .projectProgress
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "projectProgress",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.sprintProgress"
                                )}
                                description={t(
                                    "settings.sprintProgressDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .sprintProgress
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "sprintProgress",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.projectTimeline"
                                )}
                                description={t(
                                    "settings.projectTimelineDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .projectTimeline
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "projectTimeline",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.risksIssues"
                                )}
                                description={t(
                                    "settings.risksIssuesDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .risksIssues
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "risksIssues",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.teamProgress"
                                )}
                                description={t(
                                    "settings.teamProgressDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .teamProgress
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "teamProgress",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.deadlineInformation"
                                )}
                                description={t(
                                    "settings.deadlineInformationDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .deadlineInformation
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "deadlineInformation",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.aiRecommendations"
                                )}
                                description={t(
                                    "settings.aiRecommendationsDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .aiRecommendations
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "aiRecommendations",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.aiRiskPrediction"
                                )}
                                description={t(
                                    "settings.aiRiskPredictionDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .aiRiskPrediction
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "aiRiskPrediction",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.recentActivity"
                                )}
                                description={t(
                                    "settings.recentActivityDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .recentActivity
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "recentActivity",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.notifications"
                                )}
                                description={t(
                                    "settings.dashboardNotificationsDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .dashboard
                                            .notifications
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateDashboard(
                                            "notifications",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-border pt-4">
                            <SaveButton
                                onClick={
                                    saveDashboard
                                }
                                saving={
                                    savingSection ===
                                    "dashboard"
                                }
                            >
                                {t(
                                    "common.saveChanges"
                                )}
                            </SaveButton>
                        </div>
                    </SectionCard>
                )}


                {/* =================================================
                    AI
                ================================================== */}

                {activeSection ===
                    "ai" && (
                    <SectionCard
                        icon={Bot}
                        title={t(
                            "settings.aiPreferencesTitle"
                        )}
                        description={t(
                            "settings.aiPreferencesDescription"
                        )}
                    >
                        <div className="divide-y divide-border">

                            <SettingRow
                                title={t(
                                    "settings.aiRecommendations"
                                )}
                                description={t(
                                    "settings.aiRecommendationsSettingDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .ai
                                            .aiRecommendations
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateAI(
                                            "aiRecommendations",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.aiNotifications"
                                )}
                                description={t(
                                    "settings.aiNotificationsDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .ai
                                            .aiNotifications
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateAI(
                                            "aiNotifications",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.delayWarnings"
                                )}
                                description={t(
                                    "settings.delayWarningsDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .ai
                                            .delayWarnings
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateAI(
                                            "delayWarnings",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.aiInsightVisibility"
                                )}
                                description={t(
                                    "settings.aiInsightVisibilityDescription"
                                )}
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .ai
                                            .aiInsightVisibility
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateAI(
                                            "aiInsightVisibility",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.summaryFrequency"
                                )}
                                description={t(
                                    "settings.summaryFrequencyDescription"
                                )}
                            >
                                <div className="relative">
                                    <select
                                        value={
                                            settings
                                                .ai
                                                .summaryFrequency
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAI(
                                                "summaryFrequency",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="min-w-[160px] appearance-none rounded-lg border border-input bg-background px-4 py-2 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="realtime">
                                            {t(
                                                "settings.realtime"
                                            )}
                                        </option>

                                        <option value="daily">
                                            {t(
                                                "settings.daily"
                                            )}
                                        </option>

                                        <option value="weekly">
                                            {t(
                                                "settings.weekly"
                                            )}
                                        </option>

                                        <option value="never">
                                            {t(
                                                "settings.never"
                                            )}
                                        </option>
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.recommendationDisplay"
                                )}
                                description={t(
                                    "settings.recommendationDisplayDescription"
                                )}
                            >
                                <div className="relative">
                                    <select
                                        value={
                                            settings
                                                .ai
                                                .recommendationDisplay
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAI(
                                                "recommendationDisplay",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="min-w-[160px] appearance-none rounded-lg border border-input bg-background px-4 py-2 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="compact">
                                            {t(
                                                "settings.compact"
                                            )}
                                        </option>

                                        <option value="detailed">
                                            {t(
                                                "settings.detailed"
                                            )}
                                        </option>
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </SettingRow>


                            <SettingRow
                                title={t(
                                    "settings.notificationPriority"
                                )}
                                description={t(
                                    "settings.notificationPriorityDescription"
                                )}
                            >
                                <div className="relative">
                                    <select
                                        value={
                                            settings
                                                .ai
                                                .notificationPriority
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAI(
                                                "notificationPriority",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="min-w-[160px] appearance-none rounded-lg border border-input bg-background px-4 py-2 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="all">
                                            {t(
                                                "settings.all"
                                            )}
                                        </option>

                                        <option value="important">
                                            {t(
                                                "settings.important"
                                            )}
                                        </option>

                                        <option value="critical">
                                            {t(
                                                "settings.critical"
                                            )}
                                        </option>
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </SettingRow>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-border pt-4">
                            <SaveButton
                                onClick={
                                    saveAI
                                }
                                saving={
                                    savingSection ===
                                    "ai"
                                }
                            >
                                {t(
                                    "common.saveChanges"
                                )}
                            </SaveButton>
                        </div>
                    </SectionCard>
                )}


                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="mt-8 rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                            <SettingsIcon className="h-4 w-4" />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold">
                                {t(
                                    "settings.preferenceStorage"
                                )}
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {t(
                                    "settings.preferenceStorageDescription"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}