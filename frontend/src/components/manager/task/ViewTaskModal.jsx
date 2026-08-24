
import React from "react";

import {
  X,
  CalendarDays,
  User,
  Clock3,
  Flag,
  Layers3,
  GitBranch,
  CircleDot,
  AlertTriangle,
  Link2,
  CheckCircle2,
  ListTodo,
} from "lucide-react";

function ViewTaskModal({
  open,
  task,
  onClose,
}) {
  if (!open || !task) {
    return null;
  }

  /* =====================================================
     PRIORITY STYLES
  ===================================================== */

  const priorityStyles = {
    Low: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    Medium:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    High:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Critical:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const priorityClass =
    priorityStyles[task.priority] ||
    priorityStyles.Medium;

  /* =====================================================
     STATUS STYLES
  ===================================================== */

  const statusStyles = {
    "To Do":
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    Assigned:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",

    "In Progress":
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

    Completed:
      "bg-green-500/10 text-green-400 border-green-500/20",

    Blocked:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const statusClass =
    statusStyles[task.status] ||
    statusStyles["To Do"];

  /* =====================================================
     STATUS ICON
  ===================================================== */

  const getStatusIcon = () => {
    if (task.status === "Completed") {
      return <CheckCircle2 size={15} />;
    }

    if (task.status === "Blocked") {
      return <AlertTriangle size={15} />;
    }

    return <CircleDot size={15} />;
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-800
          bg-[#0f172a]
          shadow-2xl
        "
      >
        {/* =================================================
            TOP ACCENT
        ================================================= */}

        <div
          className={`h-1 w-full ${
            task.priority === "Critical"
              ? "bg-red-500"
              : task.priority === "High"
              ? "bg-orange-500"
              : task.priority === "Medium"
              ? "bg-blue-500"
              : "bg-gray-500"
          }`}
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-gray-800
            px-6
            py-5
          "
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="
                  rounded-md
                  border
                  border-gray-700
                  bg-gray-800/60
                  px-2
                  py-1
                  text-[11px]
                  font-semibold
                  text-gray-400
                "
              >
                {task.id}
              </span>

              {task.type && (
                <span
                  className="
                    rounded-md
                    border
                    border-purple-500/20
                    bg-purple-500/10
                    px-2
                    py-1
                    text-[11px]
                    font-semibold
                    text-purple-400
                  "
                >
                  {task.type}
                </span>
              )}

              <span
                className={`
                  rounded-md
                  border
                  px-2
                  py-1
                  text-[11px]
                  font-semibold
                  ${priorityClass}
                `}
              >
                {task.priority || "Medium"}
              </span>
            </div>

            <h2
              className="
                text-xl
                font-bold
                text-white
              "
            >
              {task.title}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Task details and progress information
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-gray-700
              bg-gray-800/60
              text-gray-400
              transition
              hover:border-gray-600
              hover:bg-gray-700
              hover:text-white
            "
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-6
            py-6
            [scrollbar-color:#475569_transparent]
            [scrollbar-width:thin]
          "
        >
          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div
            className="
              rounded-xl
              border
              border-gray-800
              bg-[#020617]/60
              p-5
            "
          >
            <div className="mb-3 flex items-center gap-2">
              <ListTodo
                size={17}
                className="text-blue-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Description
              </h3>
            </div>

            <p
              className="
                text-sm
                leading-6
                text-gray-400
              "
            >
              {task.description ||
                "No description provided."}
            </p>
          </div>

          {/* =================================================
              STATUS + PRIORITY
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* STATUS */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <p className="mb-2 text-xs text-gray-500">
                Task Status
              </p>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  ${statusClass}
                `}
              >
                {getStatusIcon()}
                {task.status || "To Do"}
              </span>
            </div>

            {/* PRIORITY */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <p className="mb-2 text-xs text-gray-500">
                Task Priority
              </p>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-md
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  ${priorityClass}
                `}
              >
                <Flag size={14} />
                {task.priority || "Medium"}
              </span>
            </div>
          </div>

          {/* =================================================
              PROJECT + SPRINT
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* PROJECT */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Layers3 size={14} />
                Project
              </div>

              <p
                className="
                  mt-2
                  text-sm
                  font-semibold
                  text-gray-200
                "
              >
                {task.project ||
                  task.projectName ||
                  "Not assigned"}
              </p>
            </div>

            {/* SPRINT */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <GitBranch size={14} />
                Sprint
              </div>

              <p
                className="
                  mt-2
                  text-sm
                  font-semibold
                  text-gray-200
                "
              >
                {task.sprint ||
                  task.sprintName ||
                  "Not assigned"}
              </p>
            </div>
          </div>

          {/* =================================================
              TASK INFORMATION
          ================================================= */}

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {/* CONTRIBUTOR */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User size={14} />
                Contributor
              </div>

              <p
                className="
                  mt-2
                  truncate
                  text-sm
                  font-semibold
                  text-gray-200
                "
                title={
                  task.contributorName ||
                  task.contributor
                }
              >
                {task.contributorName ||
                  task.contributor ||
                  "Unassigned"}
              </p>
            </div>

            {/* EFFORT */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock3 size={14} />
                Estimated Effort
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-200">
                {task.effort ?? 0} hrs
              </p>
            </div>

            {/* DEADLINE */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CalendarDays size={14} />
                Deadline
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-200">
                {task.deadline || "No deadline"}
              </p>
            </div>

            {/* PROGRESS */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle2 size={14} />
                Progress
              </div>

              <p className="mt-2 text-sm font-semibold text-gray-200">
                {task.progress ?? 0}%
              </p>
            </div>
          </div>

          {/* =================================================
              PROGRESS BAR
          ================================================= */}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-gray-800
              bg-[#020617]/60
              p-5
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">
                Task Progress
              </p>

              <span className="text-sm font-bold text-blue-400">
                {task.progress ?? 0}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(
                      Number(task.progress) || 0,
                      0
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* =================================================
              DEADLINE NOTES
          ================================================= */}

          {task.deadlineNotes && (
            <div
              className="
                mt-5
                rounded-xl
                border
                border-yellow-500/20
                bg-yellow-500/5
                p-5
              "
            >
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-yellow-400"
                />

                <h3 className="text-sm font-semibold text-yellow-400">
                  Deadline Notes
                </h3>
              </div>

              <p className="mt-2 text-sm leading-6 text-yellow-400/80">
                {task.deadlineNotes}
              </p>
            </div>
          )}

          {/* =================================================
              DEPENDENCIES
          ================================================= */}

          {Array.isArray(task.dependencies) &&
            task.dependencies.length > 0 && (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-purple-500/20
                  bg-purple-500/5
                  p-5
                "
              >
                <div className="flex items-center gap-2">
                  <Link2
                    size={16}
                    className="text-purple-400"
                  />

                  <h3 className="text-sm font-semibold text-purple-400">
                    Task Dependencies
                  </h3>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {task.dependencies.map(
                    (dependency, index) => (
                      <span
                        key={`${dependency}-${index}`}
                        className="
                          rounded-md
                          border
                          border-purple-500/20
                          bg-purple-500/10
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-purple-300
                        "
                      >
                        {dependency}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* =================================================
              CREATED DATE
          ================================================= */}

          {task.createdAt && (
            <div className="mt-5 text-xs text-gray-600">
              Created:{" "}
              {new Date(
                task.createdAt
              ).toLocaleString()}
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            justify-end
            border-t
            border-gray-800
            bg-[#0f172a]
            px-6
            py-4
          "
        >
          <button
            type="button"
            onClick={handleClose}
            className="
              rounded-xl
              border
              border-gray-700
              bg-gray-800
              px-5
              py-2.5
              text-sm
              font-semibold
              text-gray-200
              transition
              hover:border-gray-600
              hover:bg-gray-700
              hover:text-white
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewTaskModal;

