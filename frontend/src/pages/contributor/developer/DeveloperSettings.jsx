
import { useState } from "react";
import {
    Settings,
    Bell,
    Languages,
    Palette,
    Bot,
} from "lucide-react";

import NotificationPreferences from "@/components/contributor/developer/settings/NotificationPreferences";
import LanguagePreferences from "@/components/contributor/developer/settings/LanguagePreferences";
import ThemePreferences from "@/components/contributor/developer/settings/ThemePreferences";
import AIPreferences from "@/components/contributor/developer/settings/AIPreferences";

const SETTINGS_TABS = [
    {
        id: "notifications",
        label: "Notification Preferences",
        icon: Bell,
    },
    {
        id: "language",
        label: "Language Preferences",
        icon: Languages,
    },
    {
        id: "theme",
        label: "Theme Preferences",
        icon: Palette,
    },
    {
        id: "ai",
        label: "AI Preferences",
        icon: Bot,
    },
];

export default function DeveloperSettings() {
    const [activeTab, setActiveTab] = useState("notifications");

    const renderContent = () => {
        switch (activeTab) {
            case "notifications":
                return <NotificationPreferences />;

            case "language":
                return <LanguagePreferences />;

            case "theme":
                return <ThemePreferences />;

            case "ai":
                return <AIPreferences />;

            default:
                return <NotificationPreferences />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* HEADER */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Settings size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Settings & Preferences
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Manage your Developer account preferences,
                                notifications, appearance, language, and AI
                                assistance.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    {/* SIDEBAR */}
                    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                        <nav className="space-y-1">
                            {SETTINGS_TABS.map((tab) => {
                                const Icon = tab.icon;
                                const active =
                                    activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveTab(tab.id)
                                        }
                                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                                            active
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        <Icon size={19} />

                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* MAIN PANEL */}
                    <main className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}
