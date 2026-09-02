import React, { useEffect, useMemo, useState } from "react";

import {
    Activity,
    AlertCircle,
    Bell,
    CheckCircle2,
    Clock3,
    FileText,
    Filter,
    MessageSquare,
    RefreshCw,
    Search,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getManagerProjects,
    getActivityFeed,
} from "@/services/communicationService";

// ============================================================
// COMM-004 — VIEW ACTIVITY FEED / NOTIFICATIONS
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Goal:
// Allow the Manager to monitor important notifications and
// activities occurring within authorized projects and teams.
//
// UI:
// - Clean white Team-page style
// - Light neutral background
// - No blue-black background
// - No hard-coded activities
// - Activities retrieved dynamically
// - Read-only activity records
// ============================================================

function ActivityFeed() {
    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] = useState([]);
    const [activities, setActivities] = useState([]);

    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [activityType, setActivityType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingActivities, setLoadingActivities] = useState(false);

    const [error, setError] = useState("");
    const [selectedActivity, setSelectedActivity] = useState(null);

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, []);

    // ========================================================
    // LOAD AUTHORIZED PROJECTS
    // ========================================================

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);
            setError("");

            const result = await getManagerProjects();

            const projectList = Array.isArray(result)
                ? result
                : result?.projects ||
                  result?.data ||
                  result?.items ||
                  [];

            setProjects(projectList);
        } catch (err) {
            console.error(
                "Activity Feed project loading error:",
                err
            );

            setProjects([]);

            setError(
                err?.message ||
                    "Unable to load assigned projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    };

    // ========================================================
    // PROJECT NAME
    // ========================================================

    const getProjectName = (project) => {
        if (!project) {
            return "Unnamed Project";
        }

        return (
            project.name ||
            project.title ||
            project.projectName ||
            "Unnamed Project"
        );
    };

    // ========================================================
    // PROJECT ID
    // ========================================================

    const getProjectId = (project) => {
        if (!project) {
            return null;
        }

        return (
            project.id ??
            project.projectId ??
            project.projectID
        );
    };

    // ========================================================
    // NORMALIZE ACTIVITY
    // ========================================================

    const normalizeActivity = (
        activity,
        project = null
    ) => {
        if (!activity) {
            return null;
        }

        return {
            ...activity,

            id:
                activity.id ??
                activity.activityId ??
                activity.activityID,

            type:
                activity.type ??
                activity.activityType ??
                activity.action ??
                activity.eventType ??
                "Activity",

            title:
                activity.title ??
                activity.name ??
                activity.action ??
                activity.activityType ??
                "Activity",

            description:
                activity.description ??
                activity.message ??
                activity.details ??
                activity.content ??
                "",

            actor:
                activity.actor ??
                activity.performedBy ??
                activity.userName ??
                activity.createdBy ??
                activity.performedByName ??
                "System",

            actorEmail:
                activity.actorEmail ??
                activity.performedByEmail ??
                activity.userEmail ??
                "",

            createdAt:
                activity.createdAt ??
                activity.timestamp ??
                activity.date ??
                activity.occurredAt ??
                null,

            projectId:
                activity.projectId ??
                activity.projectID ??
                getProjectId(project),

            projectName:
                activity.projectName ??
                project?.name ??
                project?.title ??
                project?.projectName ??
                "",

            teamId:
                activity.teamId ??
                activity.teamID ??
                null,

            teamName:
                activity.teamName ??
                activity.team?.name ??
                "",

            sprintId:
                activity.sprintId ??
                activity.sprintID ??
                null,

            sprintName:
                activity.sprintName ??
                activity.sprint?.name ??
                "",

            taskId:
                activity.taskId ??
                activity.taskID ??
                null,

            taskName:
                activity.taskName ??
                activity.task?.name ??
                activity.task?.title ??
                "",
        };
    };

    // ========================================================
    // LOAD ACTIVITY / NOTIFICATIONS
    // ========================================================

    const loadActivities = async (projectId = "") => {
        try {
            setLoadingActivities(true);
            setError("");

            const result = await getActivityFeed({
                projectId: projectId || undefined,
            });

            const activityList = Array.isArray(result)
                ? result
                : result?.activities ||
                  result?.notifications ||
                  result?.items ||
                  result?.data ||
                  [];

            const normalized = activityList
                .map((activity) =>
                    normalizeActivity(activity)
                )
                .filter(Boolean);

            setActivities(normalized);
        } catch (err) {
            console.error(
                "Activity Feed loading error:",
                err
            );

            setActivities([]);

            setError(
                err?.message ||
                    "Unable to retrieve notifications and activities."
            );
        } finally {
            setLoadingActivities(false);
        }
    };

    // ========================================================
    // INITIAL ACTIVITY LOAD
    // ========================================================

    useEffect(() => {
        if (!loadingProjects) {
            loadActivities(selectedProjectId);
        }
    }, [loadingProjects, selectedProjectId]);

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    const handleProjectChange = (event) => {
        const projectId = event.target.value;

        setSelectedProjectId(projectId);
        setSelectedActivity(null);
        setActivityType("all");
        setSearchTerm("");
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        setError("");

        await loadProjects();
        await loadActivities(selectedProjectId);
    };

    // ========================================================
    // ACTIVITY TYPE
    // ========================================================

    const getActivityType = (activity) => {
        return String(
            activity?.type ||
                activity?.activityType ||
                activity?.action ||
                "Activity"
        );
    };

    // ========================================================
    // NORMALIZED TYPE
    // ========================================================

    const getNormalizedType = (activity) => {
        return getActivityType(activity)
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ");
    };

    // ========================================================
    // ACTIVITY ICON
    // ========================================================

    const getActivityIcon = (activity) => {
        const type = getNormalizedType(activity);

        if (type.includes("announcement")) {
            return <Bell className="h-5 w-5" />;
        }

        if (
            type.includes("notification") ||
            type.includes("alert")
        ) {
            return <Bell className="h-5 w-5" />;
        }

        if (
            type.includes("message") ||
            type.includes("comment") ||
            type.includes("mention")
        ) {
            return (
                <MessageSquare className="h-5 w-5" />
            );
        }

        if (
            type.includes("member") ||
            type.includes("team") ||
            type.includes("assignment")
        ) {
            return <Users className="h-5 w-5" />;
        }

        if (
            type.includes("task") ||
            type.includes("completed") ||
            type.includes("complete")
        ) {
            return (
                <CheckCircle2 className="h-5 w-5" />
            );
        }

        if (type.includes("sprint")) {
            return <Clock3 className="h-5 w-5" />;
        }

        if (
            type.includes("project") ||
            type.includes("specification")
        ) {
            return <FileText className="h-5 w-5" />;
        }

        if (type.includes("request")) {
            return <UserPlus className="h-5 w-5" />;
        }

        return <Activity className="h-5 w-5" />;
    };

    // ========================================================
    // ICON STYLE
    // ========================================================

    const getActivityIconBackground = (activity) => {
        const type = getNormalizedType(activity);

        if (
            type.includes("completed") ||
            type.includes("complete") ||
            type.includes("success")
        ) {
            return "bg-emerald-50 text-emerald-600";
        }

        if (
            type.includes("risk") ||
            type.includes("warning") ||
            type.includes("error")
        ) {
            return "bg-red-50 text-red-600";
        }

        if (
            type.includes("request") ||
            type.includes("pending")
        ) {
            return "bg-amber-50 text-amber-600";
        }

        if (
            type.includes("message") ||
            type.includes("comment") ||
            type.includes("mention")
        ) {
            return "bg-violet-50 text-violet-600";
        }

        if (
            type.includes("announcement") ||
            type.includes("notification") ||
            type.includes("alert")
        ) {
            return "bg-blue-50 text-blue-600";
        }

        return "bg-slate-100 text-slate-600";
    };

    // ========================================================
    // AVAILABLE ACTIVITY TYPES
    // ========================================================

    const activityTypes = useMemo(() => {
        const types = activities
            .map((activity) =>
                getActivityType(activity)
            )
            .filter(Boolean);

        return [
            ...new Map(
                types.map((type) => [
                    String(type)
                        .trim()
                        .toLowerCase(),
                    type,
                ])
            ).values(),
        ].sort((a, b) =>
            String(a).localeCompare(String(b))
        );
    }, [activities]);

    // ========================================================
    // FILTERED ACTIVITIES
    // ========================================================

    const filteredActivities = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        return activities.filter((activity) => {
            if (
                selectedProjectId &&
                String(activity.projectId) !==
                    String(selectedProjectId)
            ) {
                return false;
            }

            if (
                activityType !== "all" &&
                getActivityType(activity)
                    .trim()
                    .toLowerCase() !==
                    activityType
                        .trim()
                        .toLowerCase()
            ) {
                return false;
            }

            if (!search) {
                return true;
            }

            const searchableText = [
                activity.title,
                activity.description,
                activity.type,
                activity.actor,
                activity.actorEmail,
                activity.projectName,
                activity.teamName,
                activity.sprintName,
                activity.taskName,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(search);
        });
    }, [
        activities,
        selectedProjectId,
        activityType,
        searchTerm,
    ]);

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (value) => {
        if (!value) {
            return "Date unavailable";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString();
    };

    // ========================================================
    // RELATIVE TIME
    // ========================================================

    const getRelativeTime = (value) => {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const difference =
            Date.now() - date.getTime();

        const seconds = Math.floor(
            difference / 1000
        );

        if (seconds < 60) {
            return "Just now";
        }

        const minutes = Math.floor(
            seconds / 60
        );

        if (minutes < 60) {
            return `${minutes} ${
                minutes === 1
                    ? "minute"
                    : "minutes"
            } ago`;
        }

        const hours = Math.floor(
            minutes / 60
        );

        if (hours < 24) {
            return `${hours} ${
                hours === 1
                    ? "hour"
                    : "hours"
            } ago`;
        }

        const days = Math.floor(
            hours / 24
        );

        if (days < 7) {
            return `${days} ${
                days === 1
                    ? "day"
                    : "days"
            } ago`;
        }

        return formatDate(value);
    };

    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const clearFilters = () => {
        setSelectedProjectId("");
        setActivityType("all");
        setSearchTerm("");
        setSelectedActivity(null);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Notifications & Activity
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Monitor important notifications,
                            activities, and updates from your
                            authorized projects and teams.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={
                            loadingProjects ||
                            loadingActivities
                        }
                        className="w-fit gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                loadingProjects ||
                                loadingActivities
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh
                    </Button>
                </div>

                {/* ==================================================
                    FILTER PANEL
                ================================================== */}

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="h-5 w-5 text-slate-500" />

                        <h2 className="font-semibold text-slate-900">
                            Filters
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">

                        {/* PROJECT */}

                        <div>
                            <label
                                htmlFor="activity-project"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Project
                            </label>

                            <select
                                id="activity-project"
                                value={
                                    selectedProjectId
                                }
                                onChange={
                                    handleProjectChange
                                }
                                disabled={
                                    loadingProjects
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="">
                                    All Authorized Projects
                                </option>

                                {projects.map(
                                    (project) => {
                                        const id =
                                            getProjectId(
                                                project
                                            );

                                        if (
                                            id === null
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <option
                                                key={id}
                                                value={id}
                                            >
                                                {getProjectName(
                                                    project
                                                )}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>

                        {/* ACTIVITY TYPE */}

                        <div>
                            <label
                                htmlFor="activity-type"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Activity Type
                            </label>

                            <select
                                id="activity-type"
                                value={
                                    activityType
                                }
                                onChange={(event) =>
                                    setActivityType(
                                        event.target
                                            .value
                                    )
                                }
                                disabled={
                                    loadingActivities
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="all">
                                    All Activity Types
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

                        {/* SEARCH */}

                        <div>
                            <label
                                htmlFor="activity-search"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Search
                            </label>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    id="activity-search"
                                    type="text"
                                    value={
                                        searchTerm
                                    }
                                    onChange={(event) =>
                                        setSearchTerm(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Search notifications..."
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />
                            </div>
                        </div>
                    </div>

                    {(selectedProjectId ||
                        activityType !== "all" ||
                        searchTerm) && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={
                                    clearFilters
                                }
                                className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="font-semibold">
                                Unable to load notifications
                            </p>

                            <p className="mt-1">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loadingActivities && (
                    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <RefreshCw className="h-6 w-6 animate-spin text-slate-500" />
                        </div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            Loading Notifications
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                            Retrieving authorized project
                            and team notifications.
                        </p>
                    </div>
                )}

                {/* ==================================================
                    NO ACTIVITY
                ================================================== */}

                {!loadingActivities &&
                    !error &&
                    filteredActivities.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                <Bell className="h-6 w-6 text-slate-500" />
                            </div>

                            <h2 className="text-lg font-semibold text-slate-900">
                                No notifications
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                {activities.length ===
                                0
                                    ? "There are no notifications or activities available for your authorized projects and teams."
                                    : "No notifications match the selected filters."}
                            </p>
                        </div>
                    )}

                {/* ==================================================
                    NOTIFICATION LIST
                ================================================== */}

                {!loadingActivities &&
                    filteredActivities.length >
                        0 && (
                        <div className="space-y-4">

                            {/* SUMMARY */}

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Notifications & Activity
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Showing{" "}
                                        {
                                            filteredActivities.length
                                        }{" "}
                                        {filteredActivities.length ===
                                        1
                                            ? "notification"
                                            : "notifications"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Bell className="h-4 w-4" />

                                    <span>
                                        Authorized notifications
                                    </span>
                                </div>
                            </div>

                            {/* LIST */}

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                                {filteredActivities.map(
                                    (
                                        activity,
                                        index
                                    ) => (
                                        <button
                                            type="button"
                                            key={
                                                activity.id ??
                                                `${activity.createdAt}-${index}`
                                            }
                                            onClick={() =>
                                                setSelectedActivity(
                                                    activity
                                                )
                                            }
                                            className="group flex w-full gap-4 border-b border-slate-100 p-5 text-left transition-colors last:border-b-0 hover:bg-slate-50"
                                        >

                                            {/* ICON */}

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getActivityIconBackground(
                                                    activity
                                                )}`}
                                            >
                                                {getActivityIcon(
                                                    activity
                                                )}
                                            </div>

                                            {/* CONTENT */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                                    <div className="min-w-0">

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h3 className="font-semibold text-slate-900">
                                                                {activity.title ||
                                                                    "Notification"}
                                                            </h3>

                                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                {getActivityType(
                                                                    activity
                                                                )}
                                                            </span>
                                                        </div>

                                                        {activity.description && (
                                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                                {
                                                                    activity.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="shrink-0 text-left sm:text-right">

                                                        <p className="text-xs font-medium text-slate-600">
                                                            {getRelativeTime(
                                                                activity.createdAt
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {formatDate(
                                                                activity.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* META */}

                                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">

                                                    {activity.actor && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Users className="h-3.5 w-3.5 text-slate-400" />
                                                            {
                                                                activity.actor
                                                            }
                                                        </span>
                                                    )}

                                                    {activity.projectName && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                                                            {
                                                                activity.projectName
                                                            }
                                                        </span>
                                                    )}

                                                    {activity.teamName && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Users className="h-3.5 w-3.5 text-slate-400" />
                                                            {
                                                                activity.teamName
                                                            }
                                                        </span>
                                                    )}

                                                    {activity.sprintName && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                                                            {
                                                                activity.sprintName
                                                            }
                                                        </span>
                                                    )}

                                                    {activity.taskName && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                                                            {
                                                                activity.taskName
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* VIEW */}

                                            <div className="hidden shrink-0 items-center sm:flex">
                                                <span className="text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-700">
                                                    View
                                                </span>
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {/* ======================================================
                NOTIFICATION DETAILS MODAL
            ====================================================== */}

            {selectedActivity && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedActivity(
                                null
                            );
                        }
                    }}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="activity-details-title"
                    >

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between border-b border-slate-200 p-6">

                            <div className="flex items-center gap-4">

                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${getActivityIconBackground(
                                        selectedActivity
                                    )}`}
                                >
                                    {getActivityIcon(
                                        selectedActivity
                                    )}
                                </div>

                                <div>
                                    <h2
                                        id="activity-details-title"
                                        className="text-lg font-bold text-slate-900"
                                    >
                                        Notification Details
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        {getActivityType(
                                            selectedActivity
                                        )}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedActivity(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close notification details"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* MODAL BODY */}

                        <div className="space-y-6 p-6">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Notification
                                </p>

                                <h3 className="mt-1 text-xl font-bold text-slate-900">
                                    {selectedActivity.title ||
                                        "Notification"}
                                </h3>
                            </div>

                            {selectedActivity.description && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Description
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                        {
                                            selectedActivity.description
                                        }
                                    </p>
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">

                                {/* TYPE */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-400">
                                        Activity Type
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {getActivityType(
                                            selectedActivity
                                        )}
                                    </p>
                                </div>

                                {/* PERFORMED BY */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-400">
                                        Performed By
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {
                                            selectedActivity.actor
                                        }
                                    </p>

                                    {selectedActivity.actorEmail && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            {
                                                selectedActivity.actorEmail
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* PROJECT */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-400">
                                        Project
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {selectedActivity.projectName ||
                                            "Not specified"}
                                    </p>
                                </div>

                                {/* DATE */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-400">
                                        Recorded At
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {formatDate(
                                            selectedActivity.createdAt
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* RELATED INFORMATION */}

                            {(selectedActivity.teamName ||
                                selectedActivity.sprintName ||
                                selectedActivity.taskName) && (
                                <div className="border-t border-slate-200 pt-5">

                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Related Information
                                    </p>

                                    <div className="space-y-3">

                                        {selectedActivity.teamName && (
                                            <div className="flex items-center gap-3">
                                                <Users className="h-4 w-4 text-slate-400" />

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Team
                                                    </p>

                                                    <p className="text-sm font-medium text-slate-900">
                                                        {
                                                            selectedActivity.teamName
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedActivity.sprintName && (
                                            <div className="flex items-center gap-3">
                                                <Clock3 className="h-4 w-4 text-slate-400" />

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Sprint
                                                    </p>

                                                    <p className="text-sm font-medium text-slate-900">
                                                        {
                                                            selectedActivity.sprintName
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedActivity.taskName && (
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-slate-400" />

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Task
                                                    </p>

                                                    <p className="text-sm font-medium text-slate-900">
                                                        {
                                                            selectedActivity.taskName
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end border-t border-slate-200 p-6">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setSelectedActivity(
                                        null
                                    )
                                }
                                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ActivityFeed;