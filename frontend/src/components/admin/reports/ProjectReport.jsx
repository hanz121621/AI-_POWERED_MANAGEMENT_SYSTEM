import  { useMemo } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CircleDashed,
  CalendarDays,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function ProjectReport({ projects = [] }) {
  const getStatus = (project) =>
    String(project?.status ?? "")
      .trim()
      .toLowerCase();

  const getProgress = (project) => {
    const value =
      project?.progress ??
      project?.completion ??
      project?.completionRate ??
      0;

    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Math.min(100, Math.max(0, number));
  };

  const getProjectName = (project) =>
    project?.name ||
    project?.projectName ||
    "Unnamed Project";

  const getManagerName = (project) => {
    if (typeof project?.manager === "string") {
      return project.manager;
    }

    return (
      project?.manager?.name ||
      project?.manager?.fullName ||
      project?.managerName ||
      "Not assigned"
    );
  };

  const getTeamName = (project) => {
    if (typeof project?.team === "string") {
      return project.team;
    }

    return (
      project?.team?.name ||
      project?.teamName ||
      "Not assigned"
    );
  };

  const getDeadline = (project) =>
    project?.deadline ||
    project?.dueDate ||
    project?.endDate ||
    null;

  const summary = useMemo(() => {
    const statusGroups = {};

    projects.forEach((project) => {
      const status = getStatus(project) || "unknown";

      statusGroups[status] =
        (statusGroups[status] || 0) + 1;
    });

    const completed = projects.filter((project) =>
      ["completed", "complete", "finished", "done"].includes(
        getStatus(project)
      )
    ).length;

    const active = projects.filter((project) =>
      ["active", "in progress", "ongoing", "started"].includes(
        getStatus(project)
      )
    ).length;

    const notStarted = projects.filter((project) =>
      ["not started", "pending", "planned", "new"].includes(
        getStatus(project)
      )
    ).length;

    const overdue = projects.filter((project) => {
      const deadline = getDeadline(project);

      if (!deadline) {
        return false;
      }

      const deadlineDate = new Date(deadline);

      if (Number.isNaN(deadlineDate.getTime())) {
        return false;
      }

      const status = getStatus(project);

      if (
        ["completed", "complete", "finished", "done"].includes(
          status
        )
      ) {
        return false;
      }

      return deadlineDate < new Date();
    }).length;

    const averageProgress =
      projects.length > 0
        ? Math.round(
            projects.reduce(
              (total, project) =>
                total + getProgress(project),
              0
            ) / projects.length
          )
        : 0;

    return {
      total: projects.length,
      active,
      completed,
      notStarted,
      overdue,
      averageProgress,
      statusGroups,
    };
  }, [projects]);

  const statusBadge = (status) => {
    const normalized = String(status || "")
      .trim()
      .toLowerCase();

    if (
      ["completed", "complete", "finished", "done"].includes(
        normalized
      )
    ) {
      return (
        <Badge variant="secondary">
          Completed
        </Badge>
      );
    }

    if (
      ["active", "in progress", "ongoing", "started"].includes(
        normalized
      )
    ) {
      return (
        <Badge>
          {status || "Active"}
        </Badge>
      );
    }

    if (
      ["pending", "planned", "not started", "new"].includes(
        normalized
      )
    ) {
      return (
        <Badge variant="outline">
          {status || "Not Started"}
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        {status || "Unknown"}
      </Badge>
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "No deadline";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Invalid date";
    }

    return parsed.toLocaleDateString();
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Project Performance
        </h2>

        <p className="text-sm text-muted-foreground">
          Current project status, progress, ownership, and
          deadlines.
        </p>
      </div>

      {/* Project Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Projects
              </p>

              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.total.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Active
              </p>

              <Clock3 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.active.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Completed
              </p>

              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.completed.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Overdue
              </p>

              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.overdue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Avg. Progress
              </p>

              <CircleDashed className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.averageProgress}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Project Status Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
              <FolderKanban className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <p className="font-medium text-foreground">
                No report data available.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Project information will appear here when
                system data is available.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {Object.entries(summary.statusGroups).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    <p className="text-xs capitalize text-muted-foreground">
                      {status.replace(/[-_]/g, " ")}
                    </p>

                    <p className="mt-1 text-xl font-semibold text-foreground">
                      {count.toLocaleString()}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Project Details
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No projects found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Project
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Manager
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Team
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Progress
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Deadline
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project, index) => {
                    const progress = getProgress(project);
                    const deadline = getDeadline(project);

                    return (
                      <tr
                        key={
                          project?.id ??
                          project?._id ??
                          `project-${index}`
                        }
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {getProjectName(project)}
                            </p>

                            {project?.description && (
                              <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                                {project.description}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {getManagerName(project)}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {getTeamName(project)}
                        </td>

                        <td className="px-6 py-4">
                          {statusBadge(project?.status)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="min-w-[140px]">
                            <div className="mb-1 flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Progress
                              </span>

                              <span className="font-medium text-foreground">
                                {progress}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-foreground transition-all"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />

                            <span>
                              {formatDate(deadline)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default ProjectReport;