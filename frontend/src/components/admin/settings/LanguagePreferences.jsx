import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Globe2,
    Languages,
    RotateCcw,
    Save,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// SETTING-002
// CHANGE LANGUAGE PREFERENCES
//
// Primary Actor: Admin
//
// Editable:
// - Preferred language
//
// Business Rules:
// - Only enabled/supported languages can be selected
// - Language preference is stored per user
// - Cancel keeps the previous preference
// - Changes are recorded in the audit log
// ============================================================


// ============================================================
// CONFIGURABLE LANGUAGES
//
// In the future these should come from the backend/database.
// For now they are represented as configurable system data.
// ============================================================

const AVAILABLE_LANGUAGES = [
    {
        id: "en",
        code: "en",
        name: "English",
        nativeName: "English",
        description: "Use English throughout the AI-PMS interface.",
        enabled: true,
    },
    {
        id: "am",
        code: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
        description: "Use Amharic for supported AI-PMS interface content.",
        enabled: true,
    },
];


// ============================================================
// GET CURRENT USER
// ============================================================

function getCurrentUser() {
    try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        const parsedUser = JSON.parse(storedUser);

        if (
            !parsedUser ||
            typeof parsedUser !== "object"
        ) {
            return null;
        }

        return parsedUser;
    } catch (error) {
        console.error(
            "Unable to read current user:",
            error
        );

        return null;
    }
}


// ============================================================
// GET USERS
// ============================================================

function getUsers() {
    try {
        const storedUsers =
            localStorage.getItem("users");

        if (!storedUsers) {
            return [];
        }

        const parsedUsers =
            JSON.parse(storedUsers);

        return Array.isArray(parsedUsers)
            ? parsedUsers
            : [];
    } catch (error) {
        console.error(
            "Unable to read users:",
            error
        );

        return [];
    }
}


// ============================================================
// SAVE USERS
// ============================================================

function saveUsers(users) {
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}


// ============================================================
// FIND CURRENT USER
// ============================================================

function findCurrentUser(
    currentUser,
    users
) {
    if (!currentUser) {
        return null;
    }

    return users.find((storedUser) => {

        // Match ID
        if (
            currentUser.id !== undefined &&
            currentUser.id !== null &&
            storedUser.id !== undefined &&
            storedUser.id !== null &&
            String(storedUser.id) ===
                String(currentUser.id)
        ) {
            return true;
        }

        // Match userId
        if (
            currentUser.userId !== undefined &&
            currentUser.userId !== null &&
            storedUser.userId !== undefined &&
            storedUser.userId !== null &&
            String(storedUser.userId) ===
                String(currentUser.userId)
        ) {
            return true;
        }

        // Match email
        if (
            currentUser.email &&
            storedUser.email &&
            String(storedUser.email)
                .trim()
                .toLowerCase() ===
                String(currentUser.email)
                    .trim()
                    .toLowerCase()
        ) {
            return true;
        }

        return false;
    });
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
// ACTIVITY LOG
// ============================================================

function addActivityLog(
    user,
    action
) {
    try {
        const storedLogs =
            localStorage.getItem(
                "activityLogs"
            );

        let logs = [];

        if (storedLogs) {
            try {
                const parsedLogs =
                    JSON.parse(storedLogs);

                if (Array.isArray(parsedLogs)) {
                    logs = parsedLogs;
                }
            } catch {
                logs = [];
            }
        }

        const newLog = {
            id: Date.now(),

            action,

            userId:
                user?.id ??
                user?.userId ??
                null,

            userName:
                user?.fullName ||
                user?.name ||
                "Unknown User",

            userEmail:
                user?.email ||
                "",

            timestamp:
                new Date().toISOString(),
        };

        logs.unshift(newLog);

        localStorage.setItem(
            "activityLogs",
            JSON.stringify(logs)
        );
    } catch (error) {
        console.error(
            "Unable to record activity:",
            error
        );
    }
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function LanguagePreferences({
    onCancel,
    onSuccess,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [currentUser, setCurrentUser] =
        useState(null);

    const [originalLanguage, setOriginalLanguage] =
        useState("");

    const [selectedLanguage, setSelectedLanguage] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [message, setMessage] =
        useState({
            type: "",
            text: "",
        });


    // ========================================================
    // LOAD LANGUAGE PREFERENCES
    // ========================================================

    useEffect(() => {
        let isMounted = true;

        const loadPreferences = () => {
            try {
                setIsLoading(true);

                const loggedInUser =
                    getCurrentUser();

                // ==================================================
                // A4 / USER NOT FOUND
                // ==================================================

                if (!loggedInUser) {
                    if (isMounted) {
                        setMessage({
                            type: "error",
                            text:
                                "User preferences not found.",
                        });

                        setIsLoading(false);
                    }

                    return;
                }

                const users = getUsers();

                let foundUser =
                    findCurrentUser(
                        loggedInUser,
                        users
                    );

                // ==================================================
                // FALLBACK
                // ==================================================

                if (!foundUser) {
                    foundUser =
                        loggedInUser;
                }

                const configuredLanguages =
                    AVAILABLE_LANGUAGES.filter(
                        (language) =>
                            language.enabled === true
                    );

                // ==================================================
                // A4 / NO LANGUAGES
                // ==================================================

                if (
                    configuredLanguages.length ===
                    0
                ) {
                    if (isMounted) {
                        setCurrentUser(
                            foundUser
                        );

                        setMessage({
                            type: "error",
                            text:
                                "No languages are currently available.",
                        });

                        setIsLoading(false);
                    }

                    return;
                }

                const savedLanguage =
                    getUserLanguage(
                        foundUser
                    );

                // ==================================================
                // CHECK WHETHER SAVED LANGUAGE IS SUPPORTED
                // ==================================================

                const supportedLanguage =
                    configuredLanguages.find(
                        (language) =>
                            language.code ===
                            savedLanguage
                    );

                const finalLanguage =
                    supportedLanguage
                        ? supportedLanguage.code
                        : configuredLanguages[0]
                              .code;

                if (!isMounted) {
                    return;
                }

                setCurrentUser(
                    foundUser
                );

                setOriginalLanguage(
                    finalLanguage
                );

                setSelectedLanguage(
                    finalLanguage
                );

                setMessage({
                    type: "",
                    text: "",
                });
            } catch (error) {
                console.error(
                    "Unable to load language preferences:",
                    error
                );

                if (isMounted) {
                    setMessage({
                        type: "error",
                        text:
                            "Unable to load language preferences. Please try again.",
                    });
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadPreferences();

        return () => {
            isMounted = false;
        };
    }, []);


    // ========================================================
    // HANDLE LANGUAGE CHANGE
    // ========================================================

    const handleLanguageChange = (
        languageCode
    ) => {
        setSelectedLanguage(
            languageCode
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // VALIDATE LANGUAGE
    // ========================================================

    const validateLanguage = () => {
        const language =
            AVAILABLE_LANGUAGES.find(
                (item) =>
                    item.code ===
                    selectedLanguage &&
                    item.enabled === true
            );

        if (!language) {
            setMessage({
                type: "error",
                text:
                    "Selected language is not available.",
            });

            return false;
        }

        return true;
    };


    // ========================================================
    // SAVE LANGUAGE
    // ========================================================

    const handleSave = () => {
        setMessage({
            type: "",
            text: "",
        });

        // ======================================================
        // VALIDATE
        // ======================================================

        if (!validateLanguage()) {
            return;
        }

        // ======================================================
        // USER CHECK
        // ======================================================

        if (!currentUser) {
            setMessage({
                type: "error",
                text:
                    "User preferences not found.",
            });

            return;
        }

        try {
            setIsSaving(true);

            const users = getUsers();

            // ==================================================
            // FIND USER
            // ==================================================

            let currentIndex =
                users.findIndex(
                    (storedUser) => {

                        const sameId =
                            currentUser.id !==
                                undefined &&
                            currentUser.id !==
                                null &&
                            storedUser.id !==
                                undefined &&
                            storedUser.id !==
                                null &&
                            String(
                                storedUser.id
                            ) ===
                                String(
                                    currentUser.id
                                );

                        const sameUserId =
                            currentUser.userId !==
                                undefined &&
                            currentUser.userId !==
                                null &&
                            storedUser.userId !==
                                undefined &&
                            storedUser.userId !==
                                null &&
                            String(
                                storedUser.userId
                            ) ===
                                String(
                                    currentUser.userId
                                );

                        const sameEmail =
                            currentUser.email &&
                            storedUser.email &&
                            String(
                                storedUser.email
                            )
                                .trim()
                                .toLowerCase() ===
                                String(
                                    currentUser.email
                                )
                                    .trim()
                                    .toLowerCase();

                        return (
                            sameId ||
                            sameUserId ||
                            sameEmail
                        );
                    }
                );

            // ==================================================
            // IF USER DOES NOT EXIST IN USERS
            // ==================================================

            if (currentIndex === -1) {
                users.push({
                    ...currentUser,
                });

                currentIndex =
                    users.length - 1;
            }

            // ==================================================
            // UPDATE ONLY LANGUAGE PREFERENCE
            // ==================================================

            const existingUser =
                users[currentIndex];

            const updatedUser = {
                ...existingUser,

                languagePreference:
                    selectedLanguage,

                preferredLanguage:
                    selectedLanguage,
            };

            // ==================================================
            // SAVE USERS
            // ==================================================

            const updatedUsers = [
                ...users,
            ];

            updatedUsers[currentIndex] =
                updatedUser;

            saveUsers(
                updatedUsers
            );

            // ==================================================
            // UPDATE LOGGED-IN USER
            // ==================================================

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            // ==================================================
            // SAVE GLOBAL LANGUAGE PREFERENCE
            //
            // This allows the application theme/language
            // context to read the selected language later.
            // ==================================================

            localStorage.setItem(
                "language",
                selectedLanguage
            );

            // ==================================================
            // AUDIT LOG
            // ==================================================

            const language =
                AVAILABLE_LANGUAGES.find(
                    (item) =>
                        item.code ===
                        selectedLanguage
                );

            addActivityLog(
                updatedUser,
                `Changed language preference to ${language?.name || selectedLanguage}`
            );

            // ==================================================
            // UPDATE STATE
            // ==================================================

            setCurrentUser(
                updatedUser
            );

            setOriginalLanguage(
                selectedLanguage
            );

            // ==================================================
            // SUCCESS
            // ==================================================

            setMessage({
                type: "success",
                text:
                    "Language preference updated successfully.",
            });

            // ==================================================
            // CALLBACK
            // ==================================================

            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(
                    updatedUser
                );
            }

            // ==================================================
            // REFRESH APPLICATION
            //
            // This lets the application reload supported
            // interface translations if they are available.
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

        } catch (error) {
            console.error(
                "Language preference update error:",
                error
            );

            setMessage({
                type: "error",
                text:
                    "Unable to update language preference. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
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

        if (
            typeof onCancel ===
            "function"
        ) {
            onCancel();
        }
    };


    // ========================================================
    // RESET
    //
    // Reset the unsaved selection to the currently saved value.
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
    // LOADING
    // ========================================================

    if (isLoading) {
        return (
            <div
                className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    bg-slate-50
                    text-slate-900
                    dark:bg-slate-950
                    dark:text-slate-100
                "
            >
                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            mb-4
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-300
                            border-t-blue-600
                            dark:border-slate-700
                            dark:border-t-blue-400
                        "
                    />

                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        Loading language preferences...
                    </p>

                </div>
            </div>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                min-h-screen
                bg-slate-50
                p-4
                text-slate-900
                transition-colors
                md:p-6
                dark:bg-slate-950
                dark:text-slate-100
            "
        >

            <div
                className="
                    mx-auto
                    max-w-5xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">

                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-500/10
                                dark:text-blue-400
                            "
                        >
                            <Languages
                                className="h-6 w-6"
                            />
                        </div>

                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Language Preferences
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Choose the preferred language
                                for the AI-PMS interface.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    MESSAGE
                ================================================== */}

                {message.text && (
                    <div
                        className={`
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            p-4

                            ${
                                message.type ===
                                "success"
                                    ? `
                                        border-emerald-200
                                        bg-emerald-50
                                        text-emerald-800
                                        dark:border-emerald-800
                                        dark:bg-emerald-950/40
                                        dark:text-emerald-300
                                    `
                                    : `
                                        border-red-200
                                        bg-red-50
                                        text-red-800
                                        dark:border-red-800
                                        dark:bg-red-950/40
                                        dark:text-red-300
                                    `
                            }
                        `}
                    >

                        {message.type ===
                        "success" ? (
                            <CheckCircle2
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />
                        ) : (
                            <XCircle
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />
                        )}

                        <p
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            {message.text}
                        </p>

                    </div>
                )}


                {/* ==================================================
                    LANGUAGE CARD
                ================================================== */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-100
                        shadow-sm
                        dark:border-slate-800
                        dark:bg-slate-900
                    "
                >

                    {/* CARD HEADER */}

                    <div
                        className="
                            border-b
                            border-slate-200
                            p-6
                            dark:border-slate-800
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <Globe2
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            />

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Interface Language
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Select one of the currently
                                    enabled languages.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* LANGUAGE OPTIONS */}

                    <div
                        className="
                            space-y-4
                            p-6
                        "
                    >

                        {AVAILABLE_LANGUAGES
                            .filter(
                                (language) =>
                                    language.enabled ===
                                    true
                            )
                            .map(
                                (language) => {

                                    const isSelected =
                                        selectedLanguage ===
                                        language.code;

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                language.id
                                            }
                                            onClick={() =>
                                                handleLanguageChange(
                                                    language.code
                                                )
                                            }
                                            className={`
                                                flex
                                                w-full
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                p-5
                                                text-left
                                                transition-all
                                                duration-200

                                                ${
                                                    isSelected
                                                        ? `
                                                            border-blue-500
                                                            bg-blue-50
                                                            shadow-sm
                                                            dark:border-blue-500
                                                            dark:bg-blue-500/10
                                                        `
                                                        : `
                                                            border-slate-200
                                                            bg-slate-50
                                                            hover:border-blue-300
                                                            hover:bg-slate-100
                                                            dark:border-slate-700
                                                            dark:bg-slate-800
                                                            dark:hover:border-blue-700
                                                            dark:hover:bg-slate-800/80
                                                        `
                                                }
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-4
                                                "
                                            >

                                                {/* RADIO */}

                                                <div
                                                    className={`
                                                        flex
                                                        h-5
                                                        w-5
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border-2

                                                        ${
                                                            isSelected
                                                                ? `
                                                                    border-blue-600
                                                                    dark:border-blue-400
                                                                `
                                                                : `
                                                                    border-slate-400
                                                                    dark:border-slate-600
                                                                `
                                                        }
                                                    `}
                                                >

                                                    {isSelected && (
                                                        <div
                                                            className="
                                                                h-2.5
                                                                w-2.5
                                                                rounded-full
                                                                bg-blue-600
                                                                dark:bg-blue-400
                                                            "
                                                        />
                                                    )}

                                                </div>


                                                {/* LANGUAGE ICON */}

                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-slate-200
                                                        text-slate-700
                                                        dark:bg-slate-700
                                                        dark:text-slate-200
                                                    "
                                                >
                                                    <Languages
                                                        className="h-5 w-5"
                                                    />
                                                </div>


                                                {/* TEXT */}

                                                <div>

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                font-semibold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            {
                                                                language.name
                                                            }
                                                        </span>

                                                        <span
                                                            className="
                                                                rounded-md
                                                                bg-slate-200
                                                                px-2
                                                                py-0.5
                                                                text-xs
                                                                font-medium
                                                                text-slate-600
                                                                dark:bg-slate-700
                                                                dark:text-slate-300
                                                            "
                                                        >
                                                            {
                                                                language.nativeName
                                                            }
                                                        </span>

                                                    </div>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        "
                                                    >
                                                        {
                                                            language.description
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {/* SELECTED */}

                                            {isSelected && (
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

                                        </button>
                                    );
                                }
                            )}

                    </div>


                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-slate-200
                            bg-slate-200/50
                            p-6
                            sm:flex-row
                            sm:justify-end
                            dark:border-slate-800
                            dark:bg-slate-950/40
                        "
                    >

                        {/* RESET */}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleReset
                            }
                            disabled={
                                isSaving
                            }
                            className="
                                gap-2
                                border-slate-300
                                bg-transparent
                                text-slate-700
                                dark:border-slate-700
                                dark:text-slate-200
                            "
                        >
                            <RotateCcw
                                className="h-4 w-4"
                            />

                            Reset
                        </Button>


                        {/* CANCEL */}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                isSaving
                            }
                            className="
                                border-slate-300
                                bg-transparent
                                text-slate-700
                                dark:border-slate-700
                                dark:text-slate-200
                            "
                        >
                            Cancel
                        </Button>


                        {/* SAVE */}

                        <Button
                            type="button"
                            onClick={
                                handleSave
                            }
                            disabled={
                                isSaving
                            }
                            className="
                                gap-2
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                dark:bg-blue-600
                                dark:hover:bg-blue-500
                            "
                        >

                            {isSaving ? (
                                <>
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/40
                                            border-t-white
                                        "
                                    />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save
                                        className="h-4 w-4"
                                    />

                                    Save Changes
                                </>
                            )}

                        </Button>

                    </div>

                </div>


                {/* ==================================================
                    INFORMATION
                ================================================== */}

                <div
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-4
                        dark:border-blue-900
                        dark:bg-blue-950/30
                    "
                >

                    <div
                        className="
                            flex
                            gap-3
                        "
                    >

                        <Globe2
                            className="
                                mt-0.5
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
                                    font-semibold
                                    text-blue-900
                                    dark:text-blue-300
                                "
                            >
                                Language Preference
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-blue-700
                                    dark:text-blue-400
                                "
                            >
                                Your selected language is saved
                                to your account and can be used
                                by the AI-PMS interface in future
                                sessions.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default LanguagePreferences;