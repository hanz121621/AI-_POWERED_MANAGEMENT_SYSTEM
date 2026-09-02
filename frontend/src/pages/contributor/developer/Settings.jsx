
import { Settings as SettingsIcon, SlidersHorizontal } from "lucide-react";

import NotificationPreferences from "@/components/contributor/developer/settings/NotificationPreferences";
import LanguagePreferences from "@/components/contributor/developer/settings/LanguagePreferences";
import ThemePreferences from "@/components/contributor/developer/settings/ThemePreferences";
import AIPreferences from "@/components/contributor/developer/settings/AIPreferences";

export default function Settings() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#071a33]">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}

                <header className="mb-8">
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div className="flex items-center gap-4">

                            {/* ICON */}

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-slate-200
                                    dark:bg-blue-950/60
                                "
                            >
                                <SettingsIcon
                                    className="
                                        h-6
                                        w-6
                                        text-slate-700
                                        dark:text-blue-400
                                    "
                                />
                            </div>

                            {/* TITLE */}

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1
                                        className="
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Settings & Preferences
                                    </h1>

                                    <span
                                        className="
                                            hidden
                                            rounded-full
                                            bg-blue-100
                                            px-2.5
                                            py-1
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-blue-700
                                            sm:inline-flex
                                            dark:bg-blue-950/60
                                            dark:text-blue-300
                                        "
                                    >
                                        Developer
                                    </span>
                                </div>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Customize your AI-PMS developer
                                    experience and personal preferences.
                                </p>
                            </div>

                        </div>
                    </div>
                </header>


                {/* =====================================================
                    INFORMATION BANNER
                ===================================================== */}

                <section
                    className="
                        mb-8
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5
                        dark:border-blue-900/60
                        dark:bg-blue-950/20
                    "
                >
                    <div className="flex items-start gap-3">

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-100
                                dark:bg-blue-950/60
                            "
                        >
                            <SlidersHorizontal
                                className="
                                    h-4
                                    w-4
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-sm
                                    font-bold
                                    text-blue-900
                                    dark:text-blue-300
                                "
                            >
                                Developer Preferences
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-blue-800
                                    dark:text-blue-400
                                "
                            >
                                Manage notifications, language, appearance,
                                and AI-related preferences for your developer
                                workspace.
                            </p>
                        </div>

                    </div>
                </section>


                {/* =====================================================
                    PREFERENCES SECTION
                ===================================================== */}

                <section>

                    {/* SECTION HEADER */}

                    <div className="mb-5">

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                                sm:text-xl
                                dark:text-white
                            "
                        >
                            Preferences
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                sm:text-sm
                                dark:text-slate-400
                            "
                        >
                            Configure how the developer portal behaves for
                            your account.
                        </p>

                    </div>


                    {/* =================================================
                        PREFERENCE CARDS
                    ================================================= */}

                    <div className="space-y-6">

                        {/* NOTIFICATIONS */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <NotificationPreferences />
                        </section>


                        {/* LANGUAGE */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <LanguagePreferences />
                        </section>


                        {/* THEME */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <ThemePreferences />
                        </section>


                        {/* AI */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <AIPreferences />
                        </section>

                    </div>

                </section>


                {/* =====================================================
                    FOOTER INFORMATION
                ===================================================== */}

                <div
                    className="
                        mt-8
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        dark:border-blue-900/60
                        dark:bg-[#0b2344]
                    "
                >

                    <SettingsIcon
                        className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            text-slate-500
                            dark:text-blue-400
                        "
                    />

                    <p
                        className="
                            text-xs
                            leading-5
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Your preferences are applied to your developer
                        workspace and help personalize your AI-PMS experience.
                    </p>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <footer
                    className="
                        mt-8
                        border-t
                        border-slate-200
                        py-6
                        text-center
                        dark:border-blue-900/60
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Developer Settings & Preferences
                    </p>
                </footer>

            </div>
        </div>
    );
}
