
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
// - Preference persists across sessions
// - Uses configured theme options
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

// ============================================================
// STORAGE KEY
// ============================================================

const THEME_PREFERENCE_KEY =
    "aipms_manager_theme_preference";

// ============================================================
// CONFIGURED THEME OPTIONS
//
// Keep theme options centralized rather than spreading
// them throughout the application.
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
// COMPONENT
// ============================================================

function ThemePreferences() {
    const [selectedTheme, setSelectedTheme] =
        useState("light");

    const [savedTheme, setSavedTheme] =
        useState("light");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [isSaving, setIsSaving] =
        useState(false);

    // ========================================================
    // LOAD SAVED PREFERENCE
    // ========================================================

    useEffect(() => {
        try {
            const storedTheme =
                localStorage.getItem(
                    THEME_PREFERENCE_KEY
                );

            const validTheme =
                THEME_OPTIONS.some(
                    (theme) =>
                        theme.id === storedTheme
                );

            if (validTheme) {
                setSelectedTheme(storedTheme);
                setSavedTheme(storedTheme);
            } else {
                // Valid default when no preference exists
                setSelectedTheme("light");
                setSavedTheme("light");
            }
        } catch (error) {
            console.error(
                "Failed to load theme preference:",
                error
            );
        }
    }, []);

    // ========================================================
    // APPLY THEME
    // ========================================================

    useEffect(() => {
        applyTheme(selectedTheme);
    }, [selectedTheme]);

    // ========================================================
    // APPLY SELECTED THEME
    // ========================================================

    const applyTheme = (theme) => {
        const root =
            document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
            return;
        }

        if (theme === "light") {
            root.classList.remove("dark");
            return;
        }

        // System theme
        if (theme === "system") {
            const prefersDark =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;

            root.classList.toggle(
                "dark",
                prefersDark
            );
        }
    };

    // ========================================================
    // SELECT THEME
    // ========================================================

    const handleThemeChange = (themeId) => {
        clearMessages();

        const exists =
            THEME_OPTIONS.some(
                (theme) =>
                    theme.id === themeId
            );

        if (!exists) {
            setErrorMessage(
                "The selected theme is not supported."
            );
            return;
        }

        setSelectedTheme(themeId);
    };

    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = async () => {
        clearMessages();

        const validTheme =
            THEME_OPTIONS.some(
                (theme) =>
                    theme.id === selectedTheme
            );

        if (!validTheme) {
            setErrorMessage(
                "Please select a supported theme."
            );
            return;
        }

        setIsSaving(true);

        try {
            // ==================================================
            // FRONTEND TEMPORARY STORAGE
            //
            // Replace this with the authenticated Manager's
            // backend preference API when connected.
            // ==================================================

            localStorage.setItem(
                THEME_PREFERENCE_KEY,
                selectedTheme
            );

            setSavedTheme(selectedTheme);

            setSuccessMessage(
                "Theme preference saved successfully."
            );
        } catch (error) {
            console.error(
                "Failed to save theme preference:",
                error
            );

            setErrorMessage(
                "Unable to save your theme preference."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        clearMessages();

        setSelectedTheme(savedTheme);
    };

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // GET CURRENT THEME NAME
    // ========================================================

    const currentTheme =
        THEME_OPTIONS.find(
            (theme) =>
                theme.id === selectedTheme
        );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">

                        <Palette
                            size={22}
                            className="text-violet-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Theme Preferences
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Customize the visual appearance of your AIPMS interface.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (

                <div className="mx-6 mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

                    {successMessage}

                </div>

            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (

                <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">

                    {errorMessage}

                </div>

            )}

            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="p-6">

                <div className="mb-5">

                    <h3 className="text-sm font-bold text-slate-900">
                        Choose Theme
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Select how the application should appear for your account.
                    </p>

                </div>

                {/* ==================================================
                    THEME OPTIONS
                ================================================== */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {THEME_OPTIONS.map(
                        (theme) => {

                            const Icon =
                                theme.icon;

                            const isSelected =
                                selectedTheme ===
                                theme.id;

                            return (

                                <button
                                    key={
                                        theme.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleThemeChange(
                                            theme.id
                                        )
                                    }
                                    className={`relative rounded-2xl border-2 p-5 text-left transition ${
                                        isSelected
                                            ? "border-violet-500 bg-violet-50"
                                            : "border-slate-200 bg-white hover:border-violet-300 hover:bg-slate-50"
                                    }`}
                                >

                                    {/* CHECK */}

                                    {isSelected && (

                                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white">

                                            <Check
                                                size={15}
                                            />

                                        </div>

                                    )}

                                    {/* ICON */}

                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                            isSelected
                                                ? "bg-violet-100"
                                                : "bg-slate-100"
                                        }`}
                                    >

                                        <Icon
                                            size={23}
                                            className={
                                                isSelected
                                                    ? "text-violet-600"
                                                    : "text-slate-600"
                                            }
                                        />

                                    </div>

                                    {/* NAME */}

                                    <h4 className="mt-4 font-bold text-slate-900">

                                        {
                                            theme.name
                                        }

                                    </h4>

                                    {/* DESCRIPTION */}

                                    <p className="mt-1 text-sm leading-6 text-slate-500">

                                        {
                                            theme.description
                                        }

                                    </p>

                                </button>

                            );
                        }
                    )}

                </div>

                {/* ==================================================
                    CURRENT SELECTION
                ================================================== */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Selected Theme
                            </p>

                            <p className="mt-1 font-bold text-slate-900">

                                {
                                    currentTheme?.name ||
                                    "Light"
                                }

                            </p>

                        </div>

                        <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                            Manager Preference
                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-slate-500">

                    Theme changes affect only your interface.

                </p>

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={
                            handleReset
                        }
                        disabled={
                            selectedTheme ===
                                savedTheme ||
                            isSaving
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleSave
                        }
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
                            : "Save Changes"}

                    </button>

                </div>

            </div>

        </section>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ThemePreferences;

