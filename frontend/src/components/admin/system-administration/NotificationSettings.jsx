import { useState } from "react";

import {
    Bell,
    Mail,
    Monitor,
    ListChecks,
    CalendarClock,
    Bot,
    UserRound,
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
import { Switch } from "@/components/ui/switch";

// ============================================================
// SYS-002 DEFAULT CONFIGURATION
// ============================================================

const DEFAULT_SETTINGS = {
    notificationsEnabled: true,
    emailNotifications: true,
    inSystemNotifications: true,
    taskAssignmentAlerts: true,
    projectDeadlineReminders: true,
    sprintUpdateNotifications: true,
    aiRecommendationAlerts: true,
    userActivityNotifications: false,
};

const SETTINGS_KEY = "aipms_notification_settings";
const AUDIT_KEY = "aipms_audit_logs";

// ============================================================
// LOAD SETTINGS
// ============================================================

const loadSettings = () => {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);

        return saved
            ? {
                  ...DEFAULT_SETTINGS,
                  ...JSON.parse(saved),
              }
            : { ...DEFAULT_SETTINGS };
    } catch (error) {
        console.error(
            "Unable to load notification settings:",
            error
        );

        return { ...DEFAULT_SETTINGS };
    }
};

// ============================================================
// NOTIFICATION OPTION
// ============================================================

function NotificationOption({
    icon: Icon,
    title,
    description,
    checked,
    onCheckedChange,
    disabled = false,
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-foreground" />
                </div>

                <div>
                    <p className="text-sm font-medium text-foreground">
                        {title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            />
        </div>
    );
}

// ============================================================
// COMPONENT
// ============================================================

function NotificationSettings() {
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
    // SYS-002 BR5
    // ==========================================================

    const validateSettings = () => {
        /*
         * If the notification service is disabled,
         * the delivery channels do not need to be enabled.
         */
        if (!settings.notificationsEnabled) {
            return "";
        }

        /*
         * BR3:
         * At least one configured delivery channel
         * must be available when notifications are enabled.
         */
        if (
            !settings.emailNotifications &&
            !settings.inSystemNotifications
        ) {
            return "Invalid notification settings.";
        }

        return "";
    };

    // ==========================================================
    // AUDIT LOG
    // SYS-002 BR6
    // ==========================================================

    const addAuditLog = () => {
        try {
            const existingLogs = JSON.parse(
                localStorage.getItem(AUDIT_KEY) || "[]"
            );

            const auditRecord = {
                id: `NOTIFY-${Date.now()}`,
                action: "NOTIFICATION_SETTINGS_UPDATED",
                module: "System Administration",
                description:
                    "Notification settings were updated.",
                timestamp: new Date().toISOString(),
                user: "Admin",
            };

            localStorage.setItem(
                AUDIT_KEY,
                JSON.stringify([
                    auditRecord,
                    ...existingLogs,
                ])
            );
        } catch (auditError) {
            console.error(
                "Unable to record audit log:",
                auditError
            );
        }
    };

    // ==========================================================
    // SAVE
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
            /*
             * Update notification configuration.
             */
            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(settings)
            );

            /*
             * Record configuration change.
             */
            addAuditLog();

            /*
             * Make current settings the saved configuration.
             */
            setOriginalSettings({
                ...settings,
            });

            setMessage(
                "Notification settings updated successfully."
            );
        } catch (saveError) {
            console.error(
                "Unable to save notification settings:",
                saveError
            );

            setError(
                "Unable to save notification settings. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================================
    // CANCEL
    // SYS-002 A5 / BR9
    // ==========================================================

    const handleCancel = () => {
        setSettings({
            ...originalSettings,
        });

        setMessage("");
        setError("");
    };

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center gap-3">
                <div className="rounded-xl border border-border bg-muted p-3">
                    <Bell className="h-6 w-6 text-foreground" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Notification Settings
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Configure how notifications are created
                        and delivered within AI-PMS.
                    </p>
                </div>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {message && (
                <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <p className="text-sm text-foreground">
                        {message}
                    </p>
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
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
                MASTER NOTIFICATION SETTING
            ================================================== */}

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        Notification Service
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <NotificationOption
                        icon={Bell}
                        title="Enable Notifications"
                        description="Allow AI-PMS to create and deliver notifications."
                        checked={
                            settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "notificationsEnabled",
                                value
                            )
                        }
                    />
                </CardContent>
            </Card>

            {/* ==================================================
                DELIVERY CHANNELS
            ================================================== */}

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        Delivery Channels
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">

                    <NotificationOption
                        icon={Mail}
                        title="Email Notifications"
                        description="Send notifications through email."
                        checked={
                            settings.emailNotifications
                        }
                        disabled={
                            !settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "emailNotifications",
                                value
                            )
                        }
                    />

                    <NotificationOption
                        icon={Monitor}
                        title="In-System Notifications"
                        description="Display notifications inside AI-PMS."
                        checked={
                            settings.inSystemNotifications
                        }
                        disabled={
                            !settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "inSystemNotifications",
                                value
                            )
                        }
                    />

                </CardContent>
            </Card>

            {/* ==================================================
                TASK AND PROJECT NOTIFICATIONS
            ================================================== */}

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        Task & Project Notifications
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">

                    <NotificationOption
                        icon={ListChecks}
                        title="Task Assignment Alerts"
                        description="Notify users when tasks are assigned to them."
                        checked={
                            settings.taskAssignmentAlerts
                        }
                        disabled={
                            !settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "taskAssignmentAlerts",
                                value
                            )
                        }
                    />

                    <NotificationOption
                        icon={CalendarClock}
                        title="Project Deadline Reminders"
                        description="Notify users about approaching project deadlines."
                        checked={
                            settings.projectDeadlineReminders
                        }
                        disabled={
                            !settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "projectDeadlineReminders",
                                value
                            )
                        }
                    />

                    <NotificationOption
                        icon={CalendarClock}
                        title="Sprint Update Notifications"
                        description="Notify users when sprint information changes."
                        checked={
                            settings.sprintUpdateNotifications
                        }
                        disabled={
                            !settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "sprintUpdateNotifications",
                                value
                            )
                        }
                    />

                </CardContent>
            </Card>

            {/* ==================================================
                AI NOTIFICATIONS
            ================================================== */}

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        AI Notifications
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <NotificationOption
                        icon={Bot}
                        title="AI Recommendation Alerts"
                        description="Notify authorized users about new AI recommendations."
                        checked={
                            settings.aiRecommendationAlerts
                        }
                        disabled={
                            !settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "aiRecommendationAlerts",
                                value
                            )
                        }
                    />

                </CardContent>
            </Card>

            {/* ==================================================
                USER ACTIVITY
            ================================================== */}

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base">
                        User Activity Notifications
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <NotificationOption
                        icon={UserRound}
                        title="User Activity Notifications"
                        description="Notify authorized administrators about important user activity."
                        checked={
                            settings.userActivityNotifications
                        }
                        disabled={
                            !settings.notificationsEnabled
                        }
                        onCheckedChange={(value) =>
                            updateSetting(
                                "userActivityNotifications",
                                value
                            )
                        }
                    />

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

export default NotificationSettings;