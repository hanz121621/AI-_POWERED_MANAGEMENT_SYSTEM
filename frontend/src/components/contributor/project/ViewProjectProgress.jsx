
import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock3,
    FolderKanban,
    Loader2,
    RefreshCw,
    Target,
    TrendingUp,
    X,
} from "lucide-react";

// ============================================================
// CONT-PROJECT-005
// VIEW PROJECT PROGRESS
// ============================================================
//
// Primary Actor:
// Contributor
//   - Team Leader
//   - Staff
//   - Developer
//
// Goal:
// Allow Contributors to understand the current progress of
// projects in which they participate.
//
// Main Success Scenario:
// 1. Contributor opens assigned project.
// 2. System retrieves project progress.
// 3. System displays:
//    - Overall project progress
//    - Completed tasks
//    - In-progress tasks
//    - Blocked tasks
//    - Pending tasks
//    - Sprint progress
//    - Upcoming deadlines
//
// Important:
// Contributor can VIEW project progress.
// Contributor cannot modify project progress from this page.
//
// ============================================================

// ============================================================
// TEMPORARY PROJECT DATA
// ============================================================
//
// This allows the frontend to work before the backend endpoint
// is connected.
//
// Later this section will be replaced by the project service/API.
// ============================================================

const INITIAL_PROJECTS = [
    {
        id: "PROJ-001",
        name: "AI Project Management System",
        description:
            "AI-powered project management system for managing projects, teams, tasks, sprints, and project progress.",
        status: "In Progress",

        // Overall project progress
        progress: 68,

        // Task progress
        completedTasks: 17,
        inProgressTasks: 6,
        blockedTasks: 2,
        pendingTasks: 5,

        // Sprint
        sprintName: "Sprint 4",
        sprintGoal:
            "Complete contributor work management and project participation features.",
        sprintProgress: 72,

        // Deadline
        upcomingDeadline: "2026-09-05",
    },

    {
        id: "PROJ-002",
        name: "FieldSync",
        description:
            "Offline-first field management and synchronization platform.",
        status: "In Progress",

        progress: 54,

        completedTasks: 12,
        inProgressTasks: 7,
        blockedTasks: 1,
        pendingTasks: 8,

        sprintName: "Sprint 3",
        sprintGoal:
            "Improve synchronization, offline tracking, and conflict resolution.",
        sprintProgress: 61,

        upcomingDeadline: "2026-09-12",
    },
];

// ============================================================
// DATE FORMATTER
// ============================================================

function formatDate(dateString) {
    if (!dateString) {
        return "Not available";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// ============================================================
// PROGRESS LABEL
// ============================================================

function getProgressLabel(progress) {
    const value = Number(progress) || 0;

    if (value >= 80) {
        return "On Track";
    }

    if (value >= 50) {
        return "In Progress";
    }

    if (value > 0) {
        return "Needs Attention";
    }

    return "Not Started";
}

// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({
    value,
    label = "Progress",
    showPercentage = true,
}) {
    const safeValue = Math.min(
        Math.max(Number(value) || 0, 0),
        100
    );

    return (
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                    {label}
                </span>

                {showPercentage && (
                    <span className="text-sm font-semibold text-white">
                        {safeValue}%
                    </span>
                )}
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                        width: `${safeValue}%`,
                    }}
                />
            </div>
        </div>
    );
}

// ============================================================
// STAT CARD
// ============================================================

function ProgressStat({
    label,
    value,
    icon: Icon,
    iconClassName,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                        {value}
                    </p>
                </div>

                <div className="rounded-lg bg-slate-800 p-2.5">
                    <Icon
                        size={20}
                        className={iconClassName}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// PROJECT PROGRESS DETAILS MODAL
// ============================================================

function ProjectProgressDetails({
    project,
    onClose,
}) {
    if (!project) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-progress-title"
        >
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
                {/* ==================================================
                    MODAL HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-800 p-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <TrendingUp
                                size={21}
                                className="text-blue-400"
                            />

                            <h2
                                id="project-progress-title"
                                className="text-xl font-bold text-white"
                            >
                                Project Progress
                            </h2>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            {project.id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ==================================================
                    MODAL BODY
                ================================================== */}

                <div className="space-y-6 p-5">
                    {/* Project information */}
                    <section>
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-blue-500/10 p-3">
                                <FolderKanban
                                    size={24}
                                    className="text-blue-400"
                                />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    {project.name}
                                </h3>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Overall progress */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-white">
                                    Overall Project Progress
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Current project completion level
                                </p>
                            </div>

                            <TrendingUp
                                size={22}
                                className="text-blue-400"
                            />
                        </div>

                        <ProgressBar
                            value={project.progress}
                            label="Project Progress"
                        />

                        <p className="mt-3 text-xs text-slate-400">
                            Status:{" "}
                            <span className="font-medium text-blue-300">
                                {getProgressLabel(
                                    project.progress
                                )}
                            </span>
                        </p>
                    </section>

                    {/* Task statistics */}
                    <section>
                        <div className="mb-3">
                            <h3 className="font-semibold text-white">
                                Task Progress
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Current task distribution
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <ProgressStat
                                label="Completed Tasks"
                                value={project.completedTasks}
                                icon={CheckCircle2}
                                iconClassName="text-emerald-400"
                            />

                            <ProgressStat
                                label="In-Progress Tasks"
                                value={project.inProgressTasks}
                                icon={Activity}
                                iconClassName="text-blue-400"
                            />

                            <ProgressStat
                                label="Blocked Tasks"
                                value={project.blockedTasks}
                                icon={AlertCircle}
                                iconClassName="text-red-400"
                            />

                            <ProgressStat
                                label="Pending Tasks"
                                value={project.pendingTasks}
                                icon={Clock3}
                                iconClassName="text-amber-400"
                            />
                        </div>
                    </section>

                    {/* Sprint progress */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-white">
                                    Sprint Progress
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    {project.sprintName}
                                </p>
                            </div>

                            <Target
                                size={22}
                                className="text-purple-400"
                            />
                        </div>

                        <ProgressBar
                            value={project.sprintProgress}
                            label="Sprint Completion"
                        />

                        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                            <p className="text-xs font-medium text-slate-500">
                                Sprint Goal
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-300">
                                {project.sprintGoal}
                            </p>
                        </div>
                    </section>

                    {/* Upcoming deadline */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-800 p-2.5">
                                <Clock3
                                    size={20}
                                    className="text-amber-400"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Upcoming Deadline
                                </p>

                                <p className="mt-1 font-semibold text-white">
                                    {formatDate(
                                        project.upcomingDeadline
                                    )}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ==================================================
                    MODAL FOOTER
                ================================================== */}

                <div className="flex justify-end border-t border-slate-800 p-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ViewProjectProgress() {
    const [projects, setProjects] = useState([]);

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] = useState("");

    // ========================================================
    // LOAD PROJECT PROGRESS
    // ========================================================

    useEffect(() => {
        let isMounted = true;

        const loadProjectProgress = async () => {
            try {
                setLoading(true);
                setError("");

                // =================================================
                // BACKEND INTEGRATION POINT
                // =================================================
                //
                // Later replace this temporary data with:
                //
                // const response =
                //     await projectService.getMyProjectProgress();
                //
                // setProjects(response.data);
                //
                // =================================================

                await new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });

                if (isMounted) {
                    setProjects(INITIAL_PROJECTS);
                }
            } catch (err) {
                console.error(
                    "Failed to load project progress:",
                    err
                );

                if (isMounted) {
                    setError(
                        "Project progress information is currently unavailable."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProjectProgress();

        return () => {
            isMounted = false;
        };
    }, []);

    // ========================================================
    // REFRESH PROJECT PROGRESS
    // ========================================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            // Backend API call will go here later.
            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });

            setProjects([...INITIAL_PROJECTS]);
        } catch (err) {
            console.error(
                "Failed to refresh project progress:",
                err
            );

            setError(
                "Project progress information is currently unavailable."
            );
        } finally {
            setRefreshing(false);
        }
    };

    // ========================================================
    // SUMMARY DATA
    // ========================================================

    const summary = useMemo(() => {
        if (!projects.length) {
            return {
                totalProjects: 0,
                averageProgress: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                blockedTasks: 0,
                pendingTasks: 0,
            };
        }

        const totalProjects = projects.length;

        const averageProgress = Math.round(
            projects.reduce(
                (total, project) =>
                    total + Number(project.progress || 0),
                0
            ) / totalProjects
        );

        return {
            totalProjects,

            averageProgress,

            completedTasks: projects.reduce(
                (total, project) =>
                    total +
                    Number(project.completedTasks || 0),
                0
            ),

            inProgressTasks: projects.reduce(
                (total, project) =>
                    total +
                    Number(project.inProgressTasks || 0),
                0
            ),

            blockedTasks: projects.reduce(
                (total, project) =>
                    total +
                    Number(project.blockedTasks || 0),
                0
            ),

            pendingTasks: projects.reduce(
                (total, project) =>
                    total +
                    Number(project.pendingTasks || 0),
                0
            ),
        };
    }, [projects]);

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <Loader2
                        size={34}
                        className="mx-auto animate-spin text-blue-400"
                    />

                    <p className="mt-3 text-sm text-slate-400">
                        Loading project progress...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (
        <div className="min-h-full space-y-6 p-4 sm:p-6">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <TrendingUp
                            size={25}
                            className="text-blue-400"
                        />

                        <h1 className="text-2xl font-bold text-white">
                            Project Progress
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                        Understand the current progress of projects
                        in which you participate.
                    </p>
                </div>

                {/* Refresh is a VIEW operation, not an edit operation */}
                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* ==================================================
                ALTERNATIVE FLOW A1
                Progress data unavailable
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/30 p-4">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-red-400"
                    />

                    <div>
                        <p className="font-medium text-red-300">
                            Project Progress Unavailable
                        </p>

                        <p className="mt-1 text-sm text-red-400">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ProgressStat
                    label="Assigned Projects"
                    value={summary.totalProjects}
                    icon={FolderKanban}
                    iconClassName="text-blue-400"
                />

                <ProgressStat
                    label="Average Progress"
                    value={`${summary.averageProgress}%`}
                    icon={TrendingUp}
                    iconClassName="text-emerald-400"
                />

                <ProgressStat
                    label="Completed Tasks"
                    value={summary.completedTasks}
                    icon={CheckCircle2}
                    iconClassName="text-emerald-400"
                />

                <ProgressStat
                    label="Blocked Tasks"
                    value={summary.blockedTasks}
                    icon={AlertCircle}
                    iconClassName="text-red-400"
                />
            </div>

            {/* ==================================================
                NO PROJECTS
            ================================================== */}

            {!projects.length ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
                    <FolderKanban
                        size={42}
                        className="mx-auto text-slate-600"
                    />

                    <h2 className="mt-4 text-lg font-semibold text-white">
                        No Project Progress Available
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        Project progress information is currently
                        unavailable.
                    </p>
                </div>
            ) : (
                /* ==================================================
                   PROJECT PROGRESS CARDS
                ================================================== */

                <div className="grid gap-5 xl:grid-cols-2">
                    {projects.map((project) => (
                        <article
                            key={project.id}
                            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
                        >
                            {/* Project header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="rounded-xl bg-blue-500/10 p-3">
                                        <FolderKanban
                                            size={22}
                                            className="text-blue-400"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-blue-400">
                                            {project.id}
                                        </p>

                                        <h2 className="mt-1 text-lg font-bold text-white">
                                            {project.name}
                                        </h2>

                                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                <span className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                                    {project.status}
                                </span>
                            </div>

                            {/* ==================================================
                                OVERALL PROJECT PROGRESS
                            ================================================== */}

                            <div className="mt-6">
                                <ProgressBar
                                    value={project.progress}
                                    label="Overall Project Progress"
                                />
                            </div>

                            {/* ==================================================
                                TASK PROGRESS
                            ================================================== */}

                            <div className="mt-5">
                                <p className="mb-3 text-xs font-medium text-slate-400">
                                    Task Progress
                                </p>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div className="rounded-lg bg-slate-950/60 p-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2
                                                size={15}
                                                className="text-emerald-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Completed
                                            </p>
                                        </div>

                                        <p className="mt-1 text-lg font-bold text-emerald-400">
                                            {
                                                project.completedTasks
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-950/60 p-3">
                                        <div className="flex items-center gap-2">
                                            <Activity
                                                size={15}
                                                className="text-blue-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                In Progress
                                            </p>
                                        </div>

                                        <p className="mt-1 text-lg font-bold text-blue-400">
                                            {
                                                project.inProgressTasks
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-950/60 p-3">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle
                                                size={15}
                                                className="text-red-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Blocked
                                            </p>
                                        </div>

                                        <p className="mt-1 text-lg font-bold text-red-400">
                                            {
                                                project.blockedTasks
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-950/60 p-3">
                                        <div className="flex items-center gap-2">
                                            <Clock3
                                                size={15}
                                                className="text-amber-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Pending
                                            </p>
                                        </div>

                                        <p className="mt-1 text-lg font-bold text-amber-400">
                                            {
                                                project.pendingTasks
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                SPRINT PROGRESS
                            ================================================== */}

                            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {
                                                project.sprintName
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Sprint Progress
                                        </p>
                                    </div>

                                    <Target
                                        size={19}
                                        className="text-purple-400"
                                    />
                                </div>

                                <ProgressBar
                                    value={
                                        project.sprintProgress
                                    }
                                    label="Sprint Completion"
                                />
                            </div>

                            {/* ==================================================
                                UPCOMING DEADLINE
                            ================================================== */}

                            <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-800 p-3">
                                <div className="flex items-center gap-2">
                                    <Clock3
                                        size={18}
                                        className="text-amber-400"
                                    />

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Upcoming Deadline
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-white">
                                            {formatDate(
                                                project.upcomingDeadline
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-xs text-slate-500">
                                    {getProgressLabel(
                                        project.progress
                                    )}
                                </span>
                            </div>

                            {/* ==================================================
                                VIEW DETAILS
                            ================================================== */}

                            <div className="mt-5 flex justify-end border-t border-slate-800 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedProject(
                                            project
                                        )
                                    }
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                                >
                                    View Progress Details
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* ==================================================
                PROJECT DETAILS
            ================================================== */}

            {selectedProject && (
                <ProjectProgressDetails
                    project={selectedProject}
                    onClose={() =>
                        setSelectedProject(null)
                    }
                />
            )}
        </div>
    );
}
