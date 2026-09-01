import { useState } from "react";

import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    FileText,
    FolderKanban,
    GitBranch,
    Link2,
    MessageSquare,
    PlayCircle,
    Save,
    Upload,
    X,
} from "lucide-react";

import api from "@/services/api";

// ============================================================
// CONT-DEV-002
// PERFORM DEVELOPMENT TASK
// ============================================================

const INITIAL_TASK = {
    id: "",
    title: "",
    description: "",
    project: "",
    sprint: "",
    priority: "Medium",
    status: "Backlog",
    dueDate: "",
    progress: 0,
    dependencies: [],
    files: [],
    comments: [],
};



function PerformDevelopmentTask({
    task: taskFromParent = null,
    onTaskUpdated,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [task, setTask] = useState(
        taskFromParent || INITIAL_TASK
    );

    const [progress, setProgress] = useState(
        taskFromParent?.progress || 0
    );

    const [progressNote, setProgressNote] =
        useState("");

    const [workLink, setWorkLink] =
        useState("");

    const [selectedFiles, setSelectedFiles] =
        useState([]);

    const [newComment, setNewComment] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // UPDATE TASK FIELD
    // ========================================================

    function updateTask(field, value) {
        setTask((current) => ({
            ...current,
            [field]: value,
        }));
    }

    // ========================================================
    // START DEVELOPMENT
    // ========================================================

    async function handleStartDevelopment() {
        setErrorMessage("");
        setSuccessMessage("");

        if (!task.id) {
            setErrorMessage(
                "Task information is not available."
            );

            return;
        }

        try {
            setSaving(true);

            // ------------------------------------------------
            // Update task status to In Progress.
            // ------------------------------------------------

            await api.put(
                `/Tasks/${task.id}/status`,
                {
                    status: "In Progress",
                    progress: Math.max(
                        progress,
                        1
                    ),
                    progressNote:
                        progressNote.trim() ||
                        "Development work started.",
                }
            );

            updateTask(
                "status",
                "In Progress"
            );

            setProgress(
                Math.max(progress, 1)
            );

            setSuccessMessage(
                "Development work started successfully."
            );

            if (onTaskUpdated) {
                onTaskUpdated({
                    ...task,
                    status: "In Progress",
                    progress: Math.max(
                        progress,
                        1
                    ),
                });
            }
        } catch (error) {
            console.error(
                "Unable to start development:",
                error
            );

            const status =
                error?.response?.status;

            if (status === 403) {
                setErrorMessage(
                    "You cannot update this task."
                );
            } else if (status === 409) {
                setErrorMessage(
                    "This status transition is not allowed."
                );
            } else if (status === 404) {
                setErrorMessage(
                    "Task not found."
                );
            } else {
                setErrorMessage(
                    "Unable to update task status. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    // ========================================================
    // SAVE DEVELOPMENT PROGRESS
    // ========================================================

    async function handleSaveProgress() {
        setErrorMessage("");
        setSuccessMessage("");

        if (!task.id) {
            setErrorMessage(
                "Task information is not available."
            );

            return;
        }

        if (
            progress < 0 ||
            progress > 100
        ) {
            setErrorMessage(
                "Progress must be between 0 and 100."
            );

            return;
        }

        try {
            setSaving(true);

            await api.put(
                `/Tasks/${task.id}/progress`,
                {
                    progress,
                    progressNote:
                        progressNote.trim(),
                }
            );

            updateTask(
                "progress",
                progress
            );

            setSuccessMessage(
                "Development progress saved successfully."
            );

            if (onTaskUpdated) {
                onTaskUpdated({
                    ...task,
                    progress,
                });
            }
        } catch (error) {
            console.error(
                "Unable to save development progress:",
                error
            );

            setErrorMessage(
                "Unable to save development progress. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    // ========================================================
    // ADD COMMENT
    // ========================================================

    async function handleAddComment() {
        setErrorMessage("");
        setSuccessMessage("");

        if (!newComment.trim()) {
            setErrorMessage(
                "Comment cannot be empty."
            );

            return;
        }

        if (!task.id) {
            setErrorMessage(
                "Task information is not available."
            );

            return;
        }

        try {
            setSaving(true);

            const response =
                await api.post(
                    `/Tasks/${task.id}/comments`,
                    {
                        content:
                            newComment.trim(),
                    }
                );

            const createdComment =
                response?.data || {
                    content:
                        newComment.trim(),
                };

            setTask((current) => ({
                ...current,
                comments: [
                    ...(current.comments || []),
                    createdComment,
                ],
            }));

            setNewComment("");

            setSuccessMessage(
                "Technical comment added successfully."
            );
        } catch (error) {
            console.error(
                "Unable to add comment:",
                error
            );

            if (
                error?.response?.status ===
                403
            ) {
                setErrorMessage(
                    "Access denied."
                );
            } else {
                setErrorMessage(
                    "Unable to add comment. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    // ========================================================
    // FILE SELECTION
    // ========================================================

    function handleFileSelection(event) {
        const files =
            Array.from(
                event.target.files || []
            );

        setSelectedFiles(files);
    }

    // ========================================================
    // ATTACH FILES
    // ========================================================

    async function handleUploadFiles() {
        setErrorMessage("");
        setSuccessMessage("");

        if (
            selectedFiles.length ===
            0
        ) {
            setErrorMessage(
                "Please select at least one file."
            );

            return;
        }

        if (!task.id) {
            setErrorMessage(
                "Task information is not available."
            );

            return;
        }

        try {
            setSaving(true);

            const formData =
                new FormData();

            selectedFiles.forEach(
                (file) => {
                    formData.append(
                        "files",
                        file
                    );
                }
            );

            await api.post(
                `/Tasks/${task.id}/files`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            setSelectedFiles([]);

            setSuccessMessage(
                "Development files uploaded successfully."
            );
        } catch (error) {
            console.error(
                "Unable to upload files:",
                error
            );

            if (
                error?.response?.status ===
                403
            ) {
                setErrorMessage(
                    "You do not have permission to upload files."
                );
            } else {
                setErrorMessage(
                    "Unable to upload files. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    // ========================================================
    // SAVE WORK LINK
    // ========================================================

    async function handleSaveWorkLink() {
        setErrorMessage("");
        setSuccessMessage("");

        if (!workLink.trim()) {
            setErrorMessage(
                "Please provide a development work link."
            );

            return;
        }

        if (!task.id) {
            setErrorMessage(
                "Task information is not available."
            );

            return;
        }

        try {
            setSaving(true);

            await api.post(
                `/Tasks/${task.id}/links`,
                {
                    url: workLink.trim(),
                }
            );

            setWorkLink("");

            setSuccessMessage(
                "Development work link saved successfully."
            );
        } catch (error) {
            console.error(
                "Unable to save work link:",
                error
            );

            setErrorMessage(
                "Unable to save development work link. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    // ========================================================
    // MOVE TASK TO REVIEW
    // ========================================================

    async function handleMoveToReview() {
        setErrorMessage("");
        setSuccessMessage("");

        if (!task.id) {
            setErrorMessage(
                "Task information is not available."
            );

            return;
        }

        if (progress < 100) {
            setErrorMessage(
                "Complete the development work before moving the task to Review."
            );

            return;
        }

        try {
            setSaving(true);

            await api.put(
                `/Tasks/${task.id}/status`,
                {
                    status: "Review",
                    progress: 100,
                    progressNote:
                        progressNote.trim() ||
                        "Development work completed and ready for review.",
                }
            );

            const updatedTask = {
                ...task,
                status: "Review",
                progress: 100,
            };

            setTask(updatedTask);
            setProgress(100);

            setSuccessMessage(
                "Development work is ready for review."
            );

            if (onTaskUpdated) {
                onTaskUpdated(
                    updatedTask
                );
            }
        } catch (error) {
            console.error(
                "Unable to move task to review:",
                error
            );

            const status =
                error?.response?.status;

            if (status === 403) {
                setErrorMessage(
                    "You cannot update this task."
                );
            } else if (status === 409) {
                setErrorMessage(
                    "This status transition is not allowed."
                );
            } else {
                setErrorMessage(
                    "Unable to update task status. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    // ========================================================
    // STATUS CLASS
    // ========================================================

    function getStatusClass(status) {
        switch (status) {
            case "In Progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400";

            case "Review":
                return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400";

            case "Blocked":
                return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";

            case "Done":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";

            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div>
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-100
                                    text-blue-600
                                    dark:bg-blue-950/60
                                    dark:text-blue-400
                                "
                            >
                                <PlayCircle className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                    CONT-DEV-002
                                </p>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Perform Development Task
                                </h2>
                            </div>
                        </div>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Perform the assigned technical work,
                            record development progress, communicate
                            issues, attach work, and prepare the
                            task for review.
                        </p>
                    </div>

                    <span
                        className={`
                            inline-flex
                            w-fit
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            ${getStatusClass(
                                task.status
                            )}
                        `}
                    >
                        {task.status}
                    </span>
                </div>
            </div>

            {/* ==================================================
                SUCCESS / ERROR
            ================================================== */}

            {successMessage && (
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-4
                        py-3
                        text-sm
                        text-emerald-700
                        dark:border-emerald-900/50
                        dark:bg-emerald-950/20
                        dark:text-emerald-400
                    "
                >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />

                    <span>
                        {successMessage}
                    </span>
                </div>
            )}

            {errorMessage && (
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                        dark:border-red-900/50
                        dark:bg-red-950/20
                        dark:text-red-400
                    "
                >
                    <AlertCircle className="h-5 w-5 shrink-0" />

                    <span>
                        {errorMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                TASK INFORMATION
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-blue-500" />

                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Development Task
                    </h3>
                </div>

                <div className="mt-5">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {task.title ||
                            "No task selected"}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {task.description ||
                            "Task description will appear here."}
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <TaskInfo
                        icon={
                            <FolderKanban className="h-4 w-4" />
                        }
                        label="Project"
                        value={
                            task.project ||
                            "Not available"
                        }
                    />

                    <TaskInfo
                        icon={
                            <GitBranch className="h-4 w-4" />
                        }
                        label="Sprint"
                        value={
                            task.sprint ||
                            "Not available"
                        }
                    />

                    <TaskInfo
                        icon={
                            <AlertCircle className="h-4 w-4" />
                        }
                        label="Priority"
                        value={
                            task.priority ||
                            "Medium"
                        }
                    />

                    <TaskInfo
                        icon={
                            <CalendarDays className="h-4 w-4" />
                        }
                        label="Due Date"
                        value={
                            task.dueDate
                                ? new Date(
                                      task.dueDate
                                  ).toLocaleDateString()
                                : "No due date"
                        }
                    />

                </div>
            </section>

            {/* ==================================================
                REQUIREMENTS
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <h3 className="font-semibold text-slate-900 dark:text-white">
                    Development Requirements
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Review the assigned task requirements,
                    project context, sprint information,
                    dependencies, files, and comments before
                    beginning implementation.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                    <RequirementCard
                        title="Dependencies"
                        icon={
                            <GitBranch className="h-5 w-5" />
                        }
                        items={
                            task.dependencies
                        }
                        emptyText="No dependencies recorded."
                    />

                    <RequirementCard
                        title="Related Files"
                        icon={
                            <FileText className="h-5 w-5" />
                        }
                        items={
                            task.files
                        }
                        emptyText="No related files available."
                    />

                </div>
            </section>

            {/* ==================================================
                START DEVELOPMENT
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-6
                    dark:border-blue-900/50
                    dark:bg-blue-950/20
                "
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Start Development
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            When you begin technical work,
                            move the task to In Progress.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleStartDevelopment
                        }
                        disabled={
                            saving ||
                            task.status ===
                                "In Progress"
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
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <PlayCircle className="h-4 w-4" />

                        {task.status ===
                        "In Progress"
                            ? "Development Started"
                            : "Start Development"}
                    </button>
                </div>
            </section>

            {/* ==================================================
                PROGRESS
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Development Progress
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Record the current technical work progress.
                        </p>
                    </div>

                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {progress}%
                    </span>
                </div>

                <div className="mt-5">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(event) =>
                            setProgress(
                                Number(
                                    event.target
                                        .value
                                )
                            )
                        }
                        className="w-full accent-blue-600"
                    />

                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="mt-5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Progress Note
                    </label>

                    <textarea
                        value={progressNote}
                        onChange={(event) =>
                            setProgressNote(
                                event.target.value
                            )
                        }
                        rows={4}
                        placeholder="Describe what you have completed, what remains, or any technical progress..."
                        className="
                            mt-2
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                            dark:border-slate-700
                            dark:bg-[#081b33]
                            dark:text-white
                        "
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={
                            handleSaveProgress
                        }
                        disabled={saving}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-slate-900
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-slate-800
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:bg-white
                            dark:text-slate-900
                        "
                    >
                        <Save className="h-4 w-4" />

                        Save Progress
                    </button>
                </div>
            </section>

            {/* ==================================================
                DEVELOPMENT LINKS
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-blue-500" />

                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Development Work Link
                    </h3>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Add a repository, deployment, design,
                    documentation, or other relevant technical link.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="url"
                        value={workLink}
                        onChange={(event) =>
                            setWorkLink(
                                event.target.value
                            )
                        }
                        placeholder="https://github.com/..."
                        className="
                            flex-1
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-2.5
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                            dark:border-slate-700
                            dark:bg-[#081b33]
                            dark:text-white
                        "
                    />

                    <button
                        type="button"
                        onClick={
                            handleSaveWorkLink
                        }
                        disabled={saving}
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
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <Link2 className="h-4 w-4" />

                        Add Link
                    </button>
                </div>
            </section>

            {/* ==================================================
                FILES
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500" />

                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Development Files
                    </h3>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Attach required technical files to the task.
                </p>

                <div className="mt-4">
                    <label
                        className="
                            flex
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border-2
                            border-dashed
                            border-slate-200
                            bg-slate-50
                            px-6
                            py-8
                            text-center
                            transition
                            hover:border-blue-400
                            hover:bg-blue-50
                            dark:border-slate-700
                            dark:bg-[#081b33]
                            dark:hover:border-blue-700
                            dark:hover:bg-blue-950/20
                        "
                    >
                        <Upload className="h-8 w-8 text-slate-400" />

                        <span className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Select development files
                        </span>

                        <span className="mt-1 text-xs text-slate-400">
                            Upload source files, reports,
                            documentation, or other work.
                        </span>

                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={
                                handleFileSelection
                            }
                        />
                    </label>
                </div>

                {selectedFiles.length >
                    0 && (
                    <div className="mt-4 space-y-2">
                        {selectedFiles.map(
                            (file) => (
                                <div
                                    key={`${file.name}-${file.size}`}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        rounded-lg
                                        bg-slate-50
                                        px-3
                                        py-2
                                        dark:bg-[#081b33]
                                    "
                                >
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileText className="h-4 w-4 shrink-0 text-blue-500" />

                                        <span className="truncate text-sm text-slate-700 dark:text-slate-300">
                                            {file.name}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedFiles(
                                                (
                                                    current
                                                ) =>
                                                    current.filter(
                                                        (
                                                            item
                                                        ) =>
                                                            item !==
                                                            file
                                                    )
                                            )
                                        }
                                        className="text-slate-400 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        )}

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={
                                    handleUploadFiles
                                }
                                disabled={
                                    saving
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Upload className="h-4 w-4" />

                                Upload Files
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* ==================================================
                COMMENTS
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />

                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Development Communication
                    </h3>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Communicate technical issues, implementation
                    details, decisions, and progress through task
                    comments.
                </p>

                {task.comments?.length >
                    0 && (
                    <div className="mt-5 space-y-3">
                        {task.comments.map(
                            (
                                comment,
                                index
                            ) => (
                                <div
                                    key={
                                        comment?.id ??
                                        index
                                    }
                                    className="
                                        rounded-xl
                                        bg-slate-50
                                        p-4
                                        dark:bg-[#081b33]
                                    "
                                >
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {comment?.content ??
                                            comment?.text ??
                                            comment?.comment ??
                                            "Comment"}
                                    </p>

                                    <p className="mt-2 text-xs text-slate-400">
                                        {comment?.authorName ??
                                            comment?.createdBy ??
                                            "Team member"}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}

                <div className="mt-5">
                    <textarea
                        value={newComment}
                        onChange={(event) =>
                            setNewComment(
                                event.target.value
                            )
                        }
                        rows={4}
                        placeholder="Add a technical comment..."
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                            dark:border-slate-700
                            dark:bg-[#081b33]
                            dark:text-white
                        "
                    />
                </div>

                <div className="mt-3 flex justify-end">
                    <button
                        type="button"
                        onClick={
                            handleAddComment
                        }
                        disabled={saving}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-slate-900
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-slate-800
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:bg-white
                            dark:text-slate-900
                        "
                    >
                        <MessageSquare className="h-4 w-4" />

                        Add Comment
                    </button>
                </div>
            </section>

            {/* ==================================================
                SUBMIT FOR REVIEW
            ================================================== */}

            <section
                className="
                    rounded-2xl
                    border
                    border-purple-200
                    bg-purple-50
                    p-6
                    dark:border-purple-900/50
                    dark:bg-purple-950/20
                "
            >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />

                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Development Work Completed
                            </h3>
                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            When the development work is complete,
                            submit the task for review. The Developer
                            does not approve their own work.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleMoveToReview
                        }
                        disabled={
                            saving ||
                            progress < 100 ||
                            task.status ===
                                "Review" ||
                            task.status ===
                                "Done"
                        }
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-purple-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-purple-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <CheckCircle2 className="h-4 w-4" />

                        {task.status ===
                        "Review"
                            ? "Ready for Review"
                            : "Move to Review"}
                    </button>
                </div>
            </section>
        </div>
    );
}

// ============================================================
// TASK INFO
// ============================================================

function TaskInfo({
    icon,
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-xl
                bg-slate-50
                p-4
                dark:bg-[#081b33]
            "
        >
            <div className="flex items-center gap-2 text-slate-400">
                {icon}

                <span className="text-xs">
                    {label}
                </span>
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {value}
            </p>
        </div>
    );
}

// ============================================================
// REQUIREMENT CARD
// ============================================================

function RequirementCard({
    title,
    icon,
    items,
    emptyText,
}) {
    const list =
        Array.isArray(items)
            ? items
            : [];

    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                p-4
                dark:border-slate-700
            "
        >
            <div className="flex items-center gap-2">
                <span className="text-blue-500">
                    {icon}
                </span>

                <h4 className="font-medium text-slate-900 dark:text-white">
                    {title}
                </h4>
            </div>

            {list.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">
                    {emptyText}
                </p>
            ) : (
                <div className="mt-3 space-y-2">
                    {list.map(
                        (
                            item,
                            index
                        ) => (
                            <div
                                key={
                                    item?.id ??
                                    item?.taskId ??
                                    item?.fileId ??
                                    index
                                }
                                className="
                                    rounded-lg
                                    bg-slate-50
                                    px-3
                                    py-2
                                    text-sm
                                    text-slate-700
                                    dark:bg-[#081b33]
                                    dark:text-slate-300
                                "
                            >
                                {item?.title ??
                                    item?.name ??
                                    item?.fileName ??
                                    item?.taskTitle ??
                                    `Item ${index + 1}`}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default PerformDevelopmentTask;