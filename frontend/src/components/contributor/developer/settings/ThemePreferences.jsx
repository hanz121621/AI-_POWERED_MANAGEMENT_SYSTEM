import { useEffect, useState } from "react";

import {
    Check,
    Moon,
    Sun,
    Monitor,
    Palette,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const THEME_STORAGE_KEY = "aipms_developer_theme";

// ============================================================
// THEME OPTIONS
// ============================================================

const THEME_OPTIONS = [
    {
        id: "light",
        name: "Light",
        description:
            "Use a clean and bright interface for your developer workspace.",
        icon: Sun,
    },
    {
        id: "dark",
        name: "Dark",
        description:
            "Use a darker interface that is comfortable in low-light environments.",
        icon: Moon,
    },
    {
        id: "system",
        name: "System",
        description:
            "Automatically follow your computer or browser appearance setting.",
        icon: Monitor,
    },
];

// ============================================================
// GET INITIAL THEME
// ============================================================

function getInitialTheme() {
    try {
        const savedTheme =
            localStorage.getItem(THEME_STORAGE_KEY);

        if (
            savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system"
        ) {
            return savedTheme;
        }
    } catch (error) {
        console.error(
            "Unable to read developer theme preference:",
            error
        );
    }

    return "system";
}

// ============================================================
// APPLY THEME
// ============================================================

function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === "dark") {
        root.classList.add("dark");
        return;
    }

    if (theme === "light") {
        root.classList.remove("dark");
        return;
    }

    const systemPrefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    root.classList.toggle(
        "dark",
        systemPrefersDark
    );
}

// ============================================================
// SAVE THEME
// ============================================================

function saveTheme(theme) {
    try {
        localStorage.setItem(
            THEME_STORAGE_KEY,
            theme
        );
    } catch (error) {
        console.error(
            "Unable to save developer theme preference:",
            error
        );
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ThemePreferences() {
    const [theme, setTheme] = useState(
        getInitialTheme
    );

    // ========================================================
    // APPLY INITIAL / CHANGED THEME
    // ========================================================

    useEffect(() => {
        applyTheme(theme);
        saveTheme(theme);
    }, [theme]);

    // ========================================================
    // SYSTEM THEME LISTENER
    // ========================================================

    useEffect(() => {
        if (
            !window.matchMedia
        ) {
            return undefined;
        }

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );

        const handleSystemThemeChange = () => {
            if (theme === "system") {
                applyTheme("system");
            }
        };

        mediaQuery.addEventListener(
            "change",
            handleSystemThemeChange
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                handleSystemThemeChange
            );
        };
    }, [theme]);

    // ========================================================
    // HANDLE THEME CHANGE
    // ========================================================

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    // ========================================================
    // RESET TO SYSTEM
    // ========================================================

    const handleReset = () => {
        setTheme("system");
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-slate-50 dark:bg-[#071a33]">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="border-b border-slate-200 bg-white dark:border-blue-900/70 dark:bg-[#0b1f3a]">
                <div className="mx-auto max-w-5xl px-6 py-6">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <Palette className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                Theme Preferences
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Customize the appearance of
                                your AI-PMS developer workspace.
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="mx-auto max-w-5xl px-6 py-6">

                {/* ==================================================
                    CURRENT THEME
                ================================================== */}

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-[#0b1f3a]">

                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Appearance
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Select your preferred application
                                appearance.
                            </p>
                        </div>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            {theme}
                        </span>

                    </div>

                </div>

                {/* ==================================================
                    THEME OPTIONS
                ================================================== */}

                <div className="grid gap-5 md:grid-cols-3">

                    {THEME_OPTIONS.map((option) => {

                        const Icon = option.icon;

                        const isSelected =
                            theme === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() =>
                                    handleThemeChange(
                                        option.id
                                    )
                                }
                                aria-pressed={
                                    isSelected
                                }
                                className={`relative w-full rounded-xl border p-5 text-left transition-all duration-200 ${
                                    isSelected
                                        ? "border-blue-600 bg-blue-50 shadow-md dark:border-blue-500 dark:bg-blue-950/40"
                                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-900/60 dark:bg-[#0b1f3a] dark:hover:border-blue-700"
                                }`}
                            >

                                {/* SELECTED CHECK */}

                                {isSelected && (
                                    <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}

                                {/* ICON */}

                                <div
                                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                                        isSelected
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 dark:bg-blue-950/70 dark:text-slate-300"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                {/* NAME */}

                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {option.name}
                                </h3>

                                {/* DESCRIPTION */}

                                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    {option.description}
                                </p>

                                {/* STATUS */}

                                <div className="mt-4">

                                    {isSelected ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                                            <Check className="h-3 w-3" />
                                            Selected
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                            Click to select
                                        </span>
                                    )}

                                </div>

                            </button>
                        );
                    })}

                </div>

                {/* ==================================================
                    PREVIEW
                ================================================== */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-[#0b1f3a]">

                    <div className="mb-4">

                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Preview
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Your selected appearance will be
                            applied throughout the developer portal.
                        </p>

                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-blue-900/60">

                        {/* PREVIEW HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-blue-900/60 dark:bg-blue-950/40">

                            <div className="flex items-center gap-2">

                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
                                    <Palette className="h-3.5 w-3.5" />
                                </div>

                                <span className="text-xs font-semibold text-slate-800 dark:text-white">
                                    AI-PMS Developer Portal
                                </span>

                            </div>

                            <span className="rounded-full bg-blue-100 px-2 py-1 text-[9px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {theme}
                            </span>

                        </div>

                        {/* PREVIEW BODY */}

                        <div className="bg-white p-5 dark:bg-[#071a33]">

                            <div className="grid gap-3 sm:grid-cols-3">

                                <div className="rounded-lg border border-slate-200 p-3 dark:border-blue-900/60">

                                    <div className="mb-2 h-2 w-16 rounded-full bg-slate-200 dark:bg-blue-900" />

                                    <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-blue-950" />

                                </div>

                                <div className="rounded-lg border border-slate-200 p-3 dark:border-blue-900/60">

                                    <div className="mb-2 h-2 w-16 rounded-full bg-blue-200 dark:bg-blue-800" />

                                    <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-blue-950" />

                                </div>

                                <div className="rounded-lg border border-slate-200 p-3 dark:border-blue-900/60">

                                    <div className="mb-2 h-2 w-12 rounded-full bg-slate-200 dark:bg-blue-900" />

                                    <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-blue-950" />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    RESET
                ================================================== */}

                <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-blue-900/60 dark:bg-[#0b1f3a]">

                    <div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Reset appearance
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Return to your system's default
                            appearance.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={
                            theme === "system"
                        }
                        className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:text-slate-300 dark:hover:bg-blue-950/60"
                    >
                        Reset
                    </button>

                </div>

            </div>

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ThemePreferences;