
import React, { useEffect, useState } from "react";
import {
    Bell,
    Mail,
    Smartphone,
    Save,
    CheckCircle2,
    AlertTriangle,
    Info,
} from "lucide-react";

// ============================================================
// AIPMS — MANAGER NOTIFICATION PREFERENCES
//
// Use Case:
// SET-001 — Manage Notification Preferences
//
// Primary Actor:
// Project Manager
//
// IMPORTANT:
// - Preferences belong only to the authenticated Manager.
// - Preferences do not modify role permissions.
// - Preferences do not modify project data.
// - Mandatory notifications cannot be disabled.
// - Notification types/channels are represented as configurable
//   data so they can later be retrieved from the backend.
// ============================================================

// ============================================================
// DEFAULT CONFIGURATION
//
// In the backend version, these should be retrieved from the
// system configuration/database instead of being hard-coded.
// ============================================================

const DEFAULT_NOTIFICATION_TYPES = [
    {
        id: "project_updates",
        name: "Project Updates",
        description:
            "Receive important updates about projects you manage.",
        mandatory: false,
    },
    {
        id: "sprint_updates",
        name: "Sprint Updates",
        description:
            "Receive notifications about sprint progress and changes.",
        mandatory: false,
    },
    {
        id: "task_updates",
        name: "Task Updates",
        description:
            "Receive notifications about task assignments and status changes.",
        mandatory: false,
    },
    {
        id: "deadline_alerts",
        name: "Deadline Alerts",
        description:
            "Receive alerts about approaching and overdue deadlines.",
        mandatory: false,
    },
    {
        id: "team_updates",
        name: "Team Updates",
        description:
            "Receive important updates about your assigned teams.",
        mandatory: false,
    },
    {
        id: "risk_alerts",
        name: "Risk Alerts",
        description:
            "Receive important project risk and issue notifications.",
        mandatory: false,
    },
    {
        id: "security_alerts",
        name: "Security Alerts",
        description:
            "Receive mandatory security and account notifications.",
        mandatory: true,
    },
];

const DEFAULT_NOTIFICATION_CHANNELS = [
    {
        id: "in_app",
        name: "In-App",
        description:
            "Display notifications inside the AIPMS application.",
        icon: Bell,
        supported: true,
    },
    {
        id: "email",
        name: "Email",
        description:
            "Receive supported notifications through email.",
        icon: Mail,
        supported: true,
    },
    {
        id: "push",
        name: "Push",
        description:
            "Receive supported notifications through push notifications.",
        icon: Smartphone,
        supported: true,
    },
];

// ============================================================
// DEFAULT USER PREFERENCES
// ============================================================

const DEFAULT_PREFERENCES = {
    notificationTypes: {
        project_updates: true,
        sprint_updates: true,
        task_updates: true,
        deadline_alerts: true,
        team_updates: true,
        risk_alerts: true,
        security_alerts: true,
    },

    channels: {
        in_app: true,
        email: false,
        push: false,
    },
};

// ============================================================
// STORAGE KEY
//
// Temporary frontend persistence.
//
// Later this should be replaced by your backend/database API.
// ============================================================

const STORAGE_KEY =
    "aipms_manager_notification_preferences";

// ============================================================
// COMPONENT
// ============================================================

function NotificationPreferences() {
    // ========================================================
    // STATE
    // ========================================================

    const [preferences, setPreferences] = useState(
        DEFAULT_PREFERENCES
    );

    const [notificationTypes, setNotificationTypes] =
        useState(DEFAULT_NOTIFICATION_TYPES);

    const [notificationChannels, setNotificationChannels] =
        useState(DEFAULT_NOTIFICATION_CHANNELS);

    const [saving, setSaving] = useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // LOAD CURRENT MANAGER PREFERENCES
    //
    // SET-001:
    // System retrieves the Manager's current notification
    // settings.
    // ========================================================

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                setErrorMessage("");

                // ------------------------------------------------
                // Temporary frontend persistence.
                //
                // Backend implementation should retrieve the
                // authenticated Manager's preferences dynamically.
                // ------------------------------------------------

                const storedPreferences =
                    localStorage.getItem(STORAGE_KEY);

                if (!storedPreferences) {
                    setPreferences(DEFAULT_PREFERENCES);
                    return;
                }

                const parsedPreferences =
                    JSON.parse(storedPreferences);

                setPreferences((current) => ({
                    ...current,

                    ...parsedPreferences,

                    notificationTypes: {
                        ...current.notificationTypes,
                        ...(parsedPreferences.notificationTypes ||
                            {}),
                    },

                    channels: {
                        ...current.channels,
                        ...(parsedPreferences.channels || {}),
                    },
                }));
            } catch (error) {
                console.error(
                    "Failed to load notification preferences:",
                    error
                );

                setErrorMessage(
                    "Unable to load your notification preferences."
                );
            }
        };

        loadPreferences();
    }, []);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // HANDLE NOTIFICATION TYPE
    // ========================================================

    const handleNotificationTypeChange = (
        notification
    ) => {
        clearMessages();

        // ----------------------------------------------------
        // Mandatory notifications cannot be disabled.
        // ----------------------------------------------------

        if (notification.mandatory) {
            return;
        }

        setPreferences((current) => ({
            ...current,

            notificationTypes: {
                ...current.notificationTypes,

                [notification.id]:
                    !current.notificationTypes[
                        notification.id
                    ],
            },
        }));
    };

    // ========================================================
    // HANDLE CHANNEL CHANGE
    // ========================================================

    const handleChannelChange = (channelId) => {
        clearMessages();

        setPreferences((current) => ({
            ...current,

            channels: {
                ...current.channels,

                [channelId]:
                    !current.channels[channelId],
            },
        }));
    };

    // ========================================================
    // VALIDATE PREFERENCES
    // ========================================================

    const validatePreferences = () => {
        // ----------------------------------------------------
        // At least one supported channel should remain enabled.
        // ----------------------------------------------------

        const enabledChannels =
            notificationChannels.filter(
                (channel) =>
                    channel.supported &&
                    preferences.channels[channel.id]
            );

        if (enabledChannels.length === 0) {
            return {
                valid: false,
                message:
                    "At least one notification channel must remain enabled.",
            };
        }

        // ----------------------------------------------------
        // Mandatory notifications must remain enabled.
        // ----------------------------------------------------

        const disabledMandatory =
            notificationTypes.find(
                (notification) =>
                    notification.mandatory &&
                    !preferences.notificationTypes[
                        notification.id
                    ]
            );

        if (disabledMandatory) {
            return {
                valid: false,
                message: `${disabledMandatory.name} is mandatory and cannot be disabled.`,
            };
        }

        return {
            valid: true,
            message: "",
        };
    };

    // ========================================================
    // SAVE PREFERENCES
    //
    // SET-001:
    // 1. Validate
    // 2. Store
    // 3. Confirmation
    // ========================================================

    const handleSave = async () => {
        clearMessages();

        const validation =
            validatePreferences();

        if (!validation.valid) {
            setErrorMessage(validation.message);
            return;
        }

        setSaving(true);

        try {
            // ------------------------------------------------
            // Temporary frontend persistence.
            //
            // Replace this with an API call to the backend.
            // ------------------------------------------------

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(preferences)
            );

            // ------------------------------------------------
            // Confirmation
            // ------------------------------------------------

            setSuccessMessage(
                "Notification preferences saved successfully."
            );
        } catch (error) {
            console.error(
                "Failed to save notification preferences:",
                error
            );

            setErrorMessage(
                "Unable to save notification preferences. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100">

                        <Bell
                            size={23}
                            className="text-violet-600"
                        />

                    </div>

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                            SET-001
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Manage Notification Preferences
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            Configure which notifications you receive
                            and how supported notifications are delivered.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                    <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <p className="text-sm font-semibold text-emerald-700">
                        {successMessage}
                    </p>

                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <AlertTriangle
                        size={19}
                        className="mt-0.5 shrink-0 text-red-600"
                    />

                    <p className="text-sm font-semibold text-red-700">
                        {errorMessage}
                    </p>

                </div>
            )}

            {/* ==================================================
                NOTIFICATION TYPES
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                    <h3 className="font-bold text-slate-900">
                        Notification Types
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Choose the types of notifications you want
                        to receive.
                    </p>

                </div>

                <div className="divide-y divide-slate-100">

                    {notificationTypes.map(
                        (notification) => {
                            const enabled =
                                Boolean(
                                    preferences
                                        .notificationTypes[
                                        notification.id
                                    ]
                                );

                            return (
                                <div
                                    key={
                                        notification.id
                                    }
                                    className="flex items-center justify-between gap-5 px-6 py-5"
                                >

                                    <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <h4 className="font-semibold text-slate-900">
                                                {
                                                    notification.name
                                                }
                                            </h4>

                                            {notification.mandatory && (
                                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                                    Mandatory
                                                </span>
                                            )}

                                        </div>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {
                                                notification.description
                                            }
                                        </p>

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
                                            handleNotificationTypeChange(
                                                notification
                                            )
                                        }
                                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                                            enabled
                                                ? "bg-violet-600"
                                                : "bg-slate-300"
                                        } ${
                                            notification.mandatory
                                                ? "cursor-not-allowed opacity-70"
                                                : "cursor-pointer"
                                        }`}
                                    >

                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${
                                                enabled
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            }`}
                                        />

                                    </button>

                                </div>
                            );
                        }
                    )}

                </div>

            </section>

            {/* ==================================================
                CHANNELS
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                    <h3 className="font-bold text-slate-900">
                        Notification Channels
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Select how supported notifications should
                        be delivered.
                    </p>

                </div>

                <div className="grid gap-4 p-6 md:grid-cols-3">

                    {notificationChannels.map(
                        (channel) => {
                            const Icon =
                                channel.icon;

                            const enabled =
                                Boolean(
                                    preferences
                                        .channels[
                                        channel.id
                                    ]
                                );

                            return (
                                <button
                                    type="button"
                                    key={channel.id}
                                    onClick={() =>
                                        handleChannelChange(
                                            channel.id
                                        )
                                    }
                                    disabled={
                                        !channel.supported
                                    }
                                    className={`rounded-xl border p-5 text-left transition ${
                                        enabled
                                            ? "border-violet-300 bg-violet-50"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    } ${
                                        !channel.supported
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    }`}
                                >

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">

                                            <Icon
                                                size={20}
                                                className={
                                                    enabled
                                                        ? "text-violet-600"
                                                        : "text-slate-500"
                                                }
                                            />

                                        </div>

                                        <div
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                                enabled
                                                    ? "bg-violet-600"
                                                    : "bg-slate-300"
                                            }`}
                                        >

                                            <span
                                                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                    enabled
                                                        ? "translate-x-6"
                                                        : "translate-x-1"
                                                }`}
                                            />

                                        </div>

                                    </div>

                                    <h4 className="mt-4 font-bold text-slate-900">
                                        {channel.name}
                                    </h4>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {
                                            channel.description
                                        }
                                    </p>

                                </button>
                            );
                        }
                    )}

                </div>

            </section>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4">

                <Info
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm text-blue-700">
                    These preferences apply only to your
                    authenticated Manager account. They do not
                    change your project access, role, permissions,
                    team membership, or project data.
                </p>

            </div>

            {/* ==================================================
                SAVE
            ================================================== */}

            <div className="flex justify-end rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <Save size={17} />

                    {saving
                        ? "Saving..."
                        : "Save Preferences"}

                </button>

            </div>

        </div>
    );
}

export default NotificationPreferences;

