import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Brain,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5043";

const getAuthToken = () => {
    /*
     * Authentication is handled by the application.
     *
     * IMPORTANT:
     * This component does NOT use localStorage/sessionStorage.
     *
     * If your application already has an auth context/service,
     * replace this function with your existing token provider.
     */
    return null;
};

const apiRequest = async (
    endpoint,
    options = {}
) => {
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    let responseData = null;

    try {
        responseData =
            await response.json();
    } catch {
        responseData = null;
    }

    if (!response.ok) {
        throw new Error(
            responseData?.message ||
                responseData?.error ||
                `Request failed with status ${response.status}.`
        );
    }

    return responseData;
};

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
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

const getProjectName = (project) => {
    return (
        project?.name ||
        project?.projectName ||
        project?.title ||
        "Project"
    );
};

const getProjectId = (project) => {
    return (
        project?.id ||
        project?._id ||
        project?.projectId ||
        project?.projectID ||
        ""
    );
};

const getErrorMessage = (error) => {
    if (!error) {
        return "Something went wrong.";
    }

    if (
        error.message ===
        "AUTHENTICATION_REQUIRED"
    ) {
        return "Your session has expired. Please log in again.";
    }

    if (
        error.message ===
        "ACCESS_DENIED"
    ) {
        return "You are not authorized to generate a summary for this project.";
    }

    return (
        error.message ||
        "Unable to generate the AI project summary."
    );
};

// ============================================================
// SUMMARY FIELD
// ============================================================

function SummarySection({
    icon: Icon,
    title,
    children,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                    {title}
                </h3>
            </div>

            <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {children}
            </div>
        </div>
    );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    label,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {value ?? "—"}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// AI PROJECT SUMMARY
// ============================================================

export default function AIProjectSummary({
    projectId: providedProjectId,
    project: providedProject,
    onBack,
}) {
    const [projects, setProjects] =
        useState([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState(
            providedProjectId || ""
        );

    const [selectedProject, setSelectedProject] =
        useState(
            providedProject || null
        );

    const [summary, setSummary] =
        useState(null);

    const [loadingProjects, setLoadingProjects] =
        useState(false);

    const [generating, setGenerating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [generatedAt, setGeneratedAt] =
        useState(null);

    // ========================================================
    // LOAD AUTHORIZED MANAGER PROJECTS
    // ========================================================

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);
            setError("");

            /*
             * Backend endpoint should return only projects
             * assigned to the authenticated Manager.
             *
             * Example:
             *
             * GET /api/reports/manager/projects
             */

            const result =
                await apiRequest(
                    "/api/reports/manager/projects"
                );

            const data =
                result?.data ||
                result?.projects ||
                [];

            const projectList =
                Array.isArray(data)
                    ? data
                    : [];

            setProjects(
                projectList
            );

            if (
                providedProjectId
            ) {
                const matchingProject =
                    projectList.find(
                        (project) =>
                            String(
                                getProjectId(
                                    project
                                )
                            ) ===
                            String(
                                providedProjectId
                            )
                    );

                if (
                    matchingProject
                ) {
                    setSelectedProject(
                        matchingProject
                    );
                    setSelectedProjectId(
                        getProjectId(
                            matchingProject
                        )
                    );
                }
            }
        } catch (requestError) {
            console.error(
                "Failed to load manager projects:",
                requestError
            );

            setError(
                getErrorMessage(
                    requestError
                )
            );
        } finally {
            setLoadingProjects(
                false
            );
        }
    };

    useEffect(() => {
        if (!providedProject) {
            loadProjects();
        }
    }, [providedProject]);

    // ========================================================
    // PROJECT SELECTION
    // ========================================================

    const handleProjectChange = (
        event
    ) => {
        const projectId =
            event.target.value;

        setSelectedProjectId(
            projectId
        );

        const project =
            projects.find(
                (item) =>
                    String(
                        getProjectId(
                            item
                        )
                    ) ===
                    String(projectId)
            );

        setSelectedProject(
            project || null
        );

        setSummary(null);
        setGeneratedAt(null);
        setError("");
    };

    // ========================================================
    // GENERATE SUMMARY
    // ========================================================

    const handleGenerateSummary =
        async () => {
            if (!selectedProjectId) {
                setError(
                    "Please select a project first."
                );

                return;
            }

            try {
                setGenerating(true);
                setError("");
                setSummary(null);

                /*
                 * IMPORTANT:
                 *
                 * The backend must:
                 *
                 * 1. Authenticate the Manager.
                 * 2. Verify that the Manager owns/is assigned
                 *    to the selected project.
                 * 3. Retrieve actual project information.
                 * 4. Retrieve actual sprint information.
                 * 5. Retrieve actual task statistics.
                 * 6. Retrieve actual team progress.
                 * 7. Retrieve deadlines.
                 * 8. Retrieve risks/issues.
                 * 9. Retrieve recent activities.
                 * 10. Send only authorized information to AI.
                 *
                 * Example endpoint:
                 *
                 * POST /api/reports/projects/{projectId}/ai-summary
                 *
                 * The frontend intentionally does NOT send
                 * fake project statistics.
                 */

                const result =
                    await apiRequest(
                        `/api/reports/projects/${selectedProjectId}/ai-summary`,
                        {
                            method: "POST",
                            body: JSON.stringify({}),
                        }
                    );

                const generatedSummary =
                    result?.data ||
                    result?.summary ||
                    result;

                setSummary(
                    generatedSummary
                );

                setGeneratedAt(
                    new Date()
                );
            } catch (requestError) {
                console.error(
                    "Failed to generate AI project summary:",
                    requestError
                );

                setError(
                    getErrorMessage(
                        requestError
                    )
                );
            } finally {
                setGenerating(
                    false
                );
            }
        };

    // ========================================================
    // DERIVED VALUES
    // ========================================================

    const projectName =
        getProjectName(
            selectedProject
        );

    const summaryStats =
        useMemo(() => {
            if (!summary) {
                return {
                    progress: null,
                    completed: null,
                    remaining: null,
                    deadlines: null,
                };
            }

            return {
                progress:
                    summary?.progressPercentage ??
                    summary?.overallProgress ??
                    summary?.projectProgress ??
                    null,

                completed:
                    summary?.completedTasks ??
                    summary?.taskStatistics
                        ?.completed ??
                    null,

                remaining:
                    summary?.remainingTasks ??
                    summary?.taskStatistics
                        ?.remaining ??
                    null,

                deadlines:
                    summary?.upcomingDeadlines
                        ?.length ??
                    null,
            };
        }, [summary]);

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6 p-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100">
                            <Sparkles className="h-5 w-5 text-white dark:text-slate-900" />
                        </div>

                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            REPORT-005
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Generate AI Project Summary
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                        Generate an AI-based analysis of the
                        current state and performance of an
                        authorized project.
                    </p>
                </div>

                {onBack && (
                    <Button
                        variant="outline"
                        onClick={onBack}
                    >
                        Back
                    </Button>
                )}
            </div>

            {/* ==================================================
                AUTHORIZATION NOTICE
            ================================================== */}

            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                        Authorized project data only
                    </p>

                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                        The AI summary is generated only from
                        project information that the authenticated
                        Manager is authorized to access.
                    </p>
                </div>
            </div>

            {/* ==================================================
                PROJECT SELECTOR
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-slate-700 dark:text-slate-300" />

                    <h2 className="font-semibold text-slate-900 dark:text-white">
                        Select Project
                    </h2>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <select
                        value={
                            selectedProjectId
                        }
                        onChange={
                            handleProjectChange
                        }
                        disabled={
                            loadingProjects ||
                            generating
                        }
                        className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    >
                        <option value="">
                            {loadingProjects
                                ? "Loading authorized projects..."
                                : "Select an assigned project"}
                        </option>

                        {projects.map(
                            (project) => (
                                <option
                                    key={getProjectId(
                                        project
                                    )}
                                    value={getProjectId(
                                        project
                                    )}
                                >
                                    {getProjectName(
                                        project
                                    )}
                                </option>
                            )
                        )}
                    </select>

                    <Button
                        onClick={
                            handleGenerateSummary
                        }
                        disabled={
                            !selectedProjectId ||
                            generating
                        }
                    >
                        {generating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Summary
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={
                            loadProjects
                        }
                        disabled={
                            loadingProjects ||
                            generating
                        }
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                loadingProjects
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />
                    </Button>
                </div>

                {selectedProject && (
                    <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Project
                                </p>

                                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {projectName}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Start Date
                                </p>

                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                                    {formatDate(
                                        selectedProject?.startDate
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Deadline
                                </p>

                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                                    {formatDate(
                                        selectedProject?.endDate ||
                                            selectedProject?.deadline
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <div>
                        <p className="font-semibold text-red-800 dark:text-red-300">
                            Unable to generate summary
                        </p>

                        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                LOADING
            ================================================== */}

            {generating && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-600 dark:text-slate-300" />

                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                        AI is analyzing the project
                    </h3>

                    <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 dark:text-slate-400">
                        The system is retrieving the latest
                        authorized project information and
                        generating an AI-based analysis.
                    </p>
                </div>
            )}

            {/* ==================================================
                AI SUMMARY
            ================================================== */}

            {summary &&
                !generating && (
                    <div className="space-y-6">
                        {/* ==========================================
                            AI LABEL
                        ========================================== */}

                        <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/30">
                            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                            <div className="flex-1">
                                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                    <p className="font-semibold text-violet-900 dark:text-violet-300">
                                        AI-Generated Project Analysis
                                    </p>

                                    {generatedAt && (
                                        <span className="text-xs text-violet-700 dark:text-violet-400">
                                            Generated{" "}
                                            {generatedAt.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm text-violet-800 dark:text-violet-400">
                                    This analysis is generated
                                    from current system data.
                                    It does not modify project
                                    information and should support,
                                    not replace, Manager decisions.
                                </p>
                            </div>
                        </div>

                        {/* ==========================================
                            PROJECT STATUS
                        ========================================== */}

                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Project
                                    </p>

                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {summary?.projectName ||
                                            projectName}
                                    </h2>
                                </div>

                                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {summary?.overallStatus ||
                                        summary?.projectStatus ||
                                        "Status unavailable"}
                                </div>
                            </div>
                        </div>

                        {/* ==========================================
                            STATISTICS
                        ========================================== */}

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Overall Progress"
                                value={
                                    summaryStats.progress !==
                                    null
                                        ? `${summaryStats.progress}%`
                                        : "—"
                                }
                                icon={
                                    TrendingUp
                                }
                            />

                            <StatCard
                                label="Completed Work"
                                value={
                                    summaryStats.completed
                                }
                                icon={
                                    CheckCircle2
                                }
                            />

                            <StatCard
                                label="Remaining Work"
                                value={
                                    summaryStats.remaining
                                }
                                icon={
                                    Clock3
                                }
                            />

                            <StatCard
                                label="Upcoming Deadlines"
                                value={
                                    summaryStats.deadlines
                                }
                                icon={
                                    CalendarDays
                                }
                            />
                        </div>

                        {/* ==========================================
                            SUMMARY SECTIONS
                        ========================================== */}

                        <div className="grid gap-5 lg:grid-cols-2">
                            <SummarySection
                                icon={
                                    FileText
                                }
                                title="Progress Summary"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.progressSummary ||
                                        summary?.summary ||
                                        "No progress summary was returned by the AI service."}
                                </p>
                            </SummarySection>

                            <SummarySection
                                icon={
                                    CheckCircle2
                                }
                                title="Completed Work"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.completedWork ||
                                        "No completed-work analysis was returned."}
                                </p>
                            </SummarySection>

                            <SummarySection
                                icon={
                                    Clock3
                                }
                                title="Remaining Work"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.remainingWork ||
                                        "No remaining-work analysis was returned."}
                                </p>
                            </SummarySection>

                            <SummarySection
                                icon={
                                    AlertTriangle
                                }
                                title="Major Issues"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.majorIssues ||
                                        "No major issues were identified in the returned analysis."}
                                </p>
                            </SummarySection>

                            <SummarySection
                                icon={
                                    XCircle
                                }
                                title="Potential Concerns"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.potentialConcerns ||
                                        summary?.concerns ||
                                        "No potential concerns were identified in the returned analysis."}
                                </p>
                            </SummarySection>

                            <SummarySection
                                icon={
                                    CalendarDays
                                }
                                title="Important Upcoming Deadlines"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.upcomingDeadlineSummary ||
                                        summary?.upcomingDeadlinesSummary ||
                                        "No upcoming deadline analysis was returned."}
                                </p>
                            </SummarySection>
                        </div>

                        {/* ==========================================
                            SPRINT SUMMARY
                        ========================================== */}

                        {(summary?.sprintSummary ||
                            summary?.sprintProgressSummary) && (
                            <SummarySection
                                icon={
                                    TrendingUp
                                }
                                title="Sprint Progress"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.sprintSummary ||
                                        summary?.sprintProgressSummary}
                                </p>
                            </SummarySection>
                        )}

                        {/* ==========================================
                            TEAM PROGRESS
                        ========================================== */}

                        {(summary?.teamProgress ||
                            summary?.teamProgressSummary) && (
                            <SummarySection
                                icon={
                                    Target
                                }
                                title="Team Progress"
                            >
                                <p className="whitespace-pre-line">
                                    {summary?.teamProgress ||
                                        summary?.teamProgressSummary}
                                </p>
                            </SummarySection>
                        )}

                        {/* ==========================================
                            REFRESH
                        ========================================== */}

                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    Need the latest analysis?
                                </p>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Generate the summary again to
                                    analyze the latest available
                                    project information.
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                onClick={
                                    handleGenerateSummary
                                }
                                disabled={
                                    generating ||
                                    !selectedProjectId
                                }
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />

                                Generate Again
                            </Button>
                        </div>
                    </div>
                )}

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!summary &&
                !generating &&
                !error &&
                selectedProjectId && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                        <Sparkles className="mx-auto h-10 w-10 text-slate-400" />

                        <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                            Ready to generate
                        </h3>

                        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 dark:text-slate-400">
                            Select Generate Summary to analyze the
                            latest authorized data for{" "}
                            <strong>
                                {projectName}
                            </strong>
                            .
                        </p>
                    </div>
                )}

            {!selectedProjectId &&
                !loadingProjects &&
                !error && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                        <FileText className="mx-auto h-10 w-10 text-slate-400" />

                        <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                            Select an assigned project
                        </h3>

                        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 dark:text-slate-400">
                            The available projects are retrieved
                            from the backend for the authenticated
                            Manager.
                        </p>
                    </div>
                )}
        </div>
    );
}