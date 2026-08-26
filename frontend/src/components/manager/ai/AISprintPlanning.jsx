import { useMemo, useState } from "react";

import {
    BrainCircuit,
    CheckCircle2,
    Clock3,
    Users,
    ListChecks,
    AlertTriangle,
    RefreshCw,
    Target,
    CalendarDays,
    GitBranch,
    Gauge,
    Sparkles,
    ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// AI-007: GENERATE SPRINT PLANNING SUGGESTIONS
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
// 1. Suggestions are based on available project/team data.
// 2. AI does not automatically create or start a Sprint.
// 3. Manager makes the final Sprint planning decision.
// 4. Team capacity comes from current team information.
// 5. Suggestions respect the project timeline.
// 6. Suggested work comes from valid project/backlog records.
// 7. Suggestions are dynamically generated and are not hard-coded.
//
// ============================================================

function AISprintPlanning() {
    // ========================================================
    // CURRENT DATE
    // ========================================================

    const today = new Date();

    // ========================================================
    // FRONTEND PROJECT DATA
    // ========================================================
    //
    // Replace this data with backend/API data later.
    //
    // The suggestion engine below does not directly hard-code
    // which tasks should be selected. It calculates candidates
    // from the available backlog records.
    //
    // ========================================================

    const projects = [
        {
            id: 1,
            name: "AI-Powered Project Management System",

            priority: "High",

            deadline: "2026-09-30",

            sprintLengthDays: 14,

            team: {
                id: 1,
                name: "AI Development Team",

                members: [
                    {
                        id: 1,
                        name: "Member 1",
                        weeklyCapacity: 20,
                        availableCapacity: 18,
                    },
                    {
                        id: 2,
                        name: "Member 2",
                        weeklyCapacity: 20,
                        availableCapacity: 16,
                    },
                    {
                        id: 3,
                        name: "Member 3",
                        weeklyCapacity: 20,
                        availableCapacity: 20,
                    },
                ],
            },

            previousSprints: [
                {
                    id: 1,
                    name: "Sprint 01",
                    plannedPoints: 32,
                    completedPoints: 28,
                },
                {
                    id: 2,
                    name: "Sprint 02",
                    plannedPoints: 35,
                    completedPoints: 30,
                },
                {
                    id: 3,
                    name: "Sprint 03",
                    plannedPoints: 34,
                    completedPoints: 29,
                },
            ],

            backlog: [
                {
                    id: 101,
                    title: "Implement AI risk analysis",
                    status: "Backlog",
                    priority: "High",
                    storyPoints: 8,
                    dueDate: "2026-09-05",
                    dependencyIds: [],
                },
                {
                    id: 102,
                    title: "Implement project progress prediction",
                    status: "In Progress",
                    priority: "High",
                    storyPoints: 8,
                    dueDate: "2026-09-08",
                    dependencyIds: [],
                },
                {
                    id: 103,
                    title: "Implement team performance analysis",
                    status: "Backlog",
                    priority: "High",
                    storyPoints: 5,
                    dueDate: "2026-09-10",
                    dependencyIds: [101],
                },
                {
                    id: 104,
                    title: "Improve project dashboard",
                    status: "Backlog",
                    priority: "Medium",
                    storyPoints: 5,
                    dueDate: "2026-09-15",
                    dependencyIds: [],
                },
                {
                    id: 105,
                    title: "Add sprint analytics",
                    status: "Backlog",
                    priority: "Medium",
                    storyPoints: 5,
                    dueDate: "2026-09-18",
                    dependencyIds: [104],
                },
                {
                    id: 106,
                    title: "Improve notification handling",
                    status: "Backlog",
                    priority: "Low",
                    storyPoints: 3,
                    dueDate: "2026-09-25",
                    dependencyIds: [],
                },
                {
                    id: 107,
                    title: "Update project documentation",
                    status: "Completed",
                    priority: "Low",
                    storyPoints: 3,
                    dueDate: "2026-08-20",
                    dependencyIds: [],
                },
            ],
        },

        {
            id: 2,
            name: "FieldSync",

            priority: "High",

            deadline: "2026-10-15",

            sprintLengthDays: 14,

            team: {
                id: 2,
                name: "FieldSync Development Team",

                members: [
                    {
                        id: 4,
                        name: "Member 1",
                        weeklyCapacity: 20,
                        availableCapacity: 17,
                    },
                    {
                        id: 5,
                        name: "Member 2",
                        weeklyCapacity: 20,
                        availableCapacity: 15,
                    },
                    {
                        id: 6,
                        name: "Member 3",
                        weeklyCapacity: 20,
                        availableCapacity: 18,
                    },
                ],
            },

            previousSprints: [
                {
                    id: 1,
                    name: "Sprint 01",
                    plannedPoints: 30,
                    completedPoints: 24,
                },
                {
                    id: 2,
                    name: "Sprint 02",
                    plannedPoints: 32,
                    completedPoints: 25,
                },
                {
                    id: 3,
                    name: "Sprint 03",
                    plannedPoints: 28,
                    completedPoints: 23,
                },
            ],

            backlog: [
                {
                    id: 201,
                    title: "Implement offline registration",
                    status: "Backlog",
                    priority: "High",
                    storyPoints: 8,
                    dueDate: "2026-09-10",
                    dependencyIds: [],
                },
                {
                    id: 202,
                    title: "Implement synchronization engine",
                    status: "In Progress",
                    priority: "High",
                    storyPoints: 8,
                    dueDate: "2026-09-15",
                    dependencyIds: [],
                },
                {
                    id: 203,
                    title: "Improve IndexedDB storage",
                    status: "Backlog",
                    priority: "Medium",
                    storyPoints: 5,
                    dueDate: "2026-09-20",
                    dependencyIds: [201],
                },
                {
                    id: 204,
                    title: "Add manager monitoring dashboard",
                    status: "Backlog",
                    priority: "High",
                    storyPoints: 8,
                    dueDate: "2026-09-25",
                    dependencyIds: [202],
                },
                {
                    id: 205,
                    title: "Improve field agent interface",
                    status: "Backlog",
                    priority: "Medium",
                    storyPoints: 5,
                    dueDate: "2026-10-01",
                    dependencyIds: [],
                },
            ],
        },

        {
            id: 3,
            name: "Library Management System",

            priority: "Medium",

            deadline: "2026-11-15",

            sprintLengthDays: 14,

            team: {
                id: 3,
                name: "Library System Team",

                members: [
                    {
                        id: 7,
                        name: "Member 1",
                        weeklyCapacity: 20,
                        availableCapacity: 20,
                    },
                    {
                        id: 8,
                        name: "Member 2",
                        weeklyCapacity: 20,
                        availableCapacity: 18,
                    },
                    {
                        id: 9,
                        name: "Member 3",
                        weeklyCapacity: 20,
                        availableCapacity: 20,
                    },
                ],
            },

            previousSprints: [
                {
                    id: 1,
                    name: "Sprint 01",
                    plannedPoints: 30,
                    completedPoints: 30,
                },
                {
                    id: 2,
                    name: "Sprint 02",
                    plannedPoints: 32,
                    completedPoints: 31,
                },
                {
                    id: 3,
                    name: "Sprint 03",
                    plannedPoints: 30,
                    completedPoints: 29,
                },
            ],

            backlog: [
                {
                    id: 301,
                    title: "Improve book search",
                    status: "Backlog",
                    priority: "High",
                    storyPoints: 5,
                    dueDate: "2026-09-20",
                    dependencyIds: [],
                },
                {
                    id: 302,
                    title: "Implement member management",
                    status: "Backlog",
                    priority: "High",
                    storyPoints: 8,
                    dueDate: "2026-09-25",
                    dependencyIds: [],
                },
                {
                    id: 303,
                    title: "Add borrowing reports",
                    status: "Backlog",
                    priority: "Medium",
                    storyPoints: 5,
                    dueDate: "2026-10-01",
                    dependencyIds: [302],
                },
                {
                    id: 304,
                    title: "Improve notification module",
                    status: "Backlog",
                    priority: "Low",
                    storyPoints: 3,
                    dueDate: "2026-10-10",
                    dependencyIds: [],
                },
            ],
        },
    ];

    // ========================================================
    // STATE
    // ========================================================

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [suggestions, setSuggestions] =
        useState(null);

    const [generatedAt, setGeneratedAt] =
        useState(null);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject = useMemo(() => {
        return projects.find(
            (project) =>
                String(project.id) ===
                String(selectedProjectId)
        );
    }, [selectedProjectId]);

    // ========================================================
    // DATE HELPERS
    // ========================================================

    const parseDate = (value) => {
        if (!value) {
            return null;
        }

        const date = new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    };

    const daysBetween = (start, end) => {
        const startDate =
            start instanceof Date
                ? start
                : parseDate(start);

        const endDate =
            end instanceof Date
                ? end
                : parseDate(end);

        if (!startDate || !endDate) {
            return 0;
        }

        const milliseconds =
            endDate.getTime() -
            startDate.getTime();

        return Math.ceil(
            milliseconds /
                (1000 * 60 * 60 * 24)
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not available";
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

    // ========================================================
    // CALCULATE TEAM CAPACITY
    // ========================================================

    const calculateTeamCapacity = (project) => {
        if (
            !project ||
            !project.team ||
            !Array.isArray(project.team.members)
        ) {
            return null;
        }

        const sprintLengthWeeks =
            Math.max(
                project.sprintLengthDays / 7,
                1
            );

        const totalWeeklyCapacity =
            project.team.members.reduce(
                (total, member) =>
                    total +
                    Number(
                        member.weeklyCapacity || 0
                    ),
                0
            );

        const availableWeeklyCapacity =
            project.team.members.reduce(
                (total, member) =>
                    total +
                    Number(
                        member.availableCapacity || 0
                    ),
                0
            );

        const sprintCapacity = Math.round(
            availableWeeklyCapacity *
                sprintLengthWeeks
        );

        return {
            memberCount:
                project.team.members.length,

            totalWeeklyCapacity,

            availableWeeklyCapacity,

            sprintCapacity,

            utilization:
                totalWeeklyCapacity > 0
                    ? Math.round(
                        (
                            (
                                totalWeeklyCapacity -
                                availableWeeklyCapacity
                            ) /
                            totalWeeklyCapacity
                        ) *
                            100
                    )
                    : 0,
        };
    };

    // ========================================================
    // PREVIOUS SPRINT PERFORMANCE
    // ========================================================

    const calculateSprintPerformance = (
        project
    ) => {
        if (
            !project ||
            !Array.isArray(
                project.previousSprints
            ) ||
            project.previousSprints.length === 0
        ) {
            return {
                averageCompletionRate: 0,
                averageCompletedPoints: 0,
                completedPoints: 0,
                historicalDataAvailable: false,
            };
        }

        const validSprints =
            project.previousSprints.filter(
                (sprint) =>
                    Number(
                        sprint.plannedPoints
                    ) > 0
            );

        if (validSprints.length === 0) {
            return {
                averageCompletionRate: 0,
                averageCompletedPoints: 0,
                completedPoints: 0,
                historicalDataAvailable: false,
            };
        }

        const totalCompletionRate =
            validSprints.reduce(
                (total, sprint) =>
                    total +
                    (
                        Number(
                            sprint.completedPoints || 0
                        ) /
                        Number(
                            sprint.plannedPoints || 1
                        )
                    ) *
                        100,
                0
            );

        const totalCompletedPoints =
            validSprints.reduce(
                (total, sprint) =>
                    total +
                    Number(
                        sprint.completedPoints || 0
                    ),
                0
            );

        return {
            averageCompletionRate: Math.round(
                totalCompletionRate /
                    validSprints.length
            ),

            averageCompletedPoints: Math.round(
                totalCompletedPoints /
                    validSprints.length
            ),

            completedPoints:
                totalCompletedPoints,

            historicalDataAvailable: true,
        };
    };

    // ========================================================
    // BACKLOG METRICS
    // ========================================================

    const calculateBacklogMetrics = (
        project
    ) => {
        if (
            !project ||
            !Array.isArray(project.backlog)
        ) {
            return null;
        }

        const validBacklog =
            project.backlog.filter(
                (task) =>
                    task.status !==
                    "Completed"
            );

        const totalPoints =
            validBacklog.reduce(
                (total, task) =>
                    total +
                    Number(
                        task.storyPoints || 0
                    ),
                0
            );

        const highPriorityCount =
            validBacklog.filter(
                (task) =>
                    task.priority === "High"
            ).length;

        const inProgressCount =
            validBacklog.filter(
                (task) =>
                    task.status ===
                    "In Progress"
            ).length;

        const overdueCount =
            validBacklog.filter(
                (task) => {
                    const dueDate =
                        parseDate(
                            task.dueDate
                        );

                    return (
                        dueDate &&
                        dueDate < today &&
                        task.status !==
                            "Completed"
                    );
                }
            ).length;

        return {
            totalTasks:
                validBacklog.length,

            totalPoints,

            highPriorityCount,

            inProgressCount,

            overdueCount,
        };
    };

    // ========================================================
    // TASK CANDIDATE ANALYSIS
    // ========================================================
    //
    // Candidates are obtained from the project's backlog.
    // No task title is selected from a hard-coded list.
    //
    // ========================================================

    const buildTaskCandidates = (
        project,
        capacity
    ) => {
        if (
            !project ||
            !Array.isArray(project.backlog)
        ) {
            return [];
        }

        const backlog =
            project.backlog.filter(
                (task) =>
                    task.status !==
                    "Completed"
            );

        const taskMap = new Map(
            backlog.map((task) => [
                task.id,
                task,
            ])
        );

        const candidates =
            backlog.map((task) => {
                const dueDate =
                    parseDate(
                        task.dueDate
                    );

                const daysUntilDue =
                    dueDate
                        ? daysBetween(
                            today,
                            dueDate
                        )
                        : null;

                const priorityScore =
                    task.priority === "High"
                        ? 40
                        : task.priority ===
                            "Medium"
                        ? 25
                        : 10;

                const deadlineScore =
                    daysUntilDue !== null &&
                    daysUntilDue <=
                        project.sprintLengthDays
                        ? 30
                        : daysUntilDue !== null &&
                          daysUntilDue <=
                              project.sprintLengthDays *
                                  2
                        ? 20
                        : 5;

                const statusScore =
                    task.status ===
                    "In Progress"
                        ? 20
                        : 10;

                const dependencyTasks =
                    Array.isArray(
                        task.dependencyIds
                    )
                        ? task.dependencyIds
                              .map((id) =>
                                  taskMap.get(id)
                              )
                              .filter(Boolean)
                        : [];

                const unresolvedDependencies =
                    dependencyTasks.filter(
                        (dependency) =>
                            dependency.status !==
                            "Completed"
                    );

                const dependencyPenalty =
                    unresolvedDependencies.length *
                    15;

                const score = Math.max(
                    priorityScore +
                        deadlineScore +
                        statusScore -
                        dependencyPenalty,
                    0
                );

                return {
                    ...task,

                    daysUntilDue,

                    dependencyTasks,

                    unresolvedDependencies,

                    suggestionScore:
                        score,

                    dependencyReady:
                        unresolvedDependencies.length ===
                        0,
                };
            });

        return candidates.sort(
            (a, b) =>
                b.suggestionScore -
                a.suggestionScore
        );
    };

    // ========================================================
    // GENERATE SPRINT SUGGESTIONS
    // ========================================================

    const generateSuggestions = (
        project
    ) => {
        if (!project) {
            setSuggestions(null);
            return;
        }

        const capacity =
            calculateTeamCapacity(
                project
            );

        const sprintPerformance =
            calculateSprintPerformance(
                project
            );

        const backlogMetrics =
            calculateBacklogMetrics(
                project
            );

        if (
            !capacity ||
            !backlogMetrics
        ) {
            setSuggestions(null);
            return;
        }

        const deadline =
            parseDate(
                project.deadline
            );

        const daysToDeadline =
            deadline
                ? daysBetween(
                    today,
                    deadline
                )
                : 0;

        const remainingSprints =
            Math.max(
                Math.ceil(
                    daysToDeadline /
                        project.sprintLengthDays
                ),
                0
            );

        const historicalCapacity =
            sprintPerformance
                .averageCompletedPoints;

        const effectiveCapacity =
            Math.min(
                capacity.sprintCapacity,
                historicalCapacity > 0
                    ? Math.round(
                        historicalCapacity *
                            1.1
                    )
                    : capacity.sprintCapacity
            );

        const candidates =
            buildTaskCandidates(
                project,
                capacity
            );

        const selectedTasks = [];

        let selectedPoints = 0;

        // ----------------------------------------------------
        // Select dependency-ready tasks first.
        // ----------------------------------------------------

        for (
            const task of candidates
        ) {
            const points =
                Number(
                    task.storyPoints || 0
                );

            if (
                points <= 0 ||
                !task.dependencyReady
            ) {
                continue;
            }

            if (
                selectedPoints +
                    points <=
                effectiveCapacity
            ) {
                selectedTasks.push(
                    task
                );

                selectedPoints +=
                    points;
            }
        }

        // ----------------------------------------------------
        // If there is unused capacity, include tasks with
        // dependencies when those dependencies are already
        // part of the suggested set.
        // ----------------------------------------------------

        const selectedIds =
            new Set(
                selectedTasks.map(
                    (task) =>
                        task.id
                )
            );

        for (
            const task of candidates
        ) {
            const points =
                Number(
                    task.storyPoints || 0
                );

            if (
                selectedIds.has(
                    task.id
                ) ||
                points <= 0
            ) {
                continue;
            }

            const dependenciesSatisfied =
                task.unresolvedDependencies.every(
                    (dependency) =>
                        selectedIds.has(
                            dependency.id
                        )
                );

            if (
                dependenciesSatisfied &&
                selectedPoints +
                    points <=
                    effectiveCapacity
            ) {
                selectedTasks.push(
                    task
                );

                selectedIds.add(
                    task.id
                );

                selectedPoints +=
                    points;
            }
        }

        // ----------------------------------------------------
        // Calculate utilization.
        // ----------------------------------------------------

        const capacityUtilization =
            effectiveCapacity > 0
                ? Math.round(
                    (
                        selectedPoints /
                        effectiveCapacity
                    ) *
                        100
                )
                : 0;

        // ----------------------------------------------------
        // Timeline assessment.
        // ----------------------------------------------------

        let timelineStatus =
            "Healthy";

        if (
            remainingSprints <= 1 &&
            backlogMetrics.totalPoints >
                effectiveCapacity
        ) {
            timelineStatus =
                "Tight";
        }

        if (
            daysToDeadline <= 0
        ) {
            timelineStatus =
                "Deadline Reached";
        }

        // ----------------------------------------------------
        // Generate reasons dynamically.
        // ----------------------------------------------------

        const reasons = [];

        if (
            backlogMetrics.inProgressCount >
            0
        ) {
            reasons.push(
                `${backlogMetrics.inProgressCount} backlog item(s) are already in progress.`
            );
        }

        if (
            backlogMetrics.highPriorityCount >
            0
        ) {
            reasons.push(
                `${backlogMetrics.highPriorityCount} high-priority item(s) are available in the backlog.`
            );
        }

        if (
            sprintPerformance
                .historicalDataAvailable
        ) {
            reasons.push(
                `Previous sprint performance averages ${sprintPerformance.averageCompletionRate}% completion.`
            );
        }

        if (
            capacity.sprintCapacity > 0
        ) {
            reasons.push(
                `Current team information provides approximately ${capacity.sprintCapacity} capacity units for this sprint period.`
            );
        }

        if (
            backlogMetrics.overdueCount >
            0
        ) {
            reasons.push(
                `${backlogMetrics.overdueCount} incomplete backlog item(s) have passed their recorded due dates.`
            );
        }

        if (
            remainingSprints > 0
        ) {
            reasons.push(
                `Approximately ${remainingSprints} sprint period(s) remain before the project deadline.`
            );
        }

        // ----------------------------------------------------
        // Planning confidence.
        // ----------------------------------------------------

        let confidence =
            "Medium";

        if (
            sprintPerformance
                .historicalDataAvailable &&
            capacity.sprintCapacity > 0 &&
            selectedTasks.length > 0
        ) {
            confidence =
                "High";
        }

        if (
            selectedTasks.length === 0
        ) {
            confidence =
                "Low";
        }

        // ----------------------------------------------------
        // Planning summary.
        // ----------------------------------------------------

        let summary =
            "The available project, backlog, team capacity, and sprint history support a balanced planning suggestion.";

        if (
            selectedTasks.length === 0
        ) {
            summary =
                "No suitable backlog items could be selected within the calculated team capacity and dependency constraints.";
        } else if (
            timelineStatus === "Tight"
        ) {
            summary =
                "The project timeline is tight. Prioritize the highest-value available work and avoid exceeding the team's calculated capacity.";
        } else if (
            capacityUtilization < 60
        ) {
            summary =
                "The suggested sprint uses only part of the calculated capacity. The Manager may review additional valid backlog items before finalizing the sprint.";
        }

        setSuggestions({
            selectedTasks,
            selectedPoints,
            effectiveCapacity,
            capacityUtilization,
            capacity,
            sprintPerformance,
            backlogMetrics,
            remainingSprints,
            daysToDeadline,
            timelineStatus,
            reasons,
            confidence,
            summary,
        });

        setGeneratedAt(
            new Date()
        );
    };

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    const handleProjectChange = (
        event
    ) => {
        const projectId =
            event.target.value;

        setSelectedProjectId(
            projectId
        );

        setSuggestions(null);
        setGeneratedAt(null);

        if (!projectId) {
            return;
        }

        const project =
            projects.find(
                (item) =>
                    String(item.id) ===
                    String(projectId)
            );

        generateSuggestions(
            project
        );
    };

    // ========================================================
    // REFRESH / REGENERATE
    // ========================================================

    const handleRefresh = () => {
        if (!selectedProject) {
            return;
        }

        generateSuggestions(
            selectedProject
        );
    };

    // ========================================================
    // STATUS STYLES
    // ========================================================

    const getStatusStyles = (
        status
    ) => {
        switch (status) {
            case "Healthy":
                return {
                    badge:
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    text:
                        "text-emerald-600 dark:text-emerald-400",
                };

            case "Tight":
                return {
                    badge:
                        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                    text:
                        "text-amber-600 dark:text-amber-400",
                };

            case "Deadline Reached":
                return {
                    badge:
                        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                    text:
                        "text-red-600 dark:text-red-400",
                };

            default:
                return {
                    badge:
                        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                    text:
                        "text-slate-600 dark:text-slate-400",
                };
        }
    };

    const getPriorityStyles = (
        priority
    ) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";

            case "Medium":
                return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";

            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
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
            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >
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
                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-purple-600
                                text-white
                                shadow-sm
                            "
                        >
                            <BrainCircuit
                                className="
                                    h-6
                                    w-6
                                "
                            />
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
                                Generate Sprint Planning
                                Suggestions
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Use project backlog,
                                team capacity,
                                sprint history,
                                dependencies, and deadlines
                                to generate planning
                                suggestions.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={
                            !selectedProject
                        }
                        onClick={
                            handleRefresh
                        }
                        className="gap-2"
                    >
                        <RefreshCw
                            className="
                                h-4
                                w-4
                            "
                        />

                        Regenerate
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
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <ClipboardList
                            className="
                                h-6
                                w-6
                                text-purple-600
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
                                to generate sprint planning
                                suggestions.
                            </p>
                        </div>
                    </div>

                    <select
                        value={
                            selectedProjectId
                        }
                        onChange={
                            handleProjectChange
                        }
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
                            focus:border-purple-500
                            focus:ring-2
                            focus:ring-purple-500/20
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
                                    key={
                                        project.id
                                    }
                                    value={
                                        project.id
                                    }
                                >
                                    {
                                        project.name
                                    }
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
                        <Sparkles
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
                            Sprint Planning
                            Suggestions
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
                            Select a project to analyze
                            its current backlog, team
                            capacity, previous sprint
                            performance, dependencies,
                            and deadline.
                        </p>
                    </div>
                )}

                {/* ==================================================
                    RESULTS
                ================================================== */}

                {selectedProject &&
                    suggestions && (
                        <div
                            className="
                                space-y-6
                            "
                        >
                            {/* ==================================================
                                PROJECT SUMMARY
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
                                        gap-5
                                        lg:flex-row
                                        lg:items-center
                                        lg:justify-between
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
                                            {
                                                selectedProject.name
                                            }
                                        </h2>

                                        <div
                                            className="
                                                mt-3
                                                flex
                                                flex-wrap
                                                gap-2
                                            "
                                        >
                                            <span
                                                className={`
                                                    inline-flex
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    ${getPriorityStyles(
                                                        selectedProject.priority
                                                    )}
                                                `}
                                            >
                                                Project Priority:{" "}
                                                {
                                                    selectedProject.priority
                                                }
                                            </span>

                                            <span
                                                className="
                                                    inline-flex
                                                    rounded-full
                                                    bg-blue-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-blue-700
                                                    dark:bg-blue-950
                                                    dark:text-blue-300
                                                "
                                            >
                                                Team:{" "}
                                                {
                                                    selectedProject
                                                        .team
                                                        .name
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <Target
                                            className="
                                                h-7
                                                w-7
                                                text-purple-600
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
                                                Planning
                                                Confidence
                                            </p>

                                            <span
                                                className="
                                                    mt-1
                                                    inline-flex
                                                    rounded-full
                                                    bg-purple-100
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    font-semibold
                                                    text-purple-700
                                                    dark:bg-purple-950
                                                    dark:text-purple-300
                                                "
                                            >
                                                {
                                                    suggestions.confidence
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                METRIC CARDS
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
                                    title="Suggested Points"
                                    value={
                                        suggestions.selectedPoints
                                    }
                                    icon={
                                        ListChecks
                                    }
                                    description={`of ${suggestions.effectiveCapacity} calculated capacity`}
                                />

                                <MetricCard
                                    title="Capacity Usage"
                                    value={`${suggestions.capacityUtilization}%`}
                                    icon={
                                        Gauge
                                    }
                                    description="Suggested sprint utilization"
                                />

                                <MetricCard
                                    title="Backlog Items"
                                    value={
                                        suggestions.backlogMetrics
                                            .totalTasks
                                    }
                                    icon={
                                        ClipboardList
                                    }
                                    description={`${suggestions.backlogMetrics.totalPoints} total remaining points`}
                                />

                                <MetricCard
                                    title="Previous Sprint Rate"
                                    value={`${suggestions.sprintPerformance.averageCompletionRate}%`}
                                    icon={
                                        TrendingIcon
                                    }
                                    description="Average historical completion"
                                />
                            </div>

                            {/* ==================================================
                                TIMELINE
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
                                        mb-5
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <CalendarDays
                                            className="
                                                h-6
                                                w-6
                                                text-purple-600
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
                                                Project Timeline
                                            </h2>

                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                Suggestions
                                                respect the
                                                recorded project
                                                deadline.
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`
                                            rounded-full
                                            px-3
                                            py-1
                                            text-xs
                                            font-semibold
                                            ${
                                                getStatusStyles(
                                                    suggestions.timelineStatus
                                                ).badge
                                            }
                                        `}
                                    >
                                        {
                                            suggestions.timelineStatus
                                        }
                                    </span>
                                </div>

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        md:grid-cols-3
                                    "
                                >
                                    <InfoBox
                                        label="Project Deadline"
                                        value={
                                            formatDate(
                                                parseDate(
                                                    selectedProject.deadline
                                                )
                                            )
                                        }
                                        icon={
                                            CalendarDays
                                        }
                                    />

                                    <InfoBox
                                        label="Days Remaining"
                                        value={
                                            Math.max(
                                                suggestions.daysToDeadline,
                                                0
                                            )
                                        }
                                        icon={
                                            Clock3
                                        }
                                    />

                                    <InfoBox
                                        label="Estimated Sprint Periods"
                                        value={
                                            suggestions.remainingSprints
                                        }
                                        icon={
                                            Target
                                        }
                                    />
                                </div>
                            </div>

                            {/* ==================================================
                                TEAM CAPACITY
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
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <Users
                                        className="
                                            h-6
                                            w-6
                                            text-purple-600
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
                                            Current Team Capacity
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Capacity is calculated
                                            from the current team
                                            information.
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
                                    <InfoBox
                                        label="Team Members"
                                        value={
                                            suggestions.capacity
                                                .memberCount
                                        }
                                        icon={
                                            Users
                                        }
                                    />

                                    <InfoBox
                                        label="Weekly Capacity"
                                        value={
                                            suggestions.capacity
                                                .totalWeeklyCapacity
                                        }
                                        icon={
                                            Gauge
                                        }
                                    />

                                    <InfoBox
                                        label="Available Weekly"
                                        value={
                                            suggestions.capacity
                                                .availableWeeklyCapacity
                                        }
                                        icon={
                                            Clock3
                                        }
                                    />

                                    <InfoBox
                                        label="Sprint Capacity"
                                        value={
                                            suggestions.capacity
                                                .sprintCapacity
                                        }
                                        icon={
                                            Target
                                        }
                                    />
                                </div>
                            </div>

                            {/* ==================================================
                                AI SUMMARY
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-purple-200
                                    bg-purple-50
                                    p-6
                                    dark:border-purple-900
                                    dark:bg-purple-950/30
                                "
                            >
                                <div
                                    className="
                                        flex
                                        gap-4
                                    "
                                >
                                    <BrainCircuit
                                        className="
                                            mt-1
                                            h-6
                                            w-6
                                            shrink-0
                                            text-purple-600
                                            dark:text-purple-400
                                        "
                                    />

                                    <div>
                                        <h2
                                            className="
                                                text-lg
                                                font-bold
                                                text-purple-900
                                                dark:text-purple-300
                                            "
                                        >
                                            AI Planning Summary
                                        </h2>

                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                leading-6
                                                text-purple-800
                                                dark:text-purple-300
                                            "
                                        >
                                            {
                                                suggestions.summary
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                SUGGESTED WORK
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
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <Sparkles
                                        className="
                                            h-6
                                            w-6
                                            text-purple-600
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
                                            Suggested Sprint Work
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            These items were selected
                                            from the project's current
                                            backlog according to
                                            priority, capacity,
                                            dependencies, and timeline.
                                        </p>
                                    </div>
                                </div>

                                {suggestions.selectedTasks
                                    .length === 0 ? (
                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-dashed
                                            border-slate-300
                                            p-8
                                            text-center
                                            dark:border-slate-700
                                        "
                                    >
                                        <AlertTriangle
                                            className="
                                                mx-auto
                                                mb-3
                                                h-8
                                                w-8
                                                text-amber-500
                                            "
                                        />

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                dark:text-slate-300
                                            "
                                        >
                                            No suitable backlog
                                            items were selected
                                            within the calculated
                                            planning constraints.
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            space-y-3
                                        "
                                    >
                                        {suggestions.selectedTasks.map(
                                            (
                                                task,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        task.id
                                                    }
                                                    className="
                                                        rounded-xl
                                                        border
                                                        border-slate-200
                                                        p-4
                                                        dark:border-slate-700
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            flex-col
                                                            gap-3
                                                            md:flex-row
                                                            md:items-center
                                                            md:justify-between
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                flex
                                                                gap-3
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-purple-100
                                                                    text-sm
                                                                    font-bold
                                                                    text-purple-700
                                                                    dark:bg-purple-950
                                                                    dark:text-purple-300
                                                                "
                                                            >
                                                                {index +
                                                                    1}
                                                            </div>

                                                            <div>
                                                                <h3
                                                                    className="
                                                                        font-semibold
                                                                        text-slate-900
                                                                        dark:text-white
                                                                    "
                                                                >
                                                                    {
                                                                        task.title
                                                                    }
                                                                </h3>

                                                                <div
                                                                    className="
                                                                        mt-2
                                                                        flex
                                                                        flex-wrap
                                                                        gap-2
                                                                    "
                                                                >
                                                                    <span
                                                                        className={`
                                                                            rounded-full
                                                                            px-2.5
                                                                            py-1
                                                                            text-xs
                                                                            font-semibold
                                                                            ${getPriorityStyles(
                                                                                task.priority
                                                                            )}
                                                                        `}
                                                                    >
                                                                        {
                                                                            task.priority
                                                                        }
                                                                    </span>

                                                                    <span
                                                                        className="
                                                                            rounded-full
                                                                            bg-slate-100
                                                                            px-2.5
                                                                            py-1
                                                                            text-xs
                                                                            font-semibold
                                                                            text-slate-700
                                                                            dark:bg-slate-800
                                                                            dark:text-slate-300
                                                                        "
                                                                    >
                                                                        {
                                                                            task.storyPoints
                                                                        }{" "}
                                                                        points
                                                                    </span>

                                                                    <span
                                                                        className="
                                                                            rounded-full
                                                                            bg-blue-100
                                                                            px-2.5
                                                                            py-1
                                                                            text-xs
                                                                            font-semibold
                                                                            text-blue-700
                                                                            dark:bg-blue-950
                                                                            dark:text-blue-300
                                                                        "
                                                                    >
                                                                        {
                                                                            task.status
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="
                                                                text-left
                                                                md:text-right
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-slate-500
                                                                    dark:text-slate-400
                                                                "
                                                            >
                                                                Due Date
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-900
                                                                    dark:text-white
                                                                "
                                                            >
                                                                {
                                                                    formatDate(
                                                                        parseDate(
                                                                            task.dueDate
                                                                        )
                                                                    )
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {task.unresolvedDependencies
                                                        .length >
                                                        0 && (
                                                        <div
                                                            className="
                                                                mt-3
                                                                flex
                                                                gap-2
                                                                rounded-lg
                                                                bg-amber-50
                                                                p-3
                                                                text-xs
                                                                text-amber-700
                                                                dark:bg-amber-950/30
                                                                dark:text-amber-300
                                                            "
                                                        >
                                                            <GitBranch
                                                                className="
                                                                    h-4
                                                                    w-4
                                                                    shrink-0
                                                                "
                                                            />

                                                            <span>
                                                                This
                                                                task
                                                                has
                                                                unresolved
                                                                dependencies
                                                                that
                                                                should
                                                                be
                                                                reviewed
                                                                before
                                                                final
                                                                sprint
                                                                planning.
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ==================================================
                                PLANNING FACTORS
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
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <GitBranch
                                        className="
                                            h-6
                                            w-6
                                            text-purple-600
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
                                            Planning Factors
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Factors that influenced
                                            the generated suggestion.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        space-y-3
                                    "
                                >
                                    {suggestions.reasons.map(
                                        (
                                            reason,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="
                                                    flex
                                                    gap-3
                                                    rounded-lg
                                                    bg-slate-50
                                                    p-3
                                                    dark:bg-slate-800
                                                "
                                            >
                                                <CheckCircle2
                                                    className="
                                                        mt-0.5
                                                        h-4
                                                        w-4
                                                        shrink-0
                                                        text-emerald-600
                                                    "
                                                />

                                                <p
                                                    className="
                                                        text-sm
                                                        text-slate-600
                                                        dark:text-slate-300
                                                    "
                                                >
                                                    {
                                                        reason
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* ==================================================
                                PREVIOUS SPRINT PERFORMANCE
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
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <Gauge
                                        className="
                                            h-6
                                            w-6
                                            text-purple-600
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
                                            Previous Sprint Performance
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Historical sprint
                                            performance is used
                                            as a planning input.
                                        </p>
                                    </div>
                                </div>

                                {suggestions
                                    .sprintPerformance
                                    .historicalDataAvailable ? (
                                    <div
                                        className="
                                            overflow-x-auto
                                        "
                                    >
                                        <table
                                            className="
                                                w-full
                                                text-left
                                                text-sm
                                            "
                                        >
                                            <thead>
                                                <tr
                                                    className="
                                                        border-b
                                                        border-slate-200
                                                        dark:border-slate-700
                                                    "
                                                >
                                                    <th
                                                        className="
                                                            px-4
                                                            py-3
                                                            font-semibold
                                                            text-slate-700
                                                            dark:text-slate-300
                                                        "
                                                    >
                                                        Sprint
                                                    </th>

                                                    <th
                                                        className="
                                                            px-4
                                                            py-3
                                                            font-semibold
                                                            text-slate-700
                                                            dark:text-slate-300
                                                        "
                                                    >
                                                        Planned
                                                    </th>

                                                    <th
                                                        className="
                                                            px-4
                                                            py-3
                                                            font-semibold
                                                            text-slate-700
                                                            dark:text-slate-300
                                                        "
                                                    >
                                                        Completed
                                                    </th>

                                                    <th
                                                        className="
                                                            px-4
                                                            py-3
                                                            font-semibold
                                                            text-slate-700
                                                            dark:text-slate-300
                                                        "
                                                    >
                                                        Completion
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedProject.previousSprints.map(
                                                    (
                                                        sprint
                                                    ) => {
                                                        const rate =
                                                            sprint.plannedPoints >
                                                            0
                                                                ? Math.round(
                                                                    (
                                                                        sprint.completedPoints /
                                                                        sprint.plannedPoints
                                                                    ) *
                                                                        100
                                                                )
                                                                : 0;

                                                        return (
                                                            <tr
                                                                key={
                                                                    sprint.id
                                                                }
                                                                className="
                                                                    border-b
                                                                    border-slate-100
                                                                    last:border-0
                                                                    dark:border-slate-800
                                                                "
                                                            >
                                                                <td
                                                                    className="
                                                                        px-4
                                                                        py-4
                                                                        font-medium
                                                                        text-slate-900
                                                                        dark:text-white
                                                                    "
                                                                >
                                                                    {
                                                                        sprint.name
                                                                    }
                                                                </td>

                                                                <td
                                                                    className="
                                                                        px-4
                                                                        py-4
                                                                        text-slate-600
                                                                        dark:text-slate-300
                                                                    "
                                                                >
                                                                    {
                                                                        sprint.plannedPoints
                                                                    }
                                                                </td>

                                                                <td
                                                                    className="
                                                                        px-4
                                                                        py-4
                                                                        text-slate-600
                                                                        dark:text-slate-300
                                                                    "
                                                                >
                                                                    {
                                                                        sprint.completedPoints
                                                                    }
                                                                </td>

                                                                <td
                                                                    className="
                                                                        px-4
                                                                        py-4
                                                                        font-semibold
                                                                        text-slate-900
                                                                        dark:text-white
                                                                    "
                                                                >
                                                                    {
                                                                        rate
                                                                    }
                                                                    %
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            rounded-xl
                                            bg-slate-50
                                            p-5
                                            text-sm
                                            text-slate-600
                                            dark:bg-slate-800
                                            dark:text-slate-300
                                        "
                                    >
                                        Historical sprint
                                        performance data is not
                                        available for this project.
                                    </div>
                                )}
                            </div>

                            {/* ==================================================
                                MANAGER DECISION NOTICE
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
                                        Manager Decision Required
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
                                        These are advisory AI
                                        planning suggestions.
                                        The system does not
                                        automatically create,
                                        modify, or start a Sprint.
                                        The Project Manager must
                                        review the suggested work,
                                        dependencies, capacity,
                                        and project timeline before
                                        making the final Sprint
                                        planning decision.
                                    </p>
                                </div>
                            </div>

                            {/* ==================================================
                                DATA NOTICE
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
                                <p
                                    className="
                                        text-xs
                                        leading-5
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Current frontend
                                    implementation: suggestions
                                    are dynamically calculated
                                    from the available project
                                    backlog, team capacity,
                                    previous sprint performance,
                                    dependencies, priorities,
                                    and deadline data. No
                                    suggested task is created or
                                    added to the project by this
                                    component.
                                </p>

                                {generatedAt && (
                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Suggestions generated:{" "}
                                        {generatedAt.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
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
                    bg-purple-100
                    dark:bg-purple-950
                "
            >
                <Icon
                    className="
                        h-5
                        w-5
                        text-purple-600
                        dark:text-purple-400
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

// ============================================================
// INFO BOX
// ============================================================

function InfoBox({
    label,
    value,
    icon: Icon,
}) {
    return (
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
            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >
                <Icon
                    className="
                        h-4
                        w-4
                        text-purple-600
                        dark:text-purple-400
                    "
                />

                <p
                    className="
                        text-xs
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </p>
            </div>

            <p
                className="
                    mt-2
                    text-xl
                    font-bold
                    text-slate-900
                    dark:text-white
                "
            >
                {value}
            </p>
        </div>
    );
}

// ============================================================
// TRENDING ICON
// ============================================================

function TrendingIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
        </svg>
    );
}

export default AISprintPlanning;