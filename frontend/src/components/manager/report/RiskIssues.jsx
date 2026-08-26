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
    CircleAlert,
    Filter,
    Loader2,
    RefreshCw,
    Search,
    ShieldAlert,
    SlidersHorizontal,
    User,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getAuthorizedManagerProjects,
    getProjectRisksAndIssues,
} from "@/services/projectReportService";

// ============================================================
// HELPERS
// ============================================================

const getId = (item) =>
    item?.id ??
    item?._id ??
    item?.riskId ??
    item?.issueId ??
    "";

const getName = (item, fallback = "Unavailable") =>
    item?.name ??
    item?.title ??
    item?.projectName ??
    item?.riskTitle ??
    item?.issueTitle ??
    fallback;

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

const normalizeText = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase();

const getSeverityClass = (severity) => {
    const value = normalizeText(severity);

    if (
        value.includes("critical") ||
        value.includes("severe")
    ) {
        return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (value.includes("high")) {
        return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    }

    if (value.includes("medium")) {
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    if (
        value.includes("low") ||
        value.includes("minor")
    ) {
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    }

    return "border-slate-700 bg-slate-800/50 text-slate-300";
};

const getPriorityClass = (priority) => {
    const value = normalizeText(priority);

    if (
        value.includes("critical") ||
        value.includes("urgent")
    ) {
        return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (value.includes("high")) {
        return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    }

    if (value.includes("medium")) {
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    if (value.includes("low")) {
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    }

    return "border-slate-700 bg-slate-800/50 text-slate-300";
};

const getStatusClass = (status) => {
    const value = normalizeText(status);

    if (
        value.includes("resolved") ||
        value.includes("closed") ||
        value.includes("complete") ||
        value.includes("completed")
    ) {
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    }

    if (
        value.includes("open") ||
        value.includes("active") ||
        value.includes("progress") ||
        value.includes("ongoing")
    ) {
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    }

    if (
        value.includes("blocked") ||
        value.includes("failed")
    ) {
        return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (
        value.includes("pending") ||
        value.includes("review")
    ) {
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    return "border-slate-700 bg-slate-800/50 text-slate-300";
};

const getTypeLabel = (item) => {
    const type =
        item?.type ??
        item?.recordType ??
        item?.category ??
        item?.kind ??
        "";

    const normalized = normalizeText(type);

    if (normalized.includes("risk")) {
        return "Risk";
    }

    if (normalized.includes("issue")) {
        return "Issue";
    }

    if (
        item?.riskId ||
        item?.riskTitle
    ) {
        return "Risk";
    }

    if (
        item?.issueId ||
        item?.issueTitle
    ) {
        return "Issue";
    }

    return "Risk / Issue";
};

const getDescription = (item) =>
    item?.description ??
    item?.details ??
    item?.summary ??
    item?.reason ??
    "No description available.";

const getReportedDate = (item) =>
    item?.reportedDate ??
    item?.reportedAt ??
    item?.createdAt ??
    item?.createdDate ??
    item?.date;

const getReportedBy = (item) =>
    item?.reportedBy ??
    item?.reportedByName ??
    item?.reporter ??
    item?.reporterName ??
    item?.userName ??
    item?.userEmail ??
    "Unavailable";

const getRelatedSprint = (item) =>
    item?.sprint ??
    item?.relatedSprint ??
    item?.sprintName ??
    item?.sprintTitle ??
    null;

const getRelatedTask = (item) =>
    item?.task ??
    item?.relatedTask ??
    item?.taskName ??
    item?.taskTitle ??
    null;

const getResolution = (item) =>
    item?.resolution ??
    item?.resolutionInformation ??
    item?.resolutionDetails ??
    item?.resolvedBy ??
    item?.resolutionNote ??
    "";

const getComparableDate = (item) => {
    const value = getReportedDate(item);

    if (!value) {
        return 0;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 0;
    }

    return date.getTime();
};

// ============================================================
// UI COMPONENTS
// ============================================================

function EmptyState({
    message = "No information available.",
    icon: Icon = AlertCircle,
}) {
    return (
        <div className="flex min-h-32 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/30 px-4 py-8 text-center text-sm text-slate-500">
            <Icon className="h-5 w-5" />
            <span>{message}</span>
        </div>
    );
}

function StatusBadge({
    value,
    className = "",
}) {
    if (!value) {
        return null;
    }

    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
        >
            {value}
        </span>
    );
}

function RiskIssueCard({ item }) {
    const type = getTypeLabel(item);
    const description = getDescription(item);
    const reportedDate = getReportedDate(item);
    const reportedBy = getReportedBy(item);
    const resolution = getResolution(item);

    const sprint = getRelatedSprint(item);
    const task = getRelatedTask(item);

    return (
        <article className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 transition hover:border-slate-700">
            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <StatusBadge
                            value={type}
                            className={
                                type === "Risk"
                                    ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                                    : "border-orange-500/30 bg-orange-500/10 text-orange-400"
                            }
                        />

                        {item?.severity && (
                            <StatusBadge
                                value={`Severity: ${item.severity}`}
                                className={getSeverityClass(
                                    item.severity
                                )}
                            />
                        )}

                        {item?.priority && (
                            <StatusBadge
                                value={`Priority: ${item.priority}`}
                                className={getPriorityClass(
                                    item.priority
                                )}
                            />
                        )}

                        {item?.status && (
                            <StatusBadge
                                value={item.status}
                                className={getStatusClass(
                                    item.status
                                )}
                            />
                        )}
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                        {getName(
                            item,
                            type
                        )}
                    </h3>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-4 w-4" />

                    {formatDate(
                        reportedDate
                    )}
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Description
                </p>

                <p className="text-sm leading-6 text-slate-300">
                    {description}
                </p>
            </div>

            {/* DETAILS */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-slate-900/70 p-3">
                    <p className="text-xs text-slate-500">
                        Reported By
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />

                        <p className="truncate text-sm text-slate-200">
                            {reportedBy}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg bg-slate-900/70 p-3">
                    <p className="text-xs text-slate-500">
                        Reported Date
                    </p>

                    <p className="mt-1 text-sm text-slate-200">
                        {formatDateTime(
                            reportedDate
                        )}
                    </p>
                </div>

                <div className="rounded-lg bg-slate-900/70 p-3">
                    <p className="text-xs text-slate-500">
                        Related Sprint
                    </p>

                    <p className="mt-1 truncate text-sm text-slate-200">
                        {getName(
                            sprint,
                            typeof sprint === "string"
                                ? sprint
                                : "Not linked"
                        )}
                    </p>
                </div>

                <div className="rounded-lg bg-slate-900/70 p-3">
                    <p className="text-xs text-slate-500">
                        Related Task
                    </p>

                    <p className="mt-1 truncate text-sm text-slate-200">
                        {getName(
                            task,
                            typeof task === "string"
                                ? task
                                : "Not linked"
                        )}
                    </p>
                </div>
            </div>

            {/* RESOLUTION */}
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center gap-2">
                    {resolution ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                        <CircleAlert className="h-4 w-4 text-yellow-400" />
                    )}

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Resolution Information
                    </p>
                </div>

                <p className="mt-2 text-sm text-slate-300">
                    {resolution ||
                        "No resolution information recorded."}
                </p>
            </div>
        </article>
    );
}

// ============================================================
// MAIN COMPONENT
// REPORT-003 — VIEW RISK AND ISSUES
// ============================================================

export default function RiskIssues() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [records, setRecords] = useState([]);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingRecords, setLoadingRecords] =
        useState(false);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const [severityFilter, setSeverityFilter] =
        useState("all");

    const [priorityFilter, setPriorityFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [sortBy, setSortBy] =
        useState("newest");

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

            setProjects(
                authorizedProjects
            );

            if (
                authorizedProjects.length > 0
            ) {
                const firstProjectId =
                    getId(
                        authorizedProjects[0]
                    );

                setSelectedProjectId(
                    String(firstProjectId)
                );
            } else {
                setSelectedProjectId("");
                setRecords([]);
            }
        } catch (err) {
            console.error(
                "Failed to load authorized projects:",
                err
            );

            setProjects([]);
            setSelectedProjectId("");
            setRecords([]);

            setError(
                err?.message ||
                    "Unable to load authorized projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    }, []);

    // ========================================================
    // LOAD RISKS AND ISSUES
    // ========================================================

    const loadRisksAndIssues =
        useCallback(
            async (projectId) => {
                if (!projectId) {
                    setRecords([]);
                    return;
                }

                setLoadingRecords(true);
                setError("");

                try {
                    const result =
                        await getProjectRisksAndIssues(
                            projectId
                        );

                    if (!result?.success) {
                        throw new Error(
                            result?.error ||
                                "Unable to load risks and issues."
                        );
                    }

                    const data =
                        result?.data ??
                        result?.risksAndIssues ??
                        result?.records ??
                        [];

                    const normalized =
                        Array.isArray(data)
                            ? data
                            : [
                                  ...(Array.isArray(
                                      data?.risks
                                  )
                                      ? data.risks
                                      : []),
                                  ...(Array.isArray(
                                      data?.issues
                                  )
                                      ? data.issues
                                      : []),
                              ];

                    setRecords(
                        normalized
                    );
                } catch (err) {
                    console.error(
                        "Failed to load risks and issues:",
                        err
                    );

                    setRecords([]);

                    setError(
                        err?.message ||
                            "Unable to load risks and issues."
                    );
                } finally {
                    setLoadingRecords(false);
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
            loadRisksAndIssues(
                selectedProjectId
            );
        }
    }, [
        selectedProjectId,
        loadRisksAndIssues,
    ]);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject = useMemo(
        () =>
            projects.find(
                (project) =>
                    String(
                        getId(project)
                    ) ===
                    String(
                        selectedProjectId
                    )
            ),
        [
            projects,
            selectedProjectId,
        ]
    );

    // ========================================================
    // FILTER OPTIONS
    // ========================================================

    const filterOptions = useMemo(() => {
        const severities = new Set();
        const priorities = new Set();
        const statuses = new Set();

        records.forEach((item) => {
            if (item?.severity) {
                severities.add(
                    String(
                        item.severity
                    )
                );
            }

            if (item?.priority) {
                priorities.add(
                    String(
                        item.priority
                    )
                );
            }

            if (item?.status) {
                statuses.add(
                    String(
                        item.status
                    )
                );
            }
        });

        return {
            severities: [
                ...severities,
            ].sort(),

            priorities: [
                ...priorities,
            ].sort(),

            statuses: [
                ...statuses,
            ].sort(),
        };
    }, [records]);

    // ========================================================
    // FILTER + SORT
    // ========================================================

    const filteredRecords = useMemo(() => {
        const search =
            normalizeText(
                searchTerm
            );

        const filtered =
            records.filter(
                (item) => {
                    const type =
                        getTypeLabel(
                            item
                        );

                    const matchesSearch =
                        !search ||
                        [
                            getName(
                                item,
                                ""
                            ),
                            getDescription(
                                item
                            ),
                            getReportedBy(
                                item
                            ),
                            item?.severity,
                            item?.priority,
                            item?.status,
                            getName(
                                getRelatedSprint(
                                    item
                                ),
                                ""
                            ),
                            getName(
                                getRelatedTask(
                                    item
                                ),
                                ""
                            ),
                        ]
                            .map(
                                normalizeText
                            )
                            .some(
                                (value) =>
                                    value.includes(
                                        search
                                    )
                            );

                    const matchesType =
                        typeFilter ===
                            "all" ||
                        normalizeText(
                            type
                        ) ===
                            normalizeText(
                                typeFilter
                            );

                    const matchesSeverity =
                        severityFilter ===
                            "all" ||
                        normalizeText(
                            item?.severity
                        ) ===
                            normalizeText(
                                severityFilter
                            );

                    const matchesPriority =
                        priorityFilter ===
                            "all" ||
                        normalizeText(
                            item?.priority
                        ) ===
                            normalizeText(
                                priorityFilter
                            );

                    const matchesStatus =
                        statusFilter ===
                            "all" ||
                        normalizeText(
                            item?.status
                        ) ===
                            normalizeText(
                                statusFilter
                            );

                    return (
                        matchesSearch &&
                        matchesType &&
                        matchesSeverity &&
                        matchesPriority &&
                        matchesStatus
                    );
                }
            );

        return [
            ...filtered,
        ].sort((a, b) => {
            if (
                sortBy ===
                "oldest"
            ) {
                return (
                    getComparableDate(
                        a
                    ) -
                    getComparableDate(
                        b
                    )
                );
            }

            if (
                sortBy ===
                "severity"
            ) {
                const severityOrder = {
                    critical: 5,
                    severe: 5,
                    high: 4,
                    medium: 3,
                    low: 2,
                    minor: 1,
                };

                return (
                    (severityOrder[
                        normalizeText(
                            b?.severity
                        )
                    ] || 0) -
                    (severityOrder[
                        normalizeText(
                            a?.severity
                        )
                    ] || 0)
                );
            }

            return (
                getComparableDate(
                    b
                ) -
                getComparableDate(
                    a
                )
            );
        });
    }, [
        records,
        searchTerm,
        typeFilter,
        severityFilter,
        priorityFilter,
        statusFilter,
        sortBy,
    ]);

    // ========================================================
    // COUNTS
    // ========================================================

    const riskCount = useMemo(
        () =>
            records.filter(
                (item) =>
                    getTypeLabel(
                        item
                    ) === "Risk"
            ).length,
        [records]
    );

    const issueCount = useMemo(
        () =>
            records.filter(
                (item) =>
                    getTypeLabel(
                        item
                    ) === "Issue"
            ).length,
        [records]
    );

    const openCount = useMemo(
        () =>
            records.filter(
                (item) => {
                    const status =
                        normalizeText(
                            item?.status
                        );

                    return (
                        status.includes(
                            "open"
                        ) ||
                        status.includes(
                            "active"
                        ) ||
                        status.includes(
                            "progress"
                        ) ||
                        status.includes(
                            "ongoing"
                        )
                    );
                }
            ).length,
        [records]
    );

    // ========================================================
    // RESET FILTERS
    // ========================================================

    const resetFilters = () => {
        setSearchTerm("");
        setTypeFilter("all");
        setSeverityFilter("all");
        setPriorityFilter("all");
        setStatusFilter("all");
        setSortBy("newest");
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        if (!selectedProjectId) {
            await loadProjects();
            return;
        }

        await loadRisksAndIssues(
            selectedProjectId
        );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
                                <ShieldAlert className="h-6 w-6 text-orange-400" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Risks & Issues
                                </h1>

                                <p className="mt-1 text-sm text-slate-400">
                                    REPORT-003 — View Risk and Issues
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loadingProjects ||
                            loadingRecords
                        }
                        className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                        {loadingProjects ||
                        loadingRecords ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}

                        Refresh
                    </Button>
                </div>

                {/* PROJECT SELECTOR */}
                <div className="mb-6 rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                    <label
                        htmlFor="risk-project-selector"
                        className="mb-2 block text-sm font-medium text-slate-300"
                    >
                        Project
                    </label>

                    <select
                        id="risk-project-selector"
                        value={
                            selectedProjectId
                        }
                        onChange={(event) =>
                            setSelectedProjectId(
                                event.target
                                    .value
                            )
                        }
                        disabled={
                            loadingProjects ||
                            projects.length ===
                                0
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    >
                        {loadingProjects ? (
                            <option value="">
                                Loading authorized projects...
                            </option>
                        ) : projects.length ===
                          0 ? (
                            <option value="">
                                No authorized projects
                            </option>
                        ) : (
                            <>
                                <option value="">
                                    Select a project
                                </option>

                                {projects.map(
                                    (project) => {
                                        const id =
                                            getId(
                                                project
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
                                                    project
                                                )}
                                            </option>
                                        );
                                    }
                                )}
                            </>
                        )}
                    </select>

                    <p className="mt-2 text-xs text-slate-500">
                        Only projects authorized for the current Manager are available.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="font-medium">
                                Unable to load risks and issues
                            </p>

                            <p className="mt-1 text-sm text-red-300/80">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* NO PROJECT */}
                {!loadingProjects &&
                    projects.length ===
                        0 && (
                        <EmptyState
                            message="You do not have any authorized projects."
                            icon={
                                ShieldAlert
                            }
                        />
                    )}

                {selectedProjectId && (
                    <>
                        {/* PROJECT HEADER */}
                        <div className="mb-6 rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="h-5 w-5 text-orange-400" />

                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Selected Project
                                    </p>

                                    <h2 className="text-xl font-semibold text-white">
                                        {getName(
                                            selectedProject,
                                            "Project"
                                        )}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                                <p className="text-sm text-slate-400">
                                    Total
                                </p>

                                <p className="mt-2 text-2xl font-bold text-white">
                                    {records.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                                <p className="text-sm text-slate-400">
                                    Risks
                                </p>

                                <p className="mt-2 text-2xl font-bold text-purple-400">
                                    {riskCount}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                                <p className="text-sm text-slate-400">
                                    Issues
                                </p>

                                <p className="mt-2 text-2xl font-bold text-orange-400">
                                    {issueCount}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                                <p className="text-sm text-slate-400">
                                    Open / Active
                                </p>

                                <p className="mt-2 text-2xl font-bold text-blue-400">
                                    {openCount}
                                </p>
                            </div>
                        </div>

                        {/* FILTERS */}
                        <div className="mb-6 rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-slate-400" />

                                    <h2 className="font-semibold text-white">
                                        Filters & Sorting
                                    </h2>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={
                                        resetFilters
                                    }
                                    className="text-slate-400 hover:bg-slate-800 hover:text-white"
                                >
                                    Reset
                                </Button>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                                <div className="relative xl:col-span-2">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                    <input
                                        type="text"
                                        value={
                                            searchTerm
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearchTerm(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Search title, description, reporter..."
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                                    />
                                </div>

                                <select
                                    value={
                                        typeFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTypeFilter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                                >
                                    <option value="all">
                                        All Types
                                    </option>
                                    <option value="Risk">
                                        Risk
                                    </option>
                                    <option value="Issue">
                                        Issue
                                    </option>
                                </select>

                                <select
                                    value={
                                        severityFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSeverityFilter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                                >
                                    <option value="all">
                                        All Severities
                                    </option>

                                    {filterOptions.severities.map(
                                        (
                                            value
                                        ) => (
                                            <option
                                                key={
                                                    value
                                                }
                                                value={
                                                    value
                                                }
                                            >
                                                {
                                                    value
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    value={
                                        priorityFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setPriorityFilter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                                >
                                    <option value="all">
                                        All Priorities
                                    </option>

                                    {filterOptions.priorities.map(
                                        (
                                            value
                                        ) => (
                                            <option
                                                key={
                                                    value
                                                }
                                                value={
                                                    value
                                                }
                                            >
                                                {
                                                    value
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setStatusFilter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                                >
                                    <option value="all">
                                        All Statuses
                                    </option>

                                    {filterOptions.statuses.map(
                                        (
                                            value
                                        ) => (
                                            <option
                                                key={
                                                    value
                                                }
                                                value={
                                                    value
                                                }
                                            >
                                                {
                                                    value
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Filter className="h-4 w-4" />

                                    Showing{" "}
                                    {
                                        filteredRecords.length
                                    }{" "}
                                    of{" "}
                                    {
                                        records.length
                                    }{" "}
                                    records
                                </div>

                                <select
                                    value={
                                        sortBy
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSortBy(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                                >
                                    <option value="newest">
                                        Newest Reported
                                    </option>

                                    <option value="oldest">
                                        Oldest Reported
                                    </option>

                                    <option value="severity">
                                        Highest Severity
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* RECORDS */}
                        <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-lg bg-slate-800 p-2">
                                    <ShieldAlert className="h-5 w-5 text-orange-400" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-white">
                                        Risks & Issues
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Read-only project risk and issue information.
                                    </p>
                                </div>
                            </div>

                            {loadingRecords ? (
                                <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-400">
                                    <Loader2 className="h-5 w-5 animate-spin" />

                                    Loading risks and issues...
                                </div>
                            ) : filteredRecords.length ===
                              0 ? (
                                <EmptyState
                                    message={
                                        records.length ===
                                        0
                                            ? "No risks or issues have been recorded for this project."
                                            : "No risks or issues match the selected filters."
                                    }
                                    icon={
                                        records.length ===
                                        0
                                            ? CheckCircle2
                                            : Search
                                    }
                                />
                            ) : (
                                <div className="space-y-4">
                                    {filteredRecords.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <RiskIssueCard
                                                key={String(
                                                    getId(
                                                        item
                                                    ) ||
                                                        index
                                                )}
                                                item={
                                                    item
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* READ-ONLY NOTICE */}
                {selectedProjectId && (
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />

                        <div>
                            <p className="text-sm font-medium text-blue-300">
                                Read-only monitoring view
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Viewing risks and issues does not grant permission to modify or delete risk and issue records.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}