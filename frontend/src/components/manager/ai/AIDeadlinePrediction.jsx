import { useMemo, useState } from "react";

import {
    BrainCircuit,
    CalendarClock,
    CheckCircle2,
    AlertTriangle,
    Clock3,
    RefreshCw,
    Target,
    ListChecks,
    Ban,
    Users,
    TrendingUp,
    ShieldAlert,
    Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// AI-006: AI DEADLINE PREDICTION AND DELAY WARNING
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// FRONTEND-ONLY IMPLEMENTATION
//
// Business Rules:
// 1. Prediction uses current project data.
// 2. Actual deadline remains separate from prediction.
// 3. AI predicted dates never overwrite official deadlines.
// 4. Predictions are recalculated when project data changes.
// 5. Only available project data is used.
// 6. No predicted value is hard-coded.
// 7. Warnings require supporting data.
// 8. Warning levels are configurable.
// 9. Prediction is advisory only.
// ============================================================

const WARNING_THRESHOLDS = {
    low: 3,
    medium: 7,
    high: 14,
};

// ============================================================
// FRONTEND PROJECT DATA
// ============================================================

const projects = [
    {
        id: 1,
        name: "AI-Powered Project Management System",

        officialDeadline: "2026-09-15",

        team: "AI Development Team",

        members: 3,

        tasks: {
            total: 30,
            completed: 18,
            remaining: 12,
            blocked: 2,
        },

        sprints: {
            total: 5,
            completed: 3,
            progress: 68,
        },

        history: [
            {
                sprint: "Sprint 01",
                completedTasks: 5,
                plannedTasks: 6,
                durationDays: 14,
            },
            {
                sprint: "Sprint 02",
                completedTasks: 6,
                plannedTasks: 7,
                durationDays: 14,
            },
            {
                sprint: "Sprint 03",
                completedTasks: 7,
                plannedTasks: 8,
                durationDays: 14,
            },
        ],

        workload: [
            {
                member: "Member 1",
                assignedTasks: 12,
                completedTasks: 8,
            },
            {
                member: "Member 2",
                assignedTasks: 10,
                completedTasks: 6,
            },
            {
                member: "Member 3",
                assignedTasks: 8,
                completedTasks: 4,
            },
        ],
    },

    {
        id: 2,
        name: "FieldSync",

        officialDeadline: "2026-10-10",

        team: "FieldSync Development Team",

        members: 3,

        tasks: {
            total: 24,
            completed: 12,
            remaining: 12,
            blocked: 1,
        },

        sprints: {
            total: 4,
            completed: 1,
            progress: 45,
        },

        history: [
            {
                sprint: "Sprint 01",
                completedTasks: 5,
                plannedTasks: 7,
                durationDays: 14,
            },
            {
                sprint: "Sprint 02",
                completedTasks: 4,
                plannedTasks: 7,
                durationDays: 14,
            },
            {
                sprint: "Sprint 03",
                completedTasks: 3,
                plannedTasks: 6,
                durationDays: 14,
            },
        ],

        workload: [
            {
                member: "Member 1",
                assignedTasks: 9,
                completedTasks: 5,
            },
            {
                member: "Member 2",
                assignedTasks: 8,
                completedTasks: 4,
            },
            {
                member: "Member 3",
                assignedTasks: 7,
                completedTasks: 3,
            },
        ],
    },

    {
        id: 3,
        name: "Library Management System",

        officialDeadline: "2026-09-05",

        team: "Library System Team",

        members: 3,

        tasks: {
            total: 25,
            completed: 22,
            remaining: 3,
            blocked: 0,
        },

        sprints: {
            total: 3,
            completed: 3,
            progress: 100,
        },

        history: [
            {
                sprint: "Sprint 01",
                completedTasks: 7,
                plannedTasks: 8,
                durationDays: 14,
            },
            {
                sprint: "Sprint 02",
                completedTasks: 8,
                plannedTasks: 8,
                durationDays: 14,
            },
            {
                sprint: "Sprint 03",
                completedTasks: 7,
                plannedTasks: 7,
                durationDays: 14,
            },
        ],

        workload: [
            {
                member: "Member 1",
                assignedTasks: 10,
                completedTasks: 10,
            },
            {
                member: "Member 2",
                assignedTasks: 8,
                completedTasks: 7,
            },
            {
                member: "Member 3",
                assignedTasks: 7,
                completedTasks: 5,
            },
        ],
    },
];

// ============================================================
// HELPERS
// ============================================================

function formatDate(date) {
    if (!date || Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function addDays(date, days) {
    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
}

function getDaysBetween(firstDate, secondDate) {
    const first = new Date(firstDate);
    const second = new Date(secondDate);

    const difference =
        second.getTime() - first.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}

// ============================================================
// METRIC CALCULATION
// ============================================================

function calculateProjectMetrics(project) {
    if (!project) {
        return null;
    }

    const totalTasks =
        Number(project.tasks?.total || 0);

    const completedTasks =
        Number(project.tasks?.completed || 0);

    const remainingTasks =
        Math.max(
            Number(
                project.tasks?.remaining ||
                    totalTasks - completedTasks
            ),
            0
        );

    const blockedTasks =
        Number(project.tasks?.blocked || 0);

    const completionRate =
        totalTasks > 0
            ? Math.round(
                  (completedTasks / totalTasks) * 100
              )
            : 0;

    const sprintProgress =
        Number(project.sprints?.progress || 0);

    const completedSprints =
        Number(project.sprints?.completed || 0);

    const totalSprints =
        Number(project.sprints?.total || 0);

    const sprintCompletionRate =
        totalSprints > 0
            ? Math.round(
                  (completedSprints / totalSprints) *
                      100
              )
            : 0;

    // --------------------------------------------------------
    // HISTORICAL VELOCITY
    // --------------------------------------------------------

    const history = Array.isArray(project.history)
        ? project.history
        : [];

    const historicalCompletedTasks =
        history.reduce(
            (total, sprint) =>
                total +
                Number(
                    sprint.completedTasks || 0
                ),
            0
        );

    const historicalDays =
        history.reduce(
            (total, sprint) =>
                total +
                Number(sprint.durationDays || 0),
            0
        );

    const averageTasksPerDay =
        historicalDays > 0
            ? historicalCompletedTasks /
              historicalDays
            : 0;

    const averageTasksPerSprint =
        history.length > 0
            ? historicalCompletedTasks /
              history.length
            : 0;

    // --------------------------------------------------------
    // CURRENT WORKLOAD
    // --------------------------------------------------------

    const workload =
        Array.isArray(project.workload)
            ? project.workload
            : [];

    const totalAssignedTasks =
        workload.reduce(
            (total, member) =>
                total +
                Number(
                    member.assignedTasks || 0
                ),
            0
        );

    const workloadPercentages =
        workload.map((member) => {
            const assigned =
                Number(
                    member.assignedTasks || 0
                );

            return totalAssignedTasks > 0
                ? Math.round(
                      (assigned /
                          totalAssignedTasks) *
                          100
                  )
                : 0;
        });

    const highestWorkload =
        workloadPercentages.length > 0
            ? Math.max(
                  ...workloadPercentages
              )
            : 0;

    const lowestWorkload =
        workloadPercentages.length > 0
            ? Math.min(
                  ...workloadPercentages
              )
            : 0;

    const workloadDifference =
        highestWorkload - lowestWorkload;

    // --------------------------------------------------------
    // BLOCKER RATE
    // --------------------------------------------------------

    const blockedRate =
        totalTasks > 0
            ? Math.round(
                  (blockedTasks / totalTasks) *
                      100
              )
            : 0;

    return {
        totalTasks,
        completedTasks,
        remainingTasks,
        blockedTasks,
        completionRate,
        sprintProgress,
        completedSprints,
        totalSprints,
        sprintCompletionRate,
        historicalCompletedTasks,
        historicalDays,
        averageTasksPerDay,
        averageTasksPerSprint,
        totalAssignedTasks,
        highestWorkload,
        lowestWorkload,
        workloadDifference,
        blockedRate,
    };
}

// ============================================================
// PREDICTION ENGINE
// ============================================================

function predictDeadline(project) {
    const metrics =
        calculateProjectMetrics(project);

    if (!metrics) {
        return null;
    }

    // --------------------------------------------------------
    // REQUIRE SUPPORTING DATA
    // --------------------------------------------------------

    if (
        metrics.totalTasks <= 0 ||
        metrics.completedTasks <= 0 ||
        metrics.remainingTasks <= 0 ||
        metrics.historicalDays <= 0 ||
        metrics.historicalCompletedTasks <= 0
    ) {
        return {
            sufficientData: false,
            metrics,
        };
    }

    // --------------------------------------------------------
    // HISTORICAL COMPLETION VELOCITY
    // --------------------------------------------------------

    let velocity =
        metrics.averageTasksPerDay;

    // Blocked tasks reduce effective velocity.
    if (metrics.blockedRate > 0) {
        const blockerAdjustment =
            Math.max(
                0.5,
                1 -
                    metrics.blockedRate /
                        100
            );

        velocity *= blockerAdjustment;
    }

    // High workload imbalance slightly reduces
    // effective prediction velocity.
    if (
        metrics.workloadDifference >= 20
    ) {
        velocity *= 0.9;
    }

    if (velocity <= 0) {
        return {
            sufficientData: false,
            metrics,
        };
    }

    // --------------------------------------------------------
    // ESTIMATE REMAINING WORK DAYS
    // --------------------------------------------------------

    const estimatedRemainingDays =
        Math.ceil(
            metrics.remainingTasks /
                velocity
        );

    const predictionDate = addDays(
        new Date(),
        estimatedRemainingDays
    );

    // --------------------------------------------------------
    // OFFICIAL DEADLINE
    // --------------------------------------------------------

    const officialDeadline =
        new Date(
            `${project.officialDeadline}T23:59:59`
        );

    const predictedDelayDays =
        getDaysBetween(
            officialDeadline,
            predictionDate
        );

    // --------------------------------------------------------
    // DELAY PROBABILITY
    // --------------------------------------------------------

    let delayProbability = 0;

    if (predictedDelayDays > 0) {
        delayProbability = Math.min(
            95,
            50 +
                predictedDelayDays * 3 +
                metrics.blockedRate
        );
    } else {
        const remainingBuffer =
            Math.abs(
                predictedDelayDays
            );

        delayProbability = Math.max(
            5,
            30 -
                remainingBuffer * 2
        );
    }

    // --------------------------------------------------------
    // WARNING LEVEL
    // --------------------------------------------------------

    let warningLevel = "None";

    if (
        predictedDelayDays >=
        WARNING_THRESHOLDS.high
    ) {
        warningLevel = "High";
    } else if (
        predictedDelayDays >=
        WARNING_THRESHOLDS.medium
    ) {
        warningLevel = "Medium";
    } else if (
        predictedDelayDays >=
        WARNING_THRESHOLDS.low
    ) {
        warningLevel = "Low";
    }

    // --------------------------------------------------------
    // CONTRIBUTING FACTORS
    // --------------------------------------------------------

    const factors = [];

    if (metrics.remainingTasks > 0) {
        factors.push({
            id: "remaining",
            title: "Remaining tasks",
            description: `${metrics.remainingTasks} task(s) remain incomplete.`,
            severity:
                metrics.remainingTasks >=
                metrics.totalTasks * 0.4
                    ? "High"
                    : "Medium",
            icon: ListChecks,
        });
    }

    if (metrics.blockedTasks > 0) {
        factors.push({
            id: "blocked",
            title: "Blocked tasks",
            description: `${metrics.blockedTasks} blocked task(s) are currently recorded.`,
            severity: "High",
            icon: Ban,
        });
    }

    if (
        metrics.workloadDifference >= 20
    ) {
        factors.push({
            id: "workload",
            title: "Workload imbalance",
            description: `The difference between the highest and lowest workload shares is ${metrics.workloadDifference} percentage points.`,
            severity: "Medium",
            icon: Users,
        });
    }

    if (
        metrics.completionRate < 60
    ) {
        factors.push({
            id: "completion",
            title: "Task completion rate",
            description: `Current task completion is ${metrics.completionRate}%.`,
            severity: "Medium",
            icon: TrendingUp,
        });
    }

    if (
        metrics.sprintCompletionRate < 50
    ) {
        factors.push({
            id: "sprints",
            title: "Sprint progress",
            description: `${metrics.completedSprints} of ${metrics.totalSprints} recorded sprints are completed.`,
            severity: "Medium",
            icon: Clock3,
        });
    }

    return {
        sufficientData: true,
        metrics,
        officialDeadline,
        predictedDate: predictionDate,
        estimatedRemainingDays,
        predictedDelayDays,
        delayProbability,
        warningLevel,
        factors,
        generatedAt: new Date(),
    };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function AIDeadlinePrediction() {
    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [prediction, setPrediction] =
        useState(null);

    const [analyzedAt, setAnalyzedAt] =
        useState(null);

    const selectedProject = useMemo(() => {
        return projects.find(
            (project) =>
                String(project.id) ===
                String(selectedProjectId)
        );
    }, [selectedProjectId]);

    // ========================================================
    // ANALYZE PROJECT
    // ========================================================

    const analyzeProject = (project) => {
        if (!project) {
            setPrediction(null);
            setAnalyzedAt(null);
            return;
        }

        const result =
            predictDeadline(project);

        setPrediction(result);
        setAnalyzedAt(new Date());
    };

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    const handleProjectChange = (
        event
    ) => {
        const projectId =
            event.target.value;

        setSelectedProjectId(projectId);
        setPrediction(null);
        setAnalyzedAt(null);

        if (!projectId) {
            return;
        }

        const project = projects.find(
            (item) =>
                String(item.id) ===
                String(projectId)
        );

        analyzeProject(project);
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        if (!selectedProject) {
            return;
        }

        analyzeProject(selectedProject);
    };

    // ========================================================
    // WARNING STYLE
    // ========================================================

    const getWarningStyle = (level) => {
        switch (level) {
            case "High":
                return {
                    badge:
                        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                    border:
                        "border-red-200 dark:border-red-900",
                    icon:
                        "text-red-600 dark:text-red-400",
                };

            case "Medium":
                return {
                    badge:
                        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                    border:
                        "border-amber-200 dark:border-amber-900",
                    icon:
                        "text-amber-600 dark:text-amber-400",
                };

            case "Low":
                return {
                    badge:
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
                    border:
                        "border-yellow-200 dark:border-yellow-900",
                    icon:
                        "text-yellow-600 dark:text-yellow-400",
                };

            default:
                return {
                    badge:
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    border:
                        "border-emerald-200 dark:border-emerald-900",
                    icon:
                        "text-emerald-600 dark:text-emerald-400",
                };
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                min-h-full
                bg-slate-50
                p-4
                md:p-6
                dark:bg-slate-950
            "
        >
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >
                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-orange-600
                                text-white
                                shadow-sm
                            "
                        >
                            <CalendarClock className="h-6 w-6" />
                        </div>

                        <div>
                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                AI Deadline Prediction
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Predict the expected project
                                completion date and identify
                                possible deadline delays using
                                available project data.
                            </p>
                        </div>

                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={!selectedProject}
                        onClick={handleRefresh}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Recalculate
                    </Button>
                </div>

                {/* ==================================================
                    PROJECT SELECTOR
                ================================================== */}

                <div
                    className="
                        mb-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                        dark:border-slate-700
                        dark:bg-slate-900
                    "
                >
                    <div className="flex items-center gap-3">

                        <Target
                            className="
                                h-6
                                w-6
                                text-orange-600
                            "
                        />

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Select Project
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Select an authorized project
                                to calculate deadline risk.
                            </p>
                        </div>

                    </div>

                    <select
                        value={selectedProjectId}
                        onChange={handleProjectChange}
                        className="
                            mt-4
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-orange-500
                            focus:ring-2
                            focus:ring-orange-500/20
                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-white
                        "
                    >
                        <option value="">
                            Select a project
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

                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {!selectedProject && (
                    <div
                        className="
                            rounded-2xl
                            border
                            border-dashed
                            border-slate-300
                            bg-white
                            p-12
                            text-center
                            dark:border-slate-700
                            dark:bg-slate-900
                        "
                    >
                        <CalendarClock
                            className="
                                mx-auto
                                mb-4
                                h-12
                                w-12
                                text-slate-400
                            "
                        />

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            AI Deadline Prediction
                        </h2>

                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-lg
                                text-sm
                                leading-6
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Select a project to estimate
                            its expected completion date
                            and determine whether the
                            current deadline may be at risk.
                        </p>
                    </div>
                )}

                {/* ==================================================
                    RESULTS
                ================================================== */}

                {selectedProject &&
                    prediction && (
                        <div className="space-y-6">

                            {/* ==================================================
                                PROJECT INFORMATION
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                    dark:border-slate-700
                                    dark:bg-slate-900
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                    "
                                >
                                    <div>
                                        <h2
                                            className="
                                                text-xl
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {selectedProject.name}
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Team:{" "}
                                            {selectedProject.team}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Team Members:{" "}
                                            {selectedProject.members}
                                        </p>
                                    </div>

                                    {prediction.sufficientData && (
                                        <div className="flex items-center gap-3">

                                            <ShieldAlert
                                                className="
                                                    h-7
                                                    w-7
                                                    text-orange-600
                                                "
                                            />

                                            <div>
                                                <p
                                                    className="
                                                        text-xs
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    Deadline Risk
                                                </p>

                                                <span
                                                    className={`
                                                        mt-1
                                                        inline-flex
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-semibold
                                                        ${
                                                            getWarningStyle(
                                                                prediction.warningLevel
                                                            ).badge
                                                        }
                                                    `}
                                                >
                                                    {prediction.warningLevel ===
                                                    "None"
                                                        ? "On Track"
                                                        : `${prediction.warningLevel} Risk`}
                                                </span>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ==================================================
                                INSUFFICIENT DATA
                            ================================================== */}

                            {!prediction.sufficientData && (
                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-amber-200
                                        bg-amber-50
                                        p-6
                                        dark:border-amber-900
                                        dark:bg-amber-950/30
                                    "
                                >
                                    <div className="flex gap-4">

                                        <Info
                                            className="
                                                h-6
                                                w-6
                                                shrink-0
                                                text-amber-600
                                            "
                                        />

                                        <div>
                                            <h2
                                                className="
                                                    font-bold
                                                    text-amber-800
                                                    dark:text-amber-300
                                                "
                                            >
                                                Insufficient Data
                                            </h2>

                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    leading-6
                                                    text-amber-700
                                                    dark:text-amber-400
                                                "
                                            >
                                                A deadline prediction
                                                was not generated
                                                because the available
                                                project data does not
                                                contain enough
                                                historical completion
                                                information to calculate
                                                a reliable completion
                                                velocity.
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {prediction.sufficientData && (
                                <>
                                    {/* ==================================================
                                        PREDICTION CARDS
                                    ================================================== */}

                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            gap-4
                                            sm:grid-cols-2
                                            lg:grid-cols-4
                                        "
                                    >
                                        <MetricCard
                                            title="Official Deadline"
                                            value={formatDate(
                                                prediction.officialDeadline
                                            )}
                                            icon={CalendarClock}
                                            description="Actual project deadline"
                                        />

                                        <MetricCard
                                            title="Predicted Completion"
                                            value={formatDate(
                                                prediction.predictedDate
                                            )}
                                            icon={BrainCircuit}
                                            description="AI-calculated prediction"
                                        />

                                        <MetricCard
                                            title="Remaining Work"
                                            value={
                                                prediction.metrics
                                                    .remainingTasks
                                            }
                                            icon={ListChecks}
                                            description="Tasks still incomplete"
                                        />

                                        <MetricCard
                                            title="Delay Probability"
                                            value={`${prediction.delayProbability}%`}
                                            icon={AlertTriangle}
                                            description="Calculated prediction"
                                        />
                                    </div>

                                    {/* ==================================================
                                        ACTUAL VS PREDICTED
                                    ================================================== */}

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-6
                                            shadow-sm
                                            dark:border-slate-700
                                            dark:bg-slate-900
                                        "
                                    >
                                        <div className="mb-6 flex items-center gap-3">

                                            <CalendarClock
                                                className="
                                                    h-6
                                                    w-6
                                                    text-orange-600
                                                "
                                            />

                                            <div>
                                                <h2
                                                    className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-900
                                                        dark:text-white
                                                    "
                                                >
                                                    Actual vs Predicted Deadline
                                                </h2>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    The official deadline
                                                    is never changed by
                                                    this prediction.
                                                </p>
                                            </div>

                                        </div>

                                        <div
                                            className="
                                                grid
                                                grid-cols-1
                                                gap-4
                                                md:grid-cols-2
                                            "
                                        >
                                            <DateComparisonCard
                                                title="Official Project Deadline"
                                                date={formatDate(
                                                    prediction.officialDeadline
                                                )}
                                                description="Actual deadline stored for the project"
                                                actual
                                            />

                                            <DateComparisonCard
                                                title="AI Predicted Completion"
                                                date={formatDate(
                                                    prediction.predictedDate
                                                )}
                                                description="Predicted date calculated from current and historical data"
                                                predicted
                                            />
                                        </div>

                                        {/* ==================================================
                                            DELAY RESULT
                                        ================================================== */}

                                        <div
                                            className={`
                                                mt-5
                                                rounded-xl
                                                border
                                                p-5
                                                ${
                                                    getWarningStyle(
                                                        prediction.warningLevel
                                                    ).border
                                                }
                                            `}
                                        >
                                            {prediction.predictedDelayDays >
                                            0 ? (
                                                <div className="flex gap-4">

                                                    <AlertTriangle
                                                        className={`
                                                            h-6
                                                            w-6
                                                            shrink-0
                                                            ${
                                                                getWarningStyle(
                                                                    prediction.warningLevel
                                                                ).icon
                                                            }
                                                        `}
                                                    />

                                                    <div>
                                                        <h3
                                                            className="
                                                                font-bold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            Potential Delay
                                                            Detected
                                                        </h3>

                                                        <p
                                                            className="
                                                                mt-2
                                                                text-sm
                                                                leading-6
                                                                text-slate-600
                                                                dark:text-slate-300
                                                            "
                                                        >
                                                            The calculated
                                                            predicted
                                                            completion is{" "}
                                                            <strong>
                                                                {
                                                                    prediction.predictedDelayDays
                                                                }{" "}
                                                                day(s)
                                                            </strong>{" "}
                                                            after the
                                                            official
                                                            project
                                                            deadline.
                                                        </p>
                                                    </div>

                                                </div>
                                            ) : (
                                                <div className="flex gap-4">

                                                    <CheckCircle2
                                                        className="
                                                            h-6
                                                            w-6
                                                            shrink-0
                                                            text-emerald-600
                                                        "
                                                    />

                                                    <div>
                                                        <h3
                                                            className="
                                                                font-bold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            Project
                                                            Currently On Track
                                                        </h3>

                                                        <p
                                                            className="
                                                                mt-2
                                                                text-sm
                                                                leading-6
                                                                text-slate-600
                                                                dark:text-slate-300
                                                            "
                                                        >
                                                            Based on the
                                                            available
                                                            historical
                                                            completion
                                                            velocity, the
                                                            predicted
                                                            completion is
                                                            currently on or
                                                            before the
                                                            official
                                                            deadline.
                                                        </p>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        SUPPORTING METRICS
                                    ================================================== */}

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-6
                                            shadow-sm
                                            dark:border-slate-700
                                            dark:bg-slate-900
                                        "
                                    >
                                        <div className="mb-6 flex items-center gap-3">

                                            <TrendingUp
                                                className="
                                                    h-6
                                                    w-6
                                                    text-orange-600
                                                "
                                            />

                                            <div>
                                                <h2
                                                    className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-900
                                                        dark:text-white
                                                    "
                                                >
                                                    Supporting Project Metrics
                                                </h2>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    These values support
                                                    the deadline
                                                    prediction.
                                                </p>
                                            </div>

                                        </div>

                                        <div
                                            className="
                                                grid
                                                grid-cols-1
                                                gap-4
                                                sm:grid-cols-2
                                                lg:grid-cols-4
                                            "
                                        >
                                            <MetricCard
                                                title="Task Completion"
                                                value={`${prediction.metrics.completionRate}%`}
                                                icon={CheckCircle2}
                                                description={`${prediction.metrics.completedTasks} of ${prediction.metrics.totalTasks} tasks completed`}
                                            />

                                            <MetricCard
                                                title="Blocked Tasks"
                                                value={
                                                    prediction.metrics
                                                        .blockedTasks
                                                }
                                                icon={Ban}
                                                description={`${prediction.metrics.blockedRate}% of total tasks`}
                                            />

                                            <MetricCard
                                                title="Sprint Progress"
                                                value={`${prediction.metrics.sprintProgress}%`}
                                                icon={Clock3}
                                                description={`${prediction.metrics.completedSprints} of ${prediction.metrics.totalSprints} sprints completed`}
                                            />

                                            <MetricCard
                                                title="Historical Velocity"
                                                value={`${prediction.metrics.averageTasksPerDay.toFixed(
                                                    2
                                                )}/day`}
                                                icon={TrendingUp}
                                                description="Average completed tasks per historical day"
                                            />
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        CONTRIBUTING FACTORS
                                    ================================================== */}

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-6
                                            shadow-sm
                                            dark:border-slate-700
                                            dark:bg-slate-900
                                        "
                                    >
                                        <div className="mb-6 flex items-center gap-3">

                                            <ShieldAlert
                                                className="
                                                    h-6
                                                    w-6
                                                    text-orange-600
                                                "
                                            />

                                            <div>
                                                <h2
                                                    className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-900
                                                        dark:text-white
                                                    "
                                                >
                                                    Contributing Factors
                                                </h2>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    Factors identified
                                                    from the available
                                                    project data.
                                                </p>
                                            </div>

                                        </div>

                                        {prediction.factors.length ===
                                        0 ? (
                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-emerald-200
                                                    bg-emerald-50
                                                    p-5
                                                    dark:border-emerald-900
                                                    dark:bg-emerald-950/30
                                                "
                                            >
                                                <div className="flex gap-3">

                                                    <CheckCircle2
                                                        className="
                                                            h-5
                                                            w-5
                                                            shrink-0
                                                            text-emerald-600
                                                        "
                                                    />

                                                    <p
                                                        className="
                                                            text-sm
                                                            leading-6
                                                            text-emerald-700
                                                            dark:text-emerald-400
                                                        "
                                                    >
                                                        No significant
                                                        contributing
                                                        factors were
                                                        identified from
                                                        the currently
                                                        available project
                                                        data.
                                                    </p>

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">

                                                {prediction.factors.map(
                                                    (factor) => {
                                                        const Icon =
                                                            factor.icon;

                                                        return (
                                                            <div
                                                                key={
                                                                    factor.id
                                                                }
                                                                className="
                                                                    rounded-xl
                                                                    border
                                                                    border-slate-200
                                                                    p-5
                                                                    dark:border-slate-700
                                                                "
                                                            >
                                                                <div className="flex gap-4">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-10
                                                                            w-10
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-xl
                                                                            bg-orange-100
                                                                            dark:bg-orange-950
                                                                        "
                                                                    >
                                                                        <Icon
                                                                            className="
                                                                                h-5
                                                                                w-5
                                                                                text-orange-600
                                                                                dark:text-orange-400
                                                                            "
                                                                        />
                                                                    </div>

                                                                    <div className="flex-1">

                                                                        <div
                                                                            className="
                                                                                flex
                                                                                flex-col
                                                                                gap-2
                                                                                sm:flex-row
                                                                                sm:items-center
                                                                                sm:justify-between
                                                                            "
                                                                        >
                                                                            <h3
                                                                                className="
                                                                                    font-bold
                                                                                    text-slate-900
                                                                                    dark:text-white
                                                                                "
                                                                            >
                                                                                {
                                                                                    factor.title
                                                                                }
                                                                            </h3>

                                                                            <span
                                                                                className={`
                                                                                    inline-flex
                                                                                    w-fit
                                                                                    rounded-full
                                                                                    px-3
                                                                                    py-1
                                                                                    text-xs
                                                                                    font-semibold
                                                                                    ${
                                                                                        factor.severity ===
                                                                                        "High"
                                                                                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                                                                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                                                                    }
                                                                                `}
                                                                            >
                                                                                {
                                                                                    factor.severity
                                                                                }
                                                                            </span>
                                                                        </div>

                                                                        <p
                                                                            className="
                                                                                mt-2
                                                                                text-sm
                                                                                leading-6
                                                                                text-slate-600
                                                                                dark:text-slate-300
                                                                            "
                                                                        >
                                                                            {
                                                                                factor.description
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}

                                            </div>
                                        )}
                                    </div>

                                    {/* ==================================================
                                        WORKLOAD
                                    ================================================== */}

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-6
                                            shadow-sm
                                            dark:border-slate-700
                                            dark:bg-slate-900
                                        "
                                    >
                                        <div className="mb-5 flex items-center gap-3">

                                            <Users
                                                className="
                                                    h-6
                                                    w-6
                                                    text-orange-600
                                                "
                                            />

                                            <div>
                                                <h2
                                                    className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-900
                                                        dark:text-white
                                                    "
                                                >
                                                    Team Workload
                                                </h2>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    Workload is included
                                                    as a supporting
                                                    factor in the
                                                    prediction.
                                                </p>
                                            </div>

                                        </div>

                                        <div className="space-y-5">

                                            {selectedProject.workload.map(
                                                (member) => {
                                                    const percentage =
                                                        prediction
                                                            .metrics
                                                            .totalAssignedTasks >
                                                        0
                                                            ? Math.round(
                                                                  (member.assignedTasks /
                                                                      prediction
                                                                          .metrics
                                                                          .totalAssignedTasks) *
                                                                      100
                                                              )
                                                            : 0;

                                                    return (
                                                        <div
                                                            key={
                                                                member.member
                                                            }
                                                        >
                                                            <div
                                                                className="
                                                                    mb-2
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                "
                                                            >
                                                                <span
                                                                    className="
                                                                        text-sm
                                                                        font-medium
                                                                        text-slate-700
                                                                        dark:text-slate-300
                                                                    "
                                                                >
                                                                    {
                                                                        member.member
                                                                    }
                                                                </span>

                                                                <span
                                                                    className="
                                                                        text-sm
                                                                        font-semibold
                                                                        text-slate-900
                                                                        dark:text-white
                                                                    "
                                                                >
                                                                    {
                                                                        member.assignedTasks
                                                                    }{" "}
                                                                    tasks
                                                                </span>
                                                            </div>

                                                            <div
                                                                className="
                                                                    h-2
                                                                    overflow-hidden
                                                                    rounded-full
                                                                    bg-slate-200
                                                                    dark:bg-slate-700
                                                                "
                                                            >
                                                                <div
                                                                    className="
                                                                        h-full
                                                                        rounded-full
                                                                        bg-orange-600
                                                                    "
                                                                    style={{
                                                                        width: `${percentage}%`,
                                                                    }}
                                                                />
                                                            </div>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-slate-400
                                                                    dark:text-slate-500
                                                                "
                                                            >
                                                                {
                                                                    percentage
                                                                }
                                                                % of
                                                                assigned
                                                                team tasks
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>
                                    </div>

                                    {/* ==================================================
                                        ADVISORY NOTICE
                                    ================================================== */}

                                    <div
                                        className="
                                            flex
                                            gap-3
                                            rounded-xl
                                            border
                                            border-blue-200
                                            bg-blue-50
                                            p-4
                                            dark:border-blue-900
                                            dark:bg-blue-950/30
                                        "
                                    >
                                        <BrainCircuit
                                            className="
                                                mt-0.5
                                                h-5
                                                w-5
                                                shrink-0
                                                text-blue-600
                                                dark:text-blue-400
                                            "
                                        />

                                        <div>
                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-blue-800
                                                    dark:text-blue-300
                                                "
                                            >
                                                AI Deadline Prediction Notice
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-blue-700
                                                    dark:text-blue-400
                                                "
                                            >
                                                The predicted completion
                                                date is an advisory
                                                value calculated from
                                                available project and
                                                historical work data.
                                                It does not change the
                                                official project
                                                deadline and does not
                                                automatically modify
                                                tasks, schedules, or
                                                project status.
                                            </p>
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        CALCULATION INFORMATION
                                    ================================================== */}

                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            p-4
                                            dark:border-slate-700
                                            dark:bg-slate-800
                                        "
                                    >
                                        <div className="flex gap-3">

                                            <Info
                                                className="
                                                    mt-0.5
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    text-slate-500
                                                "
                                            />

                                            <div>

                                                <p
                                                    className="
                                                        text-xs
                                                        leading-5
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    Prediction is based
                                                    on recorded task
                                                    completion,
                                                    historical
                                                    completion
                                                    velocity, remaining
                                                    tasks, blocked tasks,
                                                    sprint progress, and
                                                    workload distribution.
                                                </p>

                                                {analyzedAt && (
                                                    <p
                                                        className="
                                                            mt-2
                                                            text-xs
                                                            text-slate-400
                                                            dark:text-slate-500
                                                        "
                                                    >
                                                        Prediction
                                                        calculated:{" "}
                                                        {analyzedAt.toLocaleString()}
                                                    </p>
                                                )}

                                            </div>

                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                    )}
            </div>
        </div>
    );
}

// ============================================================
// DATE COMPARISON CARD
// ============================================================

function DateComparisonCard({
    title,
    date,
    description,
    actual,
    predicted,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                p-5
                dark:border-slate-700
            "
        >
            <div className="flex items-center gap-3">

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        ${
                            actual
                                ? "bg-slate-100 dark:bg-slate-800"
                                : "bg-orange-100 dark:bg-orange-950"
                        }
                    `}
                >
                    <CalendarClock
                        className={`
                            h-5
                            w-5
                            ${
                                actual
                                    ? "text-slate-600 dark:text-slate-300"
                                    : "text-orange-600 dark:text-orange-400"
                            }
                        `}
                    />
                </div>

                <div>
                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {date}
                    </p>
                </div>

            </div>

            <div className="mt-4">

                <span
                    className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${
                            actual
                                ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                        }
                    `}
                >
                    {actual
                        ? "Actual"
                        : predicted
                        ? "AI Prediction"
                        : "Value"}
                </span>

                <p
                    className="
                        mt-2
                        text-xs
                        leading-5
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {description}
                </p>

            </div>
        </div>
    );
}

// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
    title,
    value,
    icon: Icon,
    description,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-slate-700
                dark:bg-slate-900
            "
        >
            <div
                className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-100
                    dark:bg-orange-950
                "
            >
                <Icon
                    className="
                        h-5
                        w-5
                        text-orange-600
                        dark:text-orange-400
                    "
                />
            </div>

            <p
                className="
                    mt-4
                    text-sm
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {title}
            </p>

            <p
                className="
                    mt-1
                    text-2xl
                    font-bold
                    text-slate-900
                    dark:text-white
                "
            >
                {value}
            </p>

            <p
                className="
                    mt-1
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                "
            >
                {description}
            </p>
        </div>
    );
}

export default AIDeadlinePrediction;