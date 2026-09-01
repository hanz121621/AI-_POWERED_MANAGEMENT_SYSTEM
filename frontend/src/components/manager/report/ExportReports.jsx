import { useEffect, useMemo, useState } from "react";
import {
    Download,
    FileDown,
    FileText,
    FileSpreadsheet,
    FileJson,
    Loader2,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// ============================================================
// CONFIGURATION
// ============================================================
//
// IMPORTANT:
// No project/report information is stored in localStorage.
//
// The component expects the backend to provide:
//   1. Authorized projects
//   2. Available/configured export formats
//   3. The generated report file
//
// Change only the API_BASE_URL if your project uses another
// backend URL.
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5043";

// ============================================================
// API ENDPOINTS
// ============================================================
//
// These are kept in one place so they can easily be changed
// to match your backend controller routes.
//
// Expected backend contract:
//
// GET  /api/reports/projects
// GET  /api/reports/export/formats
// POST /api/reports/export
//
// POST body:
//
// {
//     reportType: "...",
//     projectId: "...",
//     format: "..."
// }
//
// The backend should:
// - authenticate the current manager
// - authorize the project
// - retrieve current database data
// - generate the file
// - return the generated file
// ============================================================

const ENDPOINTS = {
    projects: "/api/reports/projects",
    formats: "/api/reports/export/formats",
    export: "/api/reports/export",
};

// ============================================================
// REPORT TYPES
// ============================================================
//
// These are report identifiers, not report data.
//
// They correspond to the reports already being implemented:
//
// REPORT-001 Project Dashboard
// REPORT-002 Project Timeline
// REPORT-003 Risks and Issues
// REPORT-004 Sprint Progress
// REPORT-005 AI Project Summary
//
// REPORT-006 is the export operation itself.
// ============================================================

const REPORT_TYPES = [
    {
        id: "project-dashboard",
        name: "Project Dashboard",
        description:
            "Export the current project dashboard report.",
    },
    {
        id: "project-timeline",
        name: "Project Timeline",
        description:
            "Export the current project timeline.",
    },
    {
        id: "risks-and-issues",
        name: "Risks and Issues",
        description:
            "Export the current project risks and issues.",
    },
    {
        id: "sprint-progress",
        name: "Sprint Progress",
        description:
            "Export the current sprint progress report.",
    },
    {
        id: "ai-project-summary",
        name: "AI Project Summary",
        description:
            "Export the current AI-generated project summary.",
    },
];

// ============================================================
// FORMAT ICON
// ============================================================

const getFormatIcon = (format) => {
    const normalized =
        String(format || "")
            .trim()
            .toLowerCase();

    if (
        normalized.includes("excel") ||
        normalized.includes("xlsx") ||
        normalized.includes("spreadsheet")
    ) {
        return FileSpreadsheet;
    }

    if (
        normalized.includes("json")
    ) {
        return FileJson;
    }

    if (
        normalized.includes("pdf")
    ) {
        return FileText;
    }

    if (
        normalized.includes("csv")
    ) {
        return FileSpreadsheet;
    }

    return FileDown;
};

// ============================================================
// FORMAT LABEL
// ============================================================

const getFormatLabel = (format) => {
    if (!format) {
        return "Unknown";
    }

    if (typeof format === "string") {
        return format;
    }

    return (
        format.name ||
        format.label ||
        format.displayName ||
        format.format ||
        format.extension ||
        "Unknown"
    );
};

// ============================================================
// FORMAT VALUE
// ============================================================

const getFormatValue = (format) => {
    if (!format) {
        return "";
    }

    if (typeof format === "string") {
        return format;
    }

    return (
        format.value ||
        format.id ||
        format.format ||
        format.name ||
        format.extension ||
        ""
    );
};

// ============================================================
// PROJECT ID
// ============================================================

const getProjectId = (project) => {
    if (!project) {
        return "";
    }

    return String(
        project.id ??
            project.projectId ??
            project.projectID ??
            project._id ??
            ""
    );
};

// ============================================================
// PROJECT NAME
// ============================================================

const getProjectName = (project) => {
    if (!project) {
        return "Unnamed Project";
    }

    return (
        project.name ||
        project.projectName ||
        project.title ||
        "Unnamed Project"
    );
};

// ============================================================
// RESPONSE ERROR
// ============================================================

const getApiErrorMessage = async (
    response
) => {
    try {
        const contentType =
            response.headers.get(
                "content-type"
            );

        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {
            const body =
                await response.json();

            return (
                body.message ||
                body.error ||
                body.detail ||
                body.title ||
                `Request failed with status ${response.status}.`
            );
        }

        const text =
            await response.text();

        return (
            text ||
            `Request failed with status ${response.status}.`
        );
    } catch {
        return `Request failed with status ${response.status}.`;
    }
};

// ============================================================
// DOWNLOAD FILE
// ============================================================

const downloadBlob = (
    blob,
    filename
) => {
    const url =
        window.URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href = url;
    link.download = filename;

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
        url
    );
};

// ============================================================
// EXTRACT FILENAME
// ============================================================

const getFilenameFromResponse = (
    response,
    fallback
) => {
    const disposition =
        response.headers.get(
            "content-disposition"
        );

    if (!disposition) {
        return fallback;
    }

    const utfMatch =
        disposition.match(
            /filename\*=UTF-8''([^;]+)/i
        );

    if (utfMatch?.[1]) {
        try {
            return decodeURIComponent(
                utfMatch[1]
            );
        } catch {
            return utfMatch[1];
        }
    }

    const filenameMatch =
        disposition.match(
            /filename="?([^"]+)"?/i
        );

    if (filenameMatch?.[1]) {
        return filenameMatch[1];
    }

    return fallback;
};

// ============================================================
// COMPONENT
// ============================================================

function ExportReports() {
    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] =
        useState([]);

    const [formats, setFormats] =
        useState([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [selectedReportType, setSelectedReportType] =
        useState("");

    const [selectedFormat, setSelectedFormat] =
        useState("");

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingFormats, setLoadingFormats] =
        useState(true);

    const [exporting, setExporting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ========================================================
    // AUTH HEADER
    // ========================================================
    //
    // Authentication should be handled by your existing
    // authentication mechanism.
    //
    // We intentionally do NOT read localStorage here.
    //
    // If your application uses an axios instance/interceptor,
    // replace fetch calls with that existing API client.
    // ========================================================

    const requestHeaders = useMemo(
        () => ({
            Accept:
                "application/json",
        }),
        []
    );

    // ========================================================
    // LOAD AUTHORIZED PROJECTS
    // ========================================================

    const loadProjects = async () => {
        setLoadingProjects(true);
        setError("");

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}${ENDPOINTS.projects}`,
                    {
                        method: "GET",
                        headers:
                            requestHeaders,
                        credentials:
                            "include",
                    }
                );

            if (!response.ok) {
                throw new Error(
                    await getApiErrorMessage(
                        response
                    )
                );
            }

            const result =
                await response.json();

            const data =
                Array.isArray(result)
                    ? result
                    : Array.isArray(
                          result?.data
                      )
                    ? result.data
                    : Array.isArray(
                          result?.items
                      )
                    ? result.items
                    : [];

            setProjects(data);

            if (
                data.length > 0
            ) {
                const firstProjectId =
                    getProjectId(
                        data[0]
                    );

                setSelectedProjectId(
                    firstProjectId
                );
            } else {
                setSelectedProjectId(
                    ""
                );
            }
        } catch (err) {
            console.error(
                "Failed to load authorized projects:",
                err
            );

            setProjects([]);

            setError(
                err?.message ||
                    "Unable to load authorized projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    };

    // ========================================================
    // LOAD EXPORT FORMATS
    // ========================================================

    const loadFormats = async () => {
        setLoadingFormats(true);
        setError("");

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}${ENDPOINTS.formats}`,
                    {
                        method: "GET",
                        headers:
                            requestHeaders,
                        credentials:
                            "include",
                    }
                );

            if (!response.ok) {
                throw new Error(
                    await getApiErrorMessage(
                        response
                    )
                );
            }

            const result =
                await response.json();

            const data =
                Array.isArray(result)
                    ? result
                    : Array.isArray(
                          result?.data
                      )
                    ? result.data
                    : Array.isArray(
                          result?.formats
                      )
                    ? result.formats
                    : [];

            setFormats(data);

            if (
                data.length > 0
            ) {
                setSelectedFormat(
                    getFormatValue(
                        data[0]
                    )
                );
            } else {
                setSelectedFormat(
                    ""
                );
            }
        } catch (err) {
            console.error(
                "Failed to load export formats:",
                err
            );

            setFormats([]);

            setError(
                err?.message ||
                    "Unable to load configured export formats."
            );
        } finally {
            setLoadingFormats(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadProjects();
        loadFormats();
    }, []);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject =
        projects.find(
            (project) =>
                getProjectId(
                    project
                ) ===
                String(
                    selectedProjectId
                )
        ) || null;

    // ========================================================
    // SELECTED REPORT
    // ========================================================

    const selectedReport =
        REPORT_TYPES.find(
            (report) =>
                report.id ===
                selectedReportType
        ) || null;

    // ========================================================
    // VALIDATION
    // ========================================================

    const canExport =
        Boolean(
            selectedProjectId &&
                selectedReportType &&
                selectedFormat &&
                !exporting
        );

    // ========================================================
    // EXPORT REPORT
    // ========================================================

    const handleExport =
        async () => {
            setError("");
            setSuccess("");

            if (
                !selectedProjectId
            ) {
                setError(
                    "Please select an authorized project."
                );
                return;
            }

            if (
                !selectedReportType
            ) {
                setError(
                    "Please select a report."
                );
                return;
            }

            if (
                !selectedFormat
            ) {
                setError(
                    "Please select an export format."
                );
                return;
            }

            setExporting(true);

            try {
                const response =
                    await fetch(
                        `${API_BASE_URL}${ENDPOINTS.export}`,
                        {
                            method: "POST",

                            headers: {
                                ...requestHeaders,
                                "Content-Type":
                                    "application/json",
                            },

                            credentials:
                                "include",

                            body: JSON.stringify(
                                {
                                    projectId:
                                        selectedProjectId,

                                    reportType:
                                        selectedReportType,

                                    format:
                                        selectedFormat,
                                }
                            ),
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        await getApiErrorMessage(
                            response
                        )
                    );
                }

                const blob =
                    await response.blob();

                if (
                    !blob ||
                    blob.size === 0
                ) {
                    throw new Error(
                        "The server returned an empty report file."
                    );
                }

                const extension =
                    String(
                        selectedFormat
                    )
                        .replace(
                            /^\./,
                            ""
                        )
                        .toLowerCase();

                const projectName =
                    getProjectName(
                        selectedProject
                    )
                        .replace(
                            /[^a-z0-9]+/gi,
                            "-"
                        )
                        .replace(
                            /^-+|-+$/g,
                            ""
                        )
                        .toLowerCase();

                const reportName =
                    selectedReport?.name
                        ? selectedReport.name
                              .replace(
                                  /[^a-z0-9]+/gi,
                                  "-"
                              )
                              .replace(
                                  /^-+|-+$/g,
                                  ""
                              )
                              .toLowerCase()
                        : "report";

                const fallbackFilename =
                    `${projectName || "project"}-${reportName || "report"}.${extension || "file"}`;

                const filename =
                    getFilenameFromResponse(
                        response,
                        fallbackFilename
                    );

                downloadBlob(
                    blob,
                    filename
                );

                setSuccess(
                    "Report exported successfully."
                );
            } catch (err) {
                console.error(
                    "Report export failed:",
                    err
                );

                setError(
                    err?.message ||
                        "Unable to export the report."
                );
            } finally {
                setExporting(false);
            }
        };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh =
        async () => {
            setError("");
            setSuccess("");

            await Promise.all([
                loadProjects(),
                loadFormats(),
            ]);
        };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                            <FileDown
                                className="h-5 w-5"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Export Reports
                            </h1>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Export authorized project reports using current system data.
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
                        loadingFormats ||
                        exporting
                    }
                    className="gap-2"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loadingProjects ||
                            loadingFormats
                                ? "animate-spin"
                                : ""
                        }`}
                    />

                    Refresh
                </Button>
            </div>

            {/* ==================================================
                SECURITY NOTICE
            ================================================== */}

            <Card className="mb-6 border-slate-200 dark:border-slate-800">
                <CardContent className="flex gap-4 p-5">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Authorized Data Only
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Only projects and information authorized for the
                            current Manager should be included in an export.
                            The report is generated from the latest available
                            system data.
                        </p>
                    </div>

                </CardContent>
            </Card>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-medium">
                            Export Error
                        </p>

                        <p className="mt-1 text-sm">
                            {error}
                        </p>
                    </div>

                </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-medium">
                            Export Complete
                        </p>

                        <p className="mt-1 text-sm">
                            {success}
                        </p>
                    </div>

                </div>
            )}

            {/* ==================================================
                EXPORT FORM
            ================================================== */}

            <Card className="border-slate-200 shadow-sm dark:border-slate-800">

                <CardHeader>
                    <CardTitle>
                        Generate Report File
                    </CardTitle>

                    <CardDescription>
                        Select an authorized project, report, and configured export format.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* ==================================================
                        PROJECT
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="export-project"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Project
                        </label>

                        {loadingProjects ? (
                            <div className="flex h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading authorized projects...
                            </div>
                        ) : (
                            <select
                                id="export-project"
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
                                    projects.length ===
                                        0 ||
                                    exporting
                                }
                                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-slate-800"
                            >
                                <option value="">
                                    Select an authorized project
                                </option>

                                {projects.map(
                                    (project) => {
                                        const id =
                                            getProjectId(
                                                project
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
                                                {getProjectName(
                                                    project
                                                )}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        )}

                        {!loadingProjects &&
                            projects.length ===
                                0 && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No authorized projects are available.
                                </p>
                            )}
                    </div>

                    {/* ==================================================
                        REPORT
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="export-report"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Report
                        </label>

                        <select
                            id="export-report"
                            value={
                                selectedReportType
                            }
                            onChange={(event) =>
                                setSelectedReportType(
                                    event.target
                                        .value
                                )
                            }
                            disabled={
                                exporting
                            }
                            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-slate-800"
                        >
                            <option value="">
                                Select a report
                            </option>

                            {REPORT_TYPES.map(
                                (report) => (
                                    <option
                                        key={
                                            report.id
                                        }
                                        value={
                                            report.id
                                        }
                                    >
                                        {
                                            report.name
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        {selectedReport && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {
                                    selectedReport.description
                                }
                            </p>
                        )}
                    </div>

                    {/* ==================================================
                        FORMAT
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="export-format"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Export Format
                        </label>

                        {loadingFormats ? (
                            <div className="flex h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading configured formats...
                            </div>
                        ) : (
                            <select
                                id="export-format"
                                value={
                                    selectedFormat
                                }
                                onChange={(event) =>
                                    setSelectedFormat(
                                        event.target
                                            .value
                                    )
                                }
                                disabled={
                                    formats.length ===
                                        0 ||
                                    exporting
                                }
                                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-slate-800"
                            >
                                <option value="">
                                    Select an export format
                                </option>

                                {formats.map(
                                    (
                                        format,
                                        index
                                    ) => {
                                        const value =
                                            getFormatValue(
                                                format
                                            );

                                        return (
                                            <option
                                                key={`${value}-${index}`}
                                                value={
                                                    value
                                                }
                                            >
                                                {getFormatLabel(
                                                    format
                                                )}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        )}

                        {!loadingFormats &&
                            formats.length ===
                                0 && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No export formats are currently configured.
                                </p>
                            )}
                    </div>

                    {/* ==================================================
                        SELECTED SUMMARY
                    ================================================== */}

                    {(selectedProject ||
                        selectedReport ||
                        selectedFormat) && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">

                            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                Export Summary
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-3">

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Project
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                        {selectedProject
                                            ? getProjectName(
                                                  selectedProject
                                              )
                                            : "Not selected"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Report
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                        {selectedReport
                                            ? selectedReport.name
                                            : "Not selected"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Format
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">

                                        {selectedFormat &&
                                            (() => {
                                                const Icon =
                                                    getFormatIcon(
                                                        selectedFormat
                                                    );

                                                return (
                                                    <Icon className="h-4 w-4" />
                                                );
                                            })()}

                                        {selectedFormat ||
                                            "Not selected"}

                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* ==================================================
                        EXPORT BUTTON
                    ================================================== */}

                    <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800">

                        <Button
                            type="button"
                            onClick={
                                handleExport
                            }
                            disabled={
                                !canExport
                            }
                            className="gap-2"
                        >
                            {exporting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />

                                    Generating Report...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />

                                    Export Report
                                </>
                            )}
                        </Button>

                    </div>

                </CardContent>
            </Card>

            {/* ==================================================
                BUSINESS RULES
            ================================================== */}

            <div className="mt-6 grid gap-4 md:grid-cols-3">

                <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="p-5">
                        <ShieldCheck className="mb-3 h-5 w-5 text-emerald-600" />

                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Authorization
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Only authorized project information can be exported.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="p-5">
                        <RefreshCw className="mb-3 h-5 w-5 text-blue-600" />

                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Current Data
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Reports are generated from the latest available database information.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="p-5">
                        <FileDown className="mb-3 h-5 w-5 text-violet-600" />

                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Configured Formats
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Export formats are obtained from the system configuration.
                        </p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

export default ExportReports;