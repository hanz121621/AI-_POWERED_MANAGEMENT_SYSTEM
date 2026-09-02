import { useState } from "react";
import {
    Settings as SettingsIcon,
    Bell,
    Languages,
    Palette,
    Sparkles,
} from "lucide-react";

import NotificationPreferences from "@/components/contributor/teamleader/settings/NotificationPreferences";
import LanguagePreferences from "@/components/contributor/teamleader/settings/LanguagePreferences";
import ThemePreferences from "@/components/contributor/teamleader/settings/ThemePreferences";
import AIPreferences from "@/components/contributor/teamleader/settings/AIPreferences";

const SETTINGS_TABS = [
    {
        id: "notifications",
        label: "Notifications",
        description: "Manage alerts and notifications",
        icon: Bell,
    },
    {
        id: "language",
        label: "Language",
        description: "Choose your interface language",
        icon: Languages,
    },
    {
        id: "theme",
        label: "Appearance",
        description: "Customize the interface theme",
        icon: Palette,
    },
    {
        id: "ai",
        label: "AI Preferences",
        description: "Configure AI assistance",
        icon: Sparkles,
    },
];

export default function Settings() {
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
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}
                <div className="mb-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                            <SettingsIcon className="h-6 w-6 text-blue-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Settings & Preferences
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your notification, language, appearance,
                                and AI preferences.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    SETTINGS LAYOUT
                ====================================================== */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                    {/* =================================================
                        LEFT NAVIGATION
                    ================================================== */}
                    <aside className="lg:col-span-3">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-5 py-4">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Preferences
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Configure your workspace
                                </p>
                            </div>

                            <nav className="p-2">
                                {SETTINGS_TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;

                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                                                isActive
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                    isActive
                                                        ? "bg-blue-100"
                                                        : "bg-slate-100"
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-4 w-4 ${
                                                        isActive
                                                            ? "text-blue-600"
                                                            : "text-slate-500"
                                                    }`}
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-medium">
                                                    {tab.label}
                                                </p>

                                                <p
                                                    className={`mt-0.5 truncate text-xs ${
                                                        isActive
                                                            ? "text-blue-600/70"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {tab.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* =================================================
                        RIGHT CONTENT
                    ================================================== */}
                    <main className="lg:col-span-9">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            {/* Content Header */}
                            <div className="border-b border-slate-200 px-6 py-5">
                                {SETTINGS_TABS.map((tab) => {
                                    if (tab.id !== activeTab) return null;

                                    const Icon = tab.icon;

                                    return (
                                        <div
                                            key={tab.id}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                <Icon className="h-5 w-5 text-slate-600" />
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-900">
                                                    {tab.label}
                                                </h2>

                                                <p className="text-sm text-slate-500">
                                                    {tab.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Component */}
                            <div className="p-6">
                                {renderContent()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}