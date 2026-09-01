
// ============================================================
// AIPMS — START SPRINT MODAL
//
// Handles:
// SP-004 — Start Sprint
// ============================================================

import React from "react";
import { X, Play, AlertTriangle } from "lucide-react";

function StartSprintModal({
    isOpen,
    onClose,
    sprint,
    onStarted,
}) {
    if (!isOpen || !sprint) {
        return null;
    }

    const handleStart = () => {
        const startedSprint = {
            ...sprint,
            status: "Active",
        };

        if (typeof onStarted === "function") {
            onStarted(startedSprint);
        }

        onClose();
    };

    const canStart =
        sprint.status === "Planning";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Start Sprint
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
                    {!canStart ? (
                        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <p className="text-sm text-amber-800">
                                This sprint cannot be started because
                                its current status is{" "}
                                <strong>{sprint.status}</strong>.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-slate-600">
                                Are you ready to start{" "}
                                <span className="font-semibold text-slate-900">
                                    {sprint.name}
                                </span>
                                ?
                            </p>

                            <p className="mt-3 text-sm text-slate-500">
                                Starting the sprint will change its
                                status from Planning to Active.
                            </p>
                        </>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        {canStart && (
                            <button
                                type="button"
                                onClick={handleStart}
                                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                <Play size={17} />
                                Start Sprint
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartSprintModal;

