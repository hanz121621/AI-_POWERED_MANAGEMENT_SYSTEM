import { useState } from "react";
import {
    Bell,
    Mail,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    CalendarClock,
    Users,
    Save,
} from "lucide-react";

const DEFAULT_SETTINGS = {
    taskAssignments: true,
    taskStatusUpdates: true,
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

const STORAGE_KEY = "teamleader_notification_preferences";

function getInitialSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            return {
                ...DEFAULT_SETTINGS,
                ...JSON.parse(saved),
            };
        }
    } catch {
        // Use default settings if storage is unavailable.
    }

    return DEFAULT_SETTINGS;
}

const notificationOptions = [
    {
        key: "taskAssignments",
        title: "Task assignments",
        description: "Receive notifications when tasks are assigned to you or your team.",
        icon: CheckCircle2,
    },
    {
        key: "taskStatusUpdates",
        title: "Task status updates",
        description: "Get updates when team tasks change status.",
        icon: CheckCircle2,
    },
    {
        key: "commentsMentions",
        title: "Comments and mentions",
        description: "Receive alerts when someone comments or mentions you.",
        icon: MessageSquare,
    },
    {
        key: "managerMessages",
        title: "Manager messages",
        description: "Receive messages and updates from project managers.",
        icon: Mail,
    },
    {
        key: "teamMemberUpdates",
        title: "Team member updates",
        description: "Get important updates related to your team members.",
        icon: Users,
    },
    {
        key: "sprintUpdates",
        title: "Sprint updates",
        description: "Receive notifications about sprint changes and progress.",
        icon: CalendarClock,
    },
    {
        key: "deadlineReminders",
        title: "Deadline reminders",
        description: "Receive reminders about approaching task deadlines.",
        icon: AlertCircle,
    },
    {
        key: "reviewRequests",
        title: "Review requests",
        description: "Get notified when completed work requires your review.",
        icon: CheckCircle2,
    },
    {
        key: "projectAnnouncements",
        title: "Project announcements",
        description: "Receive important project announcements.",
        icon: Bell,
    },
];

export default function NotificationPreferences() {
    const [settings, setSettings] = useState(getInitialSettings);
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        setSettings((current) => ({
            ...current,
            [key]: !current[key],
        }));

        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);

        window.setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">

            {/* Introduction */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                    <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">
                            Notification preferences
                        </h3>

                        <p className="mt-1 text-sm text-blue-700">
                            Choose which project, task, sprint, and communication
                            notifications you want to receive.
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification options */}
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {notificationOptions.map((option) => {
                    const Icon = option.icon;

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
                                aria-checked={settings[option.key]}
                                onClick={() => handleToggle(option.key)}
                                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
                                    settings[option.key]
                                        ? "bg-blue-600"
                                        : "bg-slate-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition ${
                                        settings[option.key]
                                            ? "translate-x-5"
                                            : "translate-x-0.5"
                                    }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Delivery settings */}
            <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Delivery methods
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                    <PreferenceToggle
                        icon={Mail}
                        title="Email notifications"
                        description="Receive notifications by email."
                        checked={settings.emailNotifications}
                        onChange={() =>
                            handleToggle("emailNotifications")
                        }
                    />

                    <PreferenceToggle
                        icon={Bell}
                        title="In-app notifications"
                        description="Show notifications inside AI-PMS."
                        checked={settings.inAppNotifications}
                        onChange={() =>
                            handleToggle("inAppNotifications")
                        }
                    />
                </div>
            </div>

            {/* Save */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <div>
                    {saved && (
                        <p className="text-sm font-medium text-emerald-600">
                            Notification preferences updated successfully.
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function PreferenceToggle({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
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
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full ${
                    checked ? "bg-blue-600" : "bg-slate-300"
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