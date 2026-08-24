import {
    AlertTriangle,
    Archive,
    Trash2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

// ============================================================
// DELETE PROJECT DIALOG
// PROJ-005: Delete Project
//
// Flow:
// Delete button
//     ↓
// Confirmation dialog opens
//     ↓
// Admin clicks "Delete Project"
//     ↓
// onDelete(project)
//     ↓
// ProjectOversight removes project
// ============================================================

function DeleteProjectDialog({
    open,
    project,
    onClose,
    onDelete,
}) {
    // ========================================================
    // PROJECT VALIDATION
    // ========================================================

    const hasProject = Boolean(project);

    const activeTasks =
        Number(project?.activeTasks) || 0;

    const hasActiveData = activeTasks > 0;

    // ========================================================
    // HANDLE DELETE
    // ========================================================

    const handleDelete = () => {
        if (!project) {
            return;
        }

        // Do not delete projects that still have active tasks.
        if (hasActiveData) {
            return;
        }

        // Send the selected project to ProjectOversight.
        if (typeof onDelete === "function") {
            onDelete(project);
        }
    };

    // ========================================================
    // HANDLE CLOSE
    // ========================================================

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    handleClose();
                }
            }}
        >
            <DialogContent
                className="
                    border-blue-800
                    bg-blue-950
                    text-white
                    shadow-2xl
                    sm:max-w-lg
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <DialogHeader>
                    <DialogTitle
                        className="
                            flex
                            items-center
                            gap-3
                            text-xl
                            text-white
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-red-400/30
                                bg-red-500/10
                                text-red-400
                            "
                        >
                            <Trash2 size={20} />
                        </div>

                        Delete Project
                    </DialogTitle>

                    <DialogDescription
                        className="
                            pt-2
                            text-blue-300
                        "
                    >
                        {hasProject ? (
                            <>
                                You are about to delete{" "}
                                <strong className="text-white">
                                    {project.name}
                                </strong>
                                .
                            </>
                        ) : (
                            "The selected project could not be found."
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* ==================================================
                    PROJECT NOT FOUND
                ================================================== */}

                {!hasProject && (
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-500/30
                            bg-red-500/10
                            px-4
                            py-4
                            text-sm
                            text-red-300
                        "
                    >
                        <AlertTriangle
                            size={19}
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <div>
                            <p className="font-semibold">
                                Project not found.
                            </p>

                            <p className="mt-1 text-xs text-red-300/80">
                                The project may have already
                                been removed.
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    ACTIVE TASK WARNING
                ================================================== */}

                {hasProject && hasActiveData && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-amber-500/30
                            bg-amber-500/10
                            p-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >
                            <AlertTriangle
                                size={20}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-amber-400
                                "
                            />

                            <div>
                                <p
                                    className="
                                        font-semibold
                                        text-amber-300
                                    "
                                >
                                    Project cannot be deleted
                                    because it contains active
                                    data.
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-amber-200/80
                                    "
                                >
                                    This project currently has{" "}
                                    <strong className="text-amber-200">
                                        {activeTasks}
                                    </strong>{" "}
                                    active task
                                    {activeTasks !== 1 ? "s" : ""}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    DELETE WARNING
                ================================================== */}

                {hasProject && !hasActiveData && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-red-500/20
                            bg-red-500/5
                            p-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >
                            <Trash2
                                size={19}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-red-400
                                "
                            />

                            <div className="space-y-2">
                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-red-300
                                    "
                                >
                                    This action cannot be undone.
                                </p>

                                <p
                                    className="
                                        text-xs
                                        leading-5
                                        text-blue-300
                                    "
                                >
                                    The project and its associated
                                    information will be removed
                                    from the project list.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    PROJECT INFORMATION
                ================================================== */}

                {hasProject && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-800
                            bg-blue-900/60
                            p-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-800
                                    text-blue-300
                                "
                            >
                                <Archive size={19} />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {project.name}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-blue-400
                                    "
                                >
                                    {project.manager ||
                                        "No manager assigned"}
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-3
                                border-t
                                border-blue-800
                                pt-4
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[11px]
                                        uppercase
                                        tracking-wide
                                        text-blue-400
                                    "
                                >
                                    Status
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {project.status || "Unknown"}
                                </p>
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[11px]
                                        uppercase
                                        tracking-wide
                                        text-blue-400
                                    "
                                >
                                    Tasks
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {project.tasks || 0}
                                </p>
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[11px]
                                        uppercase
                                        tracking-wide
                                        text-blue-400
                                    "
                                >
                                    Active Tasks
                                </p>

                                <p
                                    className={`
                                        mt-1
                                        text-sm
                                        font-semibold
                                        ${
                                            hasActiveData
                                                ? "text-amber-300"
                                                : "text-emerald-300"
                                        }
                                    `}
                                >
                                    {activeTasks}
                                </p>
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[11px]
                                        uppercase
                                        tracking-wide
                                        text-blue-400
                                    "
                                >
                                    Progress
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {project.progress || 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <DialogFooter
                    className="
                        gap-2
                        border-t
                        border-blue-800
                        pt-5
                    "
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="
                            border-blue-700
                            bg-blue-950
                            text-blue-200
                            transition-all
                            duration-300
                            hover:border-blue-400
                            hover:bg-blue-900
                            hover:text-white
                        "
                    >
                        Cancel
                    </Button>

                    {hasProject && (
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={hasActiveData}
                            className="
                                gap-2
                                border
                                border-red-400/30
                                bg-red-600
                                text-white
                                shadow-md
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:border-red-300
                                hover:bg-red-500
                                hover:shadow-lg
                                hover:shadow-red-500/20
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Trash2 size={17} />

                            Delete Project
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteProjectDialog;