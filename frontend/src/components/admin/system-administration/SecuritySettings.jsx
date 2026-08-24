import { useState } from "react";

import {
    Settings,
    Save,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    UserPlus,
    Wrench,
    Clock3,
    FileUp,
    Globe,
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

// ============================================================
// SYS-001 DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {
    systemName: "Africom AI-PMS",
    defaultLanguage: "English",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
    allowUserRegistration: true,
    sessionTimeout: 30,
    maxFileUploadSize: 10,
    maintenanceMode: false,
};

const SETTINGS_KEY = "aipms_system_settings";
const AUDIT_KEY = "aipms_audit_logs";

// ============================================================
// LOAD SYSTEM SETTINGS
// ============================================================

const loadSettings = () => {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);

        if (!saved) {
            return { ...DEFAULT_SETTINGS };
        }

        return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(saved),
        };
    } catch (error) {
        console.error(
            "Unable to load system settings:",
            error
        );

        return { ...DEFAULT_SETTINGS };
    }
};

// ============================================================
// AUDIT LOG
// SYS-001 BR5
// ============================================================

const addAuditLog = () => {
    try {
        const logs = JSON.parse(
            localStorage.getItem(AUDIT_KEY) || "[]"
        );

        const record = {
            id: `SYS-${Date.now()}`,
            action: "SYSTEM_SETTINGS_UPDATED",
            module: "System Administration",
            description: "System settings were updated.",
            timestamp: new Date().toISOString(),
            user: "Admin",
        };

        localStorage.setItem(
            AUDIT_KEY,
            JSON.stringify([record, ...logs])
        );
    } catch (error) {
        console.error(
            "Unable to record audit log:",
            error
        );
    }
};

// ============================================================
// SETTING ROW
// ============================================================

function SettingRow({
    icon: Icon,
    title,
    description,
    children,
}) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-foreground" />
                </div>

                <div>
                    <p className="text-sm font-medium text-foreground">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <div className="shrink-0">
                {children}
            </div>
        </div>
    );
}

// ============================================================
// COMPONENT
// ============================================================

function SystemSettings() {
    const initialSettings = loadSettings();

    const [settings, setSettings] =
        useState(initialSettings);

    const [originalSettings, setOriginalSettings] =
        useState(initialSettings);

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // ==========================================================
    // UPDATE SETTING
    // ==========================================================

    const updateSetting = (name, value) => {
        setSettings((current) => ({
            ...current,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    // ==========================================================
    // VALIDATE
    // SYS-001 BR3, BR4, BR6, BR7
    // ==========================================================

    const validateSettings = () => {
        const systemName = String(
            settings.systemName || ""
        ).trim();

        if (!systemName) {
            return "Invalid configuration values.";
        }

        const sessionTimeout = Number(
            settings.sessionTimeout
        );

        if (
            !Number.isFinite(sessionTimeout) ||
            sessionTimeout < 5 ||
            sessionTimeout > 480
        ) {
            return "Invalid configuration values.";
        }

        const fileSize = Number(
            settings.maxFileUploadSize
        );

        if (
            !Number.isFinite(fileSize) ||
            fileSize < 1 ||
            fileSize > 100
        ) {
            return "Invalid configuration values.";
        }

        if (!settings.defaultLanguage) {
            return "Invalid configuration values.";
        }

        if (!settings.dateFormat) {
            return "Invalid configuration values.";
        }

        if (!settings.timeFormat) {
            return "Invalid configuration values.";
        }

        return "";
    };

    // ==========================================================
    // SAVE
    // SYS-001 MAIN SUCCESS SCENARIO
    // ==========================================================

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
            const cleanedSettings = {
                ...settings,
                systemName: String(
                    settings.systemName
                ).trim(),
                sessionTimeout: Number(
                    settings.sessionTimeout
                ),
                maxFileUploadSize: Number(
                    settings.maxFileUploadSize
                ),
            };

            // Update system configuration
            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(cleanedSettings)
            );

            // Record configuration change
            addAuditLog();

            // Current settings become saved settings
            setSettings(cleanedSettings);
            setOriginalSettings(cleanedSettings);

            setMessage(
                "System settings updated successfully."
            );
        } catch (saveError) {
            console.error(
                "Unable to save system settings:",
                saveError
            );

            setError(
                "Unable to save system settings. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================================
    // CANCEL
    // SYS-001 A5 / BR8
    // ==========================================================

    const handleCancel = () => {
        setSettings({
            ...originalSettings,
        });

        setMessage("");
        setError("");
    };

    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
                    <Settings className="h-5 w-5 text-foreground" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        System Settings
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Configure general settings that control
                        how the AI-PMS operates.
                    </p>
                </div>

            </div>

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {message && (
                <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">

                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <p className="text-sm font-medium text-foreground">
                        {message}
                    </p>

                </div>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">

                    <AlertCircle className="h-5 w-5 text-destructive" />

                    <p className="text-sm text-foreground">
                        {error}
                    </p>

                </div>
            )}

            {/* ==================================================
                GENERAL SYSTEM CONFIGURATION
            ================================================== */}

            <Card className="border-border bg-card">

                <CardHeader>

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <Globe className="h-5 w-5 text-foreground" />
                        </div>

                        <div>
                            <CardTitle className="text-base">
                                General System Configuration
                            </CardTitle>

                            <CardDescription>
                                Configure the basic identity and
                                localization settings.
                            </CardDescription>
                        </div>

                    </div>

                </CardHeader>

                <CardContent className="space-y-5">

                    {/* System Name */}

                    <div className="space-y-2">

                        <label className="text-sm font-medium text-foreground">
                            System Name
                        </label>

                        <Input
                            value={settings.systemName}
                            onChange={(event) =>
                                updateSetting(
                                    "systemName",
                                    event.target.value
                                )
                            }
                            placeholder="Enter system name"
                        />

                    </div>

                    {/* Language + Date */}

                    <div className="grid gap-5 md:grid-cols-2">

                        <div className="space-y-2">

                            <label className="text-sm font-medium text-foreground">
                                Default Language
                            </label>

                            <Select
                                value={
                                    settings.defaultLanguage
                                }
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

                            <label className="text-sm font-medium text-foreground">
                                Date Format
                            </label>

                            <Select
                                value={
                                    settings.dateFormat
                                }
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

                                    <SelectItem value="DD/MM/YYYY">
                                        DD/MM/YYYY
                                    </SelectItem>

                                    <SelectItem value="MM/DD/YYYY">
                                        MM/DD/YYYY
                                    </SelectItem>

                                    <SelectItem value="YYYY-MM-DD">
                                        YYYY-MM-DD
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </div>

                    </div>

                    {/* Time Format */}

                    <div className="space-y-2">

                        <label className="text-sm font-medium text-foreground">
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

            {/* ==================================================
                USER REGISTRATION
            ================================================== */}

            <Card className="border-border bg-card">

                <CardHeader>

                    <CardTitle className="text-base">
                        User Registration
                    </CardTitle>

                    <CardDescription>
                        Control whether new users can register.
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <SettingRow
                        icon={UserPlus}
                        title="Allow User Registration"
                        description="Allow new users to create accounts."
                    >

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

                    </SettingRow>

                </CardContent>

            </Card>

            {/* ==================================================
                SESSION SETTINGS
            ================================================== */}

            <Card className="border-border bg-card">

                <CardHeader>

                    <CardTitle className="text-base">
                        Session Settings
                    </CardTitle>

                    <CardDescription>
                        Configure the user session timeout.
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <div className="space-y-2 md:w-1/2">

                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">

                            <Clock3 className="h-4 w-4" />

                            Session Timeout

                        </label>

                        <Input
                            type="number"
                            min="5"
                            max="480"
                            value={
                                settings.sessionTimeout
                            }
                            onChange={(event) =>
                                updateSetting(
                                    "sessionTimeout",
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                        />

                        <p className="text-xs text-muted-foreground">
                            Allowed range: 5–480 minutes.
                        </p>

                    </div>

                </CardContent>

            </Card>

            {/* ==================================================
                FILE UPLOAD
            ================================================== */}

            <Card className="border-border bg-card">

                <CardHeader>

                    <CardTitle className="text-base">
                        File Upload Settings
                    </CardTitle>

                    <CardDescription>
                        Configure the maximum upload size.
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <div className="space-y-2 md:w-1/2">

                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">

                            <FileUp className="h-4 w-4" />

                            Maximum File Upload Size

                        </label>

                        <div className="flex items-center gap-2">

                            <Input
                                type="number"
                                min="1"
                                max="100"
                                value={
                                    settings.maxFileUploadSize
                                }
                                onChange={(event) =>
                                    updateSetting(
                                        "maxFileUploadSize",
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                            />

                            <span className="text-sm text-muted-foreground">
                                MB
                            </span>

                        </div>

                        <p className="text-xs text-muted-foreground">
                            Allowed range: 1–100 MB.
                        </p>

                    </div>

                </CardContent>

            </Card>

            {/* ==================================================
                MAINTENANCE MODE
            ================================================== */}

            <Card className="border-border bg-card">

                <CardHeader>

                    <CardTitle className="text-base">
                        Maintenance Mode
                    </CardTitle>

                    <CardDescription>
                        Temporarily restrict normal system access.
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <SettingRow
                        icon={Wrench}
                        title="Enable Maintenance Mode"
                        description="Place AI-PMS into maintenance mode."
                    >

                        <Switch
                            checked={
                                settings.maintenanceMode
                            }
                            onCheckedChange={(value) =>
                                updateSetting(
                                    "maintenanceMode",
                                    value
                                )
                            }
                        />

                    </SettingRow>

                </CardContent>

            </Card>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex justify-end gap-3 border-t border-border pt-5">

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Cancel
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

        </div>
    );
}

export default SystemSettings;