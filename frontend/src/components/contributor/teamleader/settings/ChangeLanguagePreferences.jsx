
import { useState } from "react";
import {
    Languages,
    CheckCircle2,
    AlertCircle,
    Save,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const LANGUAGE_STORAGE_KEY = "aipms_system_language";

const SUPPORTED_LANGUAGES = [
    {
        value: "en",
        label: "English",
        nativeLabel: "English",
    },
    {
        value: "am",
        label: "Amharic",
        nativeLabel: "አማርኛ",
    },
];

// ============================================================
// GET INITIAL LANGUAGE
// ============================================================

function getInitialLanguage() {
    try {
        const storedLanguage = localStorage.getItem(
            LANGUAGE_STORAGE_KEY
        );

        const isValidLanguage = SUPPORTED_LANGUAGES.some(
            (language) => language.value === storedLanguage
        );

        return isValidLanguage ? storedLanguage : "en";
    } catch {
        return "en";
    }
}

// ============================================================
// CHANGE LANGUAGE PREFERENCES
// ============================================================

function ChangeLanguagePreferences() {
    const [language, setLanguage] = useState(getInitialLanguage);
    const [savedLanguage, setSavedLanguage] = useState(getInitialLanguage);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ========================================================
    // SAVE LANGUAGE
    // ========================================================

    const handleSave = () => {
        setMessage("");
        setError("");

        try {
            const selectedLanguage = SUPPORTED_LANGUAGES.find(
                (item) => item.value === language
            );

            if (!selectedLanguage) {
                setError("Please select a valid language.");
                return;
            }

            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                selectedLanguage.value
            );

            setSavedLanguage(selectedLanguage.value);

            setMessage(
                `Language changed to ${selectedLanguage.nativeLabel}.`
            );

            // Notify the rest of the application that the language changed.
            window.dispatchEvent(
                new CustomEvent("aipms-language-changed", {
                    detail: {
                        language: selectedLanguage.value,
                    },
                })
            );
        } catch {
            setError(
                "Unable to save language preference. Please try again."
            );
        }
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        setLanguage(savedLanguage);
        setMessage("");
        setError("");
    };

    // ========================================================
    // LANGUAGE CHANGE
    // ========================================================

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        setMessage("");
        setError("");
    };

    // ========================================================
    // CURRENT LANGUAGE
    // ========================================================

    const currentLanguage =
        SUPPORTED_LANGUAGES.find(
            (item) => item.value === savedLanguage
        ) || SUPPORTED_LANGUAGES[0];

    const hasChanges = language !== savedLanguage;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="w-full">
            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    dark:border-blue-900/60
                    dark:bg-[#0b2038]
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-start
                        gap-4
                        border-b
                        border-slate-200
                        px-5
                        py-5
                        dark:border-blue-900/60
                    "
                >
                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            dark:bg-blue-950/50
                            dark:text-blue-400
                        "
                    >
                        <Languages className="h-5 w-5" />
                    </div>

                    <div>
                        <h2
                            className="
                                text-base
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Language Preferences
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Choose the language used throughout the
                            AI-PMS system.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    BODY
                ================================================== */}

                <div className="space-y-6 p-5">
                    {/* ==================================================
                        CURRENT LANGUAGE
                    ================================================== */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-200
                            bg-blue-50
                            p-4
                            dark:border-blue-900/60
                            dark:bg-blue-950/25
                        "
                    >
                        <div className="flex items-center gap-3">
                            <CheckCircle2
                                className="
                                    h-5
                                    w-5
                                    shrink-0
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            />

                            <div>
                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-blue-900
                                        dark:text-blue-300
                                    "
                                >
                                    Current Language
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-bold
                                        text-blue-700
                                        dark:text-blue-400
                                    "
                                >
                                    {currentLanguage.nativeLabel}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
                        LANGUAGE SELECT
                    ================================================== */}

                    <div>
                        <label
                            htmlFor="language"
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            Select Language
                        </label>

                        <select
                            id="language"
                            value={language}
                            onChange={handleLanguageChange}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-blue-900/70
                                dark:bg-[#071a2d]
                                dark:text-white
                            "
                        >
                            {SUPPORTED_LANGUAGES.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.nativeLabel} — {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ==================================================
                        LANGUAGE OPTIONS
                    ================================================== */}

                    <div className="grid gap-3 sm:grid-cols-2">
                        {SUPPORTED_LANGUAGES.map((item) => {
                            const selected =
                                language === item.value;

                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() =>
                                        handleLanguageChange({
                                            target: {
                                                value: item.value,
                                            },
                                        })
                                    }
                                    className={`
                                        rounded-xl
                                        border
                                        p-4
                                        text-left
                                        transition-all
                                        ${
                                            selected
                                                ? `
                                                    border-blue-500
                                                    bg-blue-50
                                                    shadow-sm
                                                    dark:border-blue-600
                                                    dark:bg-blue-950/30
                                                `
                                                : `
                                                    border-slate-200
                                                    bg-white
                                                    hover:border-blue-300
                                                    hover:bg-slate-50
                                                    dark:border-blue-900/60
                                                    dark:bg-[#081b33]
                                                    dark:hover:border-blue-700
                                                    dark:hover:bg-blue-950/30
                                                `
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p
                                                className={`
                                                    text-sm
                                                    font-bold
                                                    ${
                                                        selected
                                                            ? "text-blue-700 dark:text-blue-400"
                                                            : "text-slate-900 dark:text-white"
                                                    }
                                                `}
                                            >
                                                {item.nativeLabel}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                {item.label}
                                            </p>
                                        </div>

                                        {selected && (
                                            <CheckCircle2
                                                className="
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    text-blue-600
                                                    dark:text-blue-400
                                                "
                                            />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* ==================================================
                        SUCCESS MESSAGE
                    ================================================== */}

                    {message && (
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-emerald-200
                                bg-emerald-50
                                p-4
                                dark:border-emerald-900/60
                                dark:bg-emerald-950/25
                            "
                        >
                            <CheckCircle2
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                    text-emerald-600
                                    dark:text-emerald-400
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-emerald-700
                                    dark:text-emerald-400
                                "
                            >
                                {message}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {error && (
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                p-4
                                dark:border-red-900/60
                                dark:bg-red-950/25
                            "
                        >
                            <AlertCircle
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                    text-red-600
                                    dark:text-red-400
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-red-700
                                    dark:text-red-400
                                "
                            >
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-slate-200
                            pt-5
                            sm:flex-row
                            sm:justify-end
                            dark:border-blue-900/60
                        "
                    >
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={!hasChanges}
                            className="
                                rounded-xl
                                border
                                border-slate-300
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-blue-900/70
                                dark:text-slate-300
                                dark:hover:bg-blue-950/50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Save className="h-4 w-4" />

                            Save Language
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeLanguagePreferences;
