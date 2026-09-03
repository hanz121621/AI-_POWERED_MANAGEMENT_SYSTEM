
import { useState } from "react";
import {
    BrainCircuit,
    Sparkles,
    Lightbulb,
    AlertTriangle,
    BarChart3,
    Check,
    Save,
    RotateCcw,
    Info,
    ShieldCheck,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const AI_STORAGE_KEY = "aipms_staff_ai_preferences";

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_AI_SETTINGS = {
    aiEnabled: true,
    taskSuggestions: true,
    productivityInsights: true,
    riskAlerts: true,
    performanceAnalysis: true,
    smartRecommendations: true,
    notificationSuggestions: true,
    aiAssistant: true,
    suggestionFrequency: "balanced",
};

// ============================================================
// SUGGESTION FREQUENCY OPTIONS
// ============================================================

const SUGGESTION_FREQUENCIES = [
    {
        value: "low",
        label: "Low",
        description:
            "Show only important AI suggestions and alerts.",
    },
    {
        value: "balanced",
        label: "Balanced",
        description:
            "Show useful suggestions without too many interruptions.",
    },
    {
        value: "high",
        label: "High",
        description:
            "Show more AI recommendations and productivity insights.",
    },
];

// ============================================================
// GET INITIAL SETTINGS
// ============================================================

function getInitialSettings() {
    try {
        const storedSettings = localStorage.getItem(
            AI_STORAGE_KEY
        );

        if (!storedSettings) {
            return DEFAULT_AI_SETTINGS;
        }

        const parsedSettings = JSON.parse(storedSettings);

        return {
            ...DEFAULT_AI_SETTINGS,
            ...parsedSettings,
        };
    } catch (error) {
        console.error(
            "Failed to load AI preferences:",
            error
        );

        return DEFAULT_AI_SETTINGS;
    }
}

// ============================================================
// TOGGLE COMPONENT
// ============================================================

function Toggle({
    enabled,
    onClick,
    disabled = false,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={enabled}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                disabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
            } ${
                enabled
                    ? "bg-primary"
                    : "bg-muted"
            }`}
        >
            <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-primary-foreground shadow-sm transition-transform ${
                    enabled
                        ? "translate-x-6"
                        : "translate-x-1"
                }`}
            />
        </button>
    );
}

// ============================================================
// AI SETTING ROW
// ============================================================

function AISettingRow({
    icon: Icon,
    title,
    description,
    enabled,
    onToggle,
    disabled = false,
}) {
    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition ${
                disabled
                    ? "border-border bg-muted opacity-50"
                    : "border-border bg-card"
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        enabled && !disabled
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                    }`}
                >
                    <Icon size={19} />
                </div>

                <div>
                    <h4 className="font-medium text-card-foreground">
                        {title}
                    </h4>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
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
// FREQUENCY CARD
// ============================================================

function FrequencyCard({
    option,
    selected,
    onSelect,
    disabled = false,
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            className={`w-full rounded-xl border p-4 text-left transition ${
                disabled
                    ? "cursor-not-allowed border-border bg-muted opacity-40"
                    : selected
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-card hover:bg-muted"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h4 className="font-semibold text-card-foreground">
                        {option.label}
                    </h4>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {option.description}
                    </p>
                </div>

                <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-transparent"
                    }`}
                >
                    <Check size={14} />
                </div>
            </div>
        </button>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function AIPreferences() {
    const [settings, setSettings] = useState(
        getInitialSettings
    );

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // ========================================================
    // UPDATE TOGGLE
    // ========================================================

    const handleToggle = (key) => {
        setSettings((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));

        setSaved(false);
        setError("");
    };

    // ========================================================
    // UPDATE FREQUENCY
    // ========================================================

    const handleFrequencyChange = (frequency) => {
        setSettings((previous) => ({
            ...previous,
            suggestionFrequency: frequency,
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
                AI_STORAGE_KEY,
                JSON.stringify(settings)
            );

            // Notify other components that AI settings changed.
            window.dispatchEvent(
                new CustomEvent("aiPreferencesChanged", {
                    detail: {
                        settings,
                    },
                })
            );

            setSaved(true);
            setError("");
        } catch (err) {
            console.error(
                "Failed to save AI preferences:",
                err
            );

            setError(
                "Unable to save AI preferences. Please try again."
            );

            setSaved(false);
        }
    };

    // ========================================================
    // RESET SETTINGS
    // ========================================================

    const handleReset = () => {
        const defaultSettings = {
            ...DEFAULT_AI_SETTINGS,
        };

        setSettings(defaultSettings);
        setSaved(false);
        setError("");
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6 text-foreground">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BrainCircuit size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            AI Preferences
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Manage how AI-powered features assist
                            you in your daily work.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
                <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                />

                <div>
                    <p className="font-medium text-primary">
                        AI assistance
                    </p>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        Configure the AI features you want to use.
                        You can enable or disable individual AI
                        capabilities based on your preferences.
                    </p>
                </div>
            </div>

            {/* ==================================================
                MASTER AI SWITCH
            ================================================== */}

            <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                settings.aiEnabled
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            <Sparkles size={23} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-card-foreground">
                                Enable AI Assistance
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Turn AI-powered assistance on or
                                off for your Staff account.
                            </p>

                            <p className="mt-2 text-xs text-muted-foreground">
                                {settings.aiEnabled
                                    ? "AI features are currently enabled."
                                    : "AI features are currently disabled."}
                            </p>
                        </div>
                    </div>

                    <Toggle
                        enabled={settings.aiEnabled}
                        onClick={() =>
                            handleToggle("aiEnabled")
                        }
                    />
                </div>
            </div>

            {/* ==================================================
                AI FEATURES
            ================================================== */}

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <BrainCircuit
                        size={18}
                        className="text-primary"
                    />

                    <h3 className="font-semibold text-foreground">
                        AI Features
                    </h3>
                </div>

                <div className="space-y-3">
                    <AISettingRow
                        icon={Lightbulb}
                        title="Task Suggestions"
                        description="Receive AI-generated suggestions for completing and organizing your tasks."
                        enabled={settings.taskSuggestions}
                        onToggle={() =>
                            handleToggle("taskSuggestions")
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <AISettingRow
                        icon={BarChart3}
                        title="Productivity Insights"
                        description="Allow AI to analyze your work patterns and provide productivity insights."
                        enabled={
                            settings.productivityInsights
                        }
                        onToggle={() =>
                            handleToggle(
                                "productivityInsights"
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <AISettingRow
                        icon={AlertTriangle}
                        title="Risk Alerts"
                        description="Receive AI-powered warnings about potential task, sprint, or project risks."
                        enabled={settings.riskAlerts}
                        onToggle={() =>
                            handleToggle("riskAlerts")
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <AISettingRow
                        icon={BarChart3}
                        title="Performance Analysis"
                        description="Allow AI to provide insights about your work performance and task completion."
                        enabled={
                            settings.performanceAnalysis
                        }
                        onToggle={() =>
                            handleToggle(
                                "performanceAnalysis"
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <AISettingRow
                        icon={Sparkles}
                        title="Smart Recommendations"
                        description="Receive personalized AI recommendations based on your work activities."
                        enabled={
                            settings.smartRecommendations
                        }
                        onToggle={() =>
                            handleToggle(
                                "smartRecommendations"
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <AISettingRow
                        icon={Info}
                        title="Notification Suggestions"
                        description="Allow AI to recommend which notifications may be important to you."
                        enabled={
                            settings.notificationSuggestions
                        }
                        onToggle={() =>
                            handleToggle(
                                "notificationSuggestions"
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <AISettingRow
                        icon={BrainCircuit}
                        title="AI Assistant"
                        description="Enable AI assistant functionality for work-related questions and assistance."
                        enabled={settings.aiAssistant}
                        onToggle={() =>
                            handleToggle("aiAssistant")
                        }
                        disabled={!settings.aiEnabled}
                    />
                </div>
            </div>

            {/* ==================================================
                SUGGESTION FREQUENCY
            ================================================== */}

            <div className="space-y-3">
                <div>
                    <h3 className="font-semibold text-foreground">
                        Suggestion Frequency
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Choose how frequently AI suggestions and
                        recommendations should appear.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {SUGGESTION_FREQUENCIES.map(
                        (option) => (
                            <FrequencyCard
                                key={option.value}
                                option={option}
                                selected={
                                    settings.suggestionFrequency ===
                                    option.value
                                }
                                onSelect={
                                    handleFrequencyChange
                                }
                                disabled={
                                    !settings.aiEnabled
                                }
                            />
                        )
                    )}
                </div>
            </div>

            {/* ==================================================
                PRIVACY / SECURITY
            ================================================== */}

            <div className="flex gap-3 rounded-xl border border-border bg-muted p-4">
                <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                />

                <div>
                    <p className="font-medium text-foreground">
                        AI Preference Control
                    </p>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        These settings control the AI assistance
                        available in your Staff workspace. You can
                        change them at any time.
                    </p>
                </div>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {saved && (
                <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    AI preferences saved successfully.
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
                <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    {error}
                </div>
            )}

            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                    <RotateCcw size={17} />
                    Reset
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Save size={17} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default AIPreferences;
