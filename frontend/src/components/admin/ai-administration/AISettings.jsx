import { useState } from "react";

import {
    Bell,
    Brain,
    CheckCircle2,
    Cpu,
    Gauge,
    Lightbulb,
    Save,
    ShieldAlert,
    SlidersHorizontal,
    Sparkles,
    XCircle,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";


// ============================================================
// AI-002 — CONFIGURE AI SETTINGS
// ============================================================

const DEFAULT_AI_SETTINGS = {
    aiEnabled: true,

    recommendationsEnabled: true,
    riskPredictionEnabled: true,
    taskOptimizationEnabled: true,
    teamInsightsEnabled: true,
    delayPredictionEnabled: true,
    dependencyWarningsEnabled: true,

    recommendationFrequency: "daily",
    recommendationConfidence: 70,

    riskPredictionFrequency: "daily",
    riskSensitivity: "medium",
    riskThreshold: 60,

    analysisFrequency: "daily",
    analysisWindow: "7",

    notificationsEnabled: true,
    notifyHighRisk: true,
    notifyRecommendations: true,
    notifyDelays: true,
    notifyDependencies: true,

    modelProvider: "configured",
    modelName: "default",
    modelVersion: "latest",
    temperature: 0.3,
    maxTokens: 2048,
};


// ============================================================
// LOAD INITIAL SETTINGS
// ============================================================

const getInitialSettings = (initialSettings) => {
    try {
        let storedSettings = null;

        // Parent-provided settings
        if (initialSettings) {
            storedSettings = initialSettings;
        }

        // Local storage settings
        if (!storedSettings) {
            const saved = localStorage.getItem("aiSettings");

            if (saved) {
                storedSettings = JSON.parse(saved);
            }
        }

        return {
            ...DEFAULT_AI_SETTINGS,
            ...(storedSettings || {}),
        };
    } catch (error) {
        console.error(
            "Failed to load AI settings:",
            error
        );

        return {
            ...DEFAULT_AI_SETTINGS,
        };
    }
};


// ============================================================
// AI SETTINGS COMPONENT
// ============================================================

function AISettings({
    hasPermission = true,
    initialSettings = null,
    onSettingsChange,
    onApplyConfiguration,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [settings, setSettings] = useState(() =>
        getInitialSettings(initialSettings)
    );

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [validationErrors, setValidationErrors] =
        useState({});


    // ========================================================
    // UPDATE SETTING
    // ========================================================

    const updateSetting = (key, value) => {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));

        setValidationErrors((current) => {
            if (!current[key]) {
                return current;
            }

            const updated = {
                ...current,
            };

            delete updated[key];

            return updated;
        });

        setError("");
        setSuccess("");
    };


    // ========================================================
    // VALIDATE SETTINGS
    // ========================================================

    const validateSettings = () => {
        const errors = {};

        if (!settings.aiEnabled) {
            const dependentFeatures = [
                "recommendationsEnabled",
                "riskPredictionEnabled",
                "taskOptimizationEnabled",
                "teamInsightsEnabled",
                "delayPredictionEnabled",
                "dependencyWarningsEnabled",
            ];

            const hasDependentFeature =
                dependentFeatures.some(
                    (key) => settings[key] === true
                );

            if (hasDependentFeature) {
                errors.aiEnabled =
                    "Disable individual AI features or enable AI before saving.";
            }
        }

        const recommendationConfidence =
            Number(settings.recommendationConfidence);

        if (
            Number.isNaN(recommendationConfidence) ||
            recommendationConfidence < 1 ||
            recommendationConfidence > 100
        ) {
            errors.recommendationConfidence =
                "Recommendation confidence must be between 1 and 100.";
        }

        const riskThreshold =
            Number(settings.riskThreshold);

        if (
            Number.isNaN(riskThreshold) ||
            riskThreshold < 1 ||
            riskThreshold > 100
        ) {
            errors.riskThreshold =
                "Risk threshold must be between 1 and 100.";
        }

        const analysisWindow =
            Number(settings.analysisWindow);

        if (
            Number.isNaN(analysisWindow) ||
            analysisWindow < 1 ||
            analysisWindow > 365
        ) {
            errors.analysisWindow =
                "Analysis window must be between 1 and 365 days.";
        }

        const temperature =
            Number(settings.temperature);

        if (
            Number.isNaN(temperature) ||
            temperature < 0 ||
            temperature > 2
        ) {
            errors.temperature =
                "Temperature must be between 0 and 2.";
        }

        const maxTokens =
            Number(settings.maxTokens);

        if (
            Number.isNaN(maxTokens) ||
            maxTokens < 1 ||
            maxTokens > 100000
        ) {
            errors.maxTokens =
                "Maximum tokens must be between 1 and 100000.";
        }

        if (
            !settings.modelName ||
            !String(settings.modelName).trim()
        ) {
            errors.modelName =
                "AI model name is required.";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };


    // ========================================================
    // RECORD AUDIT LOG
    // ========================================================

    const recordAuditLog = (
        previousSettings,
        updatedSettings
    ) => {
        const changedFields = [];

        Object.keys(updatedSettings).forEach((key) => {
            if (
                JSON.stringify(
                    previousSettings[key]
                ) !==
                JSON.stringify(
                    updatedSettings[key]
                )
            ) {
                changedFields.push(key);
            }
        });

        const auditEntry = {
            id:
                typeof crypto !== "undefined" &&
                typeof crypto.randomUUID === "function"
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`,

            action: "UPDATE_AI_SETTINGS",

            type: "AI_CONFIGURATION_CHANGE",

            message:
                "Admin updated AI settings.",

            changedFields,

            timestamp:
                new Date().toISOString(),

            previousSettings,

            updatedSettings,

            readOnly: false,
        };

        try {
            const existingLogs = JSON.parse(
                localStorage.getItem(
                    "activityLogs"
                ) || "[]"
            );

            localStorage.setItem(
                "activityLogs",
                JSON.stringify([
                    auditEntry,
                    ...existingLogs,
                ])
            );
        } catch (auditError) {
            console.error(
                "Failed to record AI settings audit log:",
                auditError
            );
        }

        return auditEntry;
    };


    // ========================================================
    // APPLY CONFIGURATION
    // ========================================================

    const applyConfiguration = async (
        updatedSettings
    ) => {
        if (
            typeof onApplyConfiguration ===
            "function"
        ) {
            await onApplyConfiguration(
                updatedSettings
            );
        }

        return true;
    };


    // ========================================================
    // SAVE CHANGES
    // ========================================================

    const handleSave = async () => {
        setError("");
        setSuccess("");

        const isValid =
            validateSettings();

        if (!isValid) {
            setError(
                "Please correct the highlighted settings before saving."
            );

            return;
        }

        setSaving(true);

        try {
            const previousSettings = {
                ...settings,
            };

            const updatedSettings = {
                ...settings,

                recommendationConfidence:
                    Number(
                        settings.recommendationConfidence
                    ),

                riskThreshold:
                    Number(
                        settings.riskThreshold
                    ),

                analysisWindow:
                    Number(
                        settings.analysisWindow
                    ),

                temperature:
                    Number(
                        settings.temperature
                    ),

                maxTokens:
                    Number(
                        settings.maxTokens
                    ),
            };

            // Save configuration
            localStorage.setItem(
                "aiSettings",
                JSON.stringify(
                    updatedSettings
                )
            );

            // Apply configuration
            await applyConfiguration(
                updatedSettings
            );

            // Record audit
            recordAuditLog(
                previousSettings,
                updatedSettings
            );

            // Update state
            setSettings(
                updatedSettings
            );

            // Notify parent
            if (
                typeof onSettingsChange ===
                "function"
            ) {
                onSettingsChange(
                    updatedSettings
                );
            }

            // AI-002 success
            setSuccess(
                "AI settings updated successfully."
            );
        } catch (saveError) {
            console.error(
                "Failed to update AI settings:",
                saveError
            );

            setError(
                "Unable to update AI settings. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };


    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        try {
            const saved =
                localStorage.getItem(
                    "aiSettings"
                );

            if (saved) {
                setSettings({
                    ...DEFAULT_AI_SETTINGS,
                    ...JSON.parse(saved),
                });
            } else {
                setSettings({
                    ...DEFAULT_AI_SETTINGS,
                });
            }

            setValidationErrors({});
            setError("");
            setSuccess("");
        } catch (resetError) {
            console.error(
                "Failed to reset AI settings:",
                resetError
            );

            setError(
                "Unable to reset AI settings."
            );
        }
    };


    // ========================================================
    // ACCESS DENIED
    // ========================================================

    if (!hasPermission) {
        return (
            <Card className="border-destructive/30 bg-card">
                <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                    <div className="rounded-full bg-destructive/10 p-3">
                        <ShieldAlert className="h-6 w-6 text-destructive" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground">
                            Access denied.
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            You do not have permission
                            to manage AI settings.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }


    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div className="flex items-start gap-3">

                            <div className="rounded-xl border border-border bg-muted p-3">
                                <Brain className="h-5 w-5 text-foreground" />
                            </div>

                            <div>
                                <CardTitle className="text-lg text-foreground">
                                    AI Settings
                                </CardTitle>

                                <CardDescription className="mt-1">
                                    Configure and control
                                    AI-related features
                                    used by AI-PMS.
                                </CardDescription>
                            </div>

                        </div>

                        <Badge variant="outline">
                            AI-002
                        </Badge>

                    </div>
                </CardHeader>
            </Card>


            {/* ERROR */}

            {error && (
                <Card className="border-destructive/30 bg-card">
                    <CardContent className="flex items-start gap-3 p-4">

                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                        <p className="text-sm font-medium text-destructive">
                            {error}
                        </p>

                    </CardContent>
                </Card>
            )}


            {/* SUCCESS */}

            {success && (
                <Card className="border-green-500/30 bg-card">
                    <CardContent className="flex items-start gap-3 p-4">

                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />

                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {success}
                        </p>

                    </CardContent>
                </Card>
            )}


            {/* AI FEATURES */}

            <Card className="border-border bg-card">

                <CardHeader>
                    <div className="flex items-center gap-3">

                        <Sparkles className="h-5 w-5 text-muted-foreground" />

                        <div>
                            <CardTitle className="text-base">
                                AI Features
                            </CardTitle>

                            <CardDescription>
                                Enable or disable AI
                                capabilities used by
                                the system.
                            </CardDescription>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="space-y-4">

                    <SettingSwitch
                        label="Enable AI Features"
                        description="Master control for AI-powered functionality."
                        checked={settings.aiEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "aiEnabled",
                                value
                            )
                        }
                    />

                    {validationErrors.aiEnabled && (
                        <p className="text-sm text-destructive">
                            {validationErrors.aiEnabled}
                        </p>
                    )}

                    <SettingSwitch
                        label="AI Recommendations"
                        description="Enable project and task recommendations."
                        checked={settings.recommendationsEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "recommendationsEnabled",
                                value
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <SettingSwitch
                        label="Risk Prediction"
                        description="Enable AI-powered project risk prediction."
                        checked={settings.riskPredictionEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "riskPredictionEnabled",
                                value
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <SettingSwitch
                        label="Task Optimization"
                        description="Enable AI suggestions for task optimization."
                        checked={settings.taskOptimizationEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "taskOptimizationEnabled",
                                value
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <SettingSwitch
                        label="Team Performance Insights"
                        description="Enable AI analysis of team performance."
                        checked={settings.teamInsightsEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "teamInsightsEnabled",
                                value
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <SettingSwitch
                        label="Project Delay Prediction"
                        description="Enable prediction of possible project delays."
                        checked={settings.delayPredictionEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "delayPredictionEnabled",
                                value
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                    <SettingSwitch
                        label="Dependency Warnings"
                        description="Enable AI-generated dependency warnings."
                        checked={settings.dependencyWarningsEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "dependencyWarningsEnabled",
                                value
                            )
                        }
                        disabled={!settings.aiEnabled}
                    />

                </CardContent>

            </Card>


            {/* RECOMMENDATIONS */}

            <Card className="border-border bg-card">

                <CardHeader>
                    <div className="flex items-center gap-3">

                        <Lightbulb className="h-5 w-5 text-muted-foreground" />

                        <div>
                            <CardTitle className="text-base">
                                AI Recommendation Settings
                            </CardTitle>

                            <CardDescription>
                                Control how often AI
                                recommendations are
                                generated.
                            </CardDescription>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">

                    <SettingSelect
                        label="Recommendation Frequency"
                        value={settings.recommendationFrequency}
                        onValueChange={(value) =>
                            updateSetting(
                                "recommendationFrequency",
                                value
                            )
                        }
                        options={[
                            {
                                value: "realtime",
                                label: "Real-time",
                            },
                            {
                                value: "hourly",
                                label: "Hourly",
                            },
                            {
                                value: "daily",
                                label: "Daily",
                            },
                            {
                                value: "weekly",
                                label: "Weekly",
                            },
                        ]}
                    />

                    <SettingNumber
                        label="Minimum Confidence (%)"
                        value={settings.recommendationConfidence}
                        onChange={(value) =>
                            updateSetting(
                                "recommendationConfidence",
                                value
                            )
                        }
                        error={
                            validationErrors.recommendationConfidence
                        }
                        min="1"
                        max="100"
                    />

                </CardContent>

            </Card>


            {/* RISK PREDICTION */}

            <Card className="border-border bg-card">

                <CardHeader>
                    <div className="flex items-center gap-3">

                        <ShieldAlert className="h-5 w-5 text-muted-foreground" />

                        <div>
                            <CardTitle className="text-base">
                                Risk Prediction
                            </CardTitle>

                            <CardDescription>
                                Configure AI-powered risk
                                analysis.
                            </CardDescription>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-3">

                    <SettingSelect
                        label="Prediction Frequency"
                        value={settings.riskPredictionFrequency}
                        onValueChange={(value) =>
                            updateSetting(
                                "riskPredictionFrequency",
                                value
                            )
                        }
                        options={[
                            {
                                value: "hourly",
                                label: "Hourly",
                            },
                            {
                                value: "daily",
                                label: "Daily",
                            },
                            {
                                value: "weekly",
                                label: "Weekly",
                            },
                        ]}
                    />

                    <SettingSelect
                        label="Risk Sensitivity"
                        value={settings.riskSensitivity}
                        onValueChange={(value) =>
                            updateSetting(
                                "riskSensitivity",
                                value
                            )
                        }
                        options={[
                            {
                                value: "low",
                                label: "Low",
                            },
                            {
                                value: "medium",
                                label: "Medium",
                            },
                            {
                                value: "high",
                                label: "High",
                            },
                        ]}
                    />

                    <SettingNumber
                        label="Risk Threshold (%)"
                        value={settings.riskThreshold}
                        onChange={(value) =>
                            updateSetting(
                                "riskThreshold",
                                value
                            )
                        }
                        error={
                            validationErrors.riskThreshold
                        }
                        min="1"
                        max="100"
                    />

                </CardContent>

            </Card>


            {/* AI ANALYSIS */}

            <Card className="border-border bg-card">

                <CardHeader>
                    <div className="flex items-center gap-3">

                        <Gauge className="h-5 w-5 text-muted-foreground" />

                        <div>
                            <CardTitle className="text-base">
                                AI Analysis
                            </CardTitle>

                            <CardDescription>
                                Configure the frequency and
                                analysis period used by
                                AI processing.
                            </CardDescription>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">

                    <SettingSelect
                        label="Analysis Frequency"
                        value={settings.analysisFrequency}
                        onValueChange={(value) =>
                            updateSetting(
                                "analysisFrequency",
                                value
                            )
                        }
                        options={[
                            {
                                value: "realtime",
                                label: "Real-time",
                            },
                            {
                                value: "hourly",
                                label: "Hourly",
                            },
                            {
                                value: "daily",
                                label: "Daily",
                            },
                            {
                                value: "weekly",
                                label: "Weekly",
                            },
                        ]}
                    />

                    <SettingNumber
                        label="Analysis Window (days)"
                        value={settings.analysisWindow}
                        onChange={(value) =>
                            updateSetting(
                                "analysisWindow",
                                value
                            )
                        }
                        error={
                            validationErrors.analysisWindow
                        }
                        min="1"
                        max="365"
                    />

                </CardContent>

            </Card>


            {/* NOTIFICATIONS */}

            <Card className="border-border bg-card">

                <CardHeader>
                    <div className="flex items-center gap-3">

                        <Bell className="h-5 w-5 text-muted-foreground" />

                        <div>
                            <CardTitle className="text-base">
                                AI Notifications
                            </CardTitle>

                            <CardDescription>
                                Control notifications generated
                                by AI features.
                            </CardDescription>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="space-y-4">

                    <SettingSwitch
                        label="Enable AI Notifications"
                        description="Allow AI-generated notifications to be sent to relevant users."
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "notificationsEnabled",
                                value
                            )
                        }
                    />

                    <SettingSwitch
                        label="High Risk Notifications"
                        description="Notify relevant users when high-risk conditions are detected."
                        checked={settings.notifyHighRisk}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "notifyHighRisk",
                                value
                            )
                        }
                        disabled={!settings.notificationsEnabled}
                    />

                    <SettingSwitch
                        label="Recommendation Notifications"
                        description="Notify users when new AI recommendations are available."
                        checked={settings.notifyRecommendations}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "notifyRecommendations",
                                value
                            )
                        }
                        disabled={!settings.notificationsEnabled}
                    />

                    <SettingSwitch
                        label="Delay Notifications"
                        description="Notify users about predicted project delays."
                        checked={settings.notifyDelays}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "notifyDelays",
                                value
                            )
                        }
                        disabled={!settings.notificationsEnabled}
                    />

                    <SettingSwitch
                        label="Dependency Notifications"
                        description="Notify users when AI detects dependency problems."
                        checked={settings.notifyDependencies}
                        onCheckedChange={(value) =>
                            updateSetting(
                                "notifyDependencies",
                                value
                            )
                        }
                        disabled={!settings.notificationsEnabled}
                    />

                </CardContent>

            </Card>


            {/* AI MODEL */}

            <Card className="border-border bg-card">

                <CardHeader>
                    <div className="flex items-center gap-3">

                        <Cpu className="h-5 w-5 text-muted-foreground" />

                        <div>
                            <CardTitle className="text-base">
                                AI Model Configuration
                            </CardTitle>

                            <CardDescription>
                                Configure the AI model used
                                by the system.
                            </CardDescription>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">

                    <SettingSelect
                        label="Model Provider"
                        value={settings.modelProvider}
                        onValueChange={(value) =>
                            updateSetting(
                                "modelProvider",
                                value
                            )
                        }
                        options={[
                            {
                                value: "configured",
                                label: "Configured AI Service",
                            },
                            {
                                value: "local",
                                label: "Local Model",
                            },
                            {
                                value: "custom",
                                label: "Custom Provider",
                            },
                        ]}
                    />

                    <div className="space-y-2">
                        <Label>Model Name</Label>

                        <Input
                            value={settings.modelName}
                            onChange={(event) =>
                                updateSetting(
                                    "modelName",
                                    event.target.value
                                )
                            }
                            placeholder="Enter model name"
                        />

                        {validationErrors.modelName && (
                            <p className="text-xs text-destructive">
                                {validationErrors.modelName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Model Version</Label>

                        <Input
                            value={settings.modelVersion}
                            onChange={(event) =>
                                updateSetting(
                                    "modelVersion",
                                    event.target.value
                                )
                            }
                            placeholder="Enter model version"
                        />
                    </div>

                    <SettingNumber
                        label="Temperature"
                        value={settings.temperature}
                        onChange={(value) =>
                            updateSetting(
                                "temperature",
                                value
                            )
                        }
                        error={
                            validationErrors.temperature
                        }
                        min="0"
                        max="2"
                        step="0.1"
                    />

                    <SettingNumber
                        label="Maximum Tokens"
                        value={settings.maxTokens}
                        onChange={(value) =>
                            updateSetting(
                                "maxTokens",
                                value
                            )
                        }
                        error={
                            validationErrors.maxTokens
                        }
                        min="1"
                        max="100000"
                    />

                </CardContent>

            </Card>


            {/* SAVE */}

            <Card className="border-border bg-card">

                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-3">

                        <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Configuration changes
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Changes are validated,
                                saved, applied to the AI
                                configuration, and recorded
                                in the audit log.
                            </p>
                        </div>

                    </div>

                    <div className="flex gap-2">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={saving}
                        >
                            Reset
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save className="mr-2 h-4 w-4" />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>
    );
}


// ============================================================
// REUSABLE SWITCH
// ============================================================

function SettingSwitch({
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">

            <div className="min-w-0">

                <Label className="text-sm font-medium">
                    {label}
                </Label>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {description}
                </p>

            </div>

            <Switch
                checked={Boolean(checked)}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            />

        </div>
    );
}


// ============================================================
// REUSABLE SELECT
// ============================================================

function SettingSelect({
    label,
    value,
    onValueChange,
    options = [],
}) {
    return (
        <div className="space-y-2">

            <Label>{label}</Label>

            <Select
                value={value}
                onValueChange={onValueChange}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>

            </Select>

        </div>
    );
}


// ============================================================
// REUSABLE NUMBER INPUT
// ============================================================

function SettingNumber({
    label,
    value,
    onChange,
    error,
    min,
    max,
    step = "1",
}) {
    return (
        <div className="space-y-2">

            <Label>{label}</Label>

            <Input
                type="number"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
            />

            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}

        </div>
    );
}


export default AISettings;