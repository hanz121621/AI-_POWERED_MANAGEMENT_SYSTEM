import { useState } from "react";

import {
    BriefcaseBusiness,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Send,
    ClipboardList,
    UserRound,
    Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// STAFF USE CASE 6
// CONT-STAFF-006
// PERFORM SPECIALIZED WORK
// ============================================================
//
// Business Rule:
//
// Staff specialization:
//
// - Identifies professional capability
// - Supports suitable work assignment
// - Helps Managers assign appropriate tasks
// - Supports workload and skill analysis
// - Helps AI make better task recommendations
//
// IMPORTANT:
//
// Specialization does NOT give Staff management authority.
//
// Workflow:
//
// Manager
//    ↓
// Assigns suitable task
//    ↓
// Staff specialization
//    ↓
// Staff performs work
//    ↓
// Updates progress
//    ↓
// Adds comments/files
//    ↓
// Completes work
//    ↓
// Submits for review
// ============================================================

function PerformSpecializedWork({
    task = null,
    specialization = null,
    onProgressUpdate,
    onRequestAssistance,
    onSubmitForReview,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [progress, setProgress] =
        useState(
            task?.progress ?? 0
        );

    const [workNotes, setWorkNotes] =
        useState("");

    const [assistanceMessage, setAssistanceMessage] =
        useState("");

    const [showAssistanceForm, setShowAssistanceForm] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [isRequestingAssistance, setIsRequestingAssistance] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // NORMALIZE DATA
    // ========================================================

    const taskTitle =
        task?.title ??
        task?.taskTitle ??
        "Assigned Task";

    const taskDescription =
        task?.description ??
        task?.taskDescription ??
        "No task description available.";

    const projectName =
        task?.projectName ??
        task?.project?.name ??
        "Not specified";

    const sprintName =
        task?.sprintName ??
        task?.sprint?.name ??
        "Not specified";

    const taskSpecialization =
        task?.specialization ??
        task?.specializationName ??
        specialization ??
        "Not specified";

    const taskStatus =
        task?.status ??
        "In Progress";

    const dueDate =
        task?.dueDate ??
        null;

    // ========================================================
    // HANDLE PROGRESS
    // ========================================================

    const handleProgressChange = (
        event
    ) => {
        const value =
            Number(
                event.target.value
            );

        setProgress(value);

        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // SAVE PROGRESS
    // ========================================================

    const handleSaveProgress =
        async () => {
            setSuccessMessage("");
            setErrorMessage("");

            if (
                progress < 0 ||
                progress > 100
            ) {
                setErrorMessage(
                    "Progress must be between 0 and 100."
                );

                return;
            }

            setIsSaving(true);

            try {
                // ==================================================
                // BACKEND CONNECTION
                // ==================================================
                //
                // Connect this to the existing Task API after
                // confirming the exact backend endpoint.
                //
                // Example:
                //
                // await api.patch(
                //     `/Tasks/${task.id}/progress`,
                //     {
                //         progress,
                //         notes: workNotes,
                //     }
                // );
                //
                // ==================================================

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            600
                        )
                );

                if (
                    onProgressUpdate
                ) {
                    await onProgressUpdate({
                        taskId:
                            task?.id ??
                            task?.taskId,
                        progress,
                        notes:
                            workNotes.trim(),
                    });
                }

                setSuccessMessage(
                    "Task progress updated successfully."
                );
            } catch (error) {
                console.error(
                    "UPDATE SPECIALIZED WORK PROGRESS ERROR:",
                    error
                );

                setErrorMessage(
                    "Unable to update task progress. Please try again."
                );
            } finally {
                setIsSaving(false);
            }
        };

    // ========================================================
    // REQUEST ASSISTANCE
    // ========================================================

    const handleRequestAssistance =
        async () => {
            setSuccessMessage("");
            setErrorMessage("");

            if (
                !assistanceMessage.trim()
            ) {
                setErrorMessage(
                    "Please describe the assistance you need."
                );

                return;
            }

            setIsRequestingAssistance(
                true
            );

            try {
                // ==================================================
                // BACKEND CONNECTION
                // ==================================================
                //
                // Example future endpoint:
                //
                // await api.post(
                //     `/Tasks/${task.id}/assistance`,
                //     {
                //         message:
                //             assistanceMessage.trim(),
                //     }
                // );
                //
                // ==================================================

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            600
                        )
                );

                if (
                    onRequestAssistance
                ) {
                    await onRequestAssistance(
                        {
                            taskId:
                                task?.id ??
                                task?.taskId,
                            message:
                                assistanceMessage.trim(),
                        }
                    );
                }

                setAssistanceMessage(
                    ""
                );

                setShowAssistanceForm(
                    false
                );

                setSuccessMessage(
                    "Your assistance request has been sent to the Team Leader or Manager."
                );
            } catch (error) {
                console.error(
                    "REQUEST ASSISTANCE ERROR:",
                    error
                );

                setErrorMessage(
                    "Unable to send the assistance request. Please try again."
                );
            } finally {
                setIsRequestingAssistance(
                    false
                );
            }
        };

    // ========================================================
    // SUBMIT FOR REVIEW
    // ========================================================

    const handleSubmitForReview =
        async () => {
            setSuccessMessage("");
            setErrorMessage("");

            if (
                progress < 100
            ) {
                setErrorMessage(
                    "Please complete the required work before submitting it for review."
                );

                return;
            }

            if (
                taskStatus
                    .toString()
                    .toLowerCase() ===
                    "closed"
            ) {
                setErrorMessage(
                    "This task cannot be submitted."
                );

                return;
            }

            setIsSubmitting(true);

            try {
                // ==================================================
                // BACKEND CONNECTION
                // ==================================================
                //
                // The final submission is handled by
                // CONT-STAFF-005.
                //
                // This component only starts that workflow.
                //
                // ==================================================

                if (
                    onSubmitForReview
                ) {
                    await onSubmitForReview(
                        {
                            taskId:
                                task?.id ??
                                task?.taskId,
                            progress,
                            notes:
                                workNotes.trim(),
                        }
                    );
                } else {
                    await new Promise(
                        (resolve) =>
                            setTimeout(
                                resolve,
                                600
                            )
                    );
                }

                setSuccessMessage(
                    "Work submitted successfully for review."
                );
            } catch (error) {
                console.error(
                    "SUBMIT SPECIALIZED WORK ERROR:",
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
                        bg-purple-100
                        text-purple-600
                        dark:bg-purple-950/50
                        dark:text-purple-400
                    "
                >
                    <Award className="h-5 w-5" />
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
                        Perform Specialized Work
                    </h3>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Perform your assigned work
                        according to your registered
                        specialization.
                    </p>
                </div>
            </div>

            {/* ==================================================
                SPECIALIZATION
            ================================================== */}

            <div
                className="
                    mb-6
                    rounded-xl
                    border
                    border-purple-200
                    bg-purple-50
                    p-4
                    dark:border-purple-900
                    dark:bg-purple-950/30
                "
            >
                <div className="flex items-center gap-3">
                    <UserRound
                        className="
                            h-5
                            w-5
                            text-purple-600
                            dark:text-purple-400
                        "
                    />

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-purple-600
                                dark:text-purple-400
                            "
                        >
                            Your Specialization
                        </p>

                        <p
                            className="
                                mt-1
                                font-semibold
                                text-purple-900
                                dark:text-purple-200
                            "
                        >
                            {
                                taskSpecialization
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                TASK INFORMATION
            ================================================== */}

            <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                    <ClipboardList
                        className="
                            h-5
                            w-5
                            text-blue-500
                        "
                    />

                    <h4
                        className="
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Assigned Task
                    </h4>
                </div>

                <div
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
                    <h5
                        className="
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {taskTitle}
                    </h5>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        {
                            taskDescription
                        }
                    </p>

                    <div
                        className="
                            mt-4
                            grid
                            gap-3
                            sm:grid-cols-3
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Project
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                {
                                    projectName
                                }
                            </p>
                        </div>

                        <div>
                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Sprint
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                {
                                    sprintName
                                }
                            </p>
                        </div>

                        <div>
                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Due Date
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                {dueDate
                                    ? new Date(
                                          dueDate
                                      ).toLocaleDateString()
                                    : "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                WORK PROGRESS
            ================================================== */}

            <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                    <label
                        htmlFor="specializedWorkProgress"
                        className="
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Work Progress
                    </label>

                    <span
                        className="
                            font-semibold
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        {progress}%
                    </span>
                </div>

                <input
                    id="specializedWorkProgress"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progress}
                    onChange={
                        handleProgressChange
                    }
                    disabled={
                        isSaving ||
                        isSubmitting
                    }
                    className="
                        w-full
                        cursor-pointer
                        accent-blue-600
                    "
                />

                <div
                    className="
                        mt-2
                        flex
                        justify-between
                        text-xs
                        text-slate-400
                    "
                >
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* ==================================================
                WORK NOTES
            ================================================== */}

            <div className="mb-6">
                <label
                    htmlFor="specializedWorkNotes"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-200
                    "
                >
                    Progress / Work Notes
                </label>

                <textarea
                    id="specializedWorkNotes"
                    value={
                        workNotes
                    }
                    onChange={(event) =>
                        setWorkNotes(
                            event.target
                                .value
                        )
                    }
                    rows={4}
                    placeholder="Describe the work you have performed..."
                    disabled={
                        isSaving ||
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
                ACTIONS
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-slate-200
                    pt-5
                    dark:border-slate-700
                    sm:flex-row
                    sm:justify-end
                "
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        setShowAssistanceForm(
                            !showAssistanceForm
                        )
                    }
                    disabled={
                        isSaving ||
                        isSubmitting ||
                        isRequestingAssistance
                    }
                >
                    <MessageSquare className="mr-2 h-4 w-4" />

                    Need Assistance
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={
                        handleSaveProgress
                    }
                    disabled={
                        isSaving ||
                        isSubmitting
                    }
                >
                    {isSaving ? (
                        "Saving..."
                    ) : (
                        <>
                            <BriefcaseBusiness className="mr-2 h-4 w-4" />

                            Save Progress
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={
                        handleSubmitForReview
                    }
                    disabled={
                        isSubmitting ||
                        isSaving ||
                        progress < 100
                    }
                >
                    {isSubmitting ? (
                        "Submitting..."
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />

                            Submit for Review
                        </>
                    )}
                </Button>
            </div>

            {/* ==================================================
                ASSISTANCE FORM
            ================================================== */}

            {showAssistanceForm && (
                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-amber-200
                        bg-amber-50
                        p-4
                        dark:border-amber-900
                        dark:bg-amber-950/20
                    "
                >
                    <div className="mb-3 flex items-start gap-3">
                        <AlertCircle
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                                text-amber-600
                            "
                        />

                        <div>
                            <p
                                className="
                                    font-medium
                                    text-amber-800
                                    dark:text-amber-300
                                "
                            >
                                Request Assistance
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-amber-700
                                    dark:text-amber-400
                                "
                            >
                                If the task does not
                                match your specialization
                                or you need additional
                                skills, explain the issue
                                to the Team Leader or
                                Manager.
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={
                            assistanceMessage
                        }
                        onChange={(event) =>
                            setAssistanceMessage(
                                event.target
                                    .value
                            )
                        }
                        rows={4}
                        placeholder="Explain why you need clarification, assistance, or reassignment..."
                        disabled={
                            isRequestingAssistance
                        }
                        className="
                            mb-3
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-amber-200
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-amber-500
                            focus:ring-2
                            focus:ring-amber-500/20
                            dark:border-amber-800
                            dark:bg-[#081b33]
                            dark:text-white
                        "
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowAssistanceForm(
                                    false
                                );
                                setAssistanceMessage(
                                    ""
                                );
                            }}
                            disabled={
                                isRequestingAssistance
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={
                                handleRequestAssistance
                            }
                            disabled={
                                isRequestingAssistance
                            }
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />

                            {isRequestingAssistance
                                ? "Sending..."
                                : "Send Request"}
                        </Button>
                    </div>
                </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
                <div
                    className="
                        mt-5
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
                ERROR
            ================================================== */}

            {errorMessage && (
                <div
                    className="
                        mt-5
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
                AUTHORITY NOTICE
            ================================================== */}

            <div
                className="
                    mt-6
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    dark:border-slate-700
                    dark:bg-[#081b33]
                "
            >
                <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    Staff Authority
                </p>

                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-600
                        dark:text-slate-300
                    "
                >
                    Your specialization helps
                    identify suitable work and
                    improve task assignment. It
                    does not give you management
                    or approval authority.
                </p>
            </div>
        </div>
    );
}

export default PerformSpecializedWork;