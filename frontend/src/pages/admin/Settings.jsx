import React, { useState } from "react";

import {
    Bell,
    Bot,
    Globe,
    LayoutDashboard,
    Loader2,
    Palette,
    RotateCcw,
    Save,
    Settings as SettingsIcon,
    Sun,
    Moon,
    Monitor,
    Check,
    ChevronDown,
} from "lucide-react";

// ============================================================
// ADMIN SETTINGS COMPONENTS
// ============================================================

import LanguagePreferences from "@/components/admin/settings/LanguagePreferences";
import ThemePreferences from "@/components/admin/settings/ThemePreferences";
import NotificationPreferences from "@/components/admin/settings/NotificationPreferences";
import DashboardPreferences from "@/components/admin/settings/DashboardPreferences";
import AIPreferences from "@/components/admin/settings/AIPreferences";

// ============================================================
// ADMIN SETTINGS
//
// UI structure matches Manager Settings.
//
// Sections:
// 1. Language Preferences
// 2. Theme Preferences
// 3. Notification Preferences
// 4. Dashboard Preferences
// 5. AI Preferences
//
// Security and System Preferences are intentionally removed.
// ============================================================

function Settings() {
    // ========================================================
    // STATE
    // ========================================================

    const [activeSection, setActiveSection] =
        useState("preferences");

    const [isRestoring, setIsRestoring] =
        useState(false);

    // ========================================================
    // RESTORE DEFAULTS
    //
    // The actual persistence logic remains inside the
    // individual Admin settings components.
    //
    // This handler is kept UI-safe here. If your Admin
    // components expose a reset service later, it can be
    // connected here.
    // ========================================================

    const handleRestoreDefaults = () => {
        setIsRestoring(true);

        // Give the UI a short reset state.
        // Individual Admin setting components remain
        // responsible for their own backend persistence.
        setTimeout(() => {
            setIsRestoring(false);
        }, 500);
    };

    // ========================================================
    // SECTION CARD
    // ========================================================

    const SectionCard = ({
        icon: Icon,
        title,
        description,
        children,
    }) => {
        return (
            <section className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-start gap-4 border-b border-border p-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-card-foreground">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </section>
        );
    };

    // ========================================================
    // ADMIN SETTING COMPONENT
    // ========================================================

    const renderSection = () => {
        switch (activeSection) {
            case "preferences":
                return (
                    <div className="space-y-6">
                        <LanguagePreferences />
                        <ThemePreferences />

                        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                            Language and theme preferences are managed
                            through your Admin preference settings.
                        </div>
                    </div>
                );

            case "notifications":
                return <NotificationPreferences />;

            case "dashboard":
                return <DashboardPreferences />;

            case "ai":
                return <AIPreferences />;

            default:
                return (
                    <div className="space-y-6">
                        <LanguagePreferences />
                        <ThemePreferences />
                    </div>
                );
        }
    };

    // ========================================================
    // PAGE
    // ========================================================

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <SettingsIcon className="h-5 w-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Settings
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure and manage your AI-PMS
                                    preferences.
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-muted-foreground">
                            Signed in as{" "}
                            <span className="font-medium text-foreground">
                                Administrator
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRestoreDefaults}
                        disabled={isRestoring}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-border
                            bg-card
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-foreground
                            hover:bg-accent
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {isRestoring ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RotateCcw className="h-4 w-4" />
                        )}

                        Restore Defaults
                    </button>
                </div>

                {/* =================================================
                    SECTION NAVIGATION
                ================================================== */}

                <div className="mb-8 flex gap-2 overflow-x-auto rounded-xl border border-border bg-card p-2">

                    {/* LANGUAGE + THEME */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("preferences")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection === "preferences"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Palette className="h-4 w-4" />

                        Language & Theme
                    </button>

                    {/* NOTIFICATIONS */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("notifications")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection === "notifications"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Bell className="h-4 w-4" />

                        Notifications
                    </button>

                    {/* DASHBOARD */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("dashboard")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection === "dashboard"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <LayoutDashboard className="h-4 w-4" />

                        Dashboard
                    </button>

                    {/* AI */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("ai")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
                            activeSection === "ai"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Bot className="h-4 w-4" />

                        AI Preferences
                    </button>
                </div>

                {/* =================================================
                    ACTIVE SECTION CONTENT
                ================================================== */}

                {activeSection === "preferences" && (
                    <div className="space-y-6">

                        {/* LANGUAGE */}

                        <SectionCard
                            icon={Globe}
                            title="Language Preferences"
                            description="Choose the preferred language for the AI-PMS interface."
                        >
                            <LanguagePreferences />
                        </SectionCard>

                        {/* THEME */}

                        <SectionCard
                            icon={Palette}
                            title="Theme Preferences"
                            description="Customize the visual appearance of the AI-PMS."
                        >
                            <ThemePreferences />
                        </SectionCard>

                        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                            Your language and theme preferences are
                            managed through the AI-PMS settings system.
                        </div>
                    </div>
                )}

                {activeSection === "notifications" && (
                    <SectionCard
                        icon={Bell}
                        title="Notification Preferences"
                        description="Manage how and when you receive notifications."
                    >
                        <NotificationPreferences />
                    </SectionCard>
                )}

                {activeSection === "dashboard" && (
                    <SectionCard
                        icon={LayoutDashboard}
                        title="Dashboard Preferences"
                        description="Customize dashboard widgets, layout, metrics and filters."
                    >
                        <DashboardPreferences />
                    </SectionCard>
                )}

                {activeSection === "ai" && (
                    <SectionCard
                        icon={Bot}
                        title="AI Preferences"
                        description="Configure AI features, recommendations and analysis."
                    >
                        <AIPreferences />
                    </SectionCard>
                )}

                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="mt-8 rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                            <SettingsIcon className="h-4 w-4" />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold">
                                Preference Storage
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Admin preference changes are managed
                                through the AI-PMS settings system.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Settings;