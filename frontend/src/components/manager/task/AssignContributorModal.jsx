import React, { useEffect, useState } from "react";
import {
  X,
  UserRound,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function AssignContributorModal({
  open,
  task,
  contributors = [],
  onClose,
  onConfirm,
}) {
  const [selectedContributor, setSelectedContributor] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (open && task) {
      setSelectedContributor(
        task.contributor
          ? String(task.contributor)
          : ""
      );

      setError("");
    }
  }, [open, task]);

  if (!open || !task) {
    return null;
  }

  const handleClose = () => {
    setSelectedContributor("");
    setError("");
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!selectedContributor) {
      setError("Please select a contributor.");
      return;
    }

    const contributor = contributors.find(
      (item) =>
        String(item.id) ===
        String(selectedContributor)
    );

    if (!contributor) {
      setError(
        "Contributor is not assigned to this team."
      );
      return;
    }

    if (typeof onConfirm !== "function") {
      setError(
        "Unable to assign task. Please try again."
      );
      return;
    }

    onConfirm(task, contributor);
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
        px-4
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
        {/* =================================================
            HEADER
        ================================================= */}

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
                bg-blue-500/10
                text-blue-400
              "
            >
              <UserCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Assign Contributor
              </h2>

              <p className="text-xs text-gray-500">
                Assign this task to a team member
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

        {/* =================================================
            BODY
        ================================================= */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">

            {/* TASK INFORMATION */}

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
                Task
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {task.title}
              </p>

              <div className="mt-2 flex items-center gap-2">
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

                <span
                  className="
                    rounded-md
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-2
                    py-1
                    text-[11px]
                    font-semibold
                    text-blue-400
                  "
                >
                  {task.status}
                </span>
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
                  bg-red-500/5
                  px-4
                  py-3
                "
              >
                <AlertCircle
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-400
                  "
                />

                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* CONTRIBUTORS */}

            <div>
              <label
                htmlFor="task-contributor"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-300
                "
              >
                Select Contributor
              </label>

              {contributors.length === 0 ? (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-yellow-500/20
                    bg-yellow-500/5
                    px-4
                    py-4
                  "
                >
                  <AlertCircle
                    size={18}
                    className="text-yellow-400"
                  />

                  <p className="text-sm text-yellow-400">
                    No available contributors found.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <UserRound
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                    "
                  />

                  <select
                    id="task-contributor"
                    value={selectedContributor}
                    onChange={(event) => {
                      setSelectedContributor(
                        event.target.value
                      );
                      setError("");
                    }}
                    className="
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-gray-700
                      bg-[#020617]
                      px-11
                      py-3
                      text-sm
                      text-gray-300
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                  >
                    <option value="">
                      Select a contributor
                    </option>

                    {contributors.map(
                      (contributor) => (
                        <option
                          key={contributor.id}
                          value={contributor.id}
                        >
                          {contributor.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* CURRENT ASSIGNMENT */}

            {task.contributorName && (
              <div
                className="
                  rounded-xl
                  border
                  border-gray-800
                  bg-gray-900/50
                  px-4
                  py-3
                "
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-green-400"
                  />

                  <p className="text-xs text-gray-500">
                    Currently assigned to
                  </p>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-300">
                  {task.contributorName}
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-gray-800
              px-6
              py-5
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
                hover:bg-gray-800
                hover:text-white
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                contributors.length === 0
              }
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
                disabled:cursor-not-allowed
                disabled:bg-gray-700
                disabled:text-gray-500
              "
            >
              <UserCheck size={17} />
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignContributorModal;