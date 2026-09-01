// ============================================================
// AIPMS — MANAGER DASHBOARD
//
// Backend Connected
// - Manager Projects
// - Project Statistics
// - Project Progress
// - Sprint Overview
// - Recent Project Activity
// - Team Member Count
// - AI Features
//
// Existing UI preserved
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FolderKanban,
    PlayCircle,
    CheckCircle2,
    Users,
    Sparkles,
    Activity,
    Settings2,
    CalendarDays,
    Bell,
    ArrowRight,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

import { getMyProjects } from "@/services/projectService";
import { getAllSprints } from "@/services/sprintService";

// ============================================================
// HELPERS
// ============================================================

function getProjectStatus(project) {
    return String(
        project?.statusName ??
            project?.status ??
            ""
    )
        .trim()
        .toLowerCase();
}

function getProjectProgress(project) {
    const value = Number(
        project?.progress ??
            project?.Progress ??
            0
    );

    if (Number.isNaN(value)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, value)
    );
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
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

function getSprintStatus(sprint) {
    return String(
        sprint?.statusName ??
            sprint?.status ??
            ""
    )
        .trim()
        .toLowerCase();
}

// ============================================================
// COMPONENT
// ============================================================

function ManagerDashboard() {
    const navigate = useNavigate();

    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] = useState([]);

    const [sprints, setSprints] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    // ========================================================
    // LOAD DASHBOARD
    // ========================================================

    const loadDashboard = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                // ------------------------------------------------
                // Load manager projects
                // ------------------------------------------------

                const projectsResult =
                    await getMyProjects();

                setProjects(
                    Array.isArray(projectsResult)
                        ? projectsResult
                        : []
                );

                // ------------------------------------------------
                // Load sprints
                //
                // Backend endpoint:
                // GET /api/Sprint
                // ------------------------------------------------

                try {
                    const sprintsResult =
                        await getAllSprints();

                    setSprints(
                        Array.isArray(sprintsResult)
                            ? sprintsResult
                            : []
                    );
                } catch (sprintError) {
                    console.error(
                        "MANAGER DASHBOARD SPRINT LOAD ERROR:",
                        sprintError
                    );

                    // Sprint failure should not prevent
                    // the project dashboard from displaying.
                    setSprints([]);
                }
            } catch (err) {
                console.error(
                    "MANAGER DASHBOARD LOAD ERROR:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                        err?.response?.data ||
                        err?.message ||
                        "Unable to load manager dashboard data."
                );

                setProjects([]);
                setSprints([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    // ========================================================
    // INITIAL LOAD
    //
    // We defer the state-changing async operation so React
    // does not report the synchronous setState-in-effect warning.
    // ========================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDashboard();
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }, [loadDashboard]);

    // ========================================================
    // PROJECT STATISTICS
    // ========================================================

    const statistics = useMemo(() => {
        const totalProjects =
            projects.length;

        const activeProjects =
            projects.filter(
                (project) =>
                    getProjectStatus(project) ===
                    "active"
            ).length;

        const completedProjects =
            projects.filter(
                (project) =>
                    getProjectStatus(project) ===
                    "completed"
            ).length;

        const archivedProjects =
            projects.filter(
                (project) =>
                    getProjectStatus(project) ===
                    "archived"
            ).length;

        return {
            totalProjects,
            activeProjects,
            completedProjects,
            archivedProjects,
        };
    }, [projects]);

    // ========================================================
    // PROJECT PROGRESS
    // ========================================================

    const activeProjects = useMemo(
        () =>
            projects
                .filter((project) => {
                    const status =
                        getProjectStatus(project);

                    return (
                        status === "active" ||
                        status === "planning"
                    );
                })
                .sort((a, b) => {
                    const aProgress =
                        getProjectProgress(a);

                    const bProgress =
                        getProjectProgress(b);

                    return (
                        aProgress -
                        bProgress
                    );
                }),
        [projects]
    );

    // ========================================================
    // RECENT ACTIVITY
    // ========================================================

    const recentProjects = useMemo(() => {
        return [...projects]
            .sort((a, b) => {
                const dateA = new Date(
                    a?.updatedAt ??
                        a?.createdAt ??
                        0
                ).getTime();

                const dateB = new Date(
                    b?.updatedAt ??
                        b?.createdAt ??
                        0
                ).getTime();

                return dateB - dateA;
            })
            .slice(0, 5);
    }, [projects]);

    // ========================================================
    // TEAM MEMBERS
    // ========================================================

    const teamMemberCount = useMemo(() => {
        const memberIds = new Set();

        projects.forEach((project) => {
            const members =
                project?.team?.members ??
                project?.members ??
                [];

            if (Array.isArray(members)) {
                members.forEach((member) => {
                    const id =
                        member?.id ??
                        member?.userId;

                    if (id) {
                        memberIds.add(id);
                    }
                });
            }
        });

        return memberIds.size;
    }, [projects]);

    // ========================================================
    // SPRINT STATISTICS
    // ========================================================

    const sprintStatistics = useMemo(() => {
        const totalSprints =
            sprints.length;

        const activeSprints =
            sprints.filter((sprint) => {
                const status =
                    getSprintStatus(sprint);

                return (
                    status === "active" ||
                    status === "inprogress" ||
                    status === "in progress"
                );
            }).length;

        const completedSprints =
            sprints.filter(
                (sprint) =>
                    getSprintStatus(sprint) ===
                    "completed"
            ).length;

        return {
            totalSprints,
            activeSprints,
            completedSprints,
        };
    }, [sprints]);

    // ========================================================
    // ACTIVE SPRINT
    // ========================================================

    const activeSprint = useMemo(() => {
        return (
            sprints.find((sprint) => {
                const status =
                    getSprintStatus(sprint);

                return (
                    status === "active" ||
                    status === "inprogress" ||
                    status === "in progress"
                );
            }) ?? null
        );
    }, [sprints]);

    // ========================================================
    // DASHBOARD STATISTICS
    // ========================================================

    const stats = [
        {
            title: "Total Projects",
            value: statistics.totalProjects,
            description:
                "Projects assigned to you",
            icon: FolderKanban,
            path: "/manager/projects",
            actionLabel: "View projects",
            color:
                "from-blue-500 to-cyan-600",
            iconBg:
                "bg-blue-100",
            iconColor:
                "text-blue-600",
        },

        {
            title: "Active Projects",
            value: statistics.activeProjects,
            description:
                "Projects currently in progress",
            icon: PlayCircle,
            path: "/manager/projects",
            actionLabel: "View projects",
            color:
                "from-emerald-500 to-green-600",
            iconBg:
                "bg-emerald-100",
            iconColor:
                "text-emerald-600",
        },

        {
            title: "Completed Projects",
            value: statistics.completedProjects,
            description:
                "Projects successfully completed",
            icon: CheckCircle2,
            path: "/manager/projects",
            actionLabel: "View projects",
            color:
                "from-violet-500 to-purple-600",
            iconBg:
                "bg-violet-100",
            iconColor:
                "text-violet-600",
        },

        {
            title: "Team Members",
            value: teamMemberCount,
            description:
                "Members assigned to your teams",
            icon: Users,
            path: "/manager/team",
            actionLabel: "View team",
            color:
                "from-amber-500 to-orange-600",
            iconBg:
                "bg-amber-100",
            iconColor:
                "text-amber-600",
        },
    ];

    // ========================================================
    // QUICK ACTIONS
    // ========================================================

    const quickActions = [
        {
            title: "Manage Projects",
            description:
                "View and manage your projects",
            icon: FolderKanban,
            path: "/manager/projects",
            color:
                "from-blue-500 to-cyan-600",
            iconBg:
                "bg-blue-100",
            iconColor:
                "text-blue-600",
        },

        {
            title: "Manage Sprints",
            description:
                "Create and manage project sprints",
            icon: CalendarDays,
            path: "/manager/sprints",
            color:
                "from-emerald-500 to-green-600",
            iconBg:
                "bg-emerald-100",
            iconColor:
                "text-emerald-600",
        },

        {
            title: "Manage Team",
            description:
                "View your team members",
            icon: Users,
            path: "/manager/team",
            color:
                "from-violet-500 to-purple-600",
            iconBg:
                "bg-violet-100",
            iconColor:
                "text-violet-600",
        },

        {
            title: "View Reports",
            description:
                "Monitor project reports",
            icon: Activity,
            path: "/manager/reports",
            color:
                "from-cyan-500 to-blue-600",
            iconBg:
                "bg-cyan-100",
            iconColor:
                "text-cyan-600",
        },

        {
            title: "AI Features",
            description:
                "Use AI project intelligence",
            icon: Sparkles,
            path: "/manager/ai-features",
            color:
                "from-purple-500 to-violet-600",
            iconBg:
                "bg-purple-100",
            iconColor:
                "text-purple-600",
        },

        {
            title: "Notifications",
            description:
                "View your notifications",
            icon: Bell,
            path: "/manager/notifications",
            color:
                "from-amber-500 to-orange-600",
            iconBg:
                "bg-amber-100",
            iconColor:
                "text-amber-600",
        },
    ];

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <main className="min-h-screen">
                    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                        <div className="flex min-h-[500px] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto flex h-16 w-16 animate-spin items-center justify-center rounded-2xl bg-blue-100">

                                    <RefreshCw
                                        size={30}
                                        className="text-blue-600"
                                    />

                                </div>

                                <h2 className="mt-5 text-lg font-bold text-slate-900">
                                    Loading Manager Dashboard
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Loading your projects, sprints and dashboard data...
                                </p>

                            </div>

                        </div>

                    </div>
                </main>
            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

                        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                    <FolderKanban
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div>

                                    <div className="mb-1 flex items-center gap-2">

                                        <Sparkles
                                            size={16}
                                            className="text-cyan-200"
                                        />

                                        <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                            Manager Workspace
                                        </span>

                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Manager Dashboard
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm text-white/80">
                                        Monitor your projects, sprints, teams and
                                        AI-powered project intelligence from one place.
                                    </p>

                                </div>

                            </div>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        loadDashboard(true)
                                    }
                                    disabled={refreshing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <RefreshCw
                                        size={17}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Refresh

                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/manager/projects"
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-md transition hover:bg-slate-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-violet-600"
                                >

                                    <FolderKanban size={18} />

                                    View Projects

                                </button>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                            <div className="flex items-start gap-3">

                                <AlertCircle
                                    size={22}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div className="flex-1">

                                    <h3 className="font-bold text-red-800">
                                        Unable to load dashboard
                                    </h3>

                                    <p className="mt-1 whitespace-pre-line text-sm text-red-700">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            loadDashboard()
                                        }
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                                    >
                                        Try Again
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* ==================================================
                        STATISTICS
                    ================================================== */}

                    <section className="mb-10">

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                            {stats.map((stat) => {

                                const Icon =
                                    stat.icon;

                                return (
                                    <button
                                        key={stat.title}
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                stat.path
                                            )
                                        }
                                        className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                                    >

                                        <div
                                            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`}
                                        />

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <p className="text-sm font-medium text-slate-500">
                                                    {stat.title}
                                                </p>

                                                <p
                                                    className={`mt-2 text-3xl font-bold ${stat.iconColor}`}
                                                >
                                                    {stat.value}
                                                </p>

                                            </div>

                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                                            >
                                                <Icon
                                                    size={22}
                                                    className={
                                                        stat.iconColor
                                                    }
                                                />
                                            </div>

                                        </div>

                                        <p className="mt-3 text-xs leading-5 text-slate-500">
                                            {stat.description}
                                        </p>

                                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-700">

                                            {stat.actionLabel}

                                            <ArrowRight
                                                size={14}
                                                className="transition-transform group-hover:translate-x-1"
                                            />

                                        </div>

                                        <div
                                            className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${stat.color}`}
                                        />

                                    </button>
                                );
                            })}

                        </div>

                    </section>

                    {/* ==================================================
                        PROJECT PROGRESS
                    ================================================== */}

                    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 ring-1 ring-blue-200">

                                    <FolderKanban size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Project Progress
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Monitor active project delivery
                                    </p>

                                </div>

                            </div>

                            <FolderKanban
                                size={20}
                                className="text-blue-500"
                            />

                        </div>

                        <div className="p-6">

                            {activeProjects.length === 0 ? (

                                <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 px-6 py-12 text-center">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 ring-1 ring-blue-200">

                                        <FolderKanban
                                            size={32}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                                        No active projects
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Active project progress will appear here once your projects are available.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/manager/projects"
                                            )
                                        }
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-blue-700 hover:to-cyan-700 hover:shadow-md"
                                    >
                                        View Projects

                                        <ArrowRight
                                            size={17}
                                        />

                                    </button>

                                </div>

                            ) : (

                                <div className="space-y-5">

                                    {activeProjects.map(
                                        (project) => {

                                            const progress =
                                                getProjectProgress(
                                                    project
                                                );

                                            const projectId =
                                                project?.projectId ??
                                                project?.id;

                                            return (
                                                <button
                                                    key={projectId}
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/manager/projects/${projectId}`
                                                        )
                                                    }
                                                    className="group w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
                                                >

                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                        <div className="min-w-0">

                                                            <h3 className="truncate font-bold text-slate-900 group-hover:text-blue-700">
                                                                {project?.name ||
                                                                    "Unnamed Project"}
                                                            </h3>

                                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                                {project?.description ||
                                                                    "No project description available."}
                                                            </p>

                                                        </div>

                                                        <div className="flex items-center gap-3">

                                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                                                                {progress}%
                                                            </span>

                                                            <ArrowRight
                                                                size={18}
                                                                className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                                                            />

                                                        </div>

                                                    </div>

                                                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">

                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />

                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">

                                                        <span>
                                                            {project?.statusName ||
                                                                project?.status ||
                                                                "Unknown status"}
                                                        </span>

                                                        <span>
                                                            Updated{" "}
                                                            {formatDate(
                                                                project?.updatedAt
                                                            )}
                                                        </span>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    </section>

                    {/* ==================================================
                        SPRINT OVERVIEW
                    ================================================== */}

                    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200">

                                    <CalendarDays size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Sprint Overview
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Monitor your project sprints
                                    </p>

                                </div>

                            </div>

                            <CalendarDays
                                size={20}
                                className="text-emerald-500"
                            />

                        </div>

                        <div className="p-6">

                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

                                    <div>

                                        <p className="text-sm font-semibold text-emerald-700">
                                            Total Sprints
                                        </p>

                                        <p className="mt-1 text-3xl font-bold text-slate-900">
                                            {sprintStatistics.totalSprints}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-blue-700">
                                            Active Sprints
                                        </p>

                                        <p className="mt-1 text-3xl font-bold text-slate-900">
                                            {sprintStatistics.activeSprints}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-violet-700">
                                            Completed Sprints
                                        </p>

                                        <p className="mt-1 text-3xl font-bold text-slate-900">
                                            {sprintStatistics.completedSprints}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-6 border-t border-emerald-200 pt-5">

                                    {activeSprint ? (

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                            <div>

                                                <div className="flex items-center gap-2">

                                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                                    <p className="text-sm font-semibold text-emerald-700">
                                                        Active Sprint
                                                    </p>

                                                </div>

                                                <h3 className="mt-2 text-xl font-bold text-slate-900">
                                                    {activeSprint?.name ||
                                                        activeSprint?.title ||
                                                        "Active Sprint"}
                                                </h3>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        "/manager/sprints"
                                                    )
                                                }
                                                className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-emerald-600 hover:to-green-700 hover:shadow-md"
                                            >
                                                View Sprints

                                                <ArrowRight
                                                    size={17}
                                                />

                                            </button>

                                        </div>

                                    ) : (

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                            <div>

                                                <p className="text-sm font-semibold text-slate-700">
                                                    Sprint Management
                                                </p>

                                                <h3 className="mt-1 text-xl font-bold text-slate-900">
                                                    No active sprint
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Create or manage your project sprints from the sprint management page.
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        "/manager/sprints"
                                                    )
                                                }
                                                className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-emerald-600 hover:to-green-700 hover:shadow-md"
                                            >
                                                View Sprints

                                                <ArrowRight
                                                    size={17}
                                                />

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        AI INSIGHTS
                    ================================================== */}

                    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between border-b border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 ring-1 ring-purple-200">

                                    <Sparkles size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        AI Insights
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Intelligent analysis from project data
                                    </p>

                                </div>

                            </div>

                            <Sparkles
                                size={20}
                                className="text-purple-500"
                            />

                        </div>

                        <div className="p-6">

                            <div className="rounded-2xl border border-dashed border-purple-300 bg-purple-50/50 px-6 py-12 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 ring-1 ring-purple-200">

                                    <Sparkles
                                        size={32}
                                        className="text-purple-600"
                                    />

                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    AI intelligence is ready
                                </h3>

                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                    AI insights will appear here when project,
                                    sprint and task data becomes available.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/manager/ai-features"
                                        )
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-purple-700 hover:to-violet-700 hover:shadow-md"
                                >
                                    Explore AI Features

                                    <ArrowRight
                                        size={17}
                                    />

                                </button>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        TEAM PERFORMANCE
                    ================================================== */}

                    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 ring-1 ring-violet-200">

                                    <Users size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Team Performance
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Monitor team workload and progress
                                    </p>

                                </div>

                            </div>

                            <Users
                                size={20}
                                className="text-violet-500"
                            />

                        </div>

                        <div className="p-6">

                            <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-6">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <p className="text-sm font-semibold text-violet-700">
                                            Team Members
                                        </p>

                                        <h3 className="mt-1 text-3xl font-bold text-slate-900">
                                            {teamMemberCount}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Team member information available from your project data.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/manager/team"
                                            )
                                        }
                                        className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-purple-700 hover:shadow-md"
                                    >
                                        View Team

                                        <ArrowRight
                                            size={17}
                                        />

                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        RECENT ACTIVITY
                    ================================================== */}

                    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between border-b border-cyan-100 bg-gradient-to-r from-cyan-50 to-sky-50 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 ring-1 ring-cyan-200">

                                    <Activity size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Recent Activity
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Latest updates across your projects
                                    </p>

                                </div>

                            </div>

                            <Activity
                                size={20}
                                className="text-cyan-500"
                            />

                        </div>

                        <div className="p-6">

                            {recentProjects.length === 0 ? (

                                <div className="rounded-2xl border border-dashed border-cyan-300 bg-cyan-50/50 px-6 py-12 text-center">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 ring-1 ring-cyan-200">

                                        <Activity
                                            size={32}
                                            className="text-cyan-600"
                                        />

                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                                        No recent activity
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Recent project activity will appear here once your projects are available.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {recentProjects.map(
                                        (project) => {

                                            const projectId =
                                                project?.projectId ??
                                                project?.id;

                                            return (
                                                <button
                                                    key={projectId}
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/manager/projects/${projectId}`
                                                        )
                                                    }
                                                    className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50/40"
                                                >

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">

                                                        <FolderKanban
                                                            size={20}
                                                        />

                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <h3 className="truncate font-bold text-slate-900 group-hover:text-cyan-700">
                                                            {project?.name ||
                                                                "Unnamed Project"}
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-500">

                                                            {project?.statusName ||
                                                                project?.status ||
                                                                "Project updated"}

                                                            {" • "}

                                                            {formatDate(
                                                                project?.updatedAt ??
                                                                    project?.createdAt
                                                            )}

                                                        </p>

                                                    </div>

                                                    <ArrowRight
                                                        size={17}
                                                        className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-cyan-600"
                                                    />

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    </section>

                    {/* ==================================================
                        QUICK ACTIONS
                    ================================================== */}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">

                                    <Settings2 size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Quick Actions
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Frequently used manager tools
                                    </p>

                                </div>

                            </div>

                            <Settings2
                                size={20}
                                className="text-orange-500"
                            />

                        </div>

                        <div className="p-6">

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                                {quickActions.map(
                                    (action) => {

                                        const Icon =
                                            action.icon;

                                        return (
                                            <button
                                                key={action.title}
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        action.path
                                                    )
                                                }
                                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                                            >

                                                <div
                                                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${action.color}`}
                                                />

                                                <div className="flex items-center justify-between">

                                                    <div
                                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg}`}
                                                    >

                                                        <Icon
                                                            size={21}
                                                            className={
                                                                action.iconColor
                                                            }
                                                        />

                                                    </div>

                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-slate-100 group-hover:text-slate-700">

                                                        <ArrowRight
                                                            size={16}
                                                            className="transition-transform group-hover:translate-x-1"
                                                        />

                                                    </div>

                                                </div>

                                                <h3 className="mt-5 font-bold text-slate-900">
                                                    {action.title}
                                                </h3>

                                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                                    {action.description}
                                                </p>

                                                <div
                                                    className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${action.color}`}
                                                />

                                            </button>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ManagerDashboard;