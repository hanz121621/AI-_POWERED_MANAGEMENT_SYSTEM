"use client";

import { useMemo, useState } from "react";
import {
    CalendarDays,
    Eye,
    FileText,
    Filter,
    RotateCcw,
    ShieldCheck,
    X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function AuditLogs({
    auditLogs = [],
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

    const [selectedAudit, setSelectedAudit] = useState(null);

    // ============================================================
    // HELPERS
    // ============================================================

    const getId = (item) =>
        item?.id ??
        item?._id ??
        item?.userId ??
        item?.user?.id ??
        item?.user?._id ??
        "";

    const getUserId = (audit) =>
        String(
            audit?.userId ??
                audit?.user?.id ??
                audit?.user?._id ??
                ""
        );

    const getUserName = (audit) => {
        const userId = getUserId(audit);

        const matchedUser = users.find(
            (user) => String(getId(user)) === userId
        );

        return (
            audit?.userName ||
            audit?.username ||
            audit?.user?.name ||
            audit?.user?.fullName ||
            audit?.user?.username ||
            matchedUser?.fullName ||
            matchedUser?.name ||
            matchedUser?.username ||
            matchedUser?.email ||
            "Unknown User"
        );
    };

    const getUserRole = (audit) =>
        audit?.userRole ||
        audit?.role ||
        audit?.user?.role ||
        "Unknown";

    const getAction = (audit) =>
        audit?.action ||
        audit?.actionType ||
        audit?.event ||
        audit?.activity ||
        "Unknown Action";

    const getModule = (audit) =>
        audit?.module ||
        audit?.moduleName ||
        audit?.affectedModule ||
        audit?.resource ||
        audit?.entity ||
        "Unknown Module";

    const getDateTime = (audit) =>
        audit?.dateTime ||
        audit?.timestamp ||
        audit?.createdAt ||
        audit?.date ||
        "";

    const getPreviousValue = (audit) =>
        audit?.previousValue ??
        audit?.oldValue ??
        audit?.before ??
        audit?.oldData ??
        null;

    const getNewValue = (audit) =>
        audit?.newValue ??
        audit?.after ??
        audit?.newData ??
        null;

    const formatDate = (value) => {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString();
    };

    const formatValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "Not available";
        }

        if (typeof value === "object") {
            return JSON.stringify(value, null, 2);
        }

        return String(value);
    };

    // ============================================================
    // DYNAMIC FILTER OPTIONS
    // BR7 — USE STORED SYSTEM DATA
    // ============================================================

    const actionOptions = useMemo(() => {
        const values = auditLogs
            .map((audit) => getAction(audit))
            .filter(
                (value) =>
                    value &&
                    value !== "Unknown Action"
            );

        return [...new Set(values)];
    }, [auditLogs]);

    const moduleOptions = useMemo(() => {
        const values = auditLogs
            .map((audit) => getModule(audit))
            .filter(
                (value) =>
                    value &&
                    value !== "Unknown Module"
            );

        return [...new Set(values)];
    }, [auditLogs]);

    const userOptions = useMemo(() => {
        const values = auditLogs
            .map((audit) => ({
                id: getUserId(audit),
                name: getUserName(audit),
            }))
            .filter((user) => user.id);

        const uniqueUsers = [];

        values.forEach((user) => {
            if (
                !uniqueUsers.some(
                    (existing) =>
                        existing.id === user.id
                )
            ) {
                uniqueUsers.push(user);
            }
        });

        // Also include users passed from Reports.jsx
        users.forEach((user) => {
            const id = String(getId(user));

            if (!id) {
                return;
            }

            const name =
                user?.fullName ||
                user?.name ||
                user?.username ||
                user?.email ||
                "Unknown User";

            if (
                !uniqueUsers.some(
                    (existing) =>
                        existing.id === id
                )
            ) {
                uniqueUsers.push({
                    id,
                    name,
                });
            }
        });

        return uniqueUsers;
    }, [auditLogs, users]);

    // ============================================================
    // FILTER LOGS
    // ============================================================

    const filteredLogs = useMemo(() => {
        return auditLogs.filter((audit) => {
            const userId = getUserId(audit);
            const action = getAction(audit);
            const module = getModule(audit);
            const dateValue = getDateTime(audit);

            // USER
            if (
                filters.userId !== "all" &&
                userId !== String(filters.userId)
            ) {
                return false;
            }

            // ACTION
            if (
                filters.action !== "all" &&
                action !== filters.action
            ) {
                return false;
            }

            // MODULE
            if (
                filters.module !== "all" &&
                module !== filters.module
            ) {
                return false;
            }

            // DATE
            if (
                filters.dateFrom ||
                filters.dateTo
            ) {
                if (!dateValue) {
                    return false;
                }

                const auditDate = new Date(dateValue);

                if (
                    Number.isNaN(
                        auditDate.getTime()
                    )
                ) {
                    return false;
                }

                const auditDateOnly =
                    auditDate
                        .toISOString()
                        .split("T")[0];

                if (
                    filters.dateFrom &&
                    auditDateOnly <
                        filters.dateFrom
                ) {
                    return false;
                }

                if (
                    filters.dateTo &&
                    auditDateOnly >
                        filters.dateTo
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [auditLogs, filters]);

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
    // FILTER UPDATE
    // ============================================================

    const updateFilter = (name, value) => {
        setFilters((current) => ({
            ...current,
            [name]: value,
        }));

        setSelectedAudit(null);
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <Card className="border-border">
                <CardContent className="flex min-h-[300px] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />

                        <p className="text-sm text-muted-foreground">
                            Loading audit logs...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ============================================================
    // ERROR
    // A2
    // ============================================================

    if (error) {
        return (
            <Card className="border-destructive/30">
                <CardContent className="flex min-h-[250px] flex-col items-center justify-center p-6 text-center">
                    <ShieldCheck className="mb-4 h-10 w-10 text-destructive" />

                    <h2 className="text-lg font-semibold text-foreground">
                        Unable to load audit logs.
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Please try again.
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                        {error}
                    </p>
                </CardContent>
            </Card>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-border bg-muted p-2.5">
                            <ShieldCheck className="h-5 w-5 text-foreground" />
                        </div>

                        <div>
                            <CardTitle className="text-base">
                                Audit Logs
                            </CardTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Review historical system changes
                                and security-related activities.
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* ==================================================
                FILTERS
            ================================================== */}

            <Card className="border-border bg-card">
                <CardContent className="p-4">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg border border-border bg-muted p-2">
                                <Filter className="h-4 w-4 text-foreground" />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Audit Filters
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Filter audit records using
                                    stored system data.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Filters
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        {/* USER */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                User
                            </label>

                            <Select
                                value={filters.userId}
                                onValueChange={(value) =>
                                    updateFilter(
                                        "userId",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All users" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        All users
                                    </SelectItem>

                                    {userOptions.map(
                                        (user) => (
                                            <SelectItem
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
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* DATE FROM */}

                        <div className="space-y-2">
                            <label
                                htmlFor="audit-date-from"
                                className="text-sm font-medium text-foreground"
                            >
                                From Date
                            </label>

                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="audit-date-from"
                                    type="date"
                                    value={
                                        filters.dateFrom
                                    }
                                    onChange={(event) =>
                                        updateFilter(
                                            "dateFrom",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* DATE TO */}

                        <div className="space-y-2">
                            <label
                                htmlFor="audit-date-to"
                                className="text-sm font-medium text-foreground"
                            >
                                To Date
                            </label>

                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="audit-date-to"
                                    type="date"
                                    value={
                                        filters.dateTo
                                    }
                                    onChange={(event) =>
                                        updateFilter(
                                            "dateTo",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* ACTION */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Action Type
                            </label>

                            <Select
                                value={filters.action}
                                onValueChange={(value) =>
                                    updateFilter(
                                        "action",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All actions" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        All actions
                                    </SelectItem>

                                    {actionOptions.map(
                                        (action) => (
                                            <SelectItem
                                                key={action}
                                                value={action}
                                            >
                                                {action}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* MODULE */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Module
                            </label>

                            <Select
                                value={filters.module}
                                onValueChange={(value) =>
                                    updateFilter(
                                        "module",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All modules" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        All modules
                                    </SelectItem>

                                    {moduleOptions.map(
                                        (module) => (
                                            <SelectItem
                                                key={module}
                                                value={module}
                                            >
                                                {module}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ==================================================
                RESULT COUNT
            ================================================== */}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Audit Records
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        {filteredLogs.length} record
                        {filteredLogs.length === 1
                            ? ""
                            : "s"} found
                    </p>
                </div>

                <Badge variant="outline">
                    Read-only
                </Badge>
            </div>

            {/* ==================================================
                NO AUDIT RECORDS
                A1
            ================================================== */}

            {auditLogs.length === 0 && (
                <Card className="border-border">
                    <CardContent className="flex min-h-[250px] flex-col items-center justify-center p-6 text-center">
                        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />

                        <h2 className="text-lg font-semibold text-foreground">
                            No audit records found.
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            There are currently no audit
                            records available in the system.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* ==================================================
                NO FILTER RESULTS
            ================================================== */}

            {auditLogs.length > 0 &&
                filteredLogs.length === 0 && (
                    <Card className="border-border">
                        <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
                            <Filter className="mb-4 h-10 w-10 text-muted-foreground" />

                            <h2 className="text-lg font-semibold text-foreground">
                                No audit records found.
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                No audit records match the
                                selected filters.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset Filters
                            </Button>
                        </CardContent>
                    </Card>
                )}

            {/* ==================================================
                AUDIT TABLE
            ================================================== */}

            {filteredLogs.length > 0 && (
                <Card className="border-border bg-card">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr className="border-b border-border bg-muted/40">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            User
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Role
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Action
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Date & Time
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Module
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Details
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredLogs.map(
                                        (
                                            audit,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    getId(
                                                        audit
                                                    ) ||
                                                    index
                                                }
                                                className="border-b border-border transition hover:bg-muted/30"
                                            >
                                                {/* USER */}

                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-foreground">
                                                        {getUserName(
                                                            audit
                                                        )}
                                                    </div>
                                                </td>

                                                {/* ROLE */}

                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {getUserRole(
                                                        audit
                                                    )}
                                                </td>

                                                {/* ACTION */}

                                                <td className="px-6 py-4">
                                                    <Badge variant="outline">
                                                        {getAction(
                                                            audit
                                                        )}
                                                    </Badge>
                                                </td>

                                                {/* DATE */}

                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {formatDate(
                                                        getDateTime(
                                                            audit
                                                        )
                                                    )}
                                                </td>

                                                {/* MODULE */}

                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {getModule(
                                                        audit
                                                    )}
                                                </td>

                                                {/* DETAILS */}

                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedAudit(
                                                                audit
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ==================================================
                SELECTED AUDIT DETAILS
                Main Success Scenario #8-9
            ================================================== */}

            {selectedAudit && (
                <Card className="border-border bg-card">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg border border-border bg-muted p-2">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <CardTitle className="text-base">
                                        Audit Record Details
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Detailed information
                                        about the selected
                                        system change.
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setSelectedAudit(
                                        null
                                    )
                                }
                            >
                                <X className="mr-2 h-4 w-4" />
                                Close
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* USER */}

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    User
                                </p>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {getUserName(
                                        selectedAudit
                                    )}
                                </p>
                            </div>

                            {/* ROLE */}

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Role
                                </p>

                                <p className="mt-1 text-sm text-foreground">
                                    {getUserRole(
                                        selectedAudit
                                    )}
                                </p>
                            </div>

                            {/* ACTION */}

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Action
                                </p>

                                <p className="mt-1 text-sm text-foreground">
                                    {getAction(
                                        selectedAudit
                                    )}
                                </p>
                            </div>

                            {/* DATE */}

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Date & Time
                                </p>

                                <p className="mt-1 text-sm text-foreground">
                                    {formatDate(
                                        getDateTime(
                                            selectedAudit
                                        )
                                    )}
                                </p>
                            </div>

                            {/* MODULE */}

                            <div className="md:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Affected Module
                                </p>

                                <p className="mt-1 text-sm text-foreground">
                                    {getModule(
                                        selectedAudit
                                    )}
                                </p>
                            </div>

                            {/* PREVIOUS VALUE */}

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Previous Value
                                </p>

                                <pre className="mt-2 max-h-[250px] overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground">
                                    {formatValue(
                                        getPreviousValue(
                                            selectedAudit
                                        )
                                    )}
                                </pre>
                            </div>

                            {/* NEW VALUE */}

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    New Value
                                </p>

                                <pre className="mt-2 max-h-[250px] overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground">
                                    {formatValue(
                                        getNewValue(
                                            selectedAudit
                                        )
                                    )}
                                </pre>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default AuditLogs;