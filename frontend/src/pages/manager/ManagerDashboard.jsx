
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
// UI aligned with Admin design system
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

import { Button } from "@/components/ui/button";

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

    return Math.min(100, Math.max(0, value));
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
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
        const totalProjects = projects.length;

        const activeProjects = projects.filter(
            (project) =>
                getProjectStatus(project) === "active"
        ).length;

        const completedProjects = projects.filter(
            (project) =>
                getProjectStatus(project) === "completed"
        ).length;

        const archivedProjects = projects.filter(
            (project) =>
                getProjectStatus(project) === "archived"
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
                    return (
                        getProjectProgress(a) -
                        getProjectProgress(b)
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
        const totalSprints = sprints.length;

        const activeSprints = sprints.filter(
            (sprint) => {
                const status =
                    getSprintStatus(sprint);

                return (
                    status === "active" ||
                    status === "inprogress" ||
                    status === "in progress"
                );
            }
        ).length;

        const completedSprints = sprints.filter(
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
    // STATISTICS
    // ========================================================

    const stats = [
        {
            title: "Total Projects",
            value: statistics.totalProjects,
            description: "Projects assigned to you",
            icon: FolderKanban,
            path: "/manager/projects",
        },
        {
            title: "Active Projects",
            value: statistics.activeProjects,
            description: "Projects currently in progress",
            icon: PlayCircle,
            path: "/manager/projects",
        },
        {
            title: "Completed Projects",
            value: statistics.completedProjects,
            description: "Projects successfully completed",
            icon: CheckCircle2,
            path: "/manager/projects",
        },
        {
            title: "Team Members",
            value: teamMemberCount,
            description: "Members assigned to your teams",
            icon: Users,
            path: "/manager/team",
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
        },
        {
            title: "Manage Sprints",
            description:
                "Create and manage project sprints",
            icon: CalendarDays,
            path: "/manager/sprints",
        },
        {
            title: "Manage Team",
            description:
                "View your team members",
            icon: Users,
            path: "/manager/team",
        },
        {
            title: "View Reports",
            description:
                "Monitor project reports",
            icon: Activity,
            path: "/manager/reports",
        },
        {
            title: "AI Features",
            description:
                "Use AI project intelligence",
            icon: Sparkles,
            path: "/manager/ai-features",
        },
        {
            title: "Notifications",
            description:
                "View your notifications",
            icon: Bell,
            path: "/manager/notifications",
        },
    ];

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-full bg-background text-foreground">
                <div className="mx-auto w-full max-w-[1800px]">
                    <div className="flex min-h-[500px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                <RefreshCw
                                    size={30}
                                    className="animate-spin text-primary"
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-foreground">
                                Loading Manager Dashboard
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Loading your projects, sprints and dashboard data...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-background text-foreground">

            <div className="mx-auto w-full max-w-[1800px]">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <FolderKanban size={28} />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <Sparkles
                                        size={15}
                                        className="text-primary"
                                    />

                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Manager Workspace
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Manager Dashboard
                                </h1>

                                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                    Monitor your projects, sprints, teams and
                                    AI-powered project intelligence from one place.
                                </p>
                            </div>

                        </div>

                        <div className="flex flex-wrap gap-2">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    loadDashboard(true)
                                }
                                disabled={refreshing}
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                                Refresh
                            </Button>

                            <Button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/manager/projects"
                                    )
                                }
                            >
                                <FolderKanban size={16} />
                                View Projects
                            </Button>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <section className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-5">

                        <div className="flex items-start gap-3">

                            <AlertCircle
                                size={22}
                                className="mt-0.5 shrink-0 text-destructive"
                            />

                            <div className="flex-1">

                                <h3 className="font-bold text-foreground">
                                    Unable to load dashboard
                                </h3>

                                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                                    {error}
                                </p>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="mt-4"
                                    onClick={() =>
                                        loadDashboard()
                                    }
                                >
                                    Try Again
                                </Button>

                            </div>

                        </div>

                    </section>
                )}

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <section className="mb-6">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <button
                                    key={stat.title}
                                    type="button"
                                    onClick={() =>
                                        navigate(stat.path)
                                    }
                                    className="
                                        group
                                        rounded-xl
                                        border
                                        border-border
                                        bg-card
                                        p-5
                                        text-left
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-primary/40
                                        hover:shadow-md
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-primary
                                        focus:ring-offset-2
                                        focus:ring-offset-background
                                    "
                                >

                                    <div className="flex items-start justify-between">

                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {stat.title}
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-foreground">
                                                {stat.value}
                                            </p>
                                        </div>

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon size={21} />
                                        </div>

                                    </div>

                                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                        {stat.description}
                                    </p>

                                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                                        View details
                                        <ArrowRight
                                            size={14}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </div>

                                </button>
                            );
                        })}

                    </div>

                </section>

                {/* ==================================================
                    PROJECT PROGRESS
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card shadow-sm">

                    <div className="flex items-center justify-between border-b border-border px-5 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <FolderKanban size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Project Progress
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Monitor active project delivery
                                </p>
                            </div>

                        </div>

                        <FolderKanban
                            size={19}
                            className="text-muted-foreground"
                        />

                    </div>

                    <div className="p-5">

                        {activeProjects.length === 0 ? (

                            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                    <FolderKanban size={28} />
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-foreground">
                                    No active projects
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                                    Active project progress will appear here once your projects are available.
                                </p>

                                <Button
                                    type="button"
                                    className="mt-5"
                                    onClick={() =>
                                        navigate(
                                            "/manager/projects"
                                        )
                                    }
                                >
                                    View Projects
                                    <ArrowRight size={16} />
                                </Button>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {activeProjects.map((project) => {

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
                                            className="
                                                group
                                                w-full
                                                rounded-lg
                                                border
                                                border-border
                                                bg-muted/20
                                                p-4
                                                text-left
                                                transition-all
                                                hover:border-primary/40
                                                hover:bg-muted/40
                                            "
                                        >

                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="min-w-0">

                                                    <h3 className="truncate font-semibold text-foreground group-hover:text-primary">
                                                        {project?.name ||
                                                            "Unnamed Project"}
                                                    </h3>

                                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                        {project?.description ||
                                                            "No project description available."}
                                                    </p>

                                                </div>

                                                <div className="flex items-center gap-3">

                                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                                                        {progress}%
                                                    </span>

                                                    <ArrowRight
                                                        size={18}
                                                        className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                                                    />

                                                </div>

                                            </div>

                                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">

                                                <div
                                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />

                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">

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
                                })}

                            </div>

                        )}

                    </div>

                </section>

                {/* ==================================================
                    SPRINT OVERVIEW
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card shadow-sm">

                    <div className="flex items-center justify-between border-b border-border px-5 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <CalendarDays size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Sprint Overview
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Monitor your project sprints
                                </p>
                            </div>

                        </div>

                        <CalendarDays
                            size={19}
                            className="text-muted-foreground"
                        />

                    </div>

                    <div className="p-5">

                        <div className="rounded-lg border border-border bg-muted/20 p-5">

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Sprints
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-foreground">
                                        {sprintStatistics.totalSprints}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Active Sprints
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-foreground">
                                        {sprintStatistics.activeSprints}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Completed Sprints
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-foreground">
                                        {sprintStatistics.completedSprints}
                                    </p>
                                </div>

                            </div>

                            <div className="mt-5 border-t border-border pt-5">

                                {activeSprint ? (

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <p className="text-sm font-medium text-primary">
                                                Active Sprint
                                            </p>

                                            <h3 className="mt-1 text-xl font-semibold text-foreground">
                                                {activeSprint?.name ||
                                                    activeSprint?.title ||
                                                    "Active Sprint"}
                                            </h3>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/manager/sprints"
                                                )
                                            }
                                        >
                                            View Sprints
                                            <ArrowRight size={16} />
                                        </Button>

                                    </div>

                                ) : (

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Sprint Management
                                            </p>

                                            <h3 className="mt-1 text-xl font-semibold text-foreground">
                                                No active sprint
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Create or manage your project sprints from the sprint management page.
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/manager/sprints"
                                                )
                                            }
                                        >
                                            View Sprints
                                            <ArrowRight size={16} />
                                        </Button>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    AI INSIGHTS
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card shadow-sm">

                    <div className="flex items-center justify-between border-b border-border px-5 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Sparkles size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    AI Insights
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Intelligent analysis from project data
                                </p>
                            </div>

                        </div>

                        <Sparkles
                            size={19}
                            className="text-muted-foreground"
                        />

                    </div>

                    <div className="p-5">

                        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Sparkles size={28} />
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-foreground">
                                AI intelligence is ready
                            </h3>

                            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                AI insights will appear here when project,
                                sprint and task data becomes available.
                            </p>

                            <Button
                                type="button"
                                className="mt-5"
                                onClick={() =>
                                    navigate(
                                        "/manager/ai-features"
                                    )
                                }
                            >
                                Explore AI Features
                                <ArrowRight size={16} />
                            </Button>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    TEAM PERFORMANCE
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card shadow-sm">

                    <div className="flex items-center justify-between border-b border-border px-5 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Team Performance
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Monitor team workload and progress
                                </p>
                            </div>

                        </div>

                        <Users
                            size={19}
                            className="text-muted-foreground"
                        />

                    </div>

                    <div className="p-5">

                        <div className="rounded-lg border border-border bg-muted/20 p-5">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <p className="text-sm font-medium text-muted-foreground">
                                        Team Members
                                    </p>

                                    <h3 className="mt-1 text-3xl font-bold text-foreground">
                                        {teamMemberCount}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Team member information available from your project data.
                                    </p>

                                </div>

                                <Button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/manager/team"
                                        )
                                    }
                                >
                                    View Team
                                    <ArrowRight size={16} />
                                </Button>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    RECENT ACTIVITY
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card shadow-sm">

                    <div className="flex items-center justify-between border-b border-border px-5 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Activity size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Recent Activity
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Latest updates across your projects
                                </p>
                            </div>

                        </div>

                        <Activity
                            size={19}
                            className="text-muted-foreground"
                        />

                    </div>

                    <div className="p-5">

                        {recentProjects.length === 0 ? (

                            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                    <Activity size={28} />
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-foreground">
                                    No recent activity
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                                    Recent project activity will appear here once your projects are available.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-2">

                                {recentProjects.map((project) => {

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
                                            className="
                                                group
                                                flex
                                                w-full
                                                items-center
                                                gap-4
                                                rounded-lg
                                                border
                                                border-border
                                                bg-background
                                                p-4
                                                text-left
                                                transition-all
                                                hover:border-primary/40
                                                hover:bg-muted/30
                                            "
                                        >

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <FolderKanban size={19} />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <h3 className="truncate font-semibold text-foreground group-hover:text-primary">
                                                    {project?.name ||
                                                        "Unnamed Project"}
                                                </h3>

                                                <p className="mt-1 text-xs text-muted-foreground">

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
                                                className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                                            />

                                        </button>
                                    );
                                })}

                            </div>

                        )}

                    </div>

                </section>

                {/* ==================================================
                    QUICK ACTIONS
                ================================================== */}

                <section className="rounded-xl border border-border bg-card shadow-sm">

                    <div className="flex items-center justify-between border-b border-border px-5 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Settings2 size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Quick Actions
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Frequently used manager tools
                                </p>
                            </div>

                        </div>

                        <Settings2
                            size={19}
                            className="text-muted-foreground"
                        />

                    </div>

                    <div className="p-5">

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {quickActions.map((action) => {

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
                                        className="
                                            group
                                            rounded-xl
                                            border
                                            border-border
                                            bg-background
                                            p-5
                                            text-left
                                            transition-all
                                            duration-200
                                            hover:-translate-y-0.5
                                            hover:border-primary/40
                                            hover:bg-muted/20
                                            hover:shadow-sm
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-primary
                                            focus:ring-offset-2
                                            focus:ring-offset-background
                                        "
                                    >

                                        <div className="flex items-center justify-between">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon size={21} />
                                            </div>

                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition group-hover:text-primary">
                                                <ArrowRight
                                                    size={16}
                                                    className="transition-transform group-hover:translate-x-1"
                                                />
                                            </div>

                                        </div>

                                        <h3 className="mt-5 font-semibold text-foreground">
                                            {action.title}
                                        </h3>

                                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                            {action.description}
                                        </p>

                                    </button>
                                );
                            })}

                        </div>

                    </div>

                </section>

            </div>
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ManagerDashboard;