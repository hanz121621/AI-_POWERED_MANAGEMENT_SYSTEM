
import { useState } from "react";

import {
    Check,
    Loader2,
    Monitor,
    Moon,
    Palette,
    Save,
    Sun,
} from "lucide-react";

// ============================================================
// AIPMS — ADMIN THEME PREFERENCES
//
// Purpose:
// Allow Administrator to select and apply the application theme.
//
// Supported modes:
// - Light
// - Dark
// - System
//
// Persistence:
// - Admin theme preference is stored in localStorage.
// ============================================================

const THEME_KEY = "aipms_theme_preferences";

const DEFAULT_THEME = {
    mode: "system",
};

const THEME_MODES = [
    {
        id: "light",
        name: "Light",
        description: "Use a bright and clean interface.",
        icon: Sun,
    },
    {
        id: "dark",
        name: "Dark",
        description: "Use a dark interface for comfortable viewing.",
        icon: Moon,
    },
    {
        id: "system",
        name: "System Default",
        description: "Follow your computer or device theme.",
        icon: Monitor,
    },
];

// ============================================================
// GET SAVED THEME
// ============================================================

function getSavedTheme() {
    if (typeof window === "undefined") {
        return DEFAULT_THEME;
    }

    try {
        const savedTheme = localStorage.getItem(THEME_KEY);

        if (!savedTheme) {
            return DEFAULT_THEME;
        }

        const parsedTheme = JSON.parse(savedTheme);

        const mode = ["light", "dark", "system"].includes(
            parsedTheme?.mode
        )
            ? parsedTheme.mode
            : DEFAULT_THEME.mode;

        return {
            mode,
        };
    } catch {
        return DEFAULT_THEME;
    }
}

// ============================================================
// APPLY THEME
// ============================================================

function applyTheme(theme) {
    if (
        typeof window === "undefined" ||
        typeof document === "undefined"
    ) {
        return;
    }

    const root = document.documentElement;

    if (theme.mode === "light") {
        root.classList.remove("dark");
    } else if (theme.mode === "dark") {
        root.classList.add("dark");
    } else {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (prefersDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }

    // Remove theme-related inline variables so the
    // application's normal Tailwind/theme variables apply.
    const variablesToRemove = [
        "--aipms-primary",
        "--aipms-primary-color",
        "--aipms-primary-rgb",
        "--aipms-primary-oklch",
        "--primary",
        "--ring",
        "--sidebar-primary",
        "--sidebar-ring",
        "--primary-foreground",
        "--sidebar-primary-foreground",
        "--accent",
        "--accent-foreground",
    ];

    variablesToRemove.forEach((variable) => {
        root.style.removeProperty(variable);
    });

    // Notify other AIPMS components that the theme changed.
    window.dispatchEvent(
        new CustomEvent("aipms-theme-changed", {
            detail: {
                mode: theme.mode,
            },
        })
    );
}

// ============================================================
// SAVE AND APPLY
// ============================================================

function saveAndApplyTheme(theme) {
    try {
        localStorage.setItem(
            THEME_KEY,
            JSON.stringify(theme)
        );
    } catch {
        // Ignore localStorage errors.
    }

    applyTheme(theme);
}

// ============================================================
// THEME MODE CARD
// ============================================================

function ThemeModeCard({
    mode,
    selected,
    onClick,
}) {
    const Icon = mode.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                selected
                    ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-600 dark:hover:bg-slate-800"
            }`}
        >
            {selected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white">
                    <Check className="h-4 w-4" />
                </div>
            )}

            <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    selected
                        ? "bg-violet-100 dark:bg-violet-900"
                        : "bg-slate-100 dark:bg-slate-800"
                }`}
            >
                <Icon
                    className={`h-6 w-6 ${
                        selected
                            ? "text-violet-600"
                            : "text-slate-600 dark:text-slate-300"
                    }`}
                />
            </div>

            <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white">
                    {mode.name}
                </h4>

                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {mode.description}
                </p>
            </div>
        </button>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ThemePreferences() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = getSavedTheme();

        if (
            typeof window !== "undefined" &&
            typeof document !== "undefined"
        ) {
            applyTheme(savedTheme);
        }

        return {
            mode:
                savedTheme.mode ||
                DEFAULT_THEME.mode,
        };
    });

    const [savedTheme, setSavedTheme] = useState(
        () => getSavedTheme()
    );

    const [isSaving, setIsSaving] = useState(false);

    // ========================================================
    // CHANGE THEME
    // ========================================================

    const handleModeChange = (mode) => {
        const updatedTheme = {
            mode,
        };

        setTheme(updatedTheme);

        // Preview/apply immediately.
        applyTheme(updatedTheme);
    };

    // ========================================================
    // SAVE THEME
    // ========================================================

    const handleSave = () => {
        setIsSaving(true);

        try {
            saveAndApplyTheme(theme);
            setSavedTheme(theme);
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CHECK FOR UNSAVED CHANGES
    // ========================================================

    const hasChanges =
        theme.mode !== savedTheme.mode;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* ==================================================
                HEADER
            ================================================== */}

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

            {/* ==================================================
                THEME OPTIONS
            ================================================== */}

            <div className="p-6">
                <div className="mb-5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Choose Theme
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Select how the application should appear.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {THEME_MODES.map((mode) => (
                        <ThemeModeCard
                            key={mode.id}
                            mode={mode}
                            selected={
                                theme.mode === mode.id
                            }
                            onClick={() =>
                                handleModeChange(mode.id)
                            }
                        />
                    ))}
                </div>
            </div>

            {/* ==================================================
                SAVE
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose a theme and save your preference.
                </p>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                        isSaving ||
                        !hasChanges
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Theme
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}

export default ThemePreferences;

