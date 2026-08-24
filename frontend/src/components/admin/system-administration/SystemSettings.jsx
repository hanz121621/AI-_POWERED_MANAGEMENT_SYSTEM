import { useState } from "react";
import {
    Settings,
    Save,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

const DEFAULT_SETTINGS = {
    systemName: "Africom AI-PMS",
    defaultLanguage: "English",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24-hour",
    allowUserRegistration: true,
    sessionTimeout: 30,
    maxFileUploadSize: 10,
    maintenanceMode: false,
};

const STORAGE_KEY = "aipms_system_settings";
const AUDIT_KEY = "aipms_audit_logs";

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        return saved
            ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
            : { ...DEFAULT_SETTINGS };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

function addAuditLog() {
    try {
        const logs = JSON.parse(
            localStorage.getItem(AUDIT_KEY) || "[]"
        );

        const record = {
            id: `SYS-${Date.now()}`,
            action: "SYSTEM_SETTINGS_UPDATED",
            module: "System Administration",
            description: "System settings updated.",
            timestamp: new Date().toISOString(),
            user: "Admin",
        };

        localStorage.setItem(
            AUDIT_KEY,
            JSON.stringify([record, ...logs])
        );
    } catch {
        // Audit logging failure should not break the settings UI.
    }
}

function SystemSettings() {
    const initialSettings = loadSettings();

    const [settings, setSettings] = useState(initialSettings);
    const [originalSettings, setOriginalSettings] =
        useState(initialSettings);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const updateSetting = (name, value) => {
        setSettings((current) => ({
            ...current,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    // BR3, BR4, BR6, BR7
    const validateSettings = () => {
        if (!settings.systemName.trim()) {
            return "Invalid configuration values.";
        }

        if (
            settings.sessionTimeout < 5 ||
            settings.sessionTimeout > 480
        ) {
            return "Invalid configuration values.";
        }

        if (
            settings.maxFileUploadSize < 1 ||
            settings.maxFileUploadSize > 100
        ) {
            return "Invalid configuration values.";
        }

        if (
            !settings.defaultLanguage ||
            !settings.dateFormat ||
            !settings.timeFormat
        ) {
            return "Invalid configuration values.";
        }

        return "";
    };

    // Main Success Scenario
    const handleSave = () => {
        setMessage("");
        setError("");

        const validationError = validateSettings();

        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);

        try {
            // Update configuration
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );

            // Record configuration change
            addAuditLog();

            // Update original configuration
            setOriginalSettings({ ...settings });

            setMessage(
                "System settings updated successfully."
            );
        } catch (err) {
            console.error(err);

            setError(
                "Unable to save system settings. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // A5 / BR8
    const handleCancel = () => {
        setSettings({ ...originalSettings });
        setMessage("");
        setError("");
    };

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="rounded-xl border border-border bg-muted p-3">
                    <Settings className="h-6 w-6 text-foreground" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        System Settings
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Configure general AI-PMS system settings.
                    </p>
                </div>
            </div>

            {/* Success */}
            {message && (
                <div className="flex gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <p className="text-sm text-foreground">
                        {message}
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                    <AlertCircle className="h-5 w-5 text-destructive" />

                    <p className="text-sm text-foreground">
                        {error}
                    </p>
                </div>
            )}

            {/* General Settings */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        General Configuration
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">

                    {/* System Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            System Name
                        </label>

                        <Input
                            value={settings.systemName}
                            onChange={(e) =>
                                updateSetting(
                                    "systemName",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* Language / Date */}
                    <div className="grid gap-4 md:grid-cols-2">

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Default Language
                            </label>

                            <Select
                                value={settings.defaultLanguage}
                                onValueChange={(value) =>
                                    updateSetting(
                                        "defaultLanguage",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="English">
                                        English
                                    </SelectItem>

                                    <SelectItem value="Amharic">
                                        Amharic
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Date Format
                            </label>

                            <Select
                                value={settings.dateFormat}
                                onValueChange={(value) =>
                                    updateSetting(
                                        "dateFormat",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="YYYY-MM-DD">
                                        YYYY-MM-DD
                                    </SelectItem>

                                    <SelectItem value="DD/MM/YYYY">
                                        DD/MM/YYYY
                                    </SelectItem>

                                    <SelectItem value="MM/DD/YYYY">
                                        MM/DD/YYYY
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Time Format */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Time Format
                        </label>

                        <Select
                            value={settings.timeFormat}
                            onValueChange={(value) =>
                                updateSetting(
                                    "timeFormat",
                                    value
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="24-hour">
                                    24-hour
                                </SelectItem>

                                <SelectItem value="12-hour">
                                    12-hour
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </CardContent>
            </Card>

            {/* User Registration */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        User Registration
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">

                        <div>
                            <p className="text-sm font-medium">
                                Allow User Registration
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Allow new users to register.
                            </p>
                        </div>

                        <Switch
                            checked={
                                settings.allowUserRegistration
                            }
                            onCheckedChange={(value) =>
                                updateSetting(
                                    "allowUserRegistration",
                                    value
                                )
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Session & File Upload */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        System Limits
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Session Timeout (minutes)
                        </label>

                        <Input
                            type="number"
                            min="5"
                            max="480"
                            value={settings.sessionTimeout}
                            onChange={(e) =>
                                updateSetting(
                                    "sessionTimeout",
                                    Number(e.target.value)
                                )
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Maximum File Upload (MB)
                        </label>

                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={settings.maxFileUploadSize}
                            onChange={(e) =>
                                updateSetting(
                                    "maxFileUploadSize",
                                    Number(e.target.value)
                                )
                            }
                        />
                    </div>

                </CardContent>
            </Card>

            {/* Maintenance */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        Maintenance Mode
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">

                        <div>
                            <p className="text-sm font-medium">
                                Enable Maintenance Mode
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Restrict normal system access during maintenance.
                            </p>
                        </div>

                        <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(value) =>
                                updateSetting(
                                    "maintenanceMode",
                                    value
                                )
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-border pt-5">

                <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Cancel
                </Button>

                <Button
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>

            </div>
        </div>
    );
}

export default SystemSettings;