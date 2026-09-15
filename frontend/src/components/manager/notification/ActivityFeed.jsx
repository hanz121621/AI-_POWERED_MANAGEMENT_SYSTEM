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

            setProjects(
                Array.isArray(projectList)
                    ? projectList
                    : []
            );
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
    // PROJECT HELPERS
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
    // LOAD ACTIVITIES
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
    }, [
        loadingProjects,
        selectedProjectId,
    ]);

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

        if (
            type.includes("announcement") ||
            type.includes("notification") ||
            type.includes("alert")
        ) {
            return (
                <Bell className="h-5 w-5" />
            );
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
            return (
                <Users className="h-5 w-5" />
            );
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
            return (
                <Clock3 className="h-5 w-5" />
            );
        }

        if (
            type.includes("project") ||
            type.includes("specification")
        ) {
            return (
                <FileText className="h-5 w-5" />
            );
        }

        if (type.includes("request")) {
            return (
                <UserPlus className="h-5 w-5" />
            );
        }

        return (
            <Activity className="h-5 w-5" />
        );
    };

    // ========================================================
    // ICON STYLE
    // ========================================================

    const getActivityIconBackground = (
        activity
    ) => {
        const type = getNormalizedType(activity);

        if (
            type.includes("completed") ||
            type.includes("complete") ||
            type.includes("success")
        ) {
            return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400";
        }

        if (
            type.includes("risk") ||
            type.includes("warning") ||
            type.includes("error")
        ) {
            return "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400";
        }

        if (
            type.includes("request") ||
            type.includes("pending")
        ) {
            return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";
        }

        if (
            type.includes("message") ||
            type.includes("comment") ||
            type.includes("mention")
        ) {
            return "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400";
        }

        if (
            type.includes("announcement") ||
            type.includes("notification") ||
            type.includes("alert")
        ) {
            return "bg-primary/10 text-primary";
        }

        return "bg-muted text-muted-foreground";
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
            String(a).localeCompare(
                String(b)
            )
        );
    }, [activities]);

    // ========================================================
    // FILTERED ACTIVITIES
    // ========================================================

    const filteredActivities = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        return activities.filter(
            (activity) => {
                if (
                    selectedProjectId &&
                    String(
                        activity.projectId
                    ) !==
                        String(
                            selectedProjectId
                        )
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

                return searchableText.includes(
                    search
                );
            }
        );
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

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
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

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
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
        <div className="w-full space-y-6 text-foreground">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Bell className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Notifications & Activity
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Monitor important notifications,
                                activities, and updates from
                                your authorized projects
                                and teams.
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={
                        loadingProjects ||
                        loadingActivities
                    }
                    className="w-fit gap-2"
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

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">

                <div className="mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />

                    <h2 className="font-semibold">
                        Filters
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">

                    {/* PROJECT */}

                    <div>
                        <label
                            htmlFor="activity-project"
                            className="mb-2 block text-sm font-medium"
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
                            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        id ===
                                        null
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
                            className="mb-2 block text-sm font-medium"
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
                            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                            className="mb-2 block text-sm font-medium"
                        >
                            Search
                        </label>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                            />
                        </div>
                    </div>
                </div>

                {(selectedProjectId ||
                    activityType !==
                        "all" ||
                    searchTerm) && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={
                                clearFilters
                            }
                            className="gap-2"
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
                <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">

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
                <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">

                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>

                    <h2 className="text-lg font-semibold">
                        Loading Notifications
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
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
                filteredActivities.length ===
                    0 && (
                    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Bell className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h2 className="text-lg font-semibold">
                            No notifications
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
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
                                <h2 className="text-xl font-semibold">
                                    Notifications &
                                    Activity
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
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

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Bell className="h-4 w-4" />

                                <span>
                                    Authorized
                                    notifications
                                </span>
                            </div>
                        </div>

                        {/* LIST */}

                        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

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
                                        className="group flex w-full gap-4 border-b border-border p-5 text-left transition-colors last:border-b-0 hover:bg-muted/50"
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

                                                        <h3 className="font-semibold text-foreground">
                                                            {activity.title ||
                                                                "Notification"}
                                                        </h3>

                                                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                            {getActivityType(
                                                                activity
                                                            )}
                                                        </span>
                                                    </div>

                                                    {activity.description && (
                                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                            {
                                                                activity.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="shrink-0 text-left sm:text-right">

                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {getRelativeTime(
                                                            activity.createdAt
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground/70">
                                                        {formatDate(
                                                            activity.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* META */}

                                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">

                                                {activity.actor && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Users className="h-3.5 w-3.5" />

                                                        {
                                                            activity.actor
                                                        }
                                                    </span>
                                                )}

                                                {activity.projectName && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FileText className="h-3.5 w-3.5" />

                                                        {
                                                            activity.projectName
                                                        }
                                                    </span>
                                                )}

                                                {activity.teamName && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Users className="h-3.5 w-3.5" />

                                                        {
                                                            activity.teamName
                                                        }
                                                    </span>
                                                )}

                                                {activity.sprintName && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock3 className="h-3.5 w-3.5" />

                                                        {
                                                            activity.sprintName
                                                        }
                                                    </span>
                                                )}

                                                {activity.taskName && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />

                                                        {
                                                            activity.taskName
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* VIEW */}

                                        <div className="hidden shrink-0 items-center sm:flex">
                                            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
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
    );

    // ========================================================
    // MODAL
    // ========================================================

    // Modal is rendered below through a portal-style sibling.
}

// ============================================================
// NOTE:
// The component above needs the modal rendered before the
// closing return. The complete modal-enabled version is below.
// ============================================================

export default ActivityFeed;