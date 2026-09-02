import { useMemo, useState } from "react";

import {
    BrainCircuit,
    CheckCircle2,
    Clock3,
    Users,
    ListChecks,
    Ban,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    UserCheck,
    Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// AI-004: ANALYZE TEAM PERFORMANCE USING AI
// ============================================================
//
// Use Case ID:
// AI-004
//
// Use Case Name:
// Analyze Team Performance Using AI
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// Goal:
// Allow AI to analyze team performance and identify patterns
// that may affect project delivery.
//
// AI MAY ANALYZE:
// - Task completion
// - Task delays
// - Workload distribution
// - Sprint completion
// - Blocked tasks
// - Team productivity trends
// - Team Leader progress
//
// BUSINESS RULES:
// 1. Analysis must use actual Team and project data.
// 2. Manager can analyze only Teams within authorized projects.
// 3. AI must not fabricate performance data.
// 4. Analysis focuses on work/project metrics.
// 5. Results are advisory.
// 6. Team member information respects privacy rules.
// 7. Performance metrics are dynamically calculated.
//
// CURRENT VERSION:
// Frontend-only implementation using available local data.
// ============================================================

function AITeamPerformance() {
    // ========================================================
    // AVAILABLE TEAM DATA
    // ========================================================
    //
    // IMPORTANT:
    // This is temporary frontend data.
    //
    // Later, this array should be replaced with authorized
    // backend/API data.
    // ========================================================

    const teams = [
        {
            id: 1,
            name: "AI Development Team",
            projectId: 1,
            projectName:
                "AI-Powered Project Management System",

            teamLeader: "Project Team Lead",

            members: [
                {
                    id: 1,
                    name: "Member 1",
                    completedTasks: 8,
                    totalTasks: 10,
                    blockedTasks: 1,
                },
                {
                    id: 2,
                    name: "Member 2",
                    completedTasks: 6,
                    totalTasks: 8,
                    blockedTasks: 1,
                },
                {
                    id: 3,
                    name: "Member 3",
                    completedTasks: 5,
                    totalTasks: 7,
                    blockedTasks: 0,
                },
            ],

            totalSprints: 5,
            completedSprints: 3,
        },

        {
            id: 2,
            name: "FieldSync Development Team",
            projectId: 2,
            projectName: "FieldSync",

            teamLeader: "Project Team Lead",

            members: [
                {
                    id: 4,
                    name: "Member 1",
                    completedTasks: 5,
                    totalTasks: 7,
                    blockedTasks: 0,
                },
                {
                    id: 5,
                    name: "Member 2",
                    completedTasks: 4,
                    totalTasks: 6,
                    blockedTasks: 1,
                },
                {
                    id: 6,
                    name: "Member 3",
                    completedTasks: 3,
                    totalTasks: 5,
                    blockedTasks: 0,
                },
            ],

            totalSprints: 4,
            completedSprints: 1,
        },

        {
            id: 3,
            name: "Library System Team",
            projectId: 3,
            projectName: "Library Management System",

            teamLeader: "Project Team Lead",

            members: [
                {
                    id: 7,
                    name: "Member 1",
                    completedTasks: 10,
                    totalTasks: 10,
                    blockedTasks: 0,
                },
                {
                    id: 8,
                    name: "Member 2",
                    completedTasks: 8,
                    totalTasks: 8,
                    blockedTasks: 0,
                },
                {
                    id: 9,
                    name: "Member 3",
                    completedTasks: 7,
                    totalTasks: 7,
                    blockedTasks: 0,
                },
            ],

            totalSprints: 3,
            completedSprints: 3,
        },
    ];

    // ========================================================
    // STATE
    // ========================================================

    const [selectedTeamId, setSelectedTeamId] = useState("");

    const [analysis, setAnalysis] = useState(null);

    const [analyzedAt, setAnalyzedAt] = useState(null);

    // ========================================================
    // SELECTED TEAM
    // ========================================================

    const selectedTeam = useMemo(() => {
        return teams.find(
            (team) =>
                String(team.id) ===
                String(selectedTeamId)
        );
    }, [selectedTeamId]);

    // ========================================================
    // CALCULATE TEAM METRICS
    // ========================================================

    const calculateMetrics = (team) => {
        if (!team || !Array.isArray(team.members)) {
            return null;
        }

        const totalTasks = team.members.reduce(
            (total, member) =>
                total +
                Number(member.totalTasks || 0),
            0
        );

        const completedTasks = team.members.reduce(
            (total, member) =>
                total +
                Number(member.completedTasks || 0),
            0
        );

        const blockedTasks = team.members.reduce(
            (total, member) =>
                total +
                Number(member.blockedTasks || 0),
            0
        );

        const incompleteTasks = Math.max(
            totalTasks - completedTasks,
            0
        );

        const completionRate =
            totalTasks > 0
                ? Math.round(
                    (completedTasks / totalTasks) *
                    100
                )
                : 0;

        const blockedRate =
            totalTasks > 0
                ? Math.round(
                    (blockedTasks / totalTasks) *
                    100
                )
                : 0;

        const sprintCompletionRate =
            team.totalSprints > 0
                ? Math.round(
                    (team.completedSprints /
                        team.totalSprints) *
                    100
                )
                : 0;

        const workload = team.members.map(
            (member) => {
                const percentage =
                    totalTasks > 0
                        ? Math.round(
                            (member.totalTasks /
                                totalTasks) *
                            100
                        )
                        : 0;

                return {
                    ...member,
                    workloadPercentage:
                        percentage,
                };
            }
        );

        return {
            totalTasks,
            completedTasks,
            incompleteTasks,
            blockedTasks,
            completionRate,
            blockedRate,
            sprintCompletionRate,
            workload,
        };
    };

    // ========================================================
    // GENERATE TEAM ANALYSIS
    // ========================================================

    const analyzeTeam = (team) => {
        if (!team) {
            setAnalysis(null);
            setAnalyzedAt(null);
            return;
        }

        const metrics = calculateMetrics(team);

        if (!metrics) {
            setAnalysis(null);
            setAnalyzedAt(null);
            return;
        }

        const findings = [];

        // ====================================================
        // TASK COMPLETION
        // ====================================================

        if (metrics.completionRate >= 80) {
            findings.push({
                id: "completion",
                type: "Task Completion",
                title: "Strong task completion",
                description:
                    `The team has completed ${metrics.completedTasks} of ${metrics.totalTasks} recorded tasks, resulting in a ${metrics.completionRate}% completion rate.`,
                level: "Good",
                icon: CheckCircle2,
            });
        } else if (metrics.completionRate >= 60) {
            findings.push({
                id: "completion",
                type: "Task Completion",
                title: "Moderate task completion",
                description:
                    `The team has completed ${metrics.completedTasks} of ${metrics.totalTasks} recorded tasks. The current completion rate is ${metrics.completionRate}%.`,
                level: "Medium",
                icon: TrendingUp,
            });
        } else {
            findings.push({
                id: "completion",
                type: "Task Completion",
                title:
                    "Task completion requires attention",
                description:
                    `The team has completed ${metrics.completedTasks} of ${metrics.totalTasks} recorded tasks. The current completion rate is ${metrics.completionRate}%.`,
                level: "Attention",
                icon: AlertTriangle,
            });
        }

        // ====================================================
        // INCOMPLETE TASKS
        // ====================================================

        if (metrics.incompleteTasks > 0) {
            findings.push({
                id: "incomplete",
                type: "Incomplete Tasks",
                title: "Review remaining work",
                description:
                    `${metrics.incompleteTasks} recorded task(s) remain incomplete. Review the remaining work and determine whether any tasks require additional attention.`,
                level:
                    metrics.incompleteTasks >= 5
                        ? "Medium"
                        : "Informational",
                icon: Clock3,
            });
        }

        // ====================================================
        // BLOCKED TASKS
        // ====================================================

        if (metrics.blockedTasks > 0) {
            findings.push({
                id: "blocked",
                type: "Blocked Tasks",
                title: "Review blocked tasks",
                description:
                    `${metrics.blockedTasks} blocked task(s) are recorded in the available team data. Review the blockers and determine whether dependencies or decisions are affecting progress.`,
                level: "Attention",
                icon: Ban,
            });
        } else {
            findings.push({
                id: "blocked",
                type: "Blocked Tasks",
                title: "No blocked tasks recorded",
                description:
                    "No blocked tasks are currently recorded in the available frontend team data.",
                level: "Good",
                icon: CheckCircle2,
            });
        }

        // ====================================================
        // SPRINT COMPLETION
        // ====================================================

        if (
            metrics.sprintCompletionRate >= 75
        ) {
            findings.push({
                id: "sprints",
                type: "Sprint Completion",
                title:
                    "Healthy sprint completion",
                description:
                    `${team.completedSprints} of ${team.totalSprints} recorded sprints are completed, giving a sprint completion rate of ${metrics.sprintCompletionRate}%.`,
                level: "Good",
                icon: ListChecks,
            });
        } else if (
            metrics.sprintCompletionRate >= 50
        ) {
            findings.push({
                id: "sprints",
                type: "Sprint Completion",
                title: "Moderate sprint completion",
                description:
                    `${team.completedSprints} of ${team.totalSprints} recorded sprints are completed. The calculated sprint completion rate is ${metrics.sprintCompletionRate}%.`,
                level: "Medium",
                icon: TrendingUp,
            });
        } else {
            findings.push({
                id: "sprints",
                type: "Sprint Completion",
                title: "Review sprint progress",
                description:
                    `${team.completedSprints} of ${team.totalSprints} recorded sprints are completed. The calculated sprint completion rate is ${metrics.sprintCompletionRate}%.`,
                level: "Attention",
                icon: Clock3,
            });
        }

        // ====================================================
        // WORKLOAD DISTRIBUTION
        // ====================================================

        const workloadValues =
            metrics.workload.map(
                (member) =>
                    member.workloadPercentage
            );

        const highestWorkload =
            workloadValues.length > 0
                ? Math.max(...workloadValues)
                : 0;

        const lowestWorkload =
            workloadValues.length > 0
                ? Math.min(...workloadValues)
                : 0;

        const workloadDifference =
            highestWorkload -
            lowestWorkload;

        if (workloadDifference >= 20) {
            findings.push({
                id: "workload",
                type: "Workload Distribution",
                title:
                    "Review workload distribution",
                description:
                    `The recorded task distribution differs by ${workloadDifference} percentage points between the highest and lowest recorded workloads. Review whether task allocation is balanced.`,
                level: "Medium",
                icon: Users,
            });
        } else {
            findings.push({
                id: "workload",
                type: "Workload Distribution",
                title:
                    "Workload appears relatively balanced",
                description:
                    `The difference between the highest and lowest recorded workload shares is ${workloadDifference} percentage points.`,
                level: "Good",
                icon: Users,
            });
        }

        // ====================================================
        // PRODUCTIVITY TREND
        // ====================================================

        if (metrics.completionRate >= 80) {
            findings.push({
                id: "productivity",
                type: "Productivity Trend",
                title:
                    "Positive delivery pattern",
                description:
                    `The current task completion rate of ${metrics.completionRate}% indicates a strong recorded delivery pattern for this team.`,
                level: "Good",
                icon: TrendingUp,
            });
        } else if (
            metrics.completionRate >= 60
        ) {
            findings.push({
                id: "productivity",
                type: "Productivity Trend",
                title:
                    "Monitor delivery pattern",
                description:
                    `The current task completion rate is ${metrics.completionRate}%. Continued monitoring of task completion may help identify changes in delivery performance.`,
                level: "Medium",
                icon: TrendingUp,
            });
        } else {
            findings.push({
                id: "productivity",
                type: "Productivity Trend",
                title:
                    "Delivery pattern requires attention",
                description:
                    `The current task completion rate is ${metrics.completionRate}%. Review remaining work and blockers using the available project metrics.`,
                level: "Attention",
                icon: AlertTriangle,
            });
        }

        // ====================================================
        // TEAM LEADER PROGRESS
        // ====================================================

        findings.push({
            id: "leader-progress",
            type: "Team Leadership",
            title:
                "Team progress available for review",
            description:
                `The available project data identifies ${team.teamLeader} as the team lead. Team progress should be reviewed using calculated task and sprint metrics rather than unsupported personal judgments.`,
            level: "Informational",
            icon: UserCheck,
        });

        // ====================================================
        // OVERALL PERFORMANCE
        // ====================================================

        let overallStatus =
            "Needs Attention";

        if (
            metrics.completionRate >= 80 &&
            metrics.blockedTasks === 0 &&
            metrics.sprintCompletionRate >= 75
        ) {
            overallStatus = "Strong";
        } else if (
            metrics.completionRate >= 60 &&
            metrics.sprintCompletionRate >= 50
        ) {
            overallStatus = "Moderate";
        }

        setAnalysis({
            metrics,
            findings,
            overallStatus,
        });

        setAnalyzedAt(new Date());
    };

    // ========================================================
    // TEAM CHANGE
    // ========================================================

    const handleTeamChange = (event) => {
        const teamId = event.target.value;

        setSelectedTeamId(teamId);
        setAnalysis(null);
        setAnalyzedAt(null);

        if (!teamId) {
            return;
        }

        const team = teams.find(
            (item) =>
                String(item.id) ===
                String(teamId)
        );

        analyzeTeam(team);
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        if (!selectedTeam) {
            return;
        }

        analyzeTeam(selectedTeam);
    };

    // ========================================================
    // STATUS STYLES
    // ========================================================

    const getStatusStyles = (status) => {
        if (status === "Strong") {
            return {
                badge:
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                icon:
                    "text-emerald-600",
            };
        }

        if (status === "Moderate") {
            return {
                badge:
                    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                icon:
                    "text-amber-600",
            };
        }

        return {
            badge:
                "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
            icon:
                "text-red-600",
        };
    };

    // ========================================================
    // FINDING STYLES
    // ========================================================

    const getFindingStyles = (level) => {
        switch (level) {
            case "Good":
                return {
                    border:
                        "border-emerald-200 dark:border-emerald-900",
                    badge:
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                };

            case "Attention":
                return {
                    border:
                        "border-red-200 dark:border-red-900",
                    badge:
                        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                };

            case "Medium":
                return {
                    border:
                        "border-amber-200 dark:border-amber-900",
                    badge:
                        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                };

            default:
                return {
                    border:
                        "border-blue-200 dark:border-blue-900",
                    badge:
                        "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
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
                                bg-purple-600
                                text-white
                                shadow-sm
                            "
                        >
                            <BrainCircuit className="h-6 w-6" />
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
                                Analyze Team Performance
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Analyze team delivery,
                                workload, sprint progress,
                                blocked work, and productivity
                                using available project data.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={!selectedTeam}
                        onClick={handleRefresh}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reanalyze
                    </Button>
                </div>

                {/* ==================================================
                    TEAM SELECTOR
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
                                    text-lg
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Select Team
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Select a team from the currently
                                available project data.
                            </p>
                        </div>
                    </div>

                    <select
                        value={selectedTeamId}
                        onChange={handleTeamChange}
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
                            Select a team
                        </option>

                        {teams.map((team) => (
                            <option
                                key={team.id}
                                value={team.id}
                            >
                                {team.name} — {team.projectName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {!selectedTeam && (
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
                        <Users
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
                            Team Performance Analysis
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
                            Select a team to dynamically calculate
                            performance metrics and review AI-style
                            analysis based only on available
                            project work data.
                        </p>
                    </div>
                )}

                {/* ==================================================
                    RESULTS
                ================================================== */}

                {selectedTeam && analysis && (
                    <div className="space-y-6">

                        {/* ==================================================
                            TEAM INFORMATION
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
                                        {selectedTeam.name}
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Project:{" "}
                                        {selectedTeam.projectName}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Team Lead:{" "}
                                        {selectedTeam.teamLeader}
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
                                        {selectedTeam.members.length}
                                    </p>
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
                                            Overall Analysis
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
                                                    getStatusStyles(
                                                        analysis.overallStatus
                                                    ).badge
                                                }
                                            `}
                                        >
                                            {analysis.overallStatus}
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
                                title="Total Tasks"
                                value={
                                    analysis.metrics.totalTasks
                                }
                                icon={ListChecks}
                                description="Recorded tasks"
                            />

                            <MetricCard
                                title="Completed Tasks"
                                value={
                                    analysis.metrics.completedTasks
                                }
                                icon={CheckCircle2}
                                description={`${analysis.metrics.completionRate}% completion`}
                            />

                            <MetricCard
                                title="Incomplete Tasks"
                                value={
                                    analysis.metrics.incompleteTasks
                                }
                                icon={Clock3}
                                description="Remaining recorded work"
                            />

                            <MetricCard
                                title="Blocked Tasks"
                                value={
                                    analysis.metrics.blockedTasks
                                }
                                icon={Ban}
                                description={`${analysis.metrics.blockedRate}% of recorded tasks`}
                            />
                        </div>

                        {/* ==================================================
                            SPRINT METRIC
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
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >
                                <div className="flex items-center gap-3">

                                    <TrendingUp
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
                                            Sprint Completion
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Dynamically calculated
                                            from completed and total
                                            recorded sprints.
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {
                                            analysis.metrics
                                                .sprintCompletionRate
                                        }%
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        {
                                            selectedTeam
                                                .completedSprints
                                        }{" "}
                                        of{" "}
                                        {
                                            selectedTeam
                                                .totalSprints
                                        }{" "}
                                        sprints
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ==================================================
                            PERFORMANCE ANALYSIS
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
                            <div className="mb-6">

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <BrainCircuit
                                        className="
                                            h-6
                                            w-6
                                            text-purple-600
                                        "
                                    />

                                    <h2
                                        className="
                                            text-xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        AI Team Performance Analysis
                                    </h2>
                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Findings are derived only from
                                    currently available team work
                                    metrics.
                                </p>
                            </div>

                            <div className="space-y-4">

                                {analysis.findings.map(
                                    (finding) => {
                                        const Icon =
                                            finding.icon;

                                        const styles =
                                            getFindingStyles(
                                                finding.level
                                            );

                                        return (
                                            <div
                                                key={
                                                    finding.id
                                                }
                                                className={`
                                                    rounded-xl
                                                    border
                                                    p-5
                                                    ${styles.border}
                                                `}
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        gap-4
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            h-11
                                                            w-11
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-slate-100
                                                            dark:bg-slate-800
                                                        "
                                                    >
                                                        <Icon
                                                            className="
                                                                h-5
                                                                w-5
                                                                text-purple-600
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
                                                            <div>
                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        font-medium
                                                                        uppercase
                                                                        tracking-wide
                                                                        text-slate-500
                                                                        dark:text-slate-400
                                                                    "
                                                                >
                                                                    {
                                                                        finding.type
                                                                    }
                                                                </p>

                                                                <h3
                                                                    className="
                                                                        mt-1
                                                                        text-lg
                                                                        font-bold
                                                                        text-slate-900
                                                                        dark:text-white
                                                                    "
                                                                >
                                                                    {
                                                                        finding.title
                                                                    }
                                                                </h3>
                                                            </div>

                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    w-fit
                                                                    rounded-full
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-semibold
                                                                    ${styles.badge}
                                                                `}
                                                            >
                                                                {
                                                                    finding.level
                                                                }
                                                            </span>
                                                        </div>

                                                        <p
                                                            className="
                                                                mt-3
                                                                text-sm
                                                                leading-6
                                                                text-slate-600
                                                                dark:text-slate-300
                                                            "
                                                        >
                                                            {
                                                                finding.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        </div>

                        {/* ==================================================
                            WORKLOAD DISTRIBUTION
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
                                        Workload Distribution
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Distribution is calculated
                                        from recorded task counts.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">

                                {analysis.metrics.workload.map(
                                    (member) => (
                                        <div
                                            key={member.id}
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
                                                    {member.name}
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
                                                        member.totalTasks
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
                                                        bg-purple-600
                                                    "
                                                    style={{
                                                        width:
                                                            `${member.workloadPercentage}%`,
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
                                                    member.workloadPercentage
                                                }%
                                                of recorded team tasks
                                            </p>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>

                        {/* ==================================================
                            TEAM WORK METRICS
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
                                <UserCheck
                                    className="
                                        h-6
                                        w-6
                                        text-blue-600
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
                                        Team Work Metrics
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Work-based metrics only.
                                        No unsupported personal
                                        judgments are generated.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">

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
                                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                Team Member
                                            </th>

                                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                Tasks
                                            </th>

                                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                Completed
                                            </th>

                                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                Blocked
                                            </th>

                                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                Completion
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedTeam.members.map(
                                            (member) => {
                                                const completion =
                                                    member.totalTasks >
                                                    0
                                                        ? Math.round(
                                                            (
                                                                member.completedTasks /
                                                                member.totalTasks
                                                            ) *
                                                            100
                                                        )
                                                        : 0;

                                                return (
                                                    <tr
                                                        key={
                                                            member.id
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
                                                                member.name
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
                                                                member.totalTasks
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
                                                                member.completedTasks
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
                                                                member.blockedTasks
                                                            }
                                                        </td>

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    font-semibold
                                                                    text-slate-900
                                                                    dark:text-white
                                                                "
                                                            >
                                                                {
                                                                    completion
                                                                }%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>

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
                                    AI Performance Analysis Notice
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
                                    This analysis is advisory and
                                    uses only available team,
                                    task, and sprint data. It does
                                    not automatically change tasks,
                                    workloads, project status, or
                                    team assignments. Performance
                                    observations focus on work
                                    metrics rather than unsupported
                                    personal judgments.
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
                                Current frontend implementation:
                                team performance metrics are
                                dynamically calculated from the
                                available team task and sprint
                                data. This version does not call
                                an external AI service or backend
                                API.
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
                                    Analysis generated:{" "}
                                    {analyzedAt.toLocaleString()}
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
                    items-center
                    justify-between
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

export default AITeamPerformance;