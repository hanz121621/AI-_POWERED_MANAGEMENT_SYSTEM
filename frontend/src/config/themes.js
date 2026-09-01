// ============================================================
// AIPMS THEME CONFIGURATION
//
// SET-003 — Change Theme Preferences
//
// Central configuration for Manager theme preferences.
// Theme options must not be hard-coded throughout the app.
// ============================================================

// ============================================================
// APPEARANCE THEMES
// ============================================================

export const THEMES = [
    {
        id: "light",
        name: "Light",
        description: "Use the light application theme.",
    },
    {
        id: "dark",
        name: "Dark",
        description: "Use the dark application theme.",
    },
    {
        id: "system",
        name: "System",
        description:
            "Follow your operating system preference.",
    },
];

// ============================================================
// DEFAULT APPEARANCE
// ============================================================

export const DEFAULT_THEME = "light";

// ============================================================
// ACCENT COLORS
// ============================================================

export const ACCENT_COLORS = [
    {
        id: "blue",
        name: "Blue",
        className: "blue",
    },
    {
        id: "indigo",
        name: "Indigo",
        className: "indigo",
    },
    {
        id: "purple",
        name: "Purple",
        className: "purple",
    },
    {
        id: "green",
        name: "Green",
        className: "green",
    },
    {
        id: "emerald",
        name: "Emerald",
        className: "emerald",
    },
    {
        id: "orange",
        name: "Orange",
        className: "orange",
    },
    {
        id: "red",
        name: "Red",
        className: "red",
    },
    {
        id: "pink",
        name: "Pink",
        className: "pink",
    },
    {
        id: "cyan",
        name: "Cyan",
        className: "cyan",
    },
];

// ============================================================
// DEFAULT ACCENT COLOR
// ============================================================

export const DEFAULT_ACCENT_COLOR = "blue";

// ============================================================
// VALIDATE THEME
// ============================================================

export const isSupportedTheme = (themeId) => {
    return THEMES.some(
        (theme) => theme.id === themeId
    );
};

// ============================================================
// GET THEME BY ID
// ============================================================

export const getThemeById = (themeId) => {
    return (
        THEMES.find(
            (theme) => theme.id === themeId
        ) || null
    );
};

// ============================================================
// VALIDATE ACCENT COLOR
// ============================================================

export const isSupportedAccentColor = (accentId) => {
    return ACCENT_COLORS.some(
        (accent) => accent.id === accentId
    );
};

// ============================================================
// GET ACCENT COLOR BY ID
// ============================================================

export const getAccentColorById = (accentId) => {
    return (
        ACCENT_COLORS.find(
            (accent) => accent.id === accentId
        ) || null
    );
};

// ============================================================
// GET DEFAULT THEME
// ============================================================

export const getDefaultTheme = () => {
    return (
        getThemeById(DEFAULT_THEME) ||
        THEMES[0] ||
        null
    );
};

// ============================================================
// GET DEFAULT ACCENT COLOR
// ============================================================

export const getDefaultAccentColor = () => {
    return (
        getAccentColorById(DEFAULT_ACCENT_COLOR) ||
        ACCENT_COLORS[0] ||
        null
    );
};

// ============================================================
// DEFAULT THEME PREFERENCE
// ============================================================

export const DEFAULT_THEME_PREFERENCE = {
    theme: DEFAULT_THEME,
    accentColor: DEFAULT_ACCENT_COLOR,
};

// ============================================================
// EXPORT
// ============================================================

export default THEMES;