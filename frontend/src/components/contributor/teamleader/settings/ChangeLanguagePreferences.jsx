
import { useEffect, useState } from "react";
import {
    Languages,
    CheckCircle2,
    AlertCircle,
    Save,
} from "lucide-react";
import api from "@/services/api";

const LANGUAGE_STORAGE_KEY = "aipms_system_language";

const DEFAULT_LANGUAGES = [
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

function normalizeLanguage(value) {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim().toLowerCase();
    }

    return String(value).trim().toLowerCase();
}

function normalizeLanguages(response) {
    const source =
        response?.data?.data ??
        response?.data?.Data ??
        response?.data?.languages ??
        response?.data?.Languages ??
        response?.data ??
        response;

    if (!Array.isArray(source)) {
        return [];
    }

    return source
        .map((item) => {
            if (typeof item === "string") {
                const value = normalizeLanguage(item);

                const knownLanguage = DEFAULT_LANGUAGES.find(
                    (language) => language.value === value
                );

                return (
                    knownLanguage || {
                        value,
                        label: item,
                        nativeLabel: item,
                    }
                );
            }

            const value = normalizeLanguage(
                item?.value ??
                    item?.Value ??
                    item?.code ??
                    item?.Code ??
                    item?.languageCode ??
                    item?.LanguageCode ??
                    item?.language ??
                    item?.Language
            );

            if (!value) {
                return null;
            }

            const knownLanguage = DEFAULT_LANGUAGES.find(
                (language) => language.value === value
            );

            return {
                value,
                label:
                    item?.label ??
                    item?.Label ??
                    item?.name ??
                    item?.Name ??
                    knownLanguage?.label ??
                    value,
                nativeLabel:
                    item?.nativeLabel ??
                    item?.NativeLabel ??
                    item?.nativeName ??
                    item?.NativeName ??
                    knownLanguage?.nativeLabel ??
                    item?.label ??
                    item?.Label ??
                    value,
            };
        })
        .filter(Boolean);
}

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

function getCachedLanguage() {
    try {
        return normalizeLanguage(
            localStorage.getItem(LANGUAGE_STORAGE_KEY)
        );
    } catch {
        return "";
    }
}

function saveCachedLanguage(language) {
    try {
        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            language
        );
    } catch {
        return;
    }
}

function getErrorMessage(error, fallback) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.response?.data?.error ||
        error?.response?.data?.Error ||
        fallback
    );
}

function ChangeLanguagePreferences() {
    const cachedLanguage = getCachedLanguage();

    const [languages, setLanguages] = useState(
        DEFAULT_LANGUAGES
    );
    const [language, setLanguage] = useState(
        cachedLanguage || "en"
    );
    const [savedLanguage, setSavedLanguage] = useState(
        cachedLanguage || "en"
    );
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadPreferences = async () => {
            setLoading(true);
            setError("");

            try {
                const [languagesResponse, preferenceResponse] =
                    await Promise.all([
                        api.get("/user-preferences/languages"),
                        api.get("/user-preferences"),
                    ]);

                if (!mounted) {
                    return;
                }

                const backendLanguages =
                    normalizeLanguages(languagesResponse);

                const availableLanguages =
                    backendLanguages.length > 0
                        ? backendLanguages
                        : DEFAULT_LANGUAGES;

                setLanguages(availableLanguages);

                const backendLanguage =
                    extractLanguage(
                        extractPreference(preferenceResponse)
                    );

                const validBackendLanguage =
                    availableLanguages.some(
                        (item) =>
                            item.value === backendLanguage
                    );

                const resolvedLanguage =
                    validBackendLanguage
                        ? backendLanguage
                        : availableLanguages.some(
                              (item) =>
                                  item.value === cachedLanguage
                          )
                        ? cachedLanguage
                        : availableLanguages[0]?.value ||
                          "en";

                setLanguage(resolvedLanguage);
                setSavedLanguage(resolvedLanguage);

                saveCachedLanguage(resolvedLanguage);
            } catch (requestError) {
                if (!mounted) {
                    return;
                }

                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to retrieve language preferences. Using your saved local language."
                    )
                );

                const fallbackLanguage =
                    languages.some(
                        (item) =>
                            item.value === cachedLanguage
                    )
                        ? cachedLanguage
                        : "en";

                setLanguage(fallbackLanguage);
                setSavedLanguage(fallbackLanguage);
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

    const handleSave = async () => {
        setMessage("");
        setError("");

        const selectedLanguage = languages.find(
            (item) => item.value === language
        );

        if (!selectedLanguage) {
            setError("Please select a valid language.");
            return;
        }

        setSaving(true);

        try {
            const response = await api.put(
                "/user-preferences",
                {
                    language: selectedLanguage.value,
                }
            );

            const updatedPreference =
                extractPreference(response);

            const returnedLanguage =
                extractLanguage(updatedPreference);

            const finalLanguage =
                returnedLanguage &&
                languages.some(
                    (item) =>
                        item.value === returnedLanguage
                )
                    ? returnedLanguage
                    : selectedLanguage.value;

            saveCachedLanguage(finalLanguage);

            setLanguage(finalLanguage);
            setSavedLanguage(finalLanguage);

            const finalLanguageInfo =
                languages.find(
                    (item) =>
                        item.value === finalLanguage
                ) || selectedLanguage;

            setMessage(
                `Language changed to ${finalLanguageInfo.nativeLabel}.`
            );

            window.dispatchEvent(
                new CustomEvent("aipms-language-changed", {
                    detail: {
                        language: finalLanguage,
                    },
                })
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    "Unable to save language preference. Please try again."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setLanguage(savedLanguage);
        setMessage("");
        setError("");
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        setMessage("");
        setError("");
    };

    const currentLanguage =
        languages.find(
            (item) => item.value === savedLanguage
        ) || languages[0] || DEFAULT_LANGUAGES[0];

    const hasChanges =
        language !== savedLanguage;

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

                <div className="space-y-6 p-5">
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
                            disabled={loading || saving}
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
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:border-blue-900/70
                                dark:bg-[#071a2d]
                                dark:text-white
                            "
                        >
                            {languages.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.nativeLabel} — {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {languages.map((item) => {
                            const selected =
                                language === item.value;

                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    disabled={loading || saving}
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
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
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
                            disabled={
                                !hasChanges ||
                                loading ||
                                saving
                            }
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
                            disabled={
                                !hasChanges ||
                                loading ||
                                saving
                            }
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
                            {saving
                                ? "Saving..."
                                : "Save Language"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeLanguagePreferences;
