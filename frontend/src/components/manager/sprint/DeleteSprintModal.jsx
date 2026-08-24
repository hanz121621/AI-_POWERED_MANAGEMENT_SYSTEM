import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";

function DeleteSprintModal({
  open,
  sprint,
  onClose,
  onConfirm,
}) {
  if (!open || !sprint) {
    return null;
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(sprint);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-gray-800
          bg-[#0f172a]
          shadow-2xl
        "
      >
        {/* Header */}
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
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                text-red-400
              "
            >
              <Trash2 size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Delete Sprint
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
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

        {/* Content */}
        <div className="p-6">
          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-yellow-500/20
              bg-yellow-500/5
              p-4
            "
          >
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-yellow-400"
            />

            <p className="text-sm leading-6 text-gray-300">
              Are you sure you want to delete this sprint?
              All information associated with this sprint
              will be removed from the current sprint list.
            </p>
          </div>

          {/* Sprint Information */}
          <div
            className="
              rounded-xl
              border
              border-gray-800
              bg-[#020617]/60
              p-4
            "
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Sprint
            </p>

            <p className="mt-1 text-base font-semibold text-white">
              {sprint.name}
            </p>

            {sprint.goal && (
              <p className="mt-2 text-sm leading-5 text-gray-400">
                {sprint.goal}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-gray-800
            bg-[#0b1222]
            px-6
            py-4
            sm:flex-row
            sm:justify-end
          "
        >
          {/* Cancel */}
          <button
            type="button"
            onClick={handleClose}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-700
              bg-transparent
              px-5
              py-3
              text-sm
              font-semibold
              text-gray-300
              transition-all
              duration-200
              hover:bg-gray-800
              hover:text-white
              active:scale-[0.98]
            "
          >
            <X size={17} />

            Cancel
          </button>

          {/* Confirm Delete */}
          <button
            type="button"
            onClick={handleConfirm}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:bg-red-500
              hover:shadow-red-500/20
              active:scale-[0.98]
            "
          >
            <Trash2 size={17} />

            Delete Sprint
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSprintModal;