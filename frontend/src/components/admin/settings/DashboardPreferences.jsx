import { useEffect, useState } from "react";

import {
    BarChart3,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    GripVertical,
    LayoutDashboard,
    ListFilter,
    RotateCcw,
    Save,
    Settings2,
    Users,
    X,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// ============================================================
// SETTING-004: CONFIGURE DASHBOARD PREFERENCES
//
// Admin can configure:
// - Enable / disable dashboard widgets
// - Widget order
// - Default dashboard view
// - Displayed metrics
// - Default filters
// - Project information visibility
//
// Preferences are stored per user.
// ============================================================


// ============================================================
// AVAILABLE DASHBOARD WIDGETS
// ============================================================

const DASHBOARD_WIDGETS = [
    {
        id: "statistics",
        name: "Statistics",
        description:
            "Display important project and system statistics.",
        icon: BarChart3,
    },
    {
        id: "project-overview",
        name: "Project Overview",
        description:
            "Show an overview of active and completed projects.",
        icon: LayoutDashboard,
    },
    {
        id: "recent-activity",
        name: "Recent Activity",
        description:
            "Display recent actions performed in the system.",
        icon: ListFilter,
    },
    {
        id: "team-performance",
        name: "Team Performance",
        description:
            "Show team productivity and performance information.",
        icon: Users,
    },
    {
        id: "project-progress",
        name: "Project Progress",
        description:
            "Display project progress and completion information.",
        icon: BarChart3,
    },
];


// ============================================================
// DEFAULT DASHBOARD CONFIGURATION
// ============================================================

const DEFAULT_DASHBOARD_PREFERENCES = {
    widgets: [
        "statistics",
        "project-overview",
        "recent-activity",
        "team-performance",
        "project-progress",
    ],

    defaultView: "overview",

    metrics: {
        totalProjects: true,
        activeProjects: true,
        completedProjects: true,
        totalUsers: true,
        activeTasks: true,
    },

    filters: {
        projectStatus: "all",
        team: "all",
        timeRange: "30",
    },

    projectVisibility: "full",
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
// GET ALL USERS
// ============================================================

function getUsers() {
    try {
        const storedUsers = localStorage.getItem("users");

        if (!storedUsers) {
            return [];
        }

        const parsedUsers = JSON.parse(storedUsers);

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
// DEEP CLONE
// ============================================================

function clonePreferences(preferences) {
    return JSON.parse(
        JSON.stringify(preferences)
    );
}


// ============================================================
// ADD ACTIVITY / AUDIT LOG
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
// VALIDATE DASHBOARD CONFIGURATION
// ============================================================

function validateDashboardPreferences(
    preferences
) {
    if (!preferences) {
        return false;
    }

    // --------------------------------------------------------
    // WIDGET VALIDATION
    // --------------------------------------------------------

    if (
        !Array.isArray(
            preferences.widgets
        )
    ) {
        return false;
    }

    const availableWidgetIds =
        DASHBOARD_WIDGETS.map(
            (widget) => widget.id
        );

    const widgetsAreValid =
        preferences.widgets.every(
            (widgetId) =>
                availableWidgetIds.includes(
                    widgetId
                )
        );

    if (!widgetsAreValid) {
        return false;
    }

    // No duplicate widgets
    if (
        new Set(
            preferences.widgets
        ).size !==
        preferences.widgets.length
    ) {
        return false;
    }

    // --------------------------------------------------------
    // DEFAULT VIEW VALIDATION
    // --------------------------------------------------------

    if (
        ![
            "overview",
            "projects",
            "performance",
        ].includes(
            preferences.defaultView
        )
    ) {
        return false;
    }

    // --------------------------------------------------------
    // METRICS VALIDATION
    // --------------------------------------------------------

    if (
        !preferences.metrics ||
        typeof preferences.metrics !==
            "object"
    ) {
        return false;
    }

    // --------------------------------------------------------
    // FILTER VALIDATION
    // --------------------------------------------------------

    if (
        !preferences.filters ||
        typeof preferences.filters !==
            "object"
    ) {
        return false;
    }

    const validProjectStatuses = [
        "all",
        "active",
        "completed",
        "archived",
    ];

    const validTeams = [
        "all",
        "development",
        "management",
        "qa",
    ];

    const validTimeRanges = [
        "7",
        "30",
        "90",
        "365",
    ];

    if (
        !validProjectStatuses.includes(
            preferences.filters.projectStatus
        )
    ) {
        return false;
    }

    if (
        !validTeams.includes(
            preferences.filters.team
        )
    ) {
        return false;
    }

    if (
        !validTimeRanges.includes(
            preferences.filters.timeRange
        )
    ) {
        return false;
    }

    // --------------------------------------------------------
    // PROJECT VISIBILITY VALIDATION
    // --------------------------------------------------------

    if (
        ![
            "full",
            "summary",
            "hidden",
        ].includes(
            preferences.projectVisibility
        )
    ) {
        return false;
    }

    return true;
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function DashboardPreferences({
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
            DEFAULT_DASHBOARD_PREFERENCES
        )
    );

    const [
        originalPreferences,
        setOriginalPreferences,
    ] = useState(
        clonePreferences(
            DEFAULT_DASHBOARD_PREFERENCES
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
    // LOAD PREFERENCES
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
                                "User preferences not found.",
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


                // ------------------------------------------------
                // LOAD SAVED PREFERENCES
                // ------------------------------------------------

                const savedPreferences =
                    foundUser.dashboardPreferences;

                let loadedPreferences =
                    clonePreferences(
                        DEFAULT_DASHBOARD_PREFERENCES
                    );


                if (
                    savedPreferences &&
                    typeof savedPreferences ===
                        "object"
                ) {

                    loadedPreferences = {

                        ...loadedPreferences,

                        ...savedPreferences,

                        metrics: {
                            ...loadedPreferences.metrics,
                            ...(savedPreferences.metrics || {}),
                        },

                        filters: {
                            ...loadedPreferences.filters,
                            ...(savedPreferences.filters || {}),
                        },
                    };
                }


                // ------------------------------------------------
                // VALIDATE LOADED DATA
                // ------------------------------------------------

                if (
                    !validateDashboardPreferences(
                        loadedPreferences
                    )
                ) {

                    loadedPreferences =
                        clonePreferences(
                            DEFAULT_DASHBOARD_PREFERENCES
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
                    "Unable to load dashboard preferences:",
                    error
                );

                if (isMounted) {

                    setMessage({
                        type: "error",
                        text:
                            "Unable to load dashboard preferences. Please try again.",
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
    // TOGGLE WIDGET
    // ========================================================

    const handleWidgetToggle = (
        widgetId,
        enabled
    ) => {

        setPreferences(
            (previous) => {

                const currentWidgets =
                    previous.widgets || [];

                if (enabled) {

                    if (
                        currentWidgets.includes(
                            widgetId
                        )
                    ) {
                        return previous;
                    }

                    return {
                        ...previous,

                        widgets: [
                            ...currentWidgets,
                            widgetId,
                        ],
                    };
                }

                return {
                    ...previous,

                    widgets:
                        currentWidgets.filter(
                            (id) =>
                                id !==
                                widgetId
                        ),
                };
            }
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // MOVE WIDGET UP
    // ========================================================

    const moveWidgetUp = (index) => {

        if (index <= 0) {
            return;
        }

        setPreferences(
            (previous) => {

                const widgets = [
                    ...previous.widgets,
                ];

                [
                    widgets[index - 1],
                    widgets[index],
                ] = [
                    widgets[index],
                    widgets[index - 1],
                ];

                return {
                    ...previous,
                    widgets,
                };
            }
        );
    };


    // ========================================================
    // MOVE WIDGET DOWN
    // ========================================================

    const moveWidgetDown = (index) => {

        setPreferences(
            (previous) => {

                if (
                    index >=
                    previous.widgets.length - 1
                ) {
                    return previous;
                }

                const widgets = [
                    ...previous.widgets,
                ];

                [
                    widgets[index],
                    widgets[index + 1],
                ] = [
                    widgets[index + 1],
                    widgets[index],
                ];

                return {
                    ...previous,
                    widgets,
                };
            }
        );
    };


    // ========================================================
    // CHANGE DEFAULT VIEW
    // FIXED: THIS FUNCTION IS NOW USED BY THE UI
    // ========================================================

    const handleDefaultViewChange = (
        event
    ) => {

        const value =
            event.target.value;

        setPreferences(
            (previous) => ({
                ...previous,

                defaultView: value,
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // CHANGE METRIC
    // ========================================================

    const handleMetricChange = (
        metric,
        enabled
    ) => {

        setPreferences(
            (previous) => ({
                ...previous,

                metrics: {
                    ...previous.metrics,

                    [metric]:
                        enabled,
                },
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // CHANGE FILTER
    // ========================================================

    const handleFilterChange = (
        filter,
        value
    ) => {

        setPreferences(
            (previous) => ({
                ...previous,

                filters: {
                    ...previous.filters,

                    [filter]:
                        value,
                },
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // CHANGE PROJECT VISIBILITY
    // FIXED: THIS FUNCTION IS NOW USED BY THE UI
    // ========================================================

    const handleProjectVisibilityChange = (
        event
    ) => {

        const value =
            event.target.value;

        setPreferences(
            (previous) => ({
                ...previous,

                projectVisibility:
                    value,
            })
        );

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // RESET TO DEFAULT
    // ========================================================

    const handleReset = () => {

        const defaults =
            clonePreferences(
                DEFAULT_DASHBOARD_PREFERENCES
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

        if (
            !validateDashboardPreferences(
                preferences
            )
        ) {

            setMessage({
                type: "error",
                text:
                    "Invalid dashboard settings.",
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
                    "User preferences not found.",
            });

            return;
        }


        try {

            setIsSaving(true);


            const users =
                getUsers();


            // ------------------------------------------------
            // FIND CURRENT USER
            // ------------------------------------------------

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
            // USER NOT IN USERS ARRAY
            // ------------------------------------------------

            if (
                currentIndex === -1
            ) {

                users.push({
                    ...currentUser,
                });

                currentIndex =
                    users.length - 1;
            }


            // ------------------------------------------------
            // UPDATE USER
            // ------------------------------------------------

            const existingUser =
                users[currentIndex];

            const updatedUser = {

                ...existingUser,

                dashboardPreferences:
                    clonePreferences(
                        preferences
                    ),
            };


            // ------------------------------------------------
            // SAVE USERS
            // ------------------------------------------------

            const updatedUsers = [
                ...users,
            ];

            updatedUsers[
                currentIndex
            ] = updatedUser;

            saveUsers(
                updatedUsers
            );


            // ------------------------------------------------
            // UPDATE LOGGED-IN USER
            // ------------------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );


            // ------------------------------------------------
            // SAVE SEPARATE PREFERENCE
            // ------------------------------------------------

            localStorage.setItem(
                "dashboardPreferences",
                JSON.stringify(
                    preferences
                )
            );


            // ------------------------------------------------
            // ACTIVITY / AUDIT LOG
            // ------------------------------------------------

            addActivityLog(
                updatedUser,
                "Updated dashboard preferences"
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
                    "Dashboard preferences updated successfully.",
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
                "Dashboard preference update error:",
                error
            );

            setMessage({
                type: "error",
                text:
                    "Unable to update dashboard preferences. Please try again.",
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
                        Loading dashboard preferences...
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
                    PAGE HEADER
                ================================================== */}

                <div className="mb-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                            <LayoutDashboard className="h-6 w-6" />

                        </div>

                        <div>

                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Dashboard Preferences
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Customize your dashboard layout and the information displayed.
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
                    WIDGET SETTINGS
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <Settings2 className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    Dashboard Widgets
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Enable or disable widgets and change their display order.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="space-y-3 p-6">

                        {DASHBOARD_WIDGETS.map(
                            (widget) => {

                                const Icon =
                                    widget.icon;

                                const enabled =
                                    preferences.widgets.includes(
                                        widget.id
                                    );

                                const widgetIndex =
                                    preferences.widgets.indexOf(
                                        widget.id
                                    );

                                return (
                                    <div
                                        key={
                                            widget.id
                                        }
                                        className={`flex flex-col gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center ${
                                            enabled
                                                ? "border-border bg-background"
                                                : "border-border/60 bg-muted/30 opacity-70"
                                        }`}
                                    >

                                        {/* ICON */}

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">

                                                <Icon className="h-5 w-5" />

                                            </div>

                                        </div>


                                        {/* INFORMATION */}

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-center gap-2">

                                                <h3 className="font-semibold text-foreground">
                                                    {
                                                        widget.name
                                                    }
                                                </h3>

                                                {enabled ? (
                                                    <Eye className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                )}

                                            </div>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {
                                                    widget.description
                                                }
                                            </p>

                                        </div>


                                        {/* ORDER */}

                                        {enabled && (

                                            <div className="flex items-center gap-1">

                                                <GripVertical className="mr-1 hidden h-5 w-5 text-muted-foreground sm:block" />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={
                                                        widgetIndex <=
                                                        0
                                                    }
                                                    onClick={() =>
                                                        moveWidgetUp(
                                                            widgetIndex
                                                        )
                                                    }
                                                >
                                                    ↑
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={
                                                        widgetIndex ===
                                                        preferences.widgets.length -
                                                            1
                                                    }
                                                    onClick={() =>
                                                        moveWidgetDown(
                                                            widgetIndex
                                                        )
                                                    }
                                                >
                                                    ↓
                                                </Button>

                                            </div>

                                        )}


                                        {/* SWITCH */}

                                        <Switch
                                            checked={
                                                enabled
                                            }
                                            onCheckedChange={(
                                                checked
                                            ) =>
                                                handleWidgetToggle(
                                                    widget.id,
                                                    checked
                                                )
                                            }
                                            aria-label={`Enable ${widget.name}`}
                                        />

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    DASHBOARD VIEW
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <h2 className="text-lg font-bold">
                            Default Dashboard View
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Select the dashboard view shown when you open the dashboard.
                        </p>

                    </div>


                    <div className="grid gap-4 p-6 md:grid-cols-3">

                        {[
                            {
                                id: "overview",
                                name: "Overview",
                                description:
                                    "General dashboard overview.",
                            },
                            {
                                id: "projects",
                                name: "Projects",
                                description:
                                    "Focus on project information.",
                            },
                            {
                                id: "performance",
                                name: "Performance",
                                description:
                                    "Focus on teams and performance.",
                            },
                        ].map(
                            (view) => {

                                const selected =
                                    preferences.defaultView ===
                                    view.id;

                                return (
                                    <label
                                        key={
                                            view.id
                                        }
                                        className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                                            selected
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-border bg-background hover:border-primary/50 hover:bg-accent"
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name="defaultDashboardView"
                                            value={
                                                view.id
                                            }
                                            checked={
                                                selected
                                            }
                                            onChange={
                                                handleDefaultViewChange
                                            }
                                            className="sr-only"
                                        />

                                        <div className="flex items-center justify-between">

                                            <h3 className="font-semibold text-foreground">
                                                {
                                                    view.name
                                                }
                                            </h3>

                                            <div
                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                    selected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-muted-foreground/30"
                                                }`}
                                            >

                                                {selected && (
                                                    <Check className="h-3 w-3" />
                                                )}

                                            </div>

                                        </div>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {
                                                view.description
                                            }
                                        </p>

                                    </label>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    DISPLAYED METRICS
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <h2 className="text-lg font-bold">
                            Displayed Metrics
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Choose which metrics should appear on your dashboard.
                        </p>

                    </div>


                    <div className="grid gap-4 p-6 md:grid-cols-2">

                        {[
                            {
                                id: "totalProjects",
                                name: "Total Projects",
                            },
                            {
                                id: "activeProjects",
                                name: "Active Projects",
                            },
                            {
                                id: "completedProjects",
                                name: "Completed Projects",
                            },
                            {
                                id: "totalUsers",
                                name: "Total Users",
                            },
                            {
                                id: "activeTasks",
                                name: "Active Tasks",
                            },
                        ].map(
                            (metric) => {

                                const enabled =
                                    preferences.metrics[
                                        metric.id
                                    ];

                                return (
                                    <div
                                        key={
                                            metric.id
                                        }
                                        className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
                                    >

                                        <div>

                                            <p className="font-medium text-foreground">
                                                {
                                                    metric.name
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Show this metric on the dashboard.
                                            </p>

                                        </div>

                                        <Switch
                                            checked={
                                                enabled
                                            }
                                            onCheckedChange={(
                                                checked
                                            ) =>
                                                handleMetricChange(
                                                    metric.id,
                                                    checked
                                                )
                                            }
                                        />

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    DEFAULT FILTERS
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <ListFilter className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    Default Filters
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Configure the default filters applied to dashboard information.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="grid gap-6 p-6 md:grid-cols-3">

                        {/* PROJECT STATUS */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Project Status
                            </label>

                            <select
                                value={
                                    preferences.filters.projectStatus
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "projectStatus",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                            >

                                <option value="all">
                                    All Projects
                                </option>

                                <option value="active">
                                    Active Projects
                                </option>

                                <option value="completed">
                                    Completed Projects
                                </option>

                                <option value="archived">
                                    Archived Projects
                                </option>

                            </select>

                        </div>


                        {/* TEAM */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Team
                            </label>

                            <select
                                value={
                                    preferences.filters.team
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "team",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                            >

                                <option value="all">
                                    All Teams
                                </option>

                                <option value="development">
                                    Development
                                </option>

                                <option value="management">
                                    Management
                                </option>

                                <option value="qa">
                                    Quality Assurance
                                </option>

                            </select>

                        </div>


                        {/* TIME RANGE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Time Range
                            </label>

                            <select
                                value={
                                    preferences.filters.timeRange
                                }
                                onChange={(event) =>
                                    handleFilterChange(
                                        "timeRange",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                            >

                                <option value="7">
                                    Last 7 Days
                                </option>

                                <option value="30">
                                    Last 30 Days
                                </option>

                                <option value="90">
                                    Last 90 Days
                                </option>

                                <option value="365">
                                    Last Year
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    PROJECT INFORMATION VISIBILITY
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    <div className="border-b border-border p-6">

                        <div className="flex items-center gap-3">

                            <Eye className="h-5 w-5 text-primary" />

                            <div>

                                <h2 className="text-lg font-bold">
                                    Project Information Visibility
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Choose how much project information is displayed on the dashboard.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="grid gap-4 p-6 md:grid-cols-3">

                        {[
                            {
                                id: "full",
                                name: "Full Information",
                                description:
                                    "Display complete project information available to you.",
                            },
                            {
                                id: "summary",
                                name: "Summary Only",
                                description:
                                    "Display summarized project information.",
                            },
                            {
                                id: "hidden",
                                name: "Hide Project Details",
                                description:
                                    "Do not display project details on the dashboard.",
                            },
                        ].map(
                            (option) => {

                                const selected =
                                    preferences.projectVisibility ===
                                    option.id;

                                return (
                                    <label
                                        key={
                                            option.id
                                        }
                                        className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                                            selected
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-border bg-background hover:border-primary/50 hover:bg-accent"
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name="projectVisibility"
                                            value={
                                                option.id
                                            }
                                            checked={
                                                selected
                                            }
                                            onChange={
                                                handleProjectVisibilityChange
                                            }
                                            className="sr-only"
                                        />

                                        <div className="flex items-center justify-between">

                                            <h3 className="font-semibold text-foreground">
                                                {
                                                    option.name
                                                }
                                            </h3>

                                            <div
                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                    selected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-muted-foreground/30"
                                                }`}
                                            >

                                                {selected && (
                                                    <Check className="h-3 w-3" />
                                                )}

                                            </div>

                                        </div>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {
                                                option.description
                                            }
                                        </p>

                                    </label>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    PREVIEW
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">

                    <div className="mb-4 flex items-center gap-3">

                        <LayoutDashboard className="h-5 w-5 text-primary" />

                        <div>

                            <h2 className="font-bold text-foreground">
                                Dashboard Preview
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Preview how your configured dashboard will be organized.
                            </p>

                        </div>

                    </div>


                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                        {preferences.widgets.map(
                            (widgetId) => {

                                const widget =
                                    DASHBOARD_WIDGETS.find(
                                        (item) =>
                                            item.id ===
                                            widgetId
                                    );

                                if (!widget) {
                                    return null;
                                }

                                const Icon =
                                    widget.icon;

                                return (
                                    <div
                                        key={
                                            widget.id
                                        }
                                        className="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm"
                                    >

                                        <div className="mb-3 flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">

                                                <Icon className="h-4 w-4" />

                                            </div>

                                            <span className="text-sm font-semibold">
                                                {
                                                    widget.name
                                                }
                                            </span>

                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Position{" "}
                                            {
                                                preferences.widgets.indexOf(
                                                    widget.id
                                                ) + 1
                                            }
                                        </p>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    {preferences.widgets.length ===
                        0 && (
                        <div className="rounded-xl border border-dashed border-border p-8 text-center">

                            <EyeOff className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                            <p className="font-medium text-foreground">
                                No widgets enabled
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Enable at least one dashboard widget.
                            </p>

                        </div>
                    )}

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

                            <p className="font-semibold text-foreground">
                                Dashboard Preference Rules
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Dashboard preferences are stored per
                                user. Only available dashboard widgets
                                can be enabled, widget order is
                                validated, and resetting preferences
                                restores the system-defined default
                                configuration. These settings do not
                                grant additional permissions or access
                                to restricted information.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DashboardPreferences;