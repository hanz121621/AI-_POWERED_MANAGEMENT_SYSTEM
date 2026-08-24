
import React from "react";

import {
  CalendarDays,
  User,
  Clock3,
  Flag,
  Layers3,
  GitBranch,
  Pencil,
  Trash2,
  CircleDot,
  AlertTriangle,
  Link2,
  UserPlus,
  CalendarClock,
  CheckCircle2,
  Eye,
} from "lucide-react";

function TaskCard({
  task,
  onView,
  onEdit,
  onDelete,
  onAssign,
  onSetPriority,
  onSetDeadline,
  onUpdateStatus,
  onReview,
}) {
  if (!task) {
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

    Review:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",

    Completed:
      "bg-green-500/10 text-green-400 border-green-500/20",

    "Needs Revision":
      "bg-orange-500/10 text-orange-400 border-orange-500/20",

    Blocked:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const priorityClass =
    priorityStyles[task.priority] ||
    priorityStyles.Medium;

  const statusClass =
    statusStyles[task.status] ||
    statusStyles["To Do"];

  /* =====================================================
     STATUS ICON
  ===================================================== */

  const getStatusIcon = () => {
    if (task.status === "Completed") {
      return <CheckCircle2 size={14} />;
    }

    if (task.status === "Blocked") {
      return <AlertTriangle size={14} />;
    }

    if (task.status === "Review") {
      return <Eye size={14} />;
    }

    if (task.status === "Needs Revision") {
      return <AlertTriangle size={14} />;
    }

    return <CircleDot size={14} />;
  };

  /* =====================================================
     FLAGS
  ===================================================== */

  const isCompleted = task.status === "Completed";

  const hasDependencies =
    Array.isArray(task.dependencies) &&
    task.dependencies.length > 0;

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleView = () => {
    if (typeof onView === "function") {
      onView(task);
    }
  };

  const handleEdit = () => {
    if (typeof onEdit === "function") {
      onEdit(task);
    }
  };

  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(task);
    }
  };

  const handleAssign = () => {
    if (typeof onAssign === "function") {
      onAssign(task);
    }
  };

  const handleSetPriority = () => {
    if (typeof onSetPriority === "function") {
      onSetPriority(task);
    }
  };

  const handleSetDeadline = () => {
    if (typeof onSetDeadline === "function") {
      onSetDeadline(task);
    }
  };

  const handleUpdateStatus = () => {
    if (typeof onUpdateStatus === "function") {
      onUpdateStatus(task);
    }
  };

  const handleReview = () => {
    if (typeof onReview === "function") {
      onReview(task);
    }
  };

  /* =====================================================
     PROGRESS
  ===================================================== */

  const progress = Math.min(
    100,
    Math.max(0, Number(task.progress) || 0)
  );

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-gray-800
        bg-[#0f172a]
        p-6
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-blue-500/40
        hover:shadow-2xl
        hover:shadow-blue-500/10
      "
    >
      {/* =================================================
          TOP ACCENT
      ================================================= */}

      <div
        className={`absolute left-0 top-0 h-1 w-full ${
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

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* BADGES */}

          <div className="mb-3 flex flex-wrap items-center gap-2">
            {/* TASK ID */}

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
              {task.id || "TASK"}
            </span>

            {/* TYPE */}

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

            {/* PRIORITY */}

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

          {/* TITLE */}

          <h3
            className="
              truncate
              text-lg
              font-bold
              text-white
            "
            title={task.title}
          >
            {task.title || "Untitled Task"}
          </h3>

          {/* DESCRIPTION */}

          <p
            className="
              mt-2
              line-clamp-2
              text-sm
              leading-6
              text-gray-400
            "
          >
            {task.description ||
              "No description provided."}
          </p>
        </div>

        {/* STATUS */}

        <div
          className={`
            flex
            shrink-0
            items-center
            gap-1.5
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
        </div>
      </div>

      {/* =================================================
          PROJECT / SPRINT
      ================================================= */}

      <div
        className="
          mt-5
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
        "
      >
        {/* PROJECT */}

        <div
          className="
            rounded-xl
            border
            border-gray-800
            bg-[#020617]/50
            p-3
            transition
            duration-300
            hover:border-blue-500/20
            hover:bg-[#020617]/80
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
            "
          >
            <Layers3 size={14} />

            Project
          </div>

          <p
            className="
              mt-1
              truncate
              text-sm
              font-medium
              text-gray-200
            "
            title={
              task.project ||
              task.projectName
            }
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
            bg-[#020617]/50
            p-3
            transition
            duration-300
            hover:border-purple-500/20
            hover:bg-[#020617]/80
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
            "
          >
            <GitBranch size={14} />

            Sprint
          </div>

          <p
            className="
              mt-1
              truncate
              text-sm
              font-medium
              text-gray-200
            "
            title={
              task.sprint ||
              task.sprintName
            }
          >
            {task.sprint ||
              task.sprintName ||
              "Not assigned"}
          </p>
        </div>
      </div>

      {/* =================================================
          TASK DETAILS
      ================================================= */}

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-4
        "
      >
        {/* CONTRIBUTOR */}

        <div className="min-w-0">
          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-gray-500
            "
          >
            <User size={13} />

            Contributor
          </div>

          <p
            className="
              mt-1
              truncate
              text-sm
              font-medium
              text-gray-300
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

        <div>
          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-gray-500
            "
          >
            <Clock3 size={13} />

            Effort
          </div>

          <p
            className="
              mt-1
              text-sm
              font-medium
              text-gray-300
            "
          >
            {task.effort ?? 0} hrs
          </p>
        </div>

        {/* DEADLINE */}

        <div className="min-w-0">
          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-gray-500
            "
          >
            <CalendarDays size={13} />

            Deadline
          </div>

          <p
            className={`
              mt-1
              truncate
              text-sm
              font-medium
              ${
                task.deadline
                  ? "text-gray-300"
                  : "text-gray-500"
              }
            `}
          >
            {task.deadline ||
              "No deadline"}
          </p>

          {task.deadlineTime && (
            <p
              className="
                mt-0.5
                text-xs
                text-gray-500
              "
            >
              {task.deadlineTime}
            </p>
          )}
        </div>

        {/* PRIORITY */}

        <div>
          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-gray-500
            "
          >
            <Flag size={13} />

            Priority
          </div>

          <p
            className="
              mt-1
              text-sm
              font-medium
              text-gray-300
            "
          >
            {task.priority || "Medium"}
          </p>
        </div>
      </div>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="mt-5">
        <div
          className="
            mb-2
            flex
            items-center
            justify-between
          "
        >
          <span className="text-xs text-gray-500">
            Progress
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-gray-300
            "
          >
            {progress}%
          </span>
        </div>

        <div
          className="
            h-2
            overflow-hidden
            rounded-full
            bg-gray-800
          "
        >
          <div
            className={`
              h-full
              rounded-full
              transition-all
              duration-500
              ${
                task.status === "Completed"
                  ? "bg-green-500"
                  : task.status === "Blocked"
                  ? "bg-red-500"
                  : task.status === "Review"
                  ? "bg-cyan-500"
                  : "bg-blue-500"
              }
            `}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* =================================================
          REVIEW STATUS
      ================================================= */}

      {task.reviewStatus && (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-cyan-500/20
            bg-cyan-500/5
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={15}
              className="text-cyan-400"
            />

            <span
              className="
                text-xs
                font-semibold
                text-cyan-400
              "
            >
              Review Status
            </span>
          </div>

          <p
            className="
              mt-1
              text-sm
              text-gray-300
            "
          >
            {task.reviewStatus}
          </p>

          {task.reviewFeedback && (
            <p
              className="
                mt-1
                text-xs
                leading-5
                text-gray-500
              "
            >
              {task.reviewFeedback}
            </p>
          )}
        </div>
      )}

      {/* =================================================
          DEADLINE NOTES
      ================================================= */}

      {task.deadlineNotes && (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-yellow-500/20
            bg-yellow-500/5
            px-4
            py-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-yellow-400
            "
          >
            <CalendarClock size={14} />

            Deadline Notes
          </div>

          <p
            className="
              mt-1
              text-sm
              leading-6
              text-gray-400
            "
          >
            {task.deadlineNotes}
          </p>
        </div>
      )}

      {/* =================================================
          DEPENDENCIES
      ================================================= */}

      {hasDependencies && (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-purple-500/20
            bg-purple-500/5
            px-4
            py-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-purple-400
            "
          >
            <Link2 size={14} />

            Task Dependencies
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {task.dependencies.map(
              (dependency, index) => (
                <span
                  key={`${dependency}-${index}`}
                  className="
                    rounded-md
                    border
                    border-purple-500/20
                    bg-purple-500/10
                    px-2
                    py-1
                    text-xs
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
          ACTIONS
      ================================================= */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-3
          border-t
          border-gray-800
          pt-5
          sm:grid-cols-2
        "
      >
        {/* VIEW */}

        {typeof onView === "function" && (
          <button
            type="button"
            onClick={handleView}
            className="
              group
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-cyan-500/30
              bg-cyan-500/10
              px-4
              py-2.5
              text-sm
              font-semibold
              text-cyan-400
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-cyan-400
              hover:bg-cyan-500/20
              hover:text-white
              hover:shadow-lg
              hover:shadow-cyan-500/20
              active:scale-95
            "
          >
            <Eye
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />

            View Task
          </button>
        )}

        {/* UPDATE STATUS */}

        {typeof onUpdateStatus === "function" && (
          <button
            type="button"
            onClick={handleUpdateStatus}
            className="
              group
              flex
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
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-400
              hover:bg-blue-500/20
              hover:text-white
              hover:shadow-lg
              hover:shadow-blue-500/20
              active:scale-95
            "
          >
            <CircleDot
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:rotate-180
              "
            />

            Update Status
          </button>
        )}

        {/* REVIEW COMPLETED TASK */}

        {isCompleted &&
          typeof onReview === "function" && (
            <button
              type="button"
              onClick={handleReview}
              className="
                group
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-emerald-500/30
                bg-emerald-500/10
                px-4
                py-2.5
                text-sm
                font-semibold
                text-emerald-400
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-emerald-400
                hover:bg-emerald-500/20
                hover:text-white
                hover:shadow-lg
                hover:shadow-emerald-500/20
                active:scale-95
              "
            >
              <CheckCircle2
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:rotate-12
                "
              />

              Review Task
            </button>
          )}

        {/* UPDATE TASK */}

        <button
          type="button"
          onClick={handleEdit}
          className="
            group
            flex
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
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-blue-400
            hover:bg-blue-500/20
            hover:text-white
            hover:shadow-lg
            hover:shadow-blue-500/20
            active:scale-95
          "
        >
          <Pencil
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:rotate-12
            "
          />

          Update Task
        </button>

        {/* ASSIGN CONTRIBUTOR */}

        <button
          type="button"
          onClick={handleAssign}
          className="
            group
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-purple-500/30
            bg-purple-500/10
            px-4
            py-2.5
            text-sm
            font-semibold
            text-purple-400
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-purple-400
            hover:bg-purple-500/20
            hover:text-white
            hover:shadow-lg
            hover:shadow-purple-500/20
            active:scale-95
          "
        >
          <UserPlus
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          Assign Contributor
        </button>

        {/* SET PRIORITY */}

        <button
          type="button"
          onClick={handleSetPriority}
          className="
            group
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-orange-500/30
            bg-orange-500/10
            px-4
            py-2.5
            text-sm
            font-semibold
            text-orange-400
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-orange-400
            hover:bg-orange-500/20
            hover:text-white
            hover:shadow-lg
            hover:shadow-orange-500/20
            active:scale-95
          "
        >
          <Flag
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:-rotate-12
            "
          />

          Set Priority
        </button>

        {/* SET DEADLINE */}

        <button
          type="button"
          onClick={handleSetDeadline}
          className="
            group
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-cyan-500/30
            bg-cyan-500/10
            px-4
            py-2.5
            text-sm
            font-semibold
            text-cyan-400
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-cyan-400
            hover:bg-cyan-500/20
            hover:text-white
            hover:shadow-lg
            hover:shadow-cyan-500/20
            active:scale-95
          "
        >
          <CalendarClock
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          Set Deadline
        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={handleDelete}
          disabled={isCompleted}
          title={
            isCompleted
              ? "Completed tasks cannot be deleted. Archive the task instead."
              : hasDependencies
              ? "This task has dependent tasks."
              : "Delete task"
          }
          className={`
            group
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            px-4
            py-2.5
            text-sm
            font-semibold
            transition-all
            duration-300

            ${
              isCompleted
                ? `
                  cursor-not-allowed
                  border-gray-700
                  bg-gray-800/40
                  text-gray-600
                `
                : `
                  border-red-500/30
                  bg-red-500/10
                  text-red-400
                  hover:-translate-y-1
                  hover:border-red-400
                  hover:bg-red-500/20
                  hover:text-white
                  hover:shadow-lg
                  hover:shadow-red-500/20
                  active:scale-95
                `
            }
          `}
        >
          <Trash2
            size={16}
            className={
              !isCompleted
                ? `
                  transition-transform
                  duration-300
                  group-hover:scale-110
                `
                : ""
            }
          />

          {isCompleted
            ? "Cannot Delete"
            : "Delete Task"}
        </button>
      </div>

      {/* =================================================
          COMPLETED NOTICE
      ================================================= */}

      {isCompleted && (
        <div
          className="
            mt-3
            rounded-xl
            border
            border-green-500/20
            bg-green-500/5
            px-4
            py-3
          "
        >
          <div className="flex items-start gap-2">
            <CheckCircle2
              size={15}
              className="
                mt-0.5
                shrink-0
                text-green-400
              "
            />

            <p
              className="
                text-xs
                leading-5
                text-green-400/80
              "
            >
              This task is completed and ready
              for manager review.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;

