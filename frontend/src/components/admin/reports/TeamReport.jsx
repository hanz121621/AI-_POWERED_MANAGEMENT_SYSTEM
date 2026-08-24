import  { useMemo } from "react";
import {
  UsersRound,
  UserCheck,
  ListChecks,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function TeamReport({
  teams = [],
  users = [],
  tasks = [],
}) {
  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const getId = (item) =>
    item?.id ??
    item?._id ??
    item?.teamId ??
    item?.userId;

  const getTeamName = (team) =>
    team?.name ||
    team?.teamName ||
    "Unnamed Team";

  const getTeamMembers = (team) => {
    if (Array.isArray(team?.members)) {
      return team.members;
    }

    if (Array.isArray(team?.memberIds)) {
      return team.memberIds;
    }

    return [];
  };

  const getTaskTeamId = (task) => {
    if (task?.teamId != null) {
      return String(task.teamId);
    }

    if (typeof task?.team === "string") {
      return task.team;
    }

    if (task?.team?.id != null) {
      return String(task.team.id);
    }

    if (task?.team?._id != null) {
      return String(task.team._id);
    }

    return null;
  };

  const isCompletedTask = (task) => {
    return [
      "completed",
      "complete",
      "finished",
      "done",
    ].includes(normalize(task?.status));
  };

  const teamReports = useMemo(() => {
    return teams.map((team) => {
      const teamId = getId(team);
      const normalizedTeamId =
        teamId != null ? String(teamId) : null;

      const members = getTeamMembers(team);

      let memberCount = members.length;

      if (
        memberCount === 0 &&
        normalizedTeamId !== null
      ) {
        memberCount = users.filter((user) => {
          const userTeamId =
            user?.teamId ??
            user?.team?.id ??
            user?.team?._id;

          return (
            userTeamId != null &&
            String(userTeamId) === normalizedTeamId
          );
        }).length;
      }

      const teamTasks =
        normalizedTeamId === null
          ? []
          : tasks.filter(
              (task) =>
                getTaskTeamId(task) === normalizedTeamId
            );

      const completedTasks = teamTasks.filter(
        isCompletedTask
      ).length;

      const completionRate =
        teamTasks.length > 0
          ? Math.round(
              (completedTasks / teamTasks.length) * 100
            )
          : 0;

      const manager =
        team?.manager?.name ||
        team?.manager?.fullName ||
        team?.managerName ||
        (typeof team?.manager === "string"
          ? team.manager
          : "Not assigned");

      return {
        id:
          teamId ??
          getTeamName(team),
        name: getTeamName(team),
        memberCount,
        taskCount: teamTasks.length,
        completedTasks,
        completionRate,
        manager,
      };
    });
  }, [teams, users, tasks]);

  const summary = useMemo(() => {
    const totalMembers = teamReports.reduce(
      (total, team) => total + team.memberCount,
      0
    );

    const totalTasks = teamReports.reduce(
      (total, team) => total + team.taskCount,
      0
    );

    const completedTasks = teamReports.reduce(
      (total, team) => total + team.completedTasks,
      0
    );

    const averageCompletion =
      teamReports.length > 0
        ? Math.round(
            teamReports.reduce(
              (total, team) =>
                total + team.completionRate,
              0
            ) / teamReports.length
          )
        : 0;

    return {
      totalTeams: teams.length,
      totalMembers,
      totalTasks,
      completedTasks,
      averageCompletion,
    };
  }, [teamReports, teams.length]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Team Performance
        </h2>

        <p className="text-sm text-muted-foreground">
          Team membership, task activity, and completion
          performance based on current system data.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Teams
              </p>

              <UsersRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.totalTeams.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Team Members
              </p>

              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.totalMembers.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Team Tasks
              </p>

              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.totalTasks.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Avg. Completion
              </p>

              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {summary.averageCompletion}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Team Details
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {teamReports.length === 0 ? (
            <div className="p-8 text-center">
              <UsersRound className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <p className="font-medium text-foreground">
                No team report data available.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Team information will appear when teams are
                available in the system.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Team
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Manager
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Members
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Tasks
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Completed
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Completion
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teamReports.map((team) => (
                    <tr
                      key={String(team.id)}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted">
                            <UsersRound className="h-4 w-4 text-foreground" />
                          </div>

                          <span className="font-medium text-foreground">
                            {team.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {team.manager}
                      </td>

                      <td className="px-6 py-4 text-foreground">
                        {team.memberCount}
                      </td>

                      <td className="px-6 py-4 text-foreground">
                        {team.taskCount}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />

                          <span className="text-foreground">
                            {team.completedTasks}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="min-w-[140px]">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Completion
                            </span>

                            <Badge
                              variant={
                                team.completionRate >= 80
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {team.completionRate}%
                            </Badge>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-foreground transition-all"
                              style={{
                                width: `${team.completionRate}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default TeamReport;