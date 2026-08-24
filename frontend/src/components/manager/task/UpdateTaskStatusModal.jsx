
import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  CircleDot,
  Eye,
  AlertTriangle,
  Clock3,
  Save,
} from "lucide-react";

function UpdateTaskStatusModal({
  open,
  task,
  onClose,
  onConfirm,
}) {
  const [status, setStatus] = useState("To Do");
  const [progressNote, setProgressNote] = useState("");
  const [error, setError] = useState("");

  const statuses = [
    {
      value: "To Do",
      label: "To Do",
      description: "Task has not started yet.",
      icon: CircleDot,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      value: "In Progress",
      label: "In Progress",
      description: "Task is currently being worked on.",
      icon: Clock3,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      value: "Review",
      label: "Review",
      description: "Task is ready for review.",
      icon: Eye,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      value: "Completed",
      label: "Completed",
      description: "Task has been completed successfully.",
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      value: "Blocked",
      label: "Blocked",
      description: "Task cannot continue because of a blocker.",
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  useEffect(() => {
    if (open && task) {
      setStatus(task.status || "To Do");
      setProgressNote("");
      setError("");
    }
  }, [open, task]);

  if (!open || !task) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!status) {
      setError("Please select a task status.");
      return;
    }

    if (status === task.status && !progressNote.trim()) {
      setError("Please select a new status or add a progress note.");
      return;
    }

    if (typeof onConfirm !== "function") {
      setError("Status update handler is not available.");
      return;
    }

    onConfirm(task, status, progressNote.trim());
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
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-2xl
          overflow-hidden
          rounded-2xl
          border
          border-gray-800
          bg-[#0f172a]
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-800
            px-6
            py-5
          "
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Task Status
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Update Task Status
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {task.id} — {task.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-gray-800
              hover:text-white
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            {/* CURRENT STATUS */}
            <div
              className="
                mb-6
                rounded-xl
                border
                border-gray-800
                bg-[#020617]
                p-4
              "
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Current Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {task.status || "To Do"}
                </span>

                {task.progress !== undefined && (
                  <span className="text-xs text-gray-500">
                    {task.progress}% progress
                  </span>
                )}
              </div>
            </div>

            {/* STATUS OPTIONS */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-white">
                Select New Status
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {statuses.map((item) => {
                  const Icon = item.icon;
                  const selected = status === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setStatus(item.value);
                        setError("");
                      }}
                      className={`
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        p-4
                        text-left
                        transition
                        ${
                          selected
                            ? `${item.border} ${item.bg} ring-1 ring-current/20`
                            : "border-gray-800 bg-[#020617] hover:border-gray-700"
                        }
                      `}
                    >
                      <div
                        className={`
                          mt-0.5
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          ${item.bg}
                          ${item.color}
                        `}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              text-sm
                              font-semibold
                              ${
                                selected
                                  ? "text-white"
                                  : "text-gray-300"
                              }
                            `}
                          >
                            {item.label}
                          </span>

                          {selected && (
                            <CheckCircle2
                              size={15}
                              className={item.color}
                            />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PROGRESS NOTE */}
            <div className="mt-6">
              <label
                htmlFor="progress-note"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Progress Note
                <span className="ml-2 text-xs font-normal text-gray-500">
                  Optional
                </span>
              </label>

              <textarea
                id="progress-note"
                value={progressNote}
                onChange={(event) =>
                  setProgressNote(event.target.value)
                }
                rows={4}
                maxLength={500}
                placeholder="Add a short note about the progress, blocker, review result, or completion..."
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
                  placeholder:text-gray-600
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500/30
                "
              />

              <div className="mt-1 flex justify-end">
                <span className="text-xs text-gray-600">
                  {progressNote.length}/500
                </span>
              </div>
            </div>

            {/* ERROR */}
            {error && (
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
                  px-4
                  py-3
                "
              >
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div
            className="
              flex
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
              onClick={onClose}
              className="
                rounded-xl
                border
                border-gray-700
                px-5
                py-2.5
                text-sm
                font-semibold
                text-gray-300
                transition
                hover:bg-gray-800
                hover:text-white
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
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
                active:scale-[0.98]
              "
            >
              <Save size={17} />
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTaskStatusModal;

