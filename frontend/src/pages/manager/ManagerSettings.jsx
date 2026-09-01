// ============================================================
// AIPMS — MANAGER SETTINGS
//
// Settings and Preferences Use Cases
//
// SET-001 — Manage Notification Preferences
// SET-002 — Change Language Preferences
// SET-003 — Change Theme Preferences
// SET-004 — Configure Dashboard Preferences
// SET-005 — Manage AI Preferences
//
// IMPORTANT:
// - Preferences apply only to the authenticated Manager.
// - Project/team/role permissions are NOT changed here.
// - Preferences are stored locally for the current frontend.
// - Backend implementation should persist them in the database.
// ============================================================

import React, { useEffect, useMemo, useState } from "react";

import {
    Settings as SettingsIcon,
    UserRound,
    Palette,
    Bell,
    ShieldCheck,
    Save,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Mail,
    Moon,
    Sun,
    Monitor,
    Globe2,
    LayoutDashboard,
    BrainCircuit,
    Clock3,
    AlertCircle,
    Check,
    RotateCcw,
} from "lucide-react";

// ============================================================
// STORAGE KEYS
// ============================================================

const MANAGER_SETTINGS_KEY =
    "aipms_manager_settings";

// ============================================================
// DEFAULT CONFIGURATION
//
// In the final backend implementation these configurable
// options should come from system configuration/database.
// ============================================================

const DEFAULT_NOTIFICATION_TYPES = [
    {
        id: "emailNotifications",
        title: "Email Notifications",
        description:
            "Receive supported manager notifications through email.",
        channel: "Email",
        mandatory: false,
    },
    {
        id: "sprintUpdates",
        title: "Sprint Updates",
        description:
            "Receive updates about sprint status, progress, and schedule changes.",
        channel: "In-app",
        mandatory: false,
    },
    {
        id: "taskUpdates",
        title: "Task Updates",
        description:
            "Receive notifications when relevant tasks change or assignments are updated.",
        channel: "In-app",
        mandatory: false,
    },
    {
        id: "aiAlerts",
        title: "AI Alerts",
        description:
            "Receive AI-generated project risk and issue notifications.",
        channel: "In-app",
        mandatory: false,
    },
    {
        id: "systemNotifications",
        title: "System Notifications",
        description:
            "Receive important security and system notifications.",
        channel: "In-app",
        mandatory: true,
    },
];

const DEFAULT_LANGUAGES = [
    {
        id: "en",
        name: "English",
        description: "Use English throughout the Manager workspace.",
    },
    {
        id: "am",
        name: "Amharic",
        description: "Use Amharic where supported by the system.",
    },
];

const DEFAULT_THEMES = [
    {
        id: "light",
        title: "Light",
        description:
            "Use the clean light Manager interface.",
        icon: Sun,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        id: "system",
        title: "System",
        description:
            "Follow your device appearance preference.",
        icon: Monitor,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        id: "dark",
        title: "Dark",
        description:
            "Use a darker appearance for the Manager workspace.",
        icon: Moon,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
    },
];

const DEFAULT_DASHBOARD_WIDGETS = [
    {
        id: "projectProgress",
        title: "Project Progress",
        description:
            "Display current progress of authorized projects.",
    },
    {
        id: "sprintProgress",
        title: "Sprint Progress",
        description:
            "Display active sprint progress and completion.",
    },
    {
        id: "projectTimeline",
        title: "Project Timeline",
        description:
            "Display project schedules and important timeline information.",
    },
    {
        id: "risksIssues",
        title: "Risks & Issues",
        description:
            "Display authorized project risks and issues.",
    },
    {
        id: "teamProgress",
        title: "Team Progress",
        description:
            "Display current team progress and workload.",
    },
    {
        id: "deadlineInformation",
        title: "Deadline Information",
        description:
            "Display upcoming and overdue project deadlines.",
    },
    {
        id: "aiRecommendations",
        title: "AI Recommendations",
        description:
            "Display AI-generated project recommendations.",
    },
    {
        id: "aiRiskPrediction",
        title: "AI Risk Prediction",
        description:
            "Display AI-generated risk predictions.",
    },
    {
        id: "recentActivity",
        title: "Recent Activity",
        description:
            "Display recent authorized project activities.",
    },
    {
        id: "notifications",
        title: "Notifications",
        description:
            "Display relevant notifications in the dashboard.",
    },
];

const DEFAULT_AI_OPTIONS = [
    {
        id: "aiRecommendations",
        title: "AI Recommendations",
        description:
            "Allow AI recommendations to be displayed in the Manager workspace.",
    },
    {
        id: "aiNotifications",
        title: "AI Notifications",
        description:
            "Allow AI-generated notifications to appear in the Manager workspace.",
    },
    {
        id: "delayWarnings",
        title: "Delay Warnings",
        description:
            "Display AI-assisted warnings about possible project or task delays.",
    },
    {
        id: "aiInsightVisibility",
        title: "AI Insights",
        description:
            "Display AI-generated insights where the Manager has permission to view them.",
    },
];

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {
    language: "en",
    theme: "light",

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
// COMPONENT
// ============================================================

function ManagerSettings() {
    // ========================================================
    // CURRENT MANAGER
    //
    // Final implementation:
    // Retrieve authenticated Manager dynamically.
    // ========================================================

    const currentManager = useMemo(
        () => ({
            id: "current-manager",
            name: "Current Manager",
            email: "manager@aipms.com",
            role: "Manager",
        }),
        []
    );

    // ========================================================
    // SETTINGS STATE
    // ========================================================

    const [settings, setSettings] =
        useState(DEFAULT_SETTINGS);

    // ========================================================
    // UI STATE
    // ========================================================

    const [activeSection, setActiveSection] =
        useState("notifications");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [isSaving, setIsSaving] =
        useState(false);

    // ========================================================
    // CONFIGURABLE OPTIONS
    // ========================================================

    const notificationTypes =
        DEFAULT_NOTIFICATION_TYPES;

    const languages = DEFAULT_LANGUAGES;

    const themes = DEFAULT_THEMES;

    const dashboardWidgets =
        DEFAULT_DASHBOARD_WIDGETS;

    const aiOptions = DEFAULT_AI_OPTIONS;

    // ========================================================
    // LOAD SAVED SETTINGS
    // ========================================================

    useEffect(() => {
        const storageKey =
            `${MANAGER_SETTINGS_KEY}_${currentManager.id}`;

        const savedSettings =
            localStorage.getItem(storageKey);

        if (!savedSettings) {
            setSettings(DEFAULT_SETTINGS);
            return;
        }

        try {
            const parsed =
                JSON.parse(savedSettings);

            setSettings((previous) => ({
                ...previous,
                ...parsed,

                notifications: {
                    ...previous.notifications,
                    ...(parsed.notifications || {}),
                },

                notificationChannels: {
                    ...previous.notificationChannels,
                    ...(parsed.notificationChannels || {}),
                },

                dashboard: {
                    ...previous.dashboard,
                    ...(parsed.dashboard || {}),
                },

                ai: {
                    ...previous.ai,
                    ...(parsed.ai || {}),
                },
            }));
        } catch {
            setSettings(DEFAULT_SETTINGS);
        }
    }, [currentManager.id]);

    // ========================================================
    // MESSAGE HELPERS
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const showSuccess = (message) => {
        setErrorMessage("");
        setSuccessMessage(message);

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    const showError = (message) => {
        setSuccessMessage("");
        setErrorMessage(message);
    };

    // ========================================================
    // SAVE SETTINGS
    //
    // SET-001 through SET-005
    // ========================================================

    const saveSettings = (
        updatedSettings,
        successText
    ) => {
        clearMessages();

        setIsSaving(true);

        window.setTimeout(() => {
            try {
                const storageKey =
                    `${MANAGER_SETTINGS_KEY}_${currentManager.id}`;

                localStorage.setItem(
                    storageKey,
                    JSON.stringify(updatedSettings)
                );

                setSettings(updatedSettings);

                setIsSaving(false);

                showSuccess(successText);
            } catch {
                setIsSaving(false);

                showError(
                    "Unable to save your preferences. Please try again."
                );
            }
        }, 350);
    };

    // ========================================================
    // SET-001
    // MANAGE NOTIFICATION PREFERENCES
    // ========================================================

    const handleNotificationChange = (
        notificationId
    ) => {
        const notification =
            notificationTypes.find(
                (item) =>
                    item.id === notificationId
            );

        if (!notification) {
            return;
        }

        // Mandatory system notifications
        // cannot be disabled.
        if (notification.mandatory) {
            showError(
                "This notification is required by system policy and cannot be disabled."
            );
            return;
        }

        setSettings((previous) => ({
            ...previous,

            notifications: {
                ...previous.notifications,

                [notificationId]:
                    !previous.notifications[
                        notificationId
                    ],
            },
        }));
    };

    const handleNotificationChannelChange = (
        channel
    ) => {
        setSettings((previous) => ({
            ...previous,

            notificationChannels: {
                ...previous.notificationChannels,

                [channel]:
                    !previous.notificationChannels[
                        channel
                    ],
            },
        }));
    };

    const handleSaveNotifications = () => {
        const hasChannel =
            settings.notificationChannels.email ||
            settings.notificationChannels.inApp;

        if (!hasChannel) {
            showError(
                "Please select at least one notification channel."
            );
            return;
        }

        saveSettings(
            settings,
            "Notification preferences saved successfully."
        );
    };

    // ========================================================
    // SET-002
    // CHANGE LANGUAGE PREFERENCES
    // ========================================================

    const handleLanguageChange = (
        languageId
    ) => {
        const languageExists =
            languages.some(
                (language) =>
                    language.id === languageId
            );

        if (!languageExists) {
            showError(
                "The selected language is not supported."
            );
            return;
        }

        setSettings((previous) => ({
            ...previous,
            language: languageId,
        }));
    };

    const handleSaveLanguage = () => {
        const supported =
            languages.some(
                (language) =>
                    language.id ===
                    settings.language
            );

        if (!supported) {
            showError(
                "The selected language is not supported."
            );
            return;
        }

        saveSettings(
            settings,
            "Language preference saved successfully."
        );
    };

    // ========================================================
    // SET-003
    // CHANGE THEME PREFERENCES
    // ========================================================

    const handleThemeChange = (
        themeId
    ) => {
        const themeExists =
            themes.some(
                (theme) =>
                    theme.id === themeId
            );

        if (!themeExists) {
            showError(
                "The selected theme is not available."
            );
            return;
        }

        setSettings((previous) => ({
            ...previous,
            theme: themeId,
        }));

        // Apply only to this Manager's interface.
        localStorage.setItem(
            `${MANAGER_SETTINGS_KEY}_${currentManager.id}`,
            JSON.stringify({
                ...settings,
                theme: themeId,
            })
        );

        showSuccess(
            "Theme preference updated successfully."
        );
    };

    const handleSaveTheme = () => {
        const themeExists =
            themes.some(
                (theme) =>
                    theme.id === settings.theme
            );

        if (!themeExists) {
            showError(
                "The selected theme is not available."
            );
            return;
        }

        saveSettings(
            settings,
            "Theme preference saved successfully."
        );
    };

    // ========================================================
    // SET-004
    // CONFIGURE DASHBOARD PREFERENCES
    // ========================================================

    const handleDashboardWidgetChange = (
        widgetId
    ) => {
        setSettings((previous) => ({
            ...previous,

            dashboard: {
                ...previous.dashboard,

                [widgetId]:
                    !previous.dashboard[
                        widgetId
                    ],
            },
        }));
    };

    const handleSaveDashboard = () => {
        saveSettings(
            settings,
            "Dashboard preferences saved successfully."
        );
    };

    // ========================================================
    // SET-005
    // MANAGE AI PREFERENCES
    // ========================================================

    const handleAIOptionChange = (
        optionId
    ) => {
        setSettings((previous) => ({
            ...previous,

            ai: {
                ...previous.ai,

                [optionId]:
                    !previous.ai[optionId],
            },
        }));
    };

    const handleAISelectChange = (
        field,
        value
    ) => {
        setSettings((previous) => ({
            ...previous,

            ai: {
                ...previous.ai,
                [field]: value,
            },
        }));
    };

    const handleSaveAI = () => {
        saveSettings(
            settings,
            "AI preferences saved successfully."
        );
    };

    // ========================================================
    // RESET SETTINGS
    // ========================================================

    const handleResetSettings = () => {
        clearMessages();

        const storageKey =
            `${MANAGER_SETTINGS_KEY}_${currentManager.id}`;

        localStorage.removeItem(storageKey);

        setSettings(
            JSON.parse(
                JSON.stringify(DEFAULT_SETTINGS)
            )
        );

        showSuccess(
            "Manager settings have been restored to their default values."
        );
    };

    // ========================================================
    // NAVIGATION
    // ========================================================

    const sections = [
        {
            id: "notifications",
            title: "Notifications",
            description:
                "Manage notification types and channels.",
            icon: Bell,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            id: "language",
            title: "Language",
            description:
                "Choose your preferred interface language.",
            icon: Globe2,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: "theme",
            title: "Theme",
            description:
                "Customize your workspace appearance.",
            icon: Palette,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
        },
        {
            id: "dashboard",
            title: "Dashboard",
            description:
                "Choose dashboard widgets and information.",
            icon: LayoutDashboard,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
        },
        {
            id: "ai",
            title: "AI Preferences",
            description:
                "Configure AI-assisted features.",
            icon: BrainCircuit,
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600",
        },
    ];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <main className="min-h-screen">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

                        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                    <SettingsIcon
                                        size={28}
                                    />

                                </div>

                                <div>

                                    <div className="mb-1 flex items-center gap-2">

                                        <Sparkles
                                            size={16}
                                            className="text-cyan-200"
                                        />

                                        <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                            Manager Workspace
                                        </span>

                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Settings and Preferences
                                    </h1>

                                    <p className="mt-1 max-w-3xl text-sm text-white/80">
                                        Configure notifications, language, theme, dashboard information, and AI-assisted features for your Manager workspace.
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-sm">

                                <UserRound
                                    size={18}
                                />

                                <div>

                                    <p className="text-xs text-white/70">
                                        Signed in as
                                    </p>

                                    <p className="text-sm font-bold">
                                        {currentManager.name}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        SUCCESS MESSAGE
                    ================================================== */}

                    {successMessage && (
                        <div
                            role="status"
                            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm"
                        >
                            <CheckCircle2
                                size={19}
                                className="shrink-0 text-emerald-600"
                            />

                            <span>
                                {successMessage}
                            </span>
                        </div>
                    )}

                    {/* ==================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm"
                        >
                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <span>
                                {errorMessage}
                            </span>
                        </div>
                    )}

                    {/* ==================================================
                        SETTINGS LAYOUT
                    ================================================== */}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                        {/* ==================================================
                            SETTINGS NAVIGATION
                        ================================================== */}

                        <aside className="lg:col-span-3">

                            <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Settings
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        Manager Preferences
                                    </p>

                                </div>

                                <div className="p-3">

                                    {sections.map(
                                        (section) => {
                                            const Icon =
                                                section.icon;

                                            const selected =
                                                activeSection ===
                                                section.id;

                                            return (
                                                <button
                                                    key={
                                                        section.id
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        clearMessages();
                                                        setActiveSection(
                                                            section.id
                                                        );
                                                    }}
                                                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                                                        selected
                                                            ? "bg-violet-50 text-violet-700"
                                                            : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >

                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                            selected
                                                                ? "bg-violet-100"
                                                                : section.iconBg
                                                        }`}
                                                    >
                                                        <Icon
                                                            size={19}
                                                            className={
                                                                selected
                                                                    ? "text-violet-600"
                                                                    : section.iconColor
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate text-sm font-bold">
                                                            {
                                                                section.title
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                                                            {
                                                                section.description
                                                            }
                                                        </p>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                                <div className="border-t border-slate-200 p-3">

                                    <button
                                        type="button"
                                        onClick={
                                            handleResetSettings
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <RotateCcw
                                            size={16}
                                        />
                                        Restore Defaults
                                    </button>

                                </div>

                            </div>

                        </aside>

                        {/* ==================================================
                            CONTENT
                        ================================================== */}

                        <div className="lg:col-span-9">

                            {/* ==================================================
                                SET-001 NOTIFICATIONS
                            ================================================== */}

                            {activeSection ===
                                "notifications" && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">

                                                <Bell
                                                    size={21}
                                                    className="text-amber-600"
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                                                    SET-001
                                                </p>

                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Notification Preferences
                                                </h2>

                                                <p className="text-sm text-slate-500">
                                                    Choose which notifications you receive and supported delivery channels.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="p-6">

                                        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <ShieldCheck
                                                    size={19}
                                                    className="mt-0.5 shrink-0 text-blue-600"
                                                />

                                                <div>

                                                    <p className="font-semibold text-blue-900">
                                                        Manager-only preferences
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-blue-700">
                                                        These preferences affect only your authenticated Manager account. They do not change project permissions, team membership, or system-wide notification rules.
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="space-y-2">

                                            {notificationTypes.map(
                                                (
                                                    notification
                                                ) => {
                                                    const enabled =
                                                        Boolean(
                                                            settings
                                                                .notifications[
                                                                notification
                                                                    .id
                                                            ]
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 p-4"
                                                        >

                                                            <div className="flex items-start gap-3">

                                                                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">

                                                                    <Bell
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-amber-600"
                                                                    />

                                                                </div>

                                                                <div>

                                                                    <div className="flex flex-wrap items-center gap-2">

                                                                        <p className="font-semibold text-slate-900">
                                                                            {
                                                                                notification.title
                                                                            }
                                                                        </p>

                                                                        {notification.mandatory && (
                                                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                                                                                Required
                                                                            </span>
                                                                        )}

                                                                    </div>

                                                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                                                        {
                                                                            notification.description
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-slate-400">
                                                                        Channel:{" "}
                                                                        {
                                                                            notification.channel
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>

                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={
                                                                    enabled
                                                                }
                                                                disabled={
                                                                    notification.mandatory
                                                                }
                                                                onClick={() =>
                                                                    handleNotificationChange(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                                                    enabled
                                                                        ? "bg-violet-600"
                                                                        : "bg-slate-300"
                                                                } ${
                                                                    notification.mandatory
                                                                        ? "cursor-not-allowed opacity-70"
                                                                        : ""
                                                                }`}
                                                            >

                                                                <span
                                                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                                        enabled
                                                                            ? "left-6"
                                                                            : "left-1"
                                                                    }`}
                                                                />

                                                            </button>

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>

                                        <div className="mt-7">

                                            <h3 className="font-bold text-slate-900">
                                                Notification Channels
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Select the supported channels through which notifications may be delivered.
                                            </p>

                                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                                                <ChannelCard
                                                    title="Email"
                                                    description="Receive supported notifications through your account email."
                                                    icon={Mail}
                                                    enabled={
                                                        settings
                                                            .notificationChannels
                                                            .email
                                                    }
                                                    onClick={() =>
                                                        handleNotificationChannelChange(
                                                            "email"
                                                        )
                                                    }
                                                    iconBg="bg-blue-100"
                                                    iconColor="text-blue-600"
                                                />

                                                <ChannelCard
                                                    title="In-App"
                                                    description="Receive notifications inside the Manager workspace."
                                                    icon={Bell}
                                                    enabled={
                                                        settings
                                                            .notificationChannels
                                                            .inApp
                                                    }
                                                    onClick={() =>
                                                        handleNotificationChannelChange(
                                                            "inApp"
                                                        )
                                                    }
                                                    iconBg="bg-violet-100"
                                                    iconColor="text-violet-600"
                                                />

                                            </div>

                                        </div>

                                        <SaveButton
                                            label="Save Notification Preferences"
                                            saving={
                                                isSaving
                                            }
                                            onClick={
                                                handleSaveNotifications
                                            }
                                        />

                                    </div>

                                </section>
                            )}

                            {/* ==================================================
                                SET-002 LANGUAGE
                            ================================================== */}

                            {activeSection ===
                                "language" && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

                                                <Globe2
                                                    size={21}
                                                    className="text-blue-600"
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                                    SET-002
                                                </p>

                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Language Preferences
                                                </h2>

                                                <p className="text-sm text-slate-500">
                                                    Select the language used by your Manager interface.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="p-6">

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                            {languages.map(
                                                (
                                                    language
                                                ) => {
                                                    const selected =
                                                        settings.language ===
                                                        language.id;

                                                    return (
                                                        <button
                                                            key={
                                                                language.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleLanguageChange(
                                                                    language.id
                                                                )
                                                            }
                                                            className={`relative rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                                                                selected
                                                                    ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                                                                    : "border-slate-200 bg-white"
                                                            }`}
                                                        >

                                                            {selected && (
                                                                <CheckCircle2
                                                                    size={
                                                                        21
                                                                    }
                                                                    className="absolute right-4 top-4 text-blue-600"
                                                                />
                                                            )}

                                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

                                                                <Globe2
                                                                    size={
                                                                        22
                                                                    }
                                                                    className="text-blue-600"
                                                                />

                                                            </div>

                                                            <h3 className="mt-4 font-bold text-slate-900">
                                                                {
                                                                    language.name
                                                                }
                                                            </h3>

                                                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                                                {
                                                                    language.description
                                                                }
                                                            </p>

                                                            {selected && (
                                                                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                                                    <Check
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                    Selected
                                                                </span>
                                                            )}

                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>

                                        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <AlertCircle
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-slate-500"
                                                />

                                                <p className="text-sm leading-6 text-slate-600">
                                                    Language preferences change the supported system interface only. User-entered project information is not automatically translated.
                                                </p>

                                            </div>

                                        </div>

                                        <SaveButton
                                            label="Save Language Preference"
                                            saving={
                                                isSaving
                                            }
                                            onClick={
                                                handleSaveLanguage
                                            }
                                        />

                                    </div>

                                </section>
                            )}

                            {/* ==================================================
                                SET-003 THEME
                            ================================================== */}

                            {activeSection ===
                                "theme" && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 via-blue-50 to-cyan-50 px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">

                                                <Palette
                                                    size={21}
                                                    className="text-violet-600"
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                                                    SET-003
                                                </p>

                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Theme Preferences
                                                </h2>

                                                <p className="text-sm text-slate-500">
                                                    Customize the visual appearance of your Manager workspace.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="p-6">

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                            {themes.map(
                                                (
                                                    theme
                                                ) => {
                                                    const Icon =
                                                        theme.icon;

                                                    const selected =
                                                        settings.theme ===
                                                        theme.id;

                                                    return (
                                                        <button
                                                            key={
                                                                theme.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleThemeChange(
                                                                    theme.id
                                                                )
                                                            }
                                                            className={`relative rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                                                selected
                                                                    ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                                                                    : "border-slate-200 bg-white"
                                                            }`}
                                                        >

                                                            {selected && (
                                                                <div className="absolute right-4 top-4">
                                                                    <CheckCircle2
                                                                        size={
                                                                            20
                                                                        }
                                                                        className="text-violet-600"
                                                                    />
                                                                </div>
                                                            )}

                                                            <div
                                                                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg}`}
                                                            >
                                                                <Icon
                                                                    size={
                                                                        21
                                                                    }
                                                                    className={
                                                                        theme.iconColor
                                                                    }
                                                                />
                                                            </div>

                                                            <h3 className="font-bold text-slate-900">
                                                                {
                                                                    theme.title
                                                                }
                                                            </h3>

                                                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                                                {
                                                                    theme.description
                                                                }
                                                            </p>

                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>

                                        <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <ShieldCheck
                                                    size={19}
                                                    className="mt-0.5 shrink-0 text-violet-600"
                                                />

                                                <p className="text-sm leading-6 text-violet-700">
                                                    Theme preferences affect only your Manager interface. They do not modify the application's global theme configuration or project data.
                                                </p>

                                            </div>

                                        </div>

                                        <SaveButton
                                            label="Save Theme Preference"
                                            saving={
                                                isSaving
                                            }
                                            onClick={
                                                handleSaveTheme
                                            }
                                        />

                                    </div>

                                </section>
                            )}

                            {/* ==================================================
                                SET-004 DASHBOARD
                            ================================================== */}

                            {activeSection ===
                                "dashboard" && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-cyan-50 px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">

                                                <LayoutDashboard
                                                    size={21}
                                                    className="text-emerald-600"
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                    SET-004
                                                </p>

                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Dashboard Preferences
                                                </h2>

                                                <p className="text-sm text-slate-500">
                                                    Choose the information and widgets displayed on your Manager dashboard.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="p-6">

                                        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <ShieldCheck
                                                    size={19}
                                                    className="mt-0.5 shrink-0 text-blue-600"
                                                />

                                                <p className="text-sm leading-6 text-blue-700">
                                                    Dashboard preferences control visibility only. A widget can display information only when your Manager role has permission to access that information.
                                                </p>

                                            </div>

                                        </div>

                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                            {dashboardWidgets.map(
                                                (
                                                    widget
                                                ) => {
                                                    const enabled =
                                                        Boolean(
                                                            settings
                                                                .dashboard[
                                                                widget.id
                                                            ]
                                                        );

                                                    return (
                                                        <PreferenceToggle
                                                            key={
                                                                widget.id
                                                            }
                                                            title={
                                                                widget.title
                                                            }
                                                            description={
                                                                widget.description
                                                            }
                                                            enabled={
                                                                enabled
                                                            }
                                                            onClick={() =>
                                                                handleDashboardWidgetChange(
                                                                    widget.id
                                                                )
                                                            }
                                                            icon={
                                                                LayoutDashboard
                                                            }
                                                            iconBg="bg-emerald-100"
                                                            iconColor="text-emerald-600"
                                                        />
                                                    );
                                                }
                                            )}

                                        </div>

                                        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <Clock3
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-slate-500"
                                                />

                                                <p className="text-sm leading-6 text-slate-600">
                                                    Your selected dashboard configuration is stored for future sessions and does not modify the underlying project, team, sprint, or task data.
                                                </p>

                                            </div>

                                        </div>

                                        <SaveButton
                                            label="Save Dashboard Preferences"
                                            saving={
                                                isSaving
                                            }
                                            onClick={
                                                handleSaveDashboard
                                            }
                                        />

                                    </div>

                                </section>
                            )}

                            {/* ==================================================
                                SET-005 AI
                            ================================================== */}

                            {activeSection ===
                                "ai" && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-blue-50 to-violet-50 px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100">

                                                <BrainCircuit
                                                    size={21}
                                                    className="text-cyan-600"
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                                                    SET-005
                                                </p>

                                                <h2 className="text-lg font-bold text-slate-900">
                                                    AI Preferences
                                                </h2>

                                                <p className="text-sm text-slate-500">
                                                    Configure how AI-assisted features are presented in your Manager workspace.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="p-6">

                                        <div className="mb-6 rounded-xl border border-violet-100 bg-violet-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <ShieldCheck
                                                    size={19}
                                                    className="mt-0.5 shrink-0 text-violet-600"
                                                />

                                                <div>

                                                    <p className="font-semibold text-violet-900">
                                                        AI preferences do not change AI system configuration
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-violet-700">
                                                        These settings control how AI features are presented to you. They do not change the underlying AI model, security permissions, project authorization, or existing project data.
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="space-y-3">

                                            {aiOptions.map(
                                                (
                                                    option
                                                ) => (
                                                    <PreferenceToggle
                                                        key={
                                                            option.id
                                                        }
                                                        title={
                                                            option.title
                                                        }
                                                        description={
                                                            option.description
                                                        }
                                                        enabled={
                                                            Boolean(
                                                                settings
                                                                    .ai[
                                                                    option.id
                                                                ]
                                                            )
                                                        }
                                                        onClick={() =>
                                                            handleAIOptionChange(
                                                                option.id
                                                            )
                                                        }
                                                        icon={
                                                            BrainCircuit
                                                        }
                                                        iconBg="bg-cyan-100"
                                                        iconColor="text-cyan-600"
                                                    />
                                                )
                                            )}

                                        </div>

                                        {/* AI SUMMARY FREQUENCY */}

                                        <div className="mt-7">

                                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                                AI Summary Frequency
                                            </label>

                                            <select
                                                value={
                                                    settings
                                                        .ai
                                                        .summaryFrequency
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleAISelectChange(
                                                        "summaryFrequency",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                            >

                                                <option value="realtime">
                                                    Real-time
                                                </option>

                                                <option value="daily">
                                                    Daily
                                                </option>

                                                <option value="weekly">
                                                    Weekly
                                                </option>

                                                <option value="off">
                                                    Off
                                                </option>

                                            </select>

                                        </div>

                                        {/* AI RECOMMENDATION DISPLAY */}

                                        <div className="mt-5">

                                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                                AI Recommendation Display
                                            </label>

                                            <select
                                                value={
                                                    settings
                                                        .ai
                                                        .recommendationDisplay
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleAISelectChange(
                                                        "recommendationDisplay",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                            >

                                                <option value="compact">
                                                    Compact
                                                </option>

                                                <option value="detailed">
                                                    Detailed
                                                </option>

                                            </select>

                                        </div>

                                        {/* AI NOTIFICATION PRIORITY */}

                                        <div className="mt-5">

                                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                                AI Notification Priority
                                            </label>

                                            <select
                                                value={
                                                    settings
                                                        .ai
                                                        .notificationPriority
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleAISelectChange(
                                                        "notificationPriority",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                            >

                                                <option value="all">
                                                    All
                                                </option>

                                                <option value="important">
                                                    Important
                                                </option>

                                                <option value="critical">
                                                    Critical Only
                                                </option>

                                            </select>

                                        </div>

                                        <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <AlertCircle
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-amber-600"
                                                />

                                                <p className="text-sm leading-6 text-amber-700">
                                                    AI-generated predictions and recommendations must remain distinguishable from actual project data. Disabling an AI preference does not delete existing AI or project records.
                                                </p>

                                            </div>

                                        </div>

                                        <SaveButton
                                            label="Save AI Preferences"
                                            saving={
                                                isSaving
                                            }
                                            onClick={
                                                handleSaveAI
                                            }
                                        />

                                    </div>

                                </section>
                            )}

                        </div>
                    </div>

                    {/* ==================================================
                        SECURITY INFORMATION
                    ================================================== */}

                    <section className="mt-6">

                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                            <div className="flex items-start gap-3">

                                <ShieldCheck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>

                                    <h3 className="font-bold text-blue-900">
                                        Manager Preference Scope
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-blue-700">
                                        These settings apply only to the authenticated Manager. They do not modify project permissions, Team membership, task assignments, Sprint data, or global system configuration. Backend persistence should enforce the same user and role authorization rules.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
}

// ============================================================
// PREFERENCE TOGGLE
// ============================================================

function PreferenceToggle({
    title,
    description,
    enabled,
    onClick,
    icon: Icon,
    iconBg,
    iconColor,
}) {
    return (
        <div className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">

            <div className="flex min-w-0 items-start gap-3">

                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                    <Icon
                        size={18}
                        className={iconColor}
                    />
                </div>

                <div className="min-w-0">

                    <p className="font-semibold text-slate-900">
                        {title}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                        {description}
                    </p>

                </div>

            </div>

            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={onClick}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    enabled
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                }`}
            >

                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        enabled
                            ? "left-6"
                            : "left-1"
                    }`}
                />

            </button>

        </div>
    );
}

// ============================================================
// CHANNEL CARD
// ============================================================

function ChannelCard({
    title,
    description,
    icon: Icon,
    enabled,
    onClick,
    iconBg,
    iconColor,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                enabled
                    ? "border-violet-300 bg-violet-50 ring-2 ring-violet-100"
                    : "border-slate-200 bg-white"
            }`}
        >

            {enabled && (
                <CheckCircle2
                    size={20}
                    className="absolute right-4 top-4 text-violet-600"
                />
            )}

            <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
            >
                <Icon
                    size={20}
                    className={iconColor}
                />
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
            </p>

        </button>
    );
}

// ============================================================
// SAVE BUTTON
// ============================================================

function SaveButton({
    label,
    saving,
    onClick,
}) {
    return (
        <div className="mt-7 flex justify-end border-t border-slate-200 pt-5">

            <button
                type="button"
                onClick={onClick}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >

                <Save
                    size={17}
                />

                {saving
                    ? "Saving..."
                    : label}

            </button>

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ManagerSettings;