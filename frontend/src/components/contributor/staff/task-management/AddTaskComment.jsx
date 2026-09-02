import { useMemo, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    FileText,
    MessageSquare,
    Paperclip,
    Send,
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// CONT-STAFF-003
// ADD TASK COMMENT
// ============================================================
//
// Staff can communicate questions, updates, and feedback
// through task discussions.
//
// Staff can:
// - View previous comments
// - Add a comment
// - Mention team members
// - Attach a file
// - Provide progress information
//
// Business rule:
// Staff can communicate about the task but does not receive
// management or approval authority.
// ============================================================

function AddTaskComment({
    task = null,
    comments: initialComments = [],
    onCommentAdded,
    onClose,
}) {
    // ========================================================
    // FALLBACK TASK
    // ========================================================

    const currentTask = useMemo(() => {
        return (
            task || {
                id: null,
                title: "Assigned Task",
                description:
                    "Task discussion and communication.",
                projectName:
                    "No project selected",
                status: "In Progress",
            }
        );
    }, [task]);

    // ========================================================
    // STATE
    // ========================================================

    const [comment, setComment] =
        useState("");

    const [progressInformation, setProgressInformation] =
        useState("");

    const [attachment, setAttachment] =
        useState(null);

    const [mention, setMention] =
        useState("");

    const [comments, setComments] =
        useState(initialComments);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ========================================================
    // HANDLE FILE
    // ========================================================

    const handleFileChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            setAttachment(null);
            return;
        }

        setAttachment(file);

        setError("");
        setSuccess("");
    };

    // ========================================================
    // REMOVE FILE
    // ========================================================

    const removeAttachment = () => {
        setAttachment(null);
    };

    // ========================================================
    // VALIDATE COMMENT
    // ========================================================

    const validateComment = () => {
        // ----------------------------------------------------
        // Task must exist
        // ----------------------------------------------------

        if (!currentTask?.id) {
            setError(
                "Task not found."
            );

            return false;
        }

        // ----------------------------------------------------
        // Comment cannot be empty
        // ----------------------------------------------------

        if (
            !comment.trim()
        ) {
            setError(
                "Comment cannot be empty."
            );

            return false;
        }

        // ----------------------------------------------------
        // Comment length
        // ----------------------------------------------------

        if (
            comment.trim().length >
            5000
        ) {
            setError(
                "Comment cannot exceed 5000 characters."
            );

            return false;
        }

        return true;
    };

    // ========================================================
    // SUBMIT COMMENT
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ----------------------------------------------------
        // Validate
        // ----------------------------------------------------

        if (!validateComment()) {
            return;
        }

        try {
            setLoading(true);

            // =================================================
            // COMMENT DATA
            // =================================================

            const commentData = {
                taskId:
                    currentTask.id,

                comment:
                    comment.trim(),

                mention:
                    mention.trim() ||
                    null,

                progressInformation:
                    progressInformation.trim() ||
                    null,

                attachment:
                    attachment || null,
            };

            console.log(
                "===================================="
            );

            console.log(
                "CONT-STAFF-003"
            );

            console.log(
                "ADD TASK COMMENT"
            );

            console.log(
                "REQUEST:",
                commentData
            );

            console.log(
                "===================================="
            );

            // =================================================
            // TEMPORARY FRONTEND SIMULATION
            // =================================================
            //
            // Backend connection will be added after we verify
            // the frontend behavior and confirm your existing
            // .NET comment endpoint.
            // =================================================

            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        700
                    )
            );

            // =================================================
            // CREATE NEW COMMENT
            // =================================================

            const newComment = {
                id:
                    `temp-${Date.now()}`,

                taskId:
                    currentTask.id,

                comment:
                    comment.trim(),

                mention:
                    mention.trim() ||
                    null,

                progressInformation:
                    progressInformation.trim() ||
                    null,

                attachmentName:
                    attachment?.name ||
                    null,

                createdAt:
                    new Date().toISOString(),

                author:
                    "Current Staff",
            };

            // =================================================
            // UPDATE COMMENT HISTORY
            // =================================================

            setComments(
                (previousComments) => [
                    ...previousComments,
                    newComment,
                ]
            );

            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                "Comment added successfully."
            );

            // =================================================
            // CLEAR FORM
            // =================================================

            setComment("");
            setMention("");
            setProgressInformation("");
            setAttachment(null);

            // =================================================
            // NOTIFY PARENT
            // =================================================

            if (
                typeof onCommentAdded ===
                "function"
            ) {
                onCommentAdded(
                    newComment
                );
            }
        } catch (commentError) {
            console.error(
                "ADD TASK COMMENT ERROR:",
                commentError
            );

            setError(
                "Unable to add comment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (
            typeof onClose ===
            "function"
        ) {
            onClose();
        }
    };

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (
        date
    ) => {
        if (!date) {
            return "";
        }

        try {
            return new Date(
                date
            ).toLocaleString();
        } catch {
            return "";
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
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <MessageSquare
                                className="h-5 w-5"
                            />
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
                                Add Task Comment
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                CONT-STAFF-003
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            className="
                                rounded-lg
                                p-2
                                text-slate-500
                                transition
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

                <div className="p-5">
                    {/* ==================================================
                        TASK INFORMATION
                    ================================================== */}

                    <div
                        className="
                            mb-6
                            rounded-xl
                            bg-slate-50
                            p-4
                            dark:bg-[#081b33]
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >
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
                                    {
                                        currentTask.title
                                    }
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
                                        currentTask.description
                                    }
                                </p>

                                <div
                                    className="
                                        mt-3
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >
                                    <span
                                        className="
                                            rounded-full
                                            bg-blue-100
                                            px-3
                                            py-1
                                            text-xs
                                            font-medium
                                            text-blue-700
                                            dark:bg-blue-950
                                            dark:text-blue-300
                                        "
                                    >
                                        Project:{" "}
                                        {
                                            currentTask.projectName
                                        }
                                    </span>

                                    <span
                                        className="
                                            rounded-full
                                            bg-slate-200
                                            px-3
                                            py-1
                                            text-xs
                                            font-medium
                                            text-slate-700
                                            dark:bg-slate-800
                                            dark:text-slate-300
                                        "
                                    >
                                        Status:{" "}
                                        {
                                            currentTask.status
                                        }
                                    </span>
                                </div>
                            </div>
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

                            <p
                                className="
                                    text-sm
                                    font-medium
                                "
                            >
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
                            <AlertCircle
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />

                            <p className="text-sm font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        PREVIOUS COMMENTS
                    ================================================== */}

                    <section className="mb-6">
                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <MessageSquare
                                    className="
                                        h-5
                                        w-5
                                        text-blue-500
                                    "
                                />

                                <h4
                                    className="
                                        text-base
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Discussion
                                </h4>
                            </div>

                            <span
                                className="
                                    rounded-full
                                    bg-slate-100
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    dark:bg-slate-800
                                    dark:text-slate-300
                                "
                            >
                                {
                                    comments.length
                                }{" "}
                                comment
                                {comments.length ===
                                1
                                    ? ""
                                    : "s"}
                            </span>
                        </div>

                        {comments.length ===
                        0 ? (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    p-6
                                    text-center
                                    dark:border-slate-700
                                "
                            >
                                <MessageSquare
                                    className="
                                        mx-auto
                                        mb-2
                                        h-8
                                        w-8
                                        text-slate-400
                                    "
                                />

                                <p
                                    className="
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    No comments yet.
                                    Start the
                                    discussion below.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {comments.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                item.id ??
                                                index
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                p-4
                                                dark:border-slate-700
                                                dark:bg-[#081b33]
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-blue-100
                                                        text-blue-600
                                                        dark:bg-blue-950
                                                        dark:text-blue-400
                                                    "
                                                >
                                                    <UserRound
                                                        className="h-4 w-4"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            justify-between
                                                            gap-2
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                text-sm
                                                                font-semibold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            {item.author ||
                                                                "Staff"}
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-slate-400
                                                            "
                                                        >
                                                            {formatDate(
                                                                item.createdAt
                                                            )}
                                                        </p>
                                                    </div>

                                                    <p
                                                        className="
                                                            mt-2
                                                            whitespace-pre-wrap
                                                            text-sm
                                                            text-slate-700
                                                            dark:text-slate-300
                                                        "
                                                    >
                                                        {
                                                            item.comment
                                                        }
                                                    </p>

                                                    {item.mention && (
                                                        <p
                                                            className="
                                                                mt-2
                                                                text-xs
                                                                text-blue-600
                                                                dark:text-blue-400
                                                            "
                                                        >
                                                            Mentioned:{" "}
                                                            {
                                                                item.mention
                                                            }
                                                        </p>
                                                    )}

                                                    {item.progressInformation && (
                                                        <div
                                                            className="
                                                                mt-3
                                                                rounded-lg
                                                                bg-blue-50
                                                                p-3
                                                                dark:bg-blue-950/30
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    font-semibold
                                                                    text-blue-700
                                                                    dark:text-blue-300
                                                                "
                                                            >
                                                                Progress
                                                                Information
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-sm
                                                                    text-blue-700
                                                                    dark:text-blue-300
                                                                "
                                                            >
                                                                {
                                                                    item.progressInformation
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {item.attachmentName && (
                                                        <div
                                                            className="
                                                                mt-3
                                                                flex
                                                                items-center
                                                                gap-2
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            <Paperclip className="h-4 w-4" />

                                                            {
                                                                item.attachmentName
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </section>

                    {/* ==================================================
                        ADD COMMENT FORM
                    ================================================== */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="
                            space-y-5
                            border-t
                            border-slate-200
                            pt-6
                            dark:border-slate-700
                        "
                    >
                        {/* ==================================================
                            COMMENT
                        ================================================== */}

                        <div>
                            <label
                                htmlFor="staff-comment"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Comment
                            </label>

                            <textarea
                                id="staff-comment"
                                value={comment}
                                onChange={(
                                    event
                                ) => {
                                    setComment(
                                        event.target.value
                                    );

                                    setError("");
                                    setSuccess("");
                                }}
                                disabled={
                                    loading
                                }
                                rows={5}
                                placeholder="Write your question, update, or feedback..."
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

                            <div
                                className="
                                    mt-1
                                    flex
                                    justify-end
                                "
                            >
                                <span
                                    className="
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    {
                                        comment.length
                                    }{" "}
                                    / 5000
                                </span>
                            </div>
                        </div>

                        {/* ==================================================
                            MENTION
                        ================================================== */}

                        <div>
                            <label
                                htmlFor="staff-mention"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Mention Team Member
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

                            <input
                                id="staff-mention"
                                type="text"
                                value={mention}
                                onChange={(
                                    event
                                ) =>
                                    setMention(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    loading
                                }
                                placeholder="@TeamMember"
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
                            PROGRESS INFORMATION
                        ================================================== */}

                        <div>
                            <label
                                htmlFor="progress-information"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Progress Information
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
                                id="progress-information"
                                value={
                                    progressInformation
                                }
                                onChange={(
                                    event
                                ) =>
                                    setProgressInformation(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    loading
                                }
                                rows={3}
                                placeholder="Describe your current progress..."
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
                                htmlFor="comment-attachment"
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

                                Attach File

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
                                id="comment-attachment"
                                type="file"
                                onChange={
                                    handleFileChange
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
                                <div
                                    className="
                                        mt-2
                                        flex
                                        items-center
                                        justify-between
                                        rounded-lg
                                        bg-slate-50
                                        px-3
                                        py-2
                                        dark:bg-slate-800
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <Paperclip
                                            className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-slate-400
                                            "
                                        />

                                        <span
                                            className="
                                                truncate
                                                text-xs
                                                text-slate-600
                                                dark:text-slate-300
                                            "
                                        >
                                            {
                                                attachment.name
                                            }
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            removeAttachment
                                        }
                                        className="
                                            ml-3
                                            rounded-md
                                            p-1
                                            text-slate-400
                                            hover:bg-slate-200
                                            hover:text-red-500
                                            dark:hover:bg-slate-700
                                        "
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
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
                                    Staff communication:
                                </strong>{" "}
                                Comments are used to
                                communicate questions,
                                progress, updates, and
                                feedback with authorized
                                project team members.
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
                                <Send className="h-4 w-4" />

                                {loading
                                    ? "Posting..."
                                    : "Post Comment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddTaskComment;