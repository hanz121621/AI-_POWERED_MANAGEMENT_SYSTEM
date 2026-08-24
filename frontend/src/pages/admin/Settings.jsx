import { useState } from "react";

import {
    Bell,
    Bot,
    ChevronRight,
    Languages,
    LayoutDashboard,
    Palette,
    Settings2,
    ShieldCheck,
} from "lucide-react";

// ============================================================
// SETTINGS COMPONENTS
// ============================================================

import NotificationPreferences from "@/components/admin/settings/NotificationPreferences";
import LanguagePreferences from "@/components/admin/settings/LanguagePreferences";
import ThemePreferences from "@/components/admin/settings/ThemePreferences";
import DashboardPreferences from "@/components/admin/settings/DashboardPreferences";
import SecurityPreferences from "@/components/admin/settings/SecurityPreferences";
import AIPreferences from "@/components/admin/settings/AIPreferences";
import SystemPreferences from "@/components/admin/settings/SystemPreferences";


function Settings() {

    // ========================================================
    // ACTIVE SETTING
    // ========================================================

    const [activeSetting, setActiveSetting] =
        useState("notifications");


    // ========================================================
    // SETTINGS MENU
    // ========================================================

    const settings = [

        {
            id: "notifications",
            number: "01",
            name: "Notification Preferences",
            shortName: "Notifications",
            description:
                "Manage how and when you receive notifications.",
            useCase: "SETTING-001",
            icon: Bell,
        },

        {
            id: "language",
            number: "02",
            name: "Language Preferences",
            shortName: "Language",
            description:
                "Choose the preferred language for the AI-PMS interface.",
            useCase: "SETTING-002",
            icon: Languages,
        },

        {
            id: "theme",
            number: "03",
            name: "Theme Preferences",
            shortName: "Theme",
            description:
                "Customize the visual appearance of the AI-PMS.",
            useCase: "SETTING-003",
            icon: Palette,
        },

        {
            id: "dashboard",
            number: "04",
            name: "Dashboard Preferences",
            shortName: "Dashboard",
            description:
                "Customize dashboard widgets, layout, metrics and filters.",
            useCase: "SETTING-004",
            icon: LayoutDashboard,
        },

        {
            id: "security",
            number: "05",
            name: "Security Preferences",
            shortName: "Security",
            description:
                "Configure security and account protection settings.",
            useCase: "SETTING-005",
            icon: ShieldCheck,
        },

        {
            id: "ai",
            number: "06",
            name: "AI Preferences",
            shortName: "AI",
            description:
                "Configure AI features, recommendations and analysis.",
            useCase: "SETTING-006",
            icon: Bot,
        },

        {
            id: "system",
            number: "07",
            name: "System Preferences",
            shortName: "System",
            description:
                "Configure general AI-PMS system preferences.",
            useCase: "SETTING-007",
            icon: Settings2,
        },
    ];


    // ========================================================
    // CURRENT SETTING
    // ========================================================

    const currentSetting =
        settings.find(
            (setting) =>
                setting.id === activeSetting
        ) || settings[0];

    const CurrentIcon =
        currentSetting.icon;


    // ========================================================
    // CHANGE SETTING
    // ========================================================

    const handleSettingChange = (settingId) => {

        setActiveSetting(settingId);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // ========================================================
    // RENDER SETTING COMPONENT
    // ========================================================

    const renderSetting = () => {

        switch (activeSetting) {

            case "notifications":
                return (
                    <NotificationPreferences />
                );

            case "language":
                return (
                    <LanguagePreferences />
                );

            case "theme":
                return (
                    <ThemePreferences />
                );

            case "dashboard":
                return (
                    <DashboardPreferences />
                );

            case "security":
                return (
                    <SecurityPreferences />
                );

            case "ai":
                return (
                    <AIPreferences />
                );

            case "system":
                return (
                    <SystemPreferences />
                );

            default:
                return (
                    <NotificationPreferences />
                );
        }
    };


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div className="
            min-h-screen
            bg-slate-50
            dark:bg-slate-950
        ">

            <div className="
                mx-auto
                max-w-[1700px]
                px-4
                py-5
                md:px-6
                lg:px-8
            ">


                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <header className="mb-6">

                    <div className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        shadow-sm
                    ">

                        {/* Decorative background */}

                        <div className="
                            pointer-events-none
                            absolute
                            right-0
                            top-0
                            h-48
                            w-48
                            rounded-full
                            bg-primary/5
                            blur-3xl
                        " />

                        <div className="
                            relative
                            p-6
                            md:p-7
                        ">

                            <div className="
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            ">

                                {/* LEFT */}

                                <div className="
                                    flex
                                    items-start
                                    gap-4
                                ">

                                    <div className="
                                        flex
                                        h-14
                                        w-14
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-primary/10
                                        text-primary
                                        shadow-sm
                                    ">

                                        <Settings2 className="
                                            h-7
                                            w-7
                                        " />

                                    </div>


                                    <div className="min-w-0">

                                        <div className="
                                            mb-1
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        ">

                                            <h1 className="
                                                text-2xl
                                                font-bold
                                                tracking-tight
                                                text-foreground
                                                md:text-3xl
                                            ">
                                                Settings & Preferences
                                            </h1>

                                            <span className="
                                                rounded-full
                                                border
                                                border-primary/20
                                                bg-primary/10
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-primary
                                            ">
                                                Admin
                                            </span>

                                        </div>


                                        <p className="
                                            max-w-3xl
                                            text-sm
                                            leading-6
                                            text-muted-foreground
                                            md:text-base
                                        ">
                                            Configure and manage your
                                            AI-PMS preferences from one
                                            centralized control panel.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </header>


                {/* ==================================================
                    SETTINGS CONTENT
                ================================================== */}

                <div className="
                    grid
                    gap-6
                    lg:grid-cols-[300px_minmax(0,1fr)]
                ">


                    {/* ==================================================
                        LEFT SETTINGS NAVIGATION
                    ================================================== */}

                    <aside className="
                        h-fit
                        lg:sticky
                        lg:top-5
                    ">

                        <div className="
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            p-3
                            shadow-sm
                        ">


                            {/* MENU HEADER */}

                            <div className="
                                border-b
                                border-border
                                px-3
                                pb-4
                                pt-2
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <div>

                                        <p className="
                                            text-sm
                                            font-bold
                                            text-foreground
                                        ">
                                            Settings
                                        </p>

                                        <p className="
                                            mt-0.5
                                            text-xs
                                            text-muted-foreground
                                        ">
                                            Configuration center
                                        </p>

                                    </div>


                                    <span className="
                                        rounded-md
                                        bg-muted
                                        px-2
                                        py-1
                                        text-[10px]
                                        font-semibold
                                        text-muted-foreground
                                    ">
                                        7
                                    </span>

                                </div>

                            </div>


                            {/* ==================================================
                                VERTICAL USE CASE NAVIGATION
                            ================================================== */}

                            <nav className="
                                mt-3
                                space-y-2
                            ">

                                {settings.map((setting) => {

                                    const Icon =
                                        setting.icon;

                                    const isActive =
                                        activeSetting ===
                                        setting.id;

                                    return (

                                        <button
                                            key={setting.id}
                                            type="button"
                                            onClick={() =>
                                                handleSettingChange(
                                                    setting.id
                                                )
                                            }
                                            aria-current={
                                                isActive
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={`
                                                group
                                                relative
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-xl
                                                border
                                                px-3
                                                py-3
                                                text-left
                                                transition-all
                                                duration-200

                                                ${
                                                    isActive
                                                        ? `
                                                            border-primary/20
                                                            bg-primary
                                                            text-primary-foreground
                                                            shadow-md
                                                            shadow-primary/20
                                                        `
                                                        : `
                                                            border-transparent
                                                            text-foreground
                                                            hover:border-border
                                                            hover:bg-muted/70
                                                            hover:shadow-sm
                                                        `
                                                }
                                            `}
                                        >

                                            {/* ACTIVE BAR */}

                                            {isActive && (

                                                <span className="
                                                    absolute
                                                    left-0
                                                    top-2
                                                    h-[calc(100%-16px)]
                                                    w-1
                                                    rounded-r-full
                                                    bg-primary-foreground
                                                " />

                                            )}


                                            {/* ==================================================
                                                USE CASE NUMBER
                                            ================================================== */}

                                            <div className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-xs
                                                font-bold

                                                ${
                                                    isActive
                                                        ? `
                                                            bg-primary-foreground/15
                                                            text-primary-foreground
                                                        `
                                                        : `
                                                            bg-muted
                                                            text-muted-foreground
                                                            group-hover:bg-background
                                                        `
                                                }
                                            `}>

                                                {setting.number}

                                            </div>


                                            {/* ==================================================
                                                ICON
                                            ================================================== */}

                                            <div className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                transition-all

                                                ${
                                                    isActive
                                                        ? "bg-primary-foreground/15"
                                                        : "bg-muted group-hover:bg-background"
                                                }
                                            `}>

                                                <Icon className="
                                                    h-4
                                                    w-4
                                                " />

                                            </div>


                                            {/* ==================================================
                                                SETTING NAME + USE CASE
                                            ================================================== */}

                                            <div className="
                                                min-w-0
                                                flex-1
                                            ">

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                ">
                                                    {setting.shortName}
                                                </p>

                                                <p className={`
                                                    mt-0.5
                                                    truncate
                                                    text-[11px]

                                                    ${
                                                        isActive
                                                            ? "text-primary-foreground/70"
                                                            : "text-muted-foreground"
                                                    }
                                                `}>
                                                    {setting.useCase}
                                                </p>

                                            </div>


                                            {/* ==================================================
                                                ARROW
                                            ================================================== */}

                                            <ChevronRight className={`
                                                h-4
                                                w-4
                                                shrink-0
                                                transition-all

                                                ${
                                                    isActive
                                                        ? "translate-x-0.5 opacity-100"
                                                        : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                                                }
                                            `} />

                                        </button>

                                    );

                                })}

                            </nav>

                        </div>


                        {/* ==================================================
                            CONFIGURATION INFORMATION
                        ================================================== */}

                        <div className="
                            mt-4
                            hidden
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            p-4
                            shadow-sm
                            lg:block
                        ">

                            <div className="
                                flex
                                items-start
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-primary/10
                                    text-primary
                                ">

                                    <ShieldCheck className="
                                        h-4
                                        w-4
                                    " />

                                </div>


                                <div>

                                    <p className="
                                        text-xs
                                        font-semibold
                                        text-foreground
                                    ">
                                        Configuration Center
                                    </p>

                                    <p className="
                                        mt-1
                                        text-[11px]
                                        leading-5
                                        text-muted-foreground
                                    ">
                                        Changes are managed per setting
                                        and validated before they are
                                        saved.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </aside>


                    {/* ==================================================
                        RIGHT CONTENT
                    ================================================== */}

                    <main className="
                        min-w-0
                    ">


                        {/* ==================================================
                            CURRENT SETTING HEADER
                        ================================================== */}

                        <div className="
                            mb-5
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            shadow-sm
                        ">

                            <div className="
                                p-5
                                md:p-6
                            ">

                                <div className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                ">


                                    {/* CURRENT SETTING */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-4
                                    ">

                                        <div className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-primary/10
                                            text-primary
                                        ">

                                            <CurrentIcon className="
                                                h-6
                                                w-6
                                            " />

                                        </div>


                                        <div className="
                                            min-w-0
                                        ">

                                            <div className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-2
                                            ">

                                                <h2 className="
                                                    text-lg
                                                    font-bold
                                                    text-foreground
                                                    md:text-xl
                                                ">
                                                    {currentSetting.name}
                                                </h2>

                                                <span className="
                                                    rounded-full
                                                    border
                                                    border-primary/20
                                                    bg-primary/10
                                                    px-2
                                                    py-0.5
                                                    text-[10px]
                                                    font-bold
                                                    text-primary
                                                ">
                                                    {currentSetting.useCase}
                                                </span>

                                            </div>


                                            <p className="
                                                mt-1
                                                text-sm
                                                text-muted-foreground
                                            ">
                                                {currentSetting.description}
                                            </p>

                                        </div>

                                    </div>


                                    {/* SECTION INDICATOR */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-border
                                        bg-muted/40
                                        px-3
                                        py-2
                                    ">

                                        <span className="
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        ">
                                            Section
                                        </span>

                                        <span className="
                                            text-sm
                                            font-bold
                                            text-foreground
                                        ">
                                            {currentSetting.number}
                                        </span>

                                        <span className="
                                            text-xs
                                            text-muted-foreground
                                        ">
                                            / 07
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            SETTING CONTENT
                        ================================================== */}

                        <div className="
                            min-w-0
                        ">

                            {renderSetting()}

                        </div>

                    </main>

                </div>

            </div>

        </div>
    );
}

export default Settings;