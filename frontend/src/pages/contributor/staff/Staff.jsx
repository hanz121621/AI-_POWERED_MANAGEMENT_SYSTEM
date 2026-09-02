
import { useState } from "react";

import {
    Bell,
    Languages,
    Palette,
    BrainCircuit,
    X,
    Settings as SettingsIcon,
    Eye,
} from "lucide-react";

import ManageNotificationPreferences from "@/components/contributor/staff/settings/ManageNotificationPreferences";
import ChangeLanguagePreferences from "@/components/contributor/staff/settings/ChangeLanguagePreferences";
import ThemePreferences from "@/components/contributor/staff/settings/ThemePreferences";
import AIPreferences from "@/components/contributor/staff/settings/AIPreferences";

// ============================================================
// STAFF - SETTINGS & PREFERENCES
// ============================================================

function Settings() {
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    // ========================================================
    // STAFF SETTINGS USE CASES
    // ========================================================

    const useCases = [
        {
            id: "STAFF-SETTING-001",
            title: "Manage Notification Preferences",
            description:
                "Manage how you receive task, project, sprint, and system notifications.",
            icon: Bell,
            component: ManageNotificationPreferences,
        },
        {
            id: "STAFF-SETTING-002",
            title: "Change Language Preferences",
            description:
                "Select your preferred language for the AI-PMS staff interface.",
            icon: Languages,
            component: ChangeLanguagePreferences,
        },
        {
            id: "STAFF-SETTING-003",
            title: "Change Theme Preferences",
            description:
                "Customize the appearance of the staff workspace using your preferred theme.",
            icon: Palette,
            component: ThemePreferences,
        },
        {
            id: "STAFF-SETTING-004",
            title: "Manage AI Preferences",
            description:
                "Configure how AI-powered suggestions and assistance are provided.",
            icon: BrainCircuit,
            component: AIPreferences,
        },
    ];

    // ========================================================
    // OPEN USE CASE
    // ========================================================

    const openUseCase = (useCase) => {
        setSelectedUseCase(useCase);
    };

    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const closeModal = () => {
        setSelectedUseCase(null);
    };

    const SelectedComponent = selectedUseCase?.component;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-950 p-6 text-white">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20">
                        <SettingsIcon
                            size={26}
                            className="text-blue-400"
                        />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Settings & Preferences
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Customize your Staff workspace and personal
                            preferences.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SETTINGS CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {useCases.map((useCase) => {
                    const Icon = useCase.icon;

                    return (
                        <div
                            key={useCase.id}
                            className="group rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg transition duration-200 hover:border-blue-500/60 hover:shadow-blue-950/20"
                        >
                            {/* CARD TOP */}
                            <div className="flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 transition group-hover:bg-blue-600/20">
                                    <Icon
                                        size={25}
                                        className="text-blue-400"
                                    />
                                </div>

                                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                                    {useCase.id}
                                </span>
                            </div>

                            {/* TITLE */}
                            <h2 className="mt-5 text-xl font-semibold text-white">
                                {useCase.title}
                            </h2>

                            {/* DESCRIPTION */}
                            <p className="mt-2 min-h-[52px] text-sm leading-6 text-slate-400">
                                {useCase.description}
                            </p>

                            {/* BUTTON */}
                            <button
                                type="button"
                                onClick={() =>
                                    openUseCase(useCase)
                                }
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                <Eye size={18} />
                                Open
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ==================================================
                SETTINGS MODAL
            ================================================== */}

            {selectedUseCase && SelectedComponent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
                                    {selectedUseCase.icon &&
                                        (() => {
                                            const Icon =
                                                selectedUseCase.icon;

                                            return (
                                                <Icon
                                                    size={21}
                                                    className="text-blue-400"
                                                />
                                            );
                                        })()}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        {selectedUseCase.title}
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {selectedUseCase.id}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Close settings"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* MODAL CONTENT */}
                        <div className="overflow-y-auto p-6">
                            <SelectedComponent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
