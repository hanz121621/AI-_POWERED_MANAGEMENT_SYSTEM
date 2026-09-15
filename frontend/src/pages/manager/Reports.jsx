// ============================================================
// AIPMS - MANAGER REPORTS
// src/pages/manager/Reports.jsx
//
// Manager Project Reporting Dashboard
// Connected to ASP.NET Core backend APIs.
//
// UI:
// - Matches AdminDashboard visual design
// - Uses shared shadcn Card / Button / Progress components
// - Preserves all existing backend/report functionality
// ============================================================

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    FolderKanban,
    ListChecks,
    RefreshCw,
    Users,
    TrendingUp,
    UserCheck,
    UserRound,
    BriefcaseBusiness,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
    getAuthorizedManagerProjects,
    getProjectDashboard,
    getProjectRisksAndIssues,
    getProjectSprints,
    getSprintProgress,
    getTeamPerformance,
    getProjectTimeline,
} from "../../services/projectReportService";

// ============================================================
// HELPERS
// ============================================================

const getAccessToken = () => {
    return (
        localStorage.getItem("aipms_access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        ""
    );
};

const getProjectId = (project) => {
    if (!project) return "";

    return (
        project.id ||
        project.projectId ||
        project.ProjectId ||
        project.projectID ||
        ""
    );
};

const getProjectName = (project) => {
    if (!project) return "Unnamed Project";

    return (
        project.name ||
        project.projectName ||
        project.title ||
        project.ProjectName ||
        "Unnamed Project"
    );
};

const getSprintId = (sprint) => {
    if (!sprint) return "";

    return (
        sprint.id ||
        sprint.sprintId ||
        sprint.SprintId ||
        sprint.sprintID ||
        ""
    );
};

const getSprintName = (sprint) => {
    if (!sprint) return "Unnamed Sprint";

    return (
        sprint.name ||
        sprint.sprintName ||
        sprint.title ||
        sprint.SprintName ||
        "Unnamed Sprint"
    );
};

const getSprintStatus = (sprint) => {
    if (!sprint) return "";

    return sprint.status || sprint.Status || "";
};

const getArrayResponse = (response, keys = []) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && Array.isArray(response.data)) {
        return response.data;
    }

    for (const key of keys) {
        if (response && Array.isArray(response[key])) {
            return response[key];
        }

        if (
            response?.data &&
            Array.isArray(response.data[key])
        ) {
            return response.data[key];
        }
    }

    return [];
};

const getValue = (
    object,
    keys,
    fallback = 0
) => {
    if (!object) return fallback;

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return fallback;
};

const formatNumber = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0";
    }

    return number.toLocaleString();
};

const formatPercentage = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0%";
    }

    return `${number.toFixed(1)}%`;
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString();
};

const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString();
};

const normalizeStatus = (status) => {
    return String(status || "")
        .trim()
        .toLowerCase();
};

const getRiskTitle = (risk) => {
    return (
        risk?.title ||
        risk?.name ||
        risk?.description ||
        risk?.Title ||
        risk?.Name ||
        risk?.Description ||
        "Untitled Risk / Issue"
    );
};

const getRiskSeverity = (risk) => {
    return (
        risk?.severity ||
        risk?.Severity ||
        risk?.priority ||
        risk?.Priority ||
        "Unknown"
    );
};

const getRiskId = (risk, index) => {
    return (
        risk?.id ||
        risk?.riskId ||
        risk?.issueId ||
        risk?.RiskId ||
        risk?.IssueId ||
        index
    );
};

// ============================================================
// TONE STYLES
// Same visual language used by AdminDashboard
// ============================================================

const toneStyles = {
    primary: {
        icon:
            "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        dot: "bg-blue-500",
        progress: "bg-blue-500",
        soft:
            "bg-blue-50/60 dark:bg-blue-500/[0.06]",
        border:
            "border-blue-200/70 dark:border-blue-500/20",
    },

    success: {
        icon:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        dot: "bg-emerald-500",
        progress: "bg-emerald-500",
        soft:
            "bg-emerald-50/60 dark:bg-emerald-500/[0.06]",
        border:
            "border-emerald-200/70 dark:border-emerald-500/20",
    },

    danger: {
        icon:
            "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
        dot: "bg-rose-500",
        progress: "bg-rose-500",
        soft:
            "bg-rose-50/60 dark:bg-rose-500/[0.06]",
        border:
            "border-rose-200/70 dark:border-rose-500/20",
    },

    warning: {
        icon:
            "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        dot: "bg-amber-500",
        progress: "bg-amber-500",
        soft:
            "bg-amber-50/60 dark:bg-amber-500/[0.06]",
        border:
            "border-amber-200/70 dark:border-amber-500/20",
    },

    info: {
        icon:
            "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
        dot: "bg-cyan-500",
        progress: "bg-cyan-500",
        soft:
            "bg-cyan-50/60 dark:bg-cyan-500/[0.06]",
        border:
            "border-cyan-200/70 dark:border-cyan-500/20",
    },
};

// ============================================================
// COMMON ADMIN DASHBOARD CARD STYLE
// ============================================================

const cardStyle =
    "border-border/70 bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300/70 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/[0.06] dark:hover:shadow-blue-500/10";

const rowStyle =
    "rounded-xl border border-transparent p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-200/70 hover:bg-blue-50/40 hover:shadow-sm dark:hover:border-blue-500/20 dark:hover:bg-blue-500/[0.05] dark:hover:shadow-blue-500/5";

// ============================================================
// STAT CARD
// Matches AdminDashboard statistics
// ============================================================

const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    tone = "primary",
}) => {
    const toneStyle =
        toneStyles[tone] || toneStyles.primary;

    return (
        <Card className={`${cardStyle} group overflow-hidden`}>
            <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                            {value}
                        </h2>

                        {description && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 transition-colors duration-300 group-hover:bg-emerald-500/15">
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                </span>

                                <span className="truncate">
                                    {description}
                                </span>
                            </div>
                        )}
                    </div>

                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneStyle.icon} transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm`}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                <div className="mt-5 h-px w-full bg-border/60 transition-colors duration-300 group-hover:bg-blue-200/60 dark:group-hover:bg-blue-500/20" />

                <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        Report details
                    </span>

                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />
                </div>
            </CardContent>
        </Card>
    );
};

// ============================================================
// SECTION HEADER
// Matches AdminDashboard section headings
// ============================================================

const SectionHeader = ({
    icon: Icon,
    title,
    description,
    tone = "primary",
}) => {
    const toneStyle =
        toneStyles[tone] || toneStyles.primary;

    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg text-foreground">
                        {title}
                    </CardTitle>

                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneStyle.icon}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </CardHeader>
    );
};

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({
    title,
    description,
    icon: Icon = FileText,
    tone = "primary",
}) => {
    const toneStyle =
        toneStyles[tone] || toneStyles.primary;

    return (
        <div className="group flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-all duration-300 hover:border-blue-200/70 hover:bg-blue-50/30 dark:hover:border-blue-500/20 dark:hover:bg-blue-500/[0.04]">
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${toneStyle.icon} transition-all duration-300 group-hover:scale-105`}
            >
                <Icon className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-semibold text-foreground">
                {title}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </div>
    );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Reports() {
    // ========================================================
    // PROJECT STATE
    // ========================================================

    const [projects, setProjects] = useState([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    // ========================================================
    // REPORT STATE
    // ========================================================

    const [dashboard, setDashboard] =
        useState(null);

    const [risks, setRisks] =
        useState([]);

    const [sprints, setSprints] =
        useState([]);

    const [selectedSprintId, setSelectedSprintId] =
        useState("");

    const [sprintProgress, setSprintProgress] =
        useState(null);

    const [teamPerformance, setTeamPerformance] =
        useState(null);

    const [timeline, setTimeline] =
        useState([]);

    // ========================================================
    // LOADING STATE
    // ========================================================

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingReport, setLoadingReport] =
        useState(false);

    const [loadingSprint, setLoadingSprint] =
        useState(false);

    const [loadingTeam, setLoadingTeam] =
        useState(false);

    // ========================================================
    // ERROR
    // ========================================================

    const [error, setError] =
        useState("");

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    const loadProjects = useCallback(
        async () => {
            try {
                setLoadingProjects(true);
                setError("");

                const token = getAccessToken();

                const response =
                    await getAuthorizedManagerProjects(
                        token
                    );

                const projectList =
                    getArrayResponse(
                        response,
                        [
                            "projects",
                            "items",
                            "data",
                        ]
                    );

                setProjects(projectList);

                if (projectList.length === 0) {
                    setSelectedProjectId("");
                    setDashboard(null);
                    setRisks([]);
                    setSprints([]);
                    setSelectedSprintId("");
                    setSprintProgress(null);
                    setTeamPerformance(null);
                    setTimeline([]);
                    return;
                }

                const existingProject =
                    projectList.find(
                        (project) =>
                            String(
                                getProjectId(project)
                            ) ===
                            String(
                                selectedProjectId
                            )
                    );

                if (!existingProject) {
                    setSelectedProjectId(
                        String(
                            getProjectId(
                                projectList[0]
                            )
                        )
                    );
                }
            } catch (err) {
                console.error(
                    "Failed to load manager projects:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load your projects."
                );
            } finally {
                setLoadingProjects(false);
            }
        },
        [selectedProjectId]
    );

    // ========================================================
    // LOAD PROJECT REPORT
    // ========================================================

    const loadReport = useCallback(
        async (projectId) => {
            if (!projectId) {
                return;
            }

            try {
                setLoadingReport(true);
                setError("");

                setDashboard(null);
                setRisks([]);
                setSprints([]);
                setSelectedSprintId("");
                setSprintProgress(null);
                setTeamPerformance(null);
                setTimeline([]);

                const token =
                    getAccessToken();

                const [
                    dashboardResponse,
                    risksResponse,
                    sprintsResponse,
                    timelineResponse,
                ] = await Promise.all([
                    getProjectDashboard(
                        projectId,
                        token
                    ),

                    getProjectRisksAndIssues(
                        projectId,
                        token
                    ),

                    getProjectSprints(
                        projectId,
                        token
                    ),

                    getProjectTimeline(
                        projectId,
                        token
                    ),
                ]);

                const dashboardData =
                    dashboardResponse?.data ??
                    dashboardResponse;

                setDashboard(
                    dashboardData || null
                );

                setRisks(
                    getArrayResponse(
                        risksResponse,
                        [
                            "risks",
                            "issues",
                            "items",
                            "data",
                        ]
                    )
                );

                const sprintList =
                    getArrayResponse(
                        sprintsResponse,
                        [
                            "sprints",
                            "items",
                            "data",
                        ]
                    );

                setSprints(sprintList);

                setTimeline(
                    getArrayResponse(
                        timelineResponse,
                        [
                            "timeline",
                            "items",
                            "events",
                            "data",
                        ]
                    )
                );

                const teamId =
                    dashboardData?.TeamId ||
                    dashboardData?.teamId;

                if (teamId) {
                    try {
                        setLoadingTeam(true);

                        const teamResponse =
                            await getTeamPerformance(
                                teamId,
                                token
                            );

                        const teamData =
                            teamResponse?.data ??
                            teamResponse;

                        setTeamPerformance(
                            teamData || null
                        );
                    } catch (teamError) {
                        console.error(
                            "Failed to load team performance:",
                            teamError
                        );

                        setTeamPerformance(null);
                    } finally {
                        setLoadingTeam(false);
                    }
                }
            } catch (err) {
                console.error(
                    "Failed to load project report:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load the project report."
                );
            } finally {
                setLoadingReport(false);
            }
        },
        []
    );

    // ========================================================
    // LOAD SPRINT PROGRESS
    // ========================================================

    const loadSprintProgress = useCallback(
        async (
            sprintId,
            projectId = selectedProjectId
        ) => {
            if (!sprintId || !projectId) {
                setSprintProgress(null);
                return;
            }

            try {
                setLoadingSprint(true);
                setError("");

                const token =
                    getAccessToken();

                const response =
                    await getSprintProgress(
                        projectId,
                        sprintId,
                        token
                    );

                setSprintProgress(
                    response?.data ??
                    response ??
                    null
                );
            } catch (err) {
                console.error(
                    "Failed to load sprint progress:",
                    err
                );

                setSprintProgress(null);

                setError(
                    err?.message ||
                    "Unable to load sprint progress."
                );
            } finally {
                setLoadingSprint(false);
            }
        },
        [selectedProjectId]
    );

    // ========================================================
    // INITIAL PROJECT LOAD
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    // ========================================================
    // PROJECT REPORT LOAD
    // ========================================================

    useEffect(() => {
        if (selectedProjectId) {
            loadReport(
                selectedProjectId
            );
        }
    }, [
        selectedProjectId,
        loadReport,
    ]);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject =
        useMemo(() => {
            return projects.find(
                (project) =>
                    String(
                        getProjectId(project)
                    ) ===
                    String(
                        selectedProjectId
                    )
            );
        }, [
            projects,
            selectedProjectId,
        ]);

    // ========================================================
    // DASHBOARD METRICS
    // ========================================================

    const totalTasks =
        Number(
            getValue(
                dashboard,
                [
                    "TotalTasks",
                    "totalTasks",
                    "taskCount",
                    "tasks",
                ],
                0
            )
        );

    const completedTasks =
        Number(
            getValue(
                dashboard,
                [
                    "CompletedTasks",
                    "completedTasks",
                    "completedTaskCount",
                ],
                0
            )
        );

    const remainingTasks =
        Number(
            getValue(
                dashboard,
                [
                    "RemainingTasks",
                    "remainingTasks",
                    "pendingTasks",
                ],
                Math.max(
                    totalTasks -
                    completedTasks,
                    0
                )
            )
        );

    const activeSprints =
        sprints.filter(
            (sprint) => {
                const status =
                    normalizeStatus(
                        getSprintStatus(
                            sprint
                        )
                    );

                return (
                    status === "active" ||
                    status === "in progress" ||
                    status === "inprogress"
                );
            }
        ).length;

    const dashboardTeamMembers =
        Number(
            getValue(
                dashboard,
                [
                    "TeamMemberCount",
                    "teamMemberCount",
                    "memberCount",
                    "totalMembers",
                ],
                0
            )
        );

    const completionRate =
        totalTasks > 0
            ? (completedTasks /
                totalTasks) *
              100
            : Number(
                dashboard?.OverallProjectProgress ??
                dashboard?.overallProjectProgress ??
                0
            );

    // ========================================================
    // TEAM PERFORMANCE METRICS
    // ========================================================

    const teamCompletionRate =
        Number(
            teamPerformance?.CompletionRate ??
            teamPerformance?.completionRate ??
            dashboard?.TeamProgressPercentage ??
            dashboard?.teamProgressPercentage ??
            0
        );

    const teamTotalTasks =
        Number(
            teamPerformance?.TotalTasks ??
            teamPerformance?.totalTasks ??
            0
        );

    const teamCompletedTasks =
        Number(
            teamPerformance?.CompletedTasks ??
            teamPerformance?.completedTasks ??
            0
        );

    const teamDelayedTasks =
        Number(
            teamPerformance?.DelayedTasks ??
            teamPerformance?.delayedTasks ??
            0
        );

    const teamBlockedTasks =
        Number(
            teamPerformance?.BlockedTasks ??
            teamPerformance?.blockedTasks ??
            0
        );

    const teamEstimatedHours =
        Number(
            teamPerformance?.TotalEstimatedHours ??
            teamPerformance?.totalEstimatedHours ??
            0
        );

    const teamActualHours =
        Number(
            teamPerformance?.TotalActualHours ??
            teamPerformance?.totalActualHours ??
            0
        );

    const teamWorkload =
        Number(
            teamPerformance?.WorkloadPercentage ??
            teamPerformance?.workloadPercentage ??
            0
        );

    const teamName =
        teamPerformance?.TeamName ||
        teamPerformance?.teamName ||
        dashboard?.TeamName ||
        dashboard?.teamName ||
        "No team assigned";

    const teamLeaders =
        getArrayResponse(
            teamPerformance,
            [
                "TeamLeaders",
                "teamLeaders",
            ]
        );

    const contributors =
        getArrayResponse(
            teamPerformance,
            [
                "Contributors",
                "contributors",
            ]
        );

    const taskDistribution =
        getArrayResponse(
            teamPerformance,
            [
                "TaskDistribution",
                "taskDistribution",
            ]
        );

    // ========================================================
    // ACTIVE SPRINT
    // ========================================================

    const activeSprint =
        useMemo(() => {
            return sprints.find(
                (sprint) => {
                    const status =
                        normalizeStatus(
                            getSprintStatus(
                                sprint
                            )
                        );

                    return (
                        status === "active" ||
                        status === "in progress" ||
                        status === "inprogress"
                    );
                }
            );
        }, [sprints]);

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

        setSelectedSprintId("");
        setSprintProgress(null);
    };

    // ========================================================
    // SPRINT CHANGE
    // ========================================================

    const handleSprintChange = (
        event
    ) => {
        const sprintId =
            event.target.value;

        setSelectedSprintId(
            sprintId
        );

        if (sprintId) {
            loadSprintProgress(
                sprintId,
                selectedProjectId
            );
        } else {
            setSprintProgress(null);
        }
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        await loadProjects();

        if (selectedProjectId) {
            await loadReport(
                selectedProjectId
            );
        }
    };

    // ========================================================
    // LOADING PROJECTS
    // ========================================================

    if (loadingProjects) {
        return (
            <div className="relative min-h-full overflow-hidden bg-background text-foreground">
                <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl dark:bg-blue-400/[0.05]" />

                <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-cyan-500/[0.025] blur-3xl dark:bg-cyan-400/[0.03]" />

                <div className="relative flex min-h-[500px] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <RefreshCw className="h-7 w-7 animate-spin" />
                        </div>

                        <p className="mt-4 font-semibold text-foreground">
                            Loading your reports
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Loading your projects...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="relative min-h-full overflow-hidden bg-background text-foreground">
            {/* =====================================================
                BACKGROUND DECORATIONS
            ===================================================== */}

            <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl dark:bg-blue-400/[0.05]" />

            <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-cyan-500/[0.025] blur-3xl dark:bg-cyan-400/[0.03]" />

            <div className="relative space-y-7">

                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors duration-300 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/[0.15]">
                            <Sparkles className="h-3.5 w-3.5" />

                            Manager Reporting
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Reports
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                            Monitor project, sprint, team performance,
                            risks, and delivery progress from one place.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={handleRefresh}
                        disabled={
                            loadingProjects ||
                            loadingReport
                        }
                        className="w-fit gap-2 rounded-xl bg-blue-600 px-5 text-white shadow-sm shadow-blue-600/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 dark:bg-blue-500 dark:hover:bg-blue-600 dark:hover:shadow-blue-500/20"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                loadingProjects ||
                                loadingReport
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh

                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </section>

                {/* =================================================
                    PROJECT SELECTOR
                ================================================= */}

                <Card className={cardStyle}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg text-foreground">
                                    Project Selection
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Select the project you want to analyze.
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <FolderKanban className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex-1">
                                <label
                                    htmlFor="project-select"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Select Project
                                </label>

                                <select
                                    id="project-select"
                                    value={
                                        selectedProjectId
                                    }
                                    onChange={
                                        handleProjectChange
                                    }
                                    className="w-full max-w-xl rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                >
                                    {projects.map(
                                        (project) => (
                                            <option
                                                key={String(
                                                    getProjectId(
                                                        project
                                                    )
                                                )}
                                                value={String(
                                                    getProjectId(
                                                        project
                                                    )
                                                )}
                                            >
                                                {getProjectName(
                                                    project
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {selectedProject && (
                                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground">
                                    <FolderKanban className="h-4 w-4 shrink-0 text-blue-500" />

                                    <span>
                                        Project ID:
                                    </span>

                                    <span className="font-medium text-foreground">
                                        {String(
                                            getProjectId(
                                                selectedProject
                                            )
                                        ).slice(
                                            0,
                                            8
                                        )}
                                        ...
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="group flex flex-col gap-4 rounded-xl border border-rose-200/70 bg-rose-50/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100/60 hover:shadow-md dark:border-rose-500/20 dark:bg-rose-500/[0.06] sm:flex-row sm:items-start">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                            <AlertTriangle className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="font-semibold text-foreground">
                                Unable to load report
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* =================================================
                    NO PROJECTS
                ================================================= */}

                {projects.length === 0 && (
                    <Card className={cardStyle}>
                        <CardContent className="p-5 sm:p-6">
                            <EmptyState
                                title="No projects assigned"
                                description="There are currently no projects assigned to your manager account."
                                icon={FolderKanban}
                                tone="primary"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* =================================================
                    REPORT LOADING
                ================================================= */}

                {selectedProjectId &&
                    loadingReport && (
                        <Card className={cardStyle}>
                            <CardContent className="p-5 sm:p-6">
                                <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                        <RefreshCw className="h-7 w-7 animate-spin" />
                                    </div>

                                    <p className="mt-4 font-semibold text-foreground">
                                        Loading project report
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Please wait while the report data is loaded.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {selectedProjectId &&
                    !loadingReport &&
                    dashboard && (
                        <>
                            {/* =============================================
                                PROJECT STATISTICS
                            ============================================= */}

                            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard
                                    title="Total Tasks"
                                    value={formatNumber(
                                        totalTasks
                                    )}
                                    description="Tasks in this project"
                                    icon={ListChecks}
                                    tone="primary"
                                />

                                <StatCard
                                    title="Completed Tasks"
                                    value={formatNumber(
                                        completedTasks
                                    )}
                                    description={`${formatPercentage(
                                        completionRate
                                    )} project completion`}
                                    icon={CheckCircle2}
                                    tone="success"
                                />

                                <StatCard
                                    title="Active Sprints"
                                    value={formatNumber(
                                        activeSprints
                                    )}
                                    description={
                                        activeSprint
                                            ? getSprintName(
                                                activeSprint
                                            )
                                            : "No active sprint"
                                    }
                                    icon={Clock3}
                                    tone="info"
                                />

                                <StatCard
                                    title="Risks & Issues"
                                    value={formatNumber(
                                        risks.length
                                    )}
                                    description="Reported project concerns"
                                    icon={AlertTriangle}
                                    tone="danger"
                                />
                            </section>

                            {/* =============================================
                                PROJECT OVERVIEW + TEAM
                            ============================================= */}

                            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                                {/* PROJECT OVERVIEW */}

                                <Card
                                    className={`${cardStyle} xl:col-span-2`}
                                >
                                    <SectionHeader
                                        icon={TrendingUp}
                                        title="Project Overview"
                                        description="Current progress based on actual project tasks."
                                        tone="primary"
                                    />

                                    <CardContent>
                                        <div className="flex items-end justify-between gap-4">
                                            <div>
                                                <p className="text-3xl font-bold text-foreground">
                                                    {formatPercentage(
                                                        completionRate
                                                    )}
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Overall project progress
                                                </p>
                                            </div>

                                            <div className="text-right text-sm text-muted-foreground">
                                                <p>
                                                    <span className="font-semibold text-foreground">
                                                        {formatNumber(
                                                            completedTasks
                                                        )}
                                                    </span>{" "}
                                                    completed
                                                </p>

                                                <p className="mt-1">
                                                    <span className="font-semibold text-foreground">
                                                        {formatNumber(
                                                            remainingTasks
                                                        )}
                                                    </span>{" "}
                                                    remaining
                                                </p>
                                            </div>
                                        </div>

                                        <Progress
                                            value={Math.min(
                                                Math.max(
                                                    completionRate,
                                                    0
                                                ),
                                                100
                                            )}
                                            className="mt-5 h-2.5"
                                        />

                                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            {[
                                                {
                                                    label: "To Do",
                                                    value:
                                                        dashboard?.TodoTasks ??
                                                        dashboard?.todoTasks ??
                                                        0,
                                                    tone: "primary",
                                                },
                                                {
                                                    label: "In Progress",
                                                    value:
                                                        dashboard?.InProgressTasks ??
                                                        dashboard?.inProgressTasks ??
                                                        0,
                                                    tone: "info",
                                                },
                                                {
                                                    label: "In Review",
                                                    value:
                                                        dashboard?.InReviewTasks ??
                                                        dashboard?.inReviewTasks ??
                                                        0,
                                                    tone: "warning",
                                                },
                                                {
                                                    label: "Blocked",
                                                    value:
                                                        dashboard?.BlockedTasks ??
                                                        dashboard?.blockedTasks ??
                                                        0,
                                                    tone: "danger",
                                                },
                                            ].map(
                                                (item) => {
                                                    const tone =
                                                        toneStyles[
                                                            item.tone
                                                        ];

                                                    return (
                                                        <div
                                                            key={
                                                                item.label
                                                            }
                                                            className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ${tone.border} ${tone.soft}`}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        item.label
                                                                    }
                                                                </p>

                                                                <span
                                                                    className={`h-2.5 w-2.5 rounded-full ${tone.dot}`}
                                                                />
                                                            </div>

                                                            <p className="mt-2 text-xl font-bold text-foreground">
                                                                {formatNumber(
                                                                    item.value
                                                                )}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* TEAM SUMMARY */}

                                <Card className={cardStyle}>
                                    <SectionHeader
                                        icon={Users}
                                        title="Team"
                                        description="Team assigned to this project."
                                        tone="info"
                                    />

                                    <CardContent>
                                        <div className="rounded-xl border border-cyan-200/70 bg-cyan-50/50 p-5 dark:border-cyan-500/20 dark:bg-cyan-500/[0.06]">
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Team Name
                                            </p>

                                            <p className="mt-2 text-lg font-semibold text-foreground">
                                                {teamName}
                                            </p>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/30">
                                                <p className="text-xs text-muted-foreground">
                                                    Members
                                                </p>

                                                <p className="mt-1 text-xl font-bold text-foreground">
                                                    {formatNumber(
                                                        dashboardTeamMembers
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/30">
                                                <p className="text-xs text-muted-foreground">
                                                    Team Progress
                                                </p>

                                                <p className="mt-1 text-xl font-bold text-foreground">
                                                    {formatPercentage(
                                                        dashboard?.TeamProgressPercentage ??
                                                        dashboard?.teamProgressPercentage ??
                                                        0
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-sm text-muted-foreground">
                                                    Assigned work
                                                </span>

                                                <span className="font-semibold text-foreground">
                                                    {formatNumber(
                                                        dashboard?.TeamAssignedWorkItems ??
                                                        dashboard?.teamAssignedWorkItems ??
                                                        0
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-sm text-muted-foreground">
                                                    Developers
                                                </span>

                                                <span className="font-semibold text-foreground">
                                                    {formatNumber(
                                                        dashboard?.TeamDeveloperCount ??
                                                        dashboard?.teamDeveloperCount ??
                                                        0
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-sm text-muted-foreground">
                                                    Staff
                                                </span>

                                                <span className="font-semibold text-foreground">
                                                    {formatNumber(
                                                        dashboard?.TeamStaffCount ??
                                                        dashboard?.teamStaffCount ??
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* =============================================
                                TEAM PERFORMANCE
                            ============================================= */}

                            <Card className={cardStyle}>
                                <SectionHeader
                                    icon={Users}
                                    title="Team Performance"
                                    description={`Performance report for ${teamName}.`}
                                    tone="info"
                                />

                                <CardContent>
                                    {loadingTeam ? (
                                        <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                                                <RefreshCw className="h-7 w-7 animate-spin" />
                                            </div>

                                            <p className="mt-4 font-semibold text-foreground">
                                                Loading team performance
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Calculating team performance data...
                                            </p>
                                        </div>
                                    ) : teamPerformance ? (
                                        <>
                                            {/* TEAM STATISTICS */}

                                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                                                <StatCard
                                                    title="Completion Rate"
                                                    value={formatPercentage(
                                                        teamCompletionRate
                                                    )}
                                                    description="Team task completion"
                                                    icon={CheckCircle2}
                                                    tone="success"
                                                />

                                                <StatCard
                                                    title="Total Tasks"
                                                    value={formatNumber(
                                                        teamTotalTasks
                                                    )}
                                                    description="Team assigned tasks"
                                                    icon={ListChecks}
                                                    tone="primary"
                                                />

                                                <StatCard
                                                    title="Completed"
                                                    value={formatNumber(
                                                        teamCompletedTasks
                                                    )}
                                                    description="Completed team tasks"
                                                    icon={CheckCircle2}
                                                    tone="success"
                                                />

                                                <StatCard
                                                    title="Delayed"
                                                    value={formatNumber(
                                                        teamDelayedTasks
                                                    )}
                                                    description="Delayed tasks"
                                                    icon={Clock3}
                                                    tone="warning"
                                                />

                                                <StatCard
                                                    title="Blocked"
                                                    value={formatNumber(
                                                        teamBlockedTasks
                                                    )}
                                                    description="Blocked tasks"
                                                    icon={AlertTriangle}
                                                    tone="danger"
                                                />
                                            </div>

                                            {/* HOURS + WORKLOAD */}

                                            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                                {[
                                                    {
                                                        title: "Estimated Hours",
                                                        value: teamEstimatedHours,
                                                        tone: "primary",
                                                    },
                                                    {
                                                        title: "Actual Hours",
                                                        value: teamActualHours,
                                                        tone: "info",
                                                    },
                                                    {
                                                        title: "Workload",
                                                        value: formatPercentage(
                                                            teamWorkload
                                                        ),
                                                        tone: "warning",
                                                    },
                                                ].map(
                                                    (
                                                        item
                                                    ) => {
                                                        const tone =
                                                            toneStyles[
                                                                item.tone
                                                            ];

                                                        return (
                                                            <div
                                                                key={
                                                                    item.title
                                                                }
                                                                className={`rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${tone.border} ${tone.soft}`}
                                                            >
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        item.title
                                                                    }
                                                                </p>

                                                                <p className="mt-2 text-2xl font-bold text-foreground">
                                                                    {typeof item.value ===
                                                                    "number"
                                                                        ? formatNumber(
                                                                            item.value
                                                                        )
                                                                        : item.value}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            {/* TEAM LEADERS */}

                                            <div className="mt-8">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div>
                                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                                            <UserCheck className="h-5 w-5 text-blue-500" />

                                                            Team Leaders
                                                        </h3>

                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Team leader task performance.
                                                        </p>
                                                    </div>

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                        <UserCheck className="h-5 w-5" />
                                                    </div>
                                                </div>

                                                {teamLeaders.length > 0 ? (
                                                    <div className="overflow-x-auto rounded-xl border border-border">
                                                        <table className="min-w-full divide-y divide-border text-sm">
                                                            <thead className="bg-muted/50">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Name
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Assigned
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Completed
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Delayed
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Completion
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Workload
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="divide-y divide-border bg-card">
                                                                {teamLeaders.map(
                                                                    (
                                                                        member,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                member?.UserId ||
                                                                                member?.userId ||
                                                                                index
                                                                            }
                                                                            className="transition-all duration-300 hover:bg-blue-50/40 dark:hover:bg-blue-500/[0.05]"
                                                                        >
                                                                            <td className="px-4 py-3 font-medium text-foreground">
                                                                                {member?.UserName ||
                                                                                    member?.userName ||
                                                                                    "Unknown"}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatNumber(
                                                                                    member?.AssignedTasks ??
                                                                                    member?.assignedTasks ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatNumber(
                                                                                    member?.CompletedTasks ??
                                                                                    member?.completedTasks ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatNumber(
                                                                                    member?.DelayedTasks ??
                                                                                    member?.delayedTasks ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 font-semibold text-foreground">
                                                                                {formatPercentage(
                                                                                    member?.CompletionRate ??
                                                                                    member?.completionRate ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatPercentage(
                                                                                    member?.WorkloadPercentage ??
                                                                                    member?.workloadPercentage ??
                                                                                    0
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <EmptyState
                                                        title="No team leaders"
                                                        description="No team leader performance records were returned for this team."
                                                        icon={UserCheck}
                                                        tone="primary"
                                                    />
                                                )}
                                            </div>

                                            {/* CONTRIBUTORS */}

                                            <div className="mt-8">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div>
                                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                                            <UserRound className="h-5 w-5 text-emerald-500" />

                                                            Contributors
                                                        </h3>

                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Developer and staff performance.
                                                        </p>
                                                    </div>

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                        <UserRound className="h-5 w-5" />
                                                    </div>
                                                </div>

                                                {contributors.length > 0 ? (
                                                    <div className="overflow-x-auto rounded-xl border border-border">
                                                        <table className="min-w-full divide-y divide-border text-sm">
                                                            <thead className="bg-muted/50">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Name
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Type
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Assigned
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Completed
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Delayed
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Blocked
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Completion
                                                                    </th>

                                                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                                        Workload
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="divide-y divide-border bg-card">
                                                                {contributors.map(
                                                                    (
                                                                        member,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                member?.UserId ||
                                                                                member?.userId ||
                                                                                index
                                                                            }
                                                                            className="transition-all duration-300 hover:bg-blue-50/40 dark:hover:bg-blue-500/[0.05]"
                                                                        >
                                                                            <td className="px-4 py-3 font-medium text-foreground">
                                                                                {member?.UserName ||
                                                                                    member?.userName ||
                                                                                    "Unknown"}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {member?.ContributorType ||
                                                                                    member?.contributorType ||
                                                                                    "—"}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatNumber(
                                                                                    member?.AssignedTasks ??
                                                                                    member?.assignedTasks ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatNumber(
                                                                                    member?.CompletedTasks ??
                                                                                    member?.completedTasks ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatNumber(
                                                                                    member?.DelayedTasks ??
                                                                                    member?.delayedTasks ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatNumber(
                                                                                    member?.BlockedTasks ??
                                                                                    member?.blockedTasks ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 font-semibold text-foreground">
                                                                                {formatPercentage(
                                                                                    member?.CompletionRate ??
                                                                                    member?.completionRate ??
                                                                                    0
                                                                                )}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                                {formatPercentage(
                                                                                    member?.WorkloadPercentage ??
                                                                                    member?.workloadPercentage ??
                                                                                    0
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <EmptyState
                                                        title="No contributors"
                                                        description="No contributor performance records were returned for this team."
                                                        icon={UserRound}
                                                        tone="success"
                                                    />
                                                )}
                                            </div>

                                            {/* TASK DISTRIBUTION */}

                                            {taskDistribution.length >
                                                0 && (
                                                <div className="mt-8">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div>
                                                            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                                                <BriefcaseBusiness className="h-5 w-5 text-cyan-500" />

                                                                Task Distribution
                                                            </h3>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                Distribution of team work by status.
                                                            </p>
                                                        </div>

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                                                            <BriefcaseBusiness className="h-5 w-5" />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                                        {taskDistribution.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => {
                                                                const name =
                                                                    item?.Status ||
                                                                    item?.status ||
                                                                    item?.Name ||
                                                                    item?.name ||
                                                                    item?.Label ||
                                                                    item?.label ||
                                                                    `Status ${index + 1}`;

                                                                const count =
                                                                    item?.Count ??
                                                                    item?.count ??
                                                                    item?.Total ??
                                                                    item?.total ??
                                                                    0;

                                                                return (
                                                                    <div
                                                                        key={`${name}-${index}`}
                                                                        className={`${rowStyle} border-border bg-card`}
                                                                    >
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            {
                                                                                name
                                                                            }
                                                                        </p>

                                                                        <p className="mt-2 text-2xl font-bold text-foreground">
                                                                            {formatNumber(
                                                                                count
                                                                            )}
                                                                        </p>

                                                                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                                                                            <div
                                                                                className="h-full rounded-full bg-cyan-500 transition-all duration-700"
                                                                                style={{
                                                                                    width: `${Math.min(
                                                                                        Number(
                                                                                            count
                                                                                        ) >
                                                                                            0
                                                                                            ? 100
                                                                                            : 0,
                                                                                        100
                                                                                    )}%`,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <EmptyState
                                            title="Team performance unavailable"
                                            description={
                                                dashboard?.TeamId ||
                                                dashboard?.teamId
                                                    ? "The project has a team, but the team performance report could not be loaded."
                                                    : "No team is currently assigned to this project."
                                            }
                                            icon={Users}
                                            tone="info"
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* =============================================
                                SPRINT PROGRESS
                            ============================================= */}

                            <Card className={cardStyle}>
                                <SectionHeader
                                    icon={CalendarDays}
                                    title="Sprint Progress"
                                    description="Select a sprint to view its current progress."
                                    tone="primary"
                                />

                                <CardContent>
                                    <div className="max-w-xl">
                                        <label
                                            htmlFor="sprint-select"
                                            className="mb-2 block text-sm font-medium text-foreground"
                                        >
                                            Sprint
                                        </label>

                                        <select
                                            id="sprint-select"
                                            value={
                                                selectedSprintId
                                            }
                                            onChange={
                                                handleSprintChange
                                            }
                                            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="">
                                                Select a sprint
                                            </option>

                                            {sprints.map(
                                                (
                                                    sprint
                                                ) => (
                                                    <option
                                                        key={String(
                                                            getSprintId(
                                                                sprint
                                                            )
                                                        )}
                                                        value={String(
                                                            getSprintId(
                                                                sprint
                                                            )
                                                        )}
                                                    >
                                                        {getSprintName(
                                                            sprint
                                                        )}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {loadingSprint && (
                                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-200/70 bg-blue-50/50 p-4 text-sm text-muted-foreground dark:border-blue-500/20 dark:bg-blue-500/[0.06]">
                                            <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />

                                            Loading sprint progress...
                                        </div>
                                    )}

                                    {!loadingSprint &&
                                        sprintProgress && (
                                            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                                <StatCard
                                                    title="Total Tasks"
                                                    value={formatNumber(
                                                        sprintProgress?.TotalTasks ??
                                                        sprintProgress?.totalTasks ??
                                                        sprintProgress?.TaskCount ??
                                                        sprintProgress?.taskCount ??
                                                        0
                                                    )}
                                                    description="Tasks in sprint"
                                                    icon={ListChecks}
                                                    tone="primary"
                                                />

                                                <StatCard
                                                    title="Completed"
                                                    value={formatNumber(
                                                        sprintProgress?.CompletedTasks ??
                                                        sprintProgress?.completedTasks ??
                                                        0
                                                    )}
                                                    description="Completed sprint tasks"
                                                    icon={CheckCircle2}
                                                    tone="success"
                                                />

                                                <StatCard
                                                    title="Remaining"
                                                    value={formatNumber(
                                                        sprintProgress?.RemainingTasks ??
                                                        sprintProgress?.remainingTasks ??
                                                        0
                                                    )}
                                                    description="Tasks remaining"
                                                    icon={Clock3}
                                                    tone="warning"
                                                />

                                                <StatCard
                                                    title="Progress"
                                                    value={formatPercentage(
                                                        sprintProgress?.ProgressPercentage ??
                                                        sprintProgress?.progressPercentage ??
                                                        sprintProgress?.CompletionRate ??
                                                        sprintProgress?.completionRate ??
                                                        0
                                                    )}
                                                    description="Sprint completion"
                                                    icon={TrendingUp}
                                                    tone="info"
                                                />
                                            </div>
                                        )}

                                    {!loadingSprint &&
                                        selectedSprintId &&
                                        !sprintProgress && (
                                            <div className="mt-6">
                                                <EmptyState
                                                    title="Sprint progress unavailable"
                                                    description="No progress information was returned for the selected sprint."
                                                    icon={CalendarDays}
                                                    tone="warning"
                                                />
                                            </div>
                                        )}
                                </CardContent>
                            </Card>

                            {/* =============================================
                                RISKS & ISSUES
                            ============================================= */}

                            <Card className={cardStyle}>
                                <SectionHeader
                                    icon={AlertTriangle}
                                    title="Risks & Issues"
                                    description="Current risks and issues reported for this project."
                                    tone="danger"
                                />

                                <CardContent>
                                    {risks.length > 0 ? (
                                        <div className="space-y-3">
                                            {risks.map(
                                                (
                                                    risk,
                                                    index
                                                ) => (
                                                    <div
                                                        key={String(
                                                            getRiskId(
                                                                risk,
                                                                index
                                                            )
                                                        )}
                                                        className="group flex flex-col gap-4 rounded-xl border border-rose-200/70 bg-rose-50/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50/70 hover:shadow-sm dark:border-rose-500/20 dark:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.08] sm:flex-row sm:items-center sm:justify-between"
                                                    >
                                                        <div className="flex min-w-0 items-start gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                                                <AlertTriangle className="h-5 w-5" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-foreground">
                                                                    {getRiskTitle(
                                                                        risk
                                                                    )}
                                                                </p>

                                                                {risk?.description &&
                                                                    risk.description !==
                                                                        getRiskTitle(
                                                                            risk
                                                                        ) && (
                                                                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                                                            {
                                                                                risk.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        <span className="inline-flex w-fit shrink-0 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                                                            {getRiskSeverity(
                                                                risk
                                                            )}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            title="No risks or issues"
                                            description="No risks or issues were returned for this project."
                                            icon={CheckCircle2}
                                            tone="success"
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* =============================================
                                PROJECT SPRINTS
                            ============================================= */}

                            <Card className={cardStyle}>
                                <SectionHeader
                                    icon={CalendarDays}
                                    title="Project Sprints"
                                    description="All sprints associated with the selected project."
                                    tone="primary"
                                />

                                <CardContent>
                                    {sprints.length > 0 ? (
                                        <div className="overflow-x-auto rounded-xl border border-border">
                                            <table className="min-w-full divide-y divide-border text-sm">
                                                <thead className="bg-muted/50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                            Sprint
                                                        </th>

                                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                            Status
                                                        </th>

                                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                            Start
                                                        </th>

                                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                            End
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-border bg-card">
                                                    {sprints.map(
                                                        (
                                                            sprint,
                                                            index
                                                        ) => {
                                                            const status =
                                                                normalizeStatus(
                                                                    getSprintStatus(
                                                                        sprint
                                                                    )
                                                                );

                                                            let statusTone =
                                                                "primary";

                                                            if (
                                                                status ===
                                                                    "completed" ||
                                                                status ===
                                                                    "complete"
                                                            ) {
                                                                statusTone =
                                                                    "success";
                                                            } else if (
                                                                status ===
                                                                    "active" ||
                                                                status ===
                                                                    "in progress" ||
                                                                status ===
                                                                    "inprogress"
                                                            ) {
                                                                statusTone =
                                                                    "info";
                                                            } else if (
                                                                status ===
                                                                    "blocked"
                                                            ) {
                                                                statusTone =
                                                                    "danger";
                                                            } else if (
                                                                status ===
                                                                    "planning"
                                                            ) {
                                                                statusTone =
                                                                    "warning";
                                                            }

                                                            const tone =
                                                                toneStyles[
                                                                    statusTone
                                                                ];

                                                            return (
                                                                <tr
                                                                    key={
                                                                        String(
                                                                            getSprintId(
                                                                                sprint
                                                                            )
                                                                        ) ||
                                                                        index
                                                                    }
                                                                    className="transition-all duration-300 hover:bg-blue-50/40 dark:hover:bg-blue-500/[0.05]"
                                                                >
                                                                    <td className="px-4 py-4 font-semibold text-foreground">
                                                                        {getSprintName(
                                                                            sprint
                                                                        )}
                                                                    </td>

                                                                    <td className="px-4 py-4">
                                                                        <span
                                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone.icon}`}
                                                                        >
                                                                            {getSprintStatus(
                                                                                sprint
                                                                            ) ||
                                                                                "Unknown"}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-4 py-4 text-muted-foreground">
                                                                        {formatDate(
                                                                            sprint?.startDate ||
                                                                            sprint?.StartDate
                                                                        )}
                                                                    </td>

                                                                    <td className="px-4 py-4 text-muted-foreground">
                                                                        {formatDate(
                                                                            sprint?.endDate ||
                                                                            sprint?.EndDate
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <EmptyState
                                            title="No sprints"
                                            description="No sprints have been created for this project."
                                            icon={CalendarDays}
                                            tone="primary"
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* =============================================
                                TIMELINE
                            ============================================= */}

                            <Card className={cardStyle}>
                                <SectionHeader
                                    icon={Clock3}
                                    title="Project Timeline"
                                    description="Timeline information returned by the project reporting API."
                                    tone="info"
                                />

                                <CardContent>
                                    {timeline.length > 0 ? (
                                        <div className="space-y-2">
                                            {timeline.map(
                                                (
                                                    item,
                                                    index
                                                ) => {
                                                    const title =
                                                        item?.title ||
                                                        item?.name ||
                                                        item?.eventName ||
                                                        item?.Name ||
                                                        item?.Title ||
                                                        "Timeline Event";

                                                    const description =
                                                        item?.description ||
                                                        item?.Description ||
                                                        "";

                                                    const date =
                                                        item?.date ||
                                                        item?.createdAt ||
                                                        item?.startDate ||
                                                        item?.Date ||
                                                        item?.CreatedAt ||
                                                        item?.StartDate;

                                                    return (
                                                        <div
                                                            key={
                                                                item?.id ||
                                                                item?.Id ||
                                                                index
                                                            }
                                                            className="group flex gap-4 rounded-xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200/70 hover:bg-blue-50/40 hover:shadow-sm dark:hover:border-blue-500/20 dark:hover:bg-blue-500/[0.05]"
                                                        >
                                                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                                                                <Clock3 className="h-5 w-5" />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                                    <p className="font-semibold text-foreground">
                                                                        {title}
                                                                    </p>

                                                                    <p className="text-xs text-muted-foreground">
                                                                        {formatDateTime(
                                                                            date
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                {description && (
                                                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                                                        {
                                                                            description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <ArrowUpRight className="mt-1 hidden h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500 sm:block" />
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            title="No timeline data"
                                            description="No timeline events were returned for this project."
                                            icon={Clock3}
                                            tone="info"
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
            </div>
        </div>
    );
}