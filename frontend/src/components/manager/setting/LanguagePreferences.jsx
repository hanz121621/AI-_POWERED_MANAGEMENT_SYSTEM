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
// - Does not use localStorage.
// - Language is controlled by LanguageContext.
// - Persistence is handled by Manager Settings backend.
// ============================================================

import React, { useEffect, useState } from "react";

import {
    Languages,
    Save,
    CheckCircle2,
    AlertTriangle,
    Info,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext.jsx";

// ============================================================
// CONFIGURED LANGUAGES
// ============================================================

const AVAILABLE_LANGUAGES = [
    {
        id: "en",
        name: "English",
        nativeName: "English",
        description:
            "Use AIPMS in English.",
        supported: true,
    },
    {
        id: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
        description:
            "Use AIPMS in Amharic.",
        supported: true,
    },
];

// ============================================================
// DEFAULT LANGUAGE
// ============================================================

const DEFAULT_LANGUAGE = "en";

// ============================================================
// COMPONENT
// ============================================================

function LanguagePreferences() {

    const {
        language,
        setLanguage,
    } = useLanguage();

    const [
        selectedLanguage,
        setSelectedLanguage,
    ] = useState(
        language || DEFAULT_LANGUAGE
    );

    const [
        savedLanguage,
        setSavedLanguage,
    ] = useState(
        language || DEFAULT_LANGUAGE
    );

    const [saving, setSaving] =
        useState(false);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    // ========================================================
    // SYNCHRONIZE WITH LANGUAGE CONTEXT
    // ========================================================

    useEffect(() => {

        const currentLanguage =
            language || DEFAULT_LANGUAGE;

        const exists =
            AVAILABLE_LANGUAGES.some(
                (item) =>
                    item.id ===
                        currentLanguage &&
                    item.supported
            );

        if (exists) {

            setSelectedLanguage(
                currentLanguage
            );

            setSavedLanguage(
                currentLanguage
            );
        }

    }, [language]);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // SELECT LANGUAGE
    // ========================================================

    const handleLanguageChange = (
        languageId
    ) => {

        clearMessages();

        const selected =
            AVAILABLE_LANGUAGES.find(
                (item) =>
                    item.id ===
                    languageId
            );

        if (
            !selected ||
            !selected.supported
        ) {

            setErrorMessage(
                "The selected language is not supported."
            );

            return;
        }

        setSelectedLanguage(
            languageId
        );

        // IMPORTANT:
        // Immediately update the entire
        // application's language context.
        setLanguage(languageId);
    };

    // ========================================================
    // SAVE LANGUAGE
    //
    // Backend persistence is handled by
    // ManagerSettings.jsx.
    // ========================================================

    const handleSave = async () => {

        clearMessages();

        const selected =
            AVAILABLE_LANGUAGES.find(
                (item) =>
                    item.id ===
                    selectedLanguage
            );

        if (
            !selected ||
            !selected.supported
        ) {

            setErrorMessage(
                "Please select a supported language."
            );

            return;
        }

        setSaving(true);

        try {

            // Apply globally.
            setLanguage(
                selectedLanguage
            );

            // No localStorage.
            // Backend persistence should be
            // performed by ManagerSettings.jsx.

            setSavedLanguage(
                selectedLanguage
            );

            setSuccessMessage(
                `Language preference changed to ${selected.name}.`
            );

        } catch (error) {

            console.error(
                "Failed to apply language preference:",
                error
            );

            setErrorMessage(
                "Unable to apply your language preference. Please try again."
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
            (item) =>
                item.id ===
                selectedLanguage
        );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">

                        <Languages
                            size={23}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            SET-002
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                            Change Language Preferences
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Select the language used for your AIPMS interface.
                        </p>

                    </div>

                </div>

            </div>

            {/* SUCCESS */}

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

            {/* ERROR */}

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

            {/* LANGUAGE OPTIONS */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">

                    <h3 className="font-bold text-slate-900 dark:text-white">
                        Available Languages
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Choose your preferred language.
                    </p>

                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2">

                    {AVAILABLE_LANGUAGES.map(
                        (item) => {

                            const selected =
                                selectedLanguage ===
                                item.id;

                            return (

                                <button
                                    type="button"
                                    key={item.id}
                                    disabled={
                                        !item.supported ||
                                        saving
                                    }
                                    onClick={() =>
                                        handleLanguageChange(
                                            item.id
                                        )
                                    }
                                    className={`relative rounded-2xl border p-5 text-left transition ${
                                        selected
                                            ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100 dark:border-blue-500 dark:bg-blue-950"
                                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                                    }`}
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                {
                                                    item.nativeName
                                                }
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {
                                                    item.name
                                                }
                                            </p>

                                        </div>

                                        <span
                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                                selected
                                                    ? "border-blue-600 bg-blue-600"
                                                    : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                                            }`}
                                        >

                                            {selected && (

                                                <span className="h-2.5 w-2.5 rounded-full bg-white" />

                                            )}

                                        </span>

                                    </div>

                                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                                        {
                                            item.description
                                        }
                                    </p>

                                    <div className="mt-4">

                                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                            Supported
                                        </span>

                                    </div>

                                </button>
                            );
                        }
                    )}

                </div>

            </section>

            {/* CURRENT SELECTION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <h3 className="font-bold text-slate-900 dark:text-white">
                    Current Selection
                </h3>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Interface Language
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                                {
                                    currentLanguage?.nativeName ||
                                    "English"
                                }
                            </p>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {
                                    currentLanguage?.name ||
                                    "English"
                                }
                            </p>

                        </div>

                        <Languages
                            size={28}
                            className="text-blue-500"
                        />

                    </div>

                </div>

            </section>

            {/* INFORMATION */}

            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 dark:border-blue-900 dark:bg-blue-950">

                <Info
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Changing the interface language affects only
                    your authenticated Manager experience. It does
                    not translate or modify project data, team
                    information, tasks, or other user data.
                </p>

            </div>

            {/* SAVE */}

            <div className="flex justify-end rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                        selectedLanguage ===
                            savedLanguage ||
                        saving
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <Save size={17} />

                    {saving
                        ? "Saving..."
                        : "Apply Language"}

                </button>

            </div>

        </div>
    );
}

export default LanguagePreferences;