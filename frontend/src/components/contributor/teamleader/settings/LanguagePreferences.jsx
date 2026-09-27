import { useEffect, useState } from "react";
import {
    ChevronDown,
    Globe,
    Loader2,
    RotateCcw,
    Save,
} from "lucide-react";

import api from "@/services/api";

// ============================================================
// AIPMS — TEAM LEADER LANGUAGE PREFERENCES
//
// Supported languages:
// - English
// - Amharic
//
// IMPORTANT:
// - Backend persistence is preserved.
// - Only English and Amharic are shown in the dropdown.
// - Backend remains the source of truth.
// - localStorage is used only as a cache/fallback.
// ============================================================

// ============================================================
// STORAGE KEYS
// ============================================================

const STORAGE_KEY =
    "aipms_teamleader_language";

const SYSTEM_STORAGE_KEY =
    "aipms_system_language";

// ============================================================
// SUPPORTED LANGUAGES
//
// DO NOT ADD OTHER LANGUAGES HERE.
// ============================================================

const DEFAULT_LANGUAGES = [
    {
        value: "en",
        label: "English",
        nativeLabel: "English",
        description:
            "Use English as the application interface language.",
    },
    {
        value: "am",
        label: "Amharic",
        nativeLabel: "አማርኛ",
        description:
            "Use Amharic as the application interface language.",
    },
];

// ============================================================
// NORMALIZE LANGUAGE
// ============================================================

function normalizeLanguage(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase();
}

// ============================================================
// GET SUPPORTED LANGUAGE
//
// Only "en" and "am" are accepted.
// ============================================================

function getSupportedLanguage(value) {
    const normalized =
        normalizeLanguage(value);

    return DEFAULT_LANGUAGES.some(
        (language) =>
            language.value === normalized
    )
        ? normalized
        : "";
}

// ============================================================
// EXTRACT AVAILABLE LANGUAGES
//
// The backend may return many languages.
// We intentionally keep ONLY:
// - en
// - am
// ============================================================

function extractLanguages(response) {
    const data =
        response?.data?.data ??
        response?.data?.Data ??
        response?.data?.languages ??
        response?.data?.Languages ??
        response?.data ??
        response;

    if (!Array.isArray(data)) {
        return DEFAULT_LANGUAGES;
    }

    const backendLanguages = data
        .map((item) => {
            // ------------------------------------------------
            // Backend returns a string
            // ------------------------------------------------

            if (typeof item === "string") {
                const value =
                    normalizeLanguage(item);

                const known =
                    DEFAULT_LANGUAGES.find(
                        (language) =>
                            language.value ===
                            value
                    );

                return known || null;
            }

            // ------------------------------------------------
            // Backend returns an object
            // ------------------------------------------------

            const value =
                normalizeLanguage(
                    item?.value ??
                        item?.Value ??
                        item?.code ??
                        item?.Code ??
                        item?.languageCode ??
                        item?.LanguageCode ??
                        item?.language ??
                        item?.Language
                );

            // ------------------------------------------------
            // IMPORTANT:
            // Ignore everything except en/am.
            // ------------------------------------------------

            if (
                value !== "en" &&
                value !== "am"
            ) {
                return null;
            }

            const known =
                DEFAULT_LANGUAGES.find(
                    (language) =>
                        language.value ===
                        value
                );

            if (!known) {
                return null;
            }

            return {
                ...known,

                label:
                    item?.label ??
                    item?.Label ??
                    item?.name ??
                    item?.Name ??
                    known.label,

                nativeLabel:
                    item?.nativeLabel ??
                    item?.NativeLabel ??
                    item?.nativeName ??
                    item?.NativeName ??
                    known.nativeLabel,

                description:
                    item?.description ??
                    item?.Description ??
                    known.description,
            };
        })
        .filter(Boolean);

    // --------------------------------------------------------
    // Make sure both English and Amharic are available.
    //
    // Even if backend returns only one of them,
    // the UI will still show both.
    // --------------------------------------------------------

    const result = [];

    DEFAULT_LANGUAGES.forEach(
        (defaultLanguage) => {
            const backendLanguage =
                backendLanguages.find(
                    (language) =>
                        language.value ===
                        defaultLanguage.value
                );

            result.push(
                backendLanguage ||
                    defaultLanguage
            );
        }
    );

    return result;
}

// ============================================================
// EXTRACT PREFERENCE
// ============================================================

function extractPreference(response) {
    return (
        response?.data?.data ??
        response?.data?.Data ??
        response?.data?.preference ??
        response?.data?.Preference ??
        response?.data ??
        response
    );
}

// ============================================================
// EXTRACT LANGUAGE FROM PREFERENCE
// ============================================================

function extractLanguage(preference) {
    if (!preference) {
        return "";
    }

    return normalizeLanguage(
        preference?.language ??
            preference?.Language ??
            preference?.preferredLanguage ??
            preference?.PreferredLanguage ??
            preference?.languageCode ??
            preference?.LanguageCode ??
            preference?.locale ??
            preference?.Locale
    );
}

// ============================================================
// LOCAL STORAGE
//
// Backend is still the source of truth.
// LocalStorage is only cache/fallback.
// ============================================================

function getCachedLanguage() {
    try {
        const systemLanguage =
            getSupportedLanguage(
                localStorage.getItem(
                    SYSTEM_STORAGE_KEY
                )
            );

        const teamLeaderLanguage =
            getSupportedLanguage(
                localStorage.getItem(
                    STORAGE_KEY
                )
            );

        return (
            systemLanguage ||
            teamLeaderLanguage ||
            "en"
        );
    } catch {
        return "en";
    }
}

// ============================================================
// SAVE CACHED LANGUAGE
// ============================================================

function saveCachedLanguage(
    language
) {
    const supportedLanguage =
        getSupportedLanguage(language);

    if (!supportedLanguage) {
        return;
    }

    try {
        localStorage.setItem(
            STORAGE_KEY,
            supportedLanguage
        );

        localStorage.setItem(
            SYSTEM_STORAGE_KEY,
            supportedLanguage
        );
    } catch {
        // Ignore localStorage errors.
    }
}

// ============================================================
// ERROR MESSAGE
// ============================================================

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.response?.data?.error ||
        error?.response?.data?.Error ||
        "Unable to update language preference. Please try again."
    );
}

// ============================================================
// TEAM LEADER LANGUAGE PREFERENCES
// ============================================================

export default function LanguagePreferences({
    onCancel,
    onSuccess,
}) {
    // ----------------------------------------------------------
    // INITIAL CACHED LANGUAGE
    // ----------------------------------------------------------

    const cachedLanguage =
        getCachedLanguage();

    // ----------------------------------------------------------
    // STATE
    // ----------------------------------------------------------

    const [
        languages,
        setLanguages,
    ] = useState(
        DEFAULT_LANGUAGES
    );

    const [
        originalLanguage,
        setOriginalLanguage,
    ] = useState(
        cachedLanguage
    );

    const [
        selectedLanguage,
        setSelectedLanguage,
    ] = useState(
        cachedLanguage
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        message,
        setMessage,
    ] = useState({
        type: "",
        text: "",
    });

    // ==========================================================
    // LOAD LANGUAGE PREFERENCES
    // ==========================================================

    useEffect(() => {
        let mounted = true;

        const loadPreferences =
            async () => {
                try {
                    setIsLoading(true);

                    setMessage({
                        type: "",
                        text: "",
                    });

                    // ------------------------------------------------
                    // LOAD BACKEND DATA
                    // ------------------------------------------------

                    const [
                        languagesResponse,
                        preferenceResponse,
                    ] = await Promise.all([
                        api.get(
                            "/user-preferences/languages"
                        ),

                        api.get(
                            "/user-preferences"
                        ),
                    ]);

                    if (!mounted) {
                        return;
                    }

                    // ------------------------------------------------
                    // ONLY ENGLISH + AMHARIC
                    // ------------------------------------------------

                    const availableLanguages =
                        extractLanguages(
                            languagesResponse
                        );

                    setLanguages(
                        availableLanguages
                    );

                    // ------------------------------------------------
                    // GET USER PREFERENCE
                    // ------------------------------------------------

                    const preference =
                        extractPreference(
                            preferenceResponse
                        );

                    const backendLanguage =
                        extractLanguage(
                            preference
                        );

                    // ------------------------------------------------
                    // BACKEND LANGUAGE
                    //
                    // Only accept en/am.
                    // ------------------------------------------------

                    const supportedBackendLanguage =
                        getSupportedLanguage(
                            backendLanguage
                        );

                    // ------------------------------------------------
                    // CACHED LANGUAGE
                    // ------------------------------------------------

                    const cached =
                        getCachedLanguage();

                    const supportedCachedLanguage =
                        getSupportedLanguage(
                            cached
                        );

                    // ------------------------------------------------
                    // RESOLVE LANGUAGE
                    //
                    // Priority:
                    // 1. Backend
                    // 2. Cache
                    // 3. English
                    // ------------------------------------------------

                    const resolvedLanguage =
                        supportedBackendLanguage ||
                        supportedCachedLanguage ||
                        "en";

                    setOriginalLanguage(
                        resolvedLanguage
                    );

                    setSelectedLanguage(
                        resolvedLanguage
                    );

                    saveCachedLanguage(
                        resolvedLanguage
                    );
                } catch (error) {
                    if (!mounted) {
                        return;
                    }

                    console.error(
                        "Failed to load language preference:",
                        error
                    );

                    setMessage({
                        type: "error",
                        text: getErrorMessage(
                            error
                        ),
                    });

                    // ------------------------------------------------
                    // FALLBACK
                    // ------------------------------------------------

                    const fallbackLanguage =
                        getSupportedLanguage(
                            cachedLanguage
                        ) || "en";

                    setOriginalLanguage(
                        fallbackLanguage
                    );

                    setSelectedLanguage(
                        fallbackLanguage

                    );
                } finally {
                    if (mounted) {
                        setIsLoading(
                            false
                        );
                    }
                }
            };

        loadPreferences();

        return () => {
            mounted = false;
        };
    }, []);

    // ==========================================================
    // LANGUAGE CHANGE
    // ==========================================================

    const handleLanguageChange =
        (event) => {
            const language =
                getSupportedLanguage(
                    event.target.value
                );

            // ------------------------------------------------
            // Only English and Amharic allowed.
            // ------------------------------------------------

            if (!language) {
                setMessage({
                    type: "error",
                    text:
                        "Please select English or Amharic.",
                });

                return;
            }

            setSelectedLanguage(
                language
            );

            setMessage({
                type: "",
                text: "",
            });
        };

    // ==========================================================
    // VALIDATE LANGUAGE
    // ==========================================================

    const validateLanguage = () => {
        const validLanguage =
            getSupportedLanguage(
                selectedLanguage
            );

        if (!validLanguage) {
            setMessage({
                type: "error",
                text:
                    "Please select English or Amharic.",
            });

            return false;
        }

        return true;
    };

    // ==========================================================
    // SAVE LANGUAGE
    // ==========================================================

    const handleSave = async () => {
        if (!validateLanguage()) {
            return;
        }

        try {
            setIsSaving(true);

            setMessage({
                type: "",
                text: "",
            });

            // ------------------------------------------------
            // SAVE TO BACKEND
            // ------------------------------------------------

            const response =
                await api.put(
                    "/user-preferences",
                    {
                        language:
                            selectedLanguage,
                    }
                );

            // ------------------------------------------------
            // READ BACKEND RESPONSE
            // ------------------------------------------------

            const updatedPreference =
                extractPreference(
                    response
                );

            const returnedLanguage =
                extractLanguage(
                    updatedPreference
                );

            // ------------------------------------------------
            // Only accept English / Amharic
            // ------------------------------------------------

            const validReturnedLanguage =
                getSupportedLanguage(
                    returnedLanguage
                );

            const finalLanguage =
                validReturnedLanguage ||
                selectedLanguage;

            // ------------------------------------------------
            // CACHE
            // ------------------------------------------------

            saveCachedLanguage(
                finalLanguage
            );

            // ------------------------------------------------
            // UPDATE STATE
            // ------------------------------------------------

            setOriginalLanguage(
                finalLanguage
            );

            setSelectedLanguage(
                finalLanguage
            );

            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            setMessage({
                type: "success",
                text:
                    "Language preference updated successfully.",
            });

            // ------------------------------------------------
            // GLOBAL LANGUAGE EVENT
            // ------------------------------------------------

            window.dispatchEvent(
                new CustomEvent(
                    "aipms-language-change",
                    {
                        detail: {
                            language:
                                finalLanguage,
                        },
                    }
                )
            );

            // ------------------------------------------------
            // GLOBAL LANGUAGE CHANGED EVENT
            // ------------------------------------------------

            window.dispatchEvent(
                new CustomEvent(
                    "aipms-language-changed",
                    {
                        detail: {
                            language:
                                finalLanguage,
                        },
                    }
                )
            );

            // ------------------------------------------------
            // ADMIN COMPATIBILITY EVENT
            // ------------------------------------------------

            window.dispatchEvent(
                new CustomEvent(
                    "languageChanged",
                    {
                        detail: {
                            language:
                                finalLanguage,
                        },
                    }
                )
            );

            // ------------------------------------------------
            // PARENT CALLBACK
            // ------------------------------------------------

            if (onSuccess) {
                onSuccess({
                    language:
                        finalLanguage,
                });
            }
        } catch (error) {
            console.error(
                "Failed to save language preference:",
                error
            );

            setMessage({
                type: "error",
                text: getErrorMessage(
                    error
                ),
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ==========================================================
    // RESET
    // ==========================================================

    const handleReset = () => {
        setSelectedLanguage(
            originalLanguage
        );

        setMessage({
            type: "",
            text: "",
        });
    };

    // ==========================================================
    // CANCEL
    // ==========================================================

    const handleCancel = () => {
        setSelectedLanguage(
            originalLanguage
        );

        setMessage({
            type: "",
            text: "",
        });

        if (onCancel) {
            onCancel();
        }
    };

    // ==========================================================
    // SELECTED LANGUAGE INFORMATION
    // ==========================================================

    const selectedLanguageInfo =
        DEFAULT_LANGUAGES.find(
            (item) =>
                item.value ===
                selectedLanguage
        ) ||
        DEFAULT_LANGUAGES[0];

    // ==========================================================
    // LOADING
    // ==========================================================

    if (isLoading) {
        return (
            <div className="flex min-h-[220px] items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-7 w-7 animate-spin" />

                    <p className="text-sm">
                        Loading language preferences...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <div className="w-full bg-background text-foreground">

            {/* =================================================
                LANGUAGE SECTION
            ================================================== */}

            <section className="rounded-xl border border-border bg-card shadow-sm">

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="flex items-start gap-4 border-b border-border p-6">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Globe className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-card-foreground">
                            Language Preference
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Choose the language used throughout the application.
                        </p>
                    </div>

                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="p-6">

                    {/* =================================================
                        LANGUAGE ROW
                    ================================================== */}

                    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="min-w-0">

                            <h3 className="text-sm font-medium text-foreground">
                                Application Language
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Select your preferred interface language.
                            </p>

                        </div>

                        {/* =================================================
                            DROPDOWN
                        ================================================== */}

                        <div className="shrink-0">

                            <div className="relative">

                                <select
                                    value={
                                        selectedLanguage
                                    }
                                    onChange={
                                        handleLanguageChange
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    className={[
                                        "min-w-[190px]",
                                        "appearance-none",
                                        "rounded-lg",
                                        "border",
                                        "border-input",
                                        "bg-background",
                                        "px-4",
                                        "py-2",
                                        "pr-10",
                                        "text-sm",
                                        "text-foreground",
                                        "outline-none",
                                        "transition-colors",
                                        "focus:ring-2",
                                        "focus:ring-ring",
                                        "disabled:cursor-not-allowed",
                                        "disabled:opacity-60",
                                    ].join(" ")}
                                >

                                    {/* ONLY TWO OPTIONS */}

                                    <option value="en">
                                        English
                                    </option>

                                    <option value="am">
                                        አማርኛ
                                    </option>

                                </select>

                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <div className="mt-2 rounded-lg border border-border bg-muted/40 px-4 py-3">

                        <p className="text-sm text-muted-foreground">
                            {
                                selectedLanguageInfo.description
                            }
                        </p>

                    </div>

                    {/* =================================================
                        MESSAGE
                    ================================================== */}

                    {message.text && (
                        <div
                            className={[
                                "mt-4 rounded-lg border px-4 py-3 text-sm",

                                message.type ===
                                    "success"
                                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                                    : "border-destructive/30 bg-destructive/10 text-destructive",
                            ].join(" ")}
                        >
                            {
                                message.text
                            }
                        </div>
                    )}

                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">

                        {/* RESET */}

                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            disabled={
                                isSaving ||
                                selectedLanguage ===
                                    originalLanguage
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RotateCcw className="h-4 w-4" />

                            Reset
                        </button>

                        {/* CANCEL */}

                        {onCancel && (
                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                disabled={
                                    isSaving
                                }
                                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}

                        {/* SAVE */}

                        <button
                            type="button"
                            onClick={
                                handleSave
                            }
                            disabled={
                                isSaving ||
                                selectedLanguage ===
                                    originalLanguage
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}

                            {isSaving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
}