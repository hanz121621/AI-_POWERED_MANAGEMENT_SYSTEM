import { useEffect, useState } from "react";

import {
    Check,
    Loader2,
    Monitor,
    Moon,
    Palette,
    Save,
    Sun,
} from "lucide-react";

import api from "@/services/api";

// ============================================================
// AIPMS — TEAM LEADER THEME PREFERENCES
//
// Purpose:
// Allow Team Leader to select and apply the application theme.
//
// Supported modes:
// - Light
// - Dark
// - System
//
// Persistence:
// - Backend is the source of truth.
// - localStorage is used as a cache/fallback only.
// ============================================================

const STORAGE_KEY = "aipms_teamleader_theme";
const SYSTEM_STORAGE_KEY = "aipms_theme";

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
// NORMALIZE THEME
// ============================================================

function normalizeTheme(value) {
    const theme = String(value || "")
        .trim()
        .toLowerCase();

    if (theme === "dark") {
        return "dark";
    }

    if (
        theme === "system" ||
        theme === "system default"
    ) {
        return "system";
    }

    if (theme === "light") {
        return "light";
    }

    return "system";
}

// ============================================================
// GET CACHED THEME
// ============================================================

function getCachedTheme() {
    if (typeof window === "undefined") {
        return DEFAULT_THEME;
    }

    try {
        const teamLeaderTheme =
            localStorage.getItem(STORAGE_KEY);

        const generalTheme =
            localStorage.getItem(SYSTEM_STORAGE_KEY);

        const storedTheme =
            teamLeaderTheme || generalTheme;

        if (!storedTheme) {
            return DEFAULT_THEME;
        }

        // Support both:
        // "dark"
        // {"mode":"dark"}
        try {
            const parsed = JSON.parse(storedTheme);

            if (parsed && typeof parsed === "object") {
                return {
                    mode: normalizeTheme(parsed.mode),
                };
            }
        } catch {
            // Stored value is probably a simple string.
        }

        return {
            mode: normalizeTheme(storedTheme),
        };
    } catch {
        return DEFAULT_THEME;
    }
}

// ============================================================
// EXTRACT BACKEND PREFERENCES
// ============================================================

function extractPreferences(response) {
    const source =
        response?.data?.data ??
        response?.data?.Data ??
        response?.data ??
        response;

    return source || {};
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

    // --------------------------------------------------------
    // LIGHT
    // --------------------------------------------------------

    if (theme.mode === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
    }

    // --------------------------------------------------------
    // DARK
    // --------------------------------------------------------

    else if (theme.mode === "dark") {
        root.classList.remove("light");
        root.classList.add("dark");
    }

    // --------------------------------------------------------
    // SYSTEM
    // --------------------------------------------------------

    else {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.remove("light", "dark");

        root.classList.add(
            prefersDark ? "dark" : "light"
        );
    }

    // --------------------------------------------------------
    // Remove custom theme variables.
    // Let normal Tailwind/theme variables work.
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Notify AIPMS components
    // --------------------------------------------------------

    window.dispatchEvent(
        new CustomEvent("aipms-theme-changed", {
            detail: {
                mode: theme.mode,
                theme: theme.mode,
            },
        })
    );

    window.dispatchEvent(
        new CustomEvent("aipms-theme-change", {
            detail: {
                mode: theme.mode,
                theme: theme.mode,
            },
        })
    );
}

// ============================================================
// CACHE THEME
// ============================================================

function cacheTheme(theme) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            theme.mode
        );

        localStorage.setItem(
            SYSTEM_STORAGE_KEY,
            theme.mode
        );
    } catch {
        // Ignore localStorage errors.
    }
}

// ============================================================
// THEME MODE CARD
// ============================================================

function ThemeModeCard({
    mode,
    selected,
    onClick,
    disabled,
}) {
    const Icon = mode.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`group relative flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                selected
                    ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-600 dark:hover:bg-slate-800"
            } ${
                disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
            }`}
        >
            {/* Selected indicator */}
            {selected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white dark:bg-violet-500">
                    <Check className="h-4 w-4" />
                </div>
            )}

            {/* Icon */}
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
                            ? "text-violet-600 dark:text-violet-300"
                            : "text-slate-600 dark:text-slate-300"
                    }`}
                />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1 pr-6">
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
        const cachedTheme = getCachedTheme();

        if (
            typeof window !== "undefined" &&
            typeof document !== "undefined"
        ) {
            applyTheme(cachedTheme);
        }

        return cachedTheme;
    });

    const [savedTheme, setSavedTheme] = useState(
        () => getCachedTheme()
    );

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // ========================================================
    // LOAD BACKEND PREFERENCE
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadPreferences = async () => {
            try {
                setLoading(true);
                setError("");
                setSuccess(false);

                const response = await api.get(
                    "/user-preferences"
                );

                const preferences =
                    extractPreferences(response);

                const backendTheme =
                    normalizeTheme(
                        preferences?.themePreference ??
                            preferences?.ThemePreference
                    );

                if (!mounted) {
                    return;
                }

                const loadedTheme = {
                    mode: backendTheme,
                };

                setTheme(loadedTheme);
                setSavedTheme(loadedTheme);

                cacheTheme(loadedTheme);

                applyTheme(loadedTheme);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                // ------------------------------------------------
                // Backend unavailable:
                // use cached theme as fallback.
                // ------------------------------------------------

                const cachedTheme =
                    getCachedTheme();

                setTheme(cachedTheme);
                setSavedTheme(cachedTheme);

                applyTheme(cachedTheme);

                setError(
                    err?.response?.data?.message ||
                        err?.response?.data?.Message ||
                        "Unable to load your theme preference. Your saved local theme is being used."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadPreferences();

        return () => {
            mounted = false;
        };
    }, []);

    // ========================================================
    // CHANGE THEME
    // ========================================================

    const handleModeChange = (mode) => {
        const updatedTheme = {
            mode: normalizeTheme(mode),
        };

        setTheme(updatedTheme);
        setSuccess(false);
        setError("");

        // Preview immediately.
        applyTheme(updatedTheme);
    };

    // ========================================================
    // CANCEL CHANGES
    // ========================================================

    const handleCancel = () => {
        setTheme(savedTheme);
        setSuccess(false);
        setError("");

        applyTheme(savedTheme);
    };

    // ========================================================
    // SAVE THEME
    // ========================================================

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSuccess(false);
            setError("");

            // ------------------------------------------------
            // Get current preferences first so that saving
            // theme does not overwrite language/custom theme.
            // ------------------------------------------------

            const response = await api.get(
                "/user-preferences"
            );

            const currentPreferences =
                extractPreferences(response);

            const payload = {
                languagePreference:
                    currentPreferences?.languagePreference ??
                    currentPreferences?.LanguagePreference ??
                    null,

                themePreference: theme.mode,

                customThemeId:
                    currentPreferences?.customThemeId ??
                    currentPreferences?.CustomThemeId ??
                    null,
            };

            // ------------------------------------------------
            // Save to backend
            // ------------------------------------------------

            await api.put(
                "/user-preferences",
                payload
            );

            // ------------------------------------------------
            // Update saved state
            // ------------------------------------------------

            setSavedTheme(theme);

            // Cache only after successful backend save.
            cacheTheme(theme);

            // Apply theme.
            applyTheme(theme);

            setSuccess(true);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.Message ||
                    "Failed to save your theme preference."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // UNSAVED CHANGES
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
                    {/* Palette icon */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950">
                        <Palette
                            size={22}
                            className="text-violet-600 dark:text-violet-400"
                        />
                    </div>

                    {/* Header text */}
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
                ERROR MESSAGE
            ================================================== */}

            {error && (
                <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {success && (
                <div className="mx-6 mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <Check className="h-4 w-4" />

                    Theme preference updated successfully.
                </div>
            )}

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

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {THEME_MODES.map((mode) => (
                            <ThemeModeCard
                                key={mode.id}
                                mode={mode}
                                selected={
                                    theme.mode === mode.id
                                }
                                disabled={isSaving}
                                onClick={() =>
                                    handleModeChange(
                                        mode.id
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ==================================================
                SAVE
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Choose a theme and save your preference.
                    </p>

                    {hasChanges && !loading && (
                        <p className="mt-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                            You have unsaved changes.
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Cancel */}
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={
                            isSaving ||
                            loading ||
                            !hasChanges
                        }
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>

                    {/* Save */}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={
                            isSaving ||
                            loading ||
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
            </div>
        </section>
    );
}

export default ThemePreferences;