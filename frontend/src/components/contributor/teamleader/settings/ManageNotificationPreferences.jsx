
import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    Mail,
    Smartphone,
    RotateCcw,
    Save,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import api from "@/services/api";

const DEFAULT_PREFERENCES = {
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    inSystemNotificationsEnabled: true,
    taskAssignmentAlertsEnabled: true,
    projectDeadlineRemindersEnabled: true,
    sprintUpdateNotificationsEnabled: true,
    aiRecommendationAlertsEnabled: true,
    userActivityNotificationsEnabled: true,
};

const NOTIFICATION_OPTIONS = [
    {
        key: "taskAssignmentAlertsEnabled",
        title: "Task Assignment Notifications",
        description:
            "Receive notifications when a task is assigned or reassigned to you or your team.",
    },
    {
        key: "userActivityNotificationsEnabled",
        title: "Task Status and Team Updates",
        description:
            "Receive notifications about task status changes and important team member activity.",
    },
    {
        key: "userActivityNotificationsEnabled",
        title: "Comments and Mentions",
        description:
            "Receive notifications when someone comments on a task or mentions you.",
    },
    {
        key: "userActivityNotificationsEnabled",
        title: "Manager Messages",
        description:
            "Receive notifications about important communication and updates from the Project Manager.",
    },
    {
        key: "userActivityNotificationsEnabled",
        title: "Team Member Updates",
        description:
            "Receive notifications about important activity and updates from your team members.",
    },
    {
        key: "sprintUpdateNotificationsEnabled",
        title: "Sprint Updates",
        description:
            "Receive notifications about sprint changes, progress, and updates.",
    },
    {
        key: "projectDeadlineRemindersEnabled",
        title: "Deadline Reminders",
        description:
            "Receive reminders about approaching task and project deadlines.",
    },
    {
        key: "aiRecommendationAlertsEnabled",
        title: "AI Recommendations",
        description:
            "Receive AI-powered recommendations and important AI-generated alerts.",
    },
    {
        key: "userActivityNotificationsEnabled",
        title: "Project Announcements",
        description:
            "Receive important project and team announcements through your notification system.",
    },
];

function extractSettings(response) {
    const data = response?.data;

    return (
        data?.data ??
        data?.Data ??
        data?.notificationSettings ??
        data?.NotificationSettings ??
        data ??
        {}
    );
}

function normalizePreferences(settings) {
    return {
        notificationsEnabled:
            settings?.notificationsEnabled ??
            settings?.NotificationsEnabled ??
            DEFAULT_PREFERENCES.notificationsEnabled,

        emailNotificationsEnabled:
            settings?.emailNotificationsEnabled ??
            settings?.EmailNotificationsEnabled ??
            DEFAULT_PREFERENCES.emailNotificationsEnabled,

        inSystemNotificationsEnabled:
            settings?.inSystemNotificationsEnabled ??
            settings?.InSystemNotificationsEnabled ??
            DEFAULT_PREFERENCES.inSystemNotificationsEnabled,

        taskAssignmentAlertsEnabled:
            settings?.taskAssignmentAlertsEnabled ??
            settings?.TaskAssignmentAlertsEnabled ??
            DEFAULT_PREFERENCES.taskAssignmentAlertsEnabled,

        projectDeadlineRemindersEnabled:
            settings?.projectDeadlineRemindersEnabled ??
            settings?.ProjectDeadlineRemindersEnabled ??
            DEFAULT_PREFERENCES.projectDeadlineRemindersEnabled,

        sprintUpdateNotificationsEnabled:
            settings?.sprintUpdateNotificationsEnabled ??
            settings?.SprintUpdateNotificationsEnabled ??
            DEFAULT_PREFERENCES.sprintUpdateNotificationsEnabled,

        aiRecommendationAlertsEnabled:
            settings?.aiRecommendationAlertsEnabled ??
            settings?.AiRecommendationAlertsEnabled ??
            DEFAULT_PREFERENCES.aiRecommendationAlertsEnabled,

        userActivityNotificationsEnabled:
            settings?.userActivityNotificationsEnabled ??
            settings?.UserActivityNotificationsEnabled ??
            DEFAULT_PREFERENCES.userActivityNotificationsEnabled,
    };
}

function PreferenceToggle({ enabled, onChange, disabled }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? "Disable setting" : "Enable setting"}
            onClick={() => onChange(!enabled)}
            disabled={disabled}
            className={`
                relative
                inline-flex
                h-6
                w-11
                shrink-0
                cursor-pointer
                items-center
                rounded-full
                transition-colors
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${
                    enabled
                        ? "bg-blue-600"
                        : "bg-slate-300 dark:bg-slate-700"
                }
            `}
        >
            <span
                className={`
                    inline-block
                    h-5
                    w-5
                    transform
                    rounded-full
                    bg-white
                    shadow
                    transition-transform
                    duration-200
                    ${enabled ? "translate-x-5" : "translate-x-0.5"}
                `}
            />
        </button>
    );
}

function ManageNotificationPreferences() {
    const [preferences, setPreferences] = useState(
        DEFAULT_PREFERENCES
    );
    const [savedPreferences, setSavedPreferences] = useState(
        DEFAULT_PREFERENCES
    );
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadSettings = async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.get("/notification-settings");
            const normalized = normalizePreferences(
                extractSettings(response)
            );

            setPreferences(normalized);
            setSavedPreferences(normalized);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to load notification preferences. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleToggle = (key) => {
        setPreferences((current) => ({
            ...current,
            [key]: !current[key],
        }));

        setMessage("");
        setError("");
    };

    const handleEnableAll = () => {
        setPreferences({
            ...DEFAULT_PREFERENCES,
        });

        setMessage("");
        setError("");
    };

    const handleDisableAll = () => {
        setPreferences({
            notificationsEnabled: false,
            emailNotificationsEnabled: false,
            inSystemNotificationsEnabled: false,
            taskAssignmentAlertsEnabled: false,
            projectDeadlineRemindersEnabled: false,
            sprintUpdateNotificationsEnabled: false,
            aiRecommendationAlertsEnabled: false,
            userActivityNotificationsEnabled: false,
        });

        setMessage("");
        setError("");
    };

    const validatePreferences = () => {
        if (!preferences) {
            return "Invalid notification preferences.";
        }

        const requiredKeys = Object.keys(DEFAULT_PREFERENCES);

        for (const key of requiredKeys) {
            if (typeof preferences[key] !== "boolean") {
                return "Invalid notification preferences.";
            }
        }

        if (
            !preferences.emailNotificationsEnabled &&
            !preferences.inSystemNotificationsEnabled
        ) {
            return (
                "Enable at least one notification delivery method."
            );
        }

        return "";
    };

    const handleSave = async () => {
        setMessage("");
        setError("");

        const validationError = validatePreferences();

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                notificationsEnabled:
                    preferences.notificationsEnabled,

                emailNotificationsEnabled:
                    preferences.emailNotificationsEnabled,

                inSystemNotificationsEnabled:
                    preferences.inSystemNotificationsEnabled,

                taskAssignmentAlertsEnabled:
                    preferences.taskAssignmentAlertsEnabled,

                projectDeadlineRemindersEnabled:
                    preferences.projectDeadlineRemindersEnabled,

                sprintUpdateNotificationsEnabled:
                    preferences.sprintUpdateNotificationsEnabled,

                aiRecommendationAlertsEnabled:
                    preferences.aiRecommendationAlertsEnabled,

                userActivityNotificationsEnabled:
                    preferences.userActivityNotificationsEnabled,
            };

            const response = await api.put(
                "/notification-settings",
                payload
            );

            const updatedPreferences = normalizePreferences(
                extractSettings(response)
            );

            setPreferences(updatedPreferences);
            setSavedPreferences(updatedPreferences);

            setMessage(
                "Notification preferences updated successfully."
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to update notification preferences. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setPreferences({
            ...savedPreferences,
        });

        setMessage("");
        setError("");
    };

    const handleReset = () => {
        setPreferences({
            ...DEFAULT_PREFERENCES,
        });

        setMessage("");
        setError("");
    };

    const enabledCount = NOTIFICATION_OPTIONS.filter(
        (option, index) => {
            if (index === 0) {
                return preferences.taskAssignmentAlertsEnabled;
            }

            if (index === 5) {
                return preferences.sprintUpdateNotificationsEnabled;
            }

            if (index === 6) {
                return preferences.projectDeadlineRemindersEnabled;
            }

            if (index === 7) {
                return preferences.aiRecommendationAlertsEnabled;
            }

            return preferences.userActivityNotificationsEnabled;
        }
    ).length;

    return (
        <div className="w-full">
            <div className="mx-auto max-w-5xl space-y-6">
                <section
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <Bell className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1
                                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Notification Preferences
                                </h1>

                                <span
                                    className="
                                        rounded-full
                                        bg-blue-50
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-bold
                                        text-blue-600
                                        dark:bg-blue-950/50
                                        dark:text-blue-400
                                    "
                                >
                                    TL-SETTING-001
                                </span>
                            </div>

                            <p
                                className="
                                    mt-2
                                    max-w-3xl
                                    text-sm
                                    leading-6
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Control which project, team, task, sprint,
                                and communication notifications you receive
                                from the AI-PMS.
                            </p>
                        </div>
                    </div>
                </section>

                {message && (
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            p-4
                            dark:border-emerald-900/60
                            dark:bg-emerald-950/30
                        "
                    >
                        <CheckCircle2
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                                text-emerald-600
                                dark:text-emerald-400
                            "
                        />

                        <p
                            className="
                                text-sm
                                font-medium
                                text-emerald-700
                                dark:text-emerald-400
                            "
                        >
                            {message}
                        </p>
                    </div>
                )}

                {error && (
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                            dark:border-red-900/60
                            dark:bg-red-950/30
                        "
                    >
                        <AlertCircle
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                                text-red-600
                                dark:text-red-400
                            "
                        />

                        <p
                            className="
                                text-sm
                                font-medium
                                text-red-700
                                dark:text-red-400
                            "
                        >
                            {error}
                        </p>
                    </div>
                )}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5
                        dark:border-blue-900/60
                        dark:bg-blue-950/25
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-sm
                                    font-bold
                                    text-blue-900
                                    dark:text-blue-300
                                "
                            >
                                Notification Settings
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-blue-800
                                    dark:text-blue-400
                                "
                            >
                                {enabledCount} notification categories are
                                currently enabled.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleEnableAll}
                                disabled={isLoading || isSaving}
                                className="
                                    rounded-lg
                                    border
                                    border-blue-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-blue-600
                                    transition
                                    hover:bg-blue-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    dark:border-blue-800
                                    dark:bg-[#0b2038]
                                    dark:text-blue-400
                                    dark:hover:bg-blue-950/60
                                "
                            >
                                Enable All
                            </button>

                            <button
                                type="button"
                                onClick={handleDisableAll}
                                disabled={isLoading || isSaving}
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                    transition
                                    hover:bg-slate-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    dark:border-blue-800
                                    dark:bg-[#0b2038]
                                    dark:text-slate-300
                                    dark:hover:bg-blue-950/60
                                "
                            >
                                Disable All
                            </button>
                        </div>
                    </div>
                </section>

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    <div
                        className="
                            border-b
                            border-slate-200
                            px-5
                            py-4
                            dark:border-blue-900/60
                        "
                    >
                        <h2
                            className="
                                text-base
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Notification Categories
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Choose the types of notifications you want to
                            receive.
                        </p>
                    </div>

                    <div
                        className="
                            divide-y
                            divide-slate-200
                            dark:divide-blue-900/50
                        "
                    >
                        {isLoading ? (
                            <div className="px-5 py-10 text-center">
                                <div
                                    className="
                                        mx-auto
                                        h-6
                                        w-6
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-blue-200
                                        border-t-blue-600
                                    "
                                />

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Loading notification preferences...
                                </p>
                            </div>
                        ) : (
                            NOTIFICATION_OPTIONS.map((option, index) => {
                                let enabled = false;

                                if (index === 0) {
                                    enabled =
                                        preferences.taskAssignmentAlertsEnabled;
                                } else if (index === 5) {
                                    enabled =
                                        preferences.sprintUpdateNotificationsEnabled;
                                } else if (index === 6) {
                                    enabled =
                                        preferences.projectDeadlineRemindersEnabled;
                                } else if (index === 7) {
                                    enabled =
                                        preferences.aiRecommendationAlertsEnabled;
                                } else {
                                    enabled =
                                        preferences.userActivityNotificationsEnabled;
                                }

                                return (
                                    <div
                                        key={`${option.key}-${index}`}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-5
                                            px-5
                                            py-5
                                            transition
                                            hover:bg-slate-50
                                            dark:hover:bg-blue-950/20
                                        "
                                    >
                                        <div className="min-w-0 flex-1">
                                            <h3
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-slate-900
                                                    dark:text-white
                                                "
                                            >
                                                {option.title}
                                            </h3>

                                            <p
                                                className="
                                                    mt-1
                                                    max-w-3xl
                                                    text-xs
                                                    leading-5
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                {option.description}
                                            </p>
                                        </div>

                                        <PreferenceToggle
                                            enabled={enabled}
                                            disabled={isSaving}
                                            onChange={() => {
                                                if (index === 0) {
                                                    handleToggle(
                                                        "taskAssignmentAlertsEnabled"
                                                    );
                                                } else if (index === 5) {
                                                    handleToggle(
                                                        "sprintUpdateNotificationsEnabled"
                                                    );
                                                } else if (index === 6) {
                                                    handleToggle(
                                                        "projectDeadlineRemindersEnabled"
                                                    );
                                                } else if (index === 7) {
                                                    handleToggle(
                                                        "aiRecommendationAlertsEnabled"
                                                    );
                                                } else {
                                                    handleToggle(
                                                        "userActivityNotificationsEnabled"
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    <div
                        className="
                            border-b
                            border-slate-200
                            px-5
                            py-4
                            dark:border-blue-900/60
                        "
                    >
                        <h2
                            className="
                                text-base
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Notification Delivery
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Choose how AI-PMS notifications are delivered.
                        </p>
                    </div>

                    <div
                        className="
                            divide-y
                            divide-slate-200
                            dark:divide-blue-900/50
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-5
                                px-5
                                py-5
                            "
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-purple-100
                                        text-purple-600
                                        dark:bg-purple-950/50
                                        dark:text-purple-400
                                    "
                                >
                                    <Mail className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Email Notifications
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Receive selected notifications by
                                        email.
                                    </p>
                                </div>
                            </div>

                            <PreferenceToggle
                                enabled={
                                    preferences.emailNotificationsEnabled
                                }
                                disabled={isSaving}
                                onChange={() =>
                                    handleToggle(
                                        "emailNotificationsEnabled"
                                    )
                                }
                            />
                        </div>

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-5
                                px-5
                                py-5
                            "
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-100
                                        text-blue-600
                                        dark:bg-blue-950/50
                                        dark:text-blue-400
                                    "
                                >
                                    <Smartphone className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        In-App Notifications
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Receive notifications inside the
                                        AI-PMS application.
                                    </p>
                                </div>
                            </div>

                            <PreferenceToggle
                                enabled={
                                    preferences.inSystemNotificationsEnabled
                                }
                                disabled={isSaving}
                                onChange={() =>
                                    handleToggle(
                                        "inSystemNotificationsEnabled"
                                    )
                                }
                            />
                        </div>
                    </div>
                </section>

                <section
                    className="
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Changes are stored for future sessions.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading || isSaving}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-xs
                                font-semibold
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:border-blue-800
                                dark:bg-[#0b2038]
                                dark:text-slate-300
                                dark:hover:bg-blue-950/60
                            "
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading || isSaving}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-xs
                                font-semibold
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:border-blue-800
                                dark:bg-[#0b2038]
                                dark:text-slate-300
                                dark:hover:bg-blue-950/60
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading || isSaving}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-xs
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {isSaving ? (
                                <>
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/40
                                            border-t-white
                                        "
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </section>

                <section
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-5
                        dark:border-blue-900/50
                        dark:bg-[#071a2d]
                    "
                >
                    <div className="flex items-start gap-3">
                        <Check
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                                text-blue-600
                                dark:text-blue-400
                            "
                        />

                        <div>
                            <h2
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-800
                                    dark:text-slate-200
                                "
                            >
                                TL-SETTING-001
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Your notification preferences determine
                                which AI-PMS project, team, task, sprint,
                                and communication notifications you receive.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ManageNotificationPreferences;
