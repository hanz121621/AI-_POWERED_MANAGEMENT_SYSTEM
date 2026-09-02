import { useState } from "react";
import {
    Languages,
    Globe2,
    Check,
    Save,
} from "lucide-react";

const STORAGE_KEY = "aipms_teamleader_language";

const LANGUAGES = [
    {
        value: "en",
        label: "English",
        nativeLabel: "English",
        description: "Use AI-PMS in English.",
    },
    {
        value: "am",
        label: "Amharic",
        nativeLabel: "አማርኛ",
        description: "Use AI-PMS in Amharic.",
    },
];

function getInitialLanguage() {
    return localStorage.getItem(STORAGE_KEY) || "en";
}

export default function LanguagePreferences() {
    const [language, setLanguage] = useState(getInitialLanguage);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, language);

        // Keep the application's existing global language key synchronized.
        localStorage.setItem("aipms_system_language", language);

        setSaved(true);

        window.dispatchEvent(
            new CustomEvent("aipms-language-change", {
                detail: { language },
            })
        );

        window.setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                    <Languages className="mt-0.5 h-5 w-5 text-blue-600" />

                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">
                            Language preferences
                        </h3>

                        <p className="mt-1 text-sm text-blue-700">
                            Select the language you prefer to use throughout
                            the AI-PMS interface.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-3 flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-slate-500" />

                    <h3 className="text-sm font-semibold text-slate-900">
                        Available languages
                    </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {LANGUAGES.map((item) => {
                        const selected = language === item.value;

                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                    setLanguage(item.value);
                                    setSaved(false);
                                }}
                                className={`relative rounded-xl border p-5 text-left transition ${
                                    selected
                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {selected && (
                                    <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                )}

                                <p className="text-base font-semibold text-slate-900">
                                    {item.nativeLabel}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {item.label}
                                </p>

                                <p className="mt-3 text-xs text-slate-400">
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
                            Language preference updated successfully.
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Save className="h-4 w-4" />
                    Save Language
                </button>
            </div>
        </div>
    );
}