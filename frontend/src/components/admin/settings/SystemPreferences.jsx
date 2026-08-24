import { useEffect, useState } from "react";

import {
    CalendarDays,
    
    CheckCircle2,
    Clock3,
    Database,
    FileUp,
    FolderKanban,
    Globe2,
    HardDrive,
  
    RotateCcw,
    Save,
    Settings2,
    ShieldCheck,
    Wrench,
    X,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";


// ============================================================
// SETTING-007: MANAGE SYSTEM PREFERENCES
//
// Admin can configure:
// - Default date format
// - Time zone
// - Default language
// - File upload limits
// - Default project settings
// - Default task status
// - System maintenance settings
// - Data retention preferences
//
// Current implementation:
// Frontend + localStorage.
//
// Production implementation:
// These values should be retrieved from and saved to the
// backend/database.
// ============================================================


// ============================================================
// CONFIGURABLE SYSTEM OPTIONS
//
// These represent system configuration data.
// They are kept separately from the user's saved preference.
// ============================================================

const SYSTEM_CONFIGURATION = {
    dateFormats: [
        {
            id: "YYYY-MM-DD",
            name: "YYYY-MM-DD",
            description: "Example: 2026-08-18",
        },
        {
            id: "DD/MM/YYYY",
            name: "DD/MM/YYYY",
            description: "Example: 18/08/2026",
        },
        {
            id: "MM/DD/YYYY",
            name: "MM/DD/YYYY",
            description: "Example: 08/18/2026",
        },
    ],

    timeZones: [
        {
            id: "Africa/Addis_Ababa",
            name: "Africa/Addis Ababa",
        },
        {
            id: "UTC",
            name: "UTC",
        },
        {
            id: "Europe/London",
            name: "Europe/London",
        },
        {
            id: "America/New_York",
            name: "America/New York",
        },
        {
            id: "Asia/Dubai",
            name: "Asia/Dubai",
        },
    ],

    languages: [
        {
            id: "en",
            name: "English",
        },
        {
            id: "am",
            name: "Amharic",
        },
    ],

    projectSettings: [
        {
            id: "standard",
            name: "Standard Project",
            description:
                "Use the standard project configuration.",
        },
        {
            id: "agile",
            name: "Agile Project",
            description:
                "Use Agile-oriented project defaults.",
        },
        {
            id: "simple",
            name: "Simple Project",
            description:
                "Use a simplified project configuration.",
        },
    ],

    taskStatuses: [
        {
            id: "todo",
            name: "To Do",
        },
        {
            id: "in-progress",
            name: "In Progress",
        },
        {
            id: "review",
            name: "Review",
        },
        {
            id: "completed",
            name: "Completed",
        },
    ],

    maintenanceModes: [
        {
            id: "normal",
            name: "Normal Operation",
            description:
                "System operates normally.",
        },
        {
            id: "scheduled",
            name: "Scheduled Maintenance",
            description:
                "Maintenance is allowed during configured maintenance periods.",
        },
    ],

    retentionPeriods: [
        {
            id: "30",
            name: "30 Days",
        },
        {
            id: "90",
            name: "90 Days",
        },
        {
            id: "180",
            name: "180 Days",
        },
        {
            id: "365",
            name: "1 Year",
        },
        {
            id: "730",
            name: "2 Years",
        },
    ],

    maximumUploadSizeMB: 100,

    minimumRetentionDays: 30,
};


// ============================================================
// DEFAULT SYSTEM PREFERENCES
// ============================================================

const DEFAULT_SYSTEM_PREFERENCES = {
    dateFormat: "YYYY-MM-DD",

    timeZone: "Africa/Addis_Ababa",

    language: "en",

    fileUploadLimitMB: 25,

    defaultProjectSetting: "standard",

    defaultTaskStatus: "todo",

    maintenance: {
        enabled: false,
        mode: "normal",
        startTime: "00:00",
        endTime: "04:00",
    },

    dataRetentionDays: "365",
};


// ============================================================
// CLONE OBJECT
// ============================================================

function clonePreferences(preferences) {
    return JSON.parse(
        JSON.stringify(preferences)
    );
}


// ============================================================
// GET CURRENT USER
// ============================================================

function getCurrentUser() {
    try {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        const parsedUser =
            JSON.parse(storedUser);

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
        const sameId =
            currentUser.id !== undefined &&
            currentUser.id !== null &&
            storedUser.id !== undefined &&
            storedUser.id !== null &&
            String(storedUser.id) ===
                String(currentUser.id);

        const sameUserId =
            currentUser.userId !== undefined &&
            currentUser.userId !== null &&
            storedUser.userId !== undefined &&
            storedUser.userId !== null &&
            String(storedUser.userId) ===
                String(currentUser.userId);

        const sameEmail =
            currentUser.email &&
            storedUser.email &&
            String(storedUser.email)
                .trim()
                .toLowerCase() ===
                String(currentUser.email)
                    .trim()
                    .toLowerCase();

        return (
            sameId ||
            sameUserId ||
            sameEmail
        );
    });
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

                if (
                    Array.isArray(
                        parsedLogs
                    )
                ) {
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
                user?.email || "",

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
// VALIDATE SYSTEM PREFERENCES
// ============================================================

function validateSystemPreferences(
    preferences
) {
    if (!preferences) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // DATE FORMAT
    // --------------------------------------------------------

    const validDateFormat =
        SYSTEM_CONFIGURATION.dateFormats.some(
            (item) =>
                item.id ===
                preferences.dateFormat
        );

    if (!validDateFormat) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // TIME ZONE
    // --------------------------------------------------------

    const validTimeZone =
        SYSTEM_CONFIGURATION.timeZones.some(
            (item) =>
                item.id ===
                preferences.timeZone
        );

    if (!validTimeZone) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------------

    const validLanguage =
        SYSTEM_CONFIGURATION.languages.some(
            (item) =>
                item.id ===
                preferences.language
        );

    if (!validLanguage) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // FILE UPLOAD LIMIT
    // --------------------------------------------------------

    const uploadLimit =
        Number(
            preferences.fileUploadLimitMB
        );

    if (
        !Number.isFinite(
            uploadLimit
        ) ||
        uploadLimit <= 0 ||
        uploadLimit >
            SYSTEM_CONFIGURATION.maximumUploadSizeMB
    ) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // PROJECT SETTING
    // --------------------------------------------------------

    const validProjectSetting =
        SYSTEM_CONFIGURATION.projectSettings.some(
            (item) =>
                item.id ===
                preferences.defaultProjectSetting
        );

    if (!validProjectSetting) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // TASK STATUS
    // --------------------------------------------------------

    const validTaskStatus =
        SYSTEM_CONFIGURATION.taskStatuses.some(
            (item) =>
                item.id ===
                preferences.defaultTaskStatus
        );

    if (!validTaskStatus) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // MAINTENANCE
    // --------------------------------------------------------

    if (
        !preferences.maintenance ||
        typeof preferences.maintenance !==
            "object"
    ) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    const validMaintenanceMode =
        SYSTEM_CONFIGURATION.maintenanceModes.some(
            (item) =>
                item.id ===
                preferences.maintenance.mode
        );

    if (!validMaintenanceMode) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // MAINTENANCE TIME
    // --------------------------------------------------------

    const timePattern =
        /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
        !timePattern.test(
            preferences.maintenance
                .startTime
        ) ||
        !timePattern.test(
            preferences.maintenance
                .endTime
        )
    ) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // DATA RETENTION
    // --------------------------------------------------------

    const retentionDays =
        Number(
            preferences.dataRetentionDays
        );

    if (
        !Number.isFinite(
            retentionDays
        ) ||
        retentionDays <
            SYSTEM_CONFIGURATION
                .minimumRetentionDays
    ) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }

    const validRetention =
        SYSTEM_CONFIGURATION.retentionPeriods.some(
            (item) =>
                Number(item.id) ===
                retentionDays
        );

    if (!validRetention) {
        return {
            valid: false,
            message:
                "Invalid system preferences.",
        };
    }


    // --------------------------------------------------------
    // ALL VALID
    // --------------------------------------------------------

    return {
        valid: true,
        message: "",
    };
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function SystemPreferences({
    user: userProp,
    onCancel,
    onSuccess,
}) {

    // ========================================================
    // USER
    // ========================================================

    const [currentUser, setCurrentUser] =
        useState(null);


    // ========================================================
    // PREFERENCES
    // ========================================================

    const [
        preferences,
        setPreferences,
    ] = useState(
        clonePreferences(
            DEFAULT_SYSTEM_PREFERENCES
        )
    );

    const [
        originalPreferences,
        setOriginalPreferences,
    ] = useState(
        clonePreferences(
            DEFAULT_SYSTEM_PREFERENCES
        )
    );


    // ========================================================
    // UI STATE
    // ========================================================

    const [message, setMessage] =
        useState({
            type: "",
            text: "",
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);


    // ========================================================
    // LOAD SYSTEM PREFERENCES
    // ========================================================

    useEffect(() => {
        let isMounted = true;

        const loadPreferences = () => {
            try {
                setIsLoading(true);

                const loggedInUser =
                    userProp ||
                    getCurrentUser();


                // ------------------------------------------------
                // USER NOT FOUND
                // ------------------------------------------------

                if (!loggedInUser) {
                    if (isMounted) {
                        setMessage({
                            type: "error",
                            text:
                                "Unable to load system preferences. Please try again.",
                        });

                        setIsLoading(false);
                    }

                    return;
                }


                // ------------------------------------------------
                // ADMIN CHECK
                // ------------------------------------------------

                if (
                    loggedInUser.role &&
                    String(
                        loggedInUser.role
                    )
                        .trim()
                        .toLowerCase() !==
                        "admin"
                ) {
                    if (isMounted) {
                        setMessage({
                            type: "error",
                            text:
                                "Access denied.",
                        });

                        setIsLoading(false);
                    }

                    return;
                }


                // ------------------------------------------------
                // FIND USER
                // ------------------------------------------------

                const users =
                    getUsers();

                let foundUser =
                    findCurrentUser(
                        loggedInUser,
                        users
                    );

                if (!foundUser) {
                    foundUser =
                        loggedInUser;
                }


                // ------------------------------------------------
                // LOAD SAVED SYSTEM PREFERENCES
                // ------------------------------------------------

                let loadedPreferences =
                    clonePreferences(
                        DEFAULT_SYSTEM_PREFERENCES
                    );


                // System preferences are stored globally.
                const storedPreferences =
                    localStorage.getItem(
                        "systemPreferences"
                    );

                if (storedPreferences) {
                    try {
                        const parsedPreferences =
                            JSON.parse(
                                storedPreferences
                            );

                        if (
                            parsedPreferences &&
                            typeof parsedPreferences ===
                                "object"
                        ) {
                            loadedPreferences = {
                                ...loadedPreferences,
                                ...parsedPreferences,

                                maintenance: {
                                    ...loadedPreferences.maintenance,
                                    ...(
                                        parsedPreferences.maintenance ||
                                        {}
                                    ),
                                },
                            };
                        }
                    } catch (error) {
                        console.error(
                            "Unable to parse system preferences:",
                            error
                        );
                    }
                }


                // ------------------------------------------------
                // VALIDATE LOADED PREFERENCES
                // ------------------------------------------------

                const validation =
                    validateSystemPreferences(
                        loadedPreferences
                    );

                if (!validation.valid) {
                    loadedPreferences =
                        clonePreferences(
                            DEFAULT_SYSTEM_PREFERENCES
                        );
                }


                if (!isMounted) {
                    return;
                }


                setCurrentUser(
                    foundUser
                );

                setPreferences(
                    loadedPreferences
                );

                setOriginalPreferences(
                    clonePreferences(
                        loadedPreferences
                    )
                );

                setMessage({
                    type: "",
                    text: "",
                });

            } catch (error) {
                console.error(
                    "Unable to load system preferences:",
                    error
                );

                if (isMounted) {
                    setMessage({
                        type: "error",
                        text:
                            "Unable to load system preferences. Please try again.",
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
    }, [userProp]);


    // ========================================================
    // CHANGE SIMPLE PREFERENCE
    // ========================================================

    const handlePreferenceChange = (
        field,
        value
    ) => {
        setPreferences(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // CHANGE MAINTENANCE PREFERENCE
    // ========================================================

    const handleMaintenanceChange = (
        field,
        value
    ) => {
        setPreferences(
            (previous) => ({
                ...previous,

                maintenance: {
                    ...previous.maintenance,
                    [field]: value,
                },
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        const defaults =
            clonePreferences(
                DEFAULT_SYSTEM_PREFERENCES
            );

        setPreferences(
            defaults
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = () => {
        setMessage({
            type: "",
            text: "",
        });


        // ----------------------------------------------------
        // VALIDATE
        // ----------------------------------------------------

        const validation =
            validateSystemPreferences(
                preferences
            );

        if (!validation.valid) {
            setMessage({
                type: "error",
                text:
                    "Invalid system preferences.",
            });

            return;
        }


        // ----------------------------------------------------
        // USER CHECK
        // ----------------------------------------------------

        if (!currentUser) {
            setMessage({
                type: "error",
                text:
                    "Access denied.",
            });

            return;
        }


        // ----------------------------------------------------
        // ADMIN CHECK
        // ----------------------------------------------------

        if (
            currentUser.role &&
            String(
                currentUser.role
            )
                .trim()
                .toLowerCase() !==
                "admin"
        ) {
            setMessage({
                type: "error",
                text:
                    "Access denied.",
            });

            return;
        }


        try {
            setIsSaving(true);


            // ------------------------------------------------
            // SAVE GLOBAL SYSTEM PREFERENCES
            // ------------------------------------------------

            localStorage.setItem(
                "systemPreferences",
                JSON.stringify(
                    preferences
                )
            );


            // ------------------------------------------------
            // UPDATE CURRENT USER
            //
            // This is only for keeping the current session
            // synchronized with the saved configuration.
            // ------------------------------------------------

            const users =
                getUsers();

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


            // ------------------------------------------------
            // UPDATE USER
            // ------------------------------------------------

            let updatedUser =
                currentUser;

            if (currentIndex !== -1) {
                updatedUser = {
                    ...users[currentIndex],

                    systemPreferencesUpdatedAt:
                        new Date().toISOString(),
                };

                const updatedUsers =
                    [...users];

                updatedUsers[
                    currentIndex
                ] = updatedUser;

                saveUsers(
                    updatedUsers
                );
            }


            // ------------------------------------------------
            // UPDATE SESSION USER
            // ------------------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );


            // ------------------------------------------------
            // ACTIVITY / AUDIT LOG
            // ------------------------------------------------

            addActivityLog(
                updatedUser,
                "Updated system preferences"
            );


            // ------------------------------------------------
            // UPDATE STATE
            // ------------------------------------------------

            setCurrentUser(
                updatedUser
            );

            setOriginalPreferences(
                clonePreferences(
                    preferences
                )
            );


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            setMessage({
                type: "success",
                text:
                    "System preferences updated successfully.",
            });


            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(
                    preferences
                );
            }

        } catch (error) {
            console.error(
                "System preference update error:",
                error
            );

            setMessage({
                type: "error",
                text:
                    "Unable to update system preferences. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };


    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        setPreferences(
            clonePreferences(
                originalPreferences
            )
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
    // LOADING
    // ========================================================

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-background text-foreground">
                <div className="text-center">

                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

                    <p className="text-sm font-medium text-muted-foreground">
                        Loading system preferences...
                    </p>

                </div>
            </div>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-background p-4 text-foreground md:p-6">

            <div className="mx-auto max-w-6xl">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Settings2 className="h-6 w-6" />
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                System Preferences
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure general system-wide settings for AI-PMS.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    MESSAGE
                ================================================== */}

                {message.text && (
                    <div
                        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
                            message.type ===
                            "success"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-destructive/30 bg-destructive/10 text-destructive"
                        }`}
                    >

                        {message.type ===
                        "success" ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                        ) : (
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        )}

                        <p className="text-sm font-medium">
                            {message.text}
                        </p>

                    </div>
                )}


                {/* ==================================================
                    DATE & TIME
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <CalendarDays className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    Date & Time Settings
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure the default date format and system time zone.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="grid gap-6 p-6 md:grid-cols-2">


                        {/* DATE FORMAT */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Default Date Format
                            </label>

                            <select
                                value={
                                    preferences.dateFormat
                                }
                                onChange={(event) =>
                                    handlePreferenceChange(
                                        "dateFormat",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >

                                {SYSTEM_CONFIGURATION.dateFormats.map(
                                    (format) => (
                                        <option
                                            key={
                                                format.id
                                            }
                                            value={
                                                format.id
                                            }
                                        >
                                            {
                                                format.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* TIME ZONE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Time Zone
                            </label>

                            <select
                                value={
                                    preferences.timeZone
                                }
                                onChange={(event) =>
                                    handlePreferenceChange(
                                        "timeZone",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >

                                {SYSTEM_CONFIGURATION.timeZones.map(
                                    (zone) => (
                                        <option
                                            key={
                                                zone.id
                                            }
                                            value={
                                                zone.id
                                            }
                                        >
                                            {
                                                zone.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    LANGUAGE
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <Globe2 className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    Default Language
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Select the default language used by the system.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="p-6">

                        <label className="mb-2 block text-sm font-semibold">
                            System Default Language
                        </label>

                        <select
                            value={
                                preferences.language
                            }
                            onChange={(event) =>
                                handlePreferenceChange(
                                    "language",
                                    event.target.value
                                )
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring md:max-w-md"
                        >

                            {SYSTEM_CONFIGURATION.languages.map(
                                (language) => (
                                    <option
                                        key={
                                            language.id
                                        }
                                        value={
                                            language.id
                                        }
                                    >
                                        {
                                            language.name
                                        }
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* ==================================================
                    FILE UPLOAD
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <FileUp className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    File Upload Settings
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure the maximum file upload size allowed by the system.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="p-6">

                        <label className="mb-2 block text-sm font-semibold">
                            Maximum File Upload Size
                        </label>

                        <div className="flex items-center gap-3">

                            <input
                                type="number"
                                min="1"
                                max={
                                    SYSTEM_CONFIGURATION.maximumUploadSizeMB
                                }
                                value={
                                    preferences.fileUploadLimitMB
                                }
                                onChange={(event) =>
                                    handlePreferenceChange(
                                        "fileUploadLimitMB",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring md:max-w-xs"
                            />

                            <span className="text-sm font-medium text-muted-foreground">
                                MB
                            </span>

                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Maximum system limit:{" "}
                            {
                                SYSTEM_CONFIGURATION.maximumUploadSizeMB
                            }{" "}
                            MB
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    PROJECT SETTINGS
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <FolderKanban className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    Default Project Settings
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure the default settings used when creating projects.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="grid gap-6 p-6 md:grid-cols-2">


                        {/* PROJECT */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Default Project Type
                            </label>

                            <select
                                value={
                                    preferences.defaultProjectSetting
                                }
                                onChange={(event) =>
                                    handlePreferenceChange(
                                        "defaultProjectSetting",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >

                                {SYSTEM_CONFIGURATION.projectSettings.map(
                                    (project) => (
                                        <option
                                            key={
                                                project.id
                                            }
                                            value={
                                                project.id
                                            }
                                        >
                                            {
                                                project.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* TASK */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Default Task Status
                            </label>

                            <select
                                value={
                                    preferences.defaultTaskStatus
                                }
                                onChange={(event) =>
                                    handlePreferenceChange(
                                        "defaultTaskStatus",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >

                                {SYSTEM_CONFIGURATION.taskStatuses.map(
                                    (status) => (
                                        <option
                                            key={
                                                status.id
                                            }
                                            value={
                                                status.id
                                            }
                                        >
                                            {
                                                status.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    MAINTENANCE
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <Wrench className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    System Maintenance
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure system maintenance behavior and maintenance hours.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="space-y-6 p-6">


                        {/* ENABLE */}

                        <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">

                            <div>

                                <p className="font-semibold">
                                    Enable Maintenance Mode
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Allow the system to use the configured maintenance mode.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    handleMaintenanceChange(
                                        "enabled",
                                        !preferences
                                            .maintenance
                                            .enabled
                                    )
                                }
                                className={`relative h-6 w-11 rounded-full transition ${
                                    preferences
                                        .maintenance
                                        .enabled
                                        ? "bg-primary"
                                        : "bg-muted"
                                }`}
                                aria-label="Toggle maintenance mode"
                            >

                                <span
                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                        preferences
                                            .maintenance
                                            .enabled
                                            ? "left-6"
                                            : "left-1"
                                    }`}
                                />

                            </button>

                        </div>


                        {/* MODE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Maintenance Mode
                            </label>

                            <select
                                value={
                                    preferences
                                        .maintenance
                                        .mode
                                }
                                onChange={(event) =>
                                    handleMaintenanceChange(
                                        "mode",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >

                                {SYSTEM_CONFIGURATION.maintenanceModes.map(
                                    (mode) => (
                                        <option
                                            key={
                                                mode.id
                                            }
                                            value={
                                                mode.id
                                            }
                                        >
                                            {
                                                mode.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* TIME */}

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>

                                <label className="mb-2 block text-sm font-semibold">
                                    Maintenance Start Time
                                </label>

                                <div className="relative">

                                    <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <input
                                        type="time"
                                        value={
                                            preferences
                                                .maintenance
                                                .startTime
                                        }
                                        onChange={(event) =>
                                            handleMaintenanceChange(
                                                "startTime",
                                                event.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    />

                                </div>

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-semibold">
                                    Maintenance End Time
                                </label>

                                <div className="relative">

                                    <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <input
                                        type="time"
                                        value={
                                            preferences
                                                .maintenance
                                                .endTime
                                        }
                                        onChange={(event) =>
                                            handleMaintenanceChange(
                                                "endTime",
                                                event.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    DATA RETENTION
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <Database className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    Data Retention
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure how long system data should be retained.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="p-6">

                        <label className="mb-2 block text-sm font-semibold">
                            Data Retention Period
                        </label>

                        <select
                            value={
                                preferences.dataRetentionDays
                            }
                            onChange={(event) =>
                                handlePreferenceChange(
                                    "dataRetentionDays",
                                    event.target.value
                                )
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring md:max-w-md"
                        >

                            {SYSTEM_CONFIGURATION.retentionPeriods.map(
                                (period) => (
                                    <option
                                        key={
                                            period.id
                                        }
                                        value={
                                            period.id
                                        }
                                    >
                                        {
                                            period.name
                                        }
                                    </option>
                                )
                            )}

                        </select>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Minimum allowed retention period:{" "}
                            {
                                SYSTEM_CONFIGURATION
                                    .minimumRetentionDays
                            }{" "}
                            days.
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    CONFIGURATION SUMMARY
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">

                    <div className="mb-4 flex items-center gap-3">

                        <ShieldCheck className="h-5 w-5 text-primary" />

                        <div>

                            <h2 className="font-bold">
                                Configuration Summary
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Review the current system configuration before saving.
                            </p>

                        </div>

                    </div>


                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-xl border border-border bg-card p-4">

                            <CalendarDays className="mb-2 h-5 w-5 text-primary" />

                            <p className="text-xs text-muted-foreground">
                                Date Format
                            </p>

                            <p className="mt-1 font-semibold">
                                {
                                    preferences.dateFormat
                                }
                            </p>

                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">

                            <Globe2 className="mb-2 h-5 w-5 text-primary" />

                            <p className="text-xs text-muted-foreground">
                                Language
                            </p>

                            <p className="mt-1 font-semibold">
                                {
                                    SYSTEM_CONFIGURATION.languages.find(
                                        (item) =>
                                            item.id ===
                                            preferences.language
                                    )?.name ||
                                    preferences.language
                                }
                            </p>

                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">

                            <HardDrive className="mb-2 h-5 w-5 text-primary" />

                            <p className="text-xs text-muted-foreground">
                                Upload Limit
                            </p>

                            <p className="mt-1 font-semibold">
                                {
                                    preferences.fileUploadLimitMB
                                }{" "}
                                MB
                            </p>

                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">

                            <Database className="mb-2 h-5 w-5 text-primary" />

                            <p className="text-xs text-muted-foreground">
                                Data Retention
                            </p>

                            <p className="mt-1 font-semibold">
                                {
                                    preferences.dataRetentionDays
                                }{" "}
                                days
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:justify-end">

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
                        className="gap-2"
                    >

                        <X className="h-4 w-4" />

                        Cancel

                    </Button>


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
                        className="gap-2"
                    >

                        <RotateCcw className="h-4 w-4" />

                        Reset to Default

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
                        className="gap-2"
                    >

                        {isSaving ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />

                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />

                                Save Changes
                            </>
                        )}

                    </Button>

                </div>


                {/* ==================================================
                    USE CASE INFORMATION
                ================================================== */}

                <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">

                    <div className="flex gap-3">

                        <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <div>

                            <p className="font-semibold">
                                System Preference Rules
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                System preferences are validated before
                                being applied. Date formats, time zones,
                                languages, project settings, task statuses,
                                maintenance modes, upload limits, and data
                                retention values must come from supported
                                system configuration. Invalid or conflicting
                                values are rejected and changes are recorded
                                in the activity audit log.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default SystemPreferences;