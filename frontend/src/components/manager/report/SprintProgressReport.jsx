import { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Loader2,
    RefreshCw,
    Target,
    Ban,
    ListTodo,
    CalendarDays,
    PlayCircle,
    Circle,
} from "lucide-react";

import {
    getProjectSprints,
    getSprintProgress,
} from "@/services/projectReportService";

import { Button } from "@/components/ui/button";


// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};


const getSprintId = (sprint) => {
    if (!sprint) {
        return "";
    }

    return (
        sprint.id ??
        sprint._id ??
        sprint.sprintId ??
        sprint.sprintID ??
        ""
    );
};


const getSprintName = (sprint) => {
    if (!sprint) {
        return "Sprint";
    }

    return (
        sprint.name ??
        sprint.sprintName ??
        sprint.title ??
        "Unnamed Sprint"
    );
};


const getSprintGoal = (sprint) => {
    if (!sprint) {
        return "No sprint goal available.";
    }

    return (
        sprint.goal ??
        sprint.sprintGoal ??
        sprint.description ??
        "No sprint goal available."
    );
};


const getSprintStatus = (sprint) => {
    if (!sprint) {
        return "—";
    }

    return (
        sprint.status?.name ??
        sprint.statusName ??
        sprint.status ??
        "—"
    );
};


const getSprintStartDate = (sprint) => {
    if (!sprint) {
        return null;
    }

    return (
        sprint.startDate ??
        sprint.startAt ??
        sprint.start_date ??
        null
    );
};


const getSprintEndDate = (sprint) => {
    if (!sprint) {
        return null;
    }

    return (
        sprint.endDate ??
        sprint.endAt ??
        sprint.deadline ??
        sprint.end_date ??
        null
    );
};


// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
    title,
    value,
    icon: Icon,
}) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
            </div>
        </div>
    );
};


// ============================================================
// PROGRESS BAR
// ============================================================

const ProgressBar = ({
    percentage,
}) => {
    const safePercentage =
        Math.min(
            Math.max(
                Number(
                    percentage
                ) || 0,
                0
            ),
            100
        );

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Completion
                </span>

                <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {safePercentage}%
                </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{
                        width: `${safePercentage}%`,
                    }}
                />
            </div>
        </div>
    );
};


// ============================================================
// SPRINT PROGRESS REPORT
// ============================================================

export default function SprintProgressReport({
    projectId,
    accessToken = null,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [sprints, setSprints] =
        useState([]);

    const [selectedSprintId, setSelectedSprintId] =
        useState("");

    const [progressData, setProgressData] =
        useState(null);

    const [loadingSprints, setLoadingSprints] =
        useState(false);

    const [loadingProgress, setLoadingProgress] =
        useState(false);

    const [error, setError] =
        useState("");

    // ========================================================
    // LOAD PROJECT SPRINTS
    // ========================================================

    const loadSprints = async () => {
        if (!projectId) {
            setSprints([]);
            setSelectedSprintId("");
            setProgressData(null);
            return;
        }

        setLoadingSprints(true);
        setError("");

        try {
            const result =
                await getProjectSprints(
                    projectId,
                    accessToken
                );

            if (!result?.success) {
                throw new Error(
                    result?.message ??
                    result?.error ??
                    "Unable to load project sprints."
                );
            }

            const loadedSprints =
                Array.isArray(
                    result.data
                )
                    ? result.data
                    : Array.isArray(
                          result.sprints
                      )
                    ? result.sprints
                    : [];

            setSprints(
                loadedSprints
            );

            // ------------------------------------------------
            // Automatically select the first REAL sprint
            // returned by the backend.
            // ------------------------------------------------

            if (
                loadedSprints.length >
                0
            ) {
                const firstSprintId =
                    getSprintId(
                        loadedSprints[0]
                    );

                setSelectedSprintId(
                    (current) =>
                        current ||
                        firstSprintId
                );
            } else {
                setSelectedSprintId(
                    ""
                );

                setProgressData(
                    null
                );
            }
        } catch (err) {
            console.error(
                "Failed to load project sprints:",
                err
            );

            setSprints([]);
            setSelectedSprintId("");
            setProgressData(null);

            setError(
                err?.message ??
                "Unable to load project sprints."
            );
        } finally {
            setLoadingSprints(false);
        }
    };

    // ========================================================
    // LOAD SPRINT PROGRESS
    // ========================================================

    const loadSprintProgress = async () => {
        if (
            !projectId ||
            !selectedSprintId
        ) {
            setProgressData(null);
            return;
        }

        setLoadingProgress(true);
        setError("");

        try {
            const result =
                await getSprintProgress(
                    projectId,
                    selectedSprintId,
                    accessToken
                );

            if (!result?.success) {
                throw new Error(
                    result?.message ??
                    result?.error ??
                    "Unable to load sprint progress."
                );
            }

            setProgressData(
                result.data ?? null
            );
        } catch (err) {
            console.error(
                "Failed to load sprint progress:",
                err
            );

            setProgressData(null);

            setError(
                err?.message ??
                "Unable to load sprint progress."
            );
        } finally {
            setLoadingProgress(false);
        }
    };

    // ========================================================
    // LOAD SPRINTS WHEN PROJECT CHANGES
    // ========================================================

    useEffect(() => {
        setProgressData(null);
        setSelectedSprintId("");

        loadSprints();
    }, [
        projectId,
        accessToken,
    ]);

    // ========================================================
    // LOAD SELECTED SPRINT
    // ========================================================

    useEffect(() => {
        loadSprintProgress();
    }, [
        projectId,
        selectedSprintId,
        accessToken,
    ]);

    // ========================================================
    // SELECTED SPRINT
    // ========================================================

    const selectedSprint =
        useMemo(() => {
            return sprints.find(
                (sprint) =>
                    String(
                        getSprintId(
                            sprint
                        )
                    ) ===
                    String(
                        selectedSprintId
                    )
            );
        }, [
            sprints,
            selectedSprintId,
        ]);

    // ========================================================
    // SPRINT DATA
    // ========================================================

    const sprint =
        progressData?.sprint ??
        selectedSprint ??
        null;

    // ========================================================
    // TASK STATISTICS
    // ========================================================

    const statistics =
        progressData?.taskStatistics ??
        {};

    const totalTasks =
        progressData?.totalTasks ??
        statistics.total ??
        0;

    const completedTasks =
        progressData?.completedTasks ??
        statistics.completed ??
        0;

    const inProgressTasks =
        progressData?.inProgressTasks ??
        statistics.inProgress ??
        0;

    const pendingTasks =
        progressData?.pendingTasks ??
        statistics.pending ??
        0;

    const blockedTasks =
        progressData?.blockedTasks ??
        statistics.blocked ??
        0;

    const overdueTasks =
        progressData?.overdueTasks ??
        statistics.overdue ??
        0;

    // ========================================================
    // COMPLETION
    // ========================================================

    const completionPercentage =
        progressData?.completionPercentage ??
        (
            totalTasks > 0
                ? Math.round(
                      (
                          completedTasks /
                          totalTasks
                      ) *
                          100
                  )
                : 0
        );

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        await loadSprints();

        if (selectedSprintId) {
            await loadSprintProgress();
        }
    };

    // ========================================================
    // NO PROJECT
    // ========================================================

    if (!projectId) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                <Target className="mx-auto h-10 w-10 text-slate-400" />

                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Select a project
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Select a project to view its sprint progress.
                </p>
            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Sprint Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Review the latest progress of sprints in this project.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={
                        loadingSprints ||
                        loadingProgress
                    }
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                            loadingSprints ||
                            loadingProgress
                                ? "animate-spin"
                                : ""
                        }`}
                    />

                    Refresh
                </Button>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-medium">
                            Unable to load sprint progress
                        </p>

                        <p className="mt-1 text-sm">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                SPRINT SELECTOR
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-3">
                    <label
                        htmlFor="sprint-select"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                        Select Sprint
                    </label>

                    {loadingSprints ? (
                        <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            <Loader2 className="h-4 w-4 animate-spin" />

                            Loading sprints...
                        </div>
                    ) : (
                        <select
                            id="sprint-select"
                            value={
                                selectedSprintId
                            }
                            onChange={(event) =>
                                setSelectedSprintId(
                                    event.target.value
                                )
                            }
                            disabled={
                                sprints.length ===
                                0
                            }
                            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        >
                            <option value="">
                                {sprints.length ===
                                0
                                    ? "No sprints available"
                                    : "Select a sprint"}
                            </option>

                            {sprints.map(
                                (
                                    item
                                ) => {
                                    const id =
                                        getSprintId(
                                            item
                                        );

                                    return (
                                        <option
                                            key={
                                                id
                                            }
                                            value={
                                                id
                                            }
                                        >
                                            {getSprintName(
                                                item
                                            )}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                    )}
                </div>
            </div>

            {/* ==================================================
                NO SPRINTS
            ================================================== */}

            {!loadingSprints &&
                sprints.length ===
                    0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                        <Circle className="mx-auto h-10 w-10 text-slate-400" />

                        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                            No sprints found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            There are currently no sprints available for this project.
                        </p>
                    </div>
                )}

            {/* ==================================================
                LOADING PROGRESS
            ================================================== */}

            {loadingProgress && (
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin" />

                        Loading sprint progress...
                    </div>
                </div>
            )}

            {/* ==================================================
                SPRINT INFORMATION
            ================================================== */}

            {!loadingProgress &&
                sprint && (
                    <>
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                <div>
                                    <div className="flex flex-wrap items-center gap-3">

                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {getSprintName(
                                                sprint
                                            )}
                                        </h3>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {getSprintStatus(
                                                sprint
                                            )}
                                        </span>

                                    </div>

                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {getSprintGoal(
                                            sprint
                                        )}
                                    </p>
                                </div>

                                <div className="min-w-[180px]">
                                    <div className="text-right">

                                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                            {
                                                completionPercentage
                                            }
                                            %
                                        </p>

                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Completion
                                        </p>

                                    </div>
                                </div>

                            </div>

                            {/* DATE INFORMATION */}

                            <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2 dark:border-slate-700">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                        <CalendarDays className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Start Date
                                        </p>

                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {formatDate(
                                                getSprintStartDate(
                                                    sprint
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                        <CalendarDays className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            End Date
                                        </p>

                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {formatDate(
                                                getSprintEndDate(
                                                    sprint
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* PROGRESS */}

                            <div className="mt-6">
                                <ProgressBar
                                    percentage={
                                        completionPercentage
                                    }
                                />
                            </div>

                        </div>

                        {/* ==================================================
                            TASK STATISTICS
                        ================================================== */}

                        <div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Task Progress
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Statistics based on the latest task information.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                                <StatCard
                                    title="Total Tasks"
                                    value={
                                        totalTasks
                                    }
                                    icon={
                                        ListTodo
                                    }
                                />

                                <StatCard
                                    title="Completed"
                                    value={
                                        completedTasks
                                    }
                                    icon={
                                        CheckCircle2
                                    }
                                />

                                <StatCard
                                    title="In Progress"
                                    value={
                                        inProgressTasks
                                    }
                                    icon={
                                        PlayCircle
                                    }
                                />

                                <StatCard
                                    title="Pending"
                                    value={
                                        pendingTasks
                                    }
                                    icon={
                                        Clock3
                                    }
                                />

                                <StatCard
                                    title="Blocked"
                                    value={
                                        blockedTasks
                                    }
                                    icon={
                                        Ban
                                    }
                                />

                            </div>
                        </div>

                        {/* ==================================================
                            OVERDUE
                        ================================================== */}

                        <div className="grid gap-4 lg:grid-cols-2">

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                        <AlertCircle className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Overdue Tasks
                                        </p>

                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {
                                                overdueTasks
                                            }
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                        <Target className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Completion
                                        </p>

                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {
                                                completionPercentage
                                            }
                                            %
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </>
                )}

        </div>
    );
}