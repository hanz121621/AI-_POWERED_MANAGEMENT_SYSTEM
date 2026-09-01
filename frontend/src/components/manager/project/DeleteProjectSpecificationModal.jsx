
import React, { useState } from "react";

import {
    X,
    Trash2,
    AlertTriangle,
    FileText,
    ShieldAlert,
} from "lucide-react";

// ============================================================
// AIPMS — DELETE PROJECT SPECIFICATION
//
// Design:
// - Matches Sprint Management page
// - Slate-50 page/modal background
// - Violet / blue / cyan accents
// - Rounded professional cards
// - Colorful gradient header
// ============================================================

function DeleteProjectSpecification({
    project,
    currentManager,
    onClose,
    onDeleted,
}) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    // ========================================================
    // SAFETY
    // ========================================================

    if (!project) {
        return null;
    }

    // ========================================================
    // DELETE SPECIFICATION
    // ========================================================

    const handleDelete = async () => {
        setError("");

        // ----------------------------------------------------
        // MANAGER AUTHORIZATION
        // ----------------------------------------------------

        if (
            !currentManager ||
            project.managerId !== currentManager.id
        ) {
            setError(
                "You are not authorised to manage this project."
            );

            return;
        }

        // ----------------------------------------------------
        // SPECIFICATION EXISTENCE
        // ----------------------------------------------------

        if (
            !project.hasSpecification ||
            !project.specification
        ) {
            setError(
                "A project specification does not exist."
            );

            return;
        }

        // ----------------------------------------------------
        // ACTIVE SPRINT DEPENDENCY
        // ----------------------------------------------------

        if (project.hasActiveSprint) {
            setError(
                "This project specification is being used by an active Sprint and cannot be deleted."
            );

            return;
        }

        // ----------------------------------------------------
        // DELETE
        // ----------------------------------------------------

        try {
            setDeleting(true);

            /*
             * Replace with backend service later:
             *
             * await projectSpecificationService.delete(
             *     project.id,
             *     project.specification.id
             * );
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );

            onDeleted(project.id);
        } catch (deleteError) {
            console.error(
                "Failed to delete project specification:",
                deleteError
            );

            setError(
                "Unable to delete the project specification. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* ==================================================
                    COLORFUL HEADER
                ================================================== */}

                <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 px-6 py-5 text-white">

                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />

                    <div className="absolute -bottom-12 right-20 h-24 w-24 rounded-full bg-white/10" />

                    <div className="relative flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                <Trash2
                                    size={21}
                                    className="text-white"
                                />

                            </div>

                            <div>

                                <div className="mb-0.5 flex items-center gap-2">

                                    <ShieldAlert
                                        size={14}
                                        className="text-cyan-200"
                                    />

                                    <span className="text-xs font-semibold uppercase tracking-wider text-white/75">
                                        Specification Management
                                    </span>

                                </div>

                                <h2 className="text-lg font-bold">
                                    Delete Project Specification
                                </h2>

                                <p className="mt-0.5 text-sm text-white/80">
                                    Confirmation required
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleting}
                            aria-label="Close"
                            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X size={19} />
                        </button>

                    </div>

                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="px-6 py-6">

                    {/* WARNING */}

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">

                                <AlertTriangle
                                    size={20}
                                    className="text-amber-600"
                                />

                            </div>

                            <div>

                                <p className="text-sm font-bold text-amber-800">
                                    Are you sure you want to delete this specification?
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    This action will remove the project
                                    specification. The project itself will
                                    not be deleted.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* PROJECT INFORMATION */}

                    <div className="mt-5 overflow-hidden rounded-xl border border-violet-100 bg-violet-50">

                        <div className="flex items-center gap-3 border-b border-violet-100 px-4 py-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">

                                <FileText size={18} />

                            </div>

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                                    Project
                                </p>

                                <p className="mt-0.5 font-bold text-slate-900">
                                    {project.name}
                                </p>

                            </div>

                        </div>

                        <div className="px-4 py-3">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Specification
                                </span>

                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                    Available
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div
                            role="alert"
                            className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                        >

                            <AlertTriangle
                                size={18}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <span>
                                {error}
                            </span>

                        </div>
                    )}

                </div>

                {/* ==================================================
                    FOOTER ACTIONS
                ================================================== */}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Trash2 size={17} />

                        {deleting
                            ? "Deleting..."
                            : "Confirm Delete"}

                    </button>

                </div>

            </div>

        </div>
    );
}

export default DeleteProjectSpecification;

