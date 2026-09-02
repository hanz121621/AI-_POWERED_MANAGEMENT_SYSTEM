
import { useState } from "react";
import {
    Bell,
    Mail,
    MessageSquare,
    CheckCircle2,
    Save,
    RotateCcw,
} from "lucide-react";

const STORAGE_KEY = "aipms_developer_notification_preferences";

const DEFAULT_SETTINGS = {
    taskAssignment: true,
    taskStatus: true,
    commentsMentions: true,
    teamLeaderMessages: true,
    sprintUpdates: true,
    deadlineReminders: true,
    reviewRequests: true,
    projectAnnouncements: true,
    emailNotifications: true,
    inAppNotifications: true,
};

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return DEFAULT_SETTINGS;
        }

        return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(saved),
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export default function NotificationPreferences() {
    const [settings, setSettings] = useState(loadSettings);
    const [message, setMessage] = useState("");

    const updateSetting = (key) => {
        setSettings((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));

        setMessage("");
    };

    const handleSave = () => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );

            setMessage(
                "Notification preferences updated successfully."
            );
        } catch {
            setMessage(
                "Unable to update notification preferences. Please try again."
            );
        }
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DEFAULT_SETTINGS)
        );
        setMessage("Notification preferences reset.");
    };

    const options = [
        {
            key: "taskAssignment",
            title: "Task Assignments",
            description: "Receive notifications when a task is assigned to you.",
            icon: CheckCircle2,
        },
        {
            key: "taskStatus",
            title: "Task Status Updates",
            description: "Receive updates when task status changes.",
            icon: CheckCircle2,
        },
        {
            key: "commentsMentions",
            title: "Comments & Mentions",
            description: "Receive notifications for comments and @mentions.",
            icon: MessageSquare,
        },
        {
            key: "teamLeaderMessages",
            title: "Team Leader Messages",
            description: "Receive messages from your Team Leader.",
            icon: MessageSquare,
        },
        {
            key: "sprintUpdates",
            title: "Sprint Updates",
            description: "Receive updates about your active sprints.",
            icon: Bell,
        },
        {
            key: "deadlineReminders",
            title: "Deadline Reminders",
            description: "Receive reminders about upcoming deadlines.",
            icon: Bell,
        },
        {
            key: "reviewRequests",
            title: "Review Requests",
            description: "Receive notifications about work reviews.",
            icon: CheckCircle2,
        },
        {
            key: "projectAnnouncements",
            title: "Project Announcements",
            description: "Receive important project announcements.",
            icon: Bell,
        },
        {
            key: "emailNotifications",
            title: "Email Notifications",
            description: "Allow AI-PMS to send notification emails.",
            icon: Mail,
        },
        {
            key: "inAppNotifications",
            title: "In-App Notifications",
            description: "Show notifications inside AI-PMS.",
            icon: Bell,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Bell size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Notification Preferences
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Control which notifications you receive.
                        </p>
                    </div>
                </div>
            </div>

            {message && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {message}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                {options.map((option) => {
                    const Icon = option.icon;

                    return (
                        <div
                            key={option.key}
                            className="flex items-center justify-between border-b border-slate-200 p-5 last:border-b-0 dark:border-slate-700"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-slate-500 dark:text-slate-400">
                                    <Icon size={20} />
                                </div>

                                <div>
                                    <h3 className="font-medium text-slate-900 dark:text-white">
                                        {option.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {option.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => updateSetting(option.key)}
                                className={`relative h-6 w-11 rounded-full transition ${
                                    settings[option.key]
                                        ? "bg-blue-600"
                                        : "bg-slate-300 dark:bg-slate-600"
                                }`}
                                aria-label={`Toggle ${option.title}`}
                            >
                                <span
                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                        settings[option.key]
                                            ? "left-6"
                                            : "left-1"
                                    }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                    <RotateCcw size={17} />
                    Reset
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Save size={17} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}
