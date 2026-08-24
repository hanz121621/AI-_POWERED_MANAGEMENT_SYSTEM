import React from "react";

import {
  CalendarDays,
  Users,
  ListTodo,
  Play,
  Pencil,
  Trash2,
  CheckCircle2,
  Target,
} from "lucide-react";

function SprintCard({
  sprint,
  onStart,
  onUpdate,
  onDelete,
  onComplete,
  onViewBacklog,
}) {
  if (!sprint) {
    return null;
  }

  const progress = Math.min(
    Math.max(Number(sprint.progress) || 0, 0),
    100
  );

  const statusStyles = {
    Active:
      "bg-green-500/10 text-green-400 border-green-500/20",

    Completed:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",

    Planning:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    Planned:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  const priorityStyles = {
    High: "text-red-400 bg-red-500/10 border-red-500/20",
    Medium:
      "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    Low:
      "text-green-400 bg-green-500/10 border-green-500/20",
  };

  const currentStatus =
    statusStyles[sprint.status] ||
    "bg-gray-500/10 text-gray-400 border-gray-500/20";

  const currentPriority =
    priorityStyles[sprint.priority] ||
    priorityStyles.Medium;

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-gray-800
        bg-[#0f172a]
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/40
        hover:shadow-xl
        hover:shadow-blue-500/5
      "
    >
      {/* TOP ACCENT */}

      <div
        className="
          h-1
          w-full
          bg-gradient-to-r
          from-blue-600
          via-cyan-500
          to-purple-600
        "
      />

      <div className="p-6">
        {/* HEADER */}

        <div
          className="
            mb-5
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3
                className="
                  truncate
                  text-xl
                  font-bold
                  text-white
                "
              >
                {sprint.name}
              </h3>

              <span
                className={`
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  ${currentStatus}
                `}
              >
                {sprint.status}
              </span>
            </div>

            <p className="line-clamp-2 text-sm leading-6 text-gray-400">
              {sprint.goal}
            </p>
          </div>

          <span
            className={`
              shrink-0
              rounded-full
              border
              px-2.5
              py-1
              text-xs
              font-semibold
              ${currentPriority}
            `}
          >
            {sprint.priority}
          </span>
        </div>

        {/* PROGRESS */}

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">
              Sprint Progress
            </span>

            <span className="text-sm font-bold text-white">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-cyan-400
                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* DETAILS */}

        <div
          className="
            mb-6
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-4
          "
        >
          <div
            className="
              rounded-xl
              border
              border-gray-800
              bg-[#020617]
              p-3
            "
          >
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <ListTodo size={15} />
              <span className="text-xs">
                Tasks
              </span>
            </div>

            <p className="text-sm font-bold text-white">
              {sprint.completedTasks || 0}/
              {sprint.tasks || 0}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-gray-800
              bg-[#020617]
              p-3
            "
          >
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <Users size={15} />
              <span className="text-xs">
                Team
              </span>
            </div>

            <p className="text-sm font-bold text-white">
              {sprint.team || 0}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-gray-800
              bg-[#020617]
              p-3
            "
          >
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <CalendarDays size={15} />
              <span className="text-xs">
                Start
              </span>
            </div>

            <p className="text-xs font-semibold text-white">
              {sprint.startDate || "-"}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-gray-800
              bg-[#020617]
              p-3
            "
          >
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <Target size={15} />
              <span className="text-xs">
                End
              </span>
            </div>

            <p className="text-xs font-semibold text-white">
              {sprint.endDate || "-"}
            </p>
          </div>
        </div>

        {/* TEAM PERFORMANCE */}

        {sprint.status === "Active" &&
          Number(sprint.teamPerformance) > 0 && (
            <div
              className="
                mb-6
                rounded-xl
                border
                border-green-500/10
                bg-green-500/5
                p-4
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Team Performance
                </span>

                <span className="text-sm font-bold text-green-400">
                  {sprint.teamPerformance}%
                </span>
              </div>
            </div>
          )}

        {/* ACTIONS */}

        <div className="space-y-3">
          {/* BACKLOG */}

          <button
            type="button"
            onClick={() =>
              onViewBacklog(sprint)
            }
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-blue-500/30
              bg-blue-500/10
              px-4
              py-2.5
              text-sm
              font-semibold
              text-blue-400
              transition
              hover:border-blue-500/50
              hover:bg-blue-500/20
              hover:text-blue-300
            "
          >
            <ListTodo size={16} />
            View Sprint Backlog
          </button>

          {/* OTHER ACTIONS */}

          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-4
            "
          >
            {sprint.status === "Planning" ||
            sprint.status === "Planned" ? (
              <button
                type="button"
                onClick={() =>
                  onStart(sprint)
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-green-500/20
                  bg-green-500/10
                  px-3
                  py-2.5
                  text-xs
                  font-semibold
                  text-green-400
                  transition
                  hover:bg-green-500/20
                "
              >
                <Play size={14} />
                Start
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onComplete(sprint)
                }
                disabled={
                  sprint.status !== "Active"
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-purple-500/20
                  bg-purple-500/10
                  px-3
                  py-2.5
                  text-xs
                  font-semibold
                  text-purple-400
                  transition
                  hover:bg-purple-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <CheckCircle2 size={14} />
                Complete
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                onUpdate(sprint)
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-700
                bg-gray-800/50
                px-3
                py-2.5
                text-xs
                font-semibold
                text-gray-300
                transition
                hover:bg-gray-700
                hover:text-white
              "
            >
              <Pencil size={14} />
              Update
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(sprint)
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-3
                py-2.5
                text-xs
                font-semibold
                text-red-400
                transition
                hover:bg-red-500/20
              "
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SprintCard;