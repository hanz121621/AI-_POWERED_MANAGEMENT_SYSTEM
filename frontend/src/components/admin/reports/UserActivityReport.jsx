import  { useMemo } from "react";
import {
  Activity,
  Users,
  UserCheck,
  UserX,
  Clock3,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function UserActivityReport({
  users = [],
  activities = [],
}) {
  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const getUserId = (user) =>
    user?.id ??
    user?._id ??
    user?.userId;

  const getUserName = (user) =>
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    "Unknown User";

  const getActivityUserId = (activity) => {
    const id =
      activity?.userId ??
      activity?.actorId ??
      activity?.performedBy ??
      activity?.user?.id ??
      activity?.user?._id;

    return id != null ? String(id) : null;
  };

  const getActivityUserName = (activity) => {
    if (typeof activity?.user === "string") {
      return activity.user;
    }

    return (
      activity?.user?.fullName ||
      activity?.user?.name ||
      activity?.user?.username ||
      activity?.userName ||
      activity?.actorName ||
      activity?.performedByName ||
      "Unknown User"
    );
  };

  const getActivityDate = (activity) =>
    activity?.createdAt ||
    activity?.timestamp ||
    activity?.date ||
    activity?.dateTime ||
    activity?.performedAt ||
    null;

  const isUserActive = (user) => {
    if (typeof user?.active === "boolean") {
      return user.active;
    }

    if (typeof user?.isActive === "boolean") {
      return user.isActive;
    }

    const status = normalize(user?.status);

    return ![
      "inactive",
      "disabled",
      "suspended",
      "deleted",
    ].includes(status);
  };

  const report = useMemo(() => {
    const activityByUser = new Map();

    activities.forEach((activity) => {
      const userId = getActivityUserId(activity);

      const key =
        userId ||
        getActivityUserName(activity);

      if (!activityByUser.has(key)) {
        activityByUser.set(key, {
          id: key,
          name: getActivityUserName(activity),
          activityCount: 0,
          lastActivity: null,
          actions: new Set(),
        });
      }

      const record = activityByUser.get(key);

      record.activityCount += 1;

      const action =
        activity?.action ||
        activity?.actionType ||
        activity?.type ||
        activity?.event ||
        null;

      if (action) {
        record.actions.add(String(action));
      }

      const activityDate = getActivityDate(activity);

      if (activityDate) {
        const parsedDate = new Date(activityDate);

        if (
          !Number.isNaN(parsedDate.getTime()) &&
          (!record.lastActivity ||
            parsedDate > record.lastActivity)
        ) {
          record.lastActivity = parsedDate;
        }
      }
    });

    /*
     * Include users who have no activity records.
     * This is important because the report should represent
     * the actual user population, not only active users.
     */
    users.forEach((user) => {
      const userId = getUserId(user);

      if (userId == null) {
        return;
      }

      const key = String(userId);

      if (!activityByUser.has(key)) {
        activityByUser.set(key, {
          id: key,
          name: getUserName(user),
          activityCount: 0,
          lastActivity: null,
          actions: new Set(),
        });
      }
    });

    const records = Array.from(activityByUser.values())
      .map((record) => ({
        ...record,
        actions: Array.from(record.actions),
      }))
      .sort(
        (a, b) =>
          b.activityCount - a.activityCount
      );

    const totalActivities = activities.length;

    const activeUsers = users.filter(
      isUserActive
    ).length;

    const inactiveUsers =
      users.length - activeUsers;

    const usersWithActivity = records.filter(
      (record) => record.activityCount > 0
    ).length;

    const averageActivities =
      users.length > 0
        ? Math.round(
            (totalActivities / users.length) * 10
          ) / 10
        : 0;

    return {
      records,
      totalActivities,
      activeUsers,
      inactiveUsers,
      usersWithActivity,
      averageActivities,
    };
  }, [users, activities]);

  const formatDate = (date) => {
    if (!date) {
      return "No activity recorded";
    }

    if (date instanceof Date) {
      return date.toLocaleString();
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Unknown date";
    }

    return parsed.toLocaleString();
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          User Activity Summary
        </h2>

        <p className="text-sm text-muted-foreground">
          User activity based on recorded system activity
          data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Activities
              </p>

              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.totalActivities.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recorded system activities
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Users With Activity
              </p>

              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.usersWithActivity.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Users with at least one recorded action
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Active Users
              </p>

              <Users className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.activeUsers.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Current active user records
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Avg. Activities / User
              </p>

              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.averageActivities}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Based on available user records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base text-foreground">
                User Activity Details
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Activity count and most recent activity for
                each user.
              </p>
            </div>

            <Badge variant="outline">
              {report.records.length} users
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {users.length === 0 && activities.length === 0 ? (
            <div className="p-10 text-center">
              <Users className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />

              <p className="font-medium text-foreground">
                No report data available.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                User activity information will appear when
                system records are available.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      User
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Activities
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Activity Types
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Last Activity
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Activity Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.records.map((record) => (
                    <tr
                      key={String(record.id)}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted">
                            <Users className="h-4 w-4 text-foreground" />
                          </div>

                          <div>
                            <p className="font-medium text-foreground">
                              {record.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">
                          {record.activityCount.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {record.actions.length > 0 ? (
                          <div className="flex max-w-xs flex-wrap gap-1">
                            {record.actions
                              .slice(0, 4)
                              .map((action) => (
                                <Badge
                                  key={action}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {action}
                                </Badge>
                              ))}

                            {record.actions.length > 4 && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                +{record.actions.length - 4}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No actions
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock3 className="h-4 w-4" />

                          <span>
                            {formatDate(
                              record.lastActivity
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {record.activityCount > 0 ? (
                          <Badge variant="secondary">
                            Active
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserX className="h-4 w-4 text-muted-foreground" />

                            <span className="text-sm text-muted-foreground">
                              No activity
                            </span>
                          </div>
                        )}
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

export default UserActivityReport;