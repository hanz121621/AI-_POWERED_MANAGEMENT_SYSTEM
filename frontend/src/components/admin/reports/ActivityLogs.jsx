import { useMemo, useState } from "react";
import {
    Activity,
    CalendarDays,
    Eye,
    FileClock,
    Filter,
    User,
    X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ActivityLogs({
    activityLogs = [],
    users = [],
    loading = false,
    error = "",
}) {
    // ============================================================
    // STATE
    // ============================================================

    const [filters, setFilters] = useState({
        userId: "all",
        dateFrom: "",
        dateTo: "",
        action: "all",
        module: "all",
    });

    const [selectedActivity, setSelectedActivity] = useState(null);

    // ============================================================
    // NORMALIZE ACTIVITY DATA
    // ============================================================

    const normalizedActivities = useMemo(() => {
        return (Array.isArray(activityLogs) ? activityLogs : []).map(
            (activity, index) => ({
                ...activity,

                id:
                    activity?.id ??
                    activity?._id ??
                    activity?.activityId ??
                    index + 1,

                userId: String(
                    activity?.userId ??
                    activity?.user?.id ??
                    activity?.user?._id ??
                    ""
                ),

                userName:
                    activity?.userName ??
                    activity?.user?.fullName ??
                    activity?.user?.name ??
                    activity?.user?.username ??
                    "Unknown User",

                userRole:
                    activity?.userRole ??
                    activity?.user?.role ??
                    "Unknown",

                action:
                    activity?.action ??
                    activity?.actionType ??
                    activity?.event ??
                    "Unknown Action",

                module:
                    activity?.module ??
                    activity?.moduleName ??
                    activity?.resource ??
                    "Unknown Module",

                dateTime:
                    activity?.dateTime ??
                    activity?.createdAt ??
                    activity?.timestamp ??
                    "",

                ipAddress:
                    activity?.ipAddress ??
                    activity?.ip ??
                    "Not available",

                device:
                    activity?.device ??
                    activity?.userAgent ??
                    "Not available",

                description:
                    activity?.description ??
                    activity?.details ??
                    activity?.message ??
                    "",
            })
        );
    }, [activityLogs]);

    // ============================================================
    // FILTER OPTIONS
    // ============================================================

    const actionOptions = useMemo(() => {
        return [
            ...new Set(
                normalizedActivities
                    .map((activity) => activity.action)
                    .filter(Boolean)
            ),
        ];
    }, [normalizedActivities]);

    const moduleOptions = useMemo(() => {
        return [
            ...new Set(
                normalizedActivities
                    .map((activity) => activity.module)
                    .filter(Boolean)
            ),
        ];
    }, [normalizedActivities]);

    // ============================================================
    // FILTER ACTIVITIES
    // ============================================================

    const filteredActivities = useMemo(() => {
        return normalizedActivities.filter((activity) => {
            // ----------------------------------------------------
            // USER
            // ----------------------------------------------------

            if (
                filters.userId !== "all" &&
                String(activity.userId) !== String(filters.userId)
            ) {
                return false;
            }

            // ----------------------------------------------------
            // ACTION
            // ----------------------------------------------------

            if (
                filters.action !== "all" &&
                activity.action !== filters.action
            ) {
                return false;
            }

            // ----------------------------------------------------
            // MODULE
            // ----------------------------------------------------

            if (
                filters.module !== "all" &&
                activity.module !== filters.module
            ) {
                return false;
            }

            // ----------------------------------------------------
            // DATE
            // ----------------------------------------------------

            if (activity.dateTime) {
                const activityDate = new Date(activity.dateTime);

                if (!Number.isNaN(activityDate.getTime())) {
                    if (filters.dateFrom) {
                        const fromDate = new Date(
                            `${filters.dateFrom}T00:00:00`
                        );

                        if (activityDate < fromDate) {
                            return false;
                        }
                    }

                    if (filters.dateTo) {
                        const toDate = new Date(
                            `${filters.dateTo}T23:59:59`
                        );

                        if (activityDate > toDate) {
                            return false;
                        }
                    }
                }
            }

            return true;
        });
    }, [normalizedActivities, filters]);

    // ============================================================
    // UPDATE FILTER
    // ============================================================

    const updateFilter = (name, value) => {
        setFilters((current) => ({
            ...current,
            [name]: value,
        }));
    };

    // ============================================================
    // RESET FILTERS
    // ============================================================

    const resetFilters = () => {
        setFilters({
            userId: "all",
            dateFrom: "",
            dateTo: "",
            action: "all",
            module: "all",
        });
    };

    // ============================================================
    // VIEW ACTIVITY
    // ============================================================

    const handleViewActivity = (activity) => {
        if (!activity) {
            return;
        }

        const exists = normalizedActivities.some(
            (item) => String(item.id) === String(activity.id)
        );

        if (!exists) {
            setSelectedActivity(null);
            return;
        }

        setSelectedActivity(activity);
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <Card>
                <CardContent className="flex min-h-[250px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />

                        <p className="text-sm text-muted-foreground">
                            Loading activity logs...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <Card className="border-destructive/30">
                <CardContent className="flex min-h-[250px] items-center justify-center p-6">
                    <div className="text-center">
                        <FileClock className="mx-auto mb-3 h-10 w-10 text-destructive" />

                        <h3 className="font-semibold text-foreground">
                            Unable to load activity logs.
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {error ||
                                "Unable to load activity logs. Please try again."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ============================================================
    // MAIN
    // ============================================================

    return (
        <>
            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-border bg-muted p-2.5">
                                <Activity className="h-5 w-5 text-foreground" />
                            </div>

                            <div>
                                <CardTitle className="text-base">
                                    Activity Logs
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Monitor recent user and system activities.
                                </p>
                            </div>
                        </div>

                        <Badge variant="outline">
                            {filteredActivities.length} activities
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* ==================================================
                        FILTERS
                    ================================================== */}

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />

                                <h3 className="text-sm font-semibold">
                                    Activity Filters
                                </h3>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {/* USER */}

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    User
                                </label>

                                <select
                                    value={filters.userId}
                                    onChange={(event) =>
                                        updateFilter(
                                            "userId",
                                            event.target.value
                                        )
                                    }
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="all">
                                        All Users
                                    </option>

                                    {users.map((user) => {
                                        const id =
                                            user?.id ??
                                            user?._id ??
                                            user?.userId;

                                        const name =
                                            user?.fullName ??
                                            user?.name ??
                                            user?.username ??
                                            user?.email ??
                                            "Unknown User";

                                        if (id === undefined) {
                                            return null;
                                        }

                                        return (
                                            <option
                                                key={String(id)}
                                                value={String(id)}
                                            >
                                                {name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* DATE FROM */}

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Date From
                                </label>

                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(event) =>
                                            updateFilter(
                                                "dateFrom",
                                                event.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                                    />
                                </div>
                            </div>

                            {/* DATE TO */}

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Date To
                                </label>

                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(event) =>
                                            updateFilter(
                                                "dateTo",
                                                event.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                                    />
                                </div>
                            </div>

                            {/* ACTION */}

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Action
                                </label>

                                <select
                                    value={filters.action}
                                    onChange={(event) =>
                                        updateFilter(
                                            "action",
                                            event.target.value
                                        )
                                    }
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="all">
                                        All Actions
                                    </option>

                                    {actionOptions.map((action) => (
                                        <option
                                            key={action}
                                            value={action}
                                        >
                                            {action}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* MODULE */}

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Module
                                </label>

                                <select
                                    value={filters.module}
                                    onChange={(event) =>
                                        updateFilter(
                                            "module",
                                            event.target.value
                                        )
                                    }
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="all">
                                        All Modules
                                    </option>

                                    {moduleOptions.map((module) => (
                                        <option
                                            key={module}
                                            value={module}
                                        >
                                            {module}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
                        NO ACTIVITIES
                    ================================================== */}

                    {normalizedActivities.length === 0 && (
                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                            <Activity className="mb-3 h-10 w-10 text-muted-foreground" />

                            <h3 className="text-lg font-semibold">
                                No activities found.
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                There are currently no activity records
                                available.
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        NO FILTER RESULTS
                    ================================================== */}

                    {normalizedActivities.length > 0 &&
                        filteredActivities.length === 0 && (
                            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                                <Filter className="mb-3 h-10 w-10 text-muted-foreground" />

                                <h3 className="text-lg font-semibold">
                                    No activities found.
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    No activity records match the selected
                                    filters.
                                </p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        )}

                    {/* ==================================================
                        TABLE
                    ================================================== */}

                    {filteredActivities.length > 0 && (
                        <div className="overflow-x-auto rounded-xl border border-border">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            User
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Role
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Action
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Module
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Date & Time
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            IP / Device
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Details
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredActivities.map((activity) => (
                                        <tr
                                            key={String(activity.id)}
                                            className="border-b border-border last:border-0 hover:bg-muted/30"
                                        >
                                            {/* USER */}

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                    </div>

                                                    <span className="text-sm font-medium">
                                                        {activity.userName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* ROLE */}

                                            <td className="px-5 py-4">
                                                <Badge variant="outline">
                                                    {activity.userRole}
                                                </Badge>
                                            </td>

                                            {/* ACTION */}

                                            <td className="px-5 py-4">
                                                <span className="text-sm font-medium">
                                                    {activity.action}
                                                </span>
                                            </td>

                                            {/* MODULE */}

                                            <td className="px-5 py-4">
                                                <span className="text-sm text-muted-foreground">
                                                    {activity.module}
                                                </span>
                                            </td>

                                            {/* DATE */}

                                            <td className="px-5 py-4">
                                                <span className="text-sm text-muted-foreground">
                                                    {activity.dateTime
                                                        ? new Date(
                                                              activity.dateTime
                                                          ).toLocaleString()
                                                        : "Not available"}
                                                </span>
                                            </td>

                                            {/* IP / DEVICE */}

                                            <td className="px-5 py-4">
                                                <div className="text-sm">
                                                    {activity.ipAddress}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    {activity.device}
                                                </div>
                                            </td>

                                            {/* DETAILS */}

                                            <td className="px-5 py-4 text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleViewActivity(
                                                            activity
                                                        )
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ============================================================
                ACTIVITY DETAILS
            ============================================================ */}

            {selectedActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-background shadow-xl">
                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-border p-5">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Activity Details
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Complete information for the selected
                                    activity record.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setSelectedActivity(null)
                                }
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* DETAILS */}

                        <div className="grid gap-4 p-5 md:grid-cols-2">
                            <DetailItem
                                label="User"
                                value={selectedActivity.userName}
                            />

                            <DetailItem
                                label="Role"
                                value={selectedActivity.userRole}
                            />

                            <DetailItem
                                label="Action"
                                value={selectedActivity.action}
                            />

                            <DetailItem
                                label="Module"
                                value={selectedActivity.module}
                            />

                            <DetailItem
                                label="Date & Time"
                                value={
                                    selectedActivity.dateTime
                                        ? new Date(
                                              selectedActivity.dateTime
                                          ).toLocaleString()
                                        : "Not available"
                                }
                            />

                            <DetailItem
                                label="IP Address"
                                value={selectedActivity.ipAddress}
                            />

                            <DetailItem
                                label="Device"
                                value={selectedActivity.device}
                            />

                            <DetailItem
                                label="Activity ID"
                                value={String(selectedActivity.id)}
                            />

                            {selectedActivity.description && (
                                <div className="md:col-span-2">
                                    <DetailItem
                                        label="Description"
                                        value={
                                            selectedActivity.description
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}

                        <div className="flex justify-end border-t border-border p-5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setSelectedActivity(null)
                                }
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({ label, value }) {
    return (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-foreground">
                {value || "Not available"}
            </p>
        </div>
    );
}

export default ActivityLogs;