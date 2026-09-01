// ============================================================
// AIPMS LANGUAGE CONFIGURATION
//
// SET-002 — Change Language Preferences
//
// Central configuration for all supported AIPMS languages.
// Language options must be defined here rather than separately
// inside individual pages.
// ============================================================

// ============================================================
// SUPPORTED LANGUAGES
// ============================================================

export const LANGUAGES = [
    {
        code: "en",
        name: "English",
        nativeName: "English",
        description:
            "English language interface for AI-PMS.",
    },

    {
        code: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
        description:
            "Amharic language interface for AI-PMS.",
    },
];

// ============================================================
// DEFAULT LANGUAGE
// ============================================================
//
// Used when the Manager has not selected a language yet.
//

export const DEFAULT_LANGUAGE = "en";

// ============================================================
// CHECK SUPPORTED LANGUAGE
// ============================================================
//
// Returns true only when the language exists in the
// configured LANGUAGES list.
//

export const isSupportedLanguage = (languageCode) => {
    return LANGUAGES.some(
        (language) =>
            language.code === languageCode
    );
};

// ============================================================
// GET LANGUAGE BY CODE
// ============================================================
//
// Returns the configured language object or null.
//

export const getLanguageByCode = (languageCode) => {
    return (
        LANGUAGES.find(
            (language) =>
                language.code === languageCode
        ) || null
    );
};

// ============================================================
// GET DEFAULT LANGUAGE
// ============================================================

export const getDefaultLanguage = () => {
    return (
        getLanguageByCode(DEFAULT_LANGUAGE) ||
        LANGUAGES[0] ||
        null
    );
};

// ============================================================
// EXPORT
// ============================================================

export default LANGUAGES;