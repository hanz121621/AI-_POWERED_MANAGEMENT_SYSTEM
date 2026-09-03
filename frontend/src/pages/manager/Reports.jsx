
// ============================================================
// AIPMS - MANAGER REPORTS
// src/pages/manager/Reports.jsx
//
// Manager Project Reporting Dashboard
// Connected to ASP.NET Core backend APIs.
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
} from "lucide-react";

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

    return (
        sprint.status ||
        sprint.Status ||
        ""
    );
};

const getArrayResponse = (
    response,
    keys = []
) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (
        response &&
        Array.isArray(response.data)
    ) {
        return response.data;
    }

    for (const key of keys) {
        if (
            response &&
            Array.isArray(response[key])
        ) {
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
// SMALL UI COMPONENTS
// ============================================================

const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
}) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <div className="rounded-lg bg-slate-100 p-2.5">
                    <Icon className="h-5 w-5 text-slate-700" />
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({
    icon: Icon,
    title,
    description,
}) => {
    return (
        <div className="mb-5 flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
                <Icon className="h-5 w-5 text-slate-700" />
            </div>

            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({
    title,
    description,
}) => {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />

            <h3 className="mt-3 text-sm font-semibold text-slate-800">
                {title}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
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

                // ------------------------------------------------
                // Load core project reports.
                // ------------------------------------------------

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

                // ------------------------------------------------
                // TEAM PERFORMANCE
                //
                // ProjectDashboardDto already provides TeamId.
                // ------------------------------------------------

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

                        // Team report should not
                        // prevent the rest of
                        // the project report
                        // from displaying.
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
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-slate-500" />

                            <p className="mt-3 text-sm text-slate-500">
                                Loading your projects...
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
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl space-y-6 p-6">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <BarChart3 className="h-6 w-6 text-slate-700" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Reports
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitor project, sprint, and team performance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={
                            loadingProjects ||
                            loadingReport
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    </button>
                </div>

                {/* =================================================
                    PROJECT SELECTOR
                ================================================= */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex-1">
                            <label
                                htmlFor="project-select"
                                className="mb-2 block text-sm font-medium text-slate-700"
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
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 lg:max-w-xl"
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
                            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                                <FolderKanban className="h-4 w-4" />

                                <span>
                                    Project ID:
                                </span>

                                <span className="font-medium text-slate-800">
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
                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="font-medium">
                                Unable to load report
                            </p>

                            <p className="mt-1 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* =================================================
                    NO PROJECTS
                ================================================= */}

                {projects.length === 0 && (
                    <EmptyState
                        title="No projects assigned"
                        description="There are currently no projects assigned to your manager account."
                    />
                )}

                {/* =================================================
                    REPORT CONTENT
                ================================================= */}

                {selectedProjectId &&
                    loadingReport && (
                        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-slate-400" />

                            <p className="mt-3 text-sm text-slate-500">
                                Loading project report...
                            </p>
                        </div>
                    )}

                {selectedProjectId &&
                    !loadingReport &&
                    dashboard && (
                        <>
                            {/* =============================================
                                PROJECT STATISTICS
                            ============================================= */}

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    title="Total Tasks"
                                    value={formatNumber(
                                        totalTasks
                                    )}
                                    description="Tasks in this project"
                                    icon={
                                        ListChecks
                                    }
                                />

                                <StatCard
                                    title="Completed Tasks"
                                    value={formatNumber(
                                        completedTasks
                                    )}
                                    description={`${formatPercentage(
                                        completionRate
                                    )} project completion`}
                                    icon={
                                        CheckCircle2
                                    }
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
                                    icon={
                                        Clock3
                                    }
                                />

                                <StatCard
                                    title="Risks & Issues"
                                    value={formatNumber(
                                        risks.length
                                    )}
                                    description="Reported project concerns"
                                    icon={
                                        AlertTriangle
                                    }
                                />
                            </div>

                            {/* =============================================
                                PROJECT OVERVIEW
                            ============================================= */}

                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                                    <SectionHeader
                                        icon={
                                            TrendingUp
                                        }
                                        title="Project Overview"
                                        description="Current progress based on actual project tasks."
                                    />

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-3xl font-bold text-slate-900">
                                                {formatPercentage(
                                                    completionRate
                                                )}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Overall project progress
                                            </p>
                                        </div>

                                        <div className="text-right text-sm text-slate-500">
                                            <p>
                                                <span className="font-semibold text-slate-800">
                                                    {formatNumber(
                                                        completedTasks
                                                    )}
                                                </span>{" "}
                                                completed
                                            </p>

                                            <p className="mt-1">
                                                <span className="font-semibold text-slate-800">
                                                    {formatNumber(
                                                        remainingTasks
                                                    )}
                                                </span>{" "}
                                                remaining
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-slate-700 transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(
                                                        completionRate,
                                                        0
                                                    ),
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500">
                                                To Do
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                                {formatNumber(
                                                    dashboard?.TodoTasks ??
                                                    dashboard?.todoTasks ??
                                                    0
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500">
                                                In Progress
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                                {formatNumber(
                                                    dashboard?.InProgressTasks ??
                                                    dashboard?.inProgressTasks ??
                                                    0
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500">
                                                In Review
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                                {formatNumber(
                                                    dashboard?.InReviewTasks ??
                                                    dashboard?.inReviewTasks ??
                                                    0
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500">
                                                Blocked
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                                {formatNumber(
                                                    dashboard?.BlockedTasks ??
                                                    dashboard?.blockedTasks ??
                                                    0
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* =============================================
                                    TEAM SUMMARY
                                ============================================= */}

                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <SectionHeader
                                        icon={
                                            Users
                                        }
                                        title="Team"
                                        description="Team assigned to this project."
                                    />

                                    <div className="rounded-lg bg-slate-50 p-5">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Team Name
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-slate-900">
                                            {teamName}
                                        </p>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg border border-slate-200 p-4">
                                            <p className="text-xs text-slate-500">
                                                Members
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-slate-900">
                                                {formatNumber(
                                                    dashboardTeamMembers
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200 p-4">
                                            <p className="text-xs text-slate-500">
                                                Team Progress
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-slate-900">
                                                {formatPercentage(
                                                    dashboard?.TeamProgressPercentage ??
                                                    dashboard?.teamProgressPercentage ??
                                                    0
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Assigned work
                                            </span>

                                            <span className="font-medium text-slate-800">
                                                {formatNumber(
                                                    dashboard?.TeamAssignedWorkItems ??
                                                    dashboard?.teamAssignedWorkItems ??
                                                    0
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Developers
                                            </span>

                                            <span className="font-medium text-slate-800">
                                                {formatNumber(
                                                    dashboard?.TeamDeveloperCount ??
                                                    dashboard?.teamDeveloperCount ??
                                                    0
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Staff
                                            </span>

                                            <span className="font-medium text-slate-800">
                                                {formatNumber(
                                                    dashboard?.TeamStaffCount ??
                                                    dashboard?.teamStaffCount ??
                                                    0
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =============================================
                                TEAM PERFORMANCE
                            ============================================= */}

                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <SectionHeader
                                    icon={
                                        Users
                                    }
                                    title="Team Performance"
                                    description={`Performance report for ${teamName}.`}
                                />

                                {loadingTeam ? (
                                    <div className="py-10 text-center">
                                        <RefreshCw className="mx-auto h-7 w-7 animate-spin text-slate-400" />

                                        <p className="mt-2 text-sm text-slate-500">
                                            Loading team performance...
                                        </p>
                                    </div>
                                ) : teamPerformance ? (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                            <StatCard
                                                title="Completion Rate"
                                                value={formatPercentage(
                                                    teamCompletionRate
                                                )}
                                                description="Team task completion"
                                                icon={
                                                    CheckCircle2
                                                }
                                            />

                                            <StatCard
                                                title="Total Tasks"
                                                value={formatNumber(
                                                    teamTotalTasks
                                                )}
                                                description="Team assigned tasks"
                                                icon={
                                                    ListChecks
                                                }
                                            />

                                            <StatCard
                                                title="Completed"
                                                value={formatNumber(
                                                    teamCompletedTasks
                                                )}
                                                description="Completed team tasks"
                                                icon={
                                                    CheckCircle2
                                                }
                                            />

                                            <StatCard
                                                title="Delayed"
                                                value={formatNumber(
                                                    teamDelayedTasks
                                                )}
                                                description="Delayed tasks"
                                                icon={
                                                    Clock3
                                                }
                                            />

                                            <StatCard
                                                title="Blocked"
                                                value={formatNumber(
                                                    teamBlockedTasks
                                                )}
                                                description="Blocked tasks"
                                                icon={
                                                    AlertTriangle
                                                }
                                            />
                                        </div>

                                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                            <div className="rounded-lg border border-slate-200 p-4">
                                                <p className="text-sm text-slate-500">
                                                    Estimated Hours
                                                </p>

                                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                                    {formatNumber(
                                                        teamEstimatedHours
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-200 p-4">
                                                <p className="text-sm text-slate-500">
                                                    Actual Hours
                                                </p>

                                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                                    {formatNumber(
                                                        teamActualHours
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-200 p-4">
                                                <p className="text-sm text-slate-500">
                                                    Workload
                                                </p>

                                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                                    {formatPercentage(
                                                        teamWorkload
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* TEAM LEADERS */}

                                        <div className="mt-8">
                                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                                <UserCheck className="h-4 w-4" />
                                                Team Leaders
                                            </h3>

                                            {teamLeaders.length > 0 ? (
                                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                                        <thead className="bg-slate-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Name
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Assigned
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Completed
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Delayed
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Completion
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Workload
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="divide-y divide-slate-200 bg-white">
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
                                                                    >
                                                                        <td className="px-4 py-3 font-medium text-slate-800">
                                                                            {member?.UserName ||
                                                                                member?.userName ||
                                                                                "Unknown"}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {formatNumber(
                                                                                member?.AssignedTasks ??
                                                                                member?.assignedTasks ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {formatNumber(
                                                                                member?.CompletedTasks ??
                                                                                member?.completedTasks ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {formatNumber(
                                                                                member?.DelayedTasks ??
                                                                                member?.delayedTasks ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 font-medium text-slate-700">
                                                                            {formatPercentage(
                                                                                member?.CompletionRate ??
                                                                                member?.completionRate ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
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
                                                />
                                            )}
                                        </div>

                                        {/* CONTRIBUTORS */}

                                        <div className="mt-8">
                                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                                <UserRound className="h-4 w-4" />
                                                Contributors
                                            </h3>

                                            {contributors.length > 0 ? (
                                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                                        <thead className="bg-slate-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Name
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Type
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Assigned
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Completed
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Delayed
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Blocked
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Completion
                                                                </th>

                                                                <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                                    Workload
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="divide-y divide-slate-200 bg-white">
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
                                                                    >
                                                                        <td className="px-4 py-3 font-medium text-slate-800">
                                                                            {member?.UserName ||
                                                                                member?.userName ||
                                                                                "Unknown"}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {member?.ContributorType ||
                                                                                member?.contributorType ||
                                                                                "—"}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {formatNumber(
                                                                                member?.AssignedTasks ??
                                                                                member?.assignedTasks ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {formatNumber(
                                                                                member?.CompletedTasks ??
                                                                                member?.completedTasks ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {formatNumber(
                                                                                member?.DelayedTasks ??
                                                                                member?.delayedTasks ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {formatNumber(
                                                                                member?.BlockedTasks ??
                                                                                member?.blockedTasks ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 font-medium text-slate-700">
                                                                            {formatPercentage(
                                                                                member?.CompletionRate ??
                                                                                member?.completionRate ??
                                                                                0
                                                                            )}
                                                                        </td>

                                                                        <td className="px-4 py-3 text-slate-600">
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
                                                />
                                            )}
                                        </div>

                                        {/* TASK DISTRIBUTION */}

                                        {taskDistribution.length >
                                            0 && (
                                            <div className="mt-8">
                                                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                                    <BriefcaseBusiness className="h-4 w-4" />
                                                    Task Distribution
                                                </h3>

                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                                                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                                                >
                                                                    <p className="text-sm text-slate-500">
                                                                        {name}
                                                                    </p>

                                                                    <p className="mt-1 text-xl font-bold text-slate-900">
                                                                        {formatNumber(
                                                                            count
                                                                        )}
                                                                    </p>
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
                                    />
                                )}
                            </div>

                            {/* =============================================
                                SPRINT PROGRESS
                            ============================================= */}

                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <SectionHeader
                                    icon={
                                        CalendarDays
                                    }
                                    title="Sprint Progress"
                                    description="Select a sprint to view its current progress."
                                />

                                <div className="max-w-xl">
                                    <label
                                        htmlFor="sprint-select"
                                        className="mb-2 block text-sm font-medium text-slate-700"
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
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
                                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Loading sprint progress...
                                    </div>
                                )}

                                {!loadingSprint &&
                                    sprintProgress && (
                                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <StatCard
                                                title="Total Tasks"
                                                value={formatNumber(
                                                    sprintProgress?.TotalTasks ??
                                                    sprintProgress?.totalTasks ??
                                                    sprintProgress?.TaskCount ??
                                                    sprintProgress?.taskCount ??
                                                    0
                                                )}
                                                icon={
                                                    ListChecks
                                                }
                                            />

                                            <StatCard
                                                title="Completed"
                                                value={formatNumber(
                                                    sprintProgress?.CompletedTasks ??
                                                    sprintProgress?.completedTasks ??
                                                    0
                                                )}
                                                icon={
                                                    CheckCircle2
                                                }
                                            />

                                            <StatCard
                                                title="Remaining"
                                                value={formatNumber(
                                                    sprintProgress?.RemainingTasks ??
                                                    sprintProgress?.remainingTasks ??
                                                    0
                                                )}
                                                icon={
                                                    Clock3
                                                }
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
                                                icon={
                                                    TrendingUp
                                                }
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
                                            />
                                        </div>
                                    )}
                            </div>

                            {/* =============================================
                                RISKS & ISSUES
                            ============================================= */}

                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <SectionHeader
                                    icon={
                                        AlertTriangle
                                    }
                                    title="Risks & Issues"
                                    description="Current risks and issues reported for this project."
                                />

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
                                                    className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-lg bg-slate-100 p-2">
                                                            <AlertTriangle className="h-4 w-4 text-slate-600" />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {getRiskTitle(
                                                                    risk
                                                                )}
                                                            </p>

                                                            {risk?.description &&
                                                                risk.description !==
                                                                    getRiskTitle(
                                                                        risk
                                                                    ) && (
                                                                    <p className="mt-1 text-sm text-slate-500">
                                                                        {
                                                                            risk.description
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </div>

                                                    <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
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
                                    />
                                )}
                            </div>

                            {/* =============================================
                                PROJECT SPRINTS
                            ============================================= */}

                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <SectionHeader
                                    icon={
                                        CalendarDays
                                    }
                                    title="Project Sprints"
                                    description="All sprints associated with the selected project."
                                />

                                {sprints.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                        Sprint
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                        Status
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                        Start
                                                    </th>

                                                    <th className="px-4 py-3 text-left font-medium text-slate-500">
                                                        End
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-slate-200 bg-white">
                                                {sprints.map(
                                                    (
                                                        sprint,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={
                                                                String(
                                                                    getSprintId(
                                                                        sprint
                                                                    )
                                                                ) ||
                                                                index
                                                            }
                                                        >
                                                            <td className="px-4 py-3 font-medium text-slate-800">
                                                                {getSprintName(
                                                                    sprint
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                                                    {getSprintStatus(
                                                                        sprint
                                                                    ) ||
                                                                        "Unknown"}
                                                                </span>
                                                            </td>

                                                            <td className="px-4 py-3 text-slate-600">
                                                                {formatDate(
                                                                    sprint?.startDate ||
                                                                    sprint?.StartDate
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-3 text-slate-600">
                                                                {formatDate(
                                                                    sprint?.endDate ||
                                                                    sprint?.EndDate
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
                                        title="No sprints"
                                        description="No sprints have been created for this project."
                                    />
                                )}
                            </div>

                            {/* =============================================
                                TIMELINE
                            ============================================= */}

                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <SectionHeader
                                    icon={
                                        Clock3
                                    }
                                    title="Project Timeline"
                                    description="Timeline information returned by the project reporting API."
                                />

                                {timeline.length > 0 ? (
                                    <div className="space-y-3">
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
                                                        className="flex gap-4 rounded-lg border border-slate-200 p-4"
                                                    >
                                                        <div className="mt-1 rounded-full bg-slate-100 p-2">
                                                            <Clock3 className="h-4 w-4 text-slate-600" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                                <p className="font-medium text-slate-800">
                                                                    {title}
                                                                </p>

                                                                <p className="text-xs text-slate-500">
                                                                    {formatDateTime(
                                                                        date
                                                                    )}
                                                                </p>
                                                            </div>

                                                            {description && (
                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    {
                                                                        description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No timeline data"
                                        description="No timeline events were returned for this project."
                                    />
                                )}
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
}

