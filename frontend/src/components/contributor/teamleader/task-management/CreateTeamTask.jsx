// ============================================================
// AIPMS — TEAM LEADER CREATE TASK
//
// Use Case:
// TASK-001 — Create Task
//
// Primary Actor:
// Team Leader
//
// Goal:
// Allow a Team Leader to create a team-level task or subtask
// from Manager-assigned work and assign it to an eligible
// Developer or Staff contributor.
//
// Important:
// - Only Team Leaders with permission may create tasks.
// - Only Developer and Staff contributors may be selected.
// - Backend MUST verify authorization.
// - Backend MUST verify project membership.
// - Backend MUST verify sprint/project relationships.
// - Backend MUST verify contributor team membership.
// - Parent task is optional for team-level tasks.
// - Task dependencies are optional.
// - Project is inherited from the parent/assigned work.
// - No project selection is exposed to the Team Leader.
// - No localStorage is used.
// - Activity logging and notification are handled by backend.
// ============================================================

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    Clock3,
    GitBranch,
    Loader2,
    UserPlus,
    Users,
    X,
} from "lucide-react";

// ============================================================
// HELPERS
// ============================================================

const getTaskId = (task) => {
    if (!task) return null;

    return (
        task.id ??
        task.taskId ??
        task.Id ??
        task.TaskId ??
        null
    );
};

const getProjectId = (project) => {
    if (!project) return null;

    return (
        project.id ??
        project.projectId ??
        project.Id ??
        project.ProjectId ??
        null
    );
};

const getSprintId = (sprint) => {
    if (!sprint) return null;

    return (
        sprint.id ??
        sprint.sprintId ??
        sprint.Id ??
        sprint.SprintId ??
        null
    );
};

const getContributorId = (member) => {
    if (!member) return null;

    return (
        member.id ??
        member.userId ??
        member.contributorId ??
        member.Id ??
        member.UserId ??
        member.ContributorId ??
        member.user?.id ??
        member.user?.userId ??
        null
    );
};

const getName = (
    item,
    fallback = "Unnamed"
) => {
    if (!item) return fallback;

    return (
        item.name ??
        item.title ??
        item.fullName ??
        item.taskTitle ??
        item.projectName ??
        item.sprintName ??
        item.Name ??
        item.Title ??
        item.FullName ??
        item.TaskTitle ??
        item.ProjectName ??
        item.SprintName ??
        fallback
    );
};

const getRole = (member) => {
    if (!member) return "";

    return (
        member.role ??
        member.contributorType ??
        member.contributorTypeName ??
        member.user?.role ??
        member.user?.contributorType ??
        member.Role ??
        member.ContributorType ??
        member.ContributorTypeName ??
        ""
    );
};

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.response?.data?.title ??
        error?.message ??
        "Unable to create task. Please try again."
    );
};

// ============================================================
// PROJECT ID INHERITANCE
//
// The Team Leader does NOT select the project.
//
// The project should come from:
// 1. parentTask.projectId
// 2. parentTask.ProjectId
// 3. parentTask.project.id
// 4. parentTask.project.projectId
// 5. parentTask.project
//
// This keeps project ownership controlled by the Manager/
// backend context.
// ============================================================

const getInheritedProjectId = (parentTask) => {
    if (!parentTask) {
        return null;
    }

    return (
        parentTask.projectId ??
        parentTask.ProjectId ??
        parentTask.project?.id ??
        parentTask.project?.projectId ??
        parentTask.project?.Id ??
        parentTask.project?.ProjectId ??
        null
    );
};

// ============================================================
// COMPONENT
// ============================================================

function CreateTask({
    isOpen = true,
    onClose,

    // --------------------------------------------------------
    // Optional parent task.
    //
    // When supplied:
    // - new task becomes a subtask
    // - project is inherited from this task
    // --------------------------------------------------------
    parentTask = null,

    // --------------------------------------------------------
    // Data supplied by parent/container.
    // --------------------------------------------------------
    sprints = [],
    tasks = [],
    teamMembers = [],
    contributors = [],

    // --------------------------------------------------------
    // Optional initial sprint.
    // --------------------------------------------------------
    initialSprintId = "",

    // --------------------------------------------------------
    // Authorization.
    // Backend MUST still enforce this.
    // --------------------------------------------------------
    canCreate = true,

    // --------------------------------------------------------
    // Parent handles actual API operation.
    // --------------------------------------------------------
    onCreateTask,

    // --------------------------------------------------------
    // Optional callback after successful creation.
    // --------------------------------------------------------
    onSuccess,
}) {
    // ========================================================
    // INHERITED PROJECT
    // ========================================================

    const inheritedProjectId = useMemo(
        () =>
            getInheritedProjectId(
                parentTask
            ),
        [parentTask]
    );

    // ========================================================
    // FORM STATE
    // ========================================================

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [taskType, setTaskType] =
        useState(
            parentTask
                ? "Subtask"
                : "Task"
        );

    const [priority, setPriority] =
        useState("Medium");

    const [sprintId, setSprintId] =
        useState(
            String(initialSprintId || "")
        );

    const [
        assignedContributorId,
        setAssignedContributorId,
    ] = useState("");

    const [estimatedEffort, setEstimatedEffort] =
        useState("");

    const [deadline, setDeadline] =
        useState("");

    const [dependencyIds, setDependencyIds] =
        useState([]);

    // ========================================================
    // UI STATE
    // ========================================================

    const [dependencyOpen, setDependencyOpen] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [isCreating, setIsCreating] =
        useState(false);

    // ========================================================
    // AVAILABLE CONTRIBUTORS
    // ========================================================

    const availableContributors = useMemo(() => {
        const source =
            Array.isArray(teamMembers) &&
            teamMembers.length > 0
                ? teamMembers
                : contributors;

        if (!Array.isArray(source)) {
            return [];
        }

        return source.filter((member) => {
            const role = String(
                getRole(member)
            )
                .trim()
                .toLowerCase();

            return (
                role === "developer" ||
                role === "staff"
            );
        });
    }, [
        teamMembers,
        contributors,
    ]);

    // ========================================================
    // AVAILABLE SPRINTS
    //
    // Sprints are filtered using the inherited project.
    //
    // The Team Leader does not select a project.
    // ========================================================

    const availableSprints = useMemo(() => {
        if (!Array.isArray(sprints)) {
            return [];
        }

        if (!inheritedProjectId) {
            return sprints;
        }

        return sprints.filter((sprint) => {
            const sprintProjectId =
                sprint.projectId ??
                sprint.ProjectId ??
                sprint.project?.id ??
                sprint.project?.projectId ??
                sprint.project?.Id ??
                sprint.project?.ProjectId;

            // If the API does not expose the relationship,
            // allow the sprint to remain available.
            if (!sprintProjectId) {
                return true;
            }

            return (
                String(sprintProjectId) ===
                String(inheritedProjectId)
            );
        });
    }, [
        sprints,
        inheritedProjectId,
    ]);

    // ========================================================
    // AVAILABLE DEPENDENCIES
    //
    // Exclude:
    // - Parent task itself
    // - Tasks belonging to another project when project
    //   information is available
    // ========================================================

    const availableDependencies = useMemo(() => {
        if (!Array.isArray(tasks)) {
            return [];
        }

        const parentTaskId =
            getTaskId(parentTask);

        return tasks.filter((task) => {
            const taskId =
                getTaskId(task);

            if (!taskId) {
                return false;
            }

            // Cannot depend on itself / parent task.
            if (
                parentTaskId &&
                String(taskId) ===
                    String(parentTaskId)
            ) {
                return false;
            }

            // If project information exists, keep
            // dependencies inside the inherited project.
            if (inheritedProjectId) {
                const taskProjectId =
                    task.projectId ??
                    task.ProjectId ??
                    task.project?.id ??
                    task.project?.projectId;

                if (
                    taskProjectId &&
                    String(taskProjectId) !==
                        String(inheritedProjectId)
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [
        tasks,
        parentTask,
        inheritedProjectId,
    ]);

    // ========================================================
    // SELECTED CONTRIBUTOR
    // ========================================================

    const selectedContributor =
        useMemo(() => {
            return availableContributors.find(
                (member) =>
                    String(
                        getContributorId(
                            member
                        )
                    ) ===
                    String(
                        assignedContributorId
                    )
            );
        }, [
            availableContributors,
            assignedContributorId,
        ]);

    // ========================================================
    // INHERITED PROJECT NAME
    //
    // This is display-only information.
    // It is NOT selectable/editable.
    // ========================================================

    const inheritedProjectName =
        useMemo(() => {
            if (!parentTask) {
                return null;
            }

            return (
                parentTask.projectName ??
                parentTask.ProjectName ??
                parentTask.project?.name ??
                parentTask.project?.projectName ??
                parentTask.project?.Name ??
                parentTask.project?.ProjectName ??
                null
            );
        }, [parentTask]);

    // ========================================================
    // RESET FORM
    // ========================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setError("");
        setSuccess("");
        setIsCreating(false);

        setTitle("");
        setDescription("");

        setTaskType(
            parentTask
                ? "Subtask"
                : "Task"
        );

        setPriority("Medium");

        setSprintId(
            String(initialSprintId || "")
        );

        setAssignedContributorId("");

        setEstimatedEffort("");

        setDeadline("");

        setDependencyIds([]);

        setDependencyOpen(false);
    }, [
        isOpen,
        parentTask,
        initialSprintId,
    ]);

    // ========================================================
    // DEPENDENCY TOGGLE
    // ========================================================

    const toggleDependency = (
        taskId
    ) => {
        const normalizedId =
            String(taskId);

        setDependencyIds(
            (current) => {
                const exists =
                    current.some(
                        (id) =>
                            String(id) ===
                            normalizedId
                    );

                if (exists) {
                    return current.filter(
                        (id) =>
                            String(id) !==
                            normalizedId
                    );
                }

                return [
                    ...current,
                    taskId,
                ];
            }
        );

        setError("");
    };

    // ========================================================
    // CREATE TASK
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ----------------------------------------------------
        // AUTHORIZATION
        // ----------------------------------------------------

        if (!canCreate) {
            setError(
                "You are not authorised to create tasks for this project."
            );
            return;
        }

        // ----------------------------------------------------
        // PROJECT CONTEXT VALIDATION
        //
        // Project is no longer selected.
        //
        // If creating a subtask, project MUST be inherited
        // from the parent task.
        // ----------------------------------------------------

        if (
            parentTask &&
            !inheritedProjectId
        ) {
            setError(
                "The project could not be determined from the parent task."
            );
            return;
        }

        // ----------------------------------------------------
        // REQUIRED FIELD VALIDATION
        // ----------------------------------------------------

        if (
            !title.trim() ||
            !description.trim() ||
            !taskType ||
            !priority ||
            !assignedContributorId ||
            !estimatedEffort ||
            !deadline ||
            !sprintId
        ) {
            setError(
                "Please complete all required fields."
            );
            return;
        }

        // ----------------------------------------------------
        // EFFORT VALIDATION
        // ----------------------------------------------------

        const effort =
            Number(estimatedEffort);

        if (
            !Number.isFinite(effort) ||
            effort <= 0
        ) {
            setError(
                "Estimated effort must be greater than zero."
            );
            return;
        }

        // ----------------------------------------------------
        // DEADLINE VALIDATION
        // ----------------------------------------------------

        const deadlineDate =
            new Date(deadline);

        if (
            Number.isNaN(
                deadlineDate.getTime()
            )
        ) {
            setError(
                "Please enter a valid deadline."
            );
            return;
        }

        // ----------------------------------------------------
        // CONTRIBUTOR VALIDATION
        // ----------------------------------------------------

        const contributor =
            availableContributors.find(
                (member) =>
                    String(
                        getContributorId(
                            member
                        )
                    ) ===
                    String(
                        assignedContributorId
                    )
            );

        if (!contributor) {
            setError(
                "Team member not found."
            );
            return;
        }

        const contributorRole =
            String(
                getRole(contributor)
            )
                .trim()
                .toLowerCase();

        if (
            contributorRole !==
                "developer" &&
            contributorRole !== "staff"
        ) {
            setError(
                "Only Developer and Staff contributors can be assigned to this task."
            );
            return;
        }

        // ----------------------------------------------------
        // API CONNECTION VALIDATION
        // ----------------------------------------------------

        if (!onCreateTask) {
            setError(
                "Task creation is not connected to the task management service."
            );
            return;
        }

        // ====================================================
        // CREATE PAYLOAD
        //
        // IMPORTANT:
        // projectId is NOT entered by the Team Leader.
        //
        // It is inherited from the parent task.
        // ====================================================

        const payload = {
            title: title.trim(),

            description:
                description.trim(),

            taskType,

            priority,

            projectId:
                inheritedProjectId || null,

            sprintId,

            parentTaskId:
                getTaskId(parentTask) ||
                null,

            assignedContributorId:
                getContributorId(
                    contributor
                ),

            estimatedEffort:
                effort,

            deadline,

            dependencyIds,
        };

        try {
            setIsCreating(true);

            // ------------------------------------------------
            // Backend MUST perform:
            //
            // - Team Leader authorization
            // - Project membership verification
            // - Parent task verification
            // - Sprint/project relationship verification
            // - Contributor existence verification
            // - Contributor team membership verification
            // - Developer/Staff role verification
            // - Task creation
            // - Notification
            // - Activity/audit logging
            // ------------------------------------------------

            const createdTask =
                await Promise.resolve(
                    onCreateTask(
                        payload
                    )
                );

            setSuccess(
                "Task created successfully."
            );

            if (onSuccess) {
                await Promise.resolve(
                    onSuccess(
                        createdTask,
                        payload
                    )
                );
            }

            // Give the user time to see
            // the success state.
            if (onClose) {
                setTimeout(() => {
                    onClose();
                }, 900);
            }
        } catch (err) {
            console.error(
                "Create Task Error:",
                err
            );

            setError(
                getErrorMessage(err)
            );
        } finally {
            setIsCreating(false);
        }
    };

    // ========================================================
    // CLOSED STATE
    // ========================================================

    if (!isOpen) {
        return null;
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            {parentTask ? (
                                <GitBranch className="h-5 w-5" />
                            ) : (
                                <ClipboardList className="h-5 w-5" />
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                                {parentTask
                                    ? "Create Subtask"
                                    : "Create Team Task"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {parentTask
                                    ? "Create a subtask from the Manager-assigned work and assign it to a team contributor."
                                    : "Create a team-level task and assign it to an eligible Developer or Staff member."}
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            disabled={isCreating}
                            className="shrink-0 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                        >
                            <X className="h-5 w-5" />

                            <span className="sr-only">
                                Close
                            </span>
                        </Button>
                    )}
                </div>
            </div>

            {/* =================================================
                PARENT TASK
            ================================================= */}

            {parentTask && (
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">

                        <div className="flex items-start gap-3">

                            <GitBranch className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

                            <div className="min-w-0">

                                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                    Parent Task
                                </p>

                                <p className="mt-1 truncate font-semibold text-indigo-950">
                                    {getName(
                                        parentTask,
                                        "Manager-assigned task"
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-indigo-700">
                                    This task will be created as
                                    a subtask of the selected
                                    parent task.
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="px-6 py-6"
            >
                <div className="space-y-7">

                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <section>
                        <div className="mb-4">

                            <h3 className="text-sm font-semibold text-slate-900">
                                Task Information
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Provide the core information for
                                the new task.
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-5">

                            {/* TITLE */}

                            <div className="space-y-2">

                                <Label htmlFor="task-title">
                                    Task Title

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </Label>

                                <Input
                                    id="task-title"
                                    value={title}
                                    onChange={(event) => {
                                        setTitle(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter a clear task title"
                                    disabled={isCreating}
                                    maxLength={200}
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="space-y-2">

                                <Label htmlFor="task-description">
                                    Description

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </Label>

                                <Textarea
                                    id="task-description"
                                    value={description}
                                    onChange={(event) => {
                                        setDescription(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Describe what needs to be completed..."
                                    disabled={isCreating}
                                    rows={4}
                                    className="resize-none"
                                />

                                <p className="text-xs text-slate-400">
                                    Clearly describe the expected
                                    work and outcome.
                                </p>

                            </div>

                            {/* TYPE + PRIORITY */}

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                <div className="space-y-2">

                                    <Label>
                                        Task Type

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </Label>

                                    <Select
                                        value={taskType}
                                        onValueChange={
                                            setTaskType
                                        }
                                        disabled={
                                            isCreating ||
                                            Boolean(
                                                parentTask
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select task type" />
                                        </SelectTrigger>

                                        <SelectContent>

                                            <SelectItem value="Task">
                                                Team Task
                                            </SelectItem>

                                            <SelectItem value="Subtask">
                                                Subtask
                                            </SelectItem>

                                        </SelectContent>
                                    </Select>

                                </div>

                                <div className="space-y-2">

                                    <Label>
                                        Priority

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </Label>

                                    <Select
                                        value={priority}
                                        onValueChange={
                                            setPriority
                                        }
                                        disabled={
                                            isCreating
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>

                                        <SelectContent>

                                            <SelectItem value="Low">
                                                Low
                                            </SelectItem>

                                            <SelectItem value="Medium">
                                                Medium
                                            </SelectItem>

                                            <SelectItem value="High">
                                                High
                                            </SelectItem>

                                            <SelectItem value="Critical">
                                                Critical
                                            </SelectItem>

                                        </SelectContent>
                                    </Select>

                                </div>

                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        PROJECT / SPRINT
                    ================================================= */}

                    <section className="border-t border-slate-200 pt-7">

                        <div className="mb-4">

                            <h3 className="text-sm font-semibold text-slate-900">
                                Project & Sprint
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                The project is inherited from the
                                Manager-assigned work. Select the
                                related sprint.
                            </p>

                        </div>

                        <div className="space-y-5">

                            {/* =================================================
                                INHERITED PROJECT
                            ================================================= */}

                            <div className="space-y-2">

                                <Label>
                                    Project
                                </Label>

                                <div className="flex min-h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3">

                                    <div className="flex items-center gap-2">

                                        <ClipboardList className="h-4 w-4 text-slate-400" />

                                        <span className="text-sm font-medium text-slate-700">
                                            {inheritedProjectName ||
                                                (inheritedProjectId
                                                    ? "Assigned Project"
                                                    : "Project inherited from assigned work")}
                                        </span>

                                    </div>

                                </div>

                                <p className="text-xs text-slate-400">
                                    Project assignment is inherited
                                    automatically and cannot be changed
                                    by the Team Leader.
                                </p>

                            </div>

                            {/* =================================================
                                SPRINT
                            ================================================= */}

                            <div className="space-y-2">

                                <Label>
                                    Sprint

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </Label>

                                <Select
                                    value={sprintId}
                                    onValueChange={(value) => {
                                        setSprintId(
                                            value
                                        );
                                        setError("");
                                    }}
                                    disabled={
                                        isCreating
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sprint" />
                                    </SelectTrigger>

                                    <SelectContent>

                                        {availableSprints.length ===
                                        0 ? (
                                            <SelectItem
                                                value="none"
                                                disabled
                                            >
                                                No sprints available
                                            </SelectItem>
                                        ) : (
                                            availableSprints.map(
                                                (sprint) => {
                                                    const id =
                                                        getSprintId(
                                                            sprint
                                                        );

                                                    if (!id) {
                                                        return null;
                                                    }

                                                    return (
                                                        <SelectItem
                                                            key={id}
                                                            value={String(
                                                                id
                                                            )}
                                                        >
                                                            {getName(
                                                                sprint,
                                                                "Unnamed Sprint"
                                                            )}
                                                        </SelectItem>
                                                    );
                                                }
                                            )
                                        )}

                                    </SelectContent>
                                </Select>

                            </div>

                        </div>
                    </section>

                    {/* =================================================
                        ASSIGNMENT
                    ================================================= */}

                    <section className="border-t border-slate-200 pt-7">

                        <div className="mb-4">

                            <h3 className="text-sm font-semibold text-slate-900">
                                Assignment
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Assign the task to a Developer or
                                Staff member from your team.
                            </p>

                        </div>

                        <div className="space-y-4">

                            {/* ASSIGN TO */}

                            <div className="space-y-2">

                                <Label>
                                    Assign To

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </Label>

                                <Select
                                    value={
                                        assignedContributorId
                                    }
                                    onValueChange={(value) => {
                                        setAssignedContributorId(
                                            value
                                        );
                                        setError("");
                                    }}
                                    disabled={
                                        isCreating ||
                                        availableContributors.length ===
                                            0
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Developer or Staff" />
                                    </SelectTrigger>

                                    <SelectContent>

                                        {availableContributors.map(
                                            (member) => {
                                                const id =
                                                    getContributorId(
                                                        member
                                                    );

                                                if (!id) {
                                                    return null;
                                                }

                                                return (
                                                    <SelectItem
                                                        key={id}
                                                        value={String(
                                                            id
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2">

                                                            <Users className="h-4 w-4 text-slate-400" />

                                                            <span>
                                                                {getName(
                                                                    member,
                                                                    "Unnamed Contributor"
                                                                )}
                                                            </span>

                                                            <span className="text-xs text-slate-400">
                                                                —
                                                            </span>

                                                            <span className="text-xs text-slate-500">
                                                                {getRole(
                                                                    member
                                                                )}
                                                            </span>

                                                        </div>
                                                    </SelectItem>
                                                );
                                            }
                                        )}

                                    </SelectContent>
                                </Select>

                                {availableContributors.length ===
                                    0 && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">

                                        <div className="flex gap-2">

                                            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />

                                            <p className="text-xs text-amber-700">
                                                No eligible Developer
                                                or Staff contributors
                                                are currently
                                                available on your
                                                team.
                                            </p>

                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* SELECTED CONTRIBUTOR */}

                            {selectedContributor && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                            {getName(
                                                selectedContributor,
                                                "U"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-sm font-semibold text-slate-900">
                                                {getName(
                                                    selectedContributor,
                                                    "Unnamed Contributor"
                                                )}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {getRole(
                                                    selectedContributor
                                                )}
                                            </p>

                                        </div>

                                        <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />

                                    </div>
                                </div>
                            )}

                        </div>
                    </section>

                    {/* =================================================
                        ESTIMATION & DEADLINE
                    ================================================= */}

                    <section className="border-t border-slate-200 pt-7">

                        <div className="mb-4">

                            <h3 className="text-sm font-semibold text-slate-900">
                                Schedule & Effort
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Define the expected effort and
                                completion deadline.
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* ESTIMATED EFFORT */}

                            <div className="space-y-2">

                                <Label htmlFor="estimated-effort">
                                    Estimated Effort

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </Label>

                                <div className="relative">

                                    <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <Input
                                        id="estimated-effort"
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={
                                            estimatedEffort
                                        }
                                        onChange={(event) => {
                                            setEstimatedEffort(
                                                event.target.value
                                            );
                                            setError("");
                                        }}
                                        placeholder="e.g. 8"
                                        disabled={
                                            isCreating
                                        }
                                        className="pl-9 pr-16"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                        hours
                                    </span>

                                </div>
                            </div>

                            {/* DEADLINE */}

                            <div className="space-y-2">

                                <Label htmlFor="task-deadline">
                                    Deadline

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </Label>

                                <div className="relative">

                                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <Input
                                        id="task-deadline"
                                        type="date"
                                        value={
                                            deadline
                                        }
                                        onChange={(event) => {
                                            setDeadline(
                                                event.target.value
                                            );
                                            setError("");
                                        }}
                                        disabled={
                                            isCreating
                                        }
                                        className="pl-9"
                                    />

                                </div>
                            </div>

                        </div>
                    </section>

                    {/* =================================================
                        DEPENDENCIES
                    ================================================= */}

                    <section className="border-t border-slate-200 pt-7">

                        <div className="mb-4">

                            <h3 className="text-sm font-semibold text-slate-900">
                                Dependencies

                                <span className="ml-2 text-xs font-normal text-slate-400">
                                    Optional
                                </span>
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Select tasks that should be completed
                                before this task can proceed.
                            </p>

                        </div>

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setDependencyOpen(
                                        (current) =>
                                            !current
                                    )
                                }
                                disabled={
                                    isCreating ||
                                    availableDependencies.length ===
                                        0
                                }
                                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                            >
                                <span
                                    className={
                                        dependencyIds.length >
                                        0
                                            ? "text-slate-900"
                                            : "text-slate-400"
                                    }
                                >
                                    {dependencyIds.length >
                                    0
                                        ? `${dependencyIds.length} task${
                                              dependencyIds.length >
                                              1
                                                  ? "s"
                                                  : ""
                                          } selected`
                                        : "Select task dependencies"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>

                            {dependencyOpen &&
                                availableDependencies.length >
                                    0 && (
                                    <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">

                                        {availableDependencies.map(
                                            (dependency) => {
                                                const id =
                                                    getTaskId(
                                                        dependency
                                                    );

                                                const selected =
                                                    dependencyIds.some(
                                                        (
                                                            dependencyId
                                                        ) =>
                                                            String(
                                                                dependencyId
                                                            ) ===
                                                            String(
                                                                id
                                                            )
                                                    );

                                                return (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleDependency(
                                                                id
                                                            )
                                                        }
                                                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                                                            selected
                                                                ? "bg-indigo-50 text-indigo-700"
                                                                : "hover:bg-slate-50"
                                                        }`}
                                                    >

                                                        <div
                                                            className={`flex h-4 w-4 items-center justify-center rounded border ${
                                                                selected
                                                                    ? "border-indigo-600 bg-indigo-600"
                                                                    : "border-slate-300"
                                                            }`}
                                                        >
                                                            {selected && (
                                                                <CheckCircle2 className="h-3 w-3 text-white" />
                                                            )}
                                                        </div>

                                                        <span className="truncate">
                                                            {getName(
                                                                dependency,
                                                                "Untitled Task"
                                                            )}
                                                        </span>

                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                        </div>

                        {dependencyIds.length >
                            0 && (
                            <div className="mt-3 flex flex-wrap gap-2">

                                {dependencyIds.map(
                                    (
                                        dependencyId
                                    ) => {
                                        const dependency =
                                            availableDependencies.find(
                                                (
                                                    item
                                                ) =>
                                                    String(
                                                        getTaskId(
                                                            item
                                                        )
                                                    ) ===
                                                    String(
                                                        dependencyId
                                                    )
                                            );

                                        return (
                                            <span
                                                key={
                                                    dependencyId
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                                            >

                                                {getName(
                                                    dependency,
                                                    "Task"
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleDependency(
                                                            dependencyId
                                                        )
                                                    }
                                                    className="rounded-full hover:bg-indigo-100"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>

                                            </span>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </section>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 p-4"
                        >
                            <div className="flex items-start gap-3">

                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                                <div>

                                    <p className="text-sm font-semibold text-red-800">
                                        Unable to create task
                                    </p>

                                    <p className="mt-1 text-sm text-red-700">
                                        {error}
                                    </p>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success && (
                        <div
                            role="status"
                            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                        >
                            <div className="flex items-center gap-3">

                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                                <p className="text-sm font-medium text-emerald-700">
                                    {success}
                                </p>

                            </div>
                        </div>
                    )}

                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

                    {onClose && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isCreating}
                            className="sm:min-w-28"
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            isCreating ||
                            !canCreate ||
                            !title.trim() ||
                            !description.trim() ||
                            !sprintId ||
                            !assignedContributorId ||
                            !estimatedEffort ||
                            !deadline ||
                            availableContributors.length ===
                                0
                        }
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700 sm:min-w-40"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4" />
                                Create Task
                            </>
                        )}
                    </Button>

                </div>
            </form>
        </div>
    );
}

// ============================================================
// EXPORT
// ============================================================

export default CreateTask;