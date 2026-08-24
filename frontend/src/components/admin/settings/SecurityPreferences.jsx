import { useState, useEffect } from "react";

import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    
    FileClock,
    LockKeyhole,
    LogIn,
    Save,
    ShieldCheck,
    UsersRound,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================================
// STORAGE KEY
// ============================================================

const SECURITY_SETTINGS_KEY = "aipms_security_preferences";

// ============================================================
// DEFAULT SECURITY SETTINGS
// ============================================================

const DEFAULT_SECURITY_SETTINGS = {
    twoFactorEnabled: false,

    sessionTimeout: "30",

    passwordMinLength: "8",
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialCharacter: true,

    maxLoginAttempts: "5",

    lockoutDuration: "15",

    activeSessionManagement: true,

    loginActivityMonitoring: true,
};

// ============================================================
// LOAD INITIAL SETTINGS
// IMPORTANT:
// State is initialized directly from localStorage.
// This avoids setState() inside useEffect.
// ============================================================

function getInitialSecuritySettings() {
    try {
        const savedSettings = localStorage.getItem(
            SECURITY_SETTINGS_KEY
        );

        if (!savedSettings) {
            return DEFAULT_SECURITY_SETTINGS;
        }

        const parsedSettings = JSON.parse(savedSettings);

        return {
            ...DEFAULT_SECURITY_SETTINGS,
            ...parsedSettings,
        };
    } catch (error) {
        console.error(
            "Unable to load security preferences:",
            error
        );

        return DEFAULT_SECURITY_SETTINGS;
    }
}

// ============================================================
// SETTING ROW
// IMPORTANT:
// This component is OUTSIDE SecurityPreferences.
// This fixes react-hooks/static-components.
// ============================================================

function SettingRow({
    icon: Icon,
    title,
    description,
    children,
}) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                        {title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
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
// TOGGLE
// ============================================================

function Toggle({
    checked,
    onChange,
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                checked
                    ? "bg-primary"
                    : "bg-slate-300 dark:bg-slate-700"
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    checked
                        ? "translate-x-5"
                        : "translate-x-0.5"
                }`}
            />
        </button>
    );
}

// ============================================================
// SECURITY PREFERENCES
// SETTING-005
// ============================================================

function SecurityPreferences() {
    // ========================================================
    // STATE
    // ========================================================

    const [settings, setSettings] = useState(
        getInitialSecuritySettings
    );

    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    // ========================================================
    // SAVE SETTINGS TO LOCAL STORAGE
    //
    // In the future this can be replaced with API call.
    // ========================================================

    useEffect(() => {
        try {
            localStorage.setItem(
                SECURITY_SETTINGS_KEY,
                JSON.stringify(settings)
            );
        } catch (error) {
            console.error(
                "Unable to store security preferences:",
                error
            );
        }
    }, [settings]);

    // ========================================================
    // UPDATE SETTING
    // ========================================================

    const updateSetting = (key, value) => {
        setSettings((previousSettings) => ({
            ...previousSettings,
            [key]: value,
        }));

        setMessage({
            type: "",
            text: "",
        });
    };

    // ========================================================
    // VALIDATE SETTINGS
    // ========================================================

    const validateSettings = () => {
        const minLength = Number(
            settings.passwordMinLength
        );

        const sessionTimeout = Number(
            settings.sessionTimeout
        );

        const maxLoginAttempts = Number(
            settings.maxLoginAttempts
        );

        const lockoutDuration = Number(
            settings.lockoutDuration
        );

        // Password minimum
        if (
            Number.isNaN(minLength) ||
            minLength < 8 ||
            minLength > 64
        ) {
            return "Password length must be between 8 and 64 characters.";
        }

        // Session timeout
        if (
            Number.isNaN(sessionTimeout) ||
            sessionTimeout < 5 ||
            sessionTimeout > 480
        ) {
            return "Session timeout must be between 5 and 480 minutes.";
        }

        // Login attempts
        if (
            Number.isNaN(maxLoginAttempts) ||
            maxLoginAttempts < 3 ||
            maxLoginAttempts > 10
        ) {
            return "Login attempts must be between 3 and 10.";
        }

        // Lockout duration
        if (
            Number.isNaN(lockoutDuration) ||
            lockoutDuration < 5 ||
            lockoutDuration > 1440
        ) {
            return "Account lockout duration must be between 5 and 1440 minutes.";
        }

        // At least one password rule
        if (
            !settings.requireUppercase &&
            !settings.requireLowercase &&
            !settings.requireNumber &&
            !settings.requireSpecialCharacter
        ) {
            return "At least one password security rule must be enabled.";
        }

        return null;
    };

    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = async () => {
        setMessage({
            type: "",
            text: "",
        });

        const validationError =
            validateSettings();

        if (validationError) {
            setMessage({
                type: "error",
                text: validationError,
            });

            return;
        }

        setIsSaving(true);

        try {
            // Simulate save operation
            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            localStorage.setItem(
                SECURITY_SETTINGS_KEY,
                JSON.stringify(settings)
            );

            // Audit log example
            const auditLog = {
                action:
                    "SECURITY_PREFERENCES_UPDATED",
                timestamp:
                    new Date().toISOString(),
                settings: settings,
            };

            localStorage.setItem(
                "aipms_last_security_audit",
                JSON.stringify(auditLog)
            );

            setMessage({
                type: "success",
                text:
                    "Security preferences updated successfully.",
            });
        } catch (error) {
            console.error(
                "Security preference update failed:",
                error
            );

            setMessage({
                type: "error",
                text:
                    "Unable to update security preferences. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        const savedSettings =
            getInitialSecuritySettings();

        setSettings(savedSettings);

        setMessage({
            type: "",
            text: "",
        });
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        setSettings({
            ...DEFAULT_SECURITY_SETTINGS,
        });

        setMessage({
            type: "",
            text: "",
        });
    };

    // ========================================================
    // PAGE
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="p-5 md:p-6">

                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                                <h2 className="text-lg font-bold text-foreground md:text-xl">
                                    Security Preferences
                                </h2>

                                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                    SETTING-005
                                </span>

                            </div>

                            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                                Configure authentication, password,
                                session and account security rules
                                for the AI-PMS.
                            </p>

                        </div>

                    </div>

                </div>
            </div>

            {/* ==================================================
                SUCCESS / ERROR MESSAGE
            ================================================== */}

            {message.text && (
                <div
                    className={`flex items-start gap-3 rounded-xl border p-4 ${
                        message.type === "success"
                            ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                            : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    }`}
                >

                    {message.type === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    )}

                    <p className="text-sm font-medium">
                        {message.text}
                    </p>

                </div>
            )}

            {/* ==================================================
                AUTHENTICATION
            ================================================== */}

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">

                <div className="mb-5">

                    <div className="flex items-center gap-2">

                        <LockKeyhole className="h-5 w-5 text-primary" />

                        <h3 className="font-bold text-foreground">
                            Authentication Security
                        </h3>

                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Control how administrators and users
                        authenticate with the AI-PMS.
                    </p>

                </div>

                <div className="space-y-3">

                    <SettingRow
                        icon={ShieldCheck}
                        title="Two-Factor Authentication"
                        description="Require an additional verification step when signing in."
                    >
                        <Toggle
                            checked={
                                settings.twoFactorEnabled
                            }
                            onChange={(value) =>
                                updateSetting(
                                    "twoFactorEnabled",
                                    value
                                )
                            }
                        />
                    </SettingRow>

                    <SettingRow
                        icon={Clock3}
                        title="Session Timeout"
                        description="Automatically end inactive sessions after the selected time."
                    >
                        <div className="flex items-center gap-2">
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
                                        event.target.value
                                    )
                                }
                                className="w-24"
                            />

                            <span className="text-xs text-muted-foreground">
                                minutes
                            </span>
                        </div>
                    </SettingRow>

                </div>

            </section>

            {/* ==================================================
                PASSWORD POLICY
            ================================================== */}

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">

                <div className="mb-5">

                    <div className="flex items-center gap-2">

                        <LockKeyhole className="h-5 w-5 text-primary" />

                        <h3 className="font-bold text-foreground">
                            Password Policy
                        </h3>

                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Define the minimum requirements for
                        user passwords.
                    </p>

                </div>

                <div className="space-y-3">

                    <SettingRow
                        icon={LockKeyhole}
                        title="Minimum Password Length"
                        description="Set the minimum number of characters required."
                    >
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min="8"
                                max="64"
                                value={
                                    settings.passwordMinLength
                                }
                                onChange={(event) =>
                                    updateSetting(
                                        "passwordMinLength",
                                        event.target.value
                                    )
                                }
                                className="w-24"
                            />

                            <span className="text-xs text-muted-foreground">
                                characters
                            </span>
                        </div>
                    </SettingRow>

                    <SettingRow
                        icon={ShieldCheck}
                        title="Uppercase Letter"
                        description="Require at least one uppercase letter."
                    >
                        <Toggle
                            checked={
                                settings.requireUppercase
                            }
                            onChange={(value) =>
                                updateSetting(
                                    "requireUppercase",
                                    value
                                )
                            }
                        />
                    </SettingRow>

                    <SettingRow
                        icon={ShieldCheck}
                        title="Lowercase Letter"
                        description="Require at least one lowercase letter."
                    >
                        <Toggle
                            checked={
                                settings.requireLowercase
                            }
                            onChange={(value) =>
                                updateSetting(
                                    "requireLowercase",
                                    value
                                )
                            }
                        />
                    </SettingRow>

                    <SettingRow
                        icon={ShieldCheck}
                        title="Number"
                        description="Require at least one numeric character."
                    >
                        <Toggle
                            checked={
                                settings.requireNumber
                            }
                            onChange={(value) =>
                                updateSetting(
                                    "requireNumber",
                                    value
                                )
                            }
                        />
                    </SettingRow>

                    <SettingRow
                        icon={ShieldCheck}
                        title="Special Character"
                        description="Require at least one special character."
                    >
                        <Toggle
                            checked={
                                settings.requireSpecialCharacter
                            }
                            onChange={(value) =>
                                updateSetting(
                                    "requireSpecialCharacter",
                                    value
                                )
                            }
                        />
                    </SettingRow>

                </div>

            </section>

            {/* ==================================================
                LOGIN RESTRICTIONS
            ================================================== */}

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">

                <div className="mb-5">

                    <div className="flex items-center gap-2">

                        <LogIn className="h-5 w-5 text-primary" />

                        <h3 className="font-bold text-foreground">
                            Login Attempt Restrictions
                        </h3>

                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Protect accounts against repeated
                        unsuccessful login attempts.
                    </p>

                </div>

                <div className="space-y-3">

                    <SettingRow
                        icon={AlertTriangle}
                        title="Maximum Login Attempts"
                        description="Number of unsuccessful attempts allowed before lockout."
                    >
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min="3"
                                max="10"
                                value={
                                    settings.maxLoginAttempts
                                }
                                onChange={(event) =>
                                    updateSetting(
                                        "maxLoginAttempts",
                                        event.target.value
                                    )
                                }
                                className="w-24"
                            />

                            <span className="text-xs text-muted-foreground">
                                attempts
                            </span>
                        </div>
                    </SettingRow>

                    <SettingRow
                        icon={Clock3}
                        title="Account Lockout Duration"
                        description="Time an account remains locked after exceeding login attempts."
                    >
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min="5"
                                max="1440"
                                value={
                                    settings.lockoutDuration
                                }
                                onChange={(event) =>
                                    updateSetting(
                                        "lockoutDuration",
                                        event.target.value
                                    )
                                }
                                className="w-24"
                            />

                            <span className="text-xs text-muted-foreground">
                                minutes
                            </span>
                        </div>
                    </SettingRow>

                </div>

            </section>

            {/* ==================================================
                SESSION MANAGEMENT
            ================================================== */}

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">

                <div className="mb-5">

                    <div className="flex items-center gap-2">

                        <UsersRound className="h-5 w-5 text-primary" />

                        <h3 className="font-bold text-foreground">
                            Session & Activity Management
                        </h3>

                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Monitor active sessions and account
                        login activity.
                    </p>

                </div>

                <div className="space-y-3">

                    <SettingRow
                        icon={UsersRound}
                        title="Active Session Management"
                        description="Allow administrators to monitor and manage active user sessions."
                    >
                        <Toggle
                            checked={
                                settings.activeSessionManagement
                            }
                            onChange={(value) =>
                                updateSetting(
                                    "activeSessionManagement",
                                    value
                                )
                            }
                        />
                    </SettingRow>

                    <SettingRow
                        icon={FileClock}
                        title="Login Activity Monitoring"
                        description="Record and monitor successful and unsuccessful login activity."
                    >
                        <Toggle
                            checked={
                                settings.loginActivityMonitoring
                            }
                            onChange={(value) =>
                                updateSetting(
                                    "loginActivityMonitoring",
                                    value
                                )
                            }
                        />
                    </SettingRow>

                </div>

            </section>

            {/* ==================================================
                SECURITY NOTICE
            ================================================== */}

            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">

                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                <div>

                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        Security Notice
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                        Mandatory system security rules cannot
                        be disabled through these preferences.
                        Changes should be validated before
                        being applied to the production system.
                    </p>

                </div>

            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                >
                    Reset to Defaults
                </Button>

                <div className="flex flex-col gap-2 sm:flex-row">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="mr-2 h-4 w-4" />

                        {isSaving
                            ? "Saving..."
                            : "Save Security Preferences"}
                    </Button>

                </div>

            </div>

        </div>
    );
}

export default SecurityPreferences;