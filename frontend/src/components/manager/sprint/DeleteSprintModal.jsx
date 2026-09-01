
// ============================================================
// AIPMS — DELETE SPRINT MODAL
//
// SP-003 — Delete Sprint
//
// Location:
// src/components/manager/sprint/DeleteSprintModal.jsx
//
// Purpose:
// Allows the Manager to confirm deletion of a Planning Sprint.
// ============================================================

import React, { useState } from "react";

import {
    X,
    Trash2,
    AlertTriangle,
} from "lucide-react";

// ============================================================
// COMPONENT
// ============================================================

function DeleteSprintModal({
    onClose,
    sprint,
    onDeleted,
}) {
    // ========================================================
    // DELETE LOADING STATE
    // ========================================================

    const [isDeleting, setIsDeleting] = useState(false);

    // ========================================================
    // DO NOT RENDER WITHOUT SELECTED SPRINT
    // ========================================================

    if (!sprint) {
        return null;
    }

    // ========================================================
    // HANDLE DELETE
    // ========================================================

    const handleDelete = async () => {
        // ----------------------------------------------------
        // PREVENT DOUBLE CLICK
        // ----------------------------------------------------

        if (isDeleting) {
            return;
        }

        // ----------------------------------------------------
        // VALIDATE SPRINT ID
        // ----------------------------------------------------

        if (
            sprint.id === undefined ||
            sprint.id === null
        ) {
            console.error(
                "Cannot delete sprint: sprint ID is missing.",
                sprint
            );

            return;
        }

        setIsDeleting(true);

        try {
            // ------------------------------------------------
            // SEND ID TO PARENT
            // ------------------------------------------------

            if (typeof onDeleted !== "function") {
                throw new Error(
                    "Delete handler is not available."
                );
            }

            await onDeleted(sprint.id);

            // ------------------------------------------------
            // CLOSE AFTER SUCCESS
            // ------------------------------------------------

            if (typeof onClose === "function") {
                onClose();
            }
        } catch (error) {
            console.error(
                "Failed to delete sprint:",
                error
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // ========================================================
    // HANDLE BACKDROP CLICK
    // ========================================================

    const handleBackdropClick = (event) => {
        if (
            event.target === event.currentTarget &&
            !isDeleting
        ) {
            if (typeof onClose === "function") {
                onClose();
            }
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
            onMouseDown={handleBackdropClick}
            role="presentation"
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-sprint-title"
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                            <Trash2
                                size={19}
                                className="text-red-600"
                            />
                        </div>

                        <div>
                            <h2
                                id="delete-sprint-title"
                                className="text-lg font-semibold text-slate-900"
                            >
                                Delete Sprint
                            </h2>

                            <p className="text-xs text-slate-500">
                                Permanently remove this sprint
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-label="Close delete sprint dialog"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="px-6 py-6">

                    {/* ==================================================
                        WARNING
                    ================================================== */}

                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">

                        <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                This action cannot be undone.
                            </p>

                            <p className="mt-1 text-sm leading-5 text-red-700">
                                Deleting this sprint will permanently
                                remove the sprint information.
                            </p>
                        </div>

                    </div>

                    {/* ==================================================
                        CONFIRMATION
                    ================================================== */}

                    <p className="text-sm leading-6 text-slate-600">
                        Are you sure you want to delete
                        <span className="font-semibold text-slate-900">
                            {" "}
                            {sprint.name}
                        </span>
                        ?
                    </p>

                    {/* ==================================================
                        SPRINT INFORMATION
                    ================================================== */}

                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">

                        <div className="grid grid-cols-2 gap-4">

                            {/* STATUS */}

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Status
                                </p>

                                <p className="mt-1 font-semibold text-slate-700">
                                    {sprint.status || "Planning"}
                                </p>
                            </div>

                            {/* PROGRESS */}

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Progress
                                </p>

                                <p className="mt-1 font-semibold text-slate-700">
                                    {sprint.progress ?? 0}%
                                </p>
                            </div>

                            {/* START DATE */}

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Start Date
                                </p>

                                <p className="mt-1 font-semibold text-slate-700">
                                    {sprint.startDate || "Not set"}
                                </p>
                            </div>

                            {/* END DATE */}

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    End Date
                                </p>

                                <p className="mt-1 font-semibold text-slate-700">
                                    {sprint.endDate || "Not set"}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">

                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        {/* DELETE */}

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Trash2 size={17} />

                            {isDeleting
                                ? "Deleting..."
                                : "Delete Sprint"}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default DeleteSprintModal;

