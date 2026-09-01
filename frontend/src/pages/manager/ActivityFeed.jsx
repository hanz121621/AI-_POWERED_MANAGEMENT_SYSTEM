
// ============================================================
// AIPMS MANAGER ACTIVITY FEED
//
// COMM-004 — View Activity Feed
//
// Primary Actor:
// Project Manager
//
// Features:
// - View authorized project activities
// - Search activities
// - Filter by project
// - Filter by team
// - Filter by activity type
// - View activity details
// - Activity records are read-only
// ============================================================

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Activity,
    Search,
    Filter,
    RefreshCw,
    X,
    FolderKanban,
    Users,
    User,
    CalendarDays,
    Clock,
    CheckCircle2,
    AlertTriangle,
    MessageSquare,
    ListTodo,
    PlayCircle,
    PlusCircle,
    ShieldCheck,
    ChevronRight,
    Eye,
} from "lucide-react";

import {
    getManagerActivityFeed,
    getManagerActivityTypes,
    getManagerActivityProjects,
    getManagerActivityTeams,
} from "../../services/managerActivityService";

// ============================================================
// HELPERS
// ============================================================

function formatDate(value) {

    if (!value) {
        return "Unknown date";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Unknown date";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}

function formatTime(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

function getActivityIcon(
    activityType
) {

    const type =
        String(
            activityType || ""
        ).toLowerCase();

    if (
        type.includes("comment") ||
        type.includes("message")
    ) {
        return MessageSquare;
    }

    if (
        type.includes("task")
    ) {
        return ListTodo;
    }

    if (
        type.includes("sprint")
    ) {
        return PlayCircle;
    }

    if (
        type.includes("risk") ||
        type.includes("warning")
    ) {
        return AlertTriangle;
    }

    if (
        type.includes("complete") ||
        type.includes("completed")
    ) {
        return CheckCircle2;
    }

    if (
        type.includes("create") ||
        type.includes("created")
    ) {
        return PlusCircle;
    }

    if (
        type.includes("approval") ||
        type.includes("security")
    ) {
        return ShieldCheck;
    }

    return Activity;
}

// ============================================================
// COMPONENT
// ============================================================

function ActivityFeed() {

    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    const [
        activities,
        setActivities,
    ] = useState([]);

    const [
        activityTypes,
        setActivityTypes,
    ] = useState([]);

    const [
        projects,
        setProjects,
    ] = useState([]);

    const [
        teams,
        setTeams,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        selectedActivity,
        setSelectedActivity,
    ] = useState(null);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        projectId,
        setProjectId,
    ] = useState("");

    const [
        teamId,
        setTeamId,
    ] = useState("");

    const [
        activityType,
        setActivityType,
    ] = useState("");

    const [
        fromDate,
        setFromDate,
    ] = useState("");

    const [
        toDate,
        setToDate,
    ] = useState("");

    // ========================================================
    // LOAD ACTIVITY
    // ========================================================

    const loadActivities =
        () => {

            setLoading(true);
            setError("");

            try {

                const data =
                    getManagerActivityFeed({
                        search,
                        projectId,
                        teamId,
                        activityType,
                        fromDate,
                        toDate,
                    });

                setActivities(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load manager activity:",
                    err
                );

                if (
                    err?.message ===
                    "AUTHENTICATION_REQUIRED"
                ) {

                    setError(
                        "You must be authenticated as a Manager to view activity."
                    );

                } else if (
                    err?.message ===
                    "ACCESS_DENIED"
                ) {

                    setError(
                        "You do not have permission to view the activity feed."
                    );

                } else {

                    setError(
                        "Unable to retrieve activity feed."
                    );
                }

                setActivities([]);
            } finally {

                setLoading(false);
            }
        };

    // ========================================================
    // LOAD FILTER OPTIONS
    // ========================================================

    const loadFilterOptions =
        () => {

            try {

                setActivityTypes(
                    getManagerActivityTypes()
                );

                setProjects(
                    getManagerActivityProjects()
                );

                setTeams(
                    getManagerActivityTeams()
                );

            } catch (err) {

                console.error(
                    "Failed to load activity filters:",
                    err
                );
            }
        };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadFilterOptions();

    }, []);

    // ========================================================
    // LOAD WHEN FILTERS CHANGE
    // ========================================================

    useEffect(() => {

        const timer =
            setTimeout(
                () => {
                    loadActivities();
                },
                150
            );

        return () =>
            clearTimeout(timer);

    }, [
        search,
        projectId,
        teamId,
        activityType,
        fromDate,
        toDate,
    ]);

    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const clearFilters =
        () => {

            setSearch("");
            setProjectId("");
            setTeamId("");
            setActivityType("");
            setFromDate("");
            setToDate("");
        };

    // ========================================================
    // CHECK FILTERS
    // ========================================================

    const hasFilters =
        Boolean(
            search ||
            projectId ||
            teamId ||
            activityType ||
            fromDate ||
            toDate
        );

    // ========================================================
    // ACTIVITY COUNT
    // ========================================================

    const activityCount =
        useMemo(
            () =>
                activities.length,
            [activities]
        );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                                <Activity
                                    size={24}
                                    className="text-blue-600"
                                />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Activity Feed
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Monitor important activity across your assigned projects and teams.
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            loadFilterOptions();
                            loadActivities();
                        }}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-start gap-3">

                        <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>

                            <p className="font-semibold">
                                Activity Feed Error
                            </p>

                            <p className="text-sm mt-1">
                                {error}
                            </p>

                        </div>

                    </div>

                )}

                {/* ==================================================
                    FILTERS
                ================================================== */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">

                    <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-2">

                            <Filter
                                size={18}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Filters
                            </h2>

                        </div>

                        {hasFilters && (

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                            >

                                <X size={15} />

                                Clear filters

                            </button>

                        )}

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* SEARCH */}

                        <div className="lg:col-span-3">

                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Search activity
                            </label>

                            <div className="relative">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search activities, projects, teams, tasks..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>

                        {/* PROJECT */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Project
                            </label>

                            <select
                                value={projectId}
                                onChange={(event) =>
                                    setProjectId(
                                        event.target.value
                                    )
                                }
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    All projects
                                </option>

                                {projects.map(
                                    (project) => (

                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* TEAM */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Team
                            </label>

                            <select
                                value={teamId}
                                onChange={(event) =>
                                    setTeamId(
                                        event.target.value
                                    )
                                }
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    All teams
                                </option>

                                {teams.map(
                                    (team) => (

                                        <option
                                            key={team.id}
                                            value={team.id}
                                        >
                                            {team.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* ACTIVITY TYPE */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Activity type
                            </label>

                            <select
                                value={activityType}
                                onChange={(event) =>
                                    setActivityType(
                                        event.target.value
                                    )
                                }
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    All activity types
                                </option>

                                {activityTypes.map(
                                    (type) => (

                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* FROM DATE */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                From date
                            </label>

                            <div className="relative">

                                <CalendarDays
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(event) =>
                                        setFromDate(
                                            event.target.value
                                        )
                                    }
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>

                        {/* TO DATE */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                To date
                            </label>

                            <div className="relative">

                                <CalendarDays
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(event) =>
                                        setToDate(
                                            event.target.value
                                        )
                                    }
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    SUMMARY
                ================================================== */}

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <p className="text-sm text-slate-500">
                            {activityCount}{" "}
                            {activityCount === 1
                                ? "activity"
                                : "activities"}
                        </p>

                    </div>

                </div>

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

                        <RefreshCw
                            size={30}
                            className="mx-auto text-blue-600 animate-spin mb-3"
                        />

                        <p className="font-medium text-slate-800">
                            Loading activity...
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            Retrieving authorized project activity.
                        </p>

                    </div>

                ) : activities.length === 0 ? (

                    /* ==================================================
                        NO ACTIVITY
                    ================================================== */

                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">

                            <Activity
                                size={30}
                                className="text-slate-400"
                            />

                        </div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            No recent activity.
                        </h2>

                        <p className="text-sm text-slate-500 mt-2">
                            There are no activity records matching your current filters.
                        </p>

                    </div>

                ) : (

                    /* ==================================================
                        ACTIVITY LIST
                    ================================================== */

                    <div className="space-y-3">

                        {activities.map(
                            (activity) => {

                                const Icon =
                                    getActivityIcon(
                                        activity.activityType
                                    );

                                return (

                                    <button
                                        key={
                                            activity.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            setSelectedActivity(
                                                activity
                                            )
                                        }
                                        className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition"
                                    >

                                        <div className="flex items-start gap-4">

                                            <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">

                                                <Icon
                                                    size={20}
                                                    className="text-blue-600"
                                                />

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                                                    <div>

                                                        <h3 className="font-semibold text-slate-900">
                                                            {
                                                                activity.activityType
                                                            }
                                                        </h3>

                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {
                                                                activity.description
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-500">

                                                        <Clock
                                                            size={14}
                                                        />

                                                        {formatDate(
                                                            activity.createdAt
                                                        )}

                                                        {" · "}

                                                        {formatTime(
                                                            activity.createdAt
                                                        )}

                                                    </div>

                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">

                                                    {activity.projectName && (

                                                        <span className="inline-flex items-center gap-1.5">

                                                            <FolderKanban
                                                                size={14}
                                                            />

                                                            {
                                                                activity.projectName
                                                            }

                                                        </span>

                                                    )}

                                                    {activity.teamName && (

                                                        <span className="inline-flex items-center gap-1.5">

                                                            <Users
                                                                size={14}
                                                            />

                                                            {
                                                                activity.teamName
                                                            }

                                                        </span>

                                                    )}

                                                    {activity.performedByName && (

                                                        <span className="inline-flex items-center gap-1.5">

                                                            <User
                                                                size={14}
                                                            />

                                                            {
                                                                activity.performedByName
                                                            }

                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                            <ChevronRight
                                                size={20}
                                                className="text-slate-400 shrink-0 mt-2"
                                            />

                                        </div>

                                    </button>

                                );
                            }
                        )}

                    </div>

                )}

            </div>

            {/* ==================================================
                ACTIVITY DETAILS MODAL
            ================================================== */}

            {selectedActivity && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                            <div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    Activity Details
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    View recorded activity information.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedActivity(
                                        null
                                    )
                                }
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>

                        <div className="p-6 space-y-5">

                            {/* TYPE */}

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Activity Type
                                </p>

                                <p className="mt-1 text-base font-semibold text-slate-900">
                                    {
                                        selectedActivity.activityType
                                    }
                                </p>

                            </div>

                            {/* DESCRIPTION */}

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Description
                                </p>

                                <p className="mt-1 text-slate-700">
                                    {
                                        selectedActivity.description
                                    }
                                </p>

                            </div>

                            {/* PROJECT */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <div className="flex items-center gap-2 text-slate-500 mb-1">

                                        <FolderKanban
                                            size={16}
                                        />

                                        <span className="text-xs font-semibold uppercase">
                                            Project
                                        </span>

                                    </div>

                                    <p className="font-medium text-slate-900">
                                        {
                                            selectedActivity.projectName ||
                                            "Not specified"
                                        }
                                    </p>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <div className="flex items-center gap-2 text-slate-500 mb-1">

                                        <Users
                                            size={16}
                                        />

                                        <span className="text-xs font-semibold uppercase">
                                            Team
                                        </span>

                                    </div>

                                    <p className="font-medium text-slate-900">
                                        {
                                            selectedActivity.teamName ||
                                            "Not specified"
                                        }
                                    </p>

                                </div>

                            </div>

                            {/* ACTOR */}

                            <div className="rounded-xl bg-slate-50 p-4">

                                <div className="flex items-center gap-2 text-slate-500 mb-2">

                                    <User
                                        size={16}
                                    />

                                    <span className="text-xs font-semibold uppercase">
                                        Performed By
                                    </span>

                                </div>

                                <p className="font-medium text-slate-900">
                                    {
                                        selectedActivity.performedByName ||
                                        "System"
                                    }
                                </p>

                                {selectedActivity.performedByEmail && (

                                    <p className="text-sm text-slate-500 mt-1">
                                        {
                                            selectedActivity.performedByEmail
                                        }
                                    </p>

                                )}

                            </div>

                            {/* DATE */}

                            <div className="rounded-xl bg-slate-50 p-4">

                                <div className="flex items-center gap-2 text-slate-500 mb-2">

                                    <CalendarDays
                                        size={16}
                                    />

                                    <span className="text-xs font-semibold uppercase">
                                        Recorded At
                                    </span>

                                </div>

                                <p className="font-medium text-slate-900">
                                    {
                                        formatDate(
                                            selectedActivity.createdAt
                                        )
                                    }

                                    {" · "}

                                    {
                                        formatTime(
                                            selectedActivity.createdAt
                                        )
                                    }

                                </p>

                            </div>

                            {/* SPRINT */}

                            {selectedActivity.sprintName && (

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Sprint
                                    </p>

                                    <p className="mt-1 text-slate-800">
                                        {
                                            selectedActivity.sprintName
                                        }
                                    </p>

                                </div>

                            )}

                            {/* TASK */}

                            {selectedActivity.taskName && (

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Task
                                    </p>

                                    <p className="mt-1 text-slate-800">
                                        {
                                            selectedActivity.taskName
                                        }
                                    </p>

                                </div>

                            )}

                        </div>

                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedActivity(
                                        null
                                    )
                                }
                                className="px-4 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

// ============================================================
// EXPORT
// ============================================================

export default ActivityFeed;

