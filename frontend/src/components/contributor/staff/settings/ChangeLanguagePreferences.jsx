
import React, { useEffect, useState } from "react";

import {
    ChevronDown,
    Globe,
    Loader2,
    RotateCcw,
    Save,
} from "lucide-react";

// ============================================================
// AIPMS — STAFF LANGUAGE PREFERENCES
//
// Use Case:
// SETTING-002 — Change Language Preference
//
// Staff version follows the Admin Language Preferences UI.
//
// Supported languages:
// - English
// - Amharic
//
// Persistence:
// - Current user: localStorage "user"
// - Users list: localStorage "users"
// - Global language: localStorage "language"
// - Staff language event: "languageChanged"
// ============================================================

// ============================================================
// AVAILABLE LANGUAGES
// ============================================================

const AVAILABLE_LANGUAGES = [
    {
        code: "en",
        name: "English",
        nativeName: "English",
        description:
            "Use English as the application interface language.",
        enabled: true,
    },
    {
        code: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
        description:
            "Use Amharic as the application interface language.",
        enabled: true,
    },
];

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

function getCurrentUser() {
    try {
        const rawUser =
            localStorage.getItem("user");

        if (!rawUser) {
            return null;
        }

        return JSON.parse(rawUser);
    } catch (error) {
        console.warn(
            "Unable to read current user from localStorage:",
            error
        );

        return null;
    }
}

function getUsers() {
    try {
        const rawUsers =
            localStorage.getItem("users");

        if (!rawUsers) {
            return [];
        }

        const users =
            JSON.parse(rawUsers);

        return Array.isArray(users)
            ? users
            : [];
    } catch (error) {
        console.warn(
            "Unable to read users from localStorage:",
            error
        );

        return [];
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );
    } catch (error) {
        console.warn(
            "Unable to save users to localStorage:",
            error
        );

        throw error;
    }
}

function findCurrentUser(
    currentUser,
    users
) {
    if (!currentUser) {
        return null;
    }

    return (
        users.find(
            (user) =>
                currentUser.id &&
                user.id &&
                String(user.id) ===
                    String(currentUser.id)
        ) ||
        users.find(
            (user) =>
                currentUser.userId &&
                user.userId &&
                String(user.userId) ===
                    String(currentUser.userId)
        ) ||
        users.find(
            (user) =>
                currentUser.email &&
                user.email &&
                String(user.email).toLowerCase() ===
                    String(currentUser.email).toLowerCase()
        ) ||
        null
    );
}

// ============================================================
// GET USER LANGUAGE
// ============================================================

function getUserLanguage(user) {
    if (!user) {
        return "en";
    }

    return (
        user.languagePreference ||
        user.language ||
        user.preferredLanguage ||
        "en"
    );
}

// ============================================================
// NORMALIZE LANGUAGE
// ============================================================

function normalizeLanguage(value) {
    const language =
        String(value || "")
            .trim()
            .toLowerCase();

    return AVAILABLE_LANGUAGES.some(
        (item) =>
            item.code === language &&
            item.enabled
    )
        ? language
        : "en";
}

// ============================================================
// ACTIVITY LOG
// ============================================================

function addActivityLog(
    user,
    action
) {
    try {
        const rawLogs =
            localStorage.getItem(
                "activityLogs"
            );

        const logs = rawLogs
            ? JSON.parse(rawLogs)
            : [];

        const newLog = {
            id:
                typeof crypto !== "undefined" &&
                crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now().toString(),

            userId:
                user?.id ||
                user?.userId ||
                null,

            userName:
                user?.fullName ||
                user?.FullName ||
                user?.email ||
                user?.Email ||
                "Staff",

            action,

            timestamp:
                new Date().toISOString(),
        };

        const updatedLogs = [
            newLog,
            ...(Array.isArray(logs)
                ? logs
                : []),
        ];

        localStorage.setItem(
            "activityLogs",
            JSON.stringify(updatedLogs)
        );
    } catch (error) {
        console.warn(
            "Unable to save activity log:",
            error
        );
    }
}

// ============================================================
// STAFF LANGUAGE PREFERENCES
// ============================================================

export default function ChangeLanguagePreferences({
    onCancel,
    onSuccess,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [
        currentUser,
        setCurrentUser,
    ] = useState(null);

    const [
        originalLanguage,
        setOriginalLanguage,
    ] = useState("en");

    const [
        selectedLanguage,
        setSelectedLanguage,
    ] = useState("en");

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

    // ========================================================
    // LOAD CURRENT LANGUAGE
    // ========================================================

    useEffect(() => {
        const loadLanguagePreference =
            () => {
                try {
                    setIsLoading(true);

                    setMessage({
                        type: "",
                        text: "",
                    });

                    const user =
                        getCurrentUser();

                    setCurrentUser(user);

                    const users =
                        getUsers();

                    const matchedUser =
                        findCurrentUser(
                            user,
                            users
                        );

                    const language =
                        normalizeLanguage(
                            getUserLanguage(
                                matchedUser ||
                                    user
                            )
                        );

                    setOriginalLanguage(
                        language
                    );

                    setSelectedLanguage(
                        language
                    );
                } catch (error) {
                    console.error(
                        "Failed to load Staff language preference:",
                        error
                    );

                    setMessage({
                        type: "error",
                        text:
                            "Failed to load language preference.",
                    });
                } finally {
                    setIsLoading(false);
                }
            };

        loadLanguagePreference();
    }, []);

    // ========================================================
    // LANGUAGE CHANGE
    // ========================================================

    const handleLanguageChange = (
        event
    ) => {
        const language =
            normalizeLanguage(
                event.target.value
            );

        setSelectedLanguage(
            language
        );

        setMessage({
            type: "",
            text: "",
        });
    };

    // ========================================================
    // VALIDATE LANGUAGE
    // ========================================================

    const validateLanguage =
        () => {
            const exists =
                AVAILABLE_LANGUAGES.some(
                    (item) =>
                        item.code ===
                            selectedLanguage &&
                        item.enabled
                );

            if (!exists) {
                setMessage({
                    type: "error",
                    text:
                        "Please select a supported language.",
                });

                return false;
            }

            return true;
        };

    // ========================================================
    // SAVE LANGUAGE
    // ========================================================

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

            const users =
                getUsers();

            const matchedUser =
                findCurrentUser(
                    currentUser,
                    users
                );

            let updatedUser;

            // ==================================================
            // UPDATE EXISTING STAFF USER
            // ==================================================

            if (matchedUser) {
                updatedUser = {
                    ...matchedUser,

                    languagePreference:
                        selectedLanguage,

                    preferredLanguage:
                        selectedLanguage,
                };

                const updatedUsers =
                    users.map(
                        (user) => {
                            const isSameUser =
                                (
                                    matchedUser.id &&
                                    user.id &&
                                    String(
                                        matchedUser.id
                                    ) ===
                                        String(
                                            user.id
                                        )
                                ) ||
                                (
                                    matchedUser.userId &&
                                    user.userId &&
                                    String(
                                        matchedUser.userId
                                    ) ===
                                        String(
                                            user.userId
                                        )
                                ) ||
                                (
                                    matchedUser.email &&
                                    user.email &&
                                    String(
                                        matchedUser.email
                                    ).toLowerCase() ===
                                        String(
                                            user.email
                                        ).toLowerCase()
                                );

                            return isSameUser
                                ? updatedUser
                                : user;
                        }
                    );

                saveUsers(
                    updatedUsers
                );
            } else {
                // ==================================================
                // CREATE UPDATED USER RECORD
                // ==================================================

                updatedUser = {
                    ...(currentUser || {}),

                    languagePreference:
                        selectedLanguage,

                    preferredLanguage:
                        selectedLanguage,
                };

                saveUsers([
                    ...users,
                    updatedUser,
                ]);
            }

            // ==================================================
            // UPDATE CURRENT USER
            // ==================================================

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            // ==================================================
            // GLOBAL LANGUAGE STORAGE
            // ==================================================

            localStorage.setItem(
                "language",
                selectedLanguage
            );

            // Keep the existing Staff language storage key
            // for compatibility with Staff components that
            // already depend on it.
            localStorage.setItem(
                "aipms_system_language",
                selectedLanguage
            );

            // ==================================================
            // ACTIVITY LOG
            // ==================================================

            const selectedLanguageInfo =
                AVAILABLE_LANGUAGES.find(
                    (item) =>
                        item.code ===
                        selectedLanguage
                );

            addActivityLog(
                updatedUser,
                `Changed language preference to ${
                    selectedLanguageInfo?.name ||
                    selectedLanguage
                }`
            );

            // ==================================================
            // UPDATE STATE
            // ==================================================

            setOriginalLanguage(
                selectedLanguage
            );

            setSelectedLanguage(
                selectedLanguage
            );

            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            const successMessage =
                "Language preference updated successfully.";

            setMessage({
                type: "success",
                text: successMessage,
            });

            // ==================================================
            // NOTIFY OTHER COMPONENTS
            // ==================================================

            window.dispatchEvent(
                new CustomEvent(
                    "languageChanged",
                    {
                        detail: {
                            language:
                                selectedLanguage,
                        },
                    }
                )
            );

            // ==================================================
            // PARENT CALLBACK
            // ==================================================

            if (onSuccess) {
                onSuccess(
                    updatedUser
                );
            }
        } catch (error) {
            console.error(
                "Failed to save Staff language preference:",
                error
            );

            setMessage({
                type: "error",
                text:
                    error?.message ||
                    "Failed to save language preference.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        setSelectedLanguage(
            originalLanguage
        );

        setMessage({
            type: "",
            text: "",
        });
    };

    // ========================================================
    // CANCEL
    // ========================================================

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

    // ========================================================
    // LOADING
    // ========================================================

    if (isLoading) {
        return (
            <div
                className="
                    flex
                    min-h-[220px]
                    items-center
                    justify-center
                    bg-background
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-3
                        text-muted-foreground
                    "
                >
                    <Loader2
                        className="
                            h-7
                            w-7
                            animate-spin
                        "
                    />

                    <p className="text-sm">
                        Loading language preferences...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // SELECTED LANGUAGE
    // ========================================================

    const selectedLanguageInfo =
        AVAILABLE_LANGUAGES.find(
            (item) =>
                item.code ===
                selectedLanguage
        );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                w-full
                bg-background
                text-foreground
            "
        >

            {/* =================================================
                LANGUAGE PREFERENCE
            ================================================== */}

            <section
                className="
                    rounded-xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                "
            >

                {/* =================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-start
                        gap-4
                        border-b
                        border-border
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-accent
                            text-accent-foreground
                        "
                    >
                        <Globe className="h-5 w-5" />
                    </div>

                    <div>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-card-foreground
                            "
                        >
                            Language Preference
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Choose the language used
                            throughout the application.
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

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-6
                            py-4
                        "
                    >

                        <div className="min-w-0">

                            <h3
                                className="
                                    text-sm
                                    font-medium
                                    text-foreground
                                "
                            >
                                Application Language
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                Select your preferred
                                interface language.
                            </p>

                        </div>

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
                                    className="
                                        min-w-[190px]
                                        appearance-none
                                        rounded-lg
                                        border
                                        border-input
                                        bg-background
                                        px-4
                                        py-2
                                        pr-10
                                        text-sm
                                        text-foreground
                                        outline-none
                                        transition-colors
                                        focus:ring-2
                                        focus:ring-ring
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {AVAILABLE_LANGUAGES
                                        .filter(
                                            (
                                                item
                                            ) =>
                                                item.enabled
                                        )
                                        .map(
                                            (
                                                item
                                            ) => (
                                                <option
                                                    key={
                                                        item.code
                                                    }
                                                    value={
                                                        item.code
                                                    }
                                                >
                                                    {
                                                        item.nativeName
                                                    }
                                                </option>
                                            )
                                        )}

                                </select>

                                <ChevronDown
                                    className="
                                        pointer-events-none
                                        absolute
                                        right-3
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-muted-foreground
                                    "
                                />

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        SELECTED LANGUAGE DESCRIPTION
                    ================================================== */}

                    <div
                        className="
                            mt-2
                            rounded-lg
                            border
                            border-border
                            bg-muted/40
                            px-4
                            py-3
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-muted-foreground
                            "
                        >
                            {selectedLanguageInfo?.description ||
                                "Your selected language will be used for the application interface."}
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
                            {message.text}
                        </div>
                    )}

                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-border
                            pt-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                        "
                    >

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
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-border
                                bg-card
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-foreground
                                transition-colors
                                hover:bg-accent
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
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
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-border
                                    bg-card
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-foreground
                                    transition-colors
                                    hover:bg-accent
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
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
                                isSaving
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-primary
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-primary-foreground
                                transition-opacity
                                hover:opacity-90
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {isSaving ? (
                                <Loader2
                                    className="
                                        h-4
                                        w-4
                                        animate-spin
                                    "
                                />
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

