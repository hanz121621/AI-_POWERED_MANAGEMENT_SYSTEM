
import { useEffect, useState } from "react";
import {
    Languages,
    Globe2,
    Check,
    Save,
} from "lucide-react";
import api from "@/services/api";

const STORAGE_KEY = "aipms_teamleader_language";
const SYSTEM_STORAGE_KEY = "aipms_system_language";

const DEFAULT_LANGUAGES = [
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

function normalizeLanguage(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim().toLowerCase();
}

function extractLanguages(response) {
    const data =
        response?.data?.data ??
        response?.data?.Data ??
        response?.data?.languages ??
        response?.data?.Languages ??
        response?.data ??
        response;

    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map((item) => {
            if (typeof item === "string") {
                const value = normalizeLanguage(item);

                const known = DEFAULT_LANGUAGES.find(
                    (language) => language.value === value
                );

                return (
                    known || {
                        value,
                        label: item,
                        nativeLabel: item,
                        description: `Use AI-PMS in ${item}.`,
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

            const known = DEFAULT_LANGUAGES.find(
                (language) => language.value === value
            );

            return {
                value,
                label:
                    item?.label ??
                    item?.Label ??
                    item?.name ??
                    item?.Name ??
                    known?.label ??
                    value,
                nativeLabel:
                    item?.nativeLabel ??
                    item?.NativeLabel ??
                    item?.nativeName ??
                    item?.NativeName ??
                    known?.nativeLabel ??
                    item?.label ??
                    item?.Label ??
                    value,
                description:
                    item?.description ??
                    item?.Description ??
                    known?.description ??
                    `Use AI-PMS in ${
                        item?.label ??
                        item?.Label ??
                        value
                    }.`,
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
        return (
            normalizeLanguage(
                localStorage.getItem(SYSTEM_STORAGE_KEY)
            ) ||
            normalizeLanguage(
                localStorage.getItem(STORAGE_KEY)
            ) ||
            "en"
        );
    } catch {
        return "en";
    }
}

function saveCachedLanguage(language) {
    try {
        localStorage.setItem(STORAGE_KEY, language);
        localStorage.setItem(SYSTEM_STORAGE_KEY, language);
    } catch {
        return;
    }
}

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.response?.data?.error ||
        error?.response?.data?.Error ||
        "Unable to update language preference. Please try again."
    );
}

export default function LanguagePreferences() {
    const cachedLanguage = getCachedLanguage();

    const [languages, setLanguages] = useState(
        DEFAULT_LANGUAGES
    );
    const [language, setLanguage] = useState(cachedLanguage);
    const [savedLanguage, setSavedLanguage] =
        useState(cachedLanguage);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadPreferences = async () => {
            setLoading(true);
            setError("");

            try {
                const [
                    languagesResponse,
                    preferenceResponse,
                ] = await Promise.all([
                    api.get("/user-preferences/languages"),
                    api.get("/user-preferences"),
                ]);

                if (!mounted) {
                    return;
                }

                const backendLanguages =
                    extractLanguages(languagesResponse);

                const availableLanguages =
                    backendLanguages.length > 0
                        ? backendLanguages
                        : DEFAULT_LANGUAGES;

                setLanguages(availableLanguages);

                const preference =
                    extractPreference(preferenceResponse);

                const backendLanguage =
                    extractLanguage(preference);

                const isBackendLanguageValid =
                    availableLanguages.some(
                        (item) =>
                            item.value === backendLanguage
                    );

                const isCachedLanguageValid =
                    availableLanguages.some(
                        (item) =>
                            item.value === cachedLanguage
                    );

                const resolvedLanguage =
                    isBackendLanguageValid
                        ? backendLanguage
                        : isCachedLanguageValid
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

                setError(getErrorMessage(requestError));

                const fallbackLanguage =
                    DEFAULT_LANGUAGES.some(
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
        setSaved(false);
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
            setSaved(true);

            window.dispatchEvent(
                new CustomEvent("aipms-language-change", {
                    detail: {
                        language: finalLanguage,
                    },
                })
            );

            window.dispatchEvent(
                new CustomEvent("aipms-language-changed", {
                    detail: {
                        language: finalLanguage,
                    },
                })
            );

            window.setTimeout(() => {
                if (mounted) {
                    setSaved(false);
                }
            }, 3000);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setSaving(false);
        }
    };

    const currentLanguage =
        languages.find(
            (item) => item.value === savedLanguage
        ) || languages[0] || DEFAULT_LANGUAGES[0];

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
                    {languages.map((item) => {
                        const selected =
                            language === item.value;

                        return (
                            <button
                                key={item.value}
                                type="button"
                                disabled={loading || saving}
                                onClick={() => {
                                    setLanguage(item.value);
                                    setSaved(false);
                                    setError("");
                                }}
                                className={`
                                    relative rounded-xl border p-5 text-left transition
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    ${
                                        selected
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                    }
                                `}
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

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <div>
                    {saved && (
                        <p className="text-sm font-medium text-emerald-600">
                            Language preference updated successfully.
                        </p>
                    )}

                    {!saved &&
                        !error &&
                        !loading &&
                        !saving &&
                        currentLanguage && (
                            <p className="text-xs text-slate-400">
                                Current language:{" "}
                                {currentLanguage.nativeLabel}
                            </p>
                        )}
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                        loading ||
                        saving ||
                        language === savedLanguage
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {saving
                        ? "Saving..."
                        : "Save Language"}
                </button>
            </div>
        </div>
    );
}
