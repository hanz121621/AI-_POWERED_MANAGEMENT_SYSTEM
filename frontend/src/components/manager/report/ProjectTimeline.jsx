import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock,
    FolderKanban,
    Loader2,
    Milestone,
    RefreshCw,
    Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getAuthorizedManagerProjects,
    getProjectTimeline,
} from "@/services/projectReportService";

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "Unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unavailable";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) {
        return "Unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unavailable";
    }

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getId = (item) =>
    item?.id ??
    item?._id ??
    item?.projectId ??
    item?.sprintId ??
    item?.milestoneId ??
    "";

const getName = (item, fallback = "Unavailable") =>
    item?.name ??
    item?.title ??
    item?.projectName ??
    item?.sprintName ??
    item?.milestoneName ??
    fallback;

const normalizePercentage = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return null;
    }

    return Math.min(
        100,
        Math.max(0, Math.round(number))
    );
};

const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (
        value.includes("complete") ||
        value.includes("completed") ||
        value.includes("done") ||
        value.includes("success")
    ) {
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (
        value.includes("progress") ||
        value.includes("active") ||
        value.includes("ongoing")
    ) {
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }

    if (
        value.includes("overdue") ||
        value.includes("late") ||
        value.includes("failed") ||
        value.includes("blocked")
    ) {
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (
        value.includes("pending") ||
        value.includes("planning") ||
        value.includes("upcoming")
    ) {
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-slate-500/10 text-slate-300 border-slate-500/20";
};

// ============================================================
// SMALL UI COMPONENTS
// ============================================================

function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    loading = false,
}) {
    return (
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-400">
                        {title}
                    </p>

                    <div className="mt-2 text-2xl font-bold text-white">
                        {loading ? (
                            <div className="h-8 w-16 animate-pulse rounded bg-slate-700" />
                        ) : (
                            value
                        )}
                    </div>

                    {description && (
                        <p className="mt-1 text-xs text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-800 p-2.5">
                    <Icon className="h-5 w-5 text-slate-300" />
                </div>
            </div>
        </div>
    );
}

function SectionCard({
    title,
    description,
    icon: Icon,
    children,
    action,
}) {
    return (
        <section className="rounded-xl border border-slate-700/70 bg-slate-900/70 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="rounded-lg bg-slate-800 p-2">
                            <Icon className="h-4 w-4 text-slate-300" />
                        </div>
                    )}

                    <div>
                        <h2 className="font-semibold text-white">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-0.5 text-xs text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {action}
            </div>

            <div className="p-5">
                {children}
            </div>
        </section>
    );
}

function EmptyState({
    message = "No information available.",
    icon: Icon = AlertCircle,
}) {
    return (
        <div className="flex min-h-24 items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/30 px-4 py-6 text-center text-sm text-slate-500">
            <Icon className="h-4 w-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}

function ProgressBar({ value }) {
    const percentage = normalizePercentage(value);

    if (percentage === null) {
        return (
            <div className="text-sm text-slate-500">
                Insufficient data
            </div>
        );
    }

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                    Current progress
                </span>

                <span className="font-medium text-white">
                    {percentage}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// REPORT-002 — VIEW PROJECT TIMELINE
// ============================================================

export default function ProjectTimeline() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [timeline, setTimeline] = useState(null);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingTimeline, setLoadingTimeline] =
        useState(false);

    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] =
        useState(null);

    // ========================================================
    // LOAD AUTHORIZED PROJECTS
    // ========================================================

    const loadProjects = useCallback(async () => {
        setLoadingProjects(true);
        setError("");

        try {
            const result =
                await getAuthorizedManagerProjects();

            if (!result?.success) {
                throw new Error(
                    result?.error ||
                        "Unable to load authorized projects."
                );
            }

            const authorizedProjects =
                Array.isArray(result?.data)
                    ? result.data
                    : Array.isArray(
                          result?.data?.projects
                      )
                    ? result.data.projects
                    : [];

            setProjects(authorizedProjects);

            if (authorizedProjects.length > 0) {
                const firstProjectId = getId(
                    authorizedProjects[0]
                );

                setSelectedProjectId(
                    String(firstProjectId)
                );
            } else {
                setSelectedProjectId("");
                setTimeline(null);
            }
        } catch (err) {
            console.error(
                "Failed to load authorized projects:",
                err
            );

            setProjects([]);
            setSelectedProjectId("");
            setTimeline(null);

            setError(
                err?.message ||
                    "Unable to load authorized projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    }, []);

    // ========================================================
    // LOAD PROJECT TIMELINE
    // ========================================================

    const loadTimeline = useCallback(
        async (projectId) => {
            if (!projectId) {
                setTimeline(null);
                return;
            }

            setLoadingTimeline(true);
            setError("");

            try {
                const result =
                    await getProjectTimeline(
                        projectId
                    );

                if (!result?.success) {
                    throw new Error(
                        result?.error ||
                            "Unable to load project timeline."
                    );
                }

                const timelineData =
                    result?.data ??
                    result?.timeline ??
                    null;

                setTimeline(timelineData);

                setLastUpdated(
                    new Date().toISOString()
                );
            } catch (err) {
                console.error(
                    "Failed to load project timeline:",
                    err
                );

                setTimeline(null);

                setError(
                    err?.message ||
                        "Unable to load project timeline."
                );
            } finally {
                setLoadingTimeline(false);
            }
        },
        []
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    useEffect(() => {
        if (selectedProjectId) {
            loadTimeline(selectedProjectId);
        }
    }, [
        selectedProjectId,
        loadTimeline,
    ]);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject = useMemo(
        () =>
            projects.find(
                (project) =>
                    String(getId(project)) ===
                    String(selectedProjectId)
            ),
        [
            projects,
            selectedProjectId,
        ]
    );

    // ========================================================
    // NORMALIZE TIMELINE DATA
    // ========================================================

    const project =
        timeline?.project ??
        selectedProject ??
        null;

    const projectStartDate =
        timeline?.projectStartDate ??
        timeline?.startDate ??
        project?.startDate ??
        project?.start_date ??
        null;

    const projectDeadline =
        timeline?.projectDeadline ??
        timeline?.deadline ??
        timeline?.endDate ??
        project?.deadline ??
        project?.endDate ??
        project?.end_date ??
        null;

    const currentProgress =
        normalizePercentage(
            timeline?.currentProgress ??
                timeline?.overallProgress ??
                timeline?.projectProgress ??
                timeline?.progress ??
                project?.progress
        );

    const milestones =
        Array.isArray(
            timeline?.milestones
        )
            ? timeline.milestones
            : Array.isArray(
                  timeline?.projectMilestones
              )
            ? timeline.projectMilestones
            : [];

    const sprints =
        Array.isArray(timeline?.sprints)
            ? timeline.sprints
            : Array.isArray(
                  timeline?.sprintPeriods
              )
            ? timeline.sprintPeriods
            : [];

    const overdueItems =
        Array.isArray(
            timeline?.overdueItems
        )
            ? timeline.overdueItems
            : Array.isArray(
                  timeline?.overdueScheduleItems
              )
            ? timeline.overdueScheduleItems
            : [];

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        if (!selectedProjectId) {
            await loadProjects();
            return;
        }

        await loadTimeline(
            selectedProjectId
        );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
                            <Calendar className="h-6 w-6 text-blue-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Project Timeline
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                REPORT-002 — View Project Timeline
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={
                            loadingProjects ||
                            loadingTimeline
                        }
                        className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                        {loadingProjects ||
                        loadingTimeline ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}

                        Refresh
                    </Button>
                </div>

                {/* ==================================================
                    PROJECT SELECTOR
                ================================================== */}

                <div className="mb-6 rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                    <label
                        htmlFor="timeline-project-selector"
                        className="mb-2 block text-sm font-medium text-slate-300"
                    >
                        Project
                    </label>

                    <select
                        id="timeline-project-selector"
                        value={selectedProjectId}
                        onChange={(event) =>
                            setSelectedProjectId(
                                event.target.value
                            )
                        }
                        disabled={
                            loadingProjects ||
                            projects.length === 0
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                    >
                        {loadingProjects ? (
                            <option value="">
                                Loading authorized projects...
                            </option>
                        ) : projects.length === 0 ? (
                            <option value="">
                                No authorized projects
                            </option>
                        ) : (
                            <>
                                <option value="">
                                    Select a project
                                </option>

                                {projects.map(
                                    (item) => {
                                        const id =
                                            getId(
                                                item
                                            );

                                        return (
                                            <option
                                                key={String(
                                                    id
                                                )}
                                                value={String(
                                                    id
                                                )}
                                            >
                                                {getName(
                                                    item
                                                )}
                                            </option>
                                        );
                                    }
                                )}
                            </>
                        )}
                    </select>

                    <p className="mt-2 text-xs text-slate-500">
                        Only projects assigned to the
                        current Manager are available.
                    </p>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="font-medium">
                                Unable to load timeline
                            </p>

                            <p className="mt-1 text-sm text-red-300/80">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    NO AUTHORIZED PROJECTS
                ================================================== */}

                {!loadingProjects &&
                    projects.length === 0 && (
                        <EmptyState
                            message="You do not currently have any authorized projects."
                            icon={FolderKanban}
                        />
                    )}

                {/* ==================================================
                    TIMELINE
                ================================================== */}

                {selectedProjectId && (
                    <>
                        {/* ==================================================
                            PROJECT SUMMARY
                        ================================================== */}

                        <div className="mb-6 rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FolderKanban className="h-5 w-5 text-blue-400" />

                                        <h2 className="text-xl font-semibold">
                                            {getName(
                                                project,
                                                "Project"
                                            )}
                                        </h2>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-3">
                                        {project?.status && (
                                            <span
                                                className={`rounded-full border px-2.5 py-1 text-xs ${getStatusClass(
                                                    project.status
                                                )}`}
                                            >
                                                {project.status}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {lastUpdated && (
                                    <div className="text-xs text-slate-500">
                                        Last updated:{" "}
                                        {formatDateTime(
                                            lastUpdated
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ==================================================
                            KEY TIMELINE METRICS
                        ================================================== */}

                        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                title="Project Start"
                                value={formatDate(
                                    projectStartDate
                                )}
                                description="Actual project start date"
                                icon={Calendar}
                                loading={
                                    loadingTimeline
                                }
                            />

                            <MetricCard
                                title="Project Deadline"
                                value={formatDate(
                                    projectDeadline
                                )}
                                description="Actual project deadline"
                                icon={Clock}
                                loading={
                                    loadingTimeline
                                }
                            />

                            <MetricCard
                                title="Milestones"
                                value={
                                    milestones.length
                                }
                                description="Recorded project milestones"
                                icon={Milestone}
                                loading={
                                    loadingTimeline
                                }
                            />

                            <MetricCard
                                title="Overdue Items"
                                value={
                                    overdueItems.length
                                }
                                description="Overdue schedule items"
                                icon={AlertTriangle}
                                loading={
                                    loadingTimeline
                                }
                            />
                        </div>

                        {/* ==================================================
                            CURRENT PROGRESS
                        ================================================== */}

                        <div className="mb-6">
                            <SectionCard
                                title="Current Project Progress"
                                description="Current progress from the selected project's actual records."
                                icon={CheckCircle2}
                            >
                                {loadingTimeline ? (
                                    <div className="h-4 animate-pulse rounded bg-slate-800" />
                                ) : (
                                    <ProgressBar
                                        value={
                                            currentProgress
                                        }
                                    />
                                )}
                            </SectionCard>
                        </div>

                        {/* ==================================================
                            PROJECT DATES
                        ================================================== */}

                        <div className="mb-6">
                            <SectionCard
                                title="Project Schedule"
                                description="Project schedule dates retrieved from current project data."
                                icon={Calendar}
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-blue-400" />

                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Project Start Date
                                                </p>

                                                <p className="mt-1 font-semibold text-white">
                                                    {formatDate(
                                                        projectStartDate
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-yellow-400" />

                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Project Deadline
                                                </p>

                                                <p className="mt-1 font-semibold text-white">
                                                    {formatDate(
                                                        projectDeadline
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>

                        {/* ==================================================
                            MILESTONES
                        ================================================== */}

                        <div className="mb-6">
                            <SectionCard
                                title="Project Milestones"
                                description="Milestones retrieved from actual project records."
                                icon={Milestone}
                            >
                                {!Array.isArray(
                                    milestones
                                ) ||
                                milestones.length ===
                                    0 ? (
                                    <EmptyState
                                        message="No milestones are available for this project."
                                        icon={
                                            Milestone
                                        }
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {milestones.map(
                                            (
                                                milestone,
                                                index
                                            ) => (
                                                <div
                                                    key={String(
                                                        getId(
                                                            milestone
                                                        ) ||
                                                            index
                                                    )}
                                                    className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="font-medium text-white">
                                                                {getName(
                                                                    milestone,
                                                                    "Milestone"
                                                                )}
                                                            </p>

                                                            {milestone?.description && (
                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    {
                                                                        milestone.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {milestone?.status && (
                                                                <span
                                                                    className={`rounded-full border px-2.5 py-1 text-xs ${getStatusClass(
                                                                        milestone.status
                                                                    )}`}
                                                                >
                                                                    {
                                                                        milestone.status
                                                                    }
                                                                </span>
                                                            )}

                                                            <span className="text-sm text-slate-300">
                                                                {formatDate(
                                                                    milestone?.date ??
                                                                        milestone?.dueDate ??
                                                                        milestone?.deadline ??
                                                                        milestone?.endDate
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* ==================================================
                            SPRINT PERIODS
                        ================================================== */}

                        <div className="mb-6">
                            <SectionCard
                                title="Sprint Periods"
                                description="Sprint dates retrieved from actual Sprint records."
                                icon={Timer}
                            >
                                {!Array.isArray(
                                    sprints
                                ) ||
                                sprints.length ===
                                    0 ? (
                                    <EmptyState
                                        message="No sprint records are available for this project."
                                        icon={Timer}
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {sprints.map(
                                            (
                                                sprint,
                                                index
                                            ) => (
                                                <div
                                                    key={String(
                                                        getId(
                                                            sprint
                                                        ) ||
                                                            index
                                                    )}
                                                    className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
                                                >
                                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-semibold text-white">
                                                                    {getName(
                                                                        sprint,
                                                                        "Sprint"
                                                                    )}
                                                                </h3>

                                                                {sprint?.status && (
                                                                    <span
                                                                        className={`rounded-full border px-2.5 py-1 text-xs ${getStatusClass(
                                                                            sprint.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            sprint.status
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                                                            <div className="rounded-lg bg-slate-900 px-3 py-2">
                                                                <p className="text-xs text-slate-500">
                                                                    Start
                                                                </p>

                                                                <p className="mt-1 text-slate-200">
                                                                    {formatDate(
                                                                        sprint?.startDate ??
                                                                            sprint?.start
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-lg bg-slate-900 px-3 py-2">
                                                                <p className="text-xs text-slate-500">
                                                                    End
                                                                </p>

                                                                <p className="mt-1 text-slate-200">
                                                                    {formatDate(
                                                                        sprint?.endDate ??
                                                                            sprint?.end
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {sprint?.progress !==
                                                        undefined && (
                                                        <div className="mt-4">
                                                            <ProgressBar
                                                                value={
                                                                    sprint.progress
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* ==================================================
                            OVERDUE SCHEDULE ITEMS
                        ================================================== */}

                        <div className="mb-6">
                            <SectionCard
                                title="Overdue Schedule Items"
                                description="Project schedule items whose actual deadlines have passed."
                                icon={AlertTriangle}
                            >
                                {!Array.isArray(
                                    overdueItems
                                ) ||
                                overdueItems.length ===
                                    0 ? (
                                    <EmptyState
                                        message="No overdue schedule items."
                                        icon={
                                            CheckCircle2
                                        }
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {overdueItems.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    key={String(
                                                        getId(
                                                            item
                                                        ) ||
                                                            index
                                                    )}
                                                    className="rounded-lg border border-red-500/20 bg-red-500/5 p-4"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="font-medium text-white">
                                                                {getName(
                                                                    item,
                                                                    "Overdue schedule item"
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {item?.type ||
                                                                    item?.source ||
                                                                    "Schedule item"}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-red-300">
                                                            <AlertTriangle className="h-4 w-4" />

                                                            {formatDate(
                                                                item?.dueDate ??
                                                                    item?.deadline ??
                                                                    item?.endDate ??
                                                                    item?.date
                                                            )}
                                                        </div>
                                                    </div>

                                                    {item?.status && (
                                                        <span
                                                            className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs ${getStatusClass(
                                                                item.status
                                                            )}`}
                                                        >
                                                            {
                                                                item.status
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* ==================================================
                            LOADING
                        ================================================== */}

                        {loadingTimeline && (
                            <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 shadow-xl">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating project timeline...
                            </div>
                        )}
                    </>
                )}

                {/* ==================================================
                    NO TIMELINE DATA
                ================================================== */}

                {!loadingProjects &&
                    selectedProjectId &&
                    !timeline &&
                    !loadingTimeline &&
                    !error && (
                        <div className="mt-6">
                            <EmptyState
                                message="Timeline information is unavailable for this project."
                                icon={AlertCircle}
                            />
                        </div>
                    )}
            </div>
        </div>
    );
}