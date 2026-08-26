
import { useState } from "react";
import {
    CheckCircle2,
    AlertCircle,
    FileUp,
    Link2,
    Send,
    ClipboardCheck,
    FileText,
    X,
} from "lucide-react";

// ============================================================
// SAMPLE DEVELOPMENT TASKS
// Backend API will replace this data later.
// ============================================================

const DEVELOPMENT_TASKS = [
    {
        id: 1,
        title: "Implement Authentication API",
        project: "AI-PMS",
        status: "In Progress",
        requirements:
            "Complete login authentication, token generation, and validation.",
        requiredFiles: true,
    },
    {
        id: 2,
        title: "Build Project Dashboard",
        project: "AI-PMS",
        status: "In Progress",
        requirements:
            "Complete the contributor project dashboard and responsive layout.",
        requiredFiles: false,
    },
];

// ============================================================
// COMPONENT
// ============================================================

function SubmitDevelopmentWork() {
    const [taskId, setTaskId] = useState("");

    const [workSummary, setWorkSummary] =
        useState("");

    const [workLink, setWorkLink] =
        useState("");

    const [files, setFiles] = useState([]);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    // ========================================================
    // SELECTED TASK
    // ========================================================

    const selectedTask =
        DEVELOPMENT_TASKS.find(
            (task) =>
                String(task.id) === String(taskId)
        );

    // ========================================================
    // FILE VALIDATION
    // ========================================================

    const handleFileChange = (event) => {
        setErrorMessage("");
        setSuccessMessage("");

        const selectedFiles = Array.from(
            event.target.files || []
        );

        if (selectedFiles.length === 0) {
            return;
        }

        // ----------------------------------------------------
        // Maximum file size: 10 MB per file
        // ----------------------------------------------------

        const maxSize = 10 * 1024 * 1024;

        const oversizedFile =
            selectedFiles.find(
                (file) => file.size > maxSize
            );

        if (oversizedFile) {
            setErrorMessage(
                `File "${oversizedFile.name}" exceeds the 10 MB limit.`
            );

            event.target.value = "";

            return;
        }

        setFiles(selectedFiles);

        event.target.value = "";
    };

    // ========================================================
    // REMOVE FILE
    // ========================================================

    const handleRemoveFile = (index) => {
        setFiles((currentFiles) =>
            currentFiles.filter(
                (_, fileIndex) =>
                    fileIndex !== index
            )
        );
    };

    // ========================================================
    // SUBMIT DEVELOPMENT WORK
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        // ----------------------------------------------------
        // Validate task
        // ----------------------------------------------------

        if (!taskId) {
            setErrorMessage(
                "Please select a development task."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate task status
        // ----------------------------------------------------

        if (
            selectedTask?.status === "Done" ||
            selectedTask?.status === "Closed"
        ) {
            setErrorMessage(
                "This task cannot be submitted."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate work summary
        // ----------------------------------------------------

        if (!workSummary.trim()) {
            setErrorMessage(
                "Please provide a work summary."
            );

            return;
        }

        // ----------------------------------------------------
        // Required files validation
        // ----------------------------------------------------

        if (
            selectedTask?.requiredFiles &&
            files.length === 0 &&
            !workLink.trim()
        ) {
            setErrorMessage(
                "Please provide the required development files or a work link."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate URL if provided
        // ----------------------------------------------------

        if (workLink.trim()) {
            try {
                new URL(workLink.trim());
            } catch {
                setErrorMessage(
                    "Please provide a valid work link."
                );

                return;
            }
        }

        try {
            setSubmitting(true);

            // ------------------------------------------------
            // Frontend demonstration.
            // Backend API will be connected later.
            // ------------------------------------------------

            const submissionData = {
                taskId,
                taskTitle: selectedTask?.title,
                project: selectedTask?.project,
                workSummary:
                    workSummary.trim(),
                workLink:
                    workLink.trim() || null,
                files: files.map(
                    (file) => ({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                    })
                ),
                status: "Review",
                submittedAt:
                    new Date().toISOString(),
            };

            console.log(
                "DEVELOPMENT WORK SUBMISSION:",
                submissionData
            );

            // Simulate backend request
            await new Promise((resolve) =>
                setTimeout(resolve, 700)
            );

            setSuccessMessage(
                "Development work submitted for review."
            );

            // ------------------------------------------------
            // Reset form
            // ------------------------------------------------

            setTaskId("");
            setWorkSummary("");
            setWorkLink("");
            setFiles([]);
        } catch (error) {
            console.error(
                "Development work submission failed:",
                error
            );

            setErrorMessage(
                "Unable to submit development work. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <ClipboardCheck size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Submit Development Work
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Submit completed technical work
                            for review by the appropriate
                            reviewer or Manager.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
                    <CheckCircle2 size={20} />

                    <span className="text-sm font-medium">
                        {successMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {errorMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                    <AlertCircle size={20} />

                    <span className="text-sm font-medium">
                        {errorMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]"
            >
                {/* ==================================================
                    TASK
                ================================================== */}

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Development Task
                    </label>

                    <select
                        value={taskId}
                        onChange={(event) => {
                            setTaskId(
                                event.target.value
                            );
                            setErrorMessage("");
                            setSuccessMessage("");
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    >
                        <option value="">
                            Select a completed development task
                        </option>

                        {DEVELOPMENT_TASKS.map(
                            (task) => (
                                <option
                                    key={task.id}
                                    value={task.id}
                                >
                                    {task.title} —{" "}
                                    {task.project}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* ==================================================
                    TASK INFORMATION
                ================================================== */}

                {selectedTask && (
                    <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#081b33]">
                        <div className="mb-4 flex items-center gap-3">
                            <FileText
                                size={20}
                                className="text-blue-600 dark:text-blue-400"
                            />

                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">
                                    Task Requirements
                                </h2>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Review the requirements
                                    before submitting.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Project
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                    {selectedTask.project}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Current Status
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                    {selectedTask.status}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Requirements
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                {selectedTask.requirements}
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    WORK SUMMARY
                ================================================== */}

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Work Summary
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <textarea
                        value={workSummary}
                        onChange={(event) =>
                            setWorkSummary(
                                event.target.value
                            )
                        }
                        rows={7}
                        placeholder="Describe the development work you completed..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    />
                </div>

                {/* ==================================================
                    FILE UPLOAD
                ================================================== */}

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Technical Files
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-[#081b33] dark:hover:border-emerald-600">
                        <FileUp
                            size={30}
                            className="mb-3 text-slate-400"
                        />

                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Click to upload development
                            files
                        </span>

                        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Maximum 10 MB per file
                        </span>

                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* ==================================================
                    SELECTED FILES
                ================================================== */}

                {files.length > 0 && (
                    <div className="mb-6 space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Selected Files
                        </p>

                        {files.map(
                            (file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-[#081b33]"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                            {file.name}
                                        </p>

                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {(
                                                file.size /
                                                1024 /
                                                1024
                                            ).toFixed(
                                                2
                                            )}{" "}
                                            MB
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFile(
                                                index
                                            )
                                        }
                                        className="ml-4 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                                        title="Remove file"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* ==================================================
                    WORK LINK
                ================================================== */}

                <div className="mb-6">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Link2 size={17} />

                        Work Link
                        <span className="text-xs font-normal text-slate-400">
                            (optional)
                        </span>
                    </label>

                    <input
                        type="url"
                        value={workLink}
                        onChange={(event) =>
                            setWorkLink(
                                event.target.value
                            )
                        }
                        placeholder="https://github.com/..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    />

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        You can provide a Git repository,
                        deployment, documentation, or other
                        relevant technical link.
                    </p>
                </div>

                {/* ==================================================
                    SUBMISSION NOTICE
                ================================================== */}

                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                    <div className="flex items-start gap-3">
                        <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                        />

                        <div>
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                Review Process
                            </p>

                            <p className="mt-1 text-sm leading-6 text-blue-800 dark:text-blue-300/80">
                                After submission, the task
                                status will become{" "}
                                <strong>Review</strong>.
                                The appropriate reviewer or
                                Manager will review the
                                development work.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    SUBMIT BUTTON
                ================================================== */}

                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-[#0d2340]"
                >
                    {submitting ? (
                        <>
                            <Send
                                size={18}
                                className="animate-pulse"
                            />

                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={18} />

                            Submit for Review
                        </>
                    )}
                </button>
            </form>

            {/* ==================================================
                BUSINESS RULE
            ================================================== */}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                    />

                    <div>
                        <h2 className="font-semibold text-amber-900 dark:text-amber-300">
                            Developer Submission Rule
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-300/80">
                            Submitting development work only
                            sends the work for review. The
                            Developer does not approve their own
                            completed work. Final approval remains
                            with the appropriate reviewer or
                            Manager.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmitDevelopmentWork;
