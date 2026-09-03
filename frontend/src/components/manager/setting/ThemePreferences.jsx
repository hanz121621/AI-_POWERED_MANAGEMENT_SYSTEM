// ============================================================
// AIPMS — MANAGER THEME PREFERENCES
//
// Use Case:
// SET-003 — Change Theme Preferences
//
// Primary Actor:
// Project Manager
//
// Purpose:
// Allow the authenticated Manager to select and save
// their preferred application theme.
//
// IMPORTANT:
// - Applies only to the current Manager
// - Does not modify project/team data
// - Does not use localStorage
// - Theme is controlled by next-themes
// - Persistence is handled by the Manager Settings backend
// ============================================================

import React, { useEffect, useState } from "react";

import {
    Check,
    Palette,
    Sun,
    Moon,
    Monitor,
    Save,
} from "lucide-react";

import { useTheme } from "next-themes";

// ============================================================
// CONFIGURED THEME OPTIONS
// ============================================================

const THEME_OPTIONS = [
    {
        id: "light",
        name: "Light",
        description:
            "Use a bright and clean interface.",
        icon: Sun,
    },
    {
        id: "dark",
        name: "Dark",
        description:
            "Use a dark interface for comfortable viewing.",
        icon: Moon,
    },
    {
        id: "system",
        name: "System Default",
        description:
            "Follow your computer or device theme.",
        icon: Monitor,
    },
];

// ============================================================
// DEFAULT THEME
// ============================================================

const DEFAULT_THEME = "light";

// ============================================================
// COMPONENT
// ============================================================

function ThemePreferences() {
    const {
        theme,
        setTheme,
        resolvedTheme,
    } = useTheme();

    const [selectedTheme, setSelectedTheme] =
        useState(DEFAULT_THEME);

    const [savedTheme, setSavedTheme] =
        useState(DEFAULT_THEME);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [isSaving, setIsSaving] =
        useState(false);

    // ========================================================
    // SYNCHRONIZE WITH GLOBAL THEME
    //
    // next-themes is the single source of truth.
    // ========================================================

    useEffect(() => {
        const currentTheme =
            theme || DEFAULT_THEME;

        const validTheme =
            THEME_OPTIONS.some(
                (item) =>
                    item.id === currentTheme
            );

        if (validTheme) {
            setSelectedTheme(currentTheme);
            setSavedTheme(currentTheme);
        }
    }, [theme]);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // SELECT THEME
    // ========================================================

    const handleThemeChange = (themeId) => {
        clearMessages();

        const exists =
            THEME_OPTIONS.some(
                (item) =>
                    item.id === themeId
            );

        if (!exists) {
            setErrorMessage(
                "The selected theme is not supported."
            );
            return;
        }

        setSelectedTheme(themeId);

        // Apply immediately through next-themes.
        setTheme(themeId);
    };

    // ========================================================
    // SAVE
    //
    // IMPORTANT:
    // This component only handles the visual selection.
    //
    // The actual backend persistence is handled by
    // ManagerSettings.jsx / managerSettingsService.
    // ========================================================

    const handleSave = async () => {
        clearMessages();

        const validTheme =
            THEME_OPTIONS.some(
                (item) =>
                    item.id === selectedTheme
            );

        if (!validTheme) {
            setErrorMessage(
                "Please select a supported theme."
            );
            return;
        }

        setIsSaving(true);

        try {
            // Apply globally.
            setTheme(selectedTheme);

            // This component no longer writes localStorage.
            // Backend persistence should be performed by
            // ManagerSettings.jsx.

            setSavedTheme(selectedTheme);

            setSuccessMessage(
                "Theme preference applied successfully."
            );
        } catch (error) {
            console.error(
                "Failed to apply theme preference:",
                error
            );

            setErrorMessage(
                "Unable to apply your theme preference."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleReset = () => {
        clearMessages();

        setSelectedTheme(savedTheme);

        setTheme(savedTheme);
    };

    // ========================================================
    // CURRENT THEME
    // ========================================================

    const currentTheme =
        THEME_OPTIONS.find(
            (item) =>
                item.id === selectedTheme
        );

    // ========================================================
    // RESOLVED THEME
    //
    // Useful when "system" is selected.
    // ========================================================

    const effectiveTheme =
        resolvedTheme || selectedTheme;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            {/* HEADER */}

            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950">

                        <Palette
                            size={22}
                            className="text-violet-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Theme Preferences
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Customize the visual appearance of your AIPMS interface.
                        </p>

                    </div>

                </div>

            </div>

            {/* SUCCESS */}

            {successMessage && (

                <div className="mx-6 mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

                    {successMessage}

                </div>

            )}

            {/* ERROR */}

            {errorMessage && (

                <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">

                    {errorMessage}

                </div>

            )}

            {/* CONTENT */}

            <div className="p-6">

                <div className="mb-5">

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Choose Theme
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Select how the application should appear for your account.
                    </p>

                </div>

                {/* OPTIONS */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {THEME_OPTIONS.map(
                        (themeOption) => {

                            const Icon =
                                themeOption.icon;

                            const isSelected =
                                selectedTheme ===
                                themeOption.id;

                            return (

                                <button
                                    key={
                                        themeOption.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleThemeChange(
                                            themeOption.id
                                        )
                                    }
                                    disabled={isSaving}
                                    className={`relative rounded-2xl border-2 p-5 text-left transition ${
                                        isSelected
                                            ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950"
                                            : "border-slate-200 bg-white hover:border-violet-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-600 dark:hover:bg-slate-800"
                                    }`}
                                >

                                    {isSelected && (

                                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white">

                                            <Check
                                                size={15}
                                            />

                                        </div>

                                    )}

                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                            isSelected
                                                ? "bg-violet-100 dark:bg-violet-900"
                                                : "bg-slate-100 dark:bg-slate-800"
                                        }`}
                                    >

                                        <Icon
                                            size={23}
                                            className={
                                                isSelected
                                                    ? "text-violet-600"
                                                    : "text-slate-600 dark:text-slate-300"
                                            }
                                        />

                                    </div>

                                    <h4 className="mt-4 font-bold text-slate-900 dark:text-white">
                                        {
                                            themeOption.name
                                        }
                                    </h4>

                                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {
                                            themeOption.description
                                        }
                                    </p>

                                </button>
                            );
                        }
                    )}

                </div>

                {/* CURRENT SELECTION */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Selected Theme
                            </p>

                            <p className="mt-1 font-bold text-slate-900 dark:text-white">

                                {
                                    currentTheme?.name ||
                                    "Light"
                                }

                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

                                Effective theme:{" "}

                                {effectiveTheme ===
                                "dark"
                                    ? "Dark"
                                    : "Light"}

                            </p>

                        </div>

                        <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                            Manager Preference
                        </div>

                    </div>

                </div>

            </div>

            {/* FOOTER */}

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Theme changes affect only your interface.
                </p>

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={
                            selectedTheme ===
                                savedTheme ||
                            isSaving
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={
                            selectedTheme ===
                                savedTheme ||
                            isSaving
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Save size={17} />

                        {isSaving
                            ? "Saving..."
                            : "Apply Theme"}

                    </button>

                </div>

            </div>

        </section>
    );
}

export default ThemePreferences;