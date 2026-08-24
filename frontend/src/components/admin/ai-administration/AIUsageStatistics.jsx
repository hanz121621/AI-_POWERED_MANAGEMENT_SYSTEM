import { useMemo, useState } from "react";

import {
    Activity,
    BarChart3,
    Bot,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    FileText,
    Filter,
    FolderKanban,
    Gauge,
    Search,
    ShieldCheck,
    Sparkles,
    UserRound,
    X,
    Zap,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

/*
|--------------------------------------------------------------------------
| AI-003 — View AI Usage Statistics
|--------------------------------------------------------------------------
|
| Goal:
| Allow administrators to monitor actual AI usage within AI-PMS.
|
| Business Rules:
|
| BR1  Only authorized administrators can access statistics.
| BR2  Statistics must come from recorded usage data.
| BR3  Feature types come from configured/recorded AI feature data.
| BR4  Statistics represent recorded AI operations.
| BR5  Historical records are read-only.
| BR6  Filters only return matching records.
| BR7  Display is controlled by administrator permissions.
| BR8  Statistics access can be recorded through onAccess.
| BR9  Missing/incomplete data is clearly indicated.
|
|--------------------------------------------------------------------------
*/

function AIUsageStatistics({
    aiUsage = [],
    users = [],
    projects = [],
    loading = false,
    error = "",
    onRefresh,
    onAccess,
}) {
    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        projectId: "all",
        featureType: "all",
        userId: "all",
    });

    const [search, setSearch] = useState("");

    const [selectedRecord, setSelectedRecord] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Defensive normalization
    |--------------------------------------------------------------------------
    */

    const usageRecords = Array.isArray(aiUsage)
        ? aiUsage
        : [];

    const userRecords = Array.isArray(users)
        ? users
        : [];

    const projectRecords = Array.isArray(projects)
        ? projects
        : [];

    /*
    |--------------------------------------------------------------------------
    | Generic helpers
    |--------------------------------------------------------------------------
    */

    const getId = (item) =>
        item?.id ??
        item?._id ??
        item?.usageId ??
        item?.recordId ??
        item?.userId ??
        item?.projectId ??
        null;

    const getUserId = (record) =>
        record?.userId ??
        record?.actorId ??
        record?.createdBy ??
        record?.createdById ??
        record?.user?.id ??
        record?.user?._id ??
        record?.actor?.id ??
        record?.actor?._id ??
        null;

    const getProjectId = (record) =>
        record?.projectId ??
        record?.project?.id ??
        record?.project?._id ??
        null;

    const getUserName = (user) =>
        user?.fullName ||
        user?.name ||
        user?.username ||
        user?.email ||
        "Unknown User";

    const getProjectName = (project) =>
        project?.name ||
        project?.title ||
        "Unnamed Project";

    /*
    |--------------------------------------------------------------------------
    | AI feature
    |--------------------------------------------------------------------------
    |
    | We intentionally do not define a fixed list such as:
    | "Recommendations", "Risk Prediction", etc.
    |
    | The values are extracted from actual usage records.
    |
    */

    const getFeatureType = (record) =>
        record?.featureType ||
        record?.feature ||
        record?.aiFeature ||
        record?.featureName ||
        record?.feature?.name ||
        record?.type ||
        "Unknown Feature";

    /*
    |--------------------------------------------------------------------------
    | Date
    |--------------------------------------------------------------------------
    */

    const getDate = (record) =>
        record?.createdAt ||
        record?.updatedAt ||
        record?.timestamp ||
        record?.date ||
        record?.requestedAt ||
        record?.startedAt ||
        null;

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    const getStatus = (record) =>
        String(
            record?.status ||
            record?.resultStatus ||
            record?.state ||
            "unknown"
        ).toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Response time
    |--------------------------------------------------------------------------
    */

    const getDuration = (record) =>
        record?.duration ??
        record?.responseTime ??
        record?.processingTime ??
        record?.latency ??
        record?.durationMs ??
        null;

    /*
    |--------------------------------------------------------------------------
    | Request / response
    |--------------------------------------------------------------------------
    */

    const getRequest = (record) =>
        record?.request ??
        record?.prompt ??
        record?.input ??
        record?.action ??
        record?.query ??
        null;

    const getResponse = (record) =>
        record?.response ??
        record?.result ??
        record?.output ??
        record?.answer ??
        null;

    /*
    |--------------------------------------------------------------------------
    | Lookup maps
    |--------------------------------------------------------------------------
    */

    const userMap = useMemo(() => {
        const map = new Map();

        userRecords.forEach((user) => {
            const id =
                user?.id ??
                user?._id ??
                user?.userId;

            if (id !== null && id !== undefined) {
                map.set(String(id), user);
            }
        });

        return map;
    }, [userRecords]);

    const projectMap = useMemo(() => {
        const map = new Map();

        projectRecords.forEach((project) => {
            const id =
                project?.id ??
                project?._id ??
                project?.projectId;

            if (id !== null && id !== undefined) {
                map.set(String(id), project);
            }
        });

        return map;
    }, [projectRecords]);

    /*
    |--------------------------------------------------------------------------
    | Feature options
    |--------------------------------------------------------------------------
    |
    | BR3:
    | Feature values come from recorded/configured usage data.
    |--------------------------------------------------------------------------
    */

    const featureOptions = useMemo(() => {
        const values = new Set();

        usageRecords.forEach((record) => {
            const feature = getFeatureType(record);

            if (
                feature &&
                feature !== "Unknown Feature"
            ) {
                values.add(String(feature));
            }
        });

        return Array.from(values).sort(
            (a, b) =>
                a.localeCompare(b)
        );
    }, [usageRecords]);

    /*
    |--------------------------------------------------------------------------
    | User options
    |--------------------------------------------------------------------------
    |
    | Prefer users from the actual user collection.
    |--------------------------------------------------------------------------
    */

    const userOptions = useMemo(() => {
        const values = new Map();

        usageRecords.forEach((record) => {
            const userId = getUserId(record);

            if (
                userId !== null &&
                userId !== undefined
            ) {
                const user =
                    userMap.get(
                        String(userId)
                    );

                values.set(
                    String(userId),
                    user || {
                        id: userId,
                        fullName:
                            "Unknown User",
                    }
                );
            }
        });

        return Array.from(
            values.values()
        );
    }, [usageRecords, userMap]);

    /*
    |--------------------------------------------------------------------------
    | Date filtering
    |--------------------------------------------------------------------------
    */

    const matchesDateFilter = (record) => {
        const dateValue = getDate(record);

        if (
            !filters.dateFrom &&
            !filters.dateTo
        ) {
            return true;
        }

        if (!dateValue) {
            return false;
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return false;
        }

        if (filters.dateFrom) {
            const from = new Date(
                `${filters.dateFrom}T00:00:00`
            );

            if (date < from) {
                return false;
            }
        }

        if (filters.dateTo) {
            const to = new Date(
                `${filters.dateTo}T23:59:59.999`
            );

            if (date > to) {
                return false;
            }
        }

        return true;
    };

    /*
    |--------------------------------------------------------------------------
    | Project filtering
    |--------------------------------------------------------------------------
    */

    const matchesProjectFilter = (record) => {
        if (
            filters.projectId === "all"
        ) {
            return true;
        }

        const projectId =
            getProjectId(record);

        return (
            projectId !== null &&
            projectId !== undefined &&
            String(projectId) ===
                String(filters.projectId)
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Feature filtering
    |--------------------------------------------------------------------------
    */

    const matchesFeatureFilter = (record) => {
        if (
            filters.featureType === "all"
        ) {
            return true;
        }

        return (
            String(
                getFeatureType(record)
            ) ===
            String(
                filters.featureType
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | User filtering
    |--------------------------------------------------------------------------
    */

    const matchesUserFilter = (record) => {
        if (
            filters.userId === "all"
        ) {
            return true;
        }

        const userId =
            getUserId(record);

        return (
            userId !== null &&
            userId !== undefined &&
            String(userId) ===
                String(filters.userId)
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Filtered usage records
    |--------------------------------------------------------------------------
    */

    const filteredUsage = useMemo(() => {
        const normalizedSearch =
            search
                .trim()
                .toLowerCase();

        return usageRecords.filter(
            (record) => {
                if (
                    !matchesDateFilter(
                        record
                    )
                ) {
                    return false;
                }

                if (
                    !matchesProjectFilter(
                        record
                    )
                ) {
                    return false;
                }

                if (
                    !matchesFeatureFilter(
                        record
                    )
                ) {
                    return false;
                }

                if (
                    !matchesUserFilter(
                        record
                    )
                ) {
                    return false;
                }

                if (
                    !normalizedSearch
                ) {
                    return true;
                }

                const userId =
                    getUserId(record);

                const projectId =
                    getProjectId(record);

                const user =
                    userMap.get(
                        String(userId)
                    );

                const project =
                    projectMap.get(
                        String(projectId)
                    );

                const userName = user
                    ? getUserName(user)
                    : "";

                const projectName =
                    project
                        ? getProjectName(
                              project
                          )
                        : "";

                const feature =
                    getFeatureType(
                        record
                    );

                const recordId =
                    getId(record);

                const request =
                    getRequest(record);

                const response =
                    getResponse(record);

                return [
                    userName,
                    projectName,
                    feature,
                    recordId,
                    record?.status,
                    request,
                    response,
                    record?.action,
                ]
                    .filter(
                        (value) =>
                            value !==
                                null &&
                            value !==
                                undefined &&
                            value !== ""
                    )
                    .join(" ")
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    );
            }
        );
    }, [
        usageRecords,
        filters,
        search,
        userMap,
        projectMap,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    |
    | ALL statistics are calculated from filtered recorded usage.
    | No values are fabricated.
    |--------------------------------------------------------------------------
    */

    const statistics = useMemo(() => {
        const totalRequests =
            filteredUsage.length;

        const successfulRequests =
            filteredUsage.filter(
                (record) => {
                    const status =
                        getStatus(
                            record
                        );

                    return [
                        "success",
                        "successful",
                        "completed",
                        "complete",
                        "successfully_completed",
                    ].includes(
                        status
                    );
                }
            ).length;

        const failedRequests =
            filteredUsage.filter(
                (record) => {
                    const status =
                        getStatus(
                            record
                        );

                    return [
                        "failed",
                        "failure",
                        "error",
                        "cancelled",
                        "canceled",
                    ].includes(
                        status
                    );
                }
            ).length;

        /*
        |--------------------------------------------------------------------------
        | Feature counts
        |--------------------------------------------------------------------------
        */

        const featureCounts =
            {};

        filteredUsage.forEach(
            (record) => {
                const feature =
                    getFeatureType(
                        record
                    );

                featureCounts[
                    feature
                ] =
                    (
                        featureCounts[
                            feature
                        ] || 0
                    ) + 1;
            }
        );

        const sortedFeatures =
            Object.entries(
                featureCounts
            ).sort(
                (a, b) =>
                    b[1] - a[1]
            );

        const mostUsedFeature =
            sortedFeatures[0]?.[0] ||
            "No data";

        const mostUsedFeatureCount =
            sortedFeatures[0]?.[1] ||
            0;

        /*
        |--------------------------------------------------------------------------
        | Recommendations
        |--------------------------------------------------------------------------
        |
        | These counts are based on the feature names actually
        | recorded by the system.
        |--------------------------------------------------------------------------
        */

        const recommendations =
            filteredUsage.filter(
                (record) => {
                    const feature =
                        String(
                            getFeatureType(
                                record
                            )
                        ).toLowerCase();

                    return (
                        feature.includes(
                            "recommend"
                        ) ||
                        feature.includes(
                            "suggest"
                        )
                    );
                }
            ).length;

        const riskPredictions =
            filteredUsage.filter(
                (record) => {
                    const feature =
                        String(
                            getFeatureType(
                                record
                            )
                        ).toLowerCase();

                    return (
                        feature.includes(
                            "risk"
                        ) ||
                        feature.includes(
                            "prediction"
                        )
                    );
                }
            ).length;

        const taskAnalysis =
            filteredUsage.filter(
                (record) => {
                    const feature =
                        String(
                            getFeatureType(
                                record
                            )
                        ).toLowerCase();

                    return (
                        feature.includes(
                            "task"
                        ) ||
                        feature.includes(
                            "analysis"
                        )
                    );
                }
            ).length;

        /*
        |--------------------------------------------------------------------------
        | Response time
        |--------------------------------------------------------------------------
        */

        const responseTimes =
            filteredUsage
                .map((record) => {
                    const duration =
                        Number(
                            getDuration(
                                record
                            )
                        );

                    return Number.isFinite(
                        duration
                    )
                        ? duration
                        : null;
                })
                .filter(
                    (value) =>
                        value !==
                        null
                );

        const averageResponseTime =
            responseTimes.length
                ? Math.round(
                      responseTimes.reduce(
                          (
                              total,
                              value
                          ) =>
                              total +
                              value,
                          0
                      ) /
                          responseTimes.length
                  )
                : null;

        const fastestResponseTime =
            responseTimes.length
                ? Math.min(
                      ...responseTimes
                  )
                : null;

        const slowestResponseTime =
            responseTimes.length
                ? Math.max(
                      ...responseTimes
                  )
                : null;

        const successRate =
            totalRequests > 0
                ? Math.round(
                      (successfulRequests /
                          totalRequests) *
                          100
                  )
                : 0;

        /*
        |--------------------------------------------------------------------------
        | Users with usage
        |--------------------------------------------------------------------------
        */

        const uniqueUsers =
            new Set(
                filteredUsage
                    .map(
                        (record) =>
                            getUserId(
                                record
                            )
                    )
                    .filter(
                        (id) =>
                            id !==
                                null &&
                            id !==
                                undefined
                    )
                    .map(
                        (id) =>
                            String(id)
                    )
            ).size;

        return {
            totalRequests,
            successfulRequests,
            failedRequests,
            recommendations,
            riskPredictions,
            taskAnalysis,
            averageResponseTime,
            fastestResponseTime,
            slowestResponseTime,
            successRate,
            mostUsedFeature,
            mostUsedFeatureCount,
            uniqueUsers,
            featureCounts,
            sortedFeatures,
        };
    }, [filteredUsage]);

    /*
    |--------------------------------------------------------------------------
    | Reset filters
    |--------------------------------------------------------------------------
    */

    const resetFilters = () => {
        setFilters({
            dateFrom: "",
            dateTo: "",
            projectId: "all",
            featureType: "all",
            userId: "all",
        });

        setSearch("");
    };

    /*
    |--------------------------------------------------------------------------
    | View usage record
    |--------------------------------------------------------------------------
    |
    | Historical records are not edited.
    |
    */

    const handleViewRecord = (
        record
    ) => {
        if (!record) {
            return;
        }

        setSelectedRecord(record);

        /*
        | BR8:
        | Parent/service records access in activity log.
        */

        if (
            typeof onAccess ===
            "function"
        ) {
            onAccess({
                type:
                    "AI_USAGE_STATISTICS_VIEW",
                recordId:
                    getId(record),
                usageRecord:
                    record,
            });
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Format date
    |--------------------------------------------------------------------------
    */

    const formatDate = (
        value
    ) => {
        if (!value) {
            return "Unknown date";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Unknown date";
        }

        return date.toLocaleString();
    };

    /*
    |--------------------------------------------------------------------------
    | Status badge
    |--------------------------------------------------------------------------
    */

    const renderStatus = (
        status
    ) => {
        const normalized =
            String(
                status || ""
            ).toLowerCase();

        if (
            [
                "success",
                "successful",
                "completed",
                "complete",
                "successfully_completed",
            ].includes(
                normalized
            )
        ) {
            return (
                <Badge variant="secondary">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Success
                </Badge>
            );
        }

        if (
            [
                "failed",
                "failure",
                "error",
            ].includes(
                normalized
            )
        ) {
            return (
                <Badge variant="destructive">
                    Failed
                </Badge>
            );
        }

        if (
            [
                "cancelled",
                "canceled",
            ].includes(
                normalized
            )
        ) {
            return (
                <Badge variant="outline">
                    Cancelled
                </Badge>
            );
        }

        return (
            <Badge variant="outline">
                {status ||
                    "Unknown"}
            </Badge>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Empty database state
    |--------------------------------------------------------------------------
    */

    const hasNoData =
        !loading &&
        !error &&
        usageRecords.length === 0;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-3">

                    <div className="rounded-xl border border-border bg-muted p-3">
                        <BarChart3 className="h-6 w-6 text-foreground" />
                    </div>

                    <div>

                        <div className="flex flex-wrap items-center gap-2">

                            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                AI Usage Statistics
                            </h2>

                            <Badge variant="outline">
                                AI-003
                            </Badge>

                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitor recorded AI requests,
                            feature usage, recommendations,
                            risk predictions, task analysis,
                            and AI performance.
                        </p>

                    </div>

                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={
                        onRefresh
                    }
                    disabled={
                        loading
                    }
                >
                    <RefreshIcon
                        loading={
                            loading
                        }
                    />

                    Refresh
                </Button>

            </div>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <Card className="border-destructive/30">

                    <CardContent className="flex gap-3 p-4">

                        <Activity className="h-5 w-5 text-destructive" />

                        <div>

                            <p className="font-medium text-foreground">
                                Unable to load AI statistics.
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {error}
                            </p>

                        </div>

                    </CardContent>

                </Card>
            )}

            {/* =====================================================
                NO DATA
            ====================================================== */}

            {hasNoData && (
                <Card>

                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">

                        <Bot className="mb-4 h-10 w-10 text-muted-foreground" />

                        <h3 className="font-semibold text-foreground">
                            No AI usage data available.
                        </h3>

                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            AI usage statistics will appear
                            after AI operations have been
                            recorded by the system.
                        </p>

                    </CardContent>

                </Card>
            )}

            {/* =====================================================
                FILTERS
            ====================================================== */}

            <Card>

                <CardHeader>

                    <div className="flex items-center gap-2">

                        <Filter className="h-5 w-5 text-foreground" />

                        <div>

                            <CardTitle className="text-base">
                                Usage Filters
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Filter recorded AI usage
                                by date, project, feature,
                                or user.
                            </p>

                        </div>

                    </div>

                </CardHeader>

                <CardContent className="space-y-4">

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

                        {/* DATE FROM */}

                        <div className="space-y-2">

                            <label
                                htmlFor="ai-date-from"
                                className="text-sm font-medium text-foreground"
                            >
                                Date From
                            </label>

                            <Input
                                id="ai-date-from"
                                type="date"
                                value={
                                    filters.dateFrom
                                }
                                onChange={(
                                    event
                                ) =>
                                    setFilters(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            dateFrom:
                                                event
                                                    .target
                                                    .value,
                                        })
                                    )
                                }
                            />

                        </div>

                        {/* DATE TO */}

                        <div className="space-y-2">

                            <label
                                htmlFor="ai-date-to"
                                className="text-sm font-medium text-foreground"
                            >
                                Date To
                            </label>

                            <Input
                                id="ai-date-to"
                                type="date"
                                value={
                                    filters.dateTo
                                }
                                onChange={(
                                    event
                                ) =>
                                    setFilters(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            dateTo:
                                                event
                                                    .target
                                                    .value,
                                        })
                                    )
                                }
                            />

                        </div>

                        {/* PROJECT */}

                        <div className="space-y-2">

                            <label className="text-sm font-medium text-foreground">
                                Project
                            </label>

                            <Select
                                value={
                                    filters.projectId
                                }
                                onValueChange={(
                                    value
                                ) =>
                                    setFilters(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            projectId:
                                                value,
                                        })
                                    )
                                }
                            >

                                <SelectTrigger>
                                    <SelectValue placeholder="All projects" />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="all">
                                        All Projects
                                    </SelectItem>

                                    {projectRecords.map(
                                        (
                                            project
                                        ) => {
                                            const id =
                                                project?.id ??
                                                project?._id ??
                                                project?.projectId;

                                            if (
                                                id ===
                                                    null ||
                                                id ===
                                                    undefined
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <SelectItem
                                                    key={String(
                                                        id
                                                    )}
                                                    value={String(
                                                        id
                                                    )}
                                                >
                                                    {getProjectName(
                                                        project
                                                    )}
                                                </SelectItem>
                                            );
                                        }
                                    )}

                                </SelectContent>

                            </Select>

                        </div>

                        {/* FEATURE */}

                        <div className="space-y-2">

                            <label className="text-sm font-medium text-foreground">
                                AI Feature
                            </label>

                            <Select
                                value={
                                    filters.featureType
                                }
                                onValueChange={(
                                    value
                                ) =>
                                    setFilters(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            featureType:
                                                value,
                                        })
                                    )
                                }
                            >

                                <SelectTrigger>
                                    <SelectValue placeholder="All features" />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="all">
                                        All Features
                                    </SelectItem>

                                    {featureOptions.map(
                                        (
                                            feature
                                        ) => (
                                            <SelectItem
                                                key={
                                                    feature
                                                }
                                                value={
                                                    feature
                                                }
                                            >
                                                {
                                                    feature
                                                }
                                            </SelectItem>
                                        )
                                    )}

                                </SelectContent>

                            </Select>

                        </div>

                        {/* USER */}

                        <div className="space-y-2">

                            <label className="text-sm font-medium text-foreground">
                                User
                            </label>

                            <Select
                                value={
                                    filters.userId
                                }
                                onValueChange={(
                                    value
                                ) =>
                                    setFilters(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            userId:
                                                value,
                                        })
                                    )
                                }
                            >

                                <SelectTrigger>
                                    <SelectValue placeholder="All users" />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="all">
                                        All Users
                                    </SelectItem>

                                    {userOptions.map(
                                        (
                                            user
                                        ) => {
                                            const id =
                                                user?.id ??
                                                user?._id ??
                                                user?.userId;

                                            if (
                                                id ===
                                                    null ||
                                                id ===
                                                    undefined
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <SelectItem
                                                    key={String(
                                                        id
                                                    )}
                                                    value={String(
                                                        id
                                                    )}
                                                >
                                                    {getUserName(
                                                        user
                                                    )}
                                                </SelectItem>
                                            );
                                        }
                                    )}

                                </SelectContent>

                            </Select>

                        </div>

                    </div>

                    {/* SEARCH */}

                    <div className="flex flex-col gap-3 sm:flex-row">

                        <div className="relative flex-1">

                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search AI usage records..."
                                className="pl-9"
                            />

                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                resetFilters
                            }
                        >
                            <X className="mr-2 h-4 w-4" />
                            Reset Filters
                        </Button>

                    </div>

                </CardContent>

            </Card>

            {/* =====================================================
                SUMMARY
            ====================================================== */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                    label="Total AI Requests"
                    value={
                        statistics.totalRequests
                    }
                    icon={
                        <Bot className="h-5 w-5 text-foreground" />
                    }
                />

                <StatCard
                    label="Success Rate"
                    value={`${statistics.successRate}%`}
                    icon={
                        <CheckCircle2 className="h-5 w-5 text-foreground" />
                    }
                />

                <StatCard
                    label="Most Used Feature"
                    value={
                        statistics.mostUsedFeature
                    }
                    secondary={
                        statistics.mostUsedFeatureCount
                            ? `${statistics.mostUsedFeatureCount} recorded request(s)`
                            : undefined
                    }
                    icon={
                        <Sparkles className="h-5 w-5 text-foreground" />
                    }
                />

                <StatCard
                    label="Avg. Response Time"
                    value={
                        statistics.averageResponseTime !==
                        null
                            ? `${statistics.averageResponseTime} ms`
                            : "N/A"
                    }
                    icon={
                        <Clock3 className="h-5 w-5 text-foreground" />
                    }
                />

            </div>

            {/* =====================================================
                PERFORMANCE METRICS
            ====================================================== */}

            <Card>

                <CardHeader>

                    <div className="flex items-center gap-2">

                        <Gauge className="h-5 w-5 text-foreground" />

                        <div>

                            <CardTitle className="text-base">
                                AI Performance Metrics
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Performance calculated from
                                recorded AI operations.
                            </p>

                        </div>

                    </div>

                </CardHeader>

                <CardContent>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <MetricItem
                            label="Successful Requests"
                            value={
                                statistics.successfulRequests
                            }
                        />

                        <MetricItem
                            label="Failed Requests"
                            value={
                                statistics.failedRequests
                            }
                        />

                        <MetricItem
                            label="Fastest Response"
                            value={
                                statistics.fastestResponseTime !==
                                null
                                    ? `${statistics.fastestResponseTime} ms`
                                    : "N/A"
                            }
                        />

                        <MetricItem
                            label="Slowest Response"
                            value={
                                statistics.slowestResponseTime !==
                                null
                                    ? `${statistics.slowestResponseTime} ms`
                                    : "N/A"
                            }
                        />

                    </div>

                </CardContent>

            </Card>

            {/* =====================================================
                FEATURE USAGE
            ====================================================== */}

            <Card>

                <CardHeader>

                    <CardTitle className="text-base">
                        AI Feature Usage
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                        Counts are calculated from the
                        currently filtered usage records.
                    </p>

                </CardHeader>

                <CardContent>

                    {statistics.sortedFeatures
                        .length ===
                    0 ? (
                        <div className="py-8 text-center">

                            <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                            <p className="font-medium text-foreground">
                                No feature usage data available.
                            </p>

                        </div>
                    ) : (
                        <div className="space-y-3">

                            {statistics.sortedFeatures.map(
                                ([
                                    feature,
                                    count,
                                ]) => {

                                    const percentage =
                                        statistics.totalRequests >
                                        0
                                            ? Math.round(
                                                  (count /
                                                      statistics.totalRequests) *
                                                      100
                                              )
                                            : 0;

                                    return (
                                        <div
                                            key={
                                                feature
                                            }
                                            className="rounded-lg border border-border p-4"
                                        >

                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="flex items-center gap-2">

                                                    <Sparkles className="h-4 w-4 text-muted-foreground" />

                                                    <span className="font-medium text-foreground">
                                                        {
                                                            feature
                                                        }
                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-3">

                                                    <span className="text-sm text-muted-foreground">
                                                        {
                                                            count
                                                        }{" "}
                                                        request
                                                        {count !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </span>

                                                    <Badge variant="outline">
                                                        {
                                                            percentage
                                                        }
                                                        %
                                                    </Badge>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </CardContent>

            </Card>

            {/* =====================================================
                FEATURE CATEGORIES
            ====================================================== */}

            <Card>

                <CardHeader>

                    <CardTitle className="text-base">
                        AI Operation Categories
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                        Derived only from the recorded AI
                        feature names.
                    </p>

                </CardHeader>

                <CardContent>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <CategoryCard
                            icon={
                                <Sparkles className="h-4 w-4 text-foreground" />
                            }
                            label="Recommendations"
                            value={
                                statistics.recommendations
                            }
                        />

                        <CategoryCard
                            icon={
                                <Zap className="h-4 w-4 text-foreground" />
                            }
                            label="Risk Predictions"
                            value={
                                statistics.riskPredictions
                            }
                        />

                        <CategoryCard
                            icon={
                                <FileText className="h-4 w-4 text-foreground" />
                            }
                            label="Task Analysis"
                            value={
                                statistics.taskAnalysis
                            }
                        />

                        <CategoryCard
                            icon={
                                <UserRound className="h-4 w-4 text-foreground" />
                            }
                            label="Unique Users"
                            value={
                                statistics.uniqueUsers
                            }
                        />

                    </div>

                </CardContent>

            </Card>

            {/* =====================================================
                RESPONSE HISTORY
            ====================================================== */}

            <Card>

                <CardHeader>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <Activity className="h-5 w-5 text-foreground" />

                                <CardTitle className="text-base">
                                    AI Response History
                                </CardTitle>

                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Historical AI operations recorded
                                by the system.
                            </p>

                        </div>

                        <Badge variant="outline">
                            Read-only
                        </Badge>

                    </div>

                </CardHeader>

                <CardContent>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">

                            <RefreshIcon
                                loading
                            />

                            <span className="ml-2 text-sm text-muted-foreground">
                                Loading AI usage data...
                            </span>

                        </div>
                    ) : filteredUsage.length ===
                      0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">

                            <Search className="mb-3 h-8 w-8 text-muted-foreground" />

                            <p className="font-medium text-foreground">
                                No AI usage data found
                                for the selected filters.
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Try changing the date
                                range, project,
                                feature, user, or
                                search term.
                            </p>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[950px]">

                                <thead>

                                    <tr className="border-b border-border">

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Feature
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            User
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Project
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Date
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Response
                                        </th>

                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredUsage.map(
                                        (
                                            record,
                                            index
                                        ) => {

                                            const recordId =
                                                getId(
                                                    record
                                                );

                                            const userId =
                                                getUserId(
                                                    record
                                                );

                                            const projectId =
                                                getProjectId(
                                                    record
                                                );

                                            const user =
                                                userMap.get(
                                                    String(
                                                        userId
                                                    )
                                                );

                                            const project =
                                                projectMap.get(
                                                    String(
                                                        projectId
                                                    )
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        recordId ??
                                                        `ai-usage-${index}`
                                                    }
                                                    className="border-b border-border last:border-0"
                                                >

                                                    <td className="px-4 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <div className="rounded-md bg-muted p-2">

                                                                <Bot className="h-4 w-4 text-foreground" />

                                                            </div>

                                                            <span className="font-medium text-foreground">
                                                                {getFeatureType(
                                                                    record
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <UserRound className="h-4 w-4 text-muted-foreground" />

                                                            <span className="text-sm text-foreground">
                                                                {user
                                                                    ? getUserName(
                                                                          user
                                                                      )
                                                                    : "Unknown User"}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <FolderKanban className="h-4 w-4 text-muted-foreground" />

                                                            <span className="text-sm text-foreground">
                                                                {project
                                                                    ? getProjectName(
                                                                          project
                                                                      )
                                                                    : "No Project"}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />

                                                            <span className="text-sm text-muted-foreground">
                                                                {formatDate(
                                                                    getDate(
                                                                        record
                                                                    )
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        {renderStatus(
                                                            getStatus(
                                                                record
                                                            )
                                                        )}

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <span className="text-sm text-muted-foreground">

                                                            {getDuration(
                                                                record
                                                            ) !==
                                                            null
                                                                ? `${getDuration(
                                                                      record
                                                                  )} ms`
                                                                : "N/A"}

                                                        </span>

                                                    </td>

                                                    <td className="px-4 py-4 text-right">

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleViewRecord(
                                                                    record
                                                                )
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Button>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </CardContent>

            </Card>

            {/* =====================================================
                READ-ONLY INFORMATION
            ====================================================== */}

            <Card>

                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="rounded-lg border border-border bg-muted p-2">

                            <ShieldCheck className="h-4 w-4 text-foreground" />

                        </div>

                        <div>

                            <p className="text-sm font-medium text-foreground">
                                Read-only AI usage monitoring
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Historical AI usage records
                                cannot be modified from this
                                page.
                            </p>

                        </div>

                    </div>

                    <Badge variant="outline">
                        AI-003
                    </Badge>

                </CardContent>

            </Card>

            {/* =====================================================
                DETAIL DIALOG
            ====================================================== */}

            <Dialog
                open={Boolean(
                    selectedRecord
                )}
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedRecord(
                            null
                        );
                    }
                }}
            >

                <DialogContent className="max-w-2xl">

                    <DialogHeader>

                        <DialogTitle className="flex items-center gap-2">

                            <Bot className="h-5 w-5" />

                            AI Usage Record

                        </DialogTitle>

                        <DialogDescription>
                            Detailed information about
                            the selected recorded AI
                            operation.
                        </DialogDescription>

                    </DialogHeader>

                    {selectedRecord && (
                        <div className="space-y-5">

                            {/* FEATURE */}

                            <div className="rounded-lg border border-border bg-muted/20 p-4">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-lg bg-muted p-3">

                                        <Sparkles className="h-5 w-5 text-foreground" />

                                    </div>

                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            AI Feature
                                        </p>

                                        <p className="font-semibold text-foreground">
                                            {getFeatureType(
                                                selectedRecord
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* DETAILS */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                <DetailItem
                                    label="Record ID"
                                    value={
                                        getId(
                                            selectedRecord
                                        ) ??
                                        "Not available"
                                    }
                                />

                                <DetailItem
                                    label="Status"
                                    value={
                                        selectedRecord?.status ??
                                        "Unknown"
                                    }
                                />

                                <DetailItem
                                    label="User"
                                    value={getRecordUserName(
                                        selectedRecord,
                                        userMap
                                    )}
                                />

                                <DetailItem
                                    label="Project"
                                    value={getRecordProjectName(
                                        selectedRecord,
                                        projectMap
                                    )}
                                />

                                <DetailItem
                                    label="Date"
                                    value={formatDate(
                                        getDate(
                                            selectedRecord
                                        )
                                    )}
                                />

                                <DetailItem
                                    label="Response Time"
                                    value={
                                        getDuration(
                                            selectedRecord
                                        ) !==
                                        null
                                            ? `${getDuration(
                                                  selectedRecord
                                              )} ms`
                                            : "Not available"
                                    }
                                />

                            </div>

                            <Separator />

                            {/* REQUEST */}

                            <div>

                                <p className="mb-2 text-sm font-medium text-foreground">
                                    Request Information
                                </p>

                                <div className="rounded-lg border border-border bg-muted/20 p-4">

                                    <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                                        {getRequest(
                                            selectedRecord
                                        ) ||
                                            "No request information available."}
                                    </p>

                                </div>

                            </div>

                            {/* RESPONSE */}

                            <div>

                                <p className="mb-2 text-sm font-medium text-foreground">
                                    Response Information
                                </p>

                                <div className="rounded-lg border border-border bg-muted/20 p-4">

                                    <p className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-sm text-muted-foreground">
                                        {getResponse(
                                            selectedRecord
                                        ) ||
                                            "No response information available."}
                                    </p>

                                </div>

                            </div>

                            {/* CLOSE */}

                            <div className="flex justify-end">

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setSelectedRecord(
                                            null
                                        )
                                    }
                                >
                                    Close
                                </Button>

                            </div>

                        </div>
                    )}

                </DialogContent>

            </Dialog>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Statistic Card
|--------------------------------------------------------------------------
*/

function StatCard({
    label,
    value,
    secondary,
    icon,
}) {
    return (
        <Card>

            <CardContent className="p-5">

                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                        <p className="text-sm text-muted-foreground">
                            {label}
                        </p>

                        <p className="mt-2 break-words text-2xl font-bold text-foreground">
                            {value}
                        </p>

                        {secondary && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {secondary}
                            </p>
                        )}

                    </div>

                    <div className="shrink-0 rounded-lg bg-muted p-2.5">
                        {icon}
                    </div>

                </div>

            </CardContent>

        </Card>
    );
}

/*
|--------------------------------------------------------------------------
| Metric Item
|--------------------------------------------------------------------------
*/

function MetricItem({
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-border bg-muted/20 p-4">

            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold text-foreground">
                {value}
            </p>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Category Card
|--------------------------------------------------------------------------
*/

function CategoryCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-border bg-muted/20 p-4">

            <div className="flex items-center gap-2">

                {icon}

                <span className="text-sm text-muted-foreground">
                    {label}
                </span>

            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
                {value}
            </p>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Detail Item
|--------------------------------------------------------------------------
*/

function DetailItem({
    label,
    value,
}) {
    return (
        <div className="rounded-lg border border-border bg-muted/20 p-3">

            <p className="text-xs font-medium text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-foreground">
                {String(value)}
            </p>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Record user name
|--------------------------------------------------------------------------
*/

function getRecordUserName(
    record,
    userMap
) {
    const userId =
        record?.userId ??
        record?.actorId ??
        record?.createdBy ??
        record?.createdById ??
        record?.user?.id ??
        record?.user?._id ??
        record?.actor?.id ??
        record?.actor?._id;

    const user =
        userMap.get(
            String(userId)
        );

    return user
        ? user.fullName ||
              user.name ||
              user.username ||
              user.email ||
              "Unknown User"
        : "Unknown User";
}

/*
|--------------------------------------------------------------------------
| Record project name
|--------------------------------------------------------------------------
*/

function getRecordProjectName(
    record,
    projectMap
) {
    const projectId =
        record?.projectId ??
        record?.project?.id ??
        record?.project?._id;

    const project =
        projectMap.get(
            String(projectId)
        );

    return project
        ? project.name ||
              project.title ||
              "Unnamed Project"
        : "No Project";
}

/*
|--------------------------------------------------------------------------
| Refresh Icon
|--------------------------------------------------------------------------
*/

function RefreshIcon({
    loading = false,
}) {
    return (
        <span
            className={
                loading
                    ? "mr-2 inline-flex"
                    : "mr-2 inline-flex"
            }
        >
            <Activity
                className={`h-4 w-4 ${
                    loading
                        ? "animate-spin"
                        : ""
                }`}
            />
        </span>
    );
}

export default AIUsageStatistics;