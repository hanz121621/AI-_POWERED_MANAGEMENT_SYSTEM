
import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  User,
  CalendarDays,
  FileText,
  AlertTriangle,
} from "lucide-react";

function ReviewCompletedTaskModal({
  open,
  task,
  onClose,
  onReview,
}) {
  const [reviewStatus, setReviewStatus] = useState("Approved");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (open && task) {
      setReviewStatus("Approved");
      setFeedback(task.reviewFeedback || "");
    }
  }, [open, task]);

  if (!open || !task) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (typeof onReview !== "function") {
      return;
    }

    onReview(task, {
      reviewStatus,
      feedback: feedback.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-800 bg-[#0f172a] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Review Completed Task
                </h2>

                <p className="text-xs text-gray-500">
                  Review the contributor's submitted work
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
            {/* TASK INFORMATION */}
            <div className="rounded-xl border border-gray-800 bg-[#020617] p-4">
              <div className="mb-4 flex items-center gap-2">
                <FileText size={17} className="text-blue-400" />

                <h3 className="font-semibold text-white">
                  Task Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Task
                  </p>

                  <p className="mt-1 text-base font-semibold text-white">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    {task.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Description
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    {task.description ||
                      "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <User size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Contributor
                      </p>

                      <p className="truncate text-sm font-medium text-gray-300">
                        {task.contributorName ||
                          "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <CalendarDays size={16} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Completion Date
                      </p>

                      <p className="text-sm font-medium text-gray-300">
                        {task.completedAt
                          ? new Date(
                              task.completedAt
                            ).toLocaleDateString()
                          : task.completionDate ||
                            "Not recorded"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMITTED WORK */}
            <div className="rounded-xl border border-gray-800 bg-[#020617] p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText
                  size={17}
                  className="text-cyan-400"
                />

                <h3 className="font-semibold text-white">
                  Submitted Work / Result
                </h3>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                  {task.submittedWork ||
                    task.submission ||
                    task.result ||
                    "No submitted work or result has been provided."}
                </p>
              </div>
            </div>

            {/* PREVIOUS REVIEW */}
            {task.reviewStatus && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  Previous Review
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  Status:{" "}
                  <span className="font-semibold text-white">
                    {task.reviewStatus}
                  </span>
                </p>

                {task.reviewFeedback && (
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {task.reviewFeedback}
                  </p>
                )}
              </div>
            )}

            {/* REVIEW RESULT */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-white">
                Review Result
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* APPROVE */}
                <button
                  type="button"
                  onClick={() =>
                    setReviewStatus("Approved")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    reviewStatus === "Approved"
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-gray-800 bg-[#020617] hover:border-green-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                      <CheckCircle2 size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Approve
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Work meets the requirements.
                      </p>
                    </div>
                  </div>
                </button>

                {/* REVISION */}
                <button
                  type="button"
                  onClick={() =>
                    setReviewStatus("Needs Revision")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    reviewStatus === "Needs Revision"
                      ? "border-orange-500/50 bg-orange-500/10"
                      : "border-gray-800 bg-[#020617] hover:border-orange-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                      <RotateCcw size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Needs Revision
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Send the task back for changes.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* FEEDBACK */}
            <div>
              <label
                htmlFor="review-feedback"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"
              >
                <MessageSquare
                  size={16}
                  className="text-purple-400"
                />
                Feedback
                <span className="text-xs font-normal text-gray-600">
                  Optional
                </span>
              </label>

              <textarea
                id="review-feedback"
                value={feedback}
                onChange={(event) =>
                  setFeedback(event.target.value)
                }
                rows={5}
                placeholder={
                  reviewStatus === "Approved"
                    ? "Add feedback for the contributor..."
                    : "Explain what needs to be revised..."
                }
                className="w-full resize-none rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
              />

              {reviewStatus === "Needs Revision" && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <AlertTriangle
                    size={15}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />

                  <p className="text-xs leading-5 text-orange-300/80">
                    Please provide clear feedback explaining
                    what the contributor needs to change.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-800 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-700 bg-gray-800/50 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                reviewStatus === "Approved"
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-orange-600 hover:bg-orange-500"
              }`}
            >
              {reviewStatus === "Approved" ? (
                <CheckCircle2 size={17} />
              ) : (
                <RotateCcw size={17} />
              )}

              {reviewStatus === "Approved"
                ? "Approve Task"
                : "Send for Revision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewCompletedTaskModal;

