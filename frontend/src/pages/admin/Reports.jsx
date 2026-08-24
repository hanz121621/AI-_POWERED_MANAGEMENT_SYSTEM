import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Activity,
    BarChart3,
    Bot,
    CalendarDays,
    FileClock,
    FileText,
    FolderKanban,
    LayoutDashboard,
    ShieldCheck,
    UsersRound,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import ReportFilters from "@/components/admin/reports/ReportFilters";
import ProjectReport from "@/components/admin/reports/ProjectReport";
import TeamReport from "@/components/admin/reports/TeamReport";
import TaskReport from "@/components/admin/reports/TaskReport";
import UserActivityReport from "@/components/admin/reports/UserActivityReport";
import AIUsageReport from "@/components/admin/reports/AIUsageReport";
import ActivityLogs from "@/components/admin/reports/ActivityLogs";
import AuditLogs from "@/components/admin/reports/AuditLogs";
import SystemReportTable from "@/components/admin/reports/SystemReportTable";

import {
    generateSystemReport,
    getReportFilterOptions,
    recordReportAccess,
} from "@/services/reportService";

import {
    getCurrentUser,
} from "@/services/authService";

// ============================================================
// MON-001 — VIEW SYSTEM REPORTS
// MON-002 — VIEW ACTIVITY LOGS
// MON-003 — VIEW AUDIT LOGS
// ============================================================

function Reports({
    users = [],
    projects = [],
    teams = [],
    tasks = [],
    activityLogs = [],
    auditLogs = [],
    aiUsage = [],
    loading: externalLoading = false,
    error: externalError = "",
    onRefresh,
}) {
    // ========================================================
    // AUTHORIZATION
    // ========================================================

  const currentUser = useMemo(
    () => getCurrentUser(),
    []
);

const canViewReports = useMemo(
    () => {
        const role =
            currentUser?.role ??
            currentUser?.Role ??
            "";

        return role === "Admin";
    },
    [currentUser]
);

    // ========================================================
    // STATE
    // ========================================================

    const [selectedActivity, setSelectedActivity] =
        useState(null);

    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        projectId: "all",
        teamId: "all",
        userId: "all",
    });

    // MON-003 AUDIT FILTERS
    const [auditFilters, setAuditFilters] = useState({
        dateFrom: "",
        dateTo: "",
        userId: "all",
        actionType: "all",
        module: "all",
    });

    const [activeTab, setActiveTab] =
        useState("overview");

    const [reportData, setReportData] =
        useState(null);

    const [filterOptions, setFilterOptions] =
        useState({
            users: [],
            projects: [],
            teams: [],
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [noData, setNoData] =
        useState(false);

    const [noFilteredResults, setNoFilteredResults] =
        useState(false);

    // ========================================================
    // STABLE DATA REFS
    //
    // IMPORTANT:
    // Do NOT put these arrays directly into the report
    // generation effect dependencies.
    //
    // Parent components may recreate these arrays on every
    // render. Reading them through refs prevents the report
    // effect from continuously recreating itself.
    // ========================================================

   const usersRef = useRef(users);
const projectsRef = useRef(projects);
const teamsRef = useRef(teams);
const tasksRef = useRef(tasks);
const activityLogsRef = useRef(activityLogs);
const auditLogsRef = useRef(auditLogs);
const aiUsageRef = useRef(aiUsage);

useEffect(() => {
    usersRef.current = users;
    projectsRef.current = projects;
    teamsRef.current = teams;
    tasksRef.current = tasks;
    activityLogsRef.current = activityLogs;
    auditLogsRef.current = auditLogs;
    aiUsageRef.current = aiUsage;
}, [
    users,
    projects,
    teams,
    tasks,
    activityLogs,
    auditLogs,
    aiUsage,
]);

    // ========================================================
    // STABLE DATA SIGNATURE
    //
    // The effect should run when the actual data changes,
    // not simply because the parent created a new array.
    // ========================================================

    const reportDataSignature = useMemo(() => {
        try {
            return JSON.stringify({
                users,
                projects,
                teams,
                tasks,
                activityLogs,
                auditLogs,
                aiUsage,
            });
        } catch {
            return [
                users.length,
                projects.length,
                teams.length,
                tasks.length,
                activityLogs.length,
                auditLogs.length,
                aiUsage.length,
            ].join("|");
        }
    }, [
        users,
        projects,
        teams,
        tasks,
        activityLogs,
        auditLogs,
        aiUsage,
    ]);

    // ========================================================
    // STABLE FILTER SIGNATURE
    //
    // Instead of using the filters object directly as a
    // dependency, use its primitive values.
    // ========================================================

    const filterSignature = useMemo(
        () =>
            JSON.stringify({
                dateFrom: filters.dateFrom || "",
                dateTo: filters.dateTo || "",
                projectId:
                    filters.projectId || "all",
                teamId:
                    filters.teamId || "all",
                userId:
                    filters.userId || "all",
            }),
        [
            filters.dateFrom,
            filters.dateTo,
            filters.projectId,
            filters.teamId,
            filters.userId,
        ]
    );

    // ========================================================
    // REPORT ACCESS RECORDING GUARD
    // ========================================================

    const recordedReportAccessRef =
        useRef(new Set());

    // ========================================================
    // COMBINED LOADING / ERROR
    // ========================================================

    const isLoading =
        loading || externalLoading;

    const displayError =
    !canViewReports
        ? "Access denied."
        : error || externalError;

    // ========================================================
    // LOAD REPORT FILTER OPTIONS
    // MON-001 / BR7
    //
    // IMPORTANT:
    // This callback deliberately has no array dependencies.
    // It reads the newest arrays from refs.
    // ========================================================

    const loadFilterOptions = useCallback(
        async () => {
            const currentUsers =
                usersRef.current || [];

            const currentProjects =
                projectsRef.current || [];

            const currentTeams =
                teamsRef.current || [];

            try {
                const result =
                    await getReportFilterOptions({
                        users: currentUsers,
                        projects: currentProjects,
                        teams: currentTeams,
                    });

                setFilterOptions({
                    users:
                        result?.users || [],
                    projects:
                        result?.projects || [],
                    teams:
                        result?.teams || [],
                });
            } catch (err) {
                console.error(
                    "Unable to load report filter options:",
                    err
                );

                // ------------------------------------------------
                // FALLBACK TO CURRENT SYSTEM DATA
                // ------------------------------------------------

                setFilterOptions({
                    users: currentUsers
                        .map((user) => ({
                            id: String(
                                user?.id ??
                                    user?._id ??
                                    user?.userId ??
                                    ""
                            ),
                            name:
                                user?.fullName ||
                                user?.name ||
                                user?.username ||
                                user?.email ||
                                "Unknown User",
                        }))
                        .filter(
                            (user) =>
                                user.id !== ""
                        ),

                    projects: currentProjects
                        .map((project) => ({
                            id: String(
                                project?.id ??
                                    project?._id ??
                                    project?.projectId ??
                                    ""
                            ),
                            name:
                                project?.name ||
                                project?.title ||
                                project?.projectName ||
                                "Unnamed Project",
                        }))
                        .filter(
                            (project) =>
                                project.id !== ""
                        ),

                    teams: currentTeams
                        .map((team) => ({
                            id: String(
                                team?.id ??
                                    team?._id ??
                                    team?.teamId ??
                                    ""
                            ),
                            name:
                                team?.name ||
                                team?.title ||
                                team?.teamName ||
                                "Unnamed Team",
                        }))
                        .filter(
                            (team) =>
                                team.id !== ""
                        ),
                });
            }
        },
        []
    );

    // ========================================================
    // RECORD REPORT ACCESS
    // MON-001 / BR5
    //
    // IMPORTANT:
    // This callback depends only on primitive filter values.
    // It does NOT depend on the filters object itself.
    // ========================================================

    const safelyRecordReportAccess =
        useCallback(
            async (result) => {
                if (!currentUser) {
                    return;
                }

                if (!result || result.error) {
                    return;
                }

                const accessKey =
                    JSON.stringify({
                        userId:
                            currentUser?.id ??
                            currentUser?._id ??
                            currentUser?.userId ??
                            currentUser?.email ??
                            "",

                        filters: {
                            dateFrom:
                                filters.dateFrom ||
                                "",
                            dateTo:
                                filters.dateTo ||
                                "",
                            projectId:
                                filters.projectId ||
                                "all",
                            teamId:
                                filters.teamId ||
                                "all",
                            userId:
                                filters.userId ||
                                "all",
                        },

                        summary:
                            result?.summary || {},
                    });

                if (
                    recordedReportAccessRef.current.has(
                        accessKey
                    )
                ) {
                    return;
                }

                try {
                    await recordReportAccess({
                        currentUser,

                        filters: {
                            dateFrom:
                                filters.dateFrom ||
                                "",
                            dateTo:
                                filters.dateTo ||
                                "",
                            projectId:
                                filters.projectId ||
                                "all",
                            teamId:
                                filters.teamId ||
                                "all",
                            userId:
                                filters.userId ||
                                "all",
                        },

                        reportSummary:
                            result?.summary || {},
                    });

                    recordedReportAccessRef.current.add(
                        accessKey
                    );
                } catch (logError) {
                    console.error(
                        "Unable to record report access:",
                        logError
                    );
                }
            },
            [
                currentUser,
                filters.dateFrom,
                filters.dateTo,
                filters.projectId,
                filters.teamId,
                filters.userId,
            ]
        );

    // ========================================================
    // GENERATE SYSTEM REPORT
    // MON-001
    //
    // IMPORTANT:
    // The callback does NOT depend on users/projects/etc.
    // directly. It reads them from refs.
    // ========================================================

    const loadReport = useCallback(
        async () => {
            if (!canViewReports) {
                setReportData(null);
                setNoData(false);
                setNoFilteredResults(false);
                setError("Access denied.");
                return;
            }

            const currentUsers =
                usersRef.current || [];

            const currentProjects =
                projectsRef.current || [];

            const currentTeams =
                teamsRef.current || [];

            const currentTasks =
                tasksRef.current || [];

            const currentActivityLogs =
                activityLogsRef.current || [];

            const currentAuditLogs =
                auditLogsRef.current || [];

            const currentAIUsage =
                aiUsageRef.current || [];

            setLoading(true);
            setError("");
            setNoData(false);
            setNoFilteredResults(false);

            try {
                const result =
                    await generateSystemReport({
                        filters: {
                            dateFrom:
                                filters.dateFrom ||
                                "",
                            dateTo:
                                filters.dateTo ||
                                "",
                            projectId:
                                filters.projectId ||
                                "all",
                            teamId:
                                filters.teamId ||
                                "all",
                            userId:
                                filters.userId ||
                                "all",
                        },

                        users: currentUsers,
                        projects: currentProjects,
                        teams: currentTeams,
                        tasks: currentTasks,
                        activityLogs:
                            currentActivityLogs,
                        auditLogs:
                            currentAuditLogs,
                        aiUsage:
                            currentAIUsage,
                        currentUser,
                    });

                // =================================================
                // SERVICE ERROR HANDLING
                // =================================================

                if (
                    !result ||
                    result.error
                ) {
                    const serviceError =
                        result?.error || "";

                    if (
                        serviceError ===
                        "ACCESS_DENIED"
                    ) {
                        setError(
                            "Access denied."
                        );

                        setReportData(null);
                        return;
                    }

                    if (
                        serviceError ===
                        "NO_DATA"
                    ) {
                        setNoData(true);
                        setReportData(null);
                        return;
                    }

                    if (
                        serviceError ===
                        "NO_FILTER_RESULTS"
                    ) {
                        setNoFilteredResults(
                            true
                        );

                        setReportData({
                            summary: {},
                            reports: [],
                            projects: [],
                            teams: [],
                            tasks: [],
                            activityLogs: [],
                            auditLogs: [],
                            aiUsage: [],
                        });

                        return;
                    }

                    throw new Error(
                        serviceError ||
                            "Unable to generate system reports."
                    );
                }

                // =================================================
                // SAVE REPORT DATA
                // =================================================

                setReportData(result);

                const hasReportRecords =
                    Array.isArray(
                        result?.reports
                    )
                        ? result.reports.length >
                          0
                        : true;

                const hasFilters =
                    Boolean(
                        filters.dateFrom ||
                        filters.dateTo ||
                        filters.projectId !==
                            "all" ||
                        filters.teamId !==
                            "all" ||
                        filters.userId !==
                            "all"
                    );

                if (
                    hasFilters &&
                    !hasReportRecords
                ) {
                    setNoFilteredResults(
                        true
                    );
                }

                // =================================================
                // BR5 — RECORD REPORT ACCESS
                // =================================================

                await safelyRecordReportAccess(
                    result
                );
            } catch (err) {
                console.error(
                    "System report generation failed:",
                    err
                );

                setReportData(null);

                setError(
                    "Unable to generate system reports. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
        [
            canViewReports,
            currentUser,
            filters.dateFrom,
            filters.dateTo,
            filters.projectId,
            filters.teamId,
            filters.userId,
            safelyRecordReportAccess,
        ]
    );

    // ========================================================
    // INITIAL LOAD — FILTER OPTIONS
    //
    // The effect now uses the stable data signature.
    // It cannot continuously rerun just because the parent
    // creates new array references.
    // ========================================================

    useEffect(() => {
    if (!canViewReports) {
        return;
    }

    loadFilterOptions();
}, [
    canViewReports,
    loadFilterOptions,
    reportDataSignature,
]);

    // ========================================================
    // GENERATE REPORT WHEN DATA / FILTERS CHANGE
    //
    // IMPORTANT:
    // Depend on signatures rather than raw arrays.
    // ========================================================

    useEffect(() => {
    if (!canViewReports) {
        return;
    }

    let cancelled = false;

    const runReport = async () => {
        if (cancelled) {
            return;
        }

        await loadReport();
    };

    runReport();

    return () => {
        cancelled = true;
    };
}, [
    canViewReports,
    loadReport,
    reportDataSignature,
    filterSignature,
]);

    // ========================================================
    // RESET REPORT FILTERS
    // ========================================================

    const resetFilters = useCallback(() => {
        setFilters({
            dateFrom: "",
            dateTo: "",
            projectId: "all",
            teamId: "all",
            userId: "all",
        });
    }, []);

    // ========================================================
    // RESET AUDIT FILTERS
    // MON-003
    // ========================================================

    const resetAuditFilters = useCallback(() => {
        setAuditFilters({
            dateFrom: "",
            dateTo: "",
            userId: "all",
            actionType: "all",
            module: "all",
        });
    }, []);

    // ========================================================
    // OPTIONAL REFRESH
    // ========================================================

    const handleRefresh = useCallback(() => {
        recordedReportAccessRef.current.clear();

        if (typeof onRefresh === "function") {
            onRefresh();
        }

        loadFilterOptions();
        loadReport();
    }, [
        onRefresh,
        loadFilterOptions,
        loadReport,
    ]);

    // ========================================================
    // EXPORT PDF
    // ========================================================

    const handleExportPDF = useCallback(() => {
        window.print();
    }, []);

    // ========================================================
    // REPORT DATA
    // ========================================================

    const summary =
        reportData?.summary || {};

    const filteredProjects =
        reportData?.projects || [];

    const filteredTeams =
        reportData?.teams || [];

    const filteredTasks =
        reportData?.tasks || [];

    const filteredActivityLogs =
        reportData?.activityLogs || [];

    const filteredAIUsage =
        reportData?.aiUsage || [];

    const systemReports =
        reportData?.reports || [];

    // ========================================================
    // AUDIT HELPERS
    // MON-003
    // ========================================================

    const getAuditUserId = useCallback(
        (audit) =>
            String(
                audit?.userId ??
                    audit?.user?.id ??
                    audit?.user?._id ??
                    audit?.user?.userId ??
                    ""
            ),
        []
    );

    const getAuditUserName = useCallback(
        (audit) =>
            audit?.userName ||
            audit?.username ||
            audit?.user?.fullName ||
            audit?.user?.name ||
            audit?.user?.username ||
            audit?.user?.email ||
            "Unknown User",
        []
    );

    const getAuditAction = useCallback(
        (audit) =>
            audit?.actionType ||
            audit?.action ||
            audit?.activity ||
            audit?.event ||
            "Unknown Action",
        []
    );

    const getAuditModule = useCallback(
        (audit) =>
            audit?.module ||
            audit?.moduleName ||
            audit?.affectedModule ||
            "Unknown Module",
        []
    );

    const getAuditDate = useCallback(
        (audit) =>
            audit?.dateTime ||
            audit?.timestamp ||
            audit?.createdAt ||
            audit?.date ||
            "",
        []
    );

    // ========================================================
    // AUDIT FILTER OPTIONS
    // ========================================================

    const auditUserOptions = useMemo(() => {
        const map = new Map();

        auditLogs.forEach((audit) => {
            const id =
                getAuditUserId(audit);

            if (!id) {
                return;
            }

            map.set(id, {
                id,
                name:
                    getAuditUserName(
                        audit
                    ),
            });
        });

        users.forEach((user) => {
            const id = String(
                user?.id ??
                    user?._id ??
                    user?.userId ??
                    ""
            );

            if (!id) {
                return;
            }

            map.set(id, {
                id,
                name:
                    user?.fullName ||
                    user?.name ||
                    user?.username ||
                    user?.email ||
                    "Unknown User",
            });
        });

        return Array.from(
            map.values()
        );
    }, [
        auditLogs,
        users,
        getAuditUserId,
        getAuditUserName,
    ]);

    const auditActionOptions = useMemo(() => {
        const values = new Set();

        auditLogs.forEach((audit) => {
            const action =
                getAuditAction(audit);

            if (
                action &&
                action !== "Unknown Action"
            ) {
                values.add(action);
            }
        });

        return Array.from(values).sort();
    }, [
        auditLogs,
        getAuditAction,
    ]);

    const auditModuleOptions = useMemo(() => {
        const values = new Set();

        auditLogs.forEach((audit) => {
            const module =
                getAuditModule(audit);

            if (
                module &&
                module !== "Unknown Module"
            ) {
                values.add(module);
            }
        });

        return Array.from(values).sort();
    }, [
        auditLogs,
        getAuditModule,
    ]);

    // ========================================================
    // DATE RANGE HELPER
    // ========================================================

    const isAuditDateInRange = useCallback(
        (
            auditDate,
            dateFrom,
            dateTo
        ) => {
            if (
                !dateFrom &&
                !dateTo
            ) {
                return true;
            }

            if (!auditDate) {
                return false;
            }

            const date =
                new Date(auditDate);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return false;
            }

            if (dateFrom) {
                const from =
                    new Date(
                        `${dateFrom}T00:00:00`
                    );

                if (date < from) {
                    return false;
                }
            }

            if (dateTo) {
                const to =
                    new Date(
                        `${dateTo}T23:59:59`
                    );

                if (date > to) {
                    return false;
                }
            }

            return true;
        },
        []
    );

    // ========================================================
    // FILTER AUDIT LOGS
    // MON-003
    // ========================================================

    const filteredAuditLogs =
        useMemo(() => {
            return auditLogs.filter(
                (audit) => {
                    if (
                        auditFilters.userId !==
                            "all" &&
                        getAuditUserId(
                            audit
                        ) !==
                            String(
                                auditFilters.userId
                            )
                    ) {
                        return false;
                    }

                    if (
                        auditFilters.actionType !==
                            "all" &&
                        getAuditAction(
                            audit
                        ) !==
                            auditFilters.actionType
                    ) {
                        return false;
                    }

                    if (
                        auditFilters.module !==
                            "all" &&
                        getAuditModule(
                            audit
                        ) !==
                            auditFilters.module
                    ) {
                        return false;
                    }

                    if (
                        !isAuditDateInRange(
                            getAuditDate(
                                audit
                            ),
                            auditFilters.dateFrom,
                            auditFilters.dateTo
                        )
                    ) {
                        return false;
                    }

                    return true;
                }
            );
        }, [
            auditLogs,
            auditFilters.dateFrom,
            auditFilters.dateTo,
            auditFilters.userId,
            auditFilters.actionType,
            auditFilters.module,
            getAuditUserId,
            getAuditAction,
            getAuditModule,
            getAuditDate,
            isAuditDateInRange,
        ]);

    // ========================================================
    // AUDIT FILTER RESULT
    // ========================================================

    const auditHasFilters =
        Boolean(
            auditFilters.dateFrom ||
            auditFilters.dateTo ||
            auditFilters.userId !==
                "all" ||
            auditFilters.actionType !==
                "all" ||
            auditFilters.module !==
                "all"
        );

    const noAuditResults =
        auditHasFilters &&
        filteredAuditLogs.length === 0;

    // ========================================================
    // SAFE SUMMARY
    // ========================================================

    const safeSummary = {
        totalUsers:
            summary.totalUsers ??
            users.length,

        activeUsers:
            summary.activeUsers ??
            users.filter(
                (user) =>
                    user?.active ===
                        true ||
                    user?.status ===
                        "active" ||
                    user?.isActive ===
                        true
            ).length,

        inactiveUsers:
            summary.inactiveUsers ??
            Math.max(
                0,
                (summary.totalUsers ??
                    users.length) -
                    (summary.activeUsers ??
                        users.filter(
                            (user) =>
                                user?.active ===
                                    true ||
                                user?.status ===
                                    "active" ||
                                user?.isActive ===
                                    true
                        ).length)
            ),

        totalProjects:
            summary.totalProjects ??
            filteredProjects.length,

        totalTeams:
            summary.totalTeams ??
            filteredTeams.length,

        totalTasks:
            summary.totalTasks ??
            filteredTasks.length,

        completedTasks:
            summary.completedTasks ??
            0,

        taskCompletionRate:
            summary.taskCompletionRate ??
            0,

        activities:
            summary.activities ??
            filteredActivityLogs.length,

        audits:
            auditLogs.length,

        aiUsage:
            summary.aiUsage ??
            filteredAIUsage.length,
    };

    // ========================================================
    // PROJECT STATUS
    // ========================================================

    const projectStatus = useMemo(() => {
        const statusCounts = {};

        filteredProjects.forEach(
            (project) => {
                const status =
                    project?.status ||
                    project?.projectStatus ||
                    "Unknown";

                statusCounts[status] =
                    (statusCounts[status] || 0) +
                    1;
            }
        );

        return statusCounts;
    }, [filteredProjects]);

    // ========================================================
    // VIEW REPORT
    // ========================================================

    const handleViewReport = useCallback(
        (report) => {
            if (!report) {
                return;
            }

            const category =
                report.category;

            if (category === "Users") {
                setActiveTab("activity");
                return;
            }

            if (category === "Projects") {
                setActiveTab("projects");
                return;
            }

            if (category === "Teams") {
                setActiveTab("teams");
                return;
            }

            if (category === "Tasks") {
                setActiveTab("tasks");
                return;
            }

            if (category === "AI") {
                setActiveTab("ai");
                return;
            }

            if (category === "Activity") {
                setActiveTab("activity");
                return;
            }

            if (category === "Audit") {
                setActiveTab("audit");
            }
        },
        []
    );

    // ========================================================
    // ACTIVITY HELPERS
    // ========================================================

    const getActivityUserName = useCallback(
        (activity) =>
            activity?.userName ||
            activity?.username ||
            activity?.user?.name ||
            activity?.user?.fullName ||
            activity?.user?.username ||
            "Unknown User",
        []
    );

    const getActivityRole = useCallback(
        (activity) =>
            activity?.userRole ||
            activity?.role ||
            activity?.user?.role ||
            "Unknown",
        []
    );

    const getActivityAction = useCallback(
        (activity) =>
            activity?.action ||
            activity?.actionType ||
            activity?.activity ||
            activity?.description ||
            "Unknown Action",
        []
    );

    const getActivityModule = useCallback(
        (activity) =>
            activity?.module ||
            activity?.moduleName ||
            activity?.affectedModule ||
            "—",
        []
    );

    const getActivityDateTime =
        useCallback(
            (activity) =>
                activity?.dateTime ||
                activity?.timestamp ||
                activity?.createdAt ||
                activity?.date ||
                "—",
            []
        );

    const getActivityIP = useCallback(
        (activity) =>
            activity?.ipAddress ||
            activity?.ip ||
            activity?.ip_address ||
            "—",
        []
    );

    const getActivityDevice =
        useCallback(
            (activity) =>
                activity?.device ||
                activity?.deviceInfo ||
                activity?.userAgent ||
                "—",
            []
        );

    // ========================================================
    // ACCESS DENIED
    // ========================================================

    if (!canViewReports) {
        return (
            <div className="space-y-6 p-4 md:p-6">
                <Card className="border-destructive/30">
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
                        <ShieldCheck className="mb-4 h-12 w-12 text-destructive" />

                        <h1 className="text-xl font-bold text-foreground">
                            Access denied.
                        </h1>

                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            You do not have permission
                            to access system reports.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ========================================================
    // MAIN RENDER
    // ========================================================

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* ==================================================
                PAGE HEADER
            =================================================== */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl border border-border bg-muted p-2.5">
                            <FileText className="h-5 w-5 text-foreground" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Monitoring & Reports
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                Monitor system performance,
                                activities, audit records,
                                and AI usage.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="hidden sm:flex"
                    >
                        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                        Admin Reports
                    </Badge>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleExportPDF
                        }
                        disabled={
                            isLoading ||
                            noData
                        }
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleRefresh
                        }
                        disabled={isLoading}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ==================================================
                ERROR
            =================================================== */}

            {displayError && (
                <Card className="border-destructive/30 bg-card">
                    <CardContent className="flex items-start gap-3 p-4">
                        <FileClock className="mt-0.5 h-5 w-5 text-destructive" />

                        <div>
                            <p className="font-medium text-foreground">
                                Unable to load reports
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {displayError}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ==================================================
                NO DATA
            =================================================== */}

            {!isLoading &&
                !displayError &&
                noData && (
                    <Card className="border-border">
                        <CardContent className="flex min-h-[250px] flex-col items-center justify-center p-6 text-center">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />

                            <h2 className="text-lg font-semibold text-foreground">
                                No report data available.
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                There is currently no
                                system data available
                                for report generation.
                            </p>
                        </CardContent>
                    </Card>
                )}

            {/* ==================================================
                SYSTEM OVERVIEW
            =================================================== */}

            {!noData && (
                <Card className="border-border bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="h-5 w-5 text-foreground" />

                            <div>
                                <CardTitle className="text-base text-foreground">
                                    System Overview
                                </CardTitle>

                                <p className="text-sm text-muted-foreground">
                                    Overall system performance
                                    and operational information.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                            {/* USERS */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Total Users
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-foreground">
                                        {safeSummary.totalUsers}
                                    </p>

                                    <div className="mt-2 flex gap-3 text-xs">
                                        <span className="text-green-600">
                                            Active:{" "}
                                            {safeSummary.activeUsers}
                                        </span>

                                        <span className="text-red-600">
                                            Inactive:{" "}
                                            {safeSummary.inactiveUsers}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* PROJECTS */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Number of Projects
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-foreground">
                                        {safeSummary.totalProjects}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Current projects
                                    </p>
                                </CardContent>
                            </Card>

                            {/* PROJECT STATUS */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Project Status Summary
                                    </p>

                                    <div className="mt-3 space-y-2">
                                        {Object.keys(
                                            projectStatus
                                        ).length > 0 ? (
                                            Object.entries(
                                                projectStatus
                                            ).map(
                                                ([
                                                    status,
                                                    count,
                                                ]) => (
                                                    <div
                                                        key={
                                                            status
                                                        }
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="text-muted-foreground">
                                                            {
                                                                status
                                                            }
                                                        </span>

                                                        <Badge variant="outline">
                                                            {
                                                                count
                                                            }
                                                        </Badge>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                No project
                                                status data
                                                available.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* TEAMS */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Team Information
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-foreground">
                                        {safeSummary.totalTeams}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Teams in the system
                                    </p>
                                </CardContent>
                            </Card>

                            {/* TASKS */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Task Completion Statistics
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-foreground">
                                        {
                                            safeSummary.taskCompletionRate
                                        }
                                        %
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {
                                            safeSummary.completedTasks
                                        }{" "}
                                        of{" "}
                                        {
                                            safeSummary.totalTasks
                                        }{" "}
                                        tasks completed
                                    </p>
                                </CardContent>
                            </Card>

                            {/* ACTIVITY */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        User Activity Summary
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-foreground">
                                        {safeSummary.activities}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Activity records
                                    </p>
                                </CardContent>
                            </Card>

                            {/* AI */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        AI Usage Statistics
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-foreground">
                                        {safeSummary.aiUsage}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        AI usage records
                                    </p>
                                </CardContent>
                            </Card>

                            {/* AUDIT */}

                            <Card className="border-border bg-muted/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Audit Records
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-foreground">
                                        {safeSummary.audits}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Audit records
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ==================================================
                GLOBAL REPORT FILTERS
            =================================================== */}

            {!noData && (
                <ReportFilters
                    filters={filters}
                    onFiltersChange={
                        setFilters
                    }
                    onReset={
                        resetFilters
                    }
                    users={
                        filterOptions.users
                    }
                    projects={
                        filterOptions.projects
                    }
                    teams={
                        filterOptions.teams
                    }
                />
            )}

            {/* ==================================================
                NO FILTER RESULTS
            =================================================== */}

            {!isLoading &&
                !displayError &&
                noFilteredResults && (
                    <Card className="border-border">
                        <CardContent className="flex min-h-[180px] flex-col items-center justify-center p-6 text-center">
                            <FileText className="mb-3 h-10 w-10 text-muted-foreground" />

                            <h2 className="text-lg font-semibold text-foreground">
                                No report data found
                                for the selected
                                filters.
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Try changing the date
                                range, project, team,
                                or user filters.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={
                                    resetFilters
                                }
                            >
                                Reset Filters
                            </Button>
                        </CardContent>
                    </Card>
                )}

            {/* ==================================================
                REPORT TABS
            =================================================== */}

            {!noData &&
                !noFilteredResults && (
                    <Tabs
                        value={activeTab}
                        onValueChange={
                            setActiveTab
                        }
                        className="space-y-6"
                    >
                        <div className="overflow-x-auto">
                            <TabsList className="inline-flex min-w-max">

                                <TabsTrigger value="overview">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Overview
                                </TabsTrigger>

                                <TabsTrigger value="projects">
                                    <FolderKanban className="mr-2 h-4 w-4" />
                                    Projects
                                </TabsTrigger>

                                <TabsTrigger value="teams">
                                    <UsersRound className="mr-2 h-4 w-4" />
                                    Teams
                                </TabsTrigger>

                                <TabsTrigger value="tasks">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Tasks
                                </TabsTrigger>

                                <TabsTrigger value="activity">
                                    <Activity className="mr-2 h-4 w-4" />
                                    Activity
                                </TabsTrigger>

                                <TabsTrigger value="ai">
                                    <Bot className="mr-2 h-4 w-4" />
                                    AI Usage
                                </TabsTrigger>

                                <TabsTrigger value="audit">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Audit Logs
                                </TabsTrigger>

                            </TabsList>
                        </div>

                        {/* ==================================================
                            OVERVIEW
                        =================================================== */}

                        <TabsContent
                            value="overview"
                            className="space-y-6"
                        >
                            <SystemReportTable
                                reports={
                                    systemReports
                                }
                                loading={
                                    isLoading
                                }
                                error={
                                    displayError
                                }
                                onView={
                                    handleViewReport
                                }
                            />
                        </TabsContent>

                        {/* ==================================================
                            PROJECTS
                        =================================================== */}

                        <TabsContent
                            value="projects"
                            className="space-y-6"
                        >
                            <ProjectReport
                                projects={
                                    filteredProjects
                                }
                            />
                        </TabsContent>

                        {/* ==================================================
                            TEAMS
                        =================================================== */}

                        <TabsContent
                            value="teams"
                            className="space-y-6"
                        >
                            <TeamReport
                                teams={
                                    filteredTeams
                                }
                            />
                        </TabsContent>

                        {/* ==================================================
                            TASKS
                        =================================================== */}

                        <TabsContent
                            value="tasks"
                            className="space-y-6"
                        >
                            <TaskReport
                                tasks={
                                    filteredTasks
                                }
                            />
                        </TabsContent>

                        {/* ==================================================
                            MON-002 — ACTIVITY LOGS
                        =================================================== */}

                        <TabsContent
                            value="activity"
                            className="space-y-6"
                        >
                            <UserActivityReport
                                activities={
                                    filteredActivityLogs
                                }
                                activityLogs={
                                    filteredActivityLogs
                                }
                                users={users}
                            />

                            <ActivityLogs
                                activityLogs={
                                    filteredActivityLogs
                                }
                                users={users}
                                loading={
                                    isLoading
                                }
                                error={
                                    displayError
                                }
                            />

                            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-200 px-6 py-5">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Recent Activities
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Monitor recent user
                                        and system
                                        activities.
                                    </p>
                                </div>

                                {filteredActivityLogs.length ===
                                0 ? (
                                    <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
                                        <div>
                                            <Activity className="mx-auto mb-3 h-10 w-10 text-slate-400" />

                                            <h3 className="text-base font-semibold text-slate-900">
                                                No activities
                                                found.
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                There are no
                                                activity records
                                                matching the
                                                current filters.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[1000px]">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50">
                                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        User
                                                    </th>

                                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Role
                                                    </th>

                                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Action
                                                    </th>

                                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Module
                                                    </th>

                                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Date & Time
                                                    </th>

                                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Device / IP
                                                    </th>

                                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Details
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredActivityLogs.map(
                                                    (
                                                        activity,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={
                                                                activity?.id ??
                                                                activity?._id ??
                                                                index
                                                            }
                                                            className="border-b border-slate-100 transition hover:bg-slate-50"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className="font-medium text-slate-900">
                                                                    {getActivityUserName(
                                                                        activity
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                                {getActivityRole(
                                                                    activity
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <span className="text-sm font-medium text-slate-800">
                                                                    {getActivityAction(
                                                                        activity
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                                {getActivityModule(
                                                                    activity
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                                {getActivityDateTime(
                                                                    activity
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-slate-700">
                                                                    {getActivityIP(
                                                                        activity
                                                                    )}
                                                                </div>

                                                                <div className="max-w-[220px] truncate text-xs text-slate-400">
                                                                    {getActivityDevice(
                                                                        activity
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedActivity(
                                                                            activity
                                                                        )
                                                                    }
                                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {selectedActivity && (
                                <Card className="border-border">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base">
                                                    Activity Details
                                                </CardTitle>

                                                <p className="text-sm text-muted-foreground">
                                                    Complete information
                                                    for the selected
                                                    activity record.
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedActivity(
                                                        null
                                                    )
                                                }
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-2">

                                            <div>
                                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                    User
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {getActivityUserName(
                                                        selectedActivity
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                    Role
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {getActivityRole(
                                                        selectedActivity
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                    Action
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {getActivityAction(
                                                        selectedActivity
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                    Module
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {getActivityModule(
                                                        selectedActivity
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                    Date & Time
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {getActivityDateTime(
                                                        selectedActivity
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                    IP Address
                                                </p>

                                                <p className="mt-1 text-sm">
                                                    {getActivityIP(
                                                        selectedActivity
                                                    )}
                                                </p>
                                            </div>

                                            <div className="md:col-span-2">
                                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                                    Device Information
                                                </p>

                                                <p className="mt-1 break-words text-sm">
                                                    {getActivityDevice(
                                                        selectedActivity
                                                    )}
                                                </p>
                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* ==================================================
                            AI USAGE
                        =================================================== */}

                        <TabsContent
                            value="ai"
                            className="space-y-6"
                        >
                            <AIUsageReport
                                aiUsage={
                                    filteredAIUsage
                                }
                                users={users}
                                projects={
                                    filteredProjects
                                }
                                teams={
                                    filteredTeams
                                }
                            />
                        </TabsContent>

                        {/* ==================================================
                            MON-003 — AUDIT LOGS
                        =================================================== */}

                        <TabsContent
                            value="audit"
                            className="space-y-6"
                        >
                            <Card className="border-border">
                                <CardHeader>
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <CardTitle className="text-base">
                                                Audit Log Filters
                                            </CardTitle>

                                            <p className="text-sm text-muted-foreground">
                                                Filter stored audit
                                                records by user,
                                                date range, action
                                                type, and module.
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={
                                                resetAuditFilters
                                            }
                                        >
                                            Reset Filters
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

                                        {/* DATE FROM */}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                From Date
                                            </label>

                                            <input
                                                type="date"
                                                value={
                                                    auditFilters.dateFrom
                                                }
                                                onChange={(event) =>
                                                    setAuditFilters(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            dateFrom:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>

                                        {/* DATE TO */}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                To Date
                                            </label>

                                            <input
                                                type="date"
                                                value={
                                                    auditFilters.dateTo
                                                }
                                                onChange={(event) =>
                                                    setAuditFilters(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            dateTo:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>

                                        {/* USER */}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                User
                                            </label>

                                            <select
                                                value={
                                                    auditFilters.userId
                                                }
                                                onChange={(event) =>
                                                    setAuditFilters(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            userId:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="all">
                                                    All users
                                                </option>

                                                {auditUserOptions.map(
                                                    (user) => (
                                                        <option
                                                            key={
                                                                user.id
                                                            }
                                                            value={
                                                                user.id
                                                            }
                                                        >
                                                            {
                                                                user.name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        {/* ACTION */}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Action Type
                                            </label>

                                            <select
                                                value={
                                                    auditFilters.actionType
                                                }
                                                onChange={(event) =>
                                                    setAuditFilters(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            actionType:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="all">
                                                    All actions
                                                </option>

                                                {auditActionOptions.map(
                                                    (action) => (
                                                        <option
                                                            key={
                                                                action
                                                            }
                                                            value={
                                                                action
                                                            }
                                                        >
                                                            {
                                                                action
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        {/* MODULE */}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Module
                                            </label>

                                            <select
                                                value={
                                                    auditFilters.module
                                                }
                                                onChange={(event) =>
                                                    setAuditFilters(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            module:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="all">
                                                    All modules
                                                </option>

                                                {auditModuleOptions.map(
                                                    (module) => (
                                                        <option
                                                            key={
                                                                module
                                                            }
                                                            value={
                                                                module
                                                            }
                                                        >
                                                            {
                                                                module
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>

                            {/* RESULT COUNT */}

                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Audit Records
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        {
                                            filteredAuditLogs.length
                                        }{" "}
                                        audit record
                                        {filteredAuditLogs.length !==
                                        1
                                            ? "s"
                                            : ""}{" "}
                                        found.
                                    </p>
                                </div>

                                <Badge variant="outline">
                                    Read-only
                                </Badge>
                            </div>

                            {/* NO AUDIT RECORDS */}

                            {filteredAuditLogs.length ===
                            0 ? (
                                <Card className="border-border">
                                    <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
                                        <ShieldCheck className="mb-3 h-10 w-10 text-muted-foreground" />

                                        <h2 className="text-lg font-semibold text-foreground">
                                            {noAuditResults
                                                ? "No audit records found."
                                                : "No audit records exist."}
                                        </h2>

                                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                            {noAuditResults
                                                ? "Try changing the user, date range, action type, or module filters."
                                                : "There are currently no audit records available in the system."}
                                        </p>

                                        {noAuditResults && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-4"
                                                onClick={
                                                    resetAuditFilters
                                                }
                                            >
                                                Reset Filters
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <AuditLogs
                                    auditLogs={
                                        filteredAuditLogs
                                    }
                                    users={users}
                                    loading={
                                        isLoading
                                    }
                                    error={
                                        displayError
                                    }
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                )}

            {/* ==================================================
                FOOTER
            =================================================== */}

            {!noData && (
                <Card className="border-border bg-card">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg border border-border bg-muted p-2">
                                <CalendarDays className="h-4 w-4 text-foreground" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Report data
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Reports are generated
                                    from current system
                                    records and the
                                    selected filters.
                                </p>
                            </div>
                        </div>

                        <Badge variant="outline">
                            Read-only reporting
                        </Badge>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default Reports;