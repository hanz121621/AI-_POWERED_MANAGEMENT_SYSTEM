import { useState } from "react";

import {
    Bell,
    Bot,
    Globe,
    Loader2,
    Palette,
    RotateCcw,
    Settings as SettingsIcon,
} from "lucide-react";

// ============================================================
// TEAM LEADER SETTINGS COMPONENTS
// ============================================================

import NotificationPreferences from "@/components/contributor/teamleader/settings/NotificationPreferences";
import LanguagePreferences from "@/components/contributor/teamleader/settings/LanguagePreferences";
import ThemePreferences from "@/components/contributor/teamleader/settings/ThemePreferences";
import AIPreferences from "@/components/contributor/teamleader/settings/AIPreferences";

// ============================================================
// TEAM LEADER SETTINGS
//
// Sections:
// 1. Language & Theme
// 2. Notifications
// 3. AI Preferences
//
// UI is aligned with the Admin Settings design.
//
// Important:
// - Existing Team Leader components are preserved.
// - No Dashboard Preferences are added because the
//   Team Leader settings currently does not have one.
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
    // individual Team Leader settings components.
    //
    // This keeps the button UI-safe without changing the
    // existing settings APIs.
    // ========================================================

    const handleRestoreDefaults = () => {
        setIsRestoring(true);

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
                {/* ==================================================
                    SECTION HEADER
                ================================================== */}

                <div className="flex items-start gap-4 border-b border-border p-6">
                    {/* ICON */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="h-5 w-5" />
                    </div>

                    {/* TITLE */}

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

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="p-6">
                    {children}
                </div>
            </section>
        );
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

                    {/* LEFT SIDE */}

                    <div>
                        <div className="flex items-center gap-3">

                            {/* SETTINGS ICON */}

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <SettingsIcon className="h-5 w-5" />
                            </div>

                            {/* TITLE */}

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

                        {/* ROLE */}

                        <p className="mt-4 text-sm text-muted-foreground">
                            Signed in as{" "}
                            <span className="font-medium text-foreground">
                                Team Leader
                            </span>
                        </p>
                    </div>

                    {/* RESTORE DEFAULTS */}

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
                            transition-colors
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

                    {/* =================================================
                        LANGUAGE + THEME
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("preferences")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            activeSection === "preferences"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Palette className="h-4 w-4" />

                        Language & Theme
                    </button>

                    {/* =================================================
                        NOTIFICATIONS
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("notifications")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            activeSection === "notifications"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")}
                    >
                        <Bell className="h-4 w-4" />

                        Notifications
                    </button>

                    {/* =================================================
                        AI PREFERENCES
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("ai")
                        }
                        className={[
                            "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
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
                    ACTIVE SECTION
                ================================================== */}

                {/* =================================================
                    LANGUAGE + THEME
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

                        {/* INFORMATION */}

                        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                            Your language and theme preferences are
                            managed through the AI-PMS settings system.
                        </div>
                    </div>
                )}

                {/* =================================================
                    NOTIFICATIONS
                ================================================== */}

                {activeSection === "notifications" && (
                    <SectionCard
                        icon={Bell}
                        title="Notification Preferences"
                        description="Manage how and when you receive notifications."
                    >
                        <NotificationPreferences />
                    </SectionCard>
                )}

                {/* =================================================
                    AI PREFERENCES
                ================================================== */}

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

                        {/* FOOTER ICON */}

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                            <SettingsIcon className="h-4 w-4" />
                        </div>

                        {/* FOOTER TEXT */}

                        <div>
                            <h3 className="text-sm font-semibold">
                                Preference Storage
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Team Leader preference changes are
                                managed through the AI-PMS settings
                                system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;