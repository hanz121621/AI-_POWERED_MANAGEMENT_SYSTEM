import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Database,
  Eye,
  FileWarning,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function SystemReportTable({
  reports = [],
  loading = false,
  error = "",
  onView,
}) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  /*
   * Normalize report data.
   *
   * The component supports data coming from
   * different services without requiring
   * hard-coded records.
   */
  const normalizedReports = useMemo(() => {
    return reports.map((report, index) => ({
      id:
        report?.id ??
        report?._id ??
        `report-${index}`,

      name:
        report?.name ??
        report?.title ??
        report?.metric ??
        report?.label ??
        "Unnamed Report",

      category:
        report?.category ??
        report?.type ??
        report?.module ??
        "System",

      value:
        report?.value ??
        report?.count ??
        report?.total ??
        0,

      description:
        report?.description ??
        report?.details ??
        "",

      status:
        report?.status ??
        "Available",

      updatedAt:
        report?.updatedAt ??
        report?.lastUpdated ??
        report?.timestamp ??
        null,

      raw: report,
    }));
  }, [reports]);

  /*
   * Search system reports.
   */
  const filteredReports = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return normalizedReports;
    }

    return normalizedReports.filter(
      (report) => {
        return [
          report.name,
          report.category,
          report.description,
          report.status,
          String(report.value),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      }
    );
  }, [normalizedReports, search]);

  /*
   * Sort reports.
   */
  const sortedReports = useMemo(() => {
    const data = [...filteredReports];

    data.sort((a, b) => {
      const first = a[sortConfig.key];
      const second = b[sortConfig.key];

      if (
        first === null ||
        first === undefined
      ) {
        return 1;
      }

      if (
        second === null ||
        second === undefined
      ) {
        return -1;
      }

      if (
        typeof first === "number" &&
        typeof second === "number"
      ) {
        return sortConfig.direction === "asc"
          ? first - second
          : second - first;
      }

      const comparison = String(first)
        .localeCompare(
          String(second),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        );

      return sortConfig.direction === "asc"
        ? comparison
        : -comparison;
    });

    return data;
  }, [filteredReports, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key &&
        current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleString();
  };

  const getStatusVariant = (status) => {
    const normalized = String(
      status ?? ""
    ).toLowerCase();

    if (
      normalized.includes("active") ||
      normalized.includes("complete") ||
      normalized.includes("available") ||
      normalized.includes("success")
    ) {
      return "default";
    }

    if (
      normalized.includes("inactive") ||
      normalized.includes("pending") ||
      normalized.includes("warning")
    ) {
      return "secondary";
    }

    if (
      normalized.includes("error") ||
      normalized.includes("failed")
    ) {
      return "destructive";
    }

    return "outline";
  };

  /*
   * Reusable sort icon.
   */
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
      );
    }

    if (sortConfig.direction === "asc") {
      return (
        <ArrowUp className="ml-1 h-3.5 w-3.5 text-foreground" />
      );
    }

    return (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-foreground" />
    );
  };

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            System Reports
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-md bg-muted"
                />
              )
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  /*
   * Report generation/retrieval error.
   */
  if (error) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <div className="rounded-full border border-border bg-muted p-3">
            <FileWarning className="h-6 w-6 text-foreground" />
          </div>

          <h3 className="mt-4 font-semibold text-foreground">
            Unable to generate system reports
          </h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {error ||
              "Please try again."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      {/* Header */}
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-border bg-muted p-2">
                <Database className="h-4 w-4 text-foreground" />
              </div>

              <CardTitle className="text-base text-foreground">
                System Reports
              </CardTitle>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              System-level information calculated from
              current system data.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search reports..."
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* No data */}
        {reports.length === 0 ? (
          <div className="p-10 text-center">
            <Database className="mx-auto h-9 w-9 text-muted-foreground" />

            <h3 className="mt-4 font-medium text-foreground">
              No report data available.
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              System reports will appear here when
              current users, projects, teams, tasks,
              activities, and other system records are
              available.
            </p>
          </div>
        ) : sortedReports.length === 0 ? (
          /* No search result */
          <div className="p-10 text-center">
            <Search className="mx-auto h-9 w-9 text-muted-foreground" />

            <h3 className="mt-4 font-medium text-foreground">
              No report data found for the selected
              filters.
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search criteria.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() =>
                setSearch("")
              }
            >
              Clear Search
            </Button>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left">
                    <button
                      type="button"
                      onClick={() =>
                        handleSort("name")
                      }
                      className="inline-flex items-center font-medium text-muted-foreground hover:text-foreground"
                    >
                      Report
                      <SortIcon column="name" />
                    </button>
                  </th>

                  <th className="px-6 py-3 text-left">
                    <button
                      type="button"
                      onClick={() =>
                        handleSort(
                          "category"
                        )
                      }
                      className="inline-flex items-center font-medium text-muted-foreground hover:text-foreground"
                    >
                      Category
                      <SortIcon column="category" />
                    </button>
                  </th>

                  <th className="px-6 py-3 text-left">
                    <button
                      type="button"
                      onClick={() =>
                        handleSort("value")
                      }
                      className="inline-flex items-center font-medium text-muted-foreground hover:text-foreground"
                    >
                      Value
                      <SortIcon column="value" />
                    </button>
                  </th>

                  <th className="px-6 py-3 text-left">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left">
                    Last Updated
                  </th>

                  <th className="px-6 py-3 text-right">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedReports.map(
                  (report) => (
                    <tr
                      key={report.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      {/* Report */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {report.name}
                          </p>

                          {report.description && (
                            <p className="mt-1 max-w-sm truncate text-xs text-muted-foreground">
                              {report.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <Badge variant="outline">
                          {report.category}
                        </Badge>
                      </td>

                      {/* Value */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">
                          {typeof report.value ===
                          "number"
                            ? report.value.toLocaleString()
                            : report.value}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge
                          variant={getStatusVariant(
                            report.status
                          )}
                        >
                          {report.status}
                        </Badge>
                      </td>

                      {/* Updated */}
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(
                          report.updatedAt
                        )}
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onView?.(
                              report.raw
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
        )}
      </CardContent>
    </Card>
  );
}

export default SystemReportTable;