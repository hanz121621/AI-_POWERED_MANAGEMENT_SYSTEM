
// ============================================================
// AIPMS - MANAGER REPORTS PAGE
// src/pages/manager/Reports.jsx
//
// Manager Reports Dashboard
// Styled to match the Manager Sprint Management page
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";

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
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getProjectDashboard,
    getProjectRisksAndIssues,
    getProjectSprints,
    getSprintProgress,
} from "@/services/projectReportService";

// ============================================================
// COMPONENT
// ============================================================

function ReportsPage() {
    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    const [dashboard, setDashboard] = useState(null);
    const [risks, setRisks] = useState([]);
    const [sprints, setSprints] = useState([]);

    const [selectedSprintId, setSelectedSprintId] = useState("");
    const [sprintProgress, setSprintProgress] = useState(null);

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);
    const [loadingSprint, setLoadingSprint] = useState(false);

    const [error, setError] = useState("");

    // ========================================================
    // CURRENT USER
    // ========================================================

    const [currentUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem(
                "aipms_current_user"
            );

            return storedUser
                ? JSON.parse(storedUser)
                : null;
        } catch (err) {
            console.error(
                "Unable to read current user:",
                err
            );

            return null;
        }
    });

    // ========================================================
    // ACCESS TOKEN
    // ========================================================

    const getAccessToken = useCallback(() => {
        return (
            localStorage.getItem("aipms_access_token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("token") ||
            null
        );
    }, []);

    // ========================================================
    // PROJECT HELPERS
    // ========================================================

    const getProjectName = useCallback((project) => {
        return (
            project?.name ||
            project?.projectName ||
            project?.title ||
            project?.ProjectName ||
            "Unnamed Project"
        );
    }, []);

    const getProjectId = useCallback((project) => {
        return (
            project?.id ??
            project?.projectId ??
            project?.ProjectId ??
            project?.projectID ??
            null
        );
    }, []);

    // ========================================================
    // SPRINT HELPERS
    // ========================================================

    const getSprintId = useCallback((sprint) => {
        return (
            sprint?.id ??
            sprint?.sprintId ??
            sprint?.SprintId ??
            sprint?.sprintID ??
            null
        );
    }, []);

    const getSprintName = useCallback(
        (sprint) => {
            return (
                sprint?.name ||
                sprint?.sprintName ||
                sprint?.title ||
                sprint?.SprintName ||
                `Sprint ${getSprintId(sprint) ?? ""}`
            );
        },
        [getSprintId]
    );

    const getSprintStatus = useCallback((sprint) => {
        return (
            sprint?.status ||
            sprint?.Status ||
            "Unknown"
        );
    }, []);

    // ========================================================
    // GENERIC HELPERS
    // ========================================================

    const getValue = useCallback(
        (object, keys, fallback = 0) => {
            if (!object) {
                return fallback;
            }

            for (const key of keys) {
                if (
                    object[key] !== undefined &&
                    object[key] !== null
                ) {
                    return object[key];
                }
            }

            return fallback;
        },
        []
    );

    const getArrayResponse = useCallback(
        (response, keys = []) => {
            if (Array.isArray(response)) {
                return response;
            }

            if (Array.isArray(response?.data)) {
                return response.data;
            }

            for (const key of keys) {
                if (Array.isArray(response?.[key])) {
                    return response[key];
                }

                if (
                    Array.isArray(
                        response?.data?.[key]
                    )
                ) {
                    return response.data[key];
                }
            }

            return [];
        },
        []
    );

    const formatNumber = useCallback((value) => {
        const number = Number(value);

        return Number.isNaN(number)
            ? "0"
            : number.toLocaleString();
    }, []);

    const formatDate = useCallback((value) => {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString();
    }, []);

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    const loadProjects = useCallback(async () => {
        try {
            setLoadingProjects(true);
            setError("");

            const response =
                await getAuthorizedManagerProjects(
                    getAccessToken()
                );

            const projectList =
                getArrayResponse(
                    response,
                    ["projects"]
                );

            setProjects(projectList);

            if (projectList.length === 0) {
                setSelectedProjectId("");
                setDashboard(null);
                setRisks([]);
                setSprints([]);
                setSelectedSprintId("");
                setSprintProgress(null);

                return;
            }

            const exists = projectList.some(
                (project) =>
                    String(
                        getProjectId(project)
                    ) ===
                    String(selectedProjectId)
            );

            if (
                !selectedProjectId ||
                !exists
            ) {
                const firstId =
                    getProjectId(
                        projectList[0]
                    );

                if (firstId !== null) {
                    setSelectedProjectId(
                        String(firstId)
                    );
                }
            }
        } catch (err) {
            console.error(
                "Failed to load manager projects:",
                err
            );

            setProjects([]);
            setSelectedProjectId("");
            setDashboard(null);
            setRisks([]);
            setSprints([]);
            setSelectedSprintId("");
            setSprintProgress(null);

            setError(
                err?.message ||
                    "Unable to load assigned projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    }, [
        getAccessToken,
        getArrayResponse,
        getProjectId,
        selectedProjectId,
    ]);

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

                const token =
                    getAccessToken();

                const [
                    dashboardResponse,
                    riskResponse,
                    sprintResponse,
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
                ]);

                setDashboard(
                    dashboardResponse?.data ??
                        dashboardResponse ??
                        null
                );

                setRisks(
                    getArrayResponse(
                        riskResponse,
                        [
                            "risks",
                            "items",
                        ]
                    )
                );

                setSprints(
                    getArrayResponse(
                        sprintResponse,
                        [
                            "sprints",
                            "items",
                        ]
                    )
                );
            } catch (err) {
                console.error(
                    "Failed to load manager report:",
                    err
                );

                setDashboard(null);
                setRisks([]);
                setSprints([]);
                setSelectedSprintId("");
                setSprintProgress(null);

                setError(
                    err?.message ||
                        "Unable to load project report."
                );
            } finally {
                setLoadingReport(false);
            }
        },
        [
            getAccessToken,
            getArrayResponse,
        ]
    );

    // ========================================================
    // LOAD SPRINT PROGRESS
    // ========================================================

    const loadSprintProgress = useCallback(
        async (
            sprintId,
            projectId = selectedProjectId
        ) => {
            if (!projectId || !sprintId) {
                setSprintProgress(null);
                return;
            }

            try {
                setLoadingSprint(true);
                setError("");

                const response =
                    await getSprintProgress(
                        projectId,
                        sprintId,
                        getAccessToken()
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
        [
            getAccessToken,
            selectedProjectId,
        ]
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    // ========================================================
    // PROJECT LOAD
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

    const selectedProject = useMemo(() => {
        return (
            projects.find(
                (project) =>
                    String(
                        getProjectId(project)
                    ) ===
                    String(selectedProjectId)
            ) || null
        );
    }, [
        projects,
        selectedProjectId,
        getProjectId,
    ]);

    // ========================================================
    // REPORT VALUES
    // ========================================================

    const totalTasks = Number(
        getValue(
            dashboard,
            [
                "totalTasks",
                "taskCount",
                "tasks",
                "TotalTasks",
            ],
            0
        )
    );

    const completedTasks = Number(
        getValue(
            dashboard,
            [
                "completedTasks",
                "completedTaskCount",
                "CompletedTasks",
            ],
            0
        )
    );

    const pendingTasks = Number(
        getValue(
            dashboard,
            [
                "pendingTasks",
                "remainingTasks",
                "PendingTasks",
                "RemainingTasks",
            ],
            Math.max(
                totalTasks -
                    completedTasks,
                0
            )
        )
    );

    const activeSprints = Number(
        getValue(
            dashboard,
            [
                "activeSprints",
                "activeSprintCount",
                "ActiveSprints",
            ],
            sprints.filter(
                (sprint) =>
                    String(
                        getSprintStatus(
                            sprint
                        )
                    ).toLowerCase() ===
                    "active"
            ).length
        )
    );

    const teamMembers = Number(
        getValue(
            dashboard,
            [
                "teamMembers",
                "memberCount",
                "totalMembers",
                "TeamMembers",
            ],
            0
        )
    );

    const completionRate =
        totalTasks > 0
            ? Math.round(
                  (completedTasks /
                      totalTasks) *
                      100
              )
            : 0;

    const safeCompletionRate =
        Math.min(
            Math.max(
                completionRate,
                0
            ),
            100
        );

    // ========================================================
    // RISK HELPERS
    // ========================================================

    const getRiskTitle = useCallback(
        (risk) =>
            risk?.title ||
            risk?.name ||
            risk?.description ||
            risk?.issue ||
            "Risk / Issue",
        []
    );

    const getRiskSeverity = useCallback(
        (risk) =>
            risk?.severity ||
            risk?.priority ||
            risk?.level ||
            "Unknown",
        []
    );

    const getRiskId = useCallback(
        (risk, index) =>
            risk?.id ??
            risk?.riskId ??
            risk?.issueId ??
            index,
        []
    );

    // ========================================================
    // EVENT HANDLERS
    // ========================================================

    const handleProjectChange = (event) => {
        setSelectedProjectId(
            event.target.value
        );

        setSelectedSprintId("");
        setSprintProgress(null);
        setError("");
    };

    const handleSprintChange = (event) => {
        const sprintId =
            event.target.value;

        setSelectedSprintId(sprintId);
        setSprintProgress(null);
        setError("");

        if (sprintId) {
            loadSprintProgress(
                sprintId,
                selectedProjectId
            );
        }
    };

    const handleRefresh = async () => {
        setError("");

        await loadProjects();

        if (selectedProjectId) {
            await loadReport(
                selectedProjectId
            );
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                <BarChart3 className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Reports
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    View project performance,
                                    sprint progress, tasks,
                                    team activity and risks.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={
                                loadingProjects ||
                                loadingReport ||
                                loadingSprint
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    loadingProjects ||
                                    loadingReport ||
                                    loadingSprint
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />

                            Refresh
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    PROJECT FILTER
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">

                        <div className="flex-1">
                            <label
                                htmlFor="project-select"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Project
                            </label>

                            <select
                                id="project-select"
                                value={
                                    selectedProjectId
                                }
                                onChange={
                                    handleProjectChange
                                }
                                disabled={
                                    loadingProjects
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-50"
                            >
                                <option value="">
                                    {loadingProjects
                                        ? "Loading projects..."
                                        : projects.length ===
                                          0
                                            ? "No assigned projects"
                                            : "Select project"}
                                </option>

                                {projects.map(
                                    (project) => {
                                        const id =
                                            getProjectId(
                                                project
                                            );

                                        return (
                                            <option
                                                key={String(
                                                    id
                                                )}
                                                value={id}
                                            >
                                                {getProjectName(
                                                    project
                                                )}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>

                        {selectedProject && (
                            <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
                                <FolderKanban className="h-4 w-4 text-indigo-500" />

                                <span>
                                    {getProjectName(
                                        selectedProject
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3 text-sm text-red-700">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                            <div>
                                <p className="font-semibold">
                                    Unable to load report
                                </p>

                                <p className="mt-1">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loadingReport && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>
                            Loading project report...
                        </span>
                    </div>
                )}

                {/* ==================================================
                    NO PROJECT
                ================================================== */}

                {!loadingProjects &&
                    projects.length === 0 &&
                    !error && (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                            <FolderKanban className="mx-auto mb-4 h-12 w-12 text-gray-400" />

                            <h2 className="text-lg font-semibold text-gray-900">
                                No Projects Available
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                                There are currently no
                                projects assigned to you
                                for reporting.
                            </p>
                        </div>
                    )}

                {/* ==================================================
                    REPORT
                ================================================== */}

                {selectedProjectId &&
                    !loadingReport && (
                        <>

                            {/* ==================================================
                                STATISTICS
                            ================================================== */}

                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Total Tasks
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                                {formatNumber(
                                                    totalTasks
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                                            <ListChecks className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-400">
                                        Project tasks
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Completed
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                                {formatNumber(
                                                    completedTasks
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-400">
                                        Finished tasks
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Active Sprints
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                                {formatNumber(
                                                    activeSprints
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-400">
                                        Currently active
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Risks & Issues
                                            </p>

                                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                                {formatNumber(
                                                    risks.length
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-400">
                                        Requires attention
                                    </p>
                                </div>
                            </div>

                            {/* ==================================================
                                OVERVIEW
                            ================================================== */}

                            <div className="mb-6 grid gap-6 lg:grid-cols-3">

                                {/* COMPLETION */}

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Project Overview
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Overall task completion
                                                for this project.
                                            </p>
                                        </div>

                                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                                    </div>

                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">
                                            Completion
                                        </span>

                                        <span className="text-sm font-bold text-gray-900">
                                            {
                                                safeCompletionRate
                                            }
                                            %
                                        </span>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                            style={{
                                                width: `${safeCompletionRate}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                                                <span className="text-sm font-medium text-emerald-700">
                                                    Completed
                                                </span>
                                            </div>

                                            <p className="mt-2 text-2xl font-bold text-emerald-800">
                                                {formatNumber(
                                                    completedTasks
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock3 className="h-4 w-4 text-amber-600" />

                                                <span className="text-sm font-medium text-amber-700">
                                                    Remaining
                                                </span>
                                            </div>

                                            <p className="mt-2 text-2xl font-bold text-amber-800">
                                                {formatNumber(
                                                    pendingTasks
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* TEAM */}

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                                            <Users className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Team
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Project members
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-gray-50 p-5">
                                        <p className="text-sm text-gray-500">
                                            Team Members
                                        </p>

                                        <p className="mt-2 text-4xl font-bold text-gray-900">
                                            {formatNumber(
                                                teamMembers
                                            )}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-500">
                                            Members assigned
                                            to this project
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                SPRINT PROGRESS
                            ================================================== */}

                            <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="border-b border-gray-200 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Sprint Progress
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Select a sprint to
                                                view detailed
                                                progress.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">

                                    <select
                                        value={
                                            selectedSprintId
                                        }
                                        onChange={
                                            handleSprintChange
                                        }
                                        disabled={
                                            sprints.length ===
                                            0
                                        }
                                        className="mb-5 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        <option value="">
                                            {sprints.length ===
                                            0
                                                ? "No sprints available"
                                                : "Select sprint"}
                                        </option>

                                        {sprints.map(
                                            (
                                                sprint,
                                                index
                                            ) => {
                                                const id =
                                                    getSprintId(
                                                        sprint
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            id ??
                                                            index
                                                        }
                                                        value={
                                                            id
                                                        }
                                                    >
                                                        {getSprintName(
                                                            sprint
                                                        )}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>

                                    {loadingSprint && (
                                        <div className="flex items-center gap-2 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Loading sprint
                                            progress...
                                        </div>
                                    )}

                                    {!loadingSprint &&
                                        sprintProgress && (
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                                    <p className="text-sm text-gray-500">
                                                        Total Tasks
                                                    </p>

                                                    <p className="mt-2 text-2xl font-bold text-gray-900">
                                                        {formatNumber(
                                                            getValue(
                                                                sprintProgress,
                                                                [
                                                                    "totalTasks",
                                                                    "taskCount",
                                                                    "TotalTasks",
                                                                ],
                                                                0
                                                            )
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                                    <p className="text-sm text-emerald-700">
                                                        Completed
                                                    </p>

                                                    <p className="mt-2 text-2xl font-bold text-emerald-800">
                                                        {formatNumber(
                                                            getValue(
                                                                sprintProgress,
                                                                [
                                                                    "completedTasks",
                                                                    "completedTaskCount",
                                                                    "CompletedTasks",
                                                                ],
                                                                0
                                                            )
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                                    <p className="text-sm text-amber-700">
                                                        Remaining
                                                    </p>

                                                    <p className="mt-2 text-2xl font-bold text-amber-800">
                                                        {formatNumber(
                                                            getValue(
                                                                sprintProgress,
                                                                [
                                                                    "remainingTasks",
                                                                    "pendingTasks",
                                                                    "RemainingTasks",
                                                                ],
                                                                0
                                                            )
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                                                    <p className="text-sm text-indigo-700">
                                                        Progress
                                                    </p>

                                                    <p className="mt-2 text-2xl font-bold text-indigo-800">
                                                        {getValue(
                                                            sprintProgress,
                                                            [
                                                                "completionRate",
                                                                "progress",
                                                                "percentage",
                                                            ],
                                                            0
                                                        )}
                                                        %
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* ==================================================
                                RISKS
                            ================================================== */}

                            <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Risks & Issues
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Current project risks
                                                and issues.
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                        {risks.length}
                                    </span>
                                </div>

                                <div className="p-6">
                                    {risks.length ===
                                    0 ? (
                                        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                                            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />

                                            <p className="font-medium text-gray-700">
                                                No risks or issues
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                This project
                                                currently has
                                                no reported
                                                risks.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {risks.map(
                                                (
                                                    risk,
                                                    index
                                                ) => (
                                                    <div
                                                        key={getRiskId(
                                                            risk,
                                                            index
                                                        )}
                                                        className="rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                                                    >
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex items-start gap-3">
                                                                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                                                    <AlertTriangle className="h-4 w-4" />
                                                                </div>

                                                                <div>
                                                                    <p className="font-semibold text-gray-900">
                                                                        {getRiskTitle(
                                                                            risk
                                                                        )}
                                                                    </p>

                                                                    {risk?.description &&
                                                                        risk.description !==
                                                                            getRiskTitle(
                                                                                risk
                                                                            ) && (
                                                                            <p className="mt-1 text-sm text-gray-500">
                                                                                {
                                                                                    risk.description
                                                                                }
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            </div>

                                                            <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                                                {getRiskSeverity(
                                                                    risk
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ==================================================
                                SPRINT TABLE
                            ================================================== */}

                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="border-b border-gray-200 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                                            <FileText className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Project Sprints
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Sprints associated
                                                with this project.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {sprints.length ===
                                    0 ? (
                                        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                                            <Clock3 className="mx-auto mb-3 h-10 w-10 text-gray-400" />

                                            <p className="font-medium text-gray-700">
                                                No sprints found
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                No sprint data
                                                is available.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[650px]">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                            Sprint
                                                        </th>

                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                            Status
                                                        </th>

                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                            Start Date
                                                        </th>

                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                            End Date
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {sprints.map(
                                                        (
                                                            sprint,
                                                            index
                                                        ) => {
                                                            const status =
                                                                getSprintStatus(
                                                                    sprint
                                                                );

                                                            const normalized =
                                                                String(
                                                                    status
                                                                ).toLowerCase();

                                                            let statusClass =
                                                                "bg-gray-100 text-gray-700";

                                                            if (
                                                                normalized ===
                                                                "active"
                                                            ) {
                                                                statusClass =
                                                                    "bg-emerald-50 text-emerald-700";
                                                            } else if (
                                                                normalized ===
                                                                "completed"
                                                            ) {
                                                                statusClass =
                                                                    "bg-indigo-50 text-indigo-700";
                                                            } else if (
                                                                normalized ===
                                                                "planning"
                                                            ) {
                                                                statusClass =
                                                                    "bg-amber-50 text-amber-700";
                                                            }

                                                            return (
                                                                <tr
                                                                    key={
                                                                        getSprintId(
                                                                            sprint
                                                                        ) ??
                                                                        index
                                                                    }
                                                                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                                                >
                                                                    <td className="px-4 py-4 font-medium text-gray-900">
                                                                        {getSprintName(
                                                                            sprint
                                                                        )}
                                                                    </td>

                                                                    <td className="px-4 py-4">
                                                                        <span
                                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                                                                        >
                                                                            {
                                                                                status
                                                                            }
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                                        {formatDate(
                                                                            sprint?.startDate ??
                                                                                sprint?.StartDate
                                                                        )}
                                                                    </td>

                                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                                        {formatDate(
                                                                            sprint?.endDate ??
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
                                    )}
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
}

// ============================================================
// EXPORT
// ============================================================

export default ReportsPage;

