

import React, { useEffect, useState } from "react";

import {
    Brain,
    Bell,
    AlertTriangle,
    Lightbulb,
    BarChart3,
    Clock3,
    Save,
    RotateCcw,
    CheckCircle2,
    Info,
} from "lucide-react";

// ============================================================
// STORAGE KEY
// ============================================================

const AI_PREFERENCES_KEY = "aipms_manager_ai_preferences";

// ============================================================
// DEFAULT CONFIGURATION
//
// These represent the application's configurable AI options.
// They are kept in one place rather than scattered through
// the UI.
// ============================================================

const DEFAULT_AI_PREFERENCES = {
    enableRecommendations: true,
    enableAINotifications: true,
    enableDelayWarnings: true,

    summaryFrequency: "Daily",

    recommendationDisplay: "Dashboard",

    insightVisibility: "Detailed",

    notificationPriority: "Important",
};

// ============================================================
// CONFIGURABLE OPTIONS
// ============================================================

const AI_OPTIONS = {
    summaryFrequency: [
        "Real-time",
        "Daily",
        "Weekly",
        "Never",
    ],

    recommendationDisplay: [
        "Dashboard",
        "Dashboard and Notifications",
        "Notifications",
    ],

    insightVisibility: [
        "Basic",
        "Detailed",
        "Advanced",
    ],

    notificationPriority: [
        "All",
        "Important",
        "Critical",
    ],
};

// ============================================================
// COMPONENT
// ============================================================

function AIPreferences() {
    const [preferences, setPreferences] = useState(
        DEFAULT_AI_PREFERENCES
    );

    const [savedMessage, setSavedMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [isSaving, setIsSaving] =
        useState(false);

    // ========================================================
    // LOAD CURRENT MANAGER PREFERENCES
    // ========================================================

    useEffect(() => {
        try {
            const storedPreferences =
                localStorage.getItem(
                    AI_PREFERENCES_KEY
                );

            if (!storedPreferences) {
                return;
            }

            const parsedPreferences =
                JSON.parse(storedPreferences);

            setPreferences({
                ...DEFAULT_AI_PREFERENCES,
                ...parsedPreferences,
            });
        } catch (error) {
            console.error(
                "Failed to load AI preferences:",
                error
            );

            setErrorMessage(
                "Unable to load your AI preferences."
            );
        }
    }, []);

    // ========================================================
    // UPDATE PREFERENCE
    // ========================================================

    const updatePreference = (
        key,
        value
    ) => {
        setPreferences((current) => ({
            ...current,
            [key]: value,
        }));

        setSavedMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // SAVE PREFERENCES
    //
    // SET-005:
    // System validates and stores the Manager's preferences.
    // ========================================================

    const handleSave = () => {
        setSavedMessage("");
        setErrorMessage("");
        setIsSaving(true);

        try {
            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (
                !AI_OPTIONS.summaryFrequency.includes(
                    preferences.summaryFrequency
                )
            ) {
                throw new Error(
                    "Invalid AI summary frequency."
                );
            }

            if (
                !AI_OPTIONS.recommendationDisplay.includes(
                    preferences.recommendationDisplay
                )
            ) {
                throw new Error(
                    "Invalid AI recommendation display option."
                );
            }

            if (
                !AI_OPTIONS.insightVisibility.includes(
                    preferences.insightVisibility
                )
            ) {
                throw new Error(
                    "Invalid AI insight visibility option."
                );
            }

            if (
                !AI_OPTIONS.notificationPriority.includes(
                    preferences.notificationPriority
                )
            ) {
                throw new Error(
                    "Invalid AI notification priority."
                );
            }

            // ------------------------------------------------
            // STORE MANAGER PREFERENCES
            // ------------------------------------------------

            localStorage.setItem(
                AI_PREFERENCES_KEY,
                JSON.stringify(preferences)
            );

            setSavedMessage(
                "AI preferences saved successfully."
            );
        } catch (error) {
            console.error(
                "Failed to save AI preferences:",
                error
            );

            setErrorMessage(
                error.message ||
                    "Unable to save AI preferences."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        setPreferences({
            ...DEFAULT_AI_PREFERENCES,
        });

        setSavedMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-blue-50 p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100">

                        <Brain
                            size={25}
                            className="text-violet-600"
                        />

                    </div>

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                            SET-005
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Manage AI Preferences
                        </h2>

                        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                            Configure how AI recommendations,
                            insights, warnings, and notifications
                            are presented in your Manager workspace.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">

                <Info
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>

                    <p className="text-sm font-bold text-blue-900">
                        Manager AI preferences
                    </p>

                    <p className="mt-1 text-sm leading-5 text-blue-700">
                        These settings control how AI-assisted
                        features are presented to you. They do not
                        change your project permissions, project
                        data, or the underlying AI model.
                    </p>

                </div>

            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {savedMessage && (

                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                    <CheckCircle2
                        size={19}
                        className="text-emerald-600"
                    />

                    <p className="text-sm font-semibold text-emerald-700">
                        {savedMessage}
                    </p>

                </div>

            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (

                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <AlertTriangle
                        size={19}
                        className="text-red-600"
                    />

                    <p className="text-sm font-semibold text-red-700">
                        {errorMessage}
                    </p>

                </div>

            )}

            {/* ==================================================
                AI FEATURES
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                    <h3 className="font-bold text-slate-900">
                        AI-Assisted Features
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Choose which AI assistance you want to
                        receive.
                    </p>

                </div>

                <div className="divide-y divide-slate-100">

                    {/* RECOMMENDATIONS */}

                    <PreferenceToggle
                        icon={Lightbulb}
                        title="AI Recommendations"
                        description="Receive AI-generated recommendations related to your authorized project information."
                        checked={
                            preferences.enableRecommendations
                        }
                        onChange={(value) =>
                            updatePreference(
                                "enableRecommendations",
                                value
                            )
                        }
                    />

                    {/* AI NOTIFICATIONS */}

                    <PreferenceToggle
                        icon={Bell}
                        title="AI Notifications"
                        description="Allow AI-generated insights and recommendations to appear through notifications."
                        checked={
                            preferences.enableAINotifications
                        }
                        onChange={(value) =>
                            updatePreference(
                                "enableAINotifications",
                                value
                            )
                        }
                    />

                    {/* DELAY WARNINGS */}

                    <PreferenceToggle
                        icon={Clock3}
                        title="Delay Warnings"
                        description="Receive AI-assisted warnings when project or task delays may require attention."
                        checked={
                            preferences.enableDelayWarnings
                        }
                        onChange={(value) =>
                            updatePreference(
                                "enableDelayWarnings",
                                value
                            )
                        }
                    />

                </div>

            </div>

            {/* ==================================================
                AI DISPLAY SETTINGS
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

                            <BarChart3
                                size={20}
                                className="text-blue-600"
                            />

                        </div>

                        <div>

                            <h3 className="font-bold text-slate-900">
                                AI Display Settings
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Configure how AI information is
                                presented in your workspace.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                    {/* SUMMARY FREQUENCY */}

                    <PreferenceSelect
                        label="AI Summary Frequency"
                        description="Choose how often AI summaries are presented."
                        value={
                            preferences.summaryFrequency
                        }
                        options={
                            AI_OPTIONS.summaryFrequency
                        }
                        onChange={(value) =>
                            updatePreference(
                                "summaryFrequency",
                                value
                            )
                        }
                    />

                    {/* RECOMMENDATION DISPLAY */}

                    <PreferenceSelect
                        label="AI Recommendation Display"
                        description="Choose where AI recommendations appear."
                        value={
                            preferences.recommendationDisplay
                        }
                        options={
                            AI_OPTIONS.recommendationDisplay
                        }
                        onChange={(value) =>
                            updatePreference(
                                "recommendationDisplay",
                                value
                            )
                        }
                    />

                    {/* INSIGHT VISIBILITY */}

                    <PreferenceSelect
                        label="AI Insight Visibility"
                        description="Choose the level of AI insight detail displayed."
                        value={
                            preferences.insightVisibility
                        }
                        options={
                            AI_OPTIONS.insightVisibility
                        }
                        onChange={(value) =>
                            updatePreference(
                                "insightVisibility",
                                value
                            )
                        }
                    />

                    {/* NOTIFICATION PRIORITY */}

                    <PreferenceSelect
                        label="AI Notification Priority"
                        description="Choose which AI notification priority levels you receive."
                        value={
                            preferences.notificationPriority
                        }
                        options={
                            AI_OPTIONS.notificationPriority
                        }
                        onChange={(value) =>
                            updatePreference(
                                "notificationPriority",
                                value
                            )
                        }
                    />

                </div>

            </div>

            {/* ==================================================
                AI DATA NOTICE
            ================================================== */}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

                <div className="flex gap-3">

                    <AlertTriangle
                        size={20}
                        className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>

                        <h3 className="font-bold text-amber-900">
                            AI information notice
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            AI recommendations and predictions are
                            assistance features. They must remain
                            distinguishable from actual project,
                            Sprint, Team, and task records.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">

                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                    <RotateCcw size={17} />
                    Reset
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save size={17} />

                    {isSaving
                        ? "Saving..."
                        : "Save AI Preferences"}
                </button>

            </div>

        </section>
    );
}

// ============================================================
// TOGGLE COMPONENT
// ============================================================

function PreferenceToggle({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">

                    <Icon
                        size={19}
                        className="text-slate-600"
                    />

                </div>

                <div>

                    <p className="font-semibold text-slate-900">
                        {title}
                    </p>

                    <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
                        {description}
                    </p>

                </div>

            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() =>
                    onChange(!checked)
                }
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                    checked
                        ? "bg-violet-600"
                        : "bg-slate-300"
                }`}
            >

                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
                        checked
                            ? "translate-x-6"
                            : "translate-x-1"
                    }`}
                />

            </button>

        </div>
    );
}

// ============================================================
// SELECT COMPONENT
// ============================================================

function PreferenceSelect({
    label,
    description,
    value,
    options,
    onChange,
}) {
    return (
        <div>

            <label className="block text-sm font-bold text-slate-800">
                {label}
            </label>

            <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
            </p>

            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >

                {options.map(
                    (option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    )
                )}

            </select>

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AIPreferences;

