
import {
    Settings as SettingsIcon,
    Bell,
    Palette,
    Globe,
    Brain,
} from "lucide-react";

// ============================================================
// STAFF SETTINGS COMPONENTS
// ============================================================

import AIPreferences
    from "@/components/contributor/staff/settings/AIPreferences";

import ChangeLanguagePreferences
    from "@/components/contributor/staff/settings/ChangeLanguagePreferences";

import ManageNotificationPreferences
    from "@/components/contributor/staff/settings/ManageNotificationPreferences";

import ThemePreferences
    from "@/components/contributor/staff/settings/ThemePreferences";

// ============================================================
// STAFF SETTINGS PAGE
// ============================================================

function Settings() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="mb-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <SettingsIcon size={23} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Staff Settings
                        </h1>

                        <p className="text-sm text-gray-500">
                            Manage your preferences, notifications,
                            language, theme, and AI settings.
                        </p>
                    </div>

                </div>

            </div>

            {/* ==================================================
                SETTINGS GRID
            ================================================== */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* ==================================================
                    NOTIFICATION PREFERENCES
                ================================================== */}

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <Bell size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Notification Preferences
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Manage the notifications you
                                    receive.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-5">
                        <ManageNotificationPreferences />
                    </div>

                </section>

                {/* ==================================================
                    THEME PREFERENCES
                ================================================== */}

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                <Palette size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Theme Preferences
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Customize the appearance of
                                    your Staff workspace.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-5">
                        <ThemePreferences />
                    </div>

                </section>

                {/* ==================================================
                    LANGUAGE PREFERENCES
                ================================================== */}

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                                <Globe size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Language Preferences
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Choose your preferred
                                    application language.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-5">
                        <ChangeLanguagePreferences />
                    </div>

                </section>

                {/* ==================================================
                    AI PREFERENCES
                ================================================== */}

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                <Brain size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    AI Preferences
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Manage AI-powered assistance
                                    and recommendations.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-5">
                        <AIPreferences />
                    </div>

                </section>

            </div>

        </div>
    );
}

// ============================================================
// EXPORT
// ============================================================

export default Settings;
