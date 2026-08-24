import  { useMemo } from "react";
import {
  Users,
  

  FolderKanban,
  CheckCircle2,
 
  AlertTriangle,
  UsersRound,
  ListChecks,
  BrainCircuit,
  Activity,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ReportSummaryCards({
  users = [],
  projects = [],
  teams = [],
  tasks = [],
  activities = [],
  aiUsage = [],
}) {
  const summary = useMemo(() => {
    const normalize = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase();

    const isActive = (item) => {
      const status = normalize(item?.status);

      if (typeof item?.active === "boolean") {
        return item.active;
      }

      if (typeof item?.isActive === "boolean") {
        return item.isActive;
      }

      return !["inactive", "disabled", "suspended", "deleted"].includes(status);
    };

    const projectStatus = (project) =>
      normalize(project?.status);

    const taskStatus = (task) =>
      normalize(task?.status);

    const activeUsers = users.filter(isActive).length;
    const inactiveUsers = users.length - activeUsers;

    const activeProjects = projects.filter((project) =>
      ["active", "in progress", "ongoing", "started"].includes(
        projectStatus(project)
      )
    ).length;

    const completedProjects = projects.filter((project) =>
      ["completed", "complete", "finished", "done"].includes(
        projectStatus(project)
      )
    ).length;

    const completedTasks = tasks.filter((task) =>
      ["completed", "complete", "finished", "done"].includes(
        taskStatus(task)
      )
    ).length;

    const inProgressTasks = tasks.filter((task) =>
      ["in progress", "ongoing", "started", "working"].includes(
        taskStatus(task)
      )
    ).length;

    const overdueTasks = tasks.filter((task) => {
      const status = taskStatus(task);

      if (
        ["completed", "complete", "finished", "done"].includes(status)
      ) {
        return false;
      }

      const deadline =
        task?.deadline ||
        task?.dueDate ||
        task?.endDate;

      if (!deadline) {
        return false;
      }

      const deadlineDate = new Date(deadline);

      if (Number.isNaN(deadlineDate.getTime())) {
        return false;
      }

      return deadlineDate < new Date();
    }).length;

    return {
      totalUsers: users.length,
      activeUsers,
      inactiveUsers,

      totalProjects: projects.length,
      activeProjects,
      completedProjects,

      totalTeams: teams.length,

      totalTasks: tasks.length,
      completedTasks,
      inProgressTasks,
      overdueTasks,

      totalActivities: activities.length,

      aiUsageCount: Array.isArray(aiUsage)
        ? aiUsage.length
        : Number(aiUsage?.total ?? aiUsage?.count ?? 0),
    };
  }, [users, projects, teams, tasks, activities, aiUsage]);

  const cards = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      description: `${summary.activeUsers} active · ${summary.inactiveUsers} inactive`,
      icon: Users,
    },
    {
      title: "Projects",
      value: summary.totalProjects,
      description: `${summary.activeProjects} active · ${summary.completedProjects} completed`,
      icon: FolderKanban,
    },
    {
      title: "Teams",
      value: summary.totalTeams,
      description: "Teams currently registered",
      icon: UsersRound,
    },
    {
      title: "Total Tasks",
      value: summary.totalTasks,
      description: `${summary.completedTasks} completed · ${summary.inProgressTasks} in progress`,
      icon: ListChecks,
    },
    {
      title: "Completed Tasks",
      value: summary.completedTasks,
      description:
        summary.totalTasks > 0
          ? `${Math.round(
              (summary.completedTasks / summary.totalTasks) * 100
            )}% completion rate`
          : "No task data available",
      icon: CheckCircle2,
    },
    {
      title: "Overdue Tasks",
      value: summary.overdueTasks,
      description:
        summary.overdueTasks > 0
          ? "Tasks requiring attention"
          : "No overdue tasks",
      icon: AlertTriangle,
    },
    {
      title: "User Activity",
      value: summary.totalActivities,
      description: "Recorded activity entries",
      icon: Activity,
    },
    {
      title: "AI Usage",
      value: summary.aiUsageCount,
      description: "Recorded AI usage entries",
      icon: BrainCircuit,
    },
  ];

  return (
    <section
      aria-label="System report summary"
      className="space-y-4"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          System Overview
        </h2>

        <p className="text-sm text-muted-foreground">
          Current system performance based on available system data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="border-border bg-card transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>

                <div className="rounded-lg border border-border bg-muted p-2">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value.toLocaleString()}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default ReportSummaryCards;