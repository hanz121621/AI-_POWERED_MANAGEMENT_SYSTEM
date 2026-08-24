import { useMemo } from "react";
import {
  CalendarDays,
  Filter,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ReportFilters({
  projects = [],
  teams = [],
  users = [],
  filters = {},
  onFiltersChange,
  onReset,
}) {
  // ============================================================
  // CURRENT FILTER VALUES
  // ============================================================

  const currentFilters = {
    dateFrom: filters.dateFrom || "",
    dateTo: filters.dateTo || "",
    projectId: filters.projectId || "all",
    teamId: filters.teamId || "all",
    userId: filters.userId || "all",
  };

  // ============================================================
  // GET ID
  // Supports different data structures
  // ============================================================

  const getId = (item) =>
    item?.id ??
    item?._id ??
    item?.userId ??
    item?.projectId ??
    item?.teamId;

  // ============================================================
  // GET NAME
  // Supports different data structures
  // ============================================================

  const getName = (item) =>
    item?.name ||
    item?.fullName ||
    item?.projectName ||
    item?.teamName ||
    item?.username ||
    item?.title ||
    item?.email ||
    "Unnamed";

  // ============================================================
  // PROJECT OPTIONS
  // ============================================================

  const projectOptions = useMemo(() => {
    return projects
      .map((project) => ({
        id: String(getId(project) ?? ""),
        name: getName(project),
      }))
      .filter((item) => item.id !== "");
  }, [projects]);

  // ============================================================
  // TEAM OPTIONS
  // ============================================================

  const teamOptions = useMemo(() => {
    return teams
      .map((team) => ({
        id: String(getId(team) ?? ""),
        name: getName(team),
      }))
      .filter((item) => item.id !== "");
  }, [teams]);

  // ============================================================
  // USER OPTIONS
  // ============================================================

  const userOptions = useMemo(() => {
    return users
      .map((user) => ({
        id: String(getId(user) ?? ""),
        name: getName(user),
      }))
      .filter((item) => item.id !== "");
  }, [users]);

  // ============================================================
  // UPDATE FILTER
  // ============================================================

  const updateFilter = (name, value) => {
    const updatedFilters = {
      ...currentFilters,
      [name]: value,
    };

    console.log("Filter changed:", updatedFilters);

    onFiltersChange?.(updatedFilters);
  };

  // ============================================================
  // DEBUG
  // ============================================================

  console.log("ReportFilters data:", {
    projects,
    teams,
    users,
    projectOptions,
    teamOptions,
    userOptions,
    currentFilters,
  });

  // ============================================================
  // SELECT STYLING
  // ============================================================

  const selectClassName =
    "h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-10 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <div className="rounded-lg border border-border bg-muted p-2">
              <Filter className="h-4 w-4 text-foreground" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Report Filters
              </h3>

              <p className="text-xs text-muted-foreground">
                Filter reports using current system data.
              </p>
            </div>

          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Reset filters clicked");
              onReset?.();
            }}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>

        </div>

        {/* ======================================================
            FILTER GRID
        ====================================================== */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

          {/* ====================================================
              FROM DATE
          ==================================================== */}

          <div className="space-y-2">

            <label
              htmlFor="report-date-from"
              className="text-sm font-medium text-foreground"
            >
              From Date
            </label>

            <div className="relative">

              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="report-date-from"
                type="date"
                value={currentFilters.dateFrom}
                onChange={(event) =>
                  updateFilter(
                    "dateFrom",
                    event.target.value
                  )
                }
                className="h-10 pl-9"
              />

            </div>

          </div>

          {/* ====================================================
              TO DATE
          ==================================================== */}

          <div className="space-y-2">

            <label
              htmlFor="report-date-to"
              className="text-sm font-medium text-foreground"
            >
              To Date
            </label>

            <div className="relative">

              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="report-date-to"
                type="date"
                value={currentFilters.dateTo}
                onChange={(event) =>
                  updateFilter(
                    "dateTo",
                    event.target.value
                  )
                }
                className="h-10 pl-9"
              />

            </div>

          </div>

          {/* ====================================================
              PROJECT
          ==================================================== */}

          <div className="space-y-2">

            <label
              htmlFor="report-project"
              className="text-sm font-medium text-foreground"
            >
              Project
            </label>

            <div className="relative">

              <select
                id="report-project"
                value={currentFilters.projectId}
                onChange={(event) =>
                  updateFilter(
                    "projectId",
                    event.target.value
                  )
                }
                className={selectClassName}
              >

                <option value="all">
                  All projects
                </option>

                {projectOptions.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}

              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            </div>

          </div>

          {/* ====================================================
              TEAM
          ==================================================== */}

          <div className="space-y-2">

            <label
              htmlFor="report-team"
              className="text-sm font-medium text-foreground"
            >
              Team
            </label>

            <div className="relative">

              <select
                id="report-team"
                value={currentFilters.teamId}
                onChange={(event) =>
                  updateFilter(
                    "teamId",
                    event.target.value
                  )
                }
                className={selectClassName}
              >

                <option value="all">
                  All teams
                </option>

                {teamOptions.map((team) => (
                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.name}
                  </option>
                ))}

              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            </div>

          </div>

          {/* ====================================================
              USER
          ==================================================== */}

          <div className="space-y-2">

            <label
              htmlFor="report-user"
              className="text-sm font-medium text-foreground"
            >
              User
            </label>

            <div className="relative">

              <select
                id="report-user"
                value={currentFilters.userId}
                onChange={(event) =>
                  updateFilter(
                    "userId",
                    event.target.value
                  )
                }
                className={selectClassName}
              >

                <option value="all">
                  All users
                </option>

                {userOptions.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name}
                  </option>
                ))}

              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            </div>

          </div>

        </div>

        {/* ======================================================
            NO FILTER DATA
        ====================================================== */}

        {!projectOptions.length &&
          !teamOptions.length &&
          !userOptions.length && (

            <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center">

              <p className="text-sm text-muted-foreground">
                No project, team, or user data is currently
                available for filtering.
              </p>

            </div>

          )}

      </CardContent>
    </Card>
  );
}

export default ReportFilters;