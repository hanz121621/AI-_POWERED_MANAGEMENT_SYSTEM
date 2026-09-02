
import { useState } from "react";

import {
    Bell,
    Mail,
    MessageSquare,
    ClipboardList,
    FolderKanban,
    Zap,
    Save,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

// ============================================================
// STAFF - MANAGE NOTIFICATION PREFERENCES
// STAFF-SETTING-001
// ============================================================

const NOTIFICATION_STORAGE_KEY =
    "aipms_staff_notification_preferences";

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {
    enableNotifications: true,

    taskAssignments: true,
    taskStatusUpdates: true,
    taskComments: true,

    projectUpdates: true,
    sprintUpdates: true,

    teamMessages: true,
    mentions: true,

    emailNotifications: false,

    soundNotifications: true,
};

// ============================================================
// LOAD SETTINGS
// ============================================================

const getInitialSettings = () => {
    try {
        const stored = localStorage.getItem(
            NOTIFICATION_STORAGE_KEY
        );

        if (!stored) {
            return { ...DEFAULT_SETTINGS };
        }

        const parsed = JSON.parse(stored);

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
        };
    } catch (error) {
        console.error(
            "Failed to load notification preferences:",
            error
        );

        return { ...DEFAULT_SETTINGS };
    }
};

// ============================================================
// TOGGLE COMPONENT
// IMPORTANT:
// This component MUST remain outside the main component.
// ============================================================

function Toggle({ enabled, onClick, disabled = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                enabled
                    ? "bg-blue-600"
                    : "bg-slate-700"
            } ${
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
            }`}
            aria-label={
                enabled
                    ? "Disable setting"
                    : "Enable setting"
            }
            aria-pressed={enabled}
        >
            <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    enabled
                        ? "left-6"
                        : "left-1"
                }`}
            />
        </button>
    );
}

// ============================================================
// SETTING ROW COMPONENT
// IMPORTANT:
// This component MUST remain outside the main component.
// ============================================================

function SettingRow({
    icon: Icon,
    title,
    description,
    enabled,
    onToggle,
    disabled = false,
}) {
    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-950 p-4 transition ${
                disabled
                    ? "opacity-50"
                    : "hover:border-slate-600"
            }`}
        >
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                    <Icon
                        size={19}
                        className="text-blue-400"
                    />
                </div>

                <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white">
                        {title}
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            <Toggle
                enabled={enabled}
                onClick={onToggle}
                disabled={disabled}
            />
        </div>
    );
}

// ============================================================
// STAFF NOTIFICATION PREFERENCES
// ============================================================

function ManageNotificationPreferences() {
    const [settings, setSettings] = useState(
        getInitialSettings
    );

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // ========================================================
    // HANDLE TOGGLE
    // ========================================================

    const handleToggle = (field) => {
        setSettings((previous) => ({
            ...previous,
            [field]: !previous[field],
        }));

        setSaved(false);
        setError("");
    };

    // ========================================================
    // SAVE SETTINGS
    // ========================================================

    const handleSave = () => {
        try {
            localStorage.setItem(
                NOTIFICATION_STORAGE_KEY,
                JSON.stringify(settings)
            );

            setSaved(true);
            setError("");

            setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (saveError) {
            console.error(
                "Failed to save notification preferences:",
                saveError
            );

            setError(
                "Unable to save notification preferences."
            );

            setSaved(false);
        }
    };

    // ========================================================
    // RESET SETTINGS
    // ========================================================

    const handleReset = () => {
        setSettings({
            ...DEFAULT_SETTINGS,
        });

        setSaved(false);
        setError("");
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                        <Bell
                            size={24}
                            className="text-blue-400"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Notification Preferences
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            STAFF-SETTING-001
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                    Choose which notifications you want to receive
                    while working in the AI-PMS system.
                </p>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {saved && (
                <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                    <CheckCircle2
                        size={20}
                        className="shrink-0 text-green-400"
                    />

                    <p className="text-sm font-medium text-green-400">
                        Notification preferences saved
                        successfully.
                    </p>
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle
                        size={20}
                        className="shrink-0 text-red-400"
                    />

                    <p className="text-sm font-medium text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {/* ==================================================
                GENERAL NOTIFICATIONS
            ================================================== */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        General Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Control your overall notification behavior.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                <Bell
                                    size={20}
                                    className="text-blue-400"
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-white">
                                    Enable Notifications
                                </h4>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Enable or disable staff
                                    notifications throughout the
                                    system.
                                </p>
                            </div>
                        </div>

                        <Toggle
                            enabled={
                                settings.enableNotifications
                            }
                            onClick={() =>
                                handleToggle(
                                    "enableNotifications"
                                )
                            }
                        />
                    </div>
                </div>
            </section>

            {/* ==================================================
                TASK NOTIFICATIONS
            ================================================== */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Task Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Receive updates related to your assigned
                        tasks.
                    </p>
                </div>

                <div className="space-y-3">
                    <SettingRow
                        icon={ClipboardList}
                        title="Task Assignments"
                        description="Notify me when a task is assigned to me."
                        enabled={
                            settings.taskAssignments
                        }
                        onToggle={() =>
                            handleToggle(
                                "taskAssignments"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />

                    <SettingRow
                        icon={Zap}
                        title="Task Status Updates"
                        description="Notify me when the status of my tasks changes."
                        enabled={
                            settings.taskStatusUpdates
                        }
                        onToggle={() =>
                            handleToggle(
                                "taskStatusUpdates"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />

                    <SettingRow
                        icon={MessageSquare}
                        title="Task Comments"
                        description="Notify me when someone comments on my tasks."
                        enabled={
                            settings.taskComments
                        }
                        onToggle={() =>
                            handleToggle(
                                "taskComments"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />
                </div>
            </section>

            {/* ==================================================
                PROJECT & SPRINT NOTIFICATIONS
            ================================================== */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Project & Sprint Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Stay informed about project and sprint
                        activity.
                    </p>
                </div>

                <div className="space-y-3">
                    <SettingRow
                        icon={FolderKanban}
                        title="Project Updates"
                        description="Notify me when assigned projects are updated."
                        enabled={
                            settings.projectUpdates
                        }
                        onToggle={() =>
                            handleToggle(
                                "projectUpdates"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />

                    <SettingRow
                        icon={Zap}
                        title="Sprint Updates"
                        description="Notify me about sprint changes, progress, and deadlines."
                        enabled={
                            settings.sprintUpdates
                        }
                        onToggle={() =>
                            handleToggle(
                                "sprintUpdates"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />
                </div>
            </section>

            {/* ==================================================
                COMMUNICATION NOTIFICATIONS
            ================================================== */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Communication Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Control notifications related to team
                        communication.
                    </p>
                </div>

                <div className="space-y-3">
                    <SettingRow
                        icon={MessageSquare}
                        title="Team Messages"
                        description="Notify me when I receive a team message."
                        enabled={
                            settings.teamMessages
                        }
                        onToggle={() =>
                            handleToggle(
                                "teamMessages"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />

                    <SettingRow
                        icon={Bell}
                        title="Mentions"
                        description="Notify me when another team member mentions me."
                        enabled={
                            settings.mentions
                        }
                        onToggle={() =>
                            handleToggle(
                                "mentions"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />
                </div>
            </section>

            {/* ==================================================
                DELIVERY OPTIONS
            ================================================== */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Notification Delivery
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Choose how notifications are delivered.
                    </p>
                </div>

                <div className="space-y-3">
                    <SettingRow
                        icon={Mail}
                        title="Email Notifications"
                        description="Receive important AI-PMS notifications through email."
                        enabled={
                            settings.emailNotifications
                        }
                        onToggle={() =>
                            handleToggle(
                                "emailNotifications"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />

                    <SettingRow
                        icon={Bell}
                        title="Sound Notifications"
                        description="Play a notification sound when new notifications arrive."
                        enabled={
                            settings.soundNotifications
                        }
                        onToggle={() =>
                            handleToggle(
                                "soundNotifications"
                            )
                        }
                        disabled={
                            !settings.enableNotifications
                        }
                    />
                </div>
            </section>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                    <Bell
                        size={19}
                        className="mt-0.5 shrink-0 text-blue-400"
                    />

                    <div>
                        <h4 className="text-sm font-semibold text-blue-300">
                            Notification Information
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            These preferences are currently stored
                            locally in your browser. They will be
                            connected to the AI-PMS backend when the
                            Staff settings API is integrated.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
                >
                    <RotateCcw size={17} />
                    Reset
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                    <Save size={17} />
                    Save Preferences
                </button>
            </div>
        </div>
    );
}

export default ManageNotificationPreferences;
