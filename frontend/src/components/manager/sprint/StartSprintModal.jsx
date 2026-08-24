import React from "react";
import {
  X,
  PlayCircle,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

function StartSprintModal({
  open,
  sprint,
  onClose,
  onConfirm,
}) {
  if (!open || !sprint) {
    return null;
  }

  const hasTasks =
    Number(sprint.tasks) > 0;

  const hasValidDates =
    sprint.startDate &&
    sprint.endDate &&
    new Date(sprint.endDate) >=
      new Date(sprint.startDate);

  const isAlreadyActive =
    sprint.status === "Active";

  const canStart =
    !isAlreadyActive &&
    hasTasks &&
    hasValidDates;

  const handleConfirm = () => {
    if (!canStart) {
      return;
    }

    if (onConfirm) {
      onConfirm(sprint);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[150]
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-black/70
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Modal */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-lg
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
                bg-green-500/10
                text-green-400
              "
            >
              <PlayCircle size={22} />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-white
                "
              >
                Start Sprint
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                Activate this sprint for your team.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
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

        {/* Body */}

        <div className="p-6">

          {/* Sprint information */}

          <div
            className="
              mb-5
              rounded-xl
              border
              border-gray-800
              bg-[#020617]/60
              p-4
            "
          >
            <h3
              className="
                text-base
                font-semibold
                text-white
              "
            >
              {sprint.name}
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              Sprint #{sprint.id}
            </p>

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-3
              "
            >

              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={14}
                    className="text-blue-400"
                  />

                  <span className="text-xs text-gray-500">
                    Start
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-white">
                  {sprint.startDate || "Not set"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={14}
                    className="text-purple-400"
                  />

                  <span className="text-xs text-gray-500">
                    End
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-white">
                  {sprint.endDate || "Not set"}
                </p>
              </div>

            </div>
          </div>

          {/* Warning */}

          {!canStart && (
            <div
              className="
                mb-5
                flex
                gap-3
                rounded-xl
                border
                border-yellow-500/30
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
                <p
                  className="
                    text-sm
                    font-semibold
                    text-yellow-300
                  "
                >
                  Sprint cannot be started
                </p>

                {!hasTasks && (
                  <p className="mt-1 text-xs text-yellow-400/80">
                    Cannot start sprint without assigned tasks.
                  </p>
                )}

                {!hasValidDates && (
                  <p className="mt-1 text-xs text-yellow-400/80">
                    Invalid sprint schedule.
                  </p>
                )}

                {isAlreadyActive && (
                  <p className="mt-1 text-xs text-yellow-400/80">
                    Sprint is already started.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Confirmation */}

          {canStart && (
            <div
              className="
                flex
                gap-3
                rounded-xl
                border
                border-green-500/20
                bg-green-500/5
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

              <p
                className="
                  text-sm
                  leading-6
                  text-gray-300
                "
              >
                Starting this sprint will make its
                tasks available to contributors and
                begin sprint progress tracking.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}

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

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-gray-700
              px-5
              py-3
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
            disabled={!canStart}
            onClick={handleConfirm}
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
              transition

              ${
                canStart
                  ? "bg-green-600 text-white hover:bg-green-500 active:scale-[0.98]"
                  : "cursor-not-allowed bg-gray-800 text-gray-500"
              }
            `}
          >
            <PlayCircle size={17} />

            Start Sprint
          </button>

        </div>
      </div>
    </div>
  );
}

export default StartSprintModal;