import { useEffect, useState } from "react";

import {
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    Info,
    RotateCcw,
    Save,
    Settings2,
    ShieldCheck,
    X,
    XCircle,
    Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// ============================================================
// SETTING-006: MANAGE AI PREFERENCES
//
// Admin can configure:
// - AI features
// - AI recommendations
// - AI risk analysis
// - AI notifications and alerts
// - AI suggestion approval mode
// - AI data usage
// - AI analysis frequency
//
// Preferences are stored per user.
// ============================================================


// ============================================================
// CONFIGURABLE AI OPTIONS
//
// In production these values should come from the backend.
// They are kept in one configuration section so the user
// preference itself does not contain the system configuration.
// ============================================================

const AI_CONFIGURATION = {
    approvalModes: [
        {
            id: "manual",
            name: "Manual Approval",
            description:
                "AI suggestions must be reviewed and approved by an authorized user.",
        },
        {
            id: "automatic",
            name: "Automatic Application",
            description:
                "Eligible AI suggestions can be applied automatically according to system rules.",
        },
    ],

    dataUsageModes: [
        {
            id: "minimal",
            name: "Minimal Data Usage",
            description:
                "Use only the minimum data required for AI processing.",
        },
        {
            id: "standard",
            name: "Standard Data Usage",
            description:
                "Allow AI to use configured project and system data.",
        },
        {
            id: "enhanced",
            name: "Enhanced Data Usage",
            description:
                "Allow AI to use additional authorized data for improved analysis.",
        },
    ],

    analysisFrequencies: [
        {
            id: "manual",
            name: "Manual",
            description:
                "Run AI analysis only when requested.",
        },
        {
            id: "hourly",
            name: "Hourly",
            description:
                "Run available AI analysis every hour.",
        },
        {
            id: "daily",
            name: "Daily",
            description:
                "Run available AI analysis once per day.",
        },
        {
            id: "weekly",
            name: "Weekly",
            description:
                "Run available AI analysis once per week.",
        },
    ],
};


// ============================================================
// DEFAULT AI PREFERENCES
// ============================================================

const DEFAULT_AI_PREFERENCES = {
    aiEnabled: true,

    recommendationsEnabled: true,

    riskAnalysisEnabled: true,

    notificationsEnabled: true,

    securityAlertsEnabled: true,

    approvalMode: "manual",

    dataUsage: "minimal",

    analysisFrequency: "daily",
};


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
// CLONE PREFERENCES
// ============================================================

function clonePreferences(preferences) {
    return JSON.parse(
        JSON.stringify(preferences)
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
// ACTIVITY / AUDIT LOG
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
// VALIDATE AI PREFERENCES
// ============================================================

function validateAIPreferences(
    preferences
) {
    if (
        !preferences ||
        typeof preferences !== "object"
    ) {
        return false;
    }

    // Boolean settings
    if (
        typeof preferences.aiEnabled !==
        "boolean"
    ) {
        return false;
    }

    if (
        typeof preferences.recommendationsEnabled !==
        "boolean"
    ) {
        return false;
    }

    if (
        typeof preferences.riskAnalysisEnabled !==
        "boolean"
    ) {
        return false;
    }

    if (
        typeof preferences.notificationsEnabled !==
        "boolean"
    ) {
        return false;
    }

    if (
        typeof preferences.securityAlertsEnabled !==
        "boolean"
    ) {
        return false;
    }

    // Approval mode
    const validApprovalModes =
        AI_CONFIGURATION.approvalModes.map(
            (mode) => mode.id
        );

    if (
        !validApprovalModes.includes(
            preferences.approvalMode
        )
    ) {
        return false;
    }

    // Data usage
    const validDataUsageModes =
        AI_CONFIGURATION.dataUsageModes.map(
            (mode) => mode.id
        );

    if (
        !validDataUsageModes.includes(
            preferences.dataUsage
        )
    ) {
        return false;
    }

    // Analysis frequency
    const validFrequencies =
        AI_CONFIGURATION.analysisFrequencies.map(
            (frequency) => frequency.id
        );

    if (
        !validFrequencies.includes(
            preferences.analysisFrequency
        )
    ) {
        return false;
    }

    return true;
}


// ============================================================
// CHECK MANDATORY SECURITY RULES
// ============================================================

function validateMandatoryRules(
    preferences
) {
    // Security alerts cannot be disabled.
    if (
        preferences.securityAlertsEnabled !==
        true
    ) {
        return {
            valid: false,
            message:
                "Security alerts are mandatory and cannot be disabled.",
        };
    }

    // Automatic AI application should only be
    // available when AI is enabled.
    if (
        !preferences.aiEnabled &&
        preferences.approvalMode ===
            "automatic"
    ) {
        return {
            valid: false,
            message:
                "Automatic AI application requires AI features to be enabled.",
        };
    }

    // Risk analysis cannot be enabled if AI
    // itself is disabled.
    if (
        !preferences.aiEnabled &&
        preferences.riskAnalysisEnabled
    ) {
        return {
            valid: false,
            message:
                "AI risk analysis cannot remain enabled while AI features are disabled.",
        };
    }

    // Recommendations cannot be enabled when
    // AI itself is disabled.
    if (
        !preferences.aiEnabled &&
        preferences.recommendationsEnabled
    ) {
        return {
            valid: false,
            message:
                "AI recommendations cannot remain enabled while AI features are disabled.",
        };
    }

    return {
        valid: true,
        message: "",
    };
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function AIPreferences({
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
            DEFAULT_AI_PREFERENCES
        )
    );

    const [
        originalPreferences,
        setOriginalPreferences,
    ] = useState(
        clonePreferences(
            DEFAULT_AI_PREFERENCES
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
    // LOAD AI PREFERENCES
    // ========================================================

    useEffect(() => {
        let isMounted = true;

        const loadPreferences = () => {
            try {
                setIsLoading(true);

                const loggedInUser =
                    userProp ||
                    getCurrentUser();


                // ============================================
                // USER NOT FOUND
                // ============================================

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


                // ============================================
                // ADMIN CHECK
                // ============================================

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


                // ============================================
                // FIND USER
                // ============================================

                const users = getUsers();

                let foundUser =
                    findCurrentUser(
                        loggedInUser,
                        users
                    );

                if (!foundUser) {
                    foundUser =
                        loggedInUser;
                }


                // ============================================
                // LOAD SAVED PREFERENCES
                // ============================================

                const savedPreferences =
                    foundUser.aiPreferences;

                let loadedPreferences =
                    clonePreferences(
                        DEFAULT_AI_PREFERENCES
                    );

                if (
                    savedPreferences &&
                    typeof savedPreferences ===
                        "object"
                ) {
                    loadedPreferences = {
                        ...loadedPreferences,
                        ...savedPreferences,
                    };
                }


                // ============================================
                // VALIDATE SAVED DATA
                // ============================================

                if (
                    !validateAIPreferences(
                        loadedPreferences
                    )
                ) {
                    loadedPreferences =
                        clonePreferences(
                            DEFAULT_AI_PREFERENCES
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
                    "Unable to load AI preferences:",
                    error
                );

                if (isMounted) {
                    setMessage({
                        type: "error",
                        text:
                            "Unable to load AI preferences. Please try again.",
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
    // CHANGE BOOLEAN SETTING
    // ========================================================

    const handleToggle = (
        setting,
        enabled
    ) => {
        setPreferences(
            (previous) => ({
                ...previous,
                [setting]: enabled,
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // CHANGE APPROVAL MODE
    // ========================================================

    const handleApprovalModeChange = (
        mode
    ) => {
        setPreferences(
            (previous) => ({
                ...previous,
                approvalMode: mode,
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // CHANGE DATA USAGE
    // ========================================================

    const handleDataUsageChange = (
        mode
    ) => {
        setPreferences(
            (previous) => ({
                ...previous,
                dataUsage: mode,
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // CHANGE ANALYSIS FREQUENCY
    // ========================================================

    const handleAnalysisFrequencyChange = (
        frequency
    ) => {
        setPreferences(
            (previous) => ({
                ...previous,
                analysisFrequency:
                    frequency,
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
                DEFAULT_AI_PREFERENCES
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


        // ================================================
        // VALIDATE
        // ================================================

        if (
            !validateAIPreferences(
                preferences
            )
        ) {
            setMessage({
                type: "error",
                text:
                    "Invalid AI preference settings.",
            });

            return;
        }


        // ================================================
        // MANDATORY SECURITY RULES
        // ================================================

        const mandatoryValidation =
            validateMandatoryRules(
                preferences
            );

        if (
            !mandatoryValidation.valid
        ) {
            setMessage({
                type: "error",
                text:
                    mandatoryValidation.message ||
                    "AI configuration cannot be applied.",
            });

            return;
        }


        // ================================================
        // USER CHECK
        // ================================================

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


            // ============================================
            // FIND USER
            // ============================================

            const users = getUsers();

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


            // ============================================
            // USER NOT FOUND IN USERS ARRAY
            // ============================================

            if (
                currentIndex === -1
            ) {
                users.push({
                    ...currentUser,
                });

                currentIndex =
                    users.length - 1;
            }


            // ============================================
            // UPDATE USER
            // ============================================

            const existingUser =
                users[currentIndex];

            const updatedUser = {
                ...existingUser,

                aiPreferences:
                    clonePreferences(
                        preferences
                    ),
            };


            // ============================================
            // SAVE USERS
            // ============================================

            const updatedUsers = [
                ...users,
            ];

            updatedUsers[
                currentIndex
            ] = updatedUser;

            saveUsers(
                updatedUsers
            );


            // ============================================
            // UPDATE LOGGED-IN USER
            // ============================================

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );


            // ============================================
            // SAVE SEPARATE AI PREFERENCE RECORD
            // ============================================

            localStorage.setItem(
                "aiPreferences",
                JSON.stringify(
                    preferences
                )
            );


            // ============================================
            // AI SERVICE CONFIGURATION STATE
            //
            // Frontend/localStorage simulation.
            // A real backend would send this configuration
            // to the AI Service API here.
            // ============================================

            localStorage.setItem(
                "aiServiceConfiguration",
                JSON.stringify({
                    ...preferences,

                    updatedAt:
                        new Date().toISOString(),

                    status: "applied",
                })
            );


            // ============================================
            // AUDIT LOG
            // ============================================

            addActivityLog(
                updatedUser,
                "Updated AI preferences"
            );


            // ============================================
            // UPDATE STATE
            // ============================================

            setCurrentUser(
                updatedUser
            );

            setOriginalPreferences(
                clonePreferences(
                    preferences
                )
            );


            // ============================================
            // SUCCESS
            // ============================================

            setMessage({
                type: "success",
                text:
                    "AI preferences updated successfully.",
            });


            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(
                    updatedUser
                );
            }
        } catch (error) {
            console.error(
                "AI preference update error:",
                error
            );

            setMessage({
                type: "error",
                text:
                    "Unable to save AI preferences. Please try again.",
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
                        Loading AI preferences...
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
                            <BrainCircuit className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                AI Preferences
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure how AI features operate within the AI-PMS.
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
                    AI FEATURE CONTROL
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">
                        <div className="flex items-center gap-3">

                            <Zap className="h-5 w-5 text-primary" />

                            <div>
                                <h2 className="text-lg font-bold">
                                    AI Feature Controls
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Enable or disable AI capabilities available to your account.
                                </p>
                            </div>

                        </div>
                    </div>


                    <div className="space-y-4 p-6">

                        {/* AI FEATURES */}

                        <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">

                            <div className="pr-4">
                                <p className="font-semibold">
                                    Enable AI Features
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Allow AI-powered functionality throughout the AI-PMS.
                                </p>
                            </div>

                            <Switch
                                checked={
                                    preferences.aiEnabled
                                }
                                onCheckedChange={(
                                    checked
                                ) =>
                                    handleToggle(
                                        "aiEnabled",
                                        checked
                                    )
                                }
                            />

                        </div>


                        {/* RECOMMENDATIONS */}

                        <div
                            className={`flex items-center justify-between rounded-xl border border-border p-4 ${
                                !preferences.aiEnabled
                                    ? "bg-muted/40 opacity-60"
                                    : "bg-background"
                            }`}
                        >

                            <div className="pr-4">
                                <p className="font-semibold">
                                    AI Recommendations
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Allow AI to generate recommendations and suggestions.
                                </p>
                            </div>

                            <Switch
                                checked={
                                    preferences.recommendationsEnabled
                                }
                                disabled={
                                    !preferences.aiEnabled
                                }
                                onCheckedChange={(
                                    checked
                                ) =>
                                    handleToggle(
                                        "recommendationsEnabled",
                                        checked
                                    )
                                }
                            />

                        </div>


                        {/* RISK ANALYSIS */}

                        <div
                            className={`flex items-center justify-between rounded-xl border border-border p-4 ${
                                !preferences.aiEnabled
                                    ? "bg-muted/40 opacity-60"
                                    : "bg-background"
                            }`}
                        >

                            <div className="pr-4">
                                <p className="font-semibold">
                                    AI Risk Analysis
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Allow AI to analyze projects and identify potential risks.
                                </p>
                            </div>

                            <Switch
                                checked={
                                    preferences.riskAnalysisEnabled
                                }
                                disabled={
                                    !preferences.aiEnabled
                                }
                                onCheckedChange={(
                                    checked
                                ) =>
                                    handleToggle(
                                        "riskAnalysisEnabled",
                                        checked
                                    )
                                }
                            />

                        </div>


                        {/* AI NOTIFICATIONS */}

                        <div
                            className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
                        >

                            <div className="pr-4">
                                <p className="font-semibold">
                                    AI Notifications & Alerts
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Receive notifications generated by AI analysis and recommendations.
                                </p>
                            </div>

                            <Switch
                                checked={
                                    preferences.notificationsEnabled
                                }
                                onCheckedChange={(
                                    checked
                                ) =>
                                    handleToggle(
                                        "notificationsEnabled",
                                        checked
                                    )
                                }
                            />

                        </div>


                        {/* SECURITY ALERTS */}

                        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">

                            <div className="flex items-start gap-3 pr-4">

                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                                <div>
                                    <p className="font-semibold">
                                        Security Alerts
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Mandatory security alerts cannot be disabled.
                                    </p>
                                </div>

                            </div>

                            <Switch
                                checked={
                                    true
                                }
                                disabled
                                aria-label="Security alerts are mandatory"
                            />

                        </div>

                    </div>
                </div>


                {/* ==================================================
                    AI APPROVAL MODE
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <Settings2 className="h-5 w-5 text-primary" />

                            <div>
                                <h2 className="text-lg font-bold">
                                    AI Suggestion Approval Mode
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Choose how AI-generated suggestions are handled.
                                </p>
                            </div>

                        </div>

                    </div>


                    <div className="grid gap-4 p-6 md:grid-cols-2">

                        {AI_CONFIGURATION.approvalModes.map(
                            (mode) => {
                                const selected =
                                    preferences.approvalMode ===
                                    mode.id;

                                return (
                                    <button
                                        key={
                                            mode.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleApprovalModeChange(
                                                mode.id
                                            )
                                        }
                                        disabled={
                                            !preferences.aiEnabled
                                        }
                                        className={`rounded-xl border p-5 text-left transition ${
                                            selected
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-border bg-background hover:border-primary/50 hover:bg-accent"
                                        } ${
                                            !preferences.aiEnabled
                                                ? "cursor-not-allowed opacity-60"
                                                : ""
                                        }`}
                                    >

                                        <div className="flex items-center justify-between">

                                            <h3 className="font-semibold">
                                                {
                                                    mode.name
                                                }
                                            </h3>

                                            <div
                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                    selected
                                                        ? "border-primary bg-primary"
                                                        : "border-muted-foreground/30"
                                                }`}
                                            >
                                                {selected && (
                                                    <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                                                )}
                                            </div>

                                        </div>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {
                                                mode.description
                                            }
                                        </p>

                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    AI DATA USAGE
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <ShieldCheck className="h-5 w-5 text-primary" />

                            <div>
                                <h2 className="text-lg font-bold">
                                    AI Data Usage Preferences
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Control how much authorized system data can be used by AI features.
                                </p>
                            </div>

                        </div>

                    </div>


                    <div className="grid gap-4 p-6 md:grid-cols-3">

                        {AI_CONFIGURATION.dataUsageModes.map(
                            (mode) => {
                                const selected =
                                    preferences.dataUsage ===
                                    mode.id;

                                return (
                                    <button
                                        key={
                                            mode.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleDataUsageChange(
                                                mode.id
                                            )
                                        }
                                        disabled={
                                            !preferences.aiEnabled
                                        }
                                        className={`rounded-xl border p-5 text-left transition ${
                                            selected
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-border bg-background hover:border-primary/50 hover:bg-accent"
                                        } ${
                                            !preferences.aiEnabled
                                                ? "cursor-not-allowed opacity-60"
                                                : ""
                                        }`}
                                    >

                                        <div className="flex items-center justify-between">

                                            <h3 className="font-semibold">
                                                {
                                                    mode.name
                                                }
                                            </h3>

                                            <div
                                                className={`h-5 w-5 rounded-full border-2 ${
                                                    selected
                                                        ? "border-primary bg-primary"
                                                        : "border-muted-foreground/30"
                                                }`}
                                            />

                                        </div>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {
                                                mode.description
                                            }
                                        </p>

                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    AI ANALYSIS FREQUENCY
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <BrainCircuit className="h-5 w-5 text-primary" />

                            <div>
                                <h2 className="text-lg font-bold">
                                    AI Analysis Frequency
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure how frequently scheduled AI analysis can run.
                                </p>
                            </div>

                        </div>

                    </div>


                    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

                        {AI_CONFIGURATION.analysisFrequencies.map(
                            (frequency) => {
                                const selected =
                                    preferences.analysisFrequency ===
                                    frequency.id;

                                return (
                                    <button
                                        key={
                                            frequency.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleAnalysisFrequencyChange(
                                                frequency.id
                                            )
                                        }
                                        disabled={
                                            !preferences.aiEnabled
                                        }
                                        className={`rounded-xl border p-4 text-left transition ${
                                            selected
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-border bg-background hover:border-primary/50 hover:bg-accent"
                                        } ${
                                            !preferences.aiEnabled
                                                ? "cursor-not-allowed opacity-60"
                                                : ""
                                        }`}
                                    >

                                        <div className="flex items-center justify-between">

                                            <span className="font-semibold">
                                                {
                                                    frequency.name
                                                }
                                            </span>

                                            <div
                                                className={`h-4 w-4 rounded-full border-2 ${
                                                    selected
                                                        ? "border-primary bg-primary"
                                                        : "border-muted-foreground/30"
                                                }`}
                                            />

                                        </div>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {
                                                frequency.description
                                            }
                                        </p>

                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    CONFIGURATION REVIEW
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">

                    <div className="mb-4 flex items-center gap-3">

                        <Info className="h-5 w-5 text-primary" />

                        <div>
                            <h2 className="font-bold">
                                AI Configuration Review
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Review the current configuration before saving.
                            </p>
                        </div>

                    </div>


                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                AI Features
                            </p>

                            <p className="mt-1 font-semibold">
                                {preferences.aiEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </p>
                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                Recommendations
                            </p>

                            <p className="mt-1 font-semibold">
                                {preferences.recommendationsEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </p>
                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                Risk Analysis
                            </p>

                            <p className="mt-1 font-semibold">
                                {preferences.riskAnalysisEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </p>
                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                Approval Mode
                            </p>

                            <p className="mt-1 font-semibold">
                                {preferences.approvalMode ===
                                "manual"
                                    ? "Manual"
                                    : "Automatic"}
                            </p>
                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                Data Usage
                            </p>

                            <p className="mt-1 font-semibold capitalize">
                                {
                                    preferences.dataUsage
                                }
                            </p>
                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                Analysis Frequency
                            </p>

                            <p className="mt-1 font-semibold capitalize">
                                {
                                    preferences.analysisFrequency
                                }
                            </p>
                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                AI Notifications
                            </p>

                            <p className="mt-1 font-semibold">
                                {preferences.notificationsEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </p>
                        </div>


                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                Security Alerts
                            </p>

                            <p className="mt-1 font-semibold">
                                Always Enabled
                            </p>
                        </div>

                    </div>

                </div>


                {/* ==================================================
                    IMPORTANT RULE
                ================================================== */}

                <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">

                    <div className="flex gap-3">

                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div>

                            <p className="font-semibold">
                                AI Security Rule
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                AI preferences cannot override authorization,
                                security, privacy, or permission rules.
                                Mandatory security alerts remain enabled.
                                AI-generated recommendations cannot grant
                                additional system access.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:flex-row sm:justify-end">

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
                                AI Preference Rules
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                AI preferences are stored per user.
                                Only authorized administrators can modify
                                these settings. AI configuration is
                                validated before saving, mandatory security
                                rules cannot be disabled, and preference
                                changes are recorded in the activity log.
                                These settings do not grant additional
                                permissions or access to protected data.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default AIPreferences;