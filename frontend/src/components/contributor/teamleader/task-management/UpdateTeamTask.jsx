import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Save,
    X,
} from "lucide-react";

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

import { Checkbox } from "@/components/ui/checkbox";

// ============================================================
// AIPMS — TEAM LEADER
// TASK-002 — UPDATE TASK
//
// Primary Actor:
// Team Leader
//
// Purpose:
// Allow the Team Leader to modify an existing team task.
//
// Editable information:
// - Task title
// - Task description
// - Task priority
// - Assigned Staff / Developer
// - Estimated effort
// - Deadline
// - Task dependencies
// - Related sprint
//
// Business rules:
// - Task must exist.
// - Team Leader must have access.
// - Task must belong to the Team Leader's team
//   or have been created by the Team Leader.
// - Assigned contributor must be valid.
// - Project is inherited from the existing task.
// - Sprint must belong to the task's project.
// - Backend remains the final authority for authorization.
// ============================================================

// ============================================================
// API CLIENT
// ============================================================

const API_BASE_URL = "http://localhost:5043/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ============================================================
// CONSTANTS
// ============================================================

const PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical",
];

// ============================================================
// EMPTY FORM
// ============================================================

const EMPTY_FORM = {
    sprintId: "",
    parentTaskId: "",
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    estimatedEffort: "",
    deadline: "",
    dependencyIds: [],
};

// ============================================================
// TOKEN
// ============================================================

const getStoredToken = () => {
    const keys = [
        "token",
        "accessToken",
        "access_token",
        "jwt",
    ];

    for (const key of keys) {
        const value = localStorage.getItem(key);

        if (value) {
            return value;
        }
    }

    return null;
};

const getAuthHeaders = () => {
    const token = getStoredToken();

    return token
        ? {
              Authorization: `Bearer ${token}`,
          }
        : {};
};

// ============================================================
// RESPONSE NORMALIZATION
// ============================================================

const getArray = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    return (
        data?.items ||
        data?.data ||
        data?.results ||
        []
    );
};

// ============================================================
// ENTITY HELPERS
// ============================================================

const getEntityId = (item) => {
    return item?.id ?? item?.Id ?? "";
};

const getTaskId = (item) => {
    return (
        item?.id ??
        item?.Id ??
        item?.taskId ??
        item?.TaskId ??
        ""
    );
};

const getProjectId = (item) => {
    return (
        item?.projectId ??
        item?.ProjectId ??
        item?.project?.id ??
        item?.project?.Id ??
        ""
    );
};

const getSprintId = (item) => {
    return (
        item?.sprintId ??
        item?.SprintId ??
        item?.sprint?.id ??
        item?.sprint?.Id ??
        ""
    );
};

const getContributorId = (item) => {
    return (
        item?.userId ??
        item?.UserId ??
        item?.contributorId ??
        item?.ContributorId ??
        item?.id ??
        item?.Id ??
        ""
    );
};

const getDisplayName = (item) => {
    return (
        item?.name ??
        item?.Name ??
        item?.title ??
        item?.Title ??
        ""
    );
};

const getContributorName = (item) => {
    return (
        item?.fullName ??
        item?.FullName ??
        item?.name ??
        item?.Name ??
        item?.email ??
        item?.Email ??
        "Unknown contributor"
    );
};

// ============================================================
// DATE HELPERS
// ============================================================

const formatDateTimeLocal = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    const hours = String(
        date.getHours()
    ).padStart(2, "0");

    const minutes = String(
        date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ============================================================
// ERROR MESSAGE
// ============================================================

const getBackendErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.title ||
        ""
    );
};

// ============================================================
// COMPONENT
// ============================================================

export default function UpdateTask({
    taskId,
    task,
    onTaskUpdated,
    onCancel,
}) {
    const [form, setForm] = useState(EMPTY_FORM);

    const [sprints, setSprints] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [contributors, setContributors] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingSprints, setLoadingSprints] =
        useState(false);
    const [loadingTasks, setLoadingTasks] =
        useState(false);
    const [loadingContributors, setLoadingContributors] =
        useState(false);

    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] =
        useState("");

    // ========================================================
    // CURRENT TASK ID
    // ========================================================

    const currentTaskId = useMemo(
        () =>
            taskId ??
            getTaskId(task),
        [taskId, task]
    );

    // ========================================================
    // INHERITED PROJECT
    // ========================================================

    const inheritedProjectId = useMemo(
        () => getProjectId(task),
        [task]
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        initialize();
    }, [currentTaskId]);

    // ========================================================
    // INITIALIZE
    // ========================================================

    const initialize = async () => {
        setLoading(true);
        setServerError("");

        try {
            if (task) {
                await populateTask(task);
            } else if (currentTaskId) {
                await loadTask(currentTaskId);
            } else {
                setServerError(
                    "Task not found."
                );
            }

            await loadContributors();
        } catch (error) {
            console.error(
                "Unable to initialize update task:",
                error
            );

            setServerError(
                "Unable to load task. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // LOAD TASK
    // ========================================================

    const loadTask = async (id) => {
        try {
            const response = await api.get(
                `/tasks/${id}`,
                {
                    headers: getAuthHeaders(),
                }
            );

            const loadedTask =
                response.data?.data ??
                response.data;

            if (!loadedTask) {
                setServerError(
                    "Task not found."
                );

                return;
            }

            await populateTask(loadedTask);
        } catch (error) {
            console.error(
                "Unable to load task:",
                error
            );

            if (
                error.response?.status ===
                404
            ) {
                setServerError(
                    "Task not found."
                );
            } else if (
                error.response?.status ===
                403
            ) {
                setServerError(
                    "You are not authorised to update this task."
                );
            } else {
                setServerError(
                    "Unable to load task. Please try again."
                );
            }
        }
    };

    // ========================================================
    // POPULATE FORM
    // ========================================================

    const populateTask = async (data) => {
        if (!data) {
            setServerError(
                "Task not found."
            );

            return;
        }

        const projectId =
            getProjectId(data);

        const sprintId =
            getSprintId(data);

        const parentTaskId =
            data?.parentTaskId ??
            data?.ParentTaskId ??
            "";

        const assignedTo =
            data?.assignedTo ??
            data?.AssignedTo ??
            data?.assignedUserId ??
            data?.AssignedUserId ??
            data?.assigneeId ??
            data?.AssigneeId ??
            "";

        const dependencyIds =
            data?.dependencyIds ??
            data?.DependencyIds ??
            data?.dependencies?.map(
                (dependency) =>
                    getTaskId(dependency)
            ) ??
            [];

        setForm({
            sprintId,
            parentTaskId,
            title:
                data?.title ??
                data?.Title ??
                "",
            description:
                data?.description ??
                data?.Description ??
                "",
            priority:
                data?.priority ??
                data?.Priority ??
                "Medium",
            assignedTo,
            estimatedEffort:
                data?.estimatedEffort ??
                data?.EstimatedEffort ??
                "",
            deadline: formatDateTimeLocal(
                data?.deadline ??
                    data?.Deadline
            ),
            dependencyIds:
                Array.isArray(
                    dependencyIds
                )
                    ? dependencyIds
                    : [],
        });

        if (projectId) {
            await Promise.all([
                loadSprints(projectId),
                loadTasks(
                    projectId,
                    sprintId
                ),
            ]);
        } else {
            setSprints([]);
            setTasks([]);
        }
    };

    // ========================================================
    // LOAD SPRINTS
    // ========================================================

    const loadSprints = async (projectId) => {
        if (!projectId) {
            setSprints([]);
            return;
        }

        setLoadingSprints(true);

        try {
            const response =
                await api.get(
                    `/projects/${projectId}/sprints`,
                    {
                        headers:
                            getAuthHeaders(),
                    }
                );

            setSprints(
                getArray(
                    response.data
                )
            );
        } catch (error) {
            console.error(
                "Unable to load sprints:",
                error
            );

            setSprints([]);

            setServerError(
                "Unable to load sprints. Please try again."
            );
        } finally {
            setLoadingSprints(false);
        }
    };

    // ========================================================
    // LOAD TASKS
    // ========================================================

    const loadTasks = async (
        projectId,
        sprintId
    ) => {
        if (!projectId) {
            setTasks([]);
            return;
        }

        setLoadingTasks(true);

        try {
            let url =
                `/projects/${projectId}/tasks`;

            if (sprintId) {
                url =
                    `/projects/${projectId}/sprints/${sprintId}/tasks`;
            }

            const response =
                await api.get(url, {
                    headers:
                        getAuthHeaders(),
                });

            setTasks(
                getArray(
                    response.data
                )
            );
        } catch (error) {
            console.error(
                "Unable to load tasks:",
                error
            );

            setTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    };

    // ========================================================
    // LOAD CONTRIBUTORS
    // ========================================================

    const loadContributors = async () => {
        setLoadingContributors(true);

        try {
            const response =
                await api.get(
                    "/contributors/team-members",
                    {
                        headers:
                            getAuthHeaders(),
                    }
                );

            const members =
                getArray(
                    response.data
                );

            // Only Staff and Developer
            const eligibleMembers =
                members.filter(
                    (member) => {
                        const role =
                            String(
                                member?.role ??
                                    member?.Role ??
                                    member?.contributorType ??
                                    member?.ContributorType ??
                                    ""
                            ).toLowerCase();

                        return (
                            role ===
                                "developer" ||
                            role ===
                                "staff"
                        );
                    }
                );

            setContributors(
                eligibleMembers
            );
        } catch (error) {
            console.error(
                "Unable to load contributors:",
                error
            );

            setContributors([]);
        } finally {
            setLoadingContributors(false);
        }
    };

    // ========================================================
    // HANDLE INPUT CHANGE
    // ========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setServerError("");
        setSuccessMessage("");
    };

    // ========================================================
    // SPRINT CHANGE
    // ========================================================

    const handleSprintChange = async (
        value
    ) => {
        setForm((previous) => ({
            ...previous,
            sprintId:
                value === "none"
                    ? ""
                    : value,
            parentTaskId: "",
            dependencyIds: [],
        }));

        setErrors((previous) => ({
            ...previous,
            sprintId: "",
        }));

        setServerError("");
        setSuccessMessage("");

        if (inheritedProjectId) {
            await loadTasks(
                inheritedProjectId,
                value === "none"
                    ? ""
                    : value
            );
        }
    };

    // ========================================================
    // SELECT CHANGE
    // ========================================================

    const handleSelectChange = (
        name,
        value
    ) => {
        setForm((previous) => ({
            ...previous,
            [name]:
                value === "none"
                    ? ""
                    : value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setServerError("");
        setSuccessMessage("");
    };

    // ========================================================
    // DEPENDENCY CHANGE
    // ========================================================

    const handleDependencyChange = (
        dependencyId,
        checked
    ) => {
        setForm((previous) => {
            const dependencyIds =
                checked
                    ? [
                          ...new Set([
                              ...previous.dependencyIds,
                              dependencyId,
                          ]),
                      ]
                    : previous.dependencyIds.filter(
                          (id) =>
                              id !==
                              dependencyId
                      );

            return {
                ...previous,
                dependencyIds,
            };
        });

        setServerError("");
        setSuccessMessage("");
    };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {
        const validationErrors = {};

        if (!currentTaskId) {
            validationErrors.task =
                "Task not found.";
        }

        if (!inheritedProjectId) {
            validationErrors.project =
                "Task project could not be determined.";
        }

        if (!form.sprintId) {
            validationErrors.sprintId =
                "Please complete all required fields.";
        }

        if (!form.title.trim()) {
            validationErrors.title =
                "Please complete all required fields.";
        } else if (
            form.title.trim().length >
            200
        ) {
            validationErrors.title =
                "Task title cannot exceed 200 characters.";
        }

        if (!form.description.trim()) {
            validationErrors.description =
                "Please complete all required fields.";
        }

        if (!form.priority) {
            validationErrors.priority =
                "Please complete all required fields.";
        }

        if (
            form.estimatedEffort !==
                "" &&
            (
                Number.isNaN(
                    Number(
                        form.estimatedEffort
                    )
                ) ||
                Number(
                    form.estimatedEffort
                ) <= 0
            )
        ) {
            validationErrors.estimatedEffort =
                "Estimated effort must be greater than zero.";
        }

        if (form.deadline) {
            const deadline =
                new Date(
                    form.deadline
                );

            if (
                Number.isNaN(
                    deadline.getTime()
                )
            ) {
                validationErrors.deadline =
                    "Invalid deadline.";
            }
        }

        if (
            form.assignedTo &&
            !contributors.some(
                (member) =>
                    String(
                        getContributorId(
                            member
                        )
                    ) ===
                    String(
                        form.assignedTo
                    )
            )
        ) {
            validationErrors.assignedTo =
                "Team member not found.";
        }

        setErrors(
            validationErrors
        );

        return (
            Object.keys(
                validationErrors
            ).length === 0
        );
    };

    // ========================================================
    // UPDATE TASK
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setServerError("");
        setSuccessMessage("");

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const payload = {
                // Project is inherited from
                // the existing task.
                projectId:
                    inheritedProjectId,

                sprintId:
                    form.sprintId,

                parentTaskId:
                    form.parentTaskId ||
                    null,

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                priority:
                    form.priority,

                assignedTo:
                    form.assignedTo ||
                    null,

                estimatedEffort:
                    form.estimatedEffort ===
                    ""
                        ? null
                        : Number(
                              form.estimatedEffort
                          ),

                deadline:
                    form.deadline ||
                    null,

                dependencyIds:
                    form.dependencyIds,
            };

            // =================================================
            // TASK-002 API
            // =================================================

            const response =
                await api.put(
                    `/tasks/team/${currentTaskId}`,
                    payload,
                    {
                        headers:
                            getAuthHeaders(),
                    }
                );

            const updatedTask =
                response.data?.data ??
                response.data;

            setSuccessMessage(
                "Task updated successfully."
            );

            if (onTaskUpdated) {
                onTaskUpdated(
                    updatedTask
                );
            }
        } catch (error) {
            console.error(
                "Update task error:",
                error
            );

            const status =
                error.response?.status;

            const backendMessage =
                getBackendErrorMessage(
                    error
                );

            if (status === 404) {
                setServerError(
                    "Task not found."
                );
            } else if (
                status === 403
            ) {
                setServerError(
                    "You are not authorised to update this task."
                );
            } else if (
                status === 400
            ) {
                setServerError(
                    backendMessage ||
                        "Please complete all required fields."
                );
            } else {
                setServerError(
                    "Unable to update task. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-4xl rounded-xl border bg-white shadow-sm">
                <div className="flex min-h-[420px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-7 w-7 animate-spin text-gray-500" />

                        <p className="text-sm text-muted-foreground">
                            Loading task...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl border bg-white shadow-sm">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="border-b px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            Update Team Task
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Modify the task information
                            and save the latest changes.
                        </p>
                    </div>

                    <div className="rounded-lg bg-muted px-3 py-2">
                        <p className="text-xs font-medium text-muted-foreground">
                            TASK ID
                        </p>

                        <p className="mt-0.5 max-w-[150px] truncate text-xs font-mono">
                            {currentTaskId ||
                                "Unavailable"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {serverError && (
                <div className="mx-6 mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>
                        {serverError}
                    </span>
                </div>
            )}

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div className="mx-6 mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>
                        {successMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {/* ==================================================
                    PROJECT CONTEXT
                    Project is inherited, NOT SELECTABLE.
                ================================================== */}

                <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <Label>
                                Project
                            </Label>

                            <p className="mt-1 text-xs text-muted-foreground">
                                The project is inherited
                                from the existing task
                                and cannot be changed
                                during task update.
                            </p>
                        </div>

                        <div className="rounded-md border bg-white px-3 py-2">
                            <span className="font-mono text-xs text-muted-foreground">
                                {inheritedProjectId ||
                                    "Unavailable"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    SPRINT / PARENT TASK
                ================================================== */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* SPRINT */}

                    <div className="space-y-2">
                        <Label htmlFor="sprintId">
                            Related Sprint
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <Select
                            value={
                                form.sprintId ||
                                "none"
                            }
                            onValueChange={
                                handleSprintChange
                            }
                            disabled={
                                !inheritedProjectId ||
                                loadingSprints
                            }
                        >
                            <SelectTrigger
                                id="sprintId"
                                className={
                                    errors.sprintId
                                        ? "border-red-400"
                                        : ""
                                }
                            >
                                <SelectValue
                                    placeholder={
                                        loadingSprints
                                            ? "Loading sprints..."
                                            : "Select sprint"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="none">
                                    Select sprint
                                </SelectItem>

                                {sprints.map(
                                    (sprint) => {
                                        const id =
                                            getEntityId(
                                                sprint
                                            );

                                        return (
                                            <SelectItem
                                                key={
                                                    id
                                                }
                                                value={String(
                                                    id
                                                )}
                                            >
                                                {getDisplayName(
                                                    sprint
                                                ) ||
                                                    `Sprint ${id}`}
                                            </SelectItem>
                                        );
                                    }
                                )}
                            </SelectContent>
                        </Select>

                        {errors.sprintId && (
                            <p className="text-xs text-red-500">
                                {
                                    errors.sprintId
                                }
                            </p>
                        )}
                    </div>

                    {/* PARENT TASK */}

                    <div className="space-y-2">
                        <Label htmlFor="parentTaskId">
                            Parent Task
                        </Label>

                        <Select
                            value={
                                form.parentTaskId ||
                                "none"
                            }
                            onValueChange={(
                                value
                            ) =>
                                handleSelectChange(
                                    "parentTaskId",
                                    value
                                )
                            }
                            disabled={
                                !inheritedProjectId ||
                                loadingTasks
                            }
                        >
                            <SelectTrigger id="parentTaskId">
                                <SelectValue placeholder="No parent task" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="none">
                                    No parent task
                                </SelectItem>

                                {tasks.map(
                                    (item) => {
                                        const id =
                                            getTaskId(
                                                item
                                            );

                                        if (
                                            String(
                                                id
                                            ) ===
                                            String(
                                                currentTaskId
                                            )
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <SelectItem
                                                key={
                                                    id
                                                }
                                                value={String(
                                                    id
                                                )}
                                            >
                                                {getDisplayName(
                                                    item
                                                ) ||
                                                    `Task ${id}`}
                                            </SelectItem>
                                        );
                                    }
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ==================================================
                    TITLE
                ================================================== */}

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="title">
                            Task Title
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <span className="text-xs text-muted-foreground">
                            {
                                form.title.length
                            }
                            /200
                        </span>
                    </div>

                    <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={
                            handleChange
                        }
                        maxLength={200}
                        placeholder="Enter task title"
                        className={
                            errors.title
                                ? "border-red-400"
                                : ""
                        }
                    />

                    {errors.title && (
                        <p className="text-xs text-red-500">
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="space-y-2">
                    <Label htmlFor="description">
                        Task Description
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </Label>

                    <Textarea
                        id="description"
                        name="description"
                        value={
                            form.description
                        }
                        onChange={
                            handleChange
                        }
                        rows={5}
                        placeholder="Describe the task requirements..."
                        className={
                            errors.description
                                ? "border-red-400"
                                : ""
                        }
                    />

                    {errors.description && (
                        <p className="text-xs text-red-500">
                            {
                                errors.description
                            }
                        </p>
                    )}
                </div>

                {/* ==================================================
                    PRIORITY / EFFORT
                ================================================== */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* PRIORITY */}

                    <div className="space-y-2">
                        <Label htmlFor="priority">
                            Priority
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <Select
                            value={
                                form.priority
                            }
                            onValueChange={(
                                value
                            ) =>
                                handleSelectChange(
                                    "priority",
                                    value
                                )
                            }
                        >
                            <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>

                            <SelectContent>
                                {PRIORITIES.map(
                                    (priority) => (
                                        <SelectItem
                                            key={
                                                priority
                                            }
                                            value={
                                                priority
                                            }
                                        >
                                            {
                                                priority
                                            }
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>

                        {errors.priority && (
                            <p className="text-xs text-red-500">
                                {
                                    errors.priority
                                }
                            </p>
                        )}
                    </div>

                    {/* EFFORT */}

                    <div className="space-y-2">
                        <Label htmlFor="estimatedEffort">
                            Estimated Effort
                        </Label>

                        <Input
                            id="estimatedEffort"
                            name="estimatedEffort"
                            type="number"
                            min="0"
                            step="0.5"
                            value={
                                form.estimatedEffort
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. 8"
                            className={
                                errors.estimatedEffort
                                    ? "border-red-400"
                                    : ""
                            }
                        />

                        <p className="text-xs text-muted-foreground">
                            Enter the estimated
                            effort required to
                            complete the task.
                        </p>

                        {errors.estimatedEffort && (
                            <p className="text-xs text-red-500">
                                {
                                    errors.estimatedEffort
                                }
                            </p>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    ASSIGNED CONTRIBUTOR
                ================================================== */}

                <div className="space-y-2">
                    <Label htmlFor="assignedTo">
                        Assigned Staff / Developer
                    </Label>

                    <Select
                        value={
                            form.assignedTo ||
                            "none"
                        }
                        onValueChange={(
                            value
                        ) =>
                            handleSelectChange(
                                "assignedTo",
                                value
                            )
                        }
                        disabled={
                            loadingContributors
                        }
                    >
                        <SelectTrigger id="assignedTo">
                            <SelectValue
                                placeholder={
                                    loadingContributors
                                        ? "Loading team members..."
                                        : "Select team member"
                                }
                            />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="none">
                                Leave unassigned
                            </SelectItem>

                            {contributors.map(
                                (
                                    contributor
                                ) => {
                                    const id =
                                        getContributorId(
                                            contributor
                                        );

                                    return (
                                        <SelectItem
                                            key={
                                                id
                                            }
                                            value={String(
                                                id
                                            )}
                                        >
                                            {getContributorName(
                                                contributor
                                            )}
                                        </SelectItem>
                                    );
                                }
                            )}
                        </SelectContent>
                    </Select>

                    <p className="text-xs text-muted-foreground">
                        Only Staff and Developers
                        from the Team Leader's
                        available team members are
                        shown. The backend must
                        perform the final team-membership
                        validation.
                    </p>

                    {errors.assignedTo && (
                        <p className="text-xs text-red-500">
                            {
                                errors.assignedTo
                            }
                        </p>
                    )}
                </div>

                {/* ==================================================
                    DEADLINE
                ================================================== */}

                <div className="space-y-2">
                    <Label htmlFor="deadline">
                        Deadline
                    </Label>

                    <Input
                        id="deadline"
                        name="deadline"
                        type="datetime-local"
                        value={
                            form.deadline
                        }
                        onChange={
                            handleChange
                        }
                        className={
                            errors.deadline
                                ? "border-red-400"
                                : ""
                        }
                    />

                    {errors.deadline && (
                        <p className="text-xs text-red-500">
                            {
                                errors.deadline
                            }
                        </p>
                    )}
                </div>

                {/* ==================================================
                    DEPENDENCIES
                ================================================== */}

                <div className="space-y-3">
                    <div>
                        <Label>
                            Task Dependencies
                        </Label>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Select tasks that must be
                            completed before this task
                            can proceed.
                        </p>
                    </div>

                    {!inheritedProjectId ? (
                        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                            The task project could
                            not be determined.
                        </div>
                    ) : loadingTasks ? (
                        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading available tasks...
                        </div>
                    ) : tasks.length ===
                      0 ? (
                        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                            No other tasks are
                            available.
                        </div>
                    ) : (
                        <div className="max-h-52 overflow-y-auto rounded-lg border p-3">
                            <div className="space-y-2">
                                {tasks.map(
                                    (
                                        item
                                    ) => {
                                        const id =
                                            getTaskId(
                                                item
                                            );

                                        if (
                                            String(
                                                id
                                            ) ===
                                            String(
                                                currentTaskId
                                            )
                                        ) {
                                            return null;
                                        }

                                        if (
                                            String(
                                                id
                                            ) ===
                                            String(
                                                form.parentTaskId
                                            )
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <label
                                                key={
                                                    id
                                                }
                                                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50"
                                            >
                                                <Checkbox
                                                    checked={form.dependencyIds.includes(
                                                        id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleDependencyChange(
                                                            id,
                                                            checked ===
                                                                true
                                                        )
                                                    }
                                                />

                                                <span className="text-sm">
                                                    {getDisplayName(
                                                        item
                                                    ) ||
                                                        `Task ${id}`}
                                                </span>
                                            </label>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleCancel
                        }
                        disabled={saving}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={
                            saving ||
                            !currentTaskId
                        }
                        className="gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}