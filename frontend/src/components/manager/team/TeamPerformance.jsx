import React from "react";
import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  Users,
} from "lucide-react";

function TeamPerformance({ members = [] }) {
  const totalMembers = members.length;

  const totalCompleted = members.reduce(
    (sum, member) => sum + Number(member.completedTasks || 0),
    0
  );

  const totalPending = members.reduce(
    (sum, member) => sum + Number(member.pendingTasks || 0),
    0
  );

  const totalInProgress = members.reduce(
    (sum, member) => sum + Number(member.inProgressTasks || 0),
    0
  );

  const totalOverdue = members.reduce(
    (sum, member) => sum + Number(member.overdueTasks || 0),
    0
  );

  const totalTasks =
    totalCompleted +
    totalPending +
    totalInProgress +
    totalOverdue;

  const completionRate =
    totalTasks > 0
      ? Math.round((totalCompleted / totalTasks) * 100)
      : 0;

  const stats = [
    {
      title: "Completed Tasks",
      value: totalCompleted,
      description: "Successfully completed",
      icon: CheckCircle2,
      iconClass: "text-green-400",
      bgClass: "bg-green-500/10",
      borderClass: "hover:border-green-500/40",
    },
    {
      title: "Pending Tasks",
      value: totalPending,
      description: "Waiting to be started",
      icon: ListTodo,
      iconClass: "text-yellow-400",
      bgClass: "bg-yellow-500/10",
      borderClass: "hover:border-yellow-500/40",
    },
    {
      title: "In Progress",
      value: totalInProgress,
      description: "Currently being worked on",
      icon: Clock3,
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
      borderClass: "hover:border-blue-500/40",
    },
    {
      title: "Overdue Tasks",
      value: totalOverdue,
      description: "Require attention",
      icon: AlertTriangle,
      iconClass: "text-red-400",
      bgClass: "bg-red-500/10",
      borderClass: "hover:border-red-500/40",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Team Performance
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Monitor contributor productivity, workload and task progress.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#0f172a] px-4 py-2">
          <Users size={17} className="text-blue-400" />

          <span className="text-sm text-gray-300">
            {totalMembers} Members
          </span>
        </div>
      </div>

      {/* PERFORMANCE STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={`
                group
                rounded-2xl
                border
                border-gray-800
                bg-[#0f172a]
                p-5
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                ${stat.borderClass}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${stat.bgClass}
                    ${stat.iconClass}
                  `}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLETION RATE */}

      <div className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp
                size={19}
                className="text-blue-400"
              />

              <h3 className="font-semibold text-white">
                Team Task Completion Rate
              </h3>
            </div>

            <p className="mt-1 text-sm text-gray-400">
              Overall completion performance across the team.
            </p>
          </div>

          <div className="text-3xl font-bold text-white">
            {completionRate}%
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${completionRate}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* NO DATA */}

      {totalMembers === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-700 bg-[#0f172a] p-10 text-center">
          <Users
            size={40}
            className="mx-auto text-gray-600"
          />

          <h3 className="mt-4 text-lg font-semibold text-white">
            No performance data found
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Team performance information will appear when
            contributors and tasks are available.
          </p>
        </div>
      )}
    </div>
  );
}

export default TeamPerformance;