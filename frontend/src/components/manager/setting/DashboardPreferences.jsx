
// ============================================================
// AIPMS — MANAGER DASHBOARD PREFERENCES
//
// Use Case:
// SET-004 — Configure Dashboard Preferences
//
// Primary Actor:
// Project Manager
//
// IMPORTANT:
// - Applies only to the authenticated Manager.
// - Controls dashboard widget visibility/order.
// - Does NOT modify project, sprint, team, or task data.
// - Preferences persist across sessions.
// - Widgets are centrally configured.
// - Unauthorized information cannot be enabled through settings.
// ============================================================

import React, { useEffect, useState } from "react";

import {
    LayoutDashboard,
    GripVertical,
    Eye,
    EyeOff,
    Save,
    RotateCcw,
    CheckCircle2,
    AlertTriangle,
    Info,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const DASHBOARD_PREFERENCES_KEY =
    "aipms_manager_dashboard_preferences";

// ============================================================
// CONFIGURED DASHBOARD WIDGETS
//
// These represent the widgets currently available to Managers.
// In the backend version, this configuration should come from
// configurable system data.
// ============================================================

const DASHBOARD_WIDGETS = [
    {
        id: "project-progress",
        name: "Project Progress",
        description:
            "Monitor overall progress of authorized projects.",
        permission: "dashboard.project.progress",
        defaultVisible: true,
    },
    {
        id: "sprint-progress",
        name: "Sprint Progress",
        description:
            "Monitor current Sprint progress.",
        permission: "dashboard.sprint.progress",
        defaultVisible: true,
    },
    {
        id: "project-timeline",
        name: "Project Timeline",
        description:
            "View project schedules and important dates.",
        permission: "dashboard.project.timeline",
        defaultVisible: true,
    },
    {
        id: "risks-issues",
        name: "Risks & Issues",
        description:
            "Monitor current project risks and issues.",
        permission: "dashboard.risks",
        defaultVisible: true,
    },
    {
        id: "team-progress",
        name: "Team Progress",
        description:
            "Review progress of assigned project Teams.",
        permission: "dashboard.team.progress",
        defaultVisible: true,
    },
    {
        id: "deadline-information",
        name: "Deadline Information",
        description:
            "View upcoming and overdue deadlines.",
        permission: "dashboard.deadlines",
        defaultVisible: true,
    },
    {
        id: "ai-recommendations",
        name: "AI Recommendations",
        description:
            "Display AI-generated project recommendations.",
        permission: "dashboard.ai.recommendations",
        defaultVisible: true,
    },
    {
        id: "ai-risk-prediction",
        name: "AI Risk Prediction",
        description:
            "Display AI-generated risk predictions.",
        permission: "dashboard.ai.risk",
        defaultVisible: true,
    },
    {
        id: "recent-activity",
        name: "Recent Activity",
        description:
            "Display recent authorized project activities.",
        permission: "dashboard.activity",
        defaultVisible: true,
    },
    {
        id: "notifications",
        name: "Notifications",
        description:
            "Display Manager notifications.",
        permission: "dashboard.notifications",
        defaultVisible: true,
    },
];

// ============================================================
// DEFAULT CONFIGURATION
// ============================================================

const getDefaultPreferences = () =>
    DASHBOARD_WIDGETS.map(
        (widget) => ({
            widgetId: widget.id,
            visible: widget.defaultVisible,
        })
    );

// ============================================================
// COMPONENT
// ============================================================

function DashboardPreferences() {
    const [preferences, setPreferences] =
        useState(getDefaultPreferences);

    const [savedPreferences, setSavedPreferences] =
        useState(getDefaultPreferences);

    const [draggedWidget, setDraggedWidget] =
        useState(null);

    const [isSaving, setIsSaving] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // LOAD SAVED DASHBOARD PREFERENCES
    // ========================================================

    useEffect(() => {
        try {
            const stored =
                localStorage.getItem(
                    DASHBOARD_PREFERENCES_KEY
                );

            if (!stored) {
                const defaults =
                    getDefaultPreferences();

                setPreferences(defaults);
                setSavedPreferences(defaults);

                return;
            }

            const parsed =
                JSON.parse(stored);

            if (
                !Array.isArray(parsed) ||
                !parsed.length
            ) {
                throw new Error(
                    "Invalid dashboard preferences."
                );
            }

            // ------------------------------------------------
            // Only accept widgets that are currently
            // configured and supported.
            // ------------------------------------------------

            const validWidgetIds =
                new Set(
                    DASHBOARD_WIDGETS.map(
                        (widget) =>
                            widget.id
                    )
                );

            const sanitized =
                parsed
                    .filter(
                        (item) =>
                            item &&
                            validWidgetIds.has(
                                item.widgetId
                            )
                    )
                    .map(
                        (item) => ({
                            widgetId:
                                item.widgetId,
                            visible:
                                Boolean(
                                    item.visible
                                ),
                        })
                    );

            // ------------------------------------------------
            // Add newly configured widgets that are not yet
            // present in the saved configuration.
            // ------------------------------------------------

            DASHBOARD_WIDGETS.forEach(
                (widget) => {
                    const exists =
                        sanitized.some(
                            (item) =>
                                item.widgetId ===
                                widget.id
                        );

                    if (!exists) {
                        sanitized.push({
                            widgetId:
                                widget.id,
                            visible:
                                widget.defaultVisible,
                        });
                    }
                }
            );

            setPreferences(sanitized);
            setSavedPreferences(sanitized);
        } catch (error) {
            console.error(
                "Failed to load dashboard preferences:",
                error
            );

            const defaults =
                getDefaultPreferences();

            setPreferences(defaults);
            setSavedPreferences(defaults);

            setErrorMessage(
                "Unable to load your dashboard preferences. Default settings were restored."
            );
        }
    }, []);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // GET WIDGET CONFIGURATION
    // ========================================================

    const getWidget = (widgetId) =>
        DASHBOARD_WIDGETS.find(
            (widget) =>
                widget.id === widgetId
        );

    // ========================================================
    // TOGGLE VISIBILITY
    // ========================================================

    const toggleWidget = (widgetId) => {
        clearMessages();

        setPreferences((current) =>
            current.map((item) =>
                item.widgetId === widgetId
                    ? {
                          ...item,
                          visible:
                              !item.visible,
                      }
                    : item
            )
        );
    };

    // ========================================================
    // MOVE WIDGET
    // ========================================================

    const moveWidget = (
        sourceId,
        targetId
    ) => {
        if (
            !sourceId ||
            !targetId ||
            sourceId === targetId
        ) {
            return;
        }

        setPreferences((current) => {
            const sourceIndex =
                current.findIndex(
                    (item) =>
                        item.widgetId ===
                        sourceId
                );

            const targetIndex =
                current.findIndex(
                    (item) =>
                        item.widgetId ===
                        targetId
                );

            if (
                sourceIndex === -1 ||
                targetIndex === -1
            ) {
                return current;
            }

            const updated = [...current];

            const [
                movedWidget,
            ] = updated.splice(
                sourceIndex,
                1
            );

            updated.splice(
                targetIndex,
                0,
                movedWidget
            );

            return updated;
        });
    };

    // ========================================================
    // DRAG HANDLERS
    // ========================================================

    const handleDragStart = (
        event,
        widgetId
    ) => {
        setDraggedWidget(widgetId);

        event.dataTransfer.effectAllowed =
            "move";

        event.dataTransfer.setData(
            "text/plain",
            widgetId
        );
    };

    const handleDragOver = (event) => {
        event.preventDefault();

        event.dataTransfer.dropEffect =
            "move";
    };

    const handleDrop = (
        event,
        targetId
    ) => {
        event.preventDefault();

        const sourceId =
            event.dataTransfer.getData(
                "text/plain"
            ) || draggedWidget;

        moveWidget(
            sourceId,
            targetId
        );

        setDraggedWidget(null);
    };

    const handleDragEnd = () => {
        setDraggedWidget(null);
    };

    // ========================================================
    // RESET TO DEFAULTS
    // ========================================================

    const handleReset = () => {
        clearMessages();

        const defaults =
            getDefaultPreferences();

        setPreferences(defaults);
    };

    // ========================================================
    // SAVE PREFERENCES
    // ========================================================

    const handleSave = async () => {
        clearMessages();

        // ----------------------------------------------------
        // Validate configuration
        // ----------------------------------------------------

        if (
            !Array.isArray(preferences) ||
            !preferences.length
        ) {
            setErrorMessage(
                "Dashboard configuration is invalid."
            );
            return;
        }

        const validWidgetIds =
            new Set(
                DASHBOARD_WIDGETS.map(
                    (widget) =>
                        widget.id
                )
            );

        const invalidWidget =
            preferences.some(
                (item) =>
                    !item ||
                    !validWidgetIds.has(
                        item.widgetId
                    )
            );

        if (invalidWidget) {
            setErrorMessage(
                "One or more dashboard widgets are invalid."
            );
            return;
        }

        setIsSaving(true);

        try {
            // ------------------------------------------------
            // Temporary frontend persistence.
            //
            // Replace with authenticated Manager API later.
            // ------------------------------------------------

            localStorage.setItem(
                DASHBOARD_PREFERENCES_KEY,
                JSON.stringify(
                    preferences
                )
            );

            setSavedPreferences(
                JSON.parse(
                    JSON.stringify(
                        preferences
                    )
                )
            );

            // ------------------------------------------------
            // Notify dashboard
            // ------------------------------------------------

            window.dispatchEvent(
                new CustomEvent(
                    "aipms-dashboard-preferences-changed",
                    {
                        detail: {
                            preferences,
                        },
                    }
                )
            );

            setSuccessMessage(
                "Dashboard preferences saved successfully."
            );
        } catch (error) {
            console.error(
                "Failed to save dashboard preferences:",
                error
            );

            setErrorMessage(
                "Unable to save your dashboard preferences. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CHECK CHANGES
    // ========================================================

    const hasChanges =
        JSON.stringify(preferences) !==
        JSON.stringify(savedPreferences);

    // ========================================================
    // VISIBLE COUNT
    // ========================================================

    const visibleCount =
        preferences.filter(
            (item) => item.visible
        ).length;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">

                        <LayoutDashboard
                            size={23}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            SET-004
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Configure Dashboard Preferences
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Choose which dashboard information is displayed and arrange the widget order.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                MESSAGES
            ================================================== */}

            {successMessage && (

                <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                    <CheckCircle2
                        size={19}
                        className="shrink-0 text-emerald-600"
                    />

                    <p className="text-sm font-semibold text-emerald-700">
                        {successMessage}
                    </p>

                </div>

            )}

            {errorMessage && (

                <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <AlertTriangle
                        size={19}
                        className="shrink-0 text-red-600"
                    />

                    <p className="text-sm font-semibold text-red-700">
                        {errorMessage}
                    </p>

                </div>

            )}

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 px-6 pt-6 sm:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Available Widgets
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                        {preferences.length}
                    </p>

                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Visible Widgets
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-700">
                        {visibleCount}
                    </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Hidden Widgets
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                        {preferences.length -
                            visibleCount}
                    </p>

                </div>

            </div>

            {/* ==================================================
                WIDGET LIST
            ================================================== */}

            <div className="p-6">

                <div className="mb-4">

                    <h3 className="font-bold text-slate-900">
                        Dashboard Widgets
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Drag widgets to change their order or use the visibility button to hide/show them.
                    </p>

                </div>

                <div className="space-y-3">

                    {preferences.map(
                        (preference) => {

                            const widget =
                                getWidget(
                                    preference.widgetId
                                );

                            if (!widget) {
                                return null;
                            }

                            const isDragging =
                                draggedWidget ===
                                widget.id;

                            return (

                                <div
                                    key={
                                        widget.id
                                    }
                                    draggable
                                    onDragStart={(
                                        event
                                    ) =>
                                        handleDragStart(
                                            event,
                                            widget.id
                                        )
                                    }
                                    onDragOver={
                                        handleDragOver
                                    }
                                    onDrop={(
                                        event
                                    ) =>
                                        handleDrop(
                                            event,
                                            widget.id
                                        )
                                    }
                                    onDragEnd={
                                        handleDragEnd
                                    }
                                    className={`rounded-2xl border p-4 transition ${
                                        isDragging
                                            ? "border-blue-400 bg-blue-50 opacity-60"
                                            : preference.visible
                                            ? "border-slate-200 bg-white"
                                            : "border-slate-200 bg-slate-50"
                                    }`}
                                >

                                    <div className="flex items-center gap-4">

                                        {/* DRAG HANDLE */}

                                        <div
                                            title="Drag to reorder"
                                            className="cursor-grab text-slate-400 active:cursor-grabbing"
                                        >

                                            <GripVertical
                                                size={20}
                                            />

                                        </div>

                                        {/* NUMBER */}

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">

                                            {preferences.findIndex(
                                                (
                                                    item
                                                ) =>
                                                    item.widgetId ===
                                                    widget.id
                                            ) + 1}

                                        </div>

                                        {/* CONTENT */}

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h4 className="font-bold text-slate-900">
                                                    {
                                                        widget.name
                                                    }
                                                </h4>

                                                {preference.visible ? (

                                                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                                        Visible
                                                    </span>

                                                ) : (

                                                    <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                                        Hidden
                                                    </span>

                                                )}

                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    widget.description
                                                }
                                            </p>

                                            <p className="mt-2 text-[11px] text-slate-400">
                                                Permission:{" "}
                                                {
                                                    widget.permission
                                                }
                                            </p>

                                        </div>

                                        {/* VISIBILITY */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleWidget(
                                                    widget.id
                                                )
                                            }
                                            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                                                preference.visible
                                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                            }`}
                                        >

                                            {preference.visible ? (
                                                <>
                                                    <Eye
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Hide
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Show
                                                </>
                                            )}

                                        </button>

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

            </div>

            {/* ==================================================
                SECURITY INFORMATION
            ================================================== */}

            <div className="mx-6 mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4">

                <Info
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm leading-6 text-blue-700">
                    Dashboard preferences control only the
                    appearance of your Manager dashboard.
                    They cannot grant access to unauthorized
                    projects or information. Each widget must
                    still respect your role and project
                    permissions.
                </p>

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-slate-500">

                    {hasChanges
                        ? "You have unsaved dashboard changes."
                        : "Your dashboard preferences are up to date."}

                </p>

                <div className="flex flex-wrap justify-end gap-3">

                    <button
                        type="button"
                        onClick={
                            handleReset
                        }
                        disabled={
                            isSaving
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <RotateCcw
                            size={16}
                        />

                        Reset Defaults

                    </button>

                    <button
                        type="button"
                        onClick={
                            handleSave
                        }
                        disabled={
                            !hasChanges ||
                            isSaving
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Save
                            size={17}
                        />

                        {isSaving
                            ? "Saving..."
                            : "Save Preferences"}

                    </button>

                </div>

            </div>

        </section>
    );
}

export default DashboardPreferences;

