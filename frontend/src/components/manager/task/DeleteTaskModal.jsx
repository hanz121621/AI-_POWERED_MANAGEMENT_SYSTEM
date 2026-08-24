import React from "react";
import {
  AlertTriangle,
  X,
  Trash2,
} from "lucide-react";

function DeleteTaskModal({
  open,
  task,
  onClose,
  onConfirm,
}) {
  if (!open || !task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-[#0f172a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Delete Task
              </h2>

              <p className="text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-gray-300">
            Are you sure you want to delete this task?
          </p>

          <div className="mt-4 rounded-xl border border-gray-800 bg-[#020617] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500">
                  Task ID
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-400">
                  {task.id}
                </p>
              </div>

              <span
                className="
                  rounded-full
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-red-400
                "
              >
                {task.status}
              </span>
            </div>

            <p className="mt-3 text-base font-semibold text-white">
              {task.title}
            </p>

            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {task.description}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-xs leading-5 text-yellow-400">
              Deleting this task may affect its sprint,
              project information, and related task
              dependencies.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-800 bg-[#020617]/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
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
              hover:bg-gray-800
              hover:text-white
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(task)}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-red-900/20
              transition
              hover:bg-red-500
              active:scale-[0.98]
            "
          >
            <Trash2 size={17} />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;