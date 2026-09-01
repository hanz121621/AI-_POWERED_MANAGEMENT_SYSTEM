import { useState } from "react";
import {
    Palette,
    Sun,
    Moon,
    Monitor,
    Check,
    Save,
} from "lucide-react";

const STORAGE_KEY = "aipms_teamleader_theme";

const THEMES = [
    {
        value: "light",
        label: "Light Mode",
        description: "Use a bright interface.",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Dark Mode",
        description: "Use a darker interface.",
        icon: Moon,
    },
    {
        value: "system",
        label: "System Default",
        description: "Follow your device appearance.",
        icon: Monitor,
    },
];

function getInitialTheme() {
    return localStorage.getItem(STORAGE_KEY) || "system";
}

function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === "dark") {
        root.classList.add("dark");
    } else if (theme === "light") {
        root.classList.remove("dark");
    } else {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.toggle("dark", prefersDark);
    }
}

export default function ThemePreferences() {
    const [theme, setTheme] = useState(getInitialTheme);
    const [saved, setSaved] = useState(false);

    const handleSelect = (value) => {
        setTheme(value);
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, theme);

        applyTheme(theme);

        // Keep the application's general theme key synchronized.
        localStorage.setItem("aipms_theme", theme);

        setSaved(true);

        window.dispatchEvent(
            new CustomEvent("aipms-theme-change", {
                detail: { theme },
            })
        );

        window.setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">

            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex gap-3">
                    <Palette className="mt-0.5 h-5 w-5 text-purple-600" />

                    <div>
                        <h3 className="text-sm font-semibold text-purple-900">
                            Theme preferences
                        </h3>

                        <p className="mt-1 text-sm text-purple-700">
                            Customize the appearance of your AI-PMS workspace.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Choose your appearance
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                    {THEMES.map((item) => {
                        const Icon = item.icon;
                        const selected = theme === item.value;

                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => handleSelect(item.value)}
                                className={`relative rounded-xl border p-5 text-left transition ${
                                    selected
                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {selected && (
                                    <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
                                        selected
                                            ? "bg-blue-100"
                                            : "bg-slate-100"
                                    }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${
                                            selected
                                                ? "text-blue-600"
                                                : "text-slate-600"
                                        }`}
                                    />
                                </div>

                                <h4 className="text-sm font-semibold text-slate-900">
                                    {item.label}
                                </h4>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {item.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <div>
                    {saved && (
                        <p className="text-sm font-medium text-emerald-600">
                            Theme preference updated successfully.
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Save className="h-4 w-4" />
                    Save Theme
                </button>
            </div>
        </div>
    );
}