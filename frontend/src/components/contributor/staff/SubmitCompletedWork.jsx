import { useState } from "react";

import {
    CheckCircle2,
    FileText,
    Link as LinkIcon,
    Send,
    AlertCircle,
    Loader2,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// STAFF USE CASE 5
// CONT-STAFF-005
// SUBMIT COMPLETED WORK
// ============================================================
//
// Workflow:
//
// Staff
//   ↓
// Completes Work
//   ↓
// Submit for Review
//   ↓
// Review
//   ↓
// Manager
//   ↓
// Approve / Request Modification
//
// IMPORTANT:
// Staff does NOT approve their own completed work.
// ============================================================

function SubmitCompletedWork({
    taskId = null,
    taskStatus = "Done",
    onSubmitSuccess,
}) {
    const [completionNotes, setCompletionNotes] =
        useState("");

    const [workSummary, setWorkSummary] =
        useState("");

    const [optionalLink, setOptionalLink] =
        useState("");

    const [selectedFiles, setSelectedFiles] =
        useState([]);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // ALLOWED FILE SIZE
    // ========================================================

    const MAX_FILE_SIZE =
        10 * 1024 * 1024;

    // ========================================================
    // HANDLE FILE SELECTION
    // ========================================================

    const handleFileChange = (
        event
    ) => {
        setSuccessMessage("");
        setErrorMessage("");

        const files =
            Array.from(
                event.target.files || []
            );

        if (
            files.length === 0
        ) {
            return;
        }

        // ----------------------------------------------------
        // Validate file size
        // ----------------------------------------------------

        const oversizedFile =
            files.find(
                (file) =>
                    file.size >
                    MAX_FILE_SIZE
            );

        if (oversizedFile) {
            setErrorMessage(
                "File size exceeds the allowed limit."
            );

            event.target.value = "";

            return;
        }

        setSelectedFiles(
            (previousFiles) => [
                ...previousFiles,
                ...files,
            ]
        );

        event.target.value = "";
    };

    // ========================================================
    // REMOVE FILE
    // ========================================================

    const handleRemoveFile = (
        index
    ) => {
        setSelectedFiles(
            (previousFiles) =>
                previousFiles.filter(
                    (_, fileIndex) =>
                        fileIndex !==
                        index
                )
        );
    };

    // ========================================================
    // SUBMIT COMPLETED WORK
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        // ----------------------------------------------------
        // Validate task
        // ----------------------------------------------------

        if (!taskId) {
            setErrorMessage(
                "Task information is required."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate task status
        // ----------------------------------------------------

        const normalizedStatus =
            String(
                taskStatus || ""
            )
                .trim()
                .toLowerCase();

        if (
            normalizedStatus ===
                "completed" ||
            normalizedStatus ===
                "closed" ||
            normalizedStatus ===
                "review"
        ) {
            setErrorMessage(
                "This task cannot be submitted."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate required information
        // ----------------------------------------------------

        if (
            !completionNotes.trim() ||
            !workSummary.trim()
        ) {
            setErrorMessage(
                "Please provide required submission details."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate optional link
        // ----------------------------------------------------

        if (
            optionalLink.trim()
        ) {
            try {
                new URL(
                    optionalLink.trim()
                );
            } catch {
                setErrorMessage(
                    "Please provide a valid link."
                );

                return;
            }
        }

        setIsSubmitting(true);

        try {
            // ==================================================
            // PREPARE SUBMISSION DATA
            // ==================================================

            const formData =
                new FormData();

            formData.append(
                "taskId",
                String(taskId)
            );

            formData.append(
                "completionNotes",
                completionNotes.trim()
            );

            formData.append(
                "workSummary",
                workSummary.trim()
            );

            if (
                optionalLink.trim()
            ) {
                formData.append(
                    "optionalLink",
                    optionalLink.trim()
                );
            }

            selectedFiles.forEach(
                (file) => {
                    formData.append(
                        "files",
                        file
                    );
                }
            );

            // ==================================================
            // BACKEND CONNECTION
            // ==================================================
            //
            // We will connect this to the real .NET endpoint
            // after confirming your backend controller.
            //
            // Example expected endpoint:
            //
            // POST
            // /Tasks/{taskId}/submit
            //
            // ==================================================

            /*
             *
             * Example when backend endpoint is confirmed:
             *
             * const response = await api.post(
             *     `/Tasks/${taskId}/submit`,
             *     formData,
             *     {
             *         headers: {
             *             "Content-Type":
             *                 "multipart/form-data",
             *         },
             *     }
             * );
             *
             */

            // ------------------------------------------------
            // Temporary UI simulation
            // ------------------------------------------------

            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        800
                    )
            );

            // ==================================================
            // SUCCESS
            // ==================================================

            setSuccessMessage(
                "Work submitted successfully for review."
            );

            // ------------------------------------------------
            // Notify parent component
            // ------------------------------------------------

            if (
                onSubmitSuccess
            ) {
                onSubmitSuccess({
                    taskId,
                    status: "Review",
                    completionNotes:
                        completionNotes.trim(),
                    workSummary:
                        workSummary.trim(),
                    optionalLink:
                        optionalLink.trim(),
                    files:
                        selectedFiles,
                });
            }

            // ------------------------------------------------
            // Clear form
            // ------------------------------------------------

            setCompletionNotes("");
            setWorkSummary("");
            setOptionalLink("");
            setSelectedFiles([]);
        } catch (error) {
            console.error(
                "SUBMIT COMPLETED WORK ERROR:",
                error
            );

            setErrorMessage(
                "Unable to submit work. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========================================================
    // UI
    // ========================================================

    return (
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
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex items-start gap-3">
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-green-100
                        text-green-600
                        dark:bg-green-950/50
                        dark:text-green-400
                    "
                >
                    <CheckCircle2 className="h-5 w-5" />
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
                        Submit Completed Work
                    </h3>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Submit your completed work
                        to the Manager for review.
                    </p>
                </div>
            </div>

            {/* ==================================================
                IMPORTANT BUSINESS RULE
            ================================================== */}

            <div
                className="
                    mb-6
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-4
                    dark:border-blue-900
                    dark:bg-blue-950/30
                "
            >
                <div className="flex gap-3">
                    <AlertCircle
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-blue-600
                            dark:text-blue-400
                        "
                    />

                    <div>
                        <p
                            className="
                                font-medium
                                text-blue-800
                                dark:text-blue-300
                            "
                        >
                            Manager Review Required
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-blue-700
                                dark:text-blue-400
                            "
                        >
                            Your completed work will
                            be submitted for Manager
                            review. Staff members
                            cannot approve their own
                            work.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={
                    handleSubmit
                }
                className="space-y-5"
            >
                {/* ==================================================
                    COMPLETION NOTES
                ================================================== */}

                <div>
                    <label
                        htmlFor="completionNotes"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Completion Notes
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <textarea
                        id="completionNotes"
                        value={
                            completionNotes
                        }
                        onChange={(event) =>
                            setCompletionNotes(
                                event.target
                                    .value
                            )
                        }
                        placeholder="Describe what you completed..."
                        rows={4}
                        disabled={
                            isSubmitting
                        }
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
                            dark:placeholder:text-slate-500
                        "
                    />
                </div>

                {/* ==================================================
                    WORK SUMMARY
                ================================================== */}

                <div>
                    <label
                        htmlFor="workSummary"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Work Summary
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <textarea
                        id="workSummary"
                        value={
                            workSummary
                        }
                        onChange={(event) =>
                            setWorkSummary(
                                event.target
                                    .value
                            )
                        }
                        placeholder="Provide a summary of the completed work..."
                        rows={5}
                        disabled={
                            isSubmitting
                        }
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
                            dark:placeholder:text-slate-500
                        "
                    />
                </div>

                {/* ==================================================
                    OPTIONAL LINK
                ================================================== */}

                <div>
                    <label
                        htmlFor="optionalLink"
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
                        <LinkIcon className="h-4 w-4" />

                        Optional Link
                    </label>

                    <input
                        id="optionalLink"
                        type="url"
                        value={
                            optionalLink
                        }
                        onChange={(event) =>
                            setOptionalLink(
                                event.target
                                    .value
                            )
                        }
                        placeholder="https://..."
                        disabled={
                            isSubmitting
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
                            placeholder:text-slate-400
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                            dark:border-slate-600
                            dark:bg-[#081b33]
                            dark:text-white
                            dark:placeholder:text-slate-500
                        "
                    />
                </div>

                {/* ==================================================
                    FILES
                ================================================== */}

                <div>
                    <label
                        htmlFor="completedWorkFiles"
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
                        <FileText className="h-4 w-4" />

                        Required Files / Documents
                    </label>

                    <input
                        id="completedWorkFiles"
                        type="file"
                        multiple
                        onChange={
                            handleFileChange
                        }
                        disabled={
                            isSubmitting
                        }
                        className="
                            block
                            w-full
                            cursor-pointer
                            rounded-xl
                            border
                            border-slate-300
                            bg-slate-50
                            text-sm
                            text-slate-600
                            file:mr-4
                            file:border-0
                            file:bg-blue-600
                            file:px-4
                            file:py-3
                            file:text-sm
                            file:font-medium
                            file:text-white
                            hover:file:bg-blue-700
                            dark:border-slate-600
                            dark:bg-[#081b33]
                            dark:text-slate-300
                        "
                    />

                    <p
                        className="
                            mt-2
                            text-xs
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        Maximum size per file:
                        10 MB.
                    </p>
                </div>

                {/* ==================================================
                    SELECTED FILES
                ================================================== */}

                {selectedFiles.length >
                    0 && (
                    <div className="space-y-2">
                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            Selected Files
                        </p>

                        {selectedFiles.map(
                            (
                                file,
                                index
                            ) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        dark:border-slate-700
                                        dark:bg-[#081b33]
                                    "
                                >
                                    <FileText
                                        className="
                                            h-5
                                            w-5
                                            shrink-0
                                            text-blue-500
                                        "
                                    />

                                    <span
                                        className="
                                            min-w-0
                                            flex-1
                                            truncate
                                            text-sm
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >
                                        {
                                            file.name
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFile(
                                                index
                                            )
                                        }
                                        disabled={
                                            isSubmitting
                                        }
                                        className="
                                            rounded-lg
                                            p-1.5
                                            text-slate-400
                                            hover:bg-slate-200
                                            hover:text-red-500
                                            dark:hover:bg-slate-700
                                        "
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {successMessage && (
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-green-200
                            bg-green-50
                            px-4
                            py-3
                            text-sm
                            text-green-700
                            dark:border-green-900
                            dark:bg-green-950/30
                            dark:text-green-400
                        "
                    >
                        <CheckCircle2 className="h-5 w-5 shrink-0" />

                        <span>
                            {
                                successMessage
                            }
                        </span>
                    </div>
                )}

                {/* ==================================================
                    ERROR MESSAGE
                ================================================== */}

                {errorMessage && (
                    <div
                        className="
                            flex
                            items-start
                            gap-2
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                            dark:border-red-900
                            dark:bg-red-950/30
                            dark:text-red-400
                        "
                    >
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <span>
                            {
                                errorMessage
                            }
                        </span>
                    </div>
                )}

                {/* ==================================================
                    SUBMIT BUTTON
                ================================================== */}

                <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-700">
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting
                        }
                        className="
                            min-w-[190px]
                        "
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />

                                Submit for Review
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default SubmitCompletedWork;