
import React, { useEffect, useState } from "react";
import {
  X,
  CalendarDays,
  Clock3,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function SetDeadlineModal({
  open,
  task,
  sprints = [],
  onClose,
  onConfirm,
}) {
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !task) {
      return;
    }

    setDeadline(task.deadline || "");
    setTime(task.deadlineTime || "");
    setNotes(task.deadlineNotes || "");
    setError("");
  }, [open, task]);

  if (!open || !task) {
    return null;
  }

  const handleClose = () => {
    setError("");
    onClose?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!deadline) {
      setError("Please select a deadline date.");
      return;
    }

    const taskCreatedDate = task.createdAt
      ? new Date(task.createdAt)
      : null;

    const selectedDeadline = new Date(
      `${deadline}T${time || "23:59"}`
    );

    if (
      taskCreatedDate &&
      selectedDeadline < taskCreatedDate
    ) {
      setError("Invalid deadline date.");
      return;
    }

    /*
     * Check sprint timeline when sprint dates
     * are available.
     */
    const currentSprint = sprints.find(
      (sprint) =>
        String(sprint.id) ===
        String(task.sprintId)
    );

    if (currentSprint) {
      const sprintStart =
        currentSprint.startDate
          ? new Date(
              `${currentSprint.startDate}T00:00`
            )
          : null;

      const sprintEnd =
        currentSprint.endDate
          ? new Date(
              `${currentSprint.endDate}T23:59`
            )
          : null;

      if (
        sprintStart &&
        selectedDeadline < sprintStart
      ) {
        setError(
          "Task deadline conflicts with sprint schedule."
        );
        return;
      }

      if (
        sprintEnd &&
        selectedDeadline > sprintEnd
      ) {
        setError(
          "Task deadline conflicts with sprint schedule."
        );
        return;
      }
    }

    if (typeof onConfirm !== "function") {
      setError(
        "Unable to update task deadline. Please try again."
      );
      return;
    }

    onConfirm(task, {
      deadline,
      deadlineTime: time,
      deadlineNotes: notes.trim(),
    });
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        py-6
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
          flex
          max-h-[90vh]
          w-full
          max-w-lg
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-700
          bg-[#0f172a]
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-800
            px-6
            py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <CalendarDays size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Set Task Deadline
              </h2>

              <p className="text-xs text-gray-500">
                {task.id} · {task.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              rounded-lg
              p-2
              text-gray-500
              transition
              hover:bg-gray-800
              hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}

        <div className="overflow-y-auto px-6 py-6">
          <form
            id="deadline-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* CURRENT DEADLINE */}

            <div
              className="
                rounded-xl
                border
                border-gray-800
                bg-[#020617]
                p-4
              "
            >
              <p className="text-xs text-gray-500">
                Current Deadline
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-blue-400"
                />

                <span className="text-sm font-medium text-gray-200">
                  {task.deadline
                    ? task.deadline
                    : "No deadline set"}
                </span>

                {task.deadlineTime && (
                  <>
                    <Clock3
                      size={15}
                      className="ml-2 text-gray-500"
                    />

                    <span className="text-sm text-gray-400">
                      {task.deadlineTime}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-4
                  py-3
                "
              >
                <AlertTriangle
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-400
                  "
                />

                <p className="text-sm leading-5 text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* DATE */}

            <div>
              <label
                htmlFor="task-deadline"
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-gray-300
                "
              >
                <CalendarDays
                  size={15}
                  className="text-blue-400"
                />

                Deadline Date
              </label>

              <input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(event) =>
                  setDeadline(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#020617]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              />
            </div>

            {/* TIME */}

            <div>
              <label
                htmlFor="task-deadline-time"
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-gray-300
                "
              >
                <Clock3
                  size={15}
                  className="text-purple-400"
                />

                Deadline Time
                <span className="text-xs text-gray-600">
                  (Optional)
                </span>
              </label>

              <input
                id="task-deadline-time"
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#020617]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              />
            </div>

            {/* NOTES */}

            <div>
              <label
                htmlFor="deadline-notes"
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-gray-300
                "
              >
                <FileText
                  size={15}
                  className="text-yellow-400"
                />

                Deadline Notes
                <span className="text-xs text-gray-600">
                  (Optional)
                </span>
              </label>

              <textarea
                id="deadline-notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={4}
                placeholder="Add any notes about this deadline..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#020617]
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-white
                  outline-none
                  transition
                  placeholder:text-gray-600
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              />
            </div>

            {/* INFO */}

            <div
              className="
                rounded-xl
                border
                border-blue-500/20
                bg-blue-500/5
                px-4
                py-3
              "
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    text-blue-400
                  "
                />

                <p className="text-xs leading-5 text-blue-300/80">
                  The deadline will be checked against
                  the task creation date and sprint
                  schedule before it is saved.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}

        <div
          className="
            flex
            shrink-0
            flex-col-reverse
            gap-3
            border-t
            border-gray-800
            bg-[#0b1220]
            px-6
            py-4
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={handleClose}
            className="
              rounded-xl
              border
              border-gray-700
              bg-gray-800/50
              px-5
              py-2.5
              text-sm
              font-semibold
              text-gray-300
              transition
              hover:border-gray-600
              hover:bg-gray-800
              hover:text-white
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            form="deadline-form"
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition
              hover:bg-blue-500
              hover:shadow-blue-500/20
              active:scale-[0.98]
            "
          >
            Save Deadline
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetDeadlineModal;

