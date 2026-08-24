
import React, { useEffect, useState } from "react";
import {
  Flag,
  X,
  CheckCircle2,
} from "lucide-react";

function SetPriorityModal({
  open,
  task,
  onClose,
  onConfirm,
}) {
  const priorities = [
    {
      value: "Low",
      label: "Low",
      description:
        "Normal priority. Can be handled when convenient.",
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
    },
    {
      value: "Medium",
      label: "Medium",
      description:
        "Standard priority for normal project work.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    {
      value: "High",
      label: "High",
      description:
        "Important task that should be completed soon.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
    },
    {
      value: "Critical",
      label: "Critical",
      description:
        "Urgent task requiring immediate attention.",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
  ];

  const [selectedPriority, setSelectedPriority] =
    useState("Medium");

  useEffect(() => {
    if (open && task) {
      setSelectedPriority(
        task.priority || "Medium"
      );
    }
  }, [open, task]);

  if (!open || !task) {
    return null;
  }

  const selectedPriorityData =
    priorities.find(
      (priority) =>
        priority.value === selectedPriority
    );

  const handleConfirm = () => {
    if (!selectedPriority) {
      return;
    }

    if (typeof onConfirm === "function") {
      onConfirm(task, selectedPriority);
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
      onClick={onClose}
    >
      {/* =================================================
          MODAL
      ================================================= */}

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
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

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
                bg-orange-500/10
                text-orange-400
              "
            >
              <Flag size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white">
                Set Task Priority
              </h2>

              <p className="mt-1 truncate text-xs text-gray-500">
                {task.id} • {task.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-800
              hover:text-white
            "
            aria-label="Close"
          >
            <X size={19} />
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
          "
        >
          {/* CURRENT PRIORITY */}

          <div
            className={`
              mb-5
              rounded-xl
              border
              px-4
              py-3
              ${selectedPriorityData?.bg}
              ${selectedPriorityData?.border}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  Selected Priority
                </p>

                <p
                  className={`
                    mt-1
                    text-lg
                    font-bold
                    ${selectedPriorityData?.color}
                  `}
                >
                  {selectedPriority}
                </p>
              </div>

              <Flag
                size={22}
                className={
                  selectedPriorityData?.color
                }
              />
            </div>
          </div>

          {/* PRIORITY OPTIONS */}

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-300">
              Choose priority level
            </p>

            <div className="space-y-2">
              {priorities.map(
                (priority) => {
                  const isSelected =
                    selectedPriority ===
                    priority.value;

                  return (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() =>
                        setSelectedPriority(
                          priority.value
                        )
                      }
                      className={`
                        w-full
                        rounded-xl
                        border
                        p-4
                        text-left
                        transition

                        ${
                          isSelected
                            ? `${priority.bg} ${priority.border}`
                            : "border-gray-800 bg-[#020617] hover:border-gray-700 hover:bg-gray-800/50"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              ${priority.bg}
                              ${priority.color}
                            `}
                          >
                            <Flag size={17} />
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`
                                text-sm
                                font-semibold
                                ${
                                  isSelected
                                    ? priority.color
                                    : "text-gray-200"
                                }
                              `}
                            >
                              {priority.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {
                                priority.description
                              }
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2
                            size={20}
                            className={`shrink-0 ${priority.color}`}
                          />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* BOTTOM SPACE */}

          <div className="h-4" />
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
            bg-[#020617]/70
            px-6
            py-4
            sm:flex-row
            sm:justify-end
          "
        >
          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-gray-700
              bg-gray-800/60
              px-5
              py-2.5
              text-sm
              font-semibold
              text-gray-300
              transition
              hover:bg-gray-700
              hover:text-white
            "
          >
            Cancel
          </button>

          {/* UPDATE PRIORITY */}

          <button
            type="button"
            onClick={handleConfirm}
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
            Update Priority
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetPriorityModal;

