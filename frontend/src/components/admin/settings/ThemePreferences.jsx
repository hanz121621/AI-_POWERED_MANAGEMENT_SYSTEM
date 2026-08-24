import { useState } from "react";

import {
    Check,
    Palette,
    Sun,
    Moon,
    Monitor,
} from "lucide-react";

// ============================================================
// THEME STORAGE
// ============================================================

const THEME_KEY = "aipms_theme_preferences";

// ============================================================
// DEFAULT THEME
// ============================================================

const DEFAULT_THEME = {
    mode: "light",
    accent: "blue",
};

// ============================================================
// ACCENT COLORS
// ============================================================

const ACCENT_COLORS = [
    {
        id: "blue",
        name: "Blue",
        value: "#2563eb",
        className: "bg-blue-600",
    },

    {
        id: "indigo",
        name: "Indigo",
        value: "#4f46e5",
        className: "bg-indigo-600",
    },

    {
        id: "purple",
        name: "Purple",
        value: "#7c3aed",
        className: "bg-purple-600",
    },

    {
        id: "green",
        name: "Green",
        value: "#16a34a",
        className: "bg-green-600",
    },

    {
        id: "emerald",
        name: "Emerald",
        value: "#059669",
        className: "bg-emerald-600",
    },

    {
        id: "orange",
        name: "Orange",
        value: "#ea580c",
        className: "bg-orange-600",
    },

    {
        id: "red",
        name: "Red",
        value: "#dc2626",
        className: "bg-red-600",
    },

    {
        id: "pink",
        name: "Pink",
        value: "#db2777",
        className: "bg-pink-600",
    },

    {
        id: "cyan",
        name: "Cyan",
        value: "#0891b2",
        className: "bg-cyan-600",
    },
];

// ============================================================
// THEME MODES
// ============================================================

const THEME_MODES = [
    {
        id: "light",
        name: "Light",
        description: "Use the light application theme.",
        icon: Sun,
    },

    {
        id: "dark",
        name: "Dark",
        description: "Use the dark application theme.",
        icon: Moon,
    },

    {
        id: "system",
        name: "System",
        description: "Follow your operating system preference.",
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
        const savedTheme =
            localStorage.getItem(THEME_KEY);

        if (!savedTheme) {
            return DEFAULT_THEME;
        }

        const parsedTheme =
            JSON.parse(savedTheme);

        return {
            ...DEFAULT_THEME,
            ...parsedTheme,
        };
    } catch {
        return DEFAULT_THEME;
    }
}

// ============================================================
// HEX TO RGB
//
// Returns:
// "37 99 235"
// ============================================================

function hexToRgb(hex) {
    const cleanHex = hex.replace("#", "");

    const bigint = parseInt(cleanHex, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r} ${g} ${b}`;
}

// ============================================================
// HEX TO OKLCH
//
// Tailwind/shadcn in your globals.css uses OKLCH.
// We convert the selected accent color to OKLCH so
// --primary works correctly with your CSS variables.
//
// This uses the standard sRGB -> linear RGB -> XYZ -> OKLab
// conversion.
// ============================================================

function hexToOklch(hex) {
    const cleanHex = hex.replace("#", "");

    const r8 = parseInt(
        cleanHex.substring(0, 2),
        16
    );

    const g8 = parseInt(
        cleanHex.substring(2, 4),
        16
    );

    const b8 = parseInt(
        cleanHex.substring(4, 6),
        16
    );

    const srgbToLinear = (value) => {
        const v = value / 255;

        return v <= 0.04045
            ? v / 12.92
            : Math.pow(
                  (v + 0.055) / 1.055,
                  2.4
              );
    };

    const r = srgbToLinear(r8);
    const g = srgbToLinear(g8);
    const b = srgbToLinear(b8);

    // sRGB -> XYZ D65

    const x =
        0.4124564 * r +
        0.3575761 * g +
        0.1804375 * b;

    const y =
        0.2126729 * r +
        0.7151522 * g +
        0.0721750 * b;

    const z =
        0.0193339 * r +
        0.1191920 * g +
        0.9503041 * b;

    // XYZ -> LMS

    const l =
        0.8189330101 * x +
        0.3618667424 * y -
        0.1288597137 * z;

    const m =
        0.0329845436 * x +
        0.9293118715 * y +
        0.0361456387 * z;

    const s =
        0.0482003018 * x +
        0.2643662691 * y +
        0.6338517070 * z;

    const lRoot = Math.cbrt(l);
    const mRoot = Math.cbrt(m);
    const sRoot = Math.cbrt(s);

    // LMS -> OKLab

    const L =
        0.2104542553 * lRoot +
        0.7936177850 * mRoot -
        0.0040720468 * sRoot;

    const a =
        1.9779984951 * lRoot -
        2.4285922050 * mRoot +
        0.4505937099 * sRoot;

    const bLab =
        0.0259040371 * lRoot +
        0.7827717662 * mRoot -
        0.8086757660 * sRoot;

    const C = Math.sqrt(
        a * a +
        bLab * bLab
    );

    let H =
        Math.atan2(
            bLab,
            a
        ) *
        (180 / Math.PI);

    if (H < 0) {
        H += 360;
    }

    return `${L.toFixed(4)} ${C.toFixed(
        4
    )} ${H.toFixed(2)}`;
}

// ============================================================
// APPLY THEME TO APPLICATION
// ============================================================

function applyTheme(theme) {
    if (
        typeof document === "undefined"
    ) {
        return;
    }

    const root =
        document.documentElement;

    // ========================================================
    // LIGHT / DARK / SYSTEM MODE
    // ========================================================

    if (theme.mode === "dark") {
        root.classList.add("dark");
    } else if (
        theme.mode === "light"
    ) {
        root.classList.remove("dark");
    } else {
        // SYSTEM MODE

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        if (prefersDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }

    // ========================================================
    // FIND SELECTED ACCENT
    // ========================================================

    const selectedColor =
        ACCENT_COLORS.find(
            (color) =>
                color.id === theme.accent
        ) ||
        ACCENT_COLORS[0];

    const hexColor =
        selectedColor.value;

    const rgbColor =
        hexToRgb(hexColor);

    const oklchColor =
        hexToOklch(hexColor);

    // ========================================================
    // CUSTOM AI-PMS VARIABLES
    // ========================================================

    root.style.setProperty(
        "--aipms-primary",
        hexColor
    );

    root.style.setProperty(
        "--aipms-primary-color",
        hexColor
    );

    root.style.setProperty(
        "--aipms-primary-rgb",
        rgbColor
    );

    root.style.setProperty(
        "--aipms-primary-oklch",
        oklchColor
    );

    // ========================================================
    // SHADCN / TAILWIND PRIMARY
    //
    // globals.css:
    //
    // --color-primary: var(--primary)
    //
    // Therefore --primary must use OKLCH values.
    // ========================================================

    root.style.setProperty(
        "--primary",
        `oklch(${oklchColor})`
    );

    // ========================================================
    // RING
    // ========================================================

    root.style.setProperty(
        "--ring",
        `oklch(${oklchColor})`
    );

    // ========================================================
    // SIDEBAR PRIMARY
    //
    // This makes the sidebar use the SAME accent color.
    // ========================================================

    root.style.setProperty(
        "--sidebar-primary",
        `oklch(${oklchColor})`
    );

    root.style.setProperty(
        "--sidebar-ring",
        `oklch(${oklchColor})`
    );

    // ========================================================
    // PRIMARY FOREGROUND
    // ========================================================

    root.style.setProperty(
        "--primary-foreground",
        "oklch(0.985 0.01 255)"
    );

    root.style.setProperty(
        "--sidebar-primary-foreground",
        "oklch(0.985 0.01 255)"
    );

    // ========================================================
    // ACCENT COLOR
    //
    // This also helps components using accent variables.
    // ========================================================

    root.style.setProperty(
        "--accent",
        `oklch(${oklchColor})`
    );

    root.style.setProperty(
        "--accent-foreground",
        "oklch(0.985 0.01 255)"
    );

    // ========================================================
    // NOTIFY APPLICATION
    // ========================================================

    window.dispatchEvent(
        new CustomEvent(
            "aipms-theme-changed",
            {
                detail: {
                    ...theme,
                    color: hexColor,
                },
            }
        )
    );
}

// ============================================================
// SAVE + APPLY
// ============================================================

function saveAndApplyTheme(theme) {
    try {
        localStorage.setItem(
            THEME_KEY,
            JSON.stringify(theme)
        );
    } catch {
        // Ignore localStorage errors
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
            className={`
                group
                relative
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                p-4
                text-left
                transition-all
                duration-200

                ${
                    selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                }
            `}
        >
            {/* ICON */}

            <div
                className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl

                    ${
                        selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }
                `}
            >
                <Icon className="h-5 w-5" />
            </div>

            {/* TEXT */}

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                    {mode.name}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {mode.description}
                </p>
            </div>

            {/* CHECK */}

            {selected && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                </div>
            )}
        </button>
    );
}

// ============================================================
// COLOR CARD
// ============================================================

function ColorCard({
    color,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Select ${color.name} color`}
            aria-pressed={selected}
            className={`
                group
                relative
                flex
                flex-col
                items-center
                gap-2
                rounded-2xl
                border
                p-3
                transition-all
                duration-200

                ${
                    selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                }
            `}
        >
            {/* COLOR */}

            <div
                className={`
                    ${color.className}

                    relative
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    shadow-sm
                    ring-4
                    ring-background
                    transition-transform
                    duration-200
                    group-hover:scale-110
                `}
            >
                {selected && (
                    <Check className="h-5 w-5 text-white" />
                )}
            </div>

            {/* NAME */}

            <span className="text-xs font-medium text-foreground">
                {color.name}
            </span>
        </button>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ThemePreferences() {
    // ========================================================
    // INITIAL THEME
    // ========================================================

    const [theme, setTheme] = useState(
        () => {
            const savedTheme =
                getSavedTheme();

            // Apply saved theme once during
            // initialization.

            if (
                typeof window !==
                    "undefined" &&
                typeof document !==
                    "undefined"
            ) {
                applyTheme(
                    savedTheme
                );
            }

            return savedTheme;
        }
    );

    // ========================================================
    // CHANGE MODE
    // ========================================================

    const handleModeChange = (
        mode
    ) => {
        const updatedTheme = {
            ...theme,
            mode,
        };

        setTheme(
            updatedTheme
        );

        saveAndApplyTheme(
            updatedTheme
        );
    };

    // ========================================================
    // CHANGE ACCENT COLOR
    // ========================================================

    const handleColorChange = (
        accent
    ) => {
        const updatedTheme = {
            ...theme,
            accent,
        };

        setTheme(
            updatedTheme
        );

        saveAndApplyTheme(
            updatedTheme
        );
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        const defaultTheme = {
            ...DEFAULT_THEME,
        };

        setTheme(
            defaultTheme
        );

        saveAndApplyTheme(
            defaultTheme
        );
    };

    // ========================================================
    // SELECTED COLOR
    // ========================================================

    const selectedColor =
        ACCENT_COLORS.find(
            (color) =>
                color.id ===
                theme.accent
        ) ||
        ACCENT_COLORS[0];

    // ========================================================
    // PAGE
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl border border-border bg-card shadow-sm">

                <div className="p-5 md:p-6">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                            <Palette className="h-5 w-5" />

                        </div>

                        <div>

                            <h3 className="text-lg font-bold text-foreground">
                                Theme Preferences
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Customize the appearance and accent
                                color of the AI-PMS application.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                APPEARANCE MODE
            ================================================== */}

            <section className="rounded-2xl border border-border bg-card shadow-sm">

                <div className="border-b border-border p-5 md:p-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">

                            <Palette className="h-4 w-4" />

                        </div>

                        <div>

                            <h4 className="text-sm font-bold text-foreground">
                                Appearance
                            </h4>

                            <p className="text-xs text-muted-foreground">
                                Choose how AI-PMS should appear.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="grid gap-3 p-5 md:grid-cols-3 md:p-6">

                    {THEME_MODES.map(
                        (mode) => (
                            <ThemeModeCard
                                key={mode.id}
                                mode={mode}
                                selected={
                                    theme.mode ===
                                    mode.id
                                }
                                onClick={() =>
                                    handleModeChange(
                                        mode.id
                                    )
                                }
                            />
                        )
                    )}

                </div>

            </section>


            {/* ==================================================
                ACCENT COLORS
            ================================================== */}

            <section className="rounded-2xl border border-border bg-card shadow-sm">

                <div className="border-b border-border p-5 md:p-6">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <h4 className="text-sm font-bold text-foreground">
                                Accent Color
                            </h4>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Select the primary color used throughout
                                the AI-PMS interface.
                            </p>

                        </div>

                        <div className="hidden items-center gap-2 sm:flex">

                            <span className="text-xs text-muted-foreground">
                                Current:
                            </span>

                            <span className="text-xs font-semibold text-primary">
                                {selectedColor.name}
                            </span>

                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-3 gap-3 p-5 sm:grid-cols-5 md:grid-cols-9 md:p-6">

                    {ACCENT_COLORS.map(
                        (color) => (
                            <ColorCard
                                key={color.id}
                                color={color}
                                selected={
                                    theme.accent ===
                                    color.id
                                }
                                onClick={() =>
                                    handleColorChange(
                                        color.id
                                    )
                                }
                            />
                        )
                    )}

                </div>

            </section>


            {/* ==================================================
                LIVE PREVIEW
            ================================================== */}

            <section className="rounded-2xl border border-border bg-card shadow-sm">

                <div className="border-b border-border p-5 md:p-6">

                    <h4 className="text-sm font-bold text-foreground">
                        Live Preview
                    </h4>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Your selected appearance is applied immediately.
                    </p>

                </div>

                <div className="p-5 md:p-6">

                    <div className="rounded-2xl border border-border bg-muted/30 p-5">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p className="text-sm font-bold text-foreground">
                                    AI-PMS Preview
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">

                                    {selectedColor.name}
                                    {" "}accent ·{" "}

                                    {theme.mode ===
                                    "system"
                                        ? "System"
                                        : theme.mode ===
                                            "dark"
                                            ? "Dark"
                                            : "Light"}

                                </p>

                            </div>

                            <button
                                type="button"
                                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
                            >
                                Primary Action
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                RESET
            ================================================== */}

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-foreground">
                        Reset appearance
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Restore the default AI-PMS theme.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                    Reset to Default
                </button>

            </div>

        </div>
    );
}

export default ThemePreferences;