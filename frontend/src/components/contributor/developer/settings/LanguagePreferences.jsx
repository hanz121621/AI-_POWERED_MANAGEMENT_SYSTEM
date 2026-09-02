
import { useState } from "react";
import {
    Languages,
    Save,
} from "lucide-react";

const STORAGE_KEY = "aipms_system_language";

const LANGUAGES = [
    {
        value: "en",
        label: "English",
        description: "Use English throughout the AI-PMS interface.",
    },
    {
        value: "am",
        label: "አማርኛ",
        description: "Use Amharic throughout the AI-PMS interface.",
    },
];

export default function LanguagePreferences() {
    const [language, setLanguage] = useState(
        localStorage.getItem(STORAGE_KEY) || "en"
    );

    const [message, setMessage] = useState("");

    const handleSave = () => {
        if (!LANGUAGES.some((item) => item.value === language)) {
            setMessage("Selected language is not available.");
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, language);

            window.dispatchEvent(
                new CustomEvent("aipms-language-change", {
                    detail: language,
                })
            );

            setMessage(
                "Language preference updated successfully."
            );
        } catch {
            setMessage(
                "Unable to update language preference. Please try again."
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Languages size={22} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Language Preferences
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Select the language used by the AI-PMS interface.
                    </p>
                </div>
            </div>

            {message && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {message}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {LANGUAGES.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setLanguage(item.value)}
                        className={`rounded-xl border p-5 text-left transition ${
                            language === item.value
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100 dark:border-blue-400 dark:bg-blue-900/20 dark:ring-blue-900/30"
                                : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {item.label}
                                </h3>

                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    {item.description}
                                </p>
                            </div>

                            <div
                                className={`h-5 w-5 rounded-full border-2 ${
                                    language === item.value
                                        ? "border-blue-600 bg-blue-600"
                                        : "border-slate-300 dark:border-slate-600"
                                }`}
                            />
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Save size={17} />
                    Save Language
                </button>
            </div>
        </div>
    );
}
