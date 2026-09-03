
import { useState } from "react";

import {
    Palette,
    Sun,
    Moon,
    Monitor,
    Check,
    Save,
    RotateCcw,
    Info,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const THEME_STORAGE_KEY = "aipms_staff_theme_preferences";

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_THEME_SETTINGS = {
    theme: "dark",
};

// ============================================================
// THEME OPTIONS
// ============================================================

const THEME_OPTIONS = [
    {
        value: "light",
        label: "Light",
        description: "Use a light appearance throughout the system.",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Dark",
        description: "Use a dark appearance throughout the system.",
        icon: Moon,
    },
    {
        value: "system",
        label: "System Default",
        description: "Automatically follow your device appearance.",
        icon: Monitor,
    },
];

// ============================================================
// GET INITIAL SETTINGS
// ============================================================

function getInitialSettings() {
    try {
        const storedSettings = localStorage.getItem(
            THEME_STORAGE_KEY
        );

        if (!storedSettings) {
            return { ...DEFAULT_THEME_SETTINGS };
        }

        const parsedSettings = JSON.parse(storedSettings);

        return {
            ...DEFAULT_THEME_SETTINGS,
            ...parsedSettings,
        };
    } catch (error) {
        console.error(
            "Failed to load theme preferences:",
            error
        );

        return { ...DEFAULT_THEME_SETTINGS };
    }
}

// ============================================================
// APPLY THEME
// ============================================================

function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
        return;
    }

    if (theme === "light") {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
        return;
    }

    // System default
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    if (prefersDark) {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
    } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
    }
}

// ============================================================
// THEME OPTION CARD
// ============================================================

function ThemeOptionCard({
    option,
    selected,
    onSelect,
}) {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={() => onSelect(option.value)}
            className={`w-full rounded-xl border p-5 text-left transition ${
                selected
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-card hover:border-primary/30 hover:bg-muted"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        <Icon size={22} />
                    </div>

                    {/* Text */}
                    <div>
                        <h3 className="font-semibold text-card-foreground">
                            {option.label}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {option.description}
                        </p>
                    </div>
                </div>

                {/* Selected indicator */}
                <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-transparent"
                    }`}
                >
                    <Check size={15} />
                </div>
            </div>
        </button>
    );
}

// ============================================================
// PREVIEW
// ============================================================

function ThemePreview({ theme }) {
    if (theme === "light") {
        return (
            <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm font-medium text-card-foreground">
                    Light Theme Preview
                </p>

                <div className="mt-4 rounded-lg border border-border bg-muted p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-foreground">
                                Staff Dashboard
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Your workspace overview
                            </p>
                        </div>

                        <Sun
                            size={22}
                            className="text-primary"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (theme === "system") {
        return (
            <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm font-medium text-card-foreground">
                    System Default Preview
                </p>

                <div className="mt-4 rounded-lg border border-border bg-muted p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-foreground">
                                Staff Dashboard
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Follows your device appearance.
                            </p>
                        </div>

                        <Monitor
                            size={22}
                            className="text-primary"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-card-foreground">
                Dark Theme Preview
            </p>

            <div className="mt-4 rounded-lg border border-border bg-muted p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-foreground">
                            Staff Dashboard
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Your workspace overview
                        </p>
                    </div>

                    <Moon
                        size={22}
                        className="text-primary"
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ThemePreferences() {
    const [settings, setSettings] = useState(
        getInitialSettings
    );

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // ========================================================
    // SELECT THEME
    // ========================================================

    const handleSelectTheme = (theme) => {
        setSettings((previous) => ({
            ...previous,
            theme,
        }));

        setSaved(false);
        setError("");

        // Preview the selected theme immediately.
        applyTheme(theme);
    };

    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = () => {
        try {
            localStorage.setItem(
                THEME_STORAGE_KEY,
                JSON.stringify(settings)
            );

            // Store the general system theme value.
            localStorage.setItem(
                "aipms_theme",
                settings.theme
            );

            applyTheme(settings.theme);

            // Notify other components.
            window.dispatchEvent(
                new CustomEvent("themeChanged", {
                    detail: {
                        theme: settings.theme,
                    },
                })
            );

            setSaved(true);
            setError("");
        } catch (err) {
            console.error(
                "Failed to save theme preference:",
                err
            );

            setError(
                "Unable to save the theme preference. Please try again."
            );

            setSaved(false);
        }
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        const defaultSettings = {
            ...DEFAULT_THEME_SETTINGS,
        };

        setSettings(defaultSettings);

        applyTheme(defaultSettings.theme);

        setSaved(false);
        setError("");
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Palette size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Theme Preferences
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Customize the appearance of your
                            AI-PMS workspace.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
                <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                />

                <div>
                    <p className="font-medium text-primary">
                        Current theme:{" "}
                        {settings.theme === "system"
                            ? "System Default"
                            : settings.theme === "light"
                            ? "Light"
                            : "Dark"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Select your preferred appearance. The
                        selected theme is previewed immediately.
                    </p>
                </div>
            </div>

            {/* ==================================================
                THEME OPTIONS
            ================================================== */}

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Palette
                        size={18}
                        className="text-muted-foreground"
                    />

                    <h3 className="font-semibold text-foreground">
                        Appearance
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {THEME_OPTIONS.map((option) => (
                        <ThemeOptionCard
                            key={option.value}
                            option={option}
                            selected={
                                settings.theme === option.value
                            }
                            onSelect={handleSelectTheme}
                        />
                    ))}
                </div>
            </div>

            {/* ==================================================
                PREVIEW
            ================================================== */}

            <div>
                <h3 className="mb-3 font-semibold text-foreground">
                    Preview
                </h3>

                <ThemePreview theme={settings.theme} />
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {saved && (
                <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    Theme preference saved successfully.
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
                <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    {error}
                </div>
            )}

            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                    <RotateCcw size={17} />
                    Reset
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Save size={17} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default ThemePreferences;
