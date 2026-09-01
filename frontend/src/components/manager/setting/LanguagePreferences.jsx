
import React, { useEffect, useState } from "react";
import {
    Languages,
    Save,
    CheckCircle2,
    AlertTriangle,
    Info,
} from "lucide-react";

// ============================================================
// AIPMS — MANAGER LANGUAGE PREFERENCES
//
// Use Case:
// SET-002 — Change Language Preferences
//
// Primary Actor:
// Project Manager
//
// IMPORTANT:
// - Applies only to the authenticated Manager.
// - Available languages are centralized in one configuration.
// - Unsupported languages cannot be selected.
// - Language preference does not modify project/user data.
// - Preference persists between sessions.
// ============================================================

// ============================================================
// CONFIGURED LANGUAGES
//
// In the backend version, these should come from the system's
// configured language options rather than individual pages.
// ============================================================

const AVAILABLE_LANGUAGES = [
    {
        id: "en",
        name: "English",
        nativeName: "English",
        description: "Use AIPMS in English.",
        supported: true,
    },
    {
        id: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
        description: "Use AIPMS in Amharic.",
        supported: true,
    },
];

// ============================================================
// DEFAULT LANGUAGE
// ============================================================

const DEFAULT_LANGUAGE = "en";

// ============================================================
// STORAGE KEY
//
// Temporary frontend persistence.
// Backend implementation should store this preference in the
// authenticated Manager's database profile/preferences.
// ============================================================

const STORAGE_KEY = "aipms_manager_language_preference";

// ============================================================
// COMPONENT
// ============================================================

function LanguagePreferences() {
    const [selectedLanguage, setSelectedLanguage] =
        useState(DEFAULT_LANGUAGE);

    const [saving, setSaving] = useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // LOAD CURRENT LANGUAGE
    //
    // SET-002:
    // System retrieves the Manager's current preference.
    // ========================================================

    useEffect(() => {
        const loadLanguagePreference = () => {
            try {
                const storedLanguage =
                    localStorage.getItem(STORAGE_KEY);

                if (!storedLanguage) {
                    setSelectedLanguage(
                        DEFAULT_LANGUAGE
                    );
                    return;
                }

                const languageExists =
                    AVAILABLE_LANGUAGES.some(
                        (language) =>
                            language.id === storedLanguage &&
                            language.supported
                    );

                if (!languageExists) {
                    setSelectedLanguage(
                        DEFAULT_LANGUAGE
                    );
                    return;
                }

                setSelectedLanguage(
                    storedLanguage
                );
            } catch (error) {
                console.error(
                    "Failed to load language preference:",
                    error
                );

                setErrorMessage(
                    "Unable to load your language preference."
                );
            }
        };

        loadLanguagePreference();
    }, []);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // HANDLE LANGUAGE SELECTION
    // ========================================================

    const handleLanguageChange = (languageId) => {
        clearMessages();

        const language =
            AVAILABLE_LANGUAGES.find(
                (item) =>
                    item.id === languageId
            );

        // ----------------------------------------------------
        // Unsupported language cannot be selected.
        // ----------------------------------------------------

        if (!language || !language.supported) {
            setErrorMessage(
                "The selected language is not supported."
            );
            return;
        }

        setSelectedLanguage(languageId);
    };

    // ========================================================
    // SAVE LANGUAGE
    //
    // SET-002:
    // 1. Validate selected language
    // 2. Store preference
    // 3. Update interface preference
    // 4. Display confirmation
    // ========================================================

    const handleSave = async () => {
        clearMessages();

        const language =
            AVAILABLE_LANGUAGES.find(
                (item) =>
                    item.id === selectedLanguage
            );

        // ----------------------------------------------------
        // Validate language
        // ----------------------------------------------------

        if (!language || !language.supported) {
            setErrorMessage(
                "Please select a supported language."
            );
            return;
        }

        setSaving(true);

        try {
            // ------------------------------------------------
            // Temporary frontend persistence.
            //
            // Replace with backend API later.
            // ------------------------------------------------

            localStorage.setItem(
                STORAGE_KEY,
                selectedLanguage
            );

            // ------------------------------------------------
            // Optional global event.
            //
            // Other application components can listen for this
            // event and reload translated interface labels.
            // ------------------------------------------------

            window.dispatchEvent(
                new CustomEvent(
                    "aipms-language-changed",
                    {
                        detail: {
                            language:
                                selectedLanguage,
                        },
                    }
                )
            );

            setSuccessMessage(
                `Language preference changed to ${language.name}.`
            );
        } catch (error) {
            console.error(
                "Failed to save language preference:",
                error
            );

            setErrorMessage(
                "Unable to save your language preference. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // CURRENT LANGUAGE
    // ========================================================

    const currentLanguage =
        AVAILABLE_LANGUAGES.find(
            (language) =>
                language.id === selectedLanguage
        );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">

                        <Languages
                            size={23}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            SET-002
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Change Language Preferences
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            Select the language used for your
                            AIPMS interface.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                    <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <p className="text-sm font-semibold text-emerald-700">
                        {successMessage}
                    </p>

                </div>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <AlertTriangle
                        size={19}
                        className="mt-0.5 shrink-0 text-red-600"
                    />

                    <p className="text-sm font-semibold text-red-700">
                        {errorMessage}
                    </p>

                </div>
            )}

            {/* ==================================================
                LANGUAGE OPTIONS
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                    <h3 className="font-bold text-slate-900">
                        Available Languages
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Choose your preferred language.
                    </p>

                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2">

                    {AVAILABLE_LANGUAGES.map(
                        (language) => {
                            const selected =
                                selectedLanguage ===
                                language.id;

                            return (
                                <button
                                    type="button"
                                    key={language.id}
                                    disabled={
                                        !language.supported
                                    }
                                    onClick={() =>
                                        handleLanguageChange(
                                            language.id
                                        )
                                    }
                                    className={`relative rounded-2xl border p-5 text-left transition ${
                                        selected
                                            ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                                    } ${
                                        !language.supported
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer"
                                    }`}
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-lg font-bold text-slate-900">
                                                {
                                                    language.nativeName
                                                }
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-500">
                                                {
                                                    language.name
                                                }
                                            </p>

                                        </div>

                                        <span
                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                                selected
                                                    ? "border-blue-600 bg-blue-600"
                                                    : "border-slate-300 bg-white"
                                            }`}
                                        >

                                            {selected && (
                                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                            )}

                                        </span>

                                    </div>

                                    <p className="mt-4 text-sm text-slate-500">
                                        {
                                            language.description
                                        }
                                    </p>

                                    <div className="mt-4">

                                        {language.supported ? (
                                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                                Supported
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                                                Unsupported
                                            </span>
                                        )}

                                    </div>

                                </button>
                            );
                        }
                    )}

                </div>

            </section>

            {/* ==================================================
                CURRENT SELECTION
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h3 className="font-bold text-slate-900">
                    Current Selection
                </h3>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Interface Language
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                                {currentLanguage
                                    ?.nativeName ||
                                    "English"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                {currentLanguage?.name ||
                                    "English"}
                            </p>

                        </div>

                        <Languages
                            size={28}
                            className="text-blue-500"
                        />

                    </div>

                </div>

            </section>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4">

                <Info
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm text-blue-700">
                    Changing the interface language affects only
                    your authenticated Manager experience. It does
                    not translate or modify project data, team
                    information, tasks, or other user data.
                </p>

            </div>

            {/* ==================================================
                SAVE
            ================================================== */}

            <div className="flex justify-end rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <Save size={17} />

                    {saving
                        ? "Saving..."
                        : "Save Language Preference"}

                </button>

            </div>

        </div>
    );
}

export default LanguagePreferences;

