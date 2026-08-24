import { useMemo } from "react";
import {
  BrainCircuit,
  
  Users,
  TrendingUp,
  Clock3,
  BarChart3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function AIUsageReport({
  aiUsage = [],
  users = [],
}) {
  
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

  const getUsageUserId = (record) => {
    const id =
      record?.userId ??
      record?.actorId ??
      record?.performedBy ??
      record?.user?.id ??
      record?.user?._id;

    return id != null ? String(id) : null;
  };

  const getUsageUserName = (record) => {
    if (typeof record?.user === "string") {
      return record.user;
    }

    return (
      record?.user?.fullName ||
      record?.user?.name ||
      record?.user?.username ||
      record?.userName ||
      record?.actorName ||
      record?.performedByName ||
      "Unknown User"
    );
  };

  const getAIType = (record) =>
    record?.type ||
    record?.feature ||
    record?.featureName ||
    record?.tool ||
    record?.toolName ||
    record?.action ||
    record?.aiFeature ||
    "Unknown";

  const getUsageDate = (record) =>
    record?.createdAt ||
    record?.timestamp ||
    record?.date ||
    record?.dateTime ||
    record?.usedAt ||
    null;

  const getUsageDuration = (record) => {
    const value =
      record?.duration ??
      record?.durationMs ??
      record?.processingTime ??
      record?.responseTime ??
      0;

    const number = Number(value);

    return Number.isNaN(number) ? 0 : number;
  };

  const report = useMemo(() => {
    const featureMap = new Map();
    const userMap = new Map();

    let totalDuration = 0;

    aiUsage.forEach((record) => {
      const feature = String(getAIType(record));

      if (!featureMap.has(feature)) {
        featureMap.set(feature, {
          name: feature,
          usageCount: 0,
          totalDuration: 0,
        });
      }

      const featureRecord =
        featureMap.get(feature);

      featureRecord.usageCount += 1;

      const duration =
        getUsageDuration(record);

      featureRecord.totalDuration += duration;

      totalDuration += duration;

      const userId =
        getUsageUserId(record);

      const userKey =
        userId ||
        getUsageUserName(record);

      if (!userMap.has(userKey)) {
        userMap.set(userKey, {
          id: userKey,
          name: getUsageUserName(record),
          usageCount: 0,
          lastUsage: null,
        });
      }

      const userRecord = userMap.get(userKey);

      userRecord.usageCount += 1;

      const usageDate =
        getUsageDate(record);

      if (usageDate) {
        const parsedDate =
          new Date(usageDate);

        if (
          !Number.isNaN(
            parsedDate.getTime()
          ) &&
          (!userRecord.lastUsage ||
            parsedDate >
              userRecord.lastUsage)
        ) {
          userRecord.lastUsage =
            parsedDate;
        }
      }
    });

    /*
     * Include known users even when they
     * have not used an AI feature.
     */
    users.forEach((user) => {
      const id = getUserId(user);

      if (id == null) {
        return;
      }

      const key = String(id);

      if (!userMap.has(key)) {
        userMap.set(key, {
          id: key,
          name: getUserName(user),
          usageCount: 0,
          lastUsage: null,
        });
      }
    });

    const featureRecords =
      Array.from(featureMap.values()).sort(
        (a, b) =>
          b.usageCount - a.usageCount
      );

    const userRecords =
      Array.from(userMap.values()).sort(
        (a, b) =>
          b.usageCount - a.usageCount
      );

    const usersUsingAI =
      userRecords.filter(
        (user) => user.usageCount > 0
      ).length;

    const averageUsagePerUser =
      users.length > 0
        ? Math.round(
            (aiUsage.length /
              users.length) *
              10
          ) / 10
        : 0;

    const averageDuration =
      aiUsage.length > 0
        ? Math.round(
            (totalDuration /
              aiUsage.length) *
              10
          ) / 10
        : 0;

    return {
      totalUsage: aiUsage.length,
      usersUsingAI,
      totalFeatures: featureRecords.length,
      averageUsagePerUser,
      averageDuration,
      featureRecords,
      userRecords,
    };
  }, [aiUsage, users]);

  const formatDate = (date) => {
    if (!date) {
      return "No usage recorded";
    }

    const parsedDate =
      date instanceof Date
        ? date
        : new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString();
  };

  const formatDuration = (value) => {
    if (!value) {
      return "—";
    }

    /*
     * If the backend stores milliseconds,
     * display seconds for readability.
     */
    if (value >= 1000) {
      return `${Math.round(
        value / 100
      ) / 10}s`;
    }

    return `${value}ms`;
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          AI Usage Statistics
        </h2>

        <p className="text-sm text-muted-foreground">
          AI feature usage and adoption based on current
          system records.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total AI Usage
              </p>

              <BrainCircuit className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.totalUsage.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recorded AI interactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                AI Users
              </p>

              <Users className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.usersUsingAI.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Users with recorded AI usage
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                AI Features
              </p>

              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.totalFeatures.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Features with recorded usage
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Avg. Usage / User
              </p>

              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {report.averageUsagePerUser}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Based on current user records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* No Data */}
      {aiUsage.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-10 text-center">
            <BrainCircuit className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />

            <p className="font-medium text-foreground">
              No AI usage data available.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              AI usage statistics will appear when AI
              activity is recorded by the system.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Feature Usage */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">
                AI Feature Usage
              </CardTitle>
            </CardHeader>

            <CardContent>
              {report.featureRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No AI feature usage records found.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {report.featureRecords.map(
                    (feature) => (
                      <div
                        key={feature.name}
                        className="rounded-lg border border-border bg-muted/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg border border-border bg-background p-2">
                              <BrainCircuit className="h-4 w-4 text-foreground" />
                            </div>

                            <div>
                              <p className="font-medium text-foreground">
                                {feature.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                Recorded usage
                              </p>
                            </div>
                          </div>

                          <Badge variant="secondary">
                            {feature.usageCount}
                          </Badge>
                        </div>

                        {feature.totalDuration >
                          0 && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" />

                            <span>
                              Total processing:{" "}
                              {formatDuration(
                                feature.totalDuration
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User AI Usage */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base text-foreground">
                    AI Usage by User
                  </CardTitle>

                  <p className="mt-1 text-xs text-muted-foreground">
                    User-level AI activity from recorded
                    system data.
                  </p>
                </div>

                <Badge variant="outline">
                  {report.userRecords.length} users
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        User
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        AI Usage
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Usage Status
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Last Usage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.userRecords.map(
                      (user) => (
                        <tr
                          key={String(user.id)}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted">
                                <Users className="h-4 w-4 text-foreground" />
                              </div>

                              <span className="font-medium text-foreground">
                                {user.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-semibold text-foreground">
                              {user.usageCount.toLocaleString()}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {user.usageCount >
                            0 ? (
                              <Badge variant="secondary">
                                Used AI
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                No usage
                              </Badge>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock3 className="h-4 w-4" />

                              <span>
                                {formatDate(
                                  user.lastUsage
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
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

export default AIUsageReport;