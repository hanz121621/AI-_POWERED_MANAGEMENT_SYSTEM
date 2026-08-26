import { useMemo, useState } from "react";

import {
    BrainCircuit,
    CheckCircle2,
    Clock3,
    Users,
    ListChecks,
    AlertTriangle,
    RefreshCw,
    CalendarDays,
    CircleAlert,
    Activity,
    Target,
    FileText,
    ShieldCheck,
    TrendingUp,
    ClipboardList,
    Flag,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// AI-008: GENERATE AUTOMATED PROJECT SUMMARY
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
// 1. Summary is generated from actual project data.
// 2. AI does not invent project statistics.
// 3. Actual and predicted information are clearly separated.
// 4. Summary reflects the latest available frontend data.
// 5. Only project information available to the manager is shown.
// 6. Manager remains responsible for interpretation.
// 7. Summary can be regenerated when data changes.
//
// IMPORTANT:
// This implementation does NOT modify project data.
// It only analyzes and displays available information.
// ============================================================

function AIAutomatedProjectSummary() {
    // ========================================================
    // AVAILABLE PROJECT DATA
    // ========================================================
    //
    // This frontend data can later be replaced with API data.
    // The calculation and UI structure can remain unchanged.
    // ========================================================

    const projects = [
        {
            id: 1,
            name: "AI-Powered Project Management System",
            description:
                "AI-powered project management platform for project planning, monitoring, risk analysis, and team collaboration.",

            status: "Active",

            startDate: "2026-08-01",
            deadline: "2026-09-30",

            teamName: "AI Development Team",

            teamMembers: 3,

            tasks: [
                {
                    id: 1,
                    title: "Project Architecture",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 2,
                    title: "Authentication Module",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 3,
                    title: "User Management",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 4,
                    title: "Project Management",
                    status: "In Progress",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 5,
                    title: "Sprint Management",
                    status: "In Progress",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 6,
                    title: "AI Risk Prediction",
                    status: "In Progress",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 7,
                    title: "AI Recommendation Engine",
                    status: "Pending",
                    priority: "Medium",
                    blocked: false,
                },
                {
                    id: 8,
                    title: "Reporting Module",
                    status: "Pending",
                    priority: "Medium",
                    blocked: false,
                },
                {
                    id: 9,
                    title: "System Testing",
                    status: "Blocked",
                    priority: "High",
                    blocked: true,
                },
                {
                    id: 10,
                    title: "Deployment",
                    status: "Pending",
                    priority: "High",
                    blocked: false,
                },
            ],

            sprints: [
                {
                    id: 1,
                    name: "Sprint 01",
                    status: "Completed",
                    completedTasks: 12,
                    totalTasks: 12,
                },
                {
                    id: 2,
                    name: "Sprint 02",
                    status: "Completed",
                    completedTasks: 10,
                    totalTasks: 10,
                },
                {
                    id: 3,
                    name: "Sprint 03",
                    status: "Active",
                    completedTasks: 8,
                    totalTasks: 12,
                },
                {
                    id: 4,
                    name: "Sprint 04",
                    status: "Planning",
                    completedTasks: 0,
                    totalTasks: 8,
                },
            ],

            risks: [
                {
                    id: 1,
                    title: "Testing dependency",
                    severity: "High",
                    status: "Open",
                },
                {
                    id: 2,
                    title: "AI integration dependency",
                    severity: "Medium",
                    status: "Open",
                },
            ],

            issues: [
                {
                    id: 1,
                    title: "System testing is blocked",
                    priority: "High",
                    status: "Open",
                },
                {
                    id: 2,
                    title: "AI service integration requires validation",
                    priority: "Medium",
                    status: "Open",
                },
            ],

            activities: [
                {
                    id: 1,
                    title: "Project Management module updated",
                    date: "2026-08-20",
                    type: "Project",
                },
                {
                    id: 2,
                    title: "Sprint 03 progress updated",
                    date: "2026-08-21",
                    type: "Sprint",
                },
                {
                    id: 3,
                    title: "AI risk analysis reviewed",
                    date: "2026-08-22",
                    type: "AI",
                },
                {
                    id: 4,
                    title: "System testing blocker recorded",
                    date: "2026-08-23",
                    type: "Issue",
                },
            ],
        },

        {
            id: 2,
            name: "FieldSync",
            description:
                "Offline-first rural reporting and synchronization system.",

            status: "Active",

            startDate: "2026-08-05",
            deadline: "2026-10-15",

            teamName: "FieldSync Development Team",

            teamMembers: 3,

            tasks: [
                {
                    id: 11,
                    title: "Offline Registration",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 12,
                    title: "IndexedDB Storage",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 13,
                    title: "Synchronization Engine",
                    status: "In Progress",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 14,
                    title: "Manager Dashboard",
                    status: "In Progress",
                    priority: "Medium",
                    blocked: false,
                },
                {
                    id: 15,
                    title: "REST API",
                    status: "Pending",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 16,
                    title: "Testing",
                    status: "Pending",
                    priority: "Medium",
                    blocked: false,
                },
            ],

            sprints: [
                {
                    id: 5,
                    name: "FieldSync Sprint 01",
                    status: "Completed",
                    completedTasks: 8,
                    totalTasks: 8,
                },
                {
                    id: 6,
                    name: "FieldSync Sprint 02",
                    status: "Active",
                    completedTasks: 5,
                    totalTasks: 9,
                },
            ],

            risks: [
                {
                    id: 3,
                    title: "Network synchronization complexity",
                    severity: "Medium",
                    status: "Open",
                },
            ],

            issues: [
                {
                    id: 3,
                    title: "Synchronization validation pending",
                    priority: "Medium",
                    status: "Open",
                },
            ],

            activities: [
                {
                    id: 5,
                    title: "Offline registration updated",
                    date: "2026-08-20",
                    type: "Project",
                },
                {
                    id: 6,
                    title: "Synchronization engine updated",
                    date: "2026-08-22",
                    type: "Development",
                },
            ],
        },

        {
            id: 3,
            name: "Library Management System",
            description:
                "Library management platform for books, members, borrowing, and reporting.",

            status: "Active",

            startDate: "2026-08-01",
            deadline: "2026-09-15",

            teamName: "Library System Team",

            teamMembers: 3,

            tasks: [
                {
                    id: 17,
                    title: "Book Management",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 18,
                    title: "Member Management",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 19,
                    title: "Borrowing Module",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
                {
                    id: 20,
                    title: "Reporting",
                    status: "Completed",
                    priority: "Medium",
                    blocked: false,
                },
                {
                    id: 21,
                    title: "Testing",
                    status: "Completed",
                    priority: "High",
                    blocked: false,
                },
            ],

            sprints: [
                {
                    id: 7,
                    name: "Library Sprint 01",
                    status: "Completed",
                    completedTasks: 10,
                    totalTasks: 10,
                },
                {
                    id: 8,
                    name: "Library Sprint 02",
                    status: "Completed",
                    completedTasks: 8,
                    totalTasks: 8,
                },
                {
                    id: 9,
                    name: "Library Sprint 03",
                    status: "Completed",
                    completedTasks: 7,
                    totalTasks: 7,
                },
            ],

            risks: [],

            issues: [],

            activities: [
                {
                    id: 7,
                    title: "Testing completed",
                    date: "2026-08-21",
                    type: "Testing",
                },
                {
                    id: 8,
                    title: "Reporting module completed",
                    date: "2026-08-22",
                    type: "Project",
                },
            ],
        },
    ];

    // ========================================================
    // STATE
    // ========================================================

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [summary, setSummary] = useState(null);

    const [generatedAt, setGeneratedAt] = useState(null);

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
    // CALCULATE PROJECT METRICS
    // ========================================================

    const calculateMetrics = (project) => {
        if (!project) {
            return null;
        }

        const tasks = Array.isArray(project.tasks)
            ? project.tasks
            : [];

        const sprints = Array.isArray(project.sprints)
            ? project.sprints
            : [];

        const risks = Array.isArray(project.risks)
            ? project.risks
            : [];

        const issues = Array.isArray(project.issues)
            ? project.issues
            : [];

        const activities = Array.isArray(project.activities)
            ? project.activities
            : [];

        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            (task) =>
                String(task.status).toLowerCase() ===
                "completed"
        ).length;

        const inProgressTasks = tasks.filter(
            (task) =>
                String(task.status).toLowerCase() ===
                "in progress"
        ).length;

        const pendingTasks = tasks.filter(
            (task) =>
                String(task.status).toLowerCase() ===
                "pending"
        ).length;

        const blockedTasks = tasks.filter(
            (task) =>
                task.blocked === true ||
                String(task.status).toLowerCase() ===
                    "blocked"
        ).length;

        const remainingTasks = Math.max(
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

        const totalSprintTasks = sprints.reduce(
            (total, sprint) =>
                total +
                Number(sprint.totalTasks || 0),
            0
        );

        const completedSprintTasks = sprints.reduce(
            (total, sprint) =>
                total +
                Number(
                    sprint.completedTasks || 0
                ),
            0
        );

        const sprintProgress =
            totalSprintTasks > 0
                ? Math.round(
                      (completedSprintTasks /
                          totalSprintTasks) *
                          100
                  )
                : 0;

        const completedSprints = sprints.filter(
            (sprint) =>
                String(sprint.status).toLowerCase() ===
                "completed"
        ).length;

        const activeSprints = sprints.filter(
            (sprint) =>
                String(sprint.status).toLowerCase() ===
                "active"
        ).length;

        const openRisks = risks.filter(
            (risk) =>
                String(risk.status).toLowerCase() !==
                "closed"
        );

        const openIssues = issues.filter(
            (issue) =>
                String(issue.status).toLowerCase() !==
                "closed"
        );

        const highRisks = openRisks.filter(
            (risk) =>
                String(risk.severity).toLowerCase() ===
                "high"
        ).length;

        const highIssues = openIssues.filter(
            (issue) =>
                String(issue.priority).toLowerCase() ===
                "high"
        ).length;

        const sortedActivities = [...activities].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );

        const upcomingDeadline = project.deadline
            ? new Date(project.deadline)
            : null;

        const today = new Date();

        let daysUntilDeadline = null;

        if (upcomingDeadline) {
            const millisecondsPerDay =
                1000 * 60 * 60 * 24;

            daysUntilDeadline = Math.ceil(
                (upcomingDeadline.getTime() -
                    today.getTime()) /
                    millisecondsPerDay
            );
        }

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            blockedTasks,
            remainingTasks,
            completionRate,

            totalSprintTasks,
            completedSprintTasks,
            sprintProgress,
            completedSprints,
            activeSprints,

            openRisks,
            openIssues,
            highRisks,
            highIssues,

            recentActivities:
                sortedActivities.slice(0, 5),

            daysUntilDeadline,
        };
    };

    // ========================================================
    // GENERATE AUTOMATED SUMMARY
    // ========================================================

    const generateSummary = (project) => {
        if (!project) {
            setSummary(null);
            setGeneratedAt(null);
            return;
        }

        const metrics =
            calculateMetrics(project);

        if (!metrics) {
            setSummary(null);
            setGeneratedAt(null);
            return;
        }

        // ====================================================
        // ACTUAL DATA SUMMARY
        // ====================================================

        const actualSummary = {
            projectStatus: project.status,

            taskSummary:
                metrics.totalTasks > 0
                    ? `The project has ${metrics.totalTasks} recorded tasks. ${metrics.completedTasks} are completed, ${metrics.inProgressTasks} are in progress, ${metrics.pendingTasks} are pending, and ${metrics.blockedTasks} are blocked.`
                    : "No project tasks are currently available.",

            progressSummary:
                `The current recorded task completion rate is ${metrics.completionRate}%. ${metrics.remainingTasks} task(s) remain incomplete.`,

            sprintSummary:
                metrics.totalSprintTasks > 0
                    ? `Recorded sprint work is ${metrics.sprintProgress}% complete based on ${metrics.completedSprintTasks} completed sprint tasks out of ${metrics.totalSprintTasks} recorded sprint tasks.`
                    : "No sprint task data is currently available.",

            teamSummary:
                `${project.teamName} has ${project.teamMembers} recorded team member(s) in the available project data.`,

            riskSummary:
                metrics.openRisks.length > 0
                    ? `${metrics.openRisks.length} open risk(s) are currently recorded, including ${metrics.highRisks} high-severity risk(s).`
                    : "No open project risks are currently recorded.",

            issueSummary:
                metrics.openIssues.length > 0
                    ? `${metrics.openIssues.length} open issue(s) are currently recorded, including ${metrics.highIssues} high-priority issue(s).`
                    : "No open project issues are currently recorded.",

            deadlineSummary:
                project.deadline
                    ? `The official project deadline is ${formatDate(
                          project.deadline
                      )}.`
                    : "No official project deadline is currently recorded.",

            activitySummary:
                metrics.recentActivities.length > 0
                    ? `${metrics.recentActivities.length} recent project activities are available for review.`
                    : "No recent project activities are currently recorded.",
        };

        // ====================================================
        // DATA-BASED CONDITION
        // ====================================================

        let projectCondition = "Stable";

        if (
            metrics.blockedTasks > 0 ||
            metrics.highRisks > 0 ||
            metrics.highIssues > 0
        ) {
            projectCondition =
                "Requires Attention";
        } else if (
            metrics.completionRate >= 80 &&
            metrics.sprintProgress >= 75
        ) {
            projectCondition = "Progressing Well";
        } else if (
            metrics.completionRate < 60 ||
            metrics.sprintProgress < 50
        ) {
            projectCondition = "Progress Requires Review";
        }

        // ====================================================
        // ADVISORY / PREDICTED SECTION
        // ====================================================
        //
        // We intentionally do not invent a future percentage
        // or future date here.
        //
        // AI-008 is a project summary use case, so predicted
        // values from AI-005 and AI-006 should remain clearly
        // separated when those services become available.
        // ====================================================

        const advisory = [];

        if (metrics.blockedTasks > 0) {
            advisory.push(
                "Blocked work should be investigated because it may affect future delivery."
            );
        }

        if (metrics.highRisks > 0) {
            advisory.push(
                "High-severity risks are currently recorded and should be reviewed by the Manager."
            );
        }

        if (metrics.highIssues > 0) {
            advisory.push(
                "High-priority issues are currently recorded and may require Manager attention."
            );
        }

        if (
            metrics.completionRate >= 80 &&
            metrics.blockedTasks === 0
        ) {
            advisory.push(
                "The available work metrics indicate strong recorded progress."
            );
        }

        if (advisory.length === 0) {
            advisory.push(
                "No additional advisory observation was generated from the available project data."
            );
        }

        setSummary({
            metrics,
            actualSummary,
            projectCondition,
            advisory,
        });

        setGeneratedAt(new Date());
    };

    // ========================================================
    // HANDLE PROJECT CHANGE
    // ========================================================

    const handleProjectChange = (event) => {
        const projectId =
            event.target.value;

        setSelectedProjectId(projectId);
        setSummary(null);
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

        generateSummary(project);
    };

    // ========================================================
    // REFRESH SUMMARY
    // ========================================================

    const handleRefresh = () => {
        if (!selectedProject) {
            return;
        }

        generateSummary(selectedProject);
    };

    // ========================================================
    // STATUS STYLES
    // ========================================================

    const getConditionStyles = (
        condition
    ) => {
        if (
            condition ===
            "Progressing Well"
        ) {
            return {
                badge:
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                icon:
                    "text-emerald-600 dark:text-emerald-400",
            };
        }

        if (
            condition ===
            "Requires Attention"
        ) {
            return {
                badge:
                    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                icon:
                    "text-red-600 dark:text-red-400",
            };
        }

        if (
            condition ===
            "Progress Requires Review"
        ) {
            return {
                badge:
                    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                icon:
                    "text-amber-600 dark:text-amber-400",
            };
        }

        return {
            badge:
                "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
            icon:
                "text-blue-600 dark:text-blue-400",
        };
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
                                Automated Project Summary
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Generate a concise summary
                                of the current project
                                condition using available
                                project data.
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
                        <RefreshCw
                            className="
                                h-4
                                w-4
                            "
                        />

                        Regenerate Summary
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
                                Select an available
                                project to generate its
                                automated summary.
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
                        <FileText
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
                            Automated Project Summary
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
                            Select a project to generate
                            a concise summary using its
                            available project, task,
                            sprint, risk, issue, team,
                            deadline, and activity data.
                        </p>
                    </div>
                )}

                {/* ==================================================
                    SUMMARY
                ================================================== */}

                {selectedProject &&
                    summary && (
                        <div className="space-y-6">

                            {/* ==================================================
                                PROJECT HEADER
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
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                    "
                                >
                                    <div>
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <Target
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
                                                {
                                                    selectedProject.name
                                                }
                                            </h2>
                                        </div>

                                        <p
                                            className="
                                                mt-2
                                                max-w-3xl
                                                text-sm
                                                leading-6
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            {
                                                selectedProject.description
                                            }
                                        </p>

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                flex-wrap
                                                gap-3
                                            "
                                        >
                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    bg-slate-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                    dark:bg-slate-800
                                                    dark:text-slate-300
                                                "
                                            >
                                                Status:{" "}
                                                {
                                                    selectedProject.status
                                                }
                                            </span>

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    bg-slate-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                    dark:bg-slate-800
                                                    dark:text-slate-300
                                                "
                                            >
                                                Team:{" "}
                                                {
                                                    selectedProject.teamName
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
                                        <ShieldCheck
                                            className={`
                                                h-7
                                                w-7
                                                ${
                                                    getConditionStyles(
                                                        summary.projectCondition
                                                    ).icon
                                                }
                                            `}
                                        />

                                        <div>
                                            <p
                                                className="
                                                    text-xs
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                Current Condition
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
                                                        getConditionStyles(
                                                            summary.projectCondition
                                                        ).badge
                                                    }
                                                `}
                                            >
                                                {
                                                    summary.projectCondition
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
                                <SummaryMetricCard
                                    title="Project Progress"
                                    value={`${summary.metrics.completionRate}%`}
                                    icon={TrendingUp}
                                    description="Actual task completion"
                                />

                                <SummaryMetricCard
                                    title="Completed Work"
                                    value={
                                        summary.metrics
                                            .completedTasks
                                    }
                                    icon={CheckCircle2}
                                    description={`of ${summary.metrics.totalTasks} recorded tasks`}
                                />

                                <SummaryMetricCard
                                    title="Remaining Work"
                                    value={
                                        summary.metrics
                                            .remainingTasks
                                    }
                                    icon={ListChecks}
                                    description="Incomplete recorded tasks"
                                />

                                <SummaryMetricCard
                                    title="Blocked Tasks"
                                    value={
                                        summary.metrics
                                            .blockedTasks
                                    }
                                    icon={AlertTriangle}
                                    description="Currently recorded blockers"
                                />
                            </div>

                            {/* ==================================================
                                AUTOMATED SUMMARY
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-purple-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                    dark:border-purple-900
                                    dark:bg-slate-900
                                "
                            >
                                <div
                                    className="
                                        mb-6
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

                                    <div>
                                        <h2
                                            className="
                                                text-xl
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Automated Project Summary
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Generated from the
                                            latest available
                                            project data.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">

                                    <SummarySection
                                        icon={Activity}
                                        title="Overall Project Progress"
                                    >
                                        {
                                            summary.actualSummary
                                                .progressSummary
                                        }
                                    </SummarySection>

                                    <SummarySection
                                        icon={ListChecks}
                                        title="Work Summary"
                                    >
                                        {
                                            summary.actualSummary
                                                .taskSummary
                                        }
                                    </SummarySection>

                                    <SummarySection
                                        icon={Target}
                                        title="Sprint Progress"
                                    >
                                        {
                                            summary.actualSummary
                                                .sprintSummary
                                        }
                                    </SummarySection>

                                    <SummarySection
                                        icon={Users}
                                        title="Team Progress"
                                    >
                                        {
                                            summary.actualSummary
                                                .teamSummary
                                        }
                                    </SummarySection>

                                    <SummarySection
                                        icon={AlertTriangle}
                                        title="Current Risks"
                                    >
                                        {
                                            summary.actualSummary
                                                .riskSummary
                                        }
                                    </SummarySection>

                                    <SummarySection
                                        icon={CircleAlert}
                                        title="Current Issues"
                                    >
                                        {
                                            summary.actualSummary
                                                .issueSummary
                                        }
                                    </SummarySection>

                                    <SummarySection
                                        icon={CalendarDays}
                                        title="Official Deadline"
                                    >
                                        {
                                            summary.actualSummary
                                                .deadlineSummary
                                        }
                                    </SummarySection>

                                    <SummarySection
                                        icon={Activity}
                                        title="Recent Activities"
                                    >
                                        {
                                            summary.actualSummary
                                                .activitySummary
                                        }
                                    </SummarySection>

                                </div>
                            </div>

                            {/* ==================================================
                                ACTUAL PROJECT DATA
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-emerald-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                    dark:border-emerald-900
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
                                    <ShieldCheck
                                        className="
                                            h-6
                                            w-6
                                            text-emerald-600
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
                                            Actual Project Data
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            These values are
                                            calculated from
                                            currently available
                                            project records.
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
                                    <DataRow
                                        label="Project Status"
                                        value={
                                            selectedProject.status
                                        }
                                    />

                                    <DataRow
                                        label="Total Tasks"
                                        value={
                                            summary.metrics
                                                .totalTasks
                                        }
                                    />

                                    <DataRow
                                        label="Completed Tasks"
                                        value={
                                            summary.metrics
                                                .completedTasks
                                        }
                                    />

                                    <DataRow
                                        label="In Progress Tasks"
                                        value={
                                            summary.metrics
                                                .inProgressTasks
                                        }
                                    />

                                    <DataRow
                                        label="Pending Tasks"
                                        value={
                                            summary.metrics
                                                .pendingTasks
                                        }
                                    />

                                    <DataRow
                                        label="Blocked Tasks"
                                        value={
                                            summary.metrics
                                                .blockedTasks
                                        }
                                    />

                                    <DataRow
                                        label="Completed Sprints"
                                        value={
                                            summary.metrics
                                                .completedSprints
                                        }
                                    />

                                    <DataRow
                                        label="Active Sprints"
                                        value={
                                            summary.metrics
                                                .activeSprints
                                        }
                                    />

                                    <DataRow
                                        label="Sprint Progress"
                                        value={`${summary.metrics.sprintProgress}%`}
                                    />

                                    <DataRow
                                        label="Open Risks"
                                        value={
                                            summary.metrics
                                                .openRisks
                                                .length
                                        }
                                    />

                                    <DataRow
                                        label="Open Issues"
                                        value={
                                            summary.metrics
                                                .openIssues
                                                .length
                                        }
                                    />

                                    <DataRow
                                        label="Team Members"
                                        value={
                                            selectedProject.teamMembers
                                        }
                                    />
                                </div>
                            </div>

                            {/* ==================================================
                                DEADLINE
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
                                            Upcoming Deadline
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            This is the official
                                            project deadline,
                                            not an AI prediction.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        mt-5
                                        grid
                                        grid-cols-1
                                        gap-4
                                        md:grid-cols-2
                                    "
                                >
                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            p-5
                                            dark:border-slate-700
                                            dark:bg-slate-800
                                        "
                                    >
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
                                            Official Deadline
                                        </p>

                                        <p
                                            className="
                                                mt-2
                                                text-2xl
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {
                                                selectedProject.deadline
                                                    ? formatDate(
                                                          selectedProject.deadline
                                                      )
                                                    : "Not recorded"
                                            }
                                        </p>
                                    </div>

                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            p-5
                                            dark:border-slate-700
                                            dark:bg-slate-800
                                        "
                                    >
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
                                            Deadline Timing
                                        </p>

                                        <p
                                            className="
                                                mt-2
                                                text-lg
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {getDeadlineText(
                                                summary.metrics
                                                    .daysUntilDeadline
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                CURRENT RISKS
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
                                    <Flag
                                        className="
                                            h-6
                                            w-6
                                            text-red-600
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
                                            Current Risks
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Risks currently
                                            recorded for this
                                            project.
                                        </p>
                                    </div>
                                </div>

                                {summary.metrics.openRisks
                                    .length === 0 ? (
                                    <EmptyMessage>
                                        No open risks are
                                        currently recorded.
                                    </EmptyMessage>
                                ) : (
                                    <div className="space-y-3">
                                        {summary.metrics.openRisks.map(
                                            (risk) => (
                                                <div
                                                    key={
                                                        risk.id
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
                                                            gap-2
                                                            sm:flex-row
                                                            sm:items-center
                                                            sm:justify-between
                                                        "
                                                    >
                                                        <div>
                                                            <p
                                                                className="
                                                                    font-semibold
                                                                    text-slate-900
                                                                    dark:text-white
                                                                "
                                                            >
                                                                {
                                                                    risk.title
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-slate-500
                                                                    dark:text-slate-400
                                                                "
                                                            >
                                                                Status:{" "}
                                                                {
                                                                    risk.status
                                                                }
                                                            </p>
                                                        </div>

                                                        <span
                                                            className="
                                                                inline-flex
                                                                w-fit
                                                                rounded-full
                                                                bg-red-100
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-red-700
                                                                dark:bg-red-950
                                                                dark:text-red-300
                                                            "
                                                        >
                                                            {
                                                                risk.severity
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ==================================================
                                CURRENT ISSUES
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
                                    <CircleAlert
                                        className="
                                            h-6
                                            w-6
                                            text-amber-600
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
                                            Current Issues
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Issues currently
                                            recorded for this
                                            project.
                                        </p>
                                    </div>
                                </div>

                                {summary.metrics.openIssues
                                    .length === 0 ? (
                                    <EmptyMessage>
                                        No open issues are
                                        currently recorded.
                                    </EmptyMessage>
                                ) : (
                                    <div className="space-y-3">
                                        {summary.metrics.openIssues.map(
                                            (issue) => (
                                                <div
                                                    key={
                                                        issue.id
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
                                                            gap-2
                                                            sm:flex-row
                                                            sm:items-center
                                                            sm:justify-between
                                                        "
                                                    >
                                                        <div>
                                                            <p
                                                                className="
                                                                    font-semibold
                                                                    text-slate-900
                                                                    dark:text-white
                                                                "
                                                            >
                                                                {
                                                                    issue.title
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-slate-500
                                                                    dark:text-slate-400
                                                                "
                                                            >
                                                                Status:{" "}
                                                                {
                                                                    issue.status
                                                                }
                                                            </p>
                                                        </div>

                                                        <span
                                                            className="
                                                                inline-flex
                                                                w-fit
                                                                rounded-full
                                                                bg-amber-100
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-amber-700
                                                                dark:bg-amber-950
                                                                dark:text-amber-300
                                                            "
                                                        >
                                                            {
                                                                issue.priority
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ==================================================
                                RECENT ACTIVITIES
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
                                    <Activity
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
                                            Recent Activities
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Important recent
                                            activities recorded
                                            for the project.
                                        </p>
                                    </div>
                                </div>

                                {summary.metrics
                                    .recentActivities
                                    .length === 0 ? (
                                    <EmptyMessage>
                                        No recent activities
                                        are currently
                                        recorded.
                                    </EmptyMessage>
                                ) : (
                                    <div className="space-y-3">
                                        {summary.metrics.recentActivities.map(
                                            (
                                                activity
                                            ) => (
                                                <div
                                                    key={
                                                        activity.id
                                                    }
                                                    className="
                                                        flex
                                                        gap-4
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
                                                            h-10
                                                            w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-blue-100
                                                            dark:bg-blue-950
                                                        "
                                                    >
                                                        <Activity
                                                            className="
                                                                h-5
                                                                w-5
                                                                text-blue-600
                                                                dark:text-blue-400
                                                            "
                                                        />
                                                    </div>

                                                    <div>
                                                        <p
                                                            className="
                                                                font-medium
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            {
                                                                activity.title
                                                            }
                                                        </p>

                                                        <div
                                                            className="
                                                                mt-1
                                                                flex
                                                                flex-wrap
                                                                gap-2
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            <span>
                                                                {
                                                                    activity.type
                                                                }
                                                            </span>

                                                            <span>
                                                                •
                                                            </span>

                                                            <span>
                                                                {
                                                                    formatDate(
                                                                        activity.date
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ==================================================
                                ADVISORY / PREDICTED INFORMATION
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-blue-200
                                    bg-blue-50
                                    p-6
                                    dark:border-blue-900
                                    dark:bg-blue-950/30
                                "
                            >
                                <div
                                    className="
                                        flex
                                        gap-3
                                    "
                                >
                                    <BrainCircuit
                                        className="
                                            mt-0.5
                                            h-6
                                            w-6
                                            shrink-0
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    />

                                    <div>
                                        <h2
                                            className="
                                                text-lg
                                                font-bold
                                                text-blue-900
                                                dark:text-blue-300
                                            "
                                        >
                                            AI Advisory Observations
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                leading-6
                                                text-blue-800
                                                dark:text-blue-300
                                            "
                                        >
                                            These observations
                                            are derived from
                                            the available
                                            project records.
                                            They are advisory
                                            and do not modify
                                            project data.
                                        </p>

                                        <div
                                            className="
                                                mt-4
                                                space-y-3
                                            "
                                        >
                                            {summary.advisory.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-blue-200
                                                            bg-white
                                                            p-3
                                                            text-sm
                                                            text-blue-900
                                                            dark:border-blue-900
                                                            dark:bg-slate-900
                                                            dark:text-blue-200
                                                        "
                                                    >
                                                        {item}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                ACTUAL VS PREDICTED NOTICE
                            ================================================== */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    md:grid-cols-2
                                "
                            >
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
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <CheckCircle2
                                            className="
                                                h-5
                                                w-5
                                                text-emerald-600
                                                dark:text-emerald-400
                                            "
                                        />

                                        <h3
                                            className="
                                                font-bold
                                                text-emerald-900
                                                dark:text-emerald-300
                                            "
                                        >
                                            Actual Information
                                        </h3>
                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-emerald-800
                                            dark:text-emerald-300
                                        "
                                    >
                                        Project statistics
                                        shown in this section
                                        are calculated from
                                        currently available
                                        project records.
                                    </p>
                                </div>

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-purple-200
                                        bg-purple-50
                                        p-5
                                        dark:border-purple-900
                                        dark:bg-purple-950/30
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <TrendingUp
                                            className="
                                                h-5
                                                w-5
                                                text-purple-600
                                                dark:text-purple-400
                                            "
                                        />

                                        <h3
                                            className="
                                                font-bold
                                                text-purple-900
                                                dark:text-purple-300
                                            "
                                        >
                                            Predicted Information
                                        </h3>
                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-purple-800
                                            dark:text-purple-300
                                        "
                                    >
                                        No future project
                                        statistic is presented
                                        as an actual value.
                                        Predictions from
                                        AI-005 or AI-006 should
                                        remain clearly labelled
                                        as predictions when
                                        integrated.
                                    </p>
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
                                    border-slate-200
                                    bg-slate-50
                                    p-4
                                    dark:border-slate-700
                                    dark:bg-slate-800
                                "
                            >
                                <BrainCircuit
                                    className="
                                        mt-0.5
                                        h-5
                                        w-5
                                        shrink-0
                                        text-purple-600
                                        dark:text-purple-400
                                    "
                                />

                                <div>
                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                            dark:text-slate-200
                                        "
                                    >
                                        AI Project Summary Notice
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            leading-5
                                            text-slate-600
                                            dark:text-slate-400
                                        "
                                    >
                                        This summary is
                                        advisory. It does not
                                        automatically change
                                        project status, tasks,
                                        deadlines, risks,
                                        issues, sprint plans,
                                        or team assignments.
                                        The Project Manager
                                        remains responsible for
                                        interpreting the
                                        summary and making
                                        project decisions.
                                    </p>
                                </div>
                            </div>

                            {/* ==================================================
                                GENERATED TIME
                            ================================================== */}

                            {generatedAt && (
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
                                        <Clock3
                                            className="
                                                h-4
                                                w-4
                                                text-slate-500
                                            "
                                        />

                                        <p
                                            className="
                                                text-xs
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Summary generated:{" "}
                                            {generatedAt.toLocaleString()}
                                        </p>
                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            leading-5
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Current frontend
                                        implementation uses
                                        the available local
                                        project data. No
                                        external AI service or
                                        backend API is required
                                        for this version.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}

// ============================================================
// SUMMARY METRIC CARD
// ============================================================

function SummaryMetricCard({
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
// SUMMARY SECTION
// ============================================================

function SummarySection({
    icon: Icon,
    title,
    children,
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
            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >
                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
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

                <h3
                    className="
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    {title}
                </h3>
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
                {children}
            </p>
        </div>
    );
}

// ============================================================
// DATA ROW
// ============================================================

function DataRow({
    label,
    value,
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-4
                rounded-xl
                bg-slate-50
                px-4
                py-3
                dark:bg-slate-800
            "
        >
            <span
                className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {label}
            </span>

            <span
                className="
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-white
                "
            >
                {value}
            </span>
        </div>
    );
}

// ============================================================
// EMPTY MESSAGE
// ============================================================

function EmptyMessage({
    children,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-dashed
                border-slate-300
                p-6
                text-center
                text-sm
                text-slate-500
                dark:border-slate-700
                dark:text-slate-400
            "
        >
            {children}
        </div>
    );
}

// ============================================================
// DATE FORMATTER
// ============================================================

function formatDate(dateValue) {
    if (!dateValue) {
        return "Not recorded";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}

// ============================================================
// DEADLINE TEXT
// ============================================================

function getDeadlineText(
    daysUntilDeadline
) {
    if (daysUntilDeadline === null) {
        return "No deadline recorded";
    }

    if (daysUntilDeadline < 0) {
        return `${Math.abs(
            daysUntilDeadline
        )} day(s) past the official deadline`;
    }

    if (daysUntilDeadline === 0) {
        return "Official deadline is today";
    }

    return `${daysUntilDeadline} day(s) until the official deadline`;
}

// ============================================================
// EXPORT
// ============================================================

export default AIAutomatedProjectSummary;