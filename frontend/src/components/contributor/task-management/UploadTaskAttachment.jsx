
import { useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    File,
    FileArchive,
    FileImage,
    FileText,
    FolderKanban,
    Paperclip,
    RefreshCw,
    ShieldCheck,
    Upload,
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK-006
// USE CASE: Upload Task Attachment
// PRIMARY ACTOR: Contributor
// ============================================================

// ============================================================
// CURRENT CONTRIBUTOR
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

// ============================================================
// FILE CONFIGURATION
// ============================================================

// Allowed file types.
// You can add/remove extensions later according to your
// backend file-upload policy.

const ALLOWED_FILE_EXTENSIONS = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "csv",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "zip",
    "rar",
];

// Maximum allowed file size.
// 10 MB.

const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ============================================================
// MOCK TASKS
// ============================================================

const INITIAL_TASKS = [
    {
        id: "TASK-001",
        title: "Implement Contributor Dashboard",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "In Progress",
        progress: 25,
    },
    {
        id: "TASK-002",
        title: "Implement Project Participation",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "In Progress",
        progress: 35,
    },
    {
        id: "TASK-003",
        title: "Prepare Project Documentation",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-004",
        assigneeName: "Team Member",
        status: "Backlog",
        progress: 0,
    },
    {
        id: "TASK-004",
        title: "Database Integration",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "Blocked",
        progress: 20,
    },
];

// ============================================================
// HELPERS
// ============================================================

function getFileExtension(fileName) {
    const parts = fileName.split(".");

    if (parts.length < 2) {
        return "";
    }

    return parts.pop().toLowerCase();
}

function formatFileSize(bytes) {
    if (!bytes) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    const safeIndex = Math.min(
        index,
        units.length - 1
    );

    return `${(
        bytes /
        Math.pow(1024, safeIndex)
    ).toFixed(safeIndex === 0 ? 0 : 2)} ${
        units[safeIndex]
    }`;
}

function formatDateTime(date) {
    if (!date) {
        return "Not available";
    }

    return new Date(date).toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

function getFileIcon(extension) {
    if (
        [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
        ].includes(extension)
    ) {
        return <FileImage size={22} />;
    }

    if (
        [
            "pdf",
            "doc",
            "docx",
            "txt",
        ].includes(extension)
    ) {
        return <FileText size={22} />;
    }

    if (
        [
            "zip",
            "rar",
        ].includes(extension)
    ) {
        return <FileArchive size={22} />;
    }

    return <File size={22} />;
}

function getStatusClasses(status) {
    switch (status) {
        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Done":
        case "Completed":
            return "bg-emerald-100 text-emerald-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// LOCAL STORAGE
// ============================================================

const ATTACHMENTS_STORAGE_KEY =
    "aipms_task_attachments";

const ACTIVITY_STORAGE_KEY =
    "aipms_task_activities";

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function UploadTaskAttachment() {
    // ----------------------------------------------------------
    // TASKS
    // ----------------------------------------------------------

    const [tasks] = useState(INITIAL_TASKS);

    // ----------------------------------------------------------
    // SELECTED TASK
    // ----------------------------------------------------------

    const [selectedTask, setSelectedTask] =
        useState(null);

    // ----------------------------------------------------------
    // ATTACHMENTS
    // ----------------------------------------------------------

    const [attachments, setAttachments] =
        useState([]);

    // ----------------------------------------------------------
    // FILE INPUT
    // ----------------------------------------------------------

    const fileInputRef = useRef(null);

    // ----------------------------------------------------------
    // UPLOAD STATE
    // ----------------------------------------------------------

    const [uploading, setUploading] =
        useState(false);

    // ----------------------------------------------------------
    // NOTIFICATION
    // ----------------------------------------------------------

    const [notification, setNotification] =
        useState(null);

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    const [search, setSearch] = useState("");

    // ============================================================
    // FILTER ASSIGNED TASKS
    // ============================================================

    const assignedTasks = useMemo(() => {
        const searchValue =
            search.trim().toLowerCase();

        return tasks.filter((task) => {
            if (
                task.assigneeId !==
                CURRENT_CONTRIBUTOR.id
            ) {
                return false;
            }

            if (!searchValue) {
                return true;
            }

            return (
                task.id
                    .toLowerCase()
                    .includes(searchValue) ||
                task.title
                    .toLowerCase()
                    .includes(searchValue) ||
                task.projectName
                    .toLowerCase()
                    .includes(searchValue) ||
                task.sprintName
                    .toLowerCase()
                    .includes(searchValue)
            );
        });
    }, [tasks, search]);

    // ============================================================
    // OPEN TASK
    //
    // MAIN SUCCESS SCENARIO - STEP 1
    //
    // Contributor opens Task Details.
    // ============================================================

    const openTask = (task) => {
        setSelectedTask(task);
        setNotification(null);

        loadTaskAttachments(task.id);
    };

    // ============================================================
    // CLOSE TASK
    // ============================================================

    const closeTask = () => {
        setSelectedTask(null);
        setAttachments([]);
        setNotification(null);
    };

    // ============================================================
    // LOAD TASK ATTACHMENTS
    // ============================================================

    const loadTaskAttachments = (taskId) => {
        try {
            const storedAttachments =
                JSON.parse(
                    localStorage.getItem(
                        ATTACHMENTS_STORAGE_KEY
                    ) || "[]"
                );

            const taskAttachments =
                storedAttachments.filter(
                    (attachment) =>
                        attachment.taskId ===
                        taskId
                );

            setAttachments(taskAttachments);
        } catch (error) {
            console.error(
                "Unable to load task attachments:",
                error
            );

            setAttachments([]);
        }
    };

    // ============================================================
    // RECORD ACTIVITY
    //
    // MAIN SUCCESS SCENARIO - STEP 7
    //
    // System records the upload.
    // ============================================================

    const recordUploadActivity = (
        task,
        attachment
    ) => {
        // Important:
        // The ID is generated here, inside an event-driven
        // function, not during React rendering.

        const activity = {
            id: `ACT-${crypto.randomUUID()}`,
            type: "TASK_ATTACHMENT_UPLOADED",
            taskId: task.id,
            taskTitle: task.title,
            projectId: task.projectId,
            projectName: task.projectName,
            sprintId: task.sprintId,
            sprintName: task.sprintName,
            userId: CURRENT_CONTRIBUTOR.id,
            userName: CURRENT_CONTRIBUTOR.name,
            attachmentId: attachment.id,
            fileName: attachment.fileName,
            fileSize: attachment.fileSize,
            fileType: attachment.fileType,
            timestamp:
                attachment.uploadedAt,
            description: `File "${attachment.fileName}" was uploaded to task "${task.title}".`,
        };

        try {
            const existingActivities =
                JSON.parse(
                    localStorage.getItem(
                        ACTIVITY_STORAGE_KEY
                    ) || "[]"
                );

            localStorage.setItem(
                ACTIVITY_STORAGE_KEY,
                JSON.stringify([
                    ...existingActivities,
                    activity,
                ])
            );

            return activity;
        } catch (error) {
            console.error(
                "Unable to record upload activity:",
                error
            );

            return null;
        }
    };

    // ============================================================
    // VALIDATE FILE
    //
    // MAIN SUCCESS SCENARIO - STEP 4
    // ============================================================

    const validateFile = (file) => {
        if (!file) {
            return {
                valid: false,
                message:
                    "Unable to upload file.",
            };
        }

        const extension =
            getFileExtension(file.name);

        // --------------------------------------------------------
        // Unsupported file type
        // --------------------------------------------------------

        if (
            !ALLOWED_FILE_EXTENSIONS.includes(
                extension
            )
        ) {
            return {
                valid: false,
                message:
                    "This file type is not allowed.",
            };
        }

        // --------------------------------------------------------
        // File too large
        // --------------------------------------------------------

        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                message:
                    "File exceeds the allowed size.",
            };
        }

        return {
            valid: true,
            extension,
        };
    };

    // ============================================================
    // UPLOAD FILE
    //
    // CONT-TASK-006
    //
    // MAIN SUCCESS SCENARIO:
    //
    // 1. Open Task Details
    // 2. Select Attachments
    // 3. Select Upload File
    // 4. Validate file
    // 5. Upload file
    // 6. Associate file with task
    // 7. Record upload
    // 8. Display success
    //
    // ALTERNATIVE FLOWS:
    //
    // Unsupported type:
    // "This file type is not allowed."
    //
    // Too large:
    // "File exceeds the allowed size."
    //
    // Upload failure:
    // "Unable to upload file."
    // ============================================================

    const handleFileUpload = async (
        event
    ) => {
        const file =
            event.target.files?.[0];

        // Reset file input so the same file
        // can be selected again later.

        event.target.value = "";

        if (!file || !selectedTask) {
            return;
        }

        // --------------------------------------------------------
        // STEP 4
        // Validate the file.
        // --------------------------------------------------------

        const validation =
            validateFile(file);

        if (!validation.valid) {
            setNotification({
                type: "error",
                message:
                    validation.message,
            });

            return;
        }

        try {
            setUploading(true);
            setNotification(null);

            // ----------------------------------------------------
            // STEP 5
            // Upload file.
            //
            // Frontend-only implementation:
            // We create a local object representation.
            //
            // Later replace this section with:
            //
            // const formData = new FormData();
            // formData.append("file", file);
            // formData.append("taskId", selectedTask.id);
            //
            // await taskService.uploadAttachment(
            //     selectedTask.id,
            //     formData
            // );
            // ----------------------------------------------------

            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        700
                    )
            );

            // ----------------------------------------------------
            // STEP 6
            // Associate file with task.
            // ----------------------------------------------------

            const attachment = {
                id: `ATT-${crypto.randomUUID()}`,
                taskId: selectedTask.id,
                taskTitle:
                    selectedTask.title,
                projectId:
                    selectedTask.projectId,
                projectName:
                    selectedTask.projectName,
                sprintId:
                    selectedTask.sprintId,
                sprintName:
                    selectedTask.sprintName,
                uploadedBy:
                    CURRENT_CONTRIBUTOR.id,
                uploadedByName:
                    CURRENT_CONTRIBUTOR.name,
                fileName: file.name,
                fileSize: file.size,
                fileSizeFormatted:
                    formatFileSize(
                        file.size
                    ),
                fileType:
                    validation.extension,
                mimeType:
                    file.type ||
                    "application/octet-stream",
                uploadedAt:
                    new Date().toISOString(),
            };

            // ----------------------------------------------------
            // Save attachment metadata.
            //
            // IMPORTANT:
            // This stores metadata only.
            // The actual file should be uploaded to your
            // .NET backend/storage when backend integration
            // is connected.
            // ----------------------------------------------------

            const existingAttachments =
                JSON.parse(
                    localStorage.getItem(
                        ATTACHMENTS_STORAGE_KEY
                    ) || "[]"
                );

            const updatedAttachments = [
                ...existingAttachments,
                attachment,
            ];

            localStorage.setItem(
                ATTACHMENTS_STORAGE_KEY,
                JSON.stringify(
                    updatedAttachments
                )
            );

            // ----------------------------------------------------
            // Update current task attachment list.
            // ----------------------------------------------------

            setAttachments((previous) => [
                ...previous,
                attachment,
            ]);

            // ----------------------------------------------------
            // STEP 7
            // Record upload activity.
            // ----------------------------------------------------

            recordUploadActivity(
                selectedTask,
                attachment
            );

            // ----------------------------------------------------
            // STEP 8
            // Required success message.
            // ----------------------------------------------------

            setNotification({
                type: "success",
                message:
                    "File uploaded successfully.",
            });
        } catch (error) {
            console.error(
                "Unable to upload file:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to upload file.",
            });
        } finally {
            setUploading(false);
        }
    };

    // ============================================================
    // REMOVE LOCAL ATTACHMENT
    //
    // This is useful during frontend development.
    // It does not belong to the required upload use case.
    // ============================================================

    const handleRemoveAttachment = (
        attachmentId
    ) => {
        try {
            const existingAttachments =
                JSON.parse(
                    localStorage.getItem(
                        ATTACHMENTS_STORAGE_KEY
                    ) || "[]"
                );

            const updated =
                existingAttachments.filter(
                    (attachment) =>
                        attachment.id !==
                        attachmentId
                );

            localStorage.setItem(
                ATTACHMENTS_STORAGE_KEY,
                JSON.stringify(updated)
            );

            setAttachments((previous) =>
                previous.filter(
                    (attachment) =>
                        attachment.id !==
                        attachmentId
                )
            );

            setNotification({
                type: "success",
                message:
                    "Attachment removed.",
            });
        } catch (error) {
            console.error(
                "Unable to remove attachment:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to remove attachment.",
            });
        }
    };

    // ============================================================
    // TASK LIST VIEW
    // ============================================================

    if (!selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <Paperclip
                                    size={25}
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Task Attachments
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Upload work-related
                                    files to your
                                    assigned tasks.
                                </p>
                            </div>
                        </div>

                        {/* CONTRIBUTOR */}
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                <UserRound
                                    size={18}
                                />
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-400">
                                    Contributor
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    {
                                        CURRENT_CONTRIBUTOR.name
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* NOTIFICATION */}
                    {notification && (
                        <Notification
                            notification={
                                notification
                            }
                            onClose={() =>
                                setNotification(
                                    null
                                )
                            }
                        />
                    )}

                    {/* SEARCH */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search assigned tasks..."
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* TASKS */}
                    {assignedTasks.length ===
                    0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {assignedTasks.map(
                                (task) => (
                                    <TaskCard
                                        key={
                                            task.id
                                        }
                                        task={
                                            task
                                        }
                                        onOpen={() =>
                                            openTask(
                                                task
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================
    // TASK DETAIL VIEW
    // ============================================================

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl">

                {/* TOP BAR */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={
                            closeTask
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        <X size={18} />
                        Back to Tasks
                    </button>

                    <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            selectedTask.status
                        )}`}
                    >
                        {
                            selectedTask.status
                        }
                    </span>
                </div>

                {/* NOTIFICATION */}
                {notification && (
                    <Notification
                        notification={
                            notification
                        }
                        onClose={() =>
                            setNotification(
                                null
                            )
                        }
                    />
                )}

                {/* TASK DETAILS */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* TASK HEADER */}
                    <div className="border-b border-slate-100 p-6">
                        <p className="text-xs font-semibold text-blue-600">
                            {
                                selectedTask.id
                            }
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            {
                                selectedTask.title
                            }
                        </h1>
                    </div>

                    {/* TASK INFORMATION */}
                    <div className="grid gap-4 border-b border-slate-100 p-6 sm:grid-cols-2 lg:grid-cols-3">

                        <InfoCard
                            icon={
                                <FolderKanban
                                    size={18}
                                />
                            }
                            label="Project"
                            value={
                                selectedTask.projectName
                            }
                        />

                        <InfoCard
                            icon={
                                <RefreshCw
                                    size={18}
                                />
                            }
                            label="Sprint"
                            value={
                                selectedTask.sprintName
                            }
                        />

                        <InfoCard
                            icon={
                                <UserRound
                                    size={18}
                                />
                            }
                            label="Assigned To"
                            value={
                                selectedTask.assigneeName
                            }
                        />

                        <InfoCard
                            icon={
                                <ShieldCheck
                                    size={18}
                                />
                            }
                            label="Task Status"
                            value={
                                selectedTask.status
                            }
                        />

                        <InfoCard
                            icon={
                                <Paperclip
                                    size={18}
                                />
                            }
                            label="Attachments"
                            value={`${attachments.length} file${
                                attachments.length ===
                                1
                                    ? ""
                                    : "s"
                            }`}
                        />

                        <InfoCard
                            icon={
                                <UserRound
                                    size={18}
                                />
                            }
                            label="Uploaded By"
                            value={
                                CURRENT_CONTRIBUTOR.name
                            }
                        />
                    </div>

                    {/* ATTACHMENTS SECTION */}
                    <div className="p-6">

                        {/* SECTION HEADER */}
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Paperclip
                                        size={20}
                                        className="text-blue-600"
                                    />

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Attachments
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Upload files related
                                    to this task.
                                </p>
                            </div>

                            {/* UPLOAD BUTTON */}
                            <button
                                type="button"
                                disabled={
                                    uploading
                                }
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {uploading ? (
                                    <>
                                        <RefreshCw
                                            size={
                                                17
                                            }
                                            className="animate-spin"
                                        />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload
                                            size={
                                                17
                                            }
                                        />
                                        Upload File
                                    </>
                                )}
                            </button>

                            <input
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                className="hidden"
                                accept={ALLOWED_FILE_EXTENSIONS.map(
                                    (
                                        extension
                                    ) =>
                                        `.${extension}`
                                ).join(
                                    ","
                                )}
                                onChange={
                                    handleFileUpload
                                }
                            />
                        </div>

                        {/* FILE RULES */}
                        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    size={19}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-blue-900">
                                        Upload
                                        requirements
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-blue-700">
                                        Maximum file
                                        size:{" "}
                                        <strong>
                                            10 MB
                                        </strong>
                                    </p>

                                    <p className="text-xs leading-5 text-blue-700">
                                        Allowed:
                                        PDF, Word,
                                        Excel,
                                        PowerPoint,
                                        text,
                                        CSV, images,
                                        ZIP and RAR.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ATTACHMENT LIST */}
                        {attachments.length ===
                        0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <Paperclip
                                        size={
                                            25
                                        }
                                    />
                                </div>

                                <h3 className="mt-4 font-semibold text-slate-800">
                                    No attachments
                                    yet
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Upload a
                                    work-related
                                    file to this
                                    task.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {attachments.map(
                                    (
                                        attachment
                                    ) => (
                                        <AttachmentItem
                                            key={
                                                attachment.id
                                            }
                                            attachment={
                                                attachment
                                            }
                                            onRemove={() =>
                                                handleRemoveAttachment(
                                                    attachment.id
                                                )
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// TASK CARD
// ============================================================

function TaskCard({
    task,
    onOpen,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">

            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold text-blue-600">
                        {task.id}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                        {task.title}
                    </h2>
                </div>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        task.status
                    )}`}
                >
                    {task.status}
                </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <SmallInfo
                    icon={
                        <FolderKanban
                            size={16}
                        />
                    }
                    label="Project"
                    value={
                        task.projectName
                    }
                />

                <SmallInfo
                    icon={
                        <RefreshCw
                            size={16}
                        />
                    }
                    label="Sprint"
                    value={
                        task.sprintName
                    }
                />

                <SmallInfo
                    icon={
                        <UserRound
                            size={16}
                        />
                    }
                    label="Assigned To"
                    value={
                        task.assigneeName
                    }
                />

                <SmallInfo
                    icon={
                        <Paperclip
                            size={16}
                        />
                    }
                    label="Attachment"
                    value="Upload available"
                />
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onOpen}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Paperclip
                        size={16}
                    />
                    Open Attachments
                </button>
            </div>
        </div>
    );
}

// ============================================================
// ATTACHMENT ITEM
// ============================================================

function AttachmentItem({
    attachment,
    onRemove,
}) {
    const extension =
        getFileExtension(
            attachment.fileName
        );

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {getFileIcon(
                        extension
                    )}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                        {
                            attachment.fileName
                        }
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-400">
                        <span>
                            {
                                attachment.fileSizeFormatted
                            }
                        </span>

                        <span>
                            •
                        </span>

                        <span>
                            Uploaded by{" "}
                            {
                                attachment.uploadedByName
                            }
                        </span>

                        <span>
                            •
                        </span>

                        <span>
                            {formatDateTime(
                                attachment.uploadedAt
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onRemove}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
                <X size={15} />
                Remove
            </button>
        </div>
    );
}

// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// SMALL INFO
// ============================================================

function SmallInfo({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-slate-400">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[11px] text-slate-400">
                    {label}
                </p>

                <p className="truncate text-xs font-semibold text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// NOTIFICATION
// ============================================================

function Notification({
    notification,
    onClose,
}) {
    const isSuccess =
        notification.type ===
        "success";

    return (
        <div
            className={`mb-5 flex items-center justify-between gap-4 rounded-xl border p-4 ${
                isSuccess
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
            }`}
        >
            <div className="flex items-center gap-2">
                {isSuccess ? (
                    <CheckCircle2
                        size={19}
                    />
                ) : (
                    <AlertCircle
                        size={19}
                    />
                )}

                <span className="text-sm font-medium">
                    {
                        notification.message
                    }
                </span>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 transition hover:bg-black/5"
                aria-label="Close notification"
            >
                <X size={17} />
            </button>
        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Paperclip size={26} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                No assigned tasks found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                You currently have no tasks
                available for attachment
                uploads.
            </p>
        </div>
    );
}
