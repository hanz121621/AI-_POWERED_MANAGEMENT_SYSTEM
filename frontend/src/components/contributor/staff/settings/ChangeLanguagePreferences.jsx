
import { useState } from "react";
import {
    Languages,
    Check,
    Save,
    RotateCcw,
    Globe2,
    Info,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const LANGUAGE_STORAGE_KEY = "aipms_system_language";

// ============================================================
// AVAILABLE LANGUAGES
// ============================================================

const LANGUAGES = [
    {
        code: "en",
        name: "English",
        nativeName: "English",
        description: "Use English throughout the system.",
    },
    {
        code: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
        description: "በስርዓቱ ውስጥ የአማርኛ ቋንቋን ይጠቀሙ።",
    },
];

// ============================================================
// GET INITIAL LANGUAGE
// ============================================================

function getInitialLanguage() {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === "am" || storedLanguage === "en") {
        return storedLanguage;
    }

    return "en";
}

// ============================================================
// LANGUAGE CARD
// ============================================================

function LanguageCard({
    language,
    selected,
    onSelect,
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(language.code)}
            className={`w-full rounded-xl border p-5 text-left transition ${
                selected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/60"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            selected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-slate-400"
                        }`}
                    >
                        <Languages size={22} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">
                            {language.name}
                        </h3>

                        <p className="mt-1 text-lg font-medium text-blue-300">
                            {language.nativeName}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            {language.description}
                        </p>
                    </div>
                </div>

                <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        selected
                            ? "border-blue-500 bg-blue-600 text-white"
                            : "border-slate-600 text-transparent"
                    }`}
                >
                    <Check size={15} />
                </div>
            </div>
        </button>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ChangeLanguagePreferences() {
    const [selectedLanguage, setSelectedLanguage] =
        useState(getInitialLanguage);

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // ========================================================
    // HANDLE LANGUAGE SELECTION
    // ========================================================

    const handleSelectLanguage = (languageCode) => {
        setSelectedLanguage(languageCode);
        setSaved(false);
        setError("");
    };

    // ========================================================
    // SAVE LANGUAGE
    // ========================================================

    const handleSave = () => {
        try {
            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                selectedLanguage
            );

            // Notify other components that the language changed.
            window.dispatchEvent(
                new CustomEvent("languageChanged", {
                    detail: {
                        language: selectedLanguage,
                    },
                })
            );

            setSaved(true);
            setError("");
        } catch (err) {
            console.error("Failed to save language preference:", err);
            setError(
                "Unable to save the language preference. Please try again."
            );
            setSaved(false);
        }
    };

    // ========================================================
    // RESET LANGUAGE
    // ========================================================

    const handleReset = () => {
        setSelectedLanguage("en");
        setSaved(false);
        setError("");
    };

    // ========================================================
    // CURRENT LANGUAGE
    // ========================================================

    const currentLanguage =
        LANGUAGES.find(
            (language) => language.code === selectedLanguage
        ) || LANGUAGES[0];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                        <Languages size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Language Preferences
                        </h2>

                        <p className="text-sm text-slate-400">
                            Choose the language used throughout the system.
                        </p>
                    </div>
                </div>
            </div>

            {/* Information */}
            <div className="flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                    <p className="font-medium text-blue-300">
                        Current language:{" "}
                        {currentLanguage.nativeName}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                        Select a language below and click Save Changes
                        to apply your preference.
                    </p>
                </div>
            </div>

            {/* Language Options */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Globe2
                        size={18}
                        className="text-slate-400"
                    />

                    <h3 className="font-semibold text-white">
                        Available Languages
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {LANGUAGES.map((language) => (
                        <LanguageCard
                            key={language.code}
                            language={language}
                            selected={
                                selectedLanguage === language.code
                            }
                            onSelect={handleSelectLanguage}
                        />
                    ))}
                </div>
            </div>

            {/* Amharic Preview */}
            {selectedLanguage === "am" && (
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
                    <p className="mb-3 text-sm font-medium text-slate-300">
                        Amharic Preview
                    </p>

                    <div className="space-y-2 text-sm text-slate-400">
                        <p>
                            <span className="text-white">
                                የሰራተኛ መገለጫ:
                            </span>{" "}
                            የግል መረጃዎን ይመልከቱ እና ያስተካክሉ።
                        </p>

                        <p>
                            <span className="text-white">
                                የተመደቡ ስራዎች:
                            </span>{" "}
                            የተመደቡልዎትን ስራዎች ይመልከቱ።
                        </p>

                        <p>
                            <span className="text-white">
                                ማሳወቂያዎች:
                            </span>{" "}
                            አዲስ መልዕክቶችን እና የስራ ማሳወቂያዎችን ይመልከቱ።
                        </p>
                    </div>
                </div>
            )}

            {/* Messages */}
            {saved && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    Language preference saved successfully.
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-slate-700 pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                >
                    <RotateCcw size={17} />
                    Reset
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                    <Save size={17} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default ChangeLanguagePreferences;
