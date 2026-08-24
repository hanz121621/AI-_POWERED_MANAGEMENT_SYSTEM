
import React, { useEffect, useState } from "react";

import {
  X,
  CheckCircle2,
  AlertTriangle,
  ListTodo,
  Users,
  TrendingUp,
  ArrowRight,
  Archive,
} from "lucide-react";

function CompleteSprintModal({
  open,
  sprint,
  close,
  onConfirm,
}) {
  const [incompleteTaskAction, setIncompleteTaskAction] =
    useState("");

  /*
   * =====================================================
   * RESET MODAL STATE
   * =====================================================
   */

  useEffect(() => {
    if (open) {
      setIncompleteTaskAction("");
    }
  }, [open, sprint]);

  /*
   * =====================================================
   * DON'T RENDER WHEN CLOSED
   * =====================================================
   */

  if (!open || !sprint) {
    return null;
  }

  /*
   * =====================================================
   * SPRINT DATA
   * =====================================================
   */

  const completedTasks = Math.max(
    Number(sprint.completedTasks) || 0,
    0
  );

  const totalTasks = Math.max(
    Number(sprint.tasks) || 0,
    0
  );

  const incompleteTasks = Math.max(
    totalTasks - completedTasks,
    0
  );

  const progress = Math.min(
    Math.max(
      Number(
        sprint.progress ??
          (totalTasks > 0
            ? Math.round(
                (completedTasks / totalTasks) * 100
              )
            : 0)
      ) || 0,
      0
    ),
    100
  );

  const teamPerformance = Math.min(
    Math.max(
      Number(sprint.teamPerformance) || 0,
      0
    ),
    100
  );

  const hasIncompleteTasks =
    incompleteTasks > 0;

  /*
   * =====================================================
   * VALIDATION
   * =====================================================
   */

  const isActive =
    sprint.status === "Active";

  const canComplete =
    isActive &&
    (!hasIncompleteTasks ||
      incompleteTaskAction !== "");

  /*
   * =====================================================
   * CONFIRM COMPLETE
   * =====================================================
   */

  const handleConfirm = () => {
    if (!canComplete) {
      return;
    }

    if (!onConfirm) {
      return;
    }

    onConfirm({
      sprintId: sprint.id,

      incompleteTaskAction:
        incompleteTaskAction || "None",
    });
  };

  /*
   * =====================================================
   * SELECT INCOMPLETE TASK ACTION
   * =====================================================
   */

  const selectIncompleteAction = (action) => {
    setIncompleteTaskAction(action);
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div
      className="
        fixed
        inset-0
        z-[150]
        flex
        items-center
        justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
    >
      {/* =================================================
          BACKGROUND OVERLAY
      ================================================= */}

      <button
        type="button"
        aria-label="Close modal"
        onClick={close}
        className="
          absolute
          inset-0
          cursor-default
          bg-transparent
        "
      />

      {/* =================================================
          MODAL
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
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
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            border-b
            border-gray-800
            p-6
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-green-500/10
                text-green-400
              "
            >
              <CheckCircle2 size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Complete Sprint
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Review the sprint results before completing it.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-800
              hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div className="overflow-y-auto p-6">
          {/* =================================================
              SPRINT INFORMATION
          ================================================= */}

          <div
            className="
              rounded-xl
              border
              border-gray-800
              bg-[#020617]/70
              p-5
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-blue-400
                  "
                >
                  Sprint
                </p>

                <h3
                  className="
                    mt-1
                    text-xl
                    font-bold
                    text-white
                  "
                >
                  {sprint.name}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  {sprint.goal ||
                    "No sprint goal provided."}
                </p>
              </div>

              <span
                className="
                  shrink-0
                  rounded-full
                  border
                  border-green-500/30
                  bg-green-500/10
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-green-400
                "
              >
                {sprint.status}
              </span>
            </div>
          </div>

          {/* =================================================
              SPRINT RESULTS
          ================================================= */}

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-3
            "
          >
            {/* COMPLETED TASKS */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-gray-400">
                <ListTodo size={17} />

                <span className="text-xs">
                  Completed Tasks
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-green-400">
                {completedTasks}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                of {totalTasks} total tasks
              </p>
            </div>

            {/* INCOMPLETE TASKS */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]/60
                p-4
              "
            >
              <div className="flex items-center gap-2 text-gray-400">
                <AlertTriangle size={17} />

                <span className="text-xs">
                  Incomplete Tasks
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-orange-400">
                {incompleteTasks}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Need action
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
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp size={17} />

                <span className="text-xs">
                  Sprint Progress
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-blue-400">
                {progress}%
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Current progress
              </p>
            </div>
          </div>

          {/* =================================================
              PROGRESS BAR
          ================================================= */}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">
                Sprint Progress
              </span>

              <span className="text-xs font-semibold text-gray-300">
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
                className="
                  h-full
                  rounded-full
                  bg-blue-600
                  transition-all
                  duration-500
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* =================================================
              TEAM PERFORMANCE
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
              <div className="flex items-center gap-2">
                <Users
                  size={18}
                  className="text-purple-400"
                />

                <span className="text-sm font-medium text-gray-300">
                  Team Performance
                </span>
              </div>

              <span className="text-lg font-bold text-purple-400">
                {teamPerformance}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="
                  h-full
                  rounded-full
                  bg-purple-500
                  transition-all
                  duration-500
                "
                style={{
                  width: `${teamPerformance}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Team performance summary for this sprint.
            </p>
          </div>

          {/* =================================================
              INCOMPLETE TASK HANDLING
          ================================================= */}

          {hasIncompleteTasks && (
            <div className="mt-6">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Incomplete Tasks
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Choose where the unfinished tasks should go
                  before completing this sprint.
                </p>
              </div>

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >
                {/* =================================================
                    MOVE TO NEXT SPRINT
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    selectIncompleteAction(
                      "NextSprint"
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      incompleteTaskAction ===
                      "NextSprint"
                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5"
                        : "border-gray-800 bg-[#020617]/60 hover:border-gray-600 hover:bg-[#020617]"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-500/10
                        text-blue-400
                      "
                    >
                      <ArrowRight size={20} />
                    </div>

                    {incompleteTaskAction ===
                      "NextSprint" && (
                      <CheckCircle2
                        size={20}
                        className="text-blue-400"
                      />
                    )}
                  </div>

                  <h4 className="mt-4 font-semibold text-white">
                    Move to Next Sprint
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Carry unfinished tasks into the next
                    sprint.
                  </p>
                </button>

                {/* =================================================
                    RETURN TO BACKLOG
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    selectIncompleteAction(
                      "Backlog"
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      incompleteTaskAction ===
                      "Backlog"
                        ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/5"
                        : "border-gray-800 bg-[#020617]/60 hover:border-gray-600 hover:bg-[#020617]"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-orange-500/10
                        text-orange-400
                      "
                    >
                      <Archive size={20} />
                    </div>

                    {incompleteTaskAction ===
                      "Backlog" && (
                      <CheckCircle2
                        size={20}
                        className="text-orange-400"
                      />
                    )}
                  </div>

                  <h4 className="mt-4 font-semibold text-white">
                    Return to Backlog
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Return unfinished tasks to the project
                    backlog.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              INCOMPLETE TASK WARNING
          ================================================= */}

          {hasIncompleteTasks &&
            incompleteTaskAction === "" && (
              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-yellow-500/20
                  bg-yellow-500/10
                  p-4
                "
              >
                <AlertTriangle
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-yellow-400
                  "
                />

                <div>
                  <p className="text-sm font-semibold text-yellow-300">
                    Action required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-yellow-200/70">
                    Select what should happen to{" "}
                    <span className="font-semibold text-yellow-200">
                      {incompleteTasks}
                    </span>{" "}
                    incomplete task
                    {incompleteTasks !== 1
                      ? "s"
                      : ""}{" "}
                    before completing this sprint.
                  </p>
                </div>
              </div>
            )}

          {/* =================================================
              ALL TASKS COMPLETED
          ================================================= */}

          {!hasIncompleteTasks && (
            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-green-500/20
                bg-green-500/10
                p-4
              "
            >
              <CheckCircle2
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-green-400
                "
              />

              <div>
                <p className="text-sm font-semibold text-green-300">
                  All tasks completed
                </p>

                <p className="mt-1 text-xs leading-5 text-green-200/70">
                  All sprint tasks are complete. This sprint
                  is ready to be finalized.
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              INVALID STATUS WARNING
          ================================================= */}

          {!isActive && (
            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                p-4
              "
            >
              <AlertTriangle
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-red-400
                "
              />

              <div>
                <p className="text-sm font-semibold text-red-300">
                  Sprint cannot be completed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-200/70">
                  Only active sprints can be completed.
                </p>
              </div>
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
            flex-col-reverse
            gap-3
            border-t
            border-gray-800
            p-6
            sm:flex-row
            sm:justify-end
          "
        >
          {/* CANCEL */}

          <button
            type="button"
            onClick={close}
            className="
              rounded-xl
              border
              border-gray-700
              px-5
              py-3
              text-sm
              font-semibold
              text-gray-300
              transition-all
              duration-200
              hover:border-gray-600
              hover:bg-gray-800
              hover:text-white
              active:scale-[0.98]
            "
          >
            Cancel
          </button>

          {/* COMPLETE */}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canComplete}
            className={`
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              px-5
              py-3
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                canComplete
                  ? "bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/10 active:scale-[0.98]"
                  : "cursor-not-allowed bg-gray-800 text-gray-500"
              }
            `}
          >
            <CheckCircle2 size={17} />

            Complete Sprint
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteSprintModal;

