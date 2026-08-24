import  { useMemo } from "react";
import {
  ListChecks,
  CheckCircle2,
  Clock3,
  CircleDashed,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function TaskReport({ tasks = [] }) {
  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const getStatus = (task) => normalize(task?.status);

  const getDeadline = (task) =>
    task?.deadline ||
    task?.dueDate ||
    task?.endDate ||
    null;

  const isCompleted = (task) =>
    [
      "completed",
      "complete",
      "finished",
      "done",
    ].includes(getStatus(task));

  const isInProgress = (task) =>
    [
      "in progress",
      "in-progress",
      "ongoing",
      "started",
      "working",
    ].includes(getStatus(task));

  const isPending = (task) =>
    [
      "pending",
      "not started",
      "not-started",
      "planned",
      "new",
      "todo",
      "to do",
    ].includes(getStatus(task));

  const isOverdue = (task) => {
    if (isCompleted(task)) {
      return false;
    }

    const deadline = getDeadline(task);

    if (!deadline) {
      return false;
    }

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      return false;
    }

    return deadlineDate < new Date();
  };

  const getTaskName = (task) =>
    task?.name ||
    task?.title ||
    task?.taskName ||
    "Unnamed Task";

  const getProjectName = (task) => {
    if (typeof task?.project === "string") {
      return task.project;
    }

    return (
      task?.project?.name ||
      task?.project?.projectName ||
      task?.projectName ||
      "Not assigned"
    );
  };

  const getAssigneeName = (task) => {
    if (typeof task?.assignee === "string") {
      return task.assignee;
    }

    if (typeof task?.assignedTo === "string") {
      return task.assignedTo;
    }

    return (
      task?.assignee?.name ||
      task?.assignee?.fullName ||
      task?.assignedTo?.name ||
      task?.assignedTo?.fullName ||
      task?.assigneeName ||
      "Not assigned"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "No deadline";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString();
  };

  const report = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(isCompleted).length;

    const inProgress = tasks.filter(
      isInProgress
    ).length;

    const pending = tasks.filter(isPending).length;

    const overdue = tasks.filter(isOverdue).length;

    const completedRate =
      total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    const statusGroups = {};

    tasks.forEach((task) => {
      const status =
        getStatus(task) || "unknown";

      statusGroups[status] =
        (statusGroups[status] || 0) + 1;
    });

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completedRate,
      statusGroups,
    };
  }, [tasks]);

  const statusBadge = (task) => {
    if (isCompleted(task)) {
      return (
        <Badge variant="secondary">
          Completed
        </Badge>
      );
    }

    if (isOverdue(task)) {
      return (
        <Badge variant="destructive">
          Overdue
        </Badge>
      );
    }

    if (isInProgress(task)) {
      return (
        <Badge>
          In Progress
        </Badge>
      );
    }

    if (isPending(task)) {
      return (
        <Badge variant="outline">
          Pending
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        {task?.status || "Unknown"}
      </Badge>
    );
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Task Completion Statistics
        </h2>

        <p className="text-sm text-muted-foreground">
          Task status, completion, and deadline information
          calculated from current system records.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Tasks
              </p>

              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.total.toLocaleString()}
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
              {report.completed.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                In Progress
              </p>

              <Clock3 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.inProgress.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Pending
              </p>

              <CircleDashed className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.pending.toLocaleString()}
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
              {report.overdue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Completion Rate
              </p>

              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.completedRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {tasks.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-10 text-center">
            <ListChecks className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />

            <p className="font-medium text-foreground">
              No report data available.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Task statistics will appear when task records
              are available in the system.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Status Distribution */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">
                Task Status Summary
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries(report.statusGroups).map(
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
            </CardContent>
          </Card>

          {/* Task Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">
                Task Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Task
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Project
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Assignee
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Status
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Deadline
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((task, index) => (
                      <tr
                        key={
                          task?.id ??
                          task?._id ??
                          `task-${index}`
                        }
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">
                            {getTaskName(task)}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {getProjectName(task)}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {getAssigneeName(task)}
                        </td>

                        <td className="px-6 py-4">
                          {statusBadge(task)}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(getDeadline(task))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}

export default TaskReport;