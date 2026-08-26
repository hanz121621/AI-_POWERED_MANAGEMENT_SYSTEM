
import { useMemo, useRef, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    FileText,
    FolderKanban,
    HelpCircle,
    Loader2,
    Paperclip,
    Send,
    Upload,
    UserRound,
    X,
} from "lucide-react";


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
];

const ALLOWED_FILE_EXTENSIONS = [
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".txt",
    ".zip",
];

// ============================================================
// DEMO PROJECT/TASK DATA
//
// Replace this with your API data when backend integration
// is connected.
// ============================================================

const DEFAULT_PROJECT = {
    id: "PROJ-001",
    name: "AI-Powered Management System",
};

const DEFAULT_TASKS = [
    {
        id: "TASK-001",
        title: "Implement Contributor Dashboard",
    },
    {
        id: "TASK-002",
        title: "Connect Project Management API",
    },
    {
        id: "TASK-003",
        title: "Implement Task Assignment",
    },
];

// ============================================================
// HELPERS
// ============================================================

function getCurrentUser() {
    try {
        const user =
            JSON.parse(localStorage.getItem("user")) ||
            JSON.parse(localStorage.getItem("aipms_user"));

        return user;
    } catch {
        return null;
    }
}

function getUserDisplayName(user) {
    if (!user) {
        return "Contributor";
    }

    return (
        user.name ||
        user.fullName ||
        user.username ||
        user.email ||
        "Contributor"
    );
}

function getUserRole(user) {
    if (!user) {
        return "Staff";
    }

    return (
        user.role ||
        user.accountType ||
        user.contributorType ||
        "Staff"
    );
}

function getNotificationRecipient(role) {
    if (String(role).toLowerCase() === "team leader") {
        return "Team Leader";
    }

    return "Manager";
}

function formatFileSize(bytes) {
    if (!bytes) {
        return "0 KB";
    }

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
        return `${mb.toFixed(2)} MB`;
    }

    return `${Math.ceil(bytes / 1024)} KB`;
}

function getFileExtension(fileName) {
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot === -1) {
        return "";
    }

    return fileName.substring(lastDot).toLowerCase();
}

function isAllowedFile(file) {
    if (!file) {
        return false;
    }

    const extension = getFileExtension(file.name);

    return (
        ALLOWED_FILE_TYPES.includes(file.type) ||
        ALLOWED_FILE_EXTENSIONS.includes(extension)
    );
}

// ============================================================
// COMPONENT
// ============================================================

export default function RequestProjectAssistance({
    project = DEFAULT_PROJECT,
    tasks = DEFAULT_TASKS,
    onSuccess,
    onClose,
}) {
    const currentUser = useMemo(() => getCurrentUser(), []);

    const contributorName = getUserDisplayName(currentUser);
    const contributorRole = getUserRole(currentUser);

    const notificationRecipient =
        getNotificationRecipient(contributorRole);

    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState({
        problemDescription: "",
        impact: "",
        relatedTaskId: "",
        requiredAssistance: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const [errors, setErrors] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const fileInputRef = useRef(null);

    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    // ========================================================
    // FILE SELECT
    // ========================================================

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        setErrors((previous) => ({
            ...previous,
            file: "",
        }));

        setErrorMessage("");

        if (!file) {
            return;
        }

        if (!isAllowedFile(file)) {
            setErrors((previous) => ({
                ...previous,
                file: "This file type is not allowed.",
            }));

            event.target.value = "";
            setSelectedFile(null);

            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setErrors((previous) => ({
                ...previous,
                file: "File size exceeds the allowed 10 MB limit.",
            }));

            event.target.value = "";
            setSelectedFile(null);

            return;
        }

        setSelectedFile(file);
    };

    // ========================================================
    // REMOVE FILE
    // ========================================================

    const handleRemoveFile = () => {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setErrors((previous) => ({
            ...previous,
            file: "",
        }));
    };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.problemDescription.trim()) {
            validationErrors.problemDescription =
                "Please provide details about the assistance required.";
        }

        if (!formData.impact.trim()) {
            validationErrors.impact =
                "Please describe the impact of the problem.";
        }

        if (!formData.requiredAssistance.trim()) {
            validationErrors.requiredAssistance =
                "Please specify the assistance required.";
        }

        if (
            formData.problemDescription.trim().length > 2000
        ) {
            validationErrors.problemDescription =
                "Problem description cannot exceed 2000 characters.";
        }

        if (formData.impact.trim().length > 1000) {
            validationErrors.impact =
                "Impact description cannot exceed 1000 characters.";
        }

        if (
            formData.requiredAssistance.trim().length > 2000
        ) {
            validationErrors.requiredAssistance =
                "Required assistance cannot exceed 2000 characters.";
        }

        if (selectedFile) {
            if (!isAllowedFile(selectedFile)) {
                validationErrors.file =
                    "This file type is not allowed.";
            }

            if (selectedFile.size > MAX_FILE_SIZE) {
                validationErrors.file =
                    "File size exceeds the allowed 10 MB limit.";
            }
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    // ========================================================
    // RECORD ASSISTANCE REQUEST
    //
    // Temporary frontend implementation.
    //
    // Later this can be replaced with:
    //
    // projectService.requestAssistance(...)
    //
    // ========================================================

    const recordAssistanceRequest = () => {
        const requestId =
            `ASSIST-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()}`;

        const request = {
            id: requestId,

            useCaseId: "CONT-PROJECT-008",

            type: "Project Assistance Request",

            projectId: project?.id || null,

            projectName:
                project?.name || "Unknown Project",

            relatedTaskId:
                formData.relatedTaskId || null,

            problemDescription:
                formData.problemDescription.trim(),

            impact:
                formData.impact.trim(),

            requiredAssistance:
                formData.requiredAssistance.trim(),

            submittedBy: {
                id:
                    currentUser?.id ||
                    currentUser?.userId ||
                    null,

                name: contributorName,

                role: contributorRole,
            },

            recipient: notificationRecipient,

            status: "Pending",

            createdAt: new Date().toISOString(),

            attachment: selectedFile
                ? {
                      name: selectedFile.name,
                      type: selectedFile.type,
                      size: selectedFile.size,
                  }
                : null,
        };

        // ====================================================
        // STORE REQUEST
        // ====================================================

        const existingRequests =
            JSON.parse(
                localStorage.getItem(
                    "aipms_project_assistance_requests"
                )
            ) || [];

        existingRequests.push(request);

        localStorage.setItem(
            "aipms_project_assistance_requests",
            JSON.stringify(existingRequests)
        );

        // ====================================================
        // RECORD ACTIVITY
        // ====================================================

        const activity = {
            id: `ACT-${Date.now()}`,

            type: "Project Assistance Requested",

            action: "REQUEST_ASSISTANCE",

            useCaseId: "CONT-PROJECT-008",

            projectId: project?.id || null,

            projectName:
                project?.name || "Unknown Project",

            taskId:
                formData.relatedTaskId || null,

            requestId,

            performedBy: contributorName,

            role: contributorRole,

            createdAt: new Date().toISOString(),
        };

        const existingActivities =
            JSON.parse(
                localStorage.getItem("aipms_activity_logs")
            ) || [];

        existingActivities.push(activity);

        localStorage.setItem(
            "aipms_activity_logs",
            JSON.stringify(existingActivities)
        );

        // ====================================================
        // CREATE NOTIFICATION
        // ====================================================

        const notification = {
            id: `NOTIFY-${Date.now()}`,

            type: "PROJECT_ASSISTANCE_REQUEST",

            title: "Project Assistance Requested",

            message:
                `${contributorName} requested assistance ` +
                `on ${project?.name || "a project"}.`,

            recipientRole: notificationRecipient,

            projectId: project?.id || null,

            taskId:
                formData.relatedTaskId || null,

            requestId,

            read: false,

            createdAt: new Date().toISOString(),
        };

        const existingNotifications =
            JSON.parse(
                localStorage.getItem(
                    "aipms_notifications"
                )
            ) || [];

        existingNotifications.push(notification);

        localStorage.setItem(
            "aipms_notifications",
            JSON.stringify(existingNotifications)
        );

        return request;
    };

    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate system processing.
            await new Promise((resolve) => {
                setTimeout(resolve, 700);
            });

            const request = recordAssistanceRequest();

            setSuccessMessage(
                "Assistance request submitted successfully."
            );

            setFormData({
                problemDescription: "",
                impact: "",
                relatedTaskId: "",
                requiredAssistance: "",
            });

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (onSuccess) {
                onSuccess(request);
            }
        } catch (error) {
            console.error(
                "Request assistance error:",
                error
            );

            setErrorMessage(
                "Unable to submit assistance request."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        if (isSubmitting) {
            return;
        }

        if (onClose) {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* =================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                        <HelpCircle
                            className="h-6 w-6 text-blue-600"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Request Project Assistance
                        </h2>

                        <p className="text-sm text-slate-500">
                            Request help when you cannot continue
                            your assigned project work.
                        </p>
                    </div>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* =================================================
                PROJECT INFORMATION
            ================================================== */}

            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <FolderKanban className="h-5 w-5 text-slate-500" />

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Project
                            </p>

                            <p className="font-medium text-slate-900">
                                {project?.name ||
                                    "Unknown Project"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <UserRound className="h-5 w-5 text-slate-500" />

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Requesting User
                            </p>

                            <p className="font-medium text-slate-900">
                                {contributorName}
                            </p>

                            <p className="text-xs text-slate-500">
                                {contributorRole}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================
                MESSAGES
            ================================================== */}

            {successMessage && (
                <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                    <div>
                        <p className="font-medium text-green-800">
                            Request submitted
                        </p>

                        <p className="text-sm text-green-700">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <p className="text-sm font-medium text-red-700">
                        {errorMessage}
                    </p>
                </div>
            )}

            {/* =================================================
                FORM
            ================================================== */}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {/* =================================================
                    PROBLEM DESCRIPTION
                ================================================== */}

                <div>
                    <label
                        htmlFor="problemDescription"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Problem Description
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <textarea
                        id="problemDescription"
                        name="problemDescription"
                        value={
                            formData.problemDescription
                        }
                        onChange={handleChange}
                        rows={5}
                        maxLength={2000}
                        placeholder="Describe the problem preventing you from continuing your work..."
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                            errors.problemDescription
                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                    />

                    <div className="mt-1 flex items-center justify-between">
                        {errors.problemDescription ? (
                            <p className="text-xs text-red-600">
                                {errors.problemDescription}
                            </p>
                        ) : (
                            <span />
                        )}

                        <span className="text-xs text-slate-400">
                            {
                                formData
                                    .problemDescription
                                    .length
                            }
                            /2000
                        </span>
                    </div>
                </div>

                {/* =================================================
                    IMPACT
                ================================================== */}

                <div>
                    <label
                        htmlFor="impact"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Impact
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <textarea
                        id="impact"
                        name="impact"
                        value={formData.impact}
                        onChange={handleChange}
                        rows={3}
                        maxLength={1000}
                        placeholder="Explain how this problem is affecting your project or task..."
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                            errors.impact
                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                    />

                    <div className="mt-1 flex items-center justify-between">
                        {errors.impact ? (
                            <p className="text-xs text-red-600">
                                {errors.impact}
                            </p>
                        ) : (
                            <span />
                        )}

                        <span className="text-xs text-slate-400">
                            {formData.impact.length}/1000
                        </span>
                    </div>
                </div>

                {/* =================================================
                    RELATED TASK
                ================================================== */}

                <div>
                    <label
                        htmlFor="relatedTaskId"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Related Task
                    </label>

                    <div className="relative">
                        <select
                            id="relatedTaskId"
                            name="relatedTaskId"
                            value={
                                formData.relatedTaskId
                            }
                            onChange={handleChange}
                            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                Select a related task
                            </option>

                            {tasks.map((task) => (
                                <option
                                    key={task.id}
                                    value={task.id}
                                >
                                    {task.id} — {task.title}
                                </option>
                            ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                {/* =================================================
                    REQUIRED ASSISTANCE
                ================================================== */}

                <div>
                    <label
                        htmlFor="requiredAssistance"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Required Assistance
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <textarea
                        id="requiredAssistance"
                        name="requiredAssistance"
                        value={
                            formData.requiredAssistance
                        }
                        onChange={handleChange}
                        rows={5}
                        maxLength={2000}
                        placeholder="Describe what assistance you need and who may be able to help..."
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                            errors.requiredAssistance
                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                    />

                    <div className="mt-1 flex items-center justify-between">
                        {errors.requiredAssistance ? (
                            <p className="text-xs text-red-600">
                                {
                                    errors.requiredAssistance
                                }
                            </p>
                        ) : (
                            <span />
                        )}

                        <span className="text-xs text-slate-400">
                            {
                                formData
                                    .requiredAssistance
                                    .length
                            }
                            /2000
                        </span>
                    </div>
                </div>

                {/* =================================================
                    OPTIONAL ATTACHMENT
                ================================================== */}

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Supporting Attachment
                        <span className="ml-1 font-normal text-slate-400">
                            (Optional)
                        </span>
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept={ALLOWED_FILE_EXTENSIONS.join(
                            ","
                        )}
                    />

                    {!selectedFile ? (
                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 px-4 py-7 text-sm text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <Upload className="h-5 w-5" />

                            <span>
                                Click to upload a supporting
                                file
                            </span>
                        </button>
                    ) : (
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                        {selectedFile.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {formatFileSize(
                                            selectedFile.size
                                        )}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="ml-3 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                aria-label="Remove attachment"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {errors.file && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-4 w-4" />

                            {errors.file}
                        </p>
                    )}

                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                        <Paperclip className="h-3.5 w-3.5" />

                        PDF, Word, Excel, images, TXT or ZIP.
                        Maximum size: 10 MB.
                    </p>
                </div>

                {/* =================================================
                    INFORMATION
                ================================================== */}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                        <div>
                            <p className="text-sm font-semibold text-blue-900">
                                Assistance Request Workflow
                            </p>

                            <p className="mt-1 text-sm leading-6 text-blue-800">
                                Your request will be recorded and
                                sent to the appropriate{" "}
                                <strong>
                                    Team Leader or Manager
                                </strong>
                                . The request does not change
                                project ownership or task
                                assignment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    {onClose && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />

                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />

                                Submit Assistance Request
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
