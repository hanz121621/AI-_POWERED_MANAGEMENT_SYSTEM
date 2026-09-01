import { useState } from "react";
import {
    Sparkles,
    Brain,
    ListChecks,
    BarChart3,
    Zap,
    Save,
} from "lucide-react";

const STORAGE_KEY = "aipms_teamleader_ai_preferences";

const DEFAULT_SETTINGS = {
    aiRecommendations: true,
    taskSuggestions: true,
    productivityInsights: true,
    aiNotifications: true,

    frequency: "balanced",

    taskRecommendations: true,
    taskPrioritization: true,
    sprintProgressInsights: true,
    teamWorkloadInsights: true,
    blockedTaskDetection: true,
    workPlanningSuggestions: true,
    teamPerformanceInsights: true,
    progressSummaries: true,
};

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
        // Fall back to defaults.
    }

    return DEFAULT_SETTINGS;
}

const assistanceOptions = [
    {
        key: "taskRecommendations",
        title: "Task recommendations",
        description: "Suggest useful tasks and next actions for your team.",
        icon: ListChecks,
    },
    {
        key: "taskPrioritization",
        title: "Task prioritization",
        description: "Help identify high-priority team work.",
        icon: Zap,
    },
    {
        key: "sprintProgressInsights",
        title: "Sprint progress insights",
        description: "Analyze sprint progress and remaining work.",
        icon: BarChart3,
    },
    {
        key: "teamWorkloadInsights",
        title: "Team workload insights",
        description: "Identify workload distribution and possible imbalance.",
        icon: BarChart3,
    },
    {
        key: "blockedTaskDetection",
        title: "Blocked-task detection",
        description: "Identify tasks that may be blocked or delayed.",
        icon: Zap,
    },
    {
        key: "workPlanningSuggestions",
        title: "Work planning suggestions",
        description: "Provide suggestions for organizing upcoming team work.",
        icon: Brain,
    },
    {
        key: "teamPerformanceInsights",
        title: "Team performance insights",
        description: "Provide AI-supported observations about team performance.",
        icon: BarChart3,
    },
    {
        key: "progressSummaries",
        title: "Progress summaries",
        description: "Generate summaries of team and sprint progress.",
        icon: Brain,
    },
];

export default function AIPreferences() {
    const [settings, setSettings] = useState(getInitialSettings);
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        setSettings((current) => ({
            ...current,
            [key]: !current[key],
        }));

        setSaved(false);
    };

    const handleFrequency = (event) => {
        setSettings((current) => ({
            ...current,
            frequency: event.target.value,
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
            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 text-purple-600" />

                    <div>
                        <h3 className="text-sm font-semibold text-purple-900">
                            AI assistance
                        </h3>

                        <p className="mt-1 text-sm text-purple-700">
                            Configure AI assistance for team coordination,
                            task management, sprint monitoring, and productivity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main AI settings */}
            <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    AI features
                </h3>

                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                    <AIToggle
                        title="AI recommendations"
                        description="Allow AI to provide recommendations for team coordination."
                        checked={settings.aiRecommendations}
                        onChange={() =>
                            handleToggle("aiRecommendations")
                        }
                    />

                    <AIToggle
                        title="Task suggestions"
                        description="Receive AI-generated suggestions related to team tasks."
                        checked={settings.taskSuggestions}
                        onChange={() =>
                            handleToggle("taskSuggestions")
                        }
                    />

                    <AIToggle
                        title="Productivity insights"
                        description="Allow AI to analyze productivity-related information."
                        checked={settings.productivityInsights}
                        onChange={() =>
                            handleToggle("productivityInsights")
                        }
                    />

                    <AIToggle
                        title="AI notifications"
                        description="Receive notifications generated by enabled AI features."
                        checked={settings.aiNotifications}
                        onChange={() =>
                            handleToggle("aiNotifications")
                        }
                    />
                </div>
            </section>

            {/* Frequency */}
            <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Suggestion frequency
                </h3>

                <div className="rounded-xl border border-slate-200 p-5">
                    <label
                        htmlFor="ai-frequency"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        How often should AI provide suggestions?
                    </label>

                    <select
                        id="ai-frequency"
                        value={settings.frequency}
                        onChange={handleFrequency}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-md"
                    >
                        <option value="minimal">Minimal</option>
                        <option value="balanced">Balanced</option>
                        <option value="frequent">Frequent</option>
                    </select>

                    <p className="mt-2 text-xs text-slate-500">
                        Balanced is recommended for normal team coordination.
                    </p>
                </div>
            </section>

            {/* Assistance areas */}
            <section>
                <div className="mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                        AI assistance areas
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                        Select the areas where AI may provide assistance.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {assistanceOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                            <div
                                key={option.key}
                                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                        <Icon className="h-4 w-4 text-slate-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {option.title}
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={
                                        settings[option.key]
                                    }
                                    onClick={() =>
                                        handleToggle(option.key)
                                    }
                                    className={`relative ml-3 inline-flex h-6 w-11 shrink-0 rounded-full ${
                                        settings[option.key]
                                            ? "bg-purple-600"
                                            : "bg-slate-300"
                                    }`}
                                >
                                    <span
                                        className={`h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition ${
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
            </section>

            {/* Save */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <div>
                    {saved && (
                        <p className="text-sm font-medium text-emerald-600">
                            AI preferences updated successfully.
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Save className="h-4 w-4" />
                    Save AI Preferences
                </button>
            </div>
        </div>
    );
}

function AIToggle({
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-900">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
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
                    checked ? "bg-purple-600" : "bg-slate-300"
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