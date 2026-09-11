
import { useEffect, useState } from "react";
import {
    Sparkles,
    Brain,
    ListChecks,
    BarChart3,
    Zap,
    Save,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import api from "@/services/api";

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

const getResponseData = (response) => {
    const value = response?.data;

    return (
        value?.data ??
        value?.Data ??
        value?.preference ??
        value?.Preference ??
        value
    );
};

const getField = (object, ...fields) => {
    for (const field of fields) {
        if (
            object &&
            object[field] !== undefined &&
            object[field] !== null
        ) {
            return object[field];
        }
    }

    return undefined;
};

const normalizeBoolean = (value, fallback = false) => {
    if (value === undefined || value === null) {
        return fallback;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }

    return Boolean(value);
};

const normalizeFrequency = (value) => {
    if (!value) {
        return "balanced";
    }

    const normalized = String(value).toLowerCase();

    if (
        normalized === "minimal" ||
        normalized === "low" ||
        normalized === "rare"
    ) {
        return "minimal";
    }

    if (
        normalized === "frequent" ||
        normalized === "high"
    ) {
        return "frequent";
    }

    return "balanced";
};

const normalizeSettings = (data) => {
    const source = data || {};

    const aiEnabled = normalizeBoolean(
        getField(
            source,
            "aiEnabled",
            "AIEnabled",
            "enableAI",
            "EnableAI",
            "isEnabled",
            "IsEnabled"
        ),
        true
    );

    const recommendations = normalizeBoolean(
        getField(
            source,
            "aiRecommendationsEnabled",
            "AIRecommendationsEnabled",
            "recommendationsEnabled",
            "RecommendationsEnabled",
            "enableRecommendations",
            "EnableRecommendations"
        ),
        true
    );

    const notifications = normalizeBoolean(
        getField(
            source,
            "aiNotificationsEnabled",
            "AINotificationsEnabled",
            "notificationsEnabled",
            "NotificationsEnabled",
            "enableNotifications",
            "EnableNotifications"
        ),
        true
    );

    const frequency = normalizeFrequency(
        getField(
            source,
            "analysisFrequency",
            "AnalysisFrequency",
            "frequency",
            "Frequency"
        )
    );

    return {
        ...DEFAULT_SETTINGS,
        aiRecommendations: recommendations,
        taskSuggestions: recommendations,
        productivityInsights: aiEnabled,
        aiNotifications: notifications,
        frequency,
    };
};

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.response?.data?.error ||
        error?.response?.data?.title ||
        error?.message ||
        "Unable to load AI preferences."
    );
};

export default function AIPreferences() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadSettings = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get("/Preferences/ai");

                if (!mounted) {
                    return;
                }

                const data = getResponseData(response);

                setSettings(normalizeSettings(data));
            } catch (requestError) {
                if (!mounted) {
                    return;
                }

                console.error(
                    "Failed to load AI preferences:",
                    requestError
                );

                setError(getErrorMessage(requestError));
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

    const handleFrequency = (event) => {
        setSettings((current) => ({
            ...current,
            frequency: event.target.value,
        }));

        setSaved(false);
        setError("");
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        setError("");

        try {
            const payload = {
                aiRecommendationsEnabled:
                    settings.aiRecommendations,

                aiNotificationsEnabled:
                    settings.aiNotifications,

                analysisFrequency:
                    settings.frequency,
            };

            const response = await api.put(
                "/Preferences/ai",
                payload
            );

            const data = getResponseData(response);

            if (data) {
                setSettings((current) => ({
                    ...current,
                    ...normalizeSettings(data),
                }));
            }

            setSaved(true);

            window.setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (requestError) {
            console.error(
                "Failed to save AI preferences:",
                requestError
            );

            setError(getErrorMessage(requestError));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
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

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <div>
                        <p className="text-sm font-semibold text-red-800">
                            AI preferences error
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-10">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading AI preferences...
                    </div>
                </div>
            ) : (
                <>
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
                                <option value="minimal">
                                    Minimal
                                </option>

                                <option value="balanced">
                                    Balanced
                                </option>

                                <option value="frequent">
                                    Frequent
                                </option>
                            </select>

                            <p className="mt-2 text-xs text-slate-500">
                                Balanced is recommended for normal team coordination.
                            </p>
                        </div>
                    </section>

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

                    <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                        <div>
                            {saved && (
                                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    AI preferences updated successfully.
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}

                            {saving
                                ? "Saving..."
                                : "Save AI Preferences"}
                        </button>
                    </div>
                </>
            )}
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
                    checked
                        ? "bg-purple-600"
                        : "bg-slate-300"
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
