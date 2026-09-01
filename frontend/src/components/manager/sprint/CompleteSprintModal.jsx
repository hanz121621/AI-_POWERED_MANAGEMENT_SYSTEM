
// ============================================================
// AIPMS — COMPLETE SPRINT MODAL
//
// Handles:
// SP-005 — Complete Sprint
// ============================================================

import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

function CompleteSprintModal({
    isOpen,
    onClose,
    sprint,
    onCompleted,
}) {
    const [error, setError] = useState("");

    if (!isOpen || !sprint) {
        return null;
    }

    const handleComplete = () => {
        setError("");

        if (sprint.status !== "Active") {
            setError(
                "Only an active sprint can be completed."
            );
            return;
        }

        const completedSprint = {
            ...sprint,
            status: "Completed",
            progress: 100,
        };

        if (typeof onCompleted === "function") {
            onCompleted(completedSprint);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Complete Sprint
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="px-6 py-6">
                    {error && (
                        <div className="mb-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <AlertTriangle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                            {sprint.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Current status: {sprint.status}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Current progress:{" "}
                            {sprint.progress || 0}%
                        </p>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-600">
                        Completing this sprint will mark it as
                        Completed and set its progress to 100%.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleComplete}
                            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            <CheckCircle size={17} />
                            Complete Sprint
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompleteSprintModal;

