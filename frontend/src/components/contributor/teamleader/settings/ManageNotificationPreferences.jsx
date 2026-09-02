
import { useState } from "react";

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

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = "aipms_teamleader_notification_preferences";

// ============================================================
// DEFAULT NOTIFICATION PREFERENCES
// ============================================================

const DEFAULT_PREFERENCES = {
    taskAssignment: true,
    taskStatusUpdate: true,
    commentsMentions: true,
    managerMessages: true,
    teamMemberUpdates: true,
    sprintUpdates: true,
    deadlineReminders: true,
    reviewRequests: true,
    projectAnnouncements: true,
    emailNotifications: true,
    inAppNotifications: true,
};

// ============================================================
// NOTIFICATION OPTIONS
// ============================================================

const NOTIFICATION_OPTIONS = [
    {
        key: "taskAssignment",
        title: "Task Assignment Notifications",
        description:
            "Receive notifications when a task is assigned or reassigned to you or your team.",
    },
    {
        key: "taskStatusUpdate",
        title: "Task Status Updates",
        description:
            "Receive notifications when task statuses change.",
    },
    {
        key: "commentsMentions",
        title: "Comments and Mentions",
        description:
            "Receive notifications when someone comments on a task or mentions you.",
    },
    {
        key: "managerMessages",
        title: "Manager Messages",
        description:
            "Receive notifications when the Project Manager sends you a message.",
    },
    {
        key: "teamMemberUpdates",
        title: "Team Member Updates",
        description:
            "Receive notifications about important updates from your team members.",
    },
    {
        key: "sprintUpdates",
        title: "Sprint Updates",
        description:
            "Receive notifications about sprint changes, progress, and updates.",
    },
    {
        key: "deadlineReminders",
        title: "Deadline Reminders",
        description:
            "Receive reminders about approaching task and project deadlines.",
    },
    {
        key: "reviewRequests",
        title: "Review Requests",
        description:
            "Receive notifications when work requires your review.",
    },
    {
        key: "projectAnnouncements",
        title: "Project Announcements",
        description:
            "Receive important announcements related to assigned projects.",
    },
];

// ============================================================
// LOAD PREFERENCES
// ============================================================

function loadPreferences() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return { ...DEFAULT_PREFERENCES };
        }

        const parsed = JSON.parse(stored);

        if (!parsed || typeof parsed !== "object") {
            return { ...DEFAULT_PREFERENCES };
        }

        return {
            ...DEFAULT_PREFERENCES,
            ...parsed,
        };
    } catch {
        return { ...DEFAULT_PREFERENCES };
    }
}

// ============================================================
// SAVE PREFERENCES
// ============================================================

function savePreferences(preferences) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(preferences)
    );
}

// ============================================================
// TOGGLE COMPONENT
// ============================================================

function PreferenceToggle({ enabled, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? "Disable setting" : "Enable setting"}
            onClick={() => onChange(!enabled)}
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

                    ${
                        enabled
                            ? "translate-x-5"
                            : "translate-x-0.5"
                    }
                `}
            />
        </button>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ManageNotificationPreferences() {
    // ========================================================
    // INITIAL STATE
    // ========================================================

    // Lazy initialization avoids useEffect + setState.
    const [preferences, setPreferences] = useState(
        () => loadPreferences()
    );

    const [savedPreferences, setSavedPreferences] = useState(
        () => loadPreferences()
    );

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    // ========================================================
    // UPDATE ONE PREFERENCE
    // ========================================================

    const handleToggle = (key) => {
        setPreferences((current) => ({
            ...current,
            [key]: !current[key],
        }));

        setMessage("");
        setError("");
    };

    // ========================================================
    // ENABLE ALL
    // ========================================================

    const handleEnableAll = () => {
        const enabledPreferences = Object.keys(
            DEFAULT_PREFERENCES
        ).reduce((result, key) => {
            result[key] = true;
            return result;
        }, {});

        setPreferences(enabledPreferences);

        setMessage("");
        setError("");
    };

    // ========================================================
    // DISABLE ALL
    // ========================================================

    const handleDisableAll = () => {
        const disabledPreferences = Object.keys(
            DEFAULT_PREFERENCES
        ).reduce((result, key) => {
            result[key] = false;
            return result;
        }, {});

        setPreferences(disabledPreferences);

        setMessage("");
        setError("");
    };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validatePreferences = () => {
        if (!preferences) {
            return "Invalid notification preferences.";
        }

        const requiredKeys = Object.keys(
            DEFAULT_PREFERENCES
        );

        for (const key of requiredKeys) {
            if (typeof preferences[key] !== "boolean") {
                return "Invalid notification preferences.";
            }
        }

        if (
            !preferences.emailNotifications &&
            !preferences.inAppNotifications
        ) {
            return (
                "Invalid notification preferences. " +
                "Enable at least one delivery method."
            );
        }

        return "";
    };

    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = () => {
        setMessage("");
        setError("");

        const validationError = validatePreferences();

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSaving(true);

        try {
            const preferencesToSave = {
                ...preferences,
            };

            savePreferences(preferencesToSave);

            setSavedPreferences(preferencesToSave);

            setMessage(
                "Notification preferences updated successfully."
            );
        } catch {
            setError(
                "Unable to update notification preferences. " +
                "Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        setPreferences({
            ...savedPreferences,
        });

        setMessage("");

        setError("");
    };

    // ========================================================
    // RESET TO DEFAULT
    // ========================================================

    const handleReset = () => {
        setPreferences({
            ...DEFAULT_PREFERENCES,
        });

        setMessage("");

        setError("");
    };

    // ========================================================
    // COUNT ENABLED
    // ========================================================

    const enabledCount = NOTIFICATION_OPTIONS.filter(
        (option) => preferences[option.key]
    ).length;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="w-full">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* ==================================================
                    HEADER
                ================================================== */}

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

                        {/* ICON */}

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

                        {/* HEADER TEXT */}

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

                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

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

                {/* ==================================================
                    ERROR MESSAGE
                ================================================== */}

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

                {/* ==================================================
                    OVERVIEW
                ================================================== */}

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
                                {enabledCount} of{" "}
                                {NOTIFICATION_OPTIONS.length} notification
                                categories are enabled.
                            </p>

                        </div>

                        <div className="flex flex-wrap gap-2">

                            {/* ENABLE ALL */}

                            <button
                                type="button"
                                onClick={handleEnableAll}
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

                                    dark:border-blue-800
                                    dark:bg-[#0b2038]
                                    dark:text-blue-400
                                    dark:hover:bg-blue-950/60
                                "
                            >
                                Enable All
                            </button>

                            {/* DISABLE ALL */}

                            <button
                                type="button"
                                onClick={handleDisableAll}
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

                {/* ==================================================
                    NOTIFICATION CATEGORIES
                ================================================== */}

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

                    {/* SECTION HEADER */}

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

                    {/* OPTIONS */}

                    <div
                        className="
                            divide-y
                            divide-slate-200
                            dark:divide-blue-900/50
                        "
                    >
                        {NOTIFICATION_OPTIONS.map((option) => (
                            <div
                                key={option.key}
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
                                    enabled={
                                        preferences[option.key]
                                    }
                                    onChange={() =>
                                        handleToggle(option.key)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ==================================================
                    DELIVERY METHODS
                ================================================== */}

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

                    {/* SECTION HEADER */}

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

                        {/* ==================================================
                            EMAIL
                        ================================================== */}

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
                                    preferences.emailNotifications
                                }
                                onChange={() =>
                                    handleToggle(
                                        "emailNotifications"
                                    )
                                }
                            />
                        </div>

                        {/* ==================================================
                            IN-APP
                        ================================================== */}

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
                                    preferences.inAppNotifications
                                }
                                onChange={() =>
                                    handleToggle(
                                        "inAppNotifications"
                                    )
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    ACTIONS
                ================================================== */}

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

                        {/* ==================================================
                            RESET
                        ================================================== */}

                        <button
                            type="button"
                            onClick={handleReset}
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

                                dark:border-blue-800
                                dark:bg-[#0b2038]
                                dark:text-slate-300
                                dark:hover:bg-blue-950/60
                            "
                        >
                            <RotateCcw className="h-4 w-4" />

                            Reset
                        </button>

                        {/* ==================================================
                            CANCEL
                        ================================================== */}

                        <button
                            type="button"
                            onClick={handleCancel}
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

                                dark:border-blue-800
                                dark:bg-[#0b2038]
                                dark:text-slate-300
                                dark:hover:bg-blue-950/60
                            "
                        >
                            Cancel
                        </button>

                        {/* ==================================================
                            SAVE
                        ================================================== */}

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
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

                {/* ==================================================
                    USE CASE INFORMATION
                ================================================== */}

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
                                and communication notifications you
                                receive.
                            </p>

                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default ManageNotificationPreferences;
