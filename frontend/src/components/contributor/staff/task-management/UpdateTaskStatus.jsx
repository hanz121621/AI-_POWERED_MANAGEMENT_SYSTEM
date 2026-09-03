import { useMemo, useState } from "react";
import {
    CheckCircle2,
    CircleAlert,
    Clock3,
    FileText,
    MessageSquare,
    Paperclip,
    Save,
    X,
} from "lucide-react";

// ============================================================
// CONT-STAFF-002
// UPDATE TASK STATUS
// ============================================================
//
// Staff can update the status of an assigned task.
//
// Allowed statuses:
// - Backlog
// - In Progress
// - Review
// - Blocked
// - Done
//
// Staff CANNOT approve their own completed work.
// Final approval remains with the Manager.
// ============================================================

const ALLOWED_STATUSES = [
    "Backlog",
    "In Progress",
    "Review",
    "Blocked",
    "Done",
];

const CLOSED_STATUSES = [
    "Closed",
];

function UpdateTaskStatus({
    task = null,
    onUpdated,
    onClose,
}) {
    // ========================================================
    // DEMO / FALLBACK TASK
    // ========================================================

    const initialTask = useMemo(() => {
        return (
            task || {
                id: null,
                title: "Assigned Task",
                description:
                    "Select a status and update your progress.",
                projectName: "No project selected",
                sprintName: "No sprint selected",
                priority: "Medium",
                status: "Backlog",
                dueDate: null,
                progress: 0,
                isAssignedToCurrentUser: true,
            }
        );
    }, [task]);

    // ========================================================
    // STATE
    // ========================================================

    const [status, setStatus] = useState(
        initialTask.status || "Backlog"
    );

    const [progressNote, setProgressNote] =
        useState("");

    const [comment, setComment] =
        useState("");

    const [attachment, setAttachment] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ========================================================
    // VALIDATE TASK
    // ========================================================

    const validateTask = () => {
        if (!initialTask?.id) {
            setError(
                "Unable to update this task because the task ID is missing."
            );

            return false;
        }

        if (
            initialTask?.isAssignedToCurrentUser ===
            false
        ) {
            setError(
                "You cannot update this task."
            );

            return false;
        }

        if (
            CLOSED_STATUSES.includes(
                initialTask?.status
            )
        ) {
            setError(
                "This task cannot be modified."
            );

            return false;
        }

        return true;
    };

    // ========================================================
    // VALIDATE STATUS
    // ========================================================

    const validateStatus = () => {
        if (
            !ALLOWED_STATUSES.includes(
                status
            )
        ) {
            setError(
                "This status change is not allowed."
            );

            return false;
        }

        return true;
    };

    // ========================================================
    // HANDLE FILE
    // ========================================================

    const handleAttachmentChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            setAttachment(null);
            return;
        }

        setAttachment(file);
    };

    // ========================================================
    // SUBMIT STATUS UPDATE
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ----------------------------------------------------
        // Validate task
        // ----------------------------------------------------

        if (!validateTask()) {
            return;
        }

        // ----------------------------------------------------
        // Validate status
        // ----------------------------------------------------

        if (!validateStatus()) {
            return;
        }

        // ----------------------------------------------------
        // Prevent empty status
        // ----------------------------------------------------

        if (!status.trim()) {
            setError(
                "Please select a task status."
            );

            return;
        }

        try {
            setLoading(true);

            // =================================================
            // API CONNECTION WILL BE ADDED HERE
            // =================================================
            //
            // For now we prepare the exact payload required
            // by CONT-STAFF-002.
            //
            // Later this will be sent to your .NET backend.
            // =================================================

            const updateData = {
                taskId:
                    initialTask.id,

                status,

                progressNote:
                    progressNote.trim() ||
                    null,

                comment:
                    comment.trim() ||
                    null,

                attachment:
                    attachment || null,
            };

            console.log(
                "===================================="
            );

            console.log(
                "CONT-STAFF-002"
            );

            console.log(
                "UPDATE TASK STATUS"
            );

            console.log(
                "REQUEST:",
                updateData
            );

            console.log(
                "===================================="
            );

            // ------------------------------------------------
            // Temporary frontend simulation
            // ------------------------------------------------

            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        700
                    )
            );

            // ------------------------------------------------
            // Success
            // ------------------------------------------------

            setSuccess(
                "Task status updated successfully."
            );

            // ------------------------------------------------
            // Notify parent component
            // ------------------------------------------------

            if (typeof onUpdated === "function") {
                onUpdated({
                    ...initialTask,
                    status,
                    progressNote:
                        progressNote.trim(),
                    comment:
                        comment.trim(),
                    attachment,
                });
            }

        } catch (updateError) {
            console.error(
                "UPDATE TASK STATUS ERROR:",
                updateError
            );

            setError(
                "Unable to update task status. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // CLOSE
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
        <div className="w-full">
            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0b223f]
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-5
                        py-4
                        dark:border-slate-700
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <Clock3 className="h-5 w-5" />
                        </div>

                        <div>
                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Update Task Status
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                CONT-STAFF-002
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                rounded-lg
                                p-2
                                text-slate-500
                                hover:bg-slate-100
                                hover:text-slate-700
                                dark:hover:bg-slate-800
                                dark:hover:text-white
                            "
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* ==================================================
                    TASK INFORMATION
                ================================================== */}

                <div className="p-5">
                    <div
                        className="
                            mb-5
                            rounded-xl
                            bg-slate-50
                            p-4
                            dark:bg-[#081b33]
                        "
                    >
                        <div className="flex items-start gap-3">
                            <FileText
                                className="
                                    mt-1
                                    h-5
                                    w-5
                                    shrink-0
                                    text-blue-500
                                "
                            />

                            <div className="min-w-0">
                                <h4
                                    className="
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {initialTask.title}
                                </h4>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-600
                                        dark:text-slate-400
                                    "
                                >
                                    {
                                        initialTask.description
                                    }
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >
                            <InfoItem
                                label="Project"
                                value={
                                    initialTask.projectName
                                }
                            />

                            <InfoItem
                                label="Sprint"
                                value={
                                    initialTask.sprintName
                                }
                            />

                            <InfoItem
                                label="Priority"
                                value={
                                    initialTask.priority
                                }
                            />

                            <InfoItem
                                label="Current Status"
                                value={
                                    initialTask.status
                                }
                            />
                        </div>
                    </div>

                    {/* ==================================================
                        SUCCESS MESSAGE
                    ================================================== */}

                    {success && (
                        <div
                            className="
                                mb-5
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-green-200
                                bg-green-50
                                p-4
                                text-green-700
                                dark:border-green-900
                                dark:bg-green-950/30
                                dark:text-green-400
                            "
                        >
                            <CheckCircle2
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />

                            <p className="text-sm font-medium">
                                {success}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {error && (
                        <div
                            className="
                                mb-5
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                p-4
                                text-red-700
                                dark:border-red-900
                                dark:bg-red-950/30
                                dark:text-red-400
                            "
                        >
                            <CircleAlert
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />

                            <p className="whitespace-pre-line text-sm font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* ==================================================
                            STATUS
                        ================================================== */}

                        <div>
                            <label
                                htmlFor="task-status"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Task Status
                            </label>

                            <select
                                id="task-status"
                                value={status}
                                onChange={(event) => {
                                    setStatus(
                                        event.target.value
                                    );

                                    setError("");
                                    setSuccess("");
                                }}
                                disabled={
                                    loading
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                    dark:border-slate-600
                                    dark:bg-[#081b33]
                                    dark:text-white
                                "
                            >
                                {ALLOWED_STATUSES.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Select the appropriate
                                status for your assigned
                                task.
                            </p>
                        </div>

                        {/* ==================================================
                            PROGRESS NOTE
                        ================================================== */}

                        <div>
                            <label
                                htmlFor="progress-note"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Progress Note
                                <span
                                    className="
                                        ml-1
                                        font-normal
                                        text-slate-400
                                    "
                                >
                                    (Optional)
                                </span>
                            </label>

                            <textarea
                                id="progress-note"
                                value={
                                    progressNote
                                }
                                onChange={(event) =>
                                    setProgressNote(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    loading
                                }
                                rows={4}
                                placeholder="Describe the progress you have made..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                    dark:border-slate-600
                                    dark:bg-[#081b33]
                                    dark:text-white
                                "
                            />
                        </div>

                        {/* ==================================================
                            COMMENT
                        ================================================== */}

                        <div>
                            <label
                                htmlFor="task-comment"
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                <MessageSquare className="h-4 w-4" />

                                Comment

                                <span
                                    className="
                                        font-normal
                                        text-slate-400
                                    "
                                >
                                    (Optional)
                                </span>
                            </label>

                            <textarea
                                id="task-comment"
                                value={comment}
                                onChange={(event) =>
                                    setComment(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    loading
                                }
                                rows={4}
                                placeholder="Add a comment about this status update..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                    dark:border-slate-600
                                    dark:bg-[#081b33]
                                    dark:text-white
                                "
                            />
                        </div>

                        {/* ==================================================
                            ATTACHMENT
                        ================================================== */}

                        <div>
                            <label
                                htmlFor="task-attachment"
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                <Paperclip className="h-4 w-4" />

                                Attachment

                                <span
                                    className="
                                        font-normal
                                        text-slate-400
                                    "
                                >
                                    (Optional)
                                </span>
                            </label>

                            <input
                                id="task-attachment"
                                type="file"
                                onChange={
                                    handleAttachmentChange
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    block
                                    w-full
                                    cursor-pointer
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    text-sm
                                    text-slate-600
                                    file:mr-4
                                    file:border-0
                                    file:bg-slate-100
                                    file:px-4
                                    file:py-3
                                    file:text-sm
                                    file:font-medium
                                    dark:border-slate-600
                                    dark:bg-[#081b33]
                                    dark:text-slate-300
                                    dark:file:bg-slate-800
                                    dark:file:text-slate-200
                                "
                            />

                            {attachment && (
                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Selected:{" "}
                                    {
                                        attachment.name
                                    }
                                </p>
                            )}
                        </div>

                        {/* ==================================================
                            BUSINESS RULE
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-blue-200
                                bg-blue-50
                                p-4
                                dark:border-blue-900
                                dark:bg-blue-950/30
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    text-blue-700
                                    dark:text-blue-300
                                "
                            >
                                <strong>
                                    Staff workflow:
                                </strong>{" "}
                                You can update the
                                status and submit
                                your work for review.
                                Final approval is
                                handled by the Manager.
                            </p>
                        </div>

                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-3
                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            {onClose && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClose
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-300
                                        px-5
                                        py-3
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        transition
                                        hover:bg-slate-100
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                        dark:border-slate-600
                                        dark:text-slate-200
                                        dark:hover:bg-slate-800
                                    "
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Save className="h-4 w-4" />

                                {loading
                                    ? "Updating..."
                                    : "Update Status"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
    label,
    value,
}) {
    return (
        <div>
            <p
                className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    truncate
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                "
            >
                {value || "—"}
            </p>
        </div>
    );
}

export default UpdateTaskStatus;