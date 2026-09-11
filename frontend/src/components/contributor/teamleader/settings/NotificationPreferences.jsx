
import { useEffect, useState } from "react";
import {
    Bell,
    Mail,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    CalendarClock,
    Users,
    Save,
    Loader2,
} from "lucide-react";
import api from "@/services/api";

const DEFAULT_SETTINGS = {
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    inSystemNotificationsEnabled: true,
    taskAssignmentAlertsEnabled: true,
    projectDeadlineRemindersEnabled: true,
    sprintUpdateNotificationsEnabled: true,
    aiRecommendationAlertsEnabled: true,
    userActivityNotificationsEnabled: true,
};

const notificationOptions = [
    {
        key: "taskAssignmentAlertsEnabled",
        title: "Task assignments",
        description:
            "Receive notifications when tasks are assigned to you or your team.",
        icon: CheckCircle2,
    },
    {
        key: "taskStatusUpdates",
        title: "Task status updates",
        description: "Get updates when team tasks change status.",
        icon: CheckCircle2,
        backendKey: "userActivityNotificationsEnabled",
    },
    {
        key: "commentsMentions",
        title: "Comments and mentions",
        description:
            "Receive alerts when someone comments or mentions you.",
        icon: MessageSquare,
        backendKey: "userActivityNotificationsEnabled",
    },
    {
        key: "managerMessages",
        title: "Manager messages",
        description:
            "Receive messages and updates from project managers.",
        icon: Mail,
        backendKey: "userActivityNotificationsEnabled",
    },
    {
        key: "teamMemberUpdates",
        title: "Team member updates",
        description:
            "Get important updates related to your team members.",
        icon: Users,
        backendKey: "userActivityNotificationsEnabled",
    },
    {
        key: "sprintUpdateNotificationsEnabled",
        title: "Sprint updates",
        description:
            "Receive notifications about sprint changes and progress.",
        icon: CalendarClock,
    },
    {
        key: "projectDeadlineRemindersEnabled",
        title: "Deadline reminders",
        description:
            "Receive reminders about approaching task deadlines.",
        icon: AlertCircle,
    },
    {
        key: "reviewRequests",
        title: "Review requests",
        description:
            "Get notified when completed work requires your review.",
        icon: CheckCircle2,
        backendKey: "userActivityNotificationsEnabled",
    },
    {
        key: "projectAnnouncements",
        title: "Project announcements",
        description:
            "Receive important project announcements.",
        icon: Bell,
        backendKey: "userActivityNotificationsEnabled",
    },
];

function extractSettings(response) {
    return response?.data ?? response?.Data ?? response ?? {};
}

function normalizeSettings(data) {
    return {
        notificationsEnabled:
            data.notificationsEnabled ??
            data.NotificationsEnabled ??
            DEFAULT_SETTINGS.notificationsEnabled,

        emailNotificationsEnabled:
            data.emailNotificationsEnabled ??
            data.EmailNotificationsEnabled ??
            DEFAULT_SETTINGS.emailNotificationsEnabled,

        inSystemNotificationsEnabled:
            data.inSystemNotificationsEnabled ??
            data.InSystemNotificationsEnabled ??
            DEFAULT_SETTINGS.inSystemNotificationsEnabled,

        taskAssignmentAlertsEnabled:
            data.taskAssignmentAlertsEnabled ??
            data.TaskAssignmentAlertsEnabled ??
            DEFAULT_SETTINGS.taskAssignmentAlertsEnabled,

        projectDeadlineRemindersEnabled:
            data.projectDeadlineRemindersEnabled ??
            data.ProjectDeadlineRemindersEnabled ??
            DEFAULT_SETTINGS.projectDeadlineRemindersEnabled,

        sprintUpdateNotificationsEnabled:
            data.sprintUpdateNotificationsEnabled ??
            data.SprintUpdateNotificationsEnabled ??
            DEFAULT_SETTINGS.sprintUpdateNotificationsEnabled,

        aiRecommendationAlertsEnabled:
            data.aiRecommendationAlertsEnabled ??
            data.AiRecommendationAlertsEnabled ??
            DEFAULT_SETTINGS.aiRecommendationAlertsEnabled,

        userActivityNotificationsEnabled:
            data.userActivityNotificationsEnabled ??
            data.UserActivityNotificationsEnabled ??
            DEFAULT_SETTINGS.userActivityNotificationsEnabled,
    };
}

export default function NotificationPreferences() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadSettings = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get("/notification-settings");

                if (!mounted) {
                    return;
                }

                const normalized = normalizeSettings(
                    extractSettings(response)
                );

                setSettings(normalized);
                setSavedSettings(normalized);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                setError(
                    err?.response?.data?.message ||
                        err?.response?.data?.Message ||
                        "Unable to load notification preferences."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadSettings();

        return () => {
            mounted = false;
        };
    }, []);

    const handleToggle = (key) => {
        setSettings((current) => ({
            ...current,
            [key]: !current[key],
        }));

        setSaved(false);
        setError("");
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        setError("");

        const payload = {
            NotificationsEnabled: settings.notificationsEnabled,
            EmailNotificationsEnabled:
                settings.emailNotificationsEnabled,
            InSystemNotificationsEnabled:
                settings.inSystemNotificationsEnabled,
            TaskAssignmentAlertsEnabled:
                settings.taskAssignmentAlertsEnabled,
            ProjectDeadlineRemindersEnabled:
                settings.projectDeadlineRemindersEnabled,
            SprintUpdateNotificationsEnabled:
                settings.sprintUpdateNotificationsEnabled,
            AiRecommendationAlertsEnabled:
                settings.aiRecommendationAlertsEnabled,
            UserActivityNotificationsEnabled:
                settings.userActivityNotificationsEnabled,
        };

        try {
            const response = await api.put(
                "/notification-settings",
                payload
            );

            const returnedSettings = normalizeSettings(
                extractSettings(response)
            );

            setSettings(returnedSettings);
            setSavedSettings(returnedSettings);
            setSaved(true);

            window.setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.Message ||
                    "Unable to update notification preferences."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSettings(savedSettings);
        setSaved(false);
        setError("");
    };

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                    <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">
                            Notification preferences
                        </h3>

                        <p className="mt-1 text-sm text-blue-700">
                            Choose which project, task, sprint, and
                            communication notifications you want to receive.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center rounded-xl border border-slate-200 py-12">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading notification preferences...
                    </div>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                        {notificationOptions.map((option) => {
                            const Icon = option.icon;
                            const backendKey =
                                option.backendKey || option.key;

                            const checked =
                                settings[backendKey] ?? false;

                            return (
                                <div
                                    key={option.key}
                                    className="flex items-center justify-between gap-4 p-4"
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                            <Icon className="h-4 w-4 text-slate-600" />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-slate-900">
                                                {option.title}
                                            </h3>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={checked}
                                        disabled={saving}
                                        onClick={() =>
                                            handleToggle(backendKey)
                                        }
                                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
                                            checked
                                                ? "bg-blue-600"
                                                : "bg-slate-300"
                                        } ${
                                            saving
                                                ? "cursor-not-allowed opacity-60"
                                                : ""
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition ${
                                                checked
                                                    ? "translate-x-5"
                                                    : "translate-x-0.5"
                                            }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">
                            Delivery methods
                        </h3>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <PreferenceToggle
                                icon={Mail}
                                title="Email notifications"
                                description="Receive notifications by email."
                                checked={
                                    settings.emailNotificationsEnabled
                                }
                                disabled={saving}
                                onChange={() =>
                                    handleToggle(
                                        "emailNotificationsEnabled"
                                    )
                                }
                            />

                            <PreferenceToggle
                                icon={Bell}
                                title="In-app notifications"
                                description="Show notifications inside AI-PMS."
                                checked={
                                    settings.inSystemNotificationsEnabled
                                }
                                disabled={saving}
                                onChange={() =>
                                    handleToggle(
                                        "inSystemNotificationsEnabled"
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                        <div>
                            {saved && (
                                <p className="text-sm font-medium text-emerald-600">
                                    Notification preferences updated successfully.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function PreferenceToggle({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
    disabled,
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-900">
                        {title}
                    </p>

                    <p className="text-xs text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full ${
                    checked ? "bg-blue-600" : "bg-slate-300"
                } ${
                    disabled
                        ? "cursor-not-allowed opacity-60"
                        : ""
                }`}
            >
                <span
                    className={`h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition ${
                        checked
                            ? "translate-x-5"
                            : "translate-x-0.5"
                    }`}
                />
            </button>
        </div>
    );
}
