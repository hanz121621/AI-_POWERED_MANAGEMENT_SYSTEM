// ============================================================
// AIPMS DASHBOARD PREFERENCES CONFIGURATION
//
// SET-004 — Configure Dashboard Preferences
//
// This configuration defines the dashboard widgets available
// to Managers. Preferences are stored separately from this
// configuration so the dashboard is not hard-coded to a user's
// personal choices.
// ============================================================

// ============================================================
// STORAGE KEY
// ============================================================

export const DASHBOARD_PREFERENCES_STORAGE_KEY =
    "aipms_manager_dashboard_preferences";

// ============================================================
// CONFIGURATION VERSION
// ============================================================

export const DASHBOARD_PREFERENCES_VERSION = 1;

// ============================================================
// DASHBOARD WIDGETS
// ============================================================
//
// Each widget contains:
// - id          → unique identifier
// - title       → display name
// - description → explanation shown in Settings
// - defaultVisible → visibility for new Managers
// - defaultOrder   → default dashboard position
// - permission     → permission required to display the widget
//
// The Manager's saved preferences should control visibility
// and order. The permission requirement must still be checked
// by the Dashboard before rendering protected information.
// ============================================================

export const DASHBOARD_WIDGETS = [
    {
        id: "project-progress",
        title: "Project Progress",
        description:
            "Display progress information for projects you are authorized to access.",
        defaultVisible: true,
        defaultOrder: 1,
        permission: "projects.view",
    },

    {
        id: "sprint-progress",
        title: "Sprint Progress",
        description:
            "Display current sprint progress and sprint completion information.",
        defaultVisible: true,
        defaultOrder: 2,
        permission: "projects.view",
    },

    {
        id: "project-timeline",
        title: "Project Timeline",
        description:
            "Display project schedules, milestones, and timeline information.",
        defaultVisible: true,
        defaultOrder: 3,
        permission: "projects.view",
    },

    {
        id: "risks-issues",
        title: "Risks & Issues",
        description:
            "Display project risks, issues, and items requiring attention.",
        defaultVisible: true,
        defaultOrder: 4,
        permission: "reports.system.view",
    },

    {
        id: "team-progress",
        title: "Team Progress",
        description:
            "Display team progress and team performance information.",
        defaultVisible: true,
        defaultOrder: 5,
        permission: "teams.view",
    },

    {
        id: "deadline-information",
        title: "Deadline Information",
        description:
            "Display upcoming, approaching, and overdue deadlines.",
        defaultVisible: true,
        defaultOrder: 6,
        permission: "projects.view",
    },

    {
        id: "ai-recommendations",
        title: "AI Recommendations",
        description:
            "Display AI-generated recommendations relevant to your authorized projects.",
        defaultVisible: true,
        defaultOrder: 7,
        permission: "ai.view",
    },

    {
        id: "ai-risk-prediction",
        title: "AI Risk Prediction",
        description:
            "Display AI-generated project risk predictions.",
        defaultVisible: true,
        defaultOrder: 8,
        permission: "ai.view",
    },

    {
        id: "recent-activity",
        title: "Recent Activity",
        description:
            "Display recent activities related to your authorized projects and teams.",
        defaultVisible: true,
        defaultOrder: 9,
        permission: "reports.system.view",
    },

    {
        id: "notifications",
        title: "Notifications",
        description:
            "Display your latest notifications and important alerts.",
        defaultVisible: true,
        defaultOrder: 10,
        permission: "dashboard.view",
    },
];

// ============================================================
// DEFAULT DASHBOARD PREFERENCES
// ============================================================
//
// New Managers receive these preferences automatically.
//
// Example:
//
// {
//     version: 1,
//     widgets: {
//         "project-progress": {
//             visible: true,
//             order: 1
//         },
//         ...
//     }
// }
//
// This is generated from DASHBOARD_WIDGETS rather than
// duplicating the widget list manually.
// ============================================================

export const DEFAULT_DASHBOARD_PREFERENCES = {
    version: DASHBOARD_PREFERENCES_VERSION,

    widgets: DASHBOARD_WIDGETS.reduce(
        (preferences, widget) => {
            preferences[widget.id] = {
                visible: widget.defaultVisible,
                order: widget.defaultOrder,
            };

            return preferences;
        },
        {}
    ),
};

// ============================================================
// CREATE DEFAULT PREFERENCES
// ============================================================
//
// Returns a fresh copy so the original default configuration
// cannot accidentally be modified.
// ============================================================

export function createDefaultDashboardPreferences() {
    return JSON.parse(
        JSON.stringify(DEFAULT_DASHBOARD_PREFERENCES)
    );
}

// ============================================================
// GET WIDGET BY ID
// ============================================================

export function getDashboardWidget(widgetId) {
    return (
        DASHBOARD_WIDGETS.find(
            (widget) => widget.id === widgetId
        ) || null
    );
}

// ============================================================
// GET ALL WIDGETS
// ============================================================

export function getDashboardWidgets() {
    return [...DASHBOARD_WIDGETS].sort(
        (a, b) => a.defaultOrder - b.defaultOrder
    );
}

// ============================================================
// GET VISIBLE WIDGETS
// ============================================================
//
// This function only evaluates the user's saved visibility.
// Permission checking should happen separately because
// permissions belong to the authenticated Manager.
// ============================================================

export function getVisibleDashboardWidgets(
    preferences
) {
    const safePreferences =
        preferences &&
        typeof preferences === "object"
            ? preferences
            : createDefaultDashboardPreferences();

    return DASHBOARD_WIDGETS.filter((widget) => {
        const widgetPreference =
            safePreferences.widgets?.[widget.id];

        if (!widgetPreference) {
            return widget.defaultVisible;
        }

        return widgetPreference.visible === true;
    }).sort((a, b) => {
        const orderA =
            safePreferences.widgets?.[a.id]?.order ??
            a.defaultOrder;

        const orderB =
            safePreferences.widgets?.[b.id]?.order ??
            b.defaultOrder;

        return orderA - orderB;
    });
}

// ============================================================
// NORMALIZE PREFERENCES
// ============================================================
//
// Protects the application from incomplete, outdated, or
// manually modified localStorage data.
//
// Any new widget added to the system automatically receives
// its configured default settings.
// ============================================================

export function normalizeDashboardPreferences(
    preferences
) {
    const defaults =
        createDefaultDashboardPreferences();

    const incoming =
        preferences &&
        typeof preferences === "object"
            ? preferences
            : {};

    const incomingWidgets =
        incoming.widgets &&
        typeof incoming.widgets === "object"
            ? incoming.widgets
            : {};

    const normalizedWidgets = {};

    DASHBOARD_WIDGETS.forEach((widget) => {
        const savedWidget =
            incomingWidgets[widget.id];

        normalizedWidgets[widget.id] = {
            visible:
                typeof savedWidget?.visible === "boolean"
                    ? savedWidget.visible
                    : defaults.widgets[widget.id]
                          .visible,

            order:
                Number.isFinite(savedWidget?.order)
                    ? savedWidget.order
                    : defaults.widgets[widget.id]
                          .order,
        };
    });

    return {
        version: DASHBOARD_PREFERENCES_VERSION,
        widgets: normalizedWidgets,
    };
}

// ============================================================
// VALIDATE PREFERENCES
// ============================================================
//
// Returns:
//
// {
//     valid: true,
//     errors: []
// }
//
// or:
//
// {
//     valid: false,
//     errors: [...]
// }
// ============================================================

export function validateDashboardPreferences(
    preferences
) {
    const errors = [];

    if (
        !preferences ||
        typeof preferences !== "object"
    ) {
        errors.push(
            "Dashboard preferences must be an object."
        );

        return {
            valid: false,
            errors,
        };
    }

    if (
        !preferences.widgets ||
        typeof preferences.widgets !== "object"
    ) {
        errors.push(
            "Dashboard widget preferences are required."
        );

        return {
            valid: false,
            errors,
        };
    }

    DASHBOARD_WIDGETS.forEach((widget) => {
        const preference =
            preferences.widgets[widget.id];

        if (!preference) {
            errors.push(
                `Missing preference for widget: ${widget.title}.`
            );

            return;
        }

        if (
            typeof preference.visible !==
            "boolean"
        ) {
            errors.push(
                `${widget.title}: visibility must be true or false.`
            );
        }

        if (
            !Number.isFinite(preference.order)
        ) {
            errors.push(
                `${widget.title}: order must be a valid number.`
            );
        }
    });

    return {
        valid: errors.length === 0,
        errors,
    };
}

// ============================================================
// SAVE DASHBOARD PREFERENCES
// ============================================================
//
// SET-004 Rule:
// Preferences must persist across sessions.
//
// Preferences are stored in localStorage for the
// authenticated Manager's browser session.
// ============================================================

export function saveDashboardPreferences(
    preferences
) {
    const normalized =
        normalizeDashboardPreferences(
            preferences
        );

    const validation =
        validateDashboardPreferences(
            normalized
        );

    if (!validation.valid) {
        throw new Error(
            validation.errors.join(" ")
        );
    }

    localStorage.setItem(
        DASHBOARD_PREFERENCES_STORAGE_KEY,
        JSON.stringify(normalized)
    );

    // Keep a generic application key as well so other
    // dashboard components can easily access the preference.
    localStorage.setItem(
        "aipms_dashboard_preferences",
        JSON.stringify(normalized)
    );

    window.dispatchEvent(
        new CustomEvent(
            "aipms-dashboard-preferences-changed",
            {
                detail: normalized,
            }
        )
    );

    return normalized;
}

// ============================================================
// LOAD DASHBOARD PREFERENCES
// ============================================================
//
// If no preferences exist, default settings are returned.
//
// This satisfies:
// "The system must provide default dashboard settings
// for new users."
// ============================================================

export function loadDashboardPreferences() {
    try {
        const storedPreferences =
            localStorage.getItem(
                DASHBOARD_PREFERENCES_STORAGE_KEY
            );

        if (!storedPreferences) {
            return createDefaultDashboardPreferences();
        }

        const parsedPreferences =
            JSON.parse(storedPreferences);

        return normalizeDashboardPreferences(
            parsedPreferences
        );
    } catch (error) {
        console.error(
            "Failed to load dashboard preferences:",
            error
        );

        return createDefaultDashboardPreferences();
    }
}

// ============================================================
// RESET DASHBOARD PREFERENCES
// ============================================================

export function resetDashboardPreferences() {
    const defaults =
        createDefaultDashboardPreferences();

    saveDashboardPreferences(defaults);

    return defaults;
}

// ============================================================
// UPDATE WIDGET VISIBILITY
// ============================================================

export function updateDashboardWidgetVisibility(
    preferences,
    widgetId,
    visible
) {
    const widget =
        getDashboardWidget(widgetId);

    if (!widget) {
        throw new Error(
            `Dashboard widget "${widgetId}" does not exist.`
        );
    }

    if (typeof visible !== "boolean") {
        throw new Error(
            "Widget visibility must be true or false."
        );
    }

    const normalized =
        normalizeDashboardPreferences(
            preferences
        );

    normalized.widgets[widgetId].visible =
        visible;

    return normalized;
}

// ============================================================
// UPDATE WIDGET ORDER
// ============================================================

export function updateDashboardWidgetOrder(
    preferences,
    widgetId,
    order
) {
    const widget =
        getDashboardWidget(widgetId);

    if (!widget) {
        throw new Error(
            `Dashboard widget "${widgetId}" does not exist.`
        );
    }

    if (!Number.isFinite(order)) {
        throw new Error(
            "Widget order must be a valid number."
        );
    }

    const normalized =
        normalizeDashboardPreferences(
            preferences
        );

    normalized.widgets[widgetId].order =
        order;

    return normalized;
}

// ============================================================
// MOVE WIDGET
// ============================================================
//
// Moves a widget from one position to another while
// automatically updating the other widget positions.
// ============================================================

export function moveDashboardWidget(
    preferences,
    widgetId,
    newOrder
) {
    const normalized =
        normalizeDashboardPreferences(
            preferences
        );

    const widgetIds =
        DASHBOARD_WIDGETS.map(
            (widget) => widget.id
        ).sort((a, b) => {
            const orderA =
                normalized.widgets[a].order;

            const orderB =
                normalized.widgets[b].order;

            return orderA - orderB;
        });

    const currentIndex =
        widgetIds.indexOf(widgetId);

    if (currentIndex === -1) {
        throw new Error(
            `Dashboard widget "${widgetId}" does not exist.`
        );
    }

    const targetIndex = Math.max(
        0,
        Math.min(
            Number(newOrder) - 1,
            widgetIds.length - 1
        )
    );

    const [movedWidget] =
        widgetIds.splice(
            currentIndex,
            1
        );

    widgetIds.splice(
        targetIndex,
        0,
        movedWidget
    );

    widgetIds.forEach(
        (id, index) => {
            normalized.widgets[id].order =
                index + 1;
        }
    );

    return normalized;
}

// ============================================================
// CHECK WIDGET PERMISSION
// ============================================================
//
// The Dashboard should call this before rendering protected
// widget information.
//
// Supports a permission function so this configuration does
// not depend directly on the application's auth service.
// ============================================================

export function canDisplayDashboardWidget(
    widgetId,
    hasPermission
) {
    const widget =
        getDashboardWidget(widgetId);

    if (!widget) {
        return false;
    }

    // Widgets without a permission requirement are available.
    if (!widget.permission) {
        return true;
    }

    if (
        typeof hasPermission !==
        "function"
    ) {
        return false;
    }

    return Boolean(
        hasPermission(
            widget.permission
        )
    );
}

// ============================================================
// GET AUTHORIZED VISIBLE WIDGETS
// ============================================================
//
// Combines:
// 1. Manager preferences
// 2. Widget visibility
// 3. Manager permissions
//
// This is the function the Manager Dashboard can use when
// deciding which widgets to render.
// ============================================================

export function getAuthorizedDashboardWidgets(
    preferences,
    hasPermission
) {
    const visibleWidgets =
        getVisibleDashboardWidgets(
            preferences
        );

    return visibleWidgets.filter(
        (widget) =>
            canDisplayDashboardWidget(
                widget.id,
                hasPermission
            )
    );
}

// ============================================================
// EXPORT DEFAULT CONFIGURATION
// ============================================================

const dashboardPreferencesConfig = {
    storageKey:
        DASHBOARD_PREFERENCES_STORAGE_KEY,

    version:
        DASHBOARD_PREFERENCES_VERSION,

    widgets: DASHBOARD_WIDGETS,

    defaults:
        DEFAULT_DASHBOARD_PREFERENCES,

    createDefaultDashboardPreferences,

    getDashboardWidget,

    getDashboardWidgets,

    getVisibleDashboardWidgets,

    normalizeDashboardPreferences,

    validateDashboardPreferences,

    saveDashboardPreferences,

    loadDashboardPreferences,

    resetDashboardPreferences,

    updateDashboardWidgetVisibility,

    updateDashboardWidgetOrder,

    moveDashboardWidget,

    canDisplayDashboardWidget,

    getAuthorizedDashboardWidgets,
};

export default dashboardPreferencesConfig;