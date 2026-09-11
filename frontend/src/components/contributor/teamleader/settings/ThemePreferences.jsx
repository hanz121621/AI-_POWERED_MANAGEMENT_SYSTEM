
import { useEffect, useState } from "react";
import {
    Check,
    Monitor,
    Moon,
    Save,
    Sun,
} from "lucide-react";
import api from "@/services/api";

const STORAGE_KEY = "aipms_teamleader_theme";

const THEMES = [
    {
        id: "light",
        name: "Light Mode",
        description: "Use a clean and bright interface.",
        icon: Sun,
    },
    {
        id: "dark",
        name: "Dark Mode",
        description: "Use a darker interface for reduced eye strain.",
        icon: Moon,
    },
    {
        id: "system",
        name: "System Default",
        description: "Follow your device's appearance setting.",
        icon: Monitor,
    },
];

const normalizeTheme = (value) => {
    const theme = String(value || "").trim().toLowerCase();

    if (theme === "dark") return "dark";
    if (theme === "system" || theme === "system default") return "system";

    return "light";
};

const getStoredTheme = () => {
    return normalizeTheme(localStorage.getItem(STORAGE_KEY));
};

const applyTheme = (theme) => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.add(prefersDark ? "dark" : "light");
        return;
    }

    root.classList.add(theme);
};

const extractPreferences = (response) => {
    const source =
        response?.data?.data ??
        response?.data?.Data ??
        response?.data ??
        response;

    return source || {};
};

export default function ThemePreferences() {
    const [theme, setTheme] = useState(getStoredTheme);
    const [savedTheme, setSavedTheme] = useState(getStoredTheme);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadPreferences = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/user-preferences");
                const preferences = extractPreferences(response);

                const backendTheme = normalizeTheme(
                    preferences?.themePreference ??
                    preferences?.ThemePreference
                );

                if (!mounted) return;

                setTheme(backendTheme);
                setSavedTheme(backendTheme);

                localStorage.setItem(
                    STORAGE_KEY,
                    backendTheme
                );

                localStorage.setItem(
                    "aipms_theme",
                    backendTheme
                );

                applyTheme(backendTheme);
            } catch (err) {
                if (!mounted) return;

                const cachedTheme = getStoredTheme();

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

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        setSuccess(false);
        setError("");

        applyTheme(selectedTheme);
    };

    const handleCancel = () => {
        setTheme(savedTheme);
        setSuccess(false);
        setError("");

        applyTheme(savedTheme);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setSuccess(false);
            setError("");

            const response = await api.get("/user-preferences");

            const currentPreferences = extractPreferences(response);

            const payload = {
                languagePreference:
                    currentPreferences?.languagePreference ??
                    currentPreferences?.LanguagePreference ??
                    null,

                themePreference: theme,

                customThemeId:
                    currentPreferences?.customThemeId ??
                    currentPreferences?.CustomThemeId ??
                    null,
            };

            await api.put("/user-preferences", payload);

            setSavedTheme(theme);

            localStorage.setItem(
                STORAGE_KEY,
                theme
            );

            localStorage.setItem(
                "aipms_theme",
                theme
            );

            applyTheme(theme);

            window.dispatchEvent(
                new CustomEvent("aipms-theme-change", {
                    detail: {
                        theme,
                    },
                })
            );

            setSuccess(true);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Failed to save your theme preference."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-foreground">
                    Theme Preferences
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Choose how the AI-PMS interface should appear.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600">
                    <Check className="h-4 w-4" />
                    Theme preference updated successfully.
                </div>
            )}

            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-base font-semibold text-foreground">
                        Appearance
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Select your preferred application theme.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        {THEMES.map((item) => {
                            const Icon = item.icon;
                            const selected = theme === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        handleThemeChange(item.id)
                                    }
                                    className={`group relative rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                        selected
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border/70 bg-background hover:border-primary/40"
                                    }`}
                                >
                                    {selected && (
                                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}

                                    <div
                                        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${
                                            selected
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <h4 className="font-semibold text-foreground">
                                        {item.name}
                                    </h4>

                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                        {item.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-border/70 pt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving || loading || theme === savedTheme}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || loading || theme === savedTheme}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />

                        {saving ? "Saving..." : "Save Theme"}
                    </button>
                </div>
            </div>
        </div>
    );
}
