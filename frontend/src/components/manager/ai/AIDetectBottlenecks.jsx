import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Filter,
    Info,
    Layers3,
    Loader2,
    RefreshCw,
    Search,
    ShieldAlert,
    Target,
    UsersRound,
    XCircle,
    Zap,
} from "lucide-react";

// ============================================================
// AI-009
// DETECT PROJECT BOTTLENECKS
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// Important:
// - Uses actual available project/task/sprint/team data.
// - Does NOT create fake project/task/team records.
// - Does NOT modify project data.
// - Bottleneck thresholds are configurable.
// - Results are recalculated from current data.
// ============================================================


// ============================================================
// STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
    USERS: "aipms_users",
    PROJECTS: "aipms_projects",
    TASKS: "aipms_tasks",
    SPRINTS: "aipms_sprints",
    TEAMS: "aipms_teams",
    CURRENT_USER: "aipms_current_user",
};


// ============================================================
// DEFAULT CONFIGURATION
// ============================================================

const DEFAULT_CONFIG = {
    overdueDays: 1,
    blockedThreshold: 1,
    dependencyThreshold: 2,
    repeatedDelayThreshold: 2,
    workloadThreshold: 90,
    capacityThreshold: 90,
    sprintDelayDays: 1,
    minimumImpactScore: 20,
};


// ============================================================
// SAFE LOCAL STORAGE
// ============================================================

function readStorage(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        const parsed = JSON.parse(value);

        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}


// ============================================================
// HELPERS
// ============================================================

function normalizeArray(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && typeof value === "object") {
        if (Array.isArray(value.items)) {
            return value.items;
        }

        if (Array.isArray(value.data)) {
            return value.data;
        }

        if (Array.isArray(value.results)) {
            return value.results;
        }
    }

    return [];
}


function getId(item) {
    if (!item) {
        return null;
    }

    return (
        item.id ??
        item._id ??
        item.projectId ??
        item.taskId ??
        item.sprintId ??
        item.userId ??
        null
    );
}


function getProjectId(item) {
    if (!item) {
        return null;
    }

    return (
        item.projectId ??
        item.projectID ??
        item.project_id ??
        item.project?.id ??
        item.project?._id ??
        null
    );
}


function getTaskId(item) {
    if (!item) {
        return null;
    }

    return (
        item.taskId ??
        item.taskID ??
        item.task_id ??
        item.id ??
        item._id ??
        null
    );
}


function getName(item, fallback = "Unnamed") {
    if (!item) {
        return fallback;
    }

    return (
        item.name ??
        item.title ??
        item.projectName ??
        item.taskName ??
        item.sprintName ??
        item.fullName ??
        fallback
    );
}


function normalizeStatus(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]/g, " ");
}


function isCompletedStatus(status) {
    const value = normalizeStatus(status);

    return [
        "completed",
        "complete",
        "done",
        "closed",
        "finished",
        "resolved",
    ].includes(value);
}


function isBlockedStatus(status) {
    const value = normalizeStatus(status);

    return [
        "blocked",
        "blocking",
        "blocked task",
    ].includes(value);
}


function isOverdue(task, now = new Date()) {
    if (!task) {
        return false;
    }

    if (isCompletedStatus(task.status)) {
        return false;
    }

    const deadline =
        task.dueDate ??
        task.deadline ??
        task.endDate ??
        task.targetDate;

    if (!deadline) {
        return false;
    }

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    return date.getTime() < now.getTime();
}


function daysBetween(from, to) {
    const first = new Date(from);
    const second = new Date(to);

    if (
        Number.isNaN(first.getTime()) ||
        Number.isNaN(second.getTime())
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.ceil(
            (second.getTime() - first.getTime()) /
                (1000 * 60 * 60 * 24)
        )
    );
}


function formatDate(value) {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString();
}


function formatPercent(value) {
    if (!Number.isFinite(Number(value))) {
        return "0%";
    }

    return `${Math.round(Number(value))}%`;
}


function clamp(value, min, max) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}


function uniqueById(items) {
    const map = new Map();

    items.forEach((item) => {
        const id = getId(item);

        if (id !== null && id !== undefined) {
            map.set(String(id), item);
        }
    });

    return Array.from(map.values());
}


// ============================================================
// PROJECT AUTHORIZATION
// ============================================================

function hasProjectAccess(user, project) {
    if (!user || !project) {
        return false;
    }

    const role = normalizeStatus(user.role);

    // Admin can view all projects.
    if (role === "admin") {
        return true;
    }

    const userId = String(
        user.id ??
        user.userId ??
        ""
    );

    const userEmail = String(
        user.email ??
        ""
    ).toLowerCase();

    const managerId = String(
        project.managerId ??
        project.managerID ??
        project.manager?.id ??
        ""
    );

    const managerEmail = String(
        project.managerEmail ??
        project.manager?.email ??
        ""
    ).toLowerCase();

    if (
        userId &&
        managerId &&
        userId === managerId
    ) {
        return true;
    }

    if (
        userEmail &&
        managerEmail &&
        userEmail === managerEmail
    ) {
        return true;
    }

    const managerIds = normalizeArray(
        project.managerIds
    ).map((id) => String(id));

    if (
        userId &&
        managerIds.includes(userId)
    ) {
        return true;
    }

    const memberIds = normalizeArray(
        project.memberIds ??
        project.teamMemberIds
    ).map((id) => String(id));

    if (
        userId &&
        memberIds.includes(userId)
    ) {
        return true;
    }

    const memberEmails = normalizeArray(
        project.memberEmails
    ).map((email) =>
        String(email).toLowerCase()
    );

    if (
        userEmail &&
        memberEmails.includes(userEmail)
    ) {
        return true;
    }

    return false;
}


// ============================================================
// DEPENDENCY EXTRACTION
// ============================================================

function getTaskDependencies(task) {
    const possibleValues = [
        task.dependencies,
        task.dependencyIds,
        task.dependsOn,
        task.dependsOnTaskIds,
        task.blockedBy,
        task.blockedByTaskIds,
    ];

    const dependencies = [];

    possibleValues.forEach((value) => {
        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (
                    typeof item === "string" ||
                    typeof item === "number"
                ) {
                    dependencies.push(String(item));
                } else if (item) {
                    const id =
                        item.id ??
                        item.taskId ??
                        item._id;

                    if (id !== undefined && id !== null) {
                        dependencies.push(String(id));
                    }
                }
            });

            return;
        }

        if (
            typeof value === "string" ||
            typeof value === "number"
        ) {
            dependencies.push(String(value));
        }
    });

    return [...new Set(dependencies)];
}


// ============================================================
// TASK ASSIGNEE EXTRACTION
// ============================================================

function getAssigneeId(task) {
    return (
        task.assigneeId ??
        task.assignedToId ??
        task.userId ??
        task.assignee?.id ??
        task.assignedTo?.id ??
        task.memberId ??
        null
    );
}


// ============================================================
// TASK PROGRESS
// ============================================================

function getTaskProgress(task) {
    const value =
        task.progress ??
        task.completionPercentage ??
        task.completion ??
        task.percentComplete;

    const numeric = Number(value);

    if (Number.isFinite(numeric)) {
        return clamp(numeric, 0, 100);
    }

    if (isCompletedStatus(task.status)) {
        return 100;
    }

    return 0;
}


// ============================================================
// WORKLOAD ANALYSIS
// ============================================================

function calculateTeamWorkload(
    tasks,
    teams,
    users,
    config
) {
    const workloadMap = new Map();

    tasks.forEach((task) => {
        if (isCompletedStatus(task.status)) {
            return;
        }

        const assigneeId = getAssigneeId(task);

        if (!assigneeId) {
            return;
        }

        const key = String(assigneeId);

        if (!workloadMap.has(key)) {
            workloadMap.set(key, {
                id: key,
                taskCount: 0,
                overdueCount: 0,
                blockedCount: 0,
                estimatedHours: 0,
            });
        }

        const record = workloadMap.get(key);

        record.taskCount += 1;

        if (isOverdue(task)) {
            record.overdueCount += 1;
        }

        if (isBlockedStatus(task.status)) {
            record.blockedCount += 1;
        }

        const hours = Number(
            task.estimatedHours ??
            task.storyPoints ??
            task.points ??
            0
        );

        if (Number.isFinite(hours)) {
            record.estimatedHours += hours;
        }
    });

    const result = [];

    workloadMap.forEach((record) => {
        const user = users.find(
            (item) =>
                String(getId(item)) ===
                record.id
        );

        const team = teams.find((item) => {
            const members = normalizeArray(
                item.memberIds ??
                item.members
            );

            return members.some((member) => {
                const memberId =
                    typeof member === "object"
                        ? getId(member)
                        : member;

                return (
                    String(memberId) ===
                    record.id
                );
            });
        });

        const capacity =
            Number(
                user?.capacity ??
                user?.weeklyCapacity ??
                user?.availableCapacity ??
                team?.capacity ??
                0
            );

        const utilization =
            capacity > 0
                ? (record.estimatedHours / capacity) * 100
                : 0;

        result.push({
            ...record,
            name: getName(
                user,
                team
                    ? getName(team, "Team")
                    : "Unassigned Member"
            ),
            capacity,
            utilization,
            overloaded:
                utilization >=
                config.workloadThreshold,
        });
    });

    return result;
}


// ============================================================
// BOTTLENECK ANALYSIS
// ============================================================

function analyzeBottlenecks({
    project,
    tasks,
    sprints,
    teams,
    users,
    config,
}) {
    if (!project) {
        return [];
    }

    const projectId = String(
        getId(project)
    );

    const projectTasks = tasks.filter(
        (task) =>
            String(getProjectId(task)) ===
            projectId
    );

    const projectSprints = sprints.filter(
        (sprint) =>
            String(getProjectId(sprint)) ===
            projectId
    );

    const results = [];

    // --------------------------------------------------------
    // BLOCKED TASKS
    // --------------------------------------------------------

    const blockedTasks = projectTasks.filter(
        (task) =>
            !isCompletedStatus(task.status) &&
            isBlockedStatus(task.status)
    );

    if (
        blockedTasks.length >=
        config.blockedThreshold
    ) {
        blockedTasks.forEach((task) => {
            const dependencies =
                getTaskDependencies(task);

            const impactScore = clamp(
                30 +
                    dependencies.length * 10 +
                    blockedTasks.length * 5,
                0,
                100
            );

            results.push({
                id: `blocked-${getTaskId(task)}`,
                type: "Blocked Task",
                severity:
                    impactScore >= 75
                        ? "High"
                        : impactScore >= 50
                          ? "Medium"
                          : "Low",
                score: impactScore,
                title:
                    `${getName(task, "Task")} is blocked`,
                taskId: getTaskId(task),
                taskName: getName(
                    task,
                    "Unnamed Task"
                ),
                sprintId:
                    task.sprintId ??
                    task.sprint?.id ??
                    null,
                sprintName:
                    task.sprint?.name ??
                    projectSprints.find(
                        (sprint) =>
                            String(
                                getId(sprint)
                            ) ===
                            String(
                                task.sprintId
                            )
                    )?.name ??
                    "Not assigned",
                factors: [
                    "Task is currently blocked",
                    dependencies.length > 0
                        ? `${dependencies.length} dependency record(s)`
                        : "No dependency details available",
                ],
                impact:
                    impactScore >= 75
                        ? "High potential impact on project flow."
                        : impactScore >= 50
                          ? "May slow dependent work."
                          : "Localized impact unless blocking other work.",
                action:
                    dependencies.length > 0
                        ? "Review the dependency chain and remove the blocking condition."
                        : "Investigate the blocking reason and assign corrective action.",
                sourceData: {
                    blocked: true,
                    dependencyCount:
                        dependencies.length,
                },
            });
        });
    }

    // --------------------------------------------------------
    // OVERDUE TASKS
    // --------------------------------------------------------

    const overdueTasks =
        projectTasks.filter(
            (task) =>
                isOverdue(task) &&
                daysBetween(
                    task.dueDate ??
                        task.deadline ??
                        task.endDate ??
                        task.targetDate,
                    new Date()
                ) >= config.overdueDays
        );

    if (overdueTasks.length > 0) {
        const groupedBySprint = new Map();

        overdueTasks.forEach((task) => {
            const sprintId =
                task.sprintId ??
                task.sprint?.id ??
                "unassigned";

            const key = String(sprintId);

            if (!groupedBySprint.has(key)) {
                groupedBySprint.set(key, []);
            }

            groupedBySprint
                .get(key)
                .push(task);
        });

        groupedBySprint.forEach(
            (group, sprintId) => {
                const score = clamp(
                    35 +
                        group.length * 8,
                    0,
                    100
                );

                const sprint =
                    projectSprints.find(
                        (item) =>
                            String(
                                getId(item)
                            ) === sprintId
                    );

                results.push({
                    id: `overdue-${projectId}-${sprintId}`,
                    type: "Overdue Work",
                    severity:
                        score >= 75
                            ? "High"
                            : score >= 50
                              ? "Medium"
                              : "Low",
                    score,
                    title:
                        `${group.length} overdue task(s)`,
                    taskId: null,
                    taskName:
                        group.length === 1
                            ? getName(
                                  group[0],
                                  "Task"
                              )
                            : `${group.length} overdue tasks`,
                    sprintId:
                        sprintId === "unassigned"
                            ? null
                            : sprintId,
                    sprintName:
                        sprint
                            ? getName(
                                  sprint,
                                  "Sprint"
                              )
                            : "Unassigned Sprint",
                    factors: [
                        `${group.length} overdue task(s)`,
                        "Tasks are past their recorded due date",
                    ],
                    impact:
                        "Continued overdue work can reduce delivery throughput and affect dependent work.",
                    action:
                        "Review overdue tasks, their blockers, estimates, and reassignment needs.",
                    sourceData: {
                        overdueCount:
                            group.length,
                    },
                });
            }
        );
    }

    // --------------------------------------------------------
    // DEPENDENCY BOTTLENECKS
    // --------------------------------------------------------

    const dependencyMap = new Map();

    projectTasks.forEach((task) => {
        const dependencies =
            getTaskDependencies(task);

        dependencies.forEach(
            (dependencyId) => {
                if (!dependencyMap.has(dependencyId)) {
                    dependencyMap.set(
                        dependencyId,
                        []
                    );
                }

                dependencyMap
                    .get(dependencyId)
                    .push(task);
            }
        );
    });

    dependencyMap.forEach(
        (dependentTasks, dependencyId) => {
            if (
                dependentTasks.length <
                config.dependencyThreshold
            ) {
                return;
            }

            const dependencyTask =
                projectTasks.find(
                    (task) =>
                        String(
                            getTaskId(task)
                        ) ===
                        String(dependencyId)
                );

            if (!dependencyTask) {
                return;
            }

            const score = clamp(
                45 +
                    dependentTasks.length * 10 +
                    (isOverdue(
                        dependencyTask
                    )
                        ? 15
                        : 0) +
                    (isBlockedStatus(
                        dependencyTask.status
                    )
                        ? 20
                        : 0),
                0,
                100
            );

            results.push({
                id: `dependency-${dependencyId}`,
                type: "Dependency Bottleneck",
                severity:
                    score >= 75
                        ? "High"
                        : score >= 50
                          ? "Medium"
                          : "Low",
                score,
                title:
                    `${getName(
                        dependencyTask,
                        "Task"
                    )} affects ${dependentTasks.length} task(s)`,
                taskId:
                    getTaskId(dependencyTask),
                taskName:
                    getName(
                        dependencyTask,
                        "Dependency Task"
                    ),
                sprintId:
                    dependencyTask.sprintId ??
                    dependencyTask.sprint?.id ??
                    null,
                sprintName:
                    dependencyTask.sprint?.name ??
                    "Not assigned",
                factors: [
                    `${dependentTasks.length} task(s) depend on this task`,
                    isOverdue(
                        dependencyTask
                    )
                        ? "Dependency task is overdue"
                        : "Dependency task is not marked overdue",
                    isBlockedStatus(
                        dependencyTask.status
                    )
                        ? "Dependency task is blocked"
                        : "Dependency task is not marked blocked",
                ],
                impact:
                    "Delays in this dependency may propagate to multiple downstream tasks.",
                action:
                    "Prioritize dependency resolution and review the affected downstream tasks.",
                sourceData: {
                    dependencyCount:
                        dependentTasks.length,
                },
            });
        }
    );

    // --------------------------------------------------------
    // SPRINT DELAYS
    // --------------------------------------------------------

    projectSprints.forEach((sprint) => {
        if (
            isCompletedStatus(
                sprint.status
            )
        ) {
            return;
        }

        const sprintEnd =
            sprint.endDate ??
            sprint.deadline ??
            sprint.dueDate;

        if (!sprintEnd) {
            return;
        }

        const endDate = new Date(
            sprintEnd
        );

        if (Number.isNaN(endDate.getTime())) {
            return;
        }

        const delayDays =
            daysBetween(
                endDate,
                new Date()
            );

        const sprintTasks =
            projectTasks.filter(
                (task) =>
                    String(
                        task.sprintId ??
                            task.sprint?.id
                    ) ===
                    String(
                        getId(sprint)
                    )
            );

        const incompleteTasks =
            sprintTasks.filter(
                (task) =>
                    !isCompletedStatus(
                        task.status
                    )
            );

        if (
            delayDays >=
                config.sprintDelayDays &&
            incompleteTasks.length > 0
        ) {
            const score = clamp(
                40 +
                    delayDays * 8 +
                    incompleteTasks.length * 4,
                0,
                100
            );

            results.push({
                id: `sprint-delay-${getId(sprint)}`,
                type: "Sprint Delay",
                severity:
                    score >= 75
                        ? "High"
                        : score >= 50
                          ? "Medium"
                          : "Low",
                score,
                title:
                    `${getName(
                        sprint,
                        "Sprint"
                    )} is behind schedule`,
                taskId: null,
                taskName:
                    `${incompleteTasks.length} incomplete task(s)`,
                sprintId:
                    getId(sprint),
                sprintName:
                    getName(
                        sprint,
                        "Sprint"
                    ),
                factors: [
                    `${delayDays} day(s) past recorded sprint end`,
                    `${incompleteTasks.length} incomplete task(s)`,
                ],
                impact:
                    "Sprint delay may affect project delivery timing and subsequent sprint planning.",
                action:
                    "Review remaining sprint work, dependencies, and available team capacity.",
                sourceData: {
                    delayDays,
                    incompleteTasks:
                        incompleteTasks.length,
                },
            });
        }
    });

    // --------------------------------------------------------
    // WORKLOAD IMBALANCE
    // --------------------------------------------------------

    const workloads =
        calculateTeamWorkload(
            projectTasks,
            teams,
            users,
            config
        );

    workloads
        .filter(
            (member) =>
                member.overloaded
        )
        .forEach((member) => {
            const score = clamp(
                50 +
                    Math.max(
                        0,
                        member.utilization -
                            config.workloadThreshold
                    ),
                0,
                100
            );

            results.push({
                id: `workload-${member.id}`,
                type: "Workload Imbalance",
                severity:
                    score >= 75
                        ? "High"
                        : "Medium",
                score,
                title:
                    `${member.name} has high workload`,
                taskId: null,
                taskName:
                    `${member.taskCount} active task(s)`,
                sprintId: null,
                sprintName:
                    "Multiple / current assignments",
                factors: [
                    `Estimated utilization: ${formatPercent(
                        member.utilization
                    )}`,
                    `${member.taskCount} active task(s)`,
                    member.overdueCount > 0
                        ? `${member.overdueCount} overdue task(s)`
                        : "No overdue tasks recorded",
                ],
                impact:
                    "High workload concentration can slow completion and increase delivery risk.",
                action:
                    "Review task distribution, priorities, and available team capacity.",
                sourceData: {
                    utilization:
                        member.utilization,
                    taskCount:
                        member.taskCount,
                },
            });
        });

    // --------------------------------------------------------
    // REPEATED DELAYS
    // --------------------------------------------------------

    const delayHistory = new Map();

    projectTasks.forEach((task) => {
        const taskName = getName(
            task,
            ""
        ).trim();

        if (!taskName) {
            return;
        }

        const delayCount = Number(
            task.delayCount ??
            task.delays ??
            task.timesDelayed ??
            task.history?.delayCount ??
            0
        );

        if (
            Number.isFinite(delayCount) &&
            delayCount >=
                config.repeatedDelayThreshold
        ) {
            delayHistory.set(
                String(getTaskId(task)),
                {
                    task,
                    delayCount,
                }
            );
        }
    });

    delayHistory.forEach(
        ({ task, delayCount }) => {
            const score = clamp(
                45 +
                    delayCount * 10,
                0,
                100
            );

            results.push({
                id: `repeated-delay-${getTaskId(task)}`,
                type: "Repeated Task Delay",
                severity:
                    score >= 75
                        ? "High"
                        : score >= 50
                          ? "Medium"
                          : "Low",
                score,
                title:
                    `${getName(
                        task,
                        "Task"
                    )} has repeated delays`,
                taskId:
                    getTaskId(task),
                taskName:
                    getName(
                        task,
                        "Task"
                    ),
                sprintId:
                    task.sprintId ??
                    task.sprint?.id ??
                    null,
                sprintName:
                    task.sprint?.name ??
                    "Not assigned",
                factors: [
                    `${delayCount} recorded delay(s)`,
                    "Historical delay information is present in the task record",
                ],
                impact:
                    "Repeated delays may indicate estimation, dependency, or resource constraints.",
                action:
                    "Review the task history and identify the recurring cause before replanning.",
                sourceData: {
                    delayCount,
                },
            });
        }
    );

    // --------------------------------------------------------
    // RESOURCE CONSTRAINTS
    // --------------------------------------------------------

    const constrainedTeams =
        teams.filter((team) => {
            const capacity = Number(
                team.capacity ??
                team.availableCapacity ??
                team.currentCapacity
            );

            const allocated = Number(
                team.allocatedCapacity ??
                team.usedCapacity ??
                team.workload
            );

            if (
                !Number.isFinite(capacity) ||
                capacity <= 0 ||
                !Number.isFinite(allocated)
            ) {
                return false;
            }

            const utilization =
                (allocated / capacity) * 100;

            return (
                utilization >=
                config.capacityThreshold
            );
        });

    constrainedTeams.forEach((team) => {
        const capacity = Number(
            team.capacity ??
            team.availableCapacity ??
            team.currentCapacity
        );

        const allocated = Number(
            team.allocatedCapacity ??
            team.usedCapacity ??
            team.workload
        );

        const utilization =
            capacity > 0
                ? (allocated / capacity) * 100
                : 0;

        const score = clamp(
            50 +
                Math.max(
                    0,
                    utilization -
                        config.capacityThreshold
                ),
            0,
            100
        );

        results.push({
            id: `capacity-${getId(team)}`,
            type: "Resource Constraint",
            severity:
                score >= 75
                    ? "High"
                    : "Medium",
            score,
            title:
                `${getName(
                    team,
                    "Team"
                )} has limited capacity`,
            taskId: null,
            taskName:
                "Team capacity",
            sprintId: null,
            sprintName:
                "Current team allocation",
            factors: [
                `Allocated capacity: ${formatPercent(
                    utilization
                )}`,
                "Current capacity data indicates high utilization",
            ],
            impact:
                "Limited capacity may constrain the team's ability to absorb additional work.",
            action:
                "Review allocation, priorities, and available capacity before adding more work.",
            sourceData: {
                capacity,
                allocated,
                utilization,
            },
        });
    });

    // --------------------------------------------------------
    // FILTER
    // --------------------------------------------------------

    return results
        .filter(
            (item) =>
                item.score >=
                config.minimumImpactScore
        )
        .sort(
            (a, b) =>
                b.score - a.score
        );
}


// ============================================================
// SEVERITY CONFIG
// ============================================================

function severityClasses(severity) {
    switch (
        normalizeStatus(severity)
    ) {
        case "high":
            return {
                badge:
                    "bg-red-500/15 text-red-300 border-red-500/30",
                icon:
                    "text-red-400",
                border:
                    "border-red-500/30",
            };

        case "medium":
            return {
                badge:
                    "bg-amber-500/15 text-amber-300 border-amber-500/30",
                icon:
                    "text-amber-400",
                border:
                    "border-amber-500/30",
            };

        default:
            return {
                badge:
                    "bg-blue-500/15 text-blue-300 border-blue-500/30",
                icon:
                    "text-blue-400",
                border:
                    "border-blue-500/30",
            };
    }
}


// ============================================================
// COMPONENT
// ============================================================

export default function AIDetectBottlenecks() {
    const [currentUser, setCurrentUser] =
        useState(null);

    const [projects, setProjects] =
        useState([]);

    const [tasks, setTasks] =
        useState([]);

    const [sprints, setSprints] =
        useState([]);

    const [teams, setTeams] =
        useState([]);

    const [users, setUsers] =
        useState([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [bottlenecks, setBottlenecks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [analyzing, setAnalyzing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [severityFilter, setSeverityFilter] =
        useState("all");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const [showConfig, setShowConfig] =
        useState(false);

    const [config, setConfig] =
        useState(
            DEFAULT_CONFIG
        );

    const [lastAnalyzedAt, setLastAnalyzedAt] =
        useState(null);


    // ========================================================
    // LOAD DATA
    // ========================================================

    const loadData = useCallback(() => {
        setLoading(true);
        setError("");

        try {
            const user =
                readStorage(
                    STORAGE_KEYS.CURRENT_USER,
                    null
                );

            const loadedUsers =
                normalizeArray(
                    readStorage(
                        STORAGE_KEYS.USERS,
                        []
                    )
                );

            const loadedProjects =
                normalizeArray(
                    readStorage(
                        STORAGE_KEYS.PROJECTS,
                        []
                    )
                );

            const loadedTasks =
                normalizeArray(
                    readStorage(
                        STORAGE_KEYS.TASKS,
                        []
                    )
                );

            const loadedSprints =
                normalizeArray(
                    readStorage(
                        STORAGE_KEYS.SPRINTS,
                        []
                    )
                );

            const loadedTeams =
                normalizeArray(
                    readStorage(
                        STORAGE_KEYS.TEAMS,
                        []
                    )
                );

            setCurrentUser(user);
            setUsers(loadedUsers);
            setProjects(loadedProjects);
            setTasks(loadedTasks);
            setSprints(loadedSprints);
            setTeams(loadedTeams);

            const authorizedProjects =
                loadedProjects.filter(
                    (project) =>
                        hasProjectAccess(
                            user,
                            project
                        )
                );

            if (
                selectedProjectId &&
                !authorizedProjects.some(
                    (project) =>
                        String(
                            getId(project)
                        ) ===
                        String(
                            selectedProjectId
                        )
                )
            ) {
                setSelectedProjectId("");
            }
        } catch (err) {
            console.error(
                "AI-009 data loading error:",
                err
            );

            setError(
                "Unable to load project data."
            );
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);


    useEffect(() => {
        loadData();
    }, [loadData]);


    // ========================================================
    // AUTHORIZED PROJECTS
    // ========================================================

    const authorizedProjects =
        useMemo(() => {
            return projects.filter(
                (project) =>
                    hasProjectAccess(
                        currentUser,
                        project
                    )
            );
        }, [
            projects,
            currentUser,
        ]);


    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject =
        useMemo(() => {
            return authorizedProjects.find(
                (project) =>
                    String(
                        getId(project)
                    ) ===
                    String(
                        selectedProjectId
                    )
            );
        }, [
            authorizedProjects,
            selectedProjectId,
        ]);


    // ========================================================
    // ANALYZE
    // ========================================================

    const analyzeProject =
        useCallback(() => {
            if (!selectedProject) {
                setBottlenecks([]);
                return;
            }

            if (
                !hasProjectAccess(
                    currentUser,
                    selectedProject
                )
            ) {
                setBottlenecks([]);
                setError(
                    "You are not authorized to analyze this project."
                );
                return;
            }

            setAnalyzing(true);
            setError("");

            // Small asynchronous boundary so the UI can
            // display the analysis state.
            setTimeout(() => {
                try {
                    const results =
                        analyzeBottlenecks({
                            project:
                                selectedProject,
                            tasks,
                            sprints,
                            teams,
                            users,
                            config,
                        });

                    setBottlenecks(
                        results
                    );

                    setLastAnalyzedAt(
                        new Date()
                    );
                } catch (err) {
                    console.error(
                        "AI-009 analysis error:",
                        err
                    );

                    setError(
                        "Bottleneck analysis could not be completed."
                    );

                    setBottlenecks([]);
                } finally {
                    setAnalyzing(false);
                }
            }, 150);
        }, [
            selectedProject,
            currentUser,
            tasks,
            sprints,
            teams,
            users,
            config,
        ]);


    // ========================================================
    // AUTOMATIC RECALCULATION
    // ========================================================

    useEffect(() => {
        if (!selectedProject) {
            setBottlenecks([]);
            return;
        }

        analyzeProject();
    }, [
        selectedProject,
        tasks,
        sprints,
        teams,
        users,
        config,
        analyzeProject,
    ]);


    // ========================================================
    // STORAGE CHANGE LISTENER
    // ========================================================

    useEffect(() => {
        const handleStorageChange = () => {
            loadData();
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, [loadData]);


    // ========================================================
    // FILTERED RESULTS
    // ========================================================

    const filteredBottlenecks =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return bottlenecks.filter(
                (item) => {
                    const matchesSearch =
                        !query ||
                        [
                            item.title,
                            item.type,
                            item.taskName,
                            item.sprintName,
                            item.impact,
                            item.action,
                            ...(item.factors ??
                                []),
                        ]
                            .join(" ")
                            .toLowerCase()
                            .includes(query);

                    const matchesSeverity =
                        severityFilter ===
                            "all" ||
                        normalizeStatus(
                            item.severity
                        ) ===
                            normalizeStatus(
                                severityFilter
                            );

                    const matchesType =
                        typeFilter ===
                            "all" ||
                        item.type ===
                            typeFilter;

                    return (
                        matchesSearch &&
                        matchesSeverity &&
                        matchesType
                    );
                }
            );
        }, [
            bottlenecks,
            search,
            severityFilter,
            typeFilter,
        ]);


    // ========================================================
    // STATS
    // ========================================================

    const stats = useMemo(() => {
        const high =
            bottlenecks.filter(
                (item) =>
                    normalizeStatus(
                        item.severity
                    ) === "high"
            ).length;

        const medium =
            bottlenecks.filter(
                (item) =>
                    normalizeStatus(
                        item.severity
                    ) === "medium"
            ).length;

        const low =
            bottlenecks.filter(
                (item) =>
                    normalizeStatus(
                        item.severity
                    ) === "low"
            ).length;

        const affectedTasks =
            new Set(
                bottlenecks
                    .map(
                        (item) =>
                            item.taskId
                    )
                    .filter(Boolean)
            ).size;

        return {
            total: bottlenecks.length,
            high,
            medium,
            low,
            affectedTasks,
        };
    }, [bottlenecks]);


    // ========================================================
    // TYPES
    // ========================================================

    const bottleneckTypes =
        useMemo(() => {
            return [
                ...new Set(
                    bottlenecks.map(
                        (item) =>
                            item.type
                    )
                ),
            ];
        }, [bottlenecks]);


    // ========================================================
    // CONFIG UPDATE
    // ========================================================

    const updateConfig = (
        key,
        value
    ) => {
        const numeric =
            Number(value);

        if (!Number.isFinite(numeric)) {
            return;
        }

        setConfig((previous) => ({
            ...previous,
            [key]: Math.max(
                0,
                numeric
            ),
        }));
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-6">
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-400" />

                        <p className="text-slate-300">
                            Loading project data...
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
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl space-y-6 p-6">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="rounded-lg bg-cyan-500/10 p-2">
                                <Zap className="h-6 w-6 text-cyan-400" />
                            </div>

                            <span className="text-sm font-medium text-cyan-400">
                                AI-009
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold">
                            Detect Project Bottlenecks
                        </h1>

                        <p className="mt-1 max-w-3xl text-sm text-slate-400">
                            Identify potential areas slowing project
                            progress using current project, task,
                            sprint, team, workload, dependency,
                            and capacity data.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                        <button
                            type="button"
                            onClick={loadData}
                            disabled={
                                loading ||
                                analyzing
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />

                            Refresh Data
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfig(
                                    (value) =>
                                        !value
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                        >
                            <Filter className="h-4 w-4" />

                            Detection Settings

                            <ChevronDown
                                className={`h-4 w-4 transition ${
                                    showConfig
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>


                {/* ==================================================
                    BUSINESS RULE NOTICE
                ================================================== */}

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                    <div className="flex gap-3">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                        <div>
                            <p className="font-medium text-cyan-300">
                                AI analysis uses actual system data
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Bottlenecks are calculated from available
                                project records. AI-009 does not create,
                                modify, or invent projects, tasks, sprints,
                                or team members.
                            </p>
                        </div>
                    </div>
                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                        <div className="flex gap-3">
                            <XCircle className="h-5 w-5 shrink-0 text-red-400" />

                            <p className="text-sm text-red-300">
                                {error}
                            </p>
                        </div>
                    </div>
                )}


                {/* ==================================================
                    PROJECT SELECTOR
                ================================================== */}

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-cyan-400" />

                        <h2 className="font-semibold">
                            Select Project
                        </h2>
                    </div>

                    {authorizedProjects.length ===
                    0 ? (
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                            <div className="flex gap-3">
                                <ShieldAlert className="h-5 w-5 text-amber-400" />

                                <div>
                                    <p className="font-medium text-amber-300">
                                        No authorized projects
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        No project available to this
                                        manager was found in the current
                                        project records.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <select
                            value={
                                selectedProjectId
                            }
                            onChange={(event) =>
                                setSelectedProjectId(
                                    event.target
                                        .value
                                )
                            }
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
                        >
                            <option value="">
                                Select an assigned project
                            </option>

                            {authorizedProjects.map(
                                (project) => (
                                    <option
                                        key={getId(
                                            project
                                        )}
                                        value={getId(
                                            project
                                        )}
                                    >
                                        {getName(
                                            project,
                                            "Unnamed Project"
                                        )}
                                    </option>
                                )
                            )}
                        </select>
                    )}
                </div>


                {/* ==================================================
                    CONFIGURATION
                ================================================== */}

                {showConfig && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">

                        <div className="mb-4">
                            <h2 className="font-semibold">
                                Bottleneck Detection Configuration
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Thresholds control when available project
                                data is considered significant enough to
                                report as a potential bottleneck.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {[
                                [
                                    "blockedThreshold",
                                    "Blocked task threshold",
                                ],
                                [
                                    "dependencyThreshold",
                                    "Dependency threshold",
                                ],
                                [
                                    "repeatedDelayThreshold",
                                    "Repeated delay threshold",
                                ],
                                [
                                    "workloadThreshold",
                                    "Workload threshold (%)",
                                ],
                                [
                                    "capacityThreshold",
                                    "Capacity threshold (%)",
                                ],
                                [
                                    "sprintDelayDays",
                                    "Sprint delay days",
                                ],
                                [
                                    "minimumImpactScore",
                                    "Minimum impact score",
                                ],
                            ].map(
                                ([
                                    key,
                                    label,
                                ]) => (
                                    <label
                                        key={key}
                                        className="block"
                                    >
                                        <span className="mb-2 block text-xs font-medium text-slate-400">
                                            {label}
                                        </span>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                config[
                                                    key
                                                ]
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateConfig(
                                                    key,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                                        />
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                )}


                {/* ==================================================
                    NO PROJECT SELECTED
                ================================================== */}

                {!selectedProject && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-10 text-center">

                        <Layers3 className="mx-auto mb-4 h-12 w-12 text-slate-600" />

                        <h2 className="text-lg font-semibold">
                            Select a project to begin
                        </h2>

                        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
                            Select an authorized project above.
                            The system will analyze its available
                            project data and identify possible
                            bottlenecks.
                        </p>
                    </div>
                )}


                {/* ==================================================
                    SELECTED PROJECT
                ================================================== */}

                {selectedProject && (
                    <>
                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">

                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                <div>
                                    <p className="text-xs uppercase tracking-wider text-slate-500">
                                        Selected Project
                                    </p>

                                    <h2 className="mt-1 text-xl font-semibold">
                                        {getName(
                                            selectedProject,
                                            "Unnamed Project"
                                        )}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        analyzeProject
                                    }
                                    disabled={
                                        analyzing
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4" />
                                            Analyze Bottlenecks
                                        </>
                                    )}
                                </button>
                            </div>

                            {lastAnalyzedAt && (
                                <p className="mt-3 text-xs text-slate-500">
                                    Last analyzed:{" "}
                                    {lastAnalyzedAt.toLocaleString()}
                                </p>
                            )}
                        </div>


                        {/* ==================================================
                            STATS
                        ================================================== */}

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                            <StatCard
                                icon={
                                    <BarChart3 className="h-5 w-5" />
                                }
                                label="Bottlenecks"
                                value={
                                    stats.total
                                }
                            />

                            <StatCard
                                icon={
                                    <ShieldAlert className="h-5 w-5" />
                                }
                                label="High"
                                value={
                                    stats.high
                                }
                            />

                            <StatCard
                                icon={
                                    <AlertTriangle className="h-5 w-5" />
                                }
                                label="Medium"
                                value={
                                    stats.medium
                                }
                            />

                            <StatCard
                                icon={
                                    <CheckCircle2 className="h-5 w-5" />
                                }
                                label="Low"
                                value={
                                    stats.low
                                }
                            />

                            <StatCard
                                icon={
                                    <Target className="h-5 w-5" />
                                }
                                label="Affected Tasks"
                                value={
                                    stats.affectedTasks
                                }
                            />
                        </div>


                        {/* ==================================================
                            FILTERS
                        ================================================== */}

                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                            <div className="grid gap-3 md:grid-cols-3">

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                    <input
                                        type="text"
                                        value={
                                            search
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Search bottlenecks..."
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <select
                                    value={
                                        severityFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSeverityFilter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
                                >
                                    <option value="all">
                                        All severities
                                    </option>

                                    <option value="High">
                                        High
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Low">
                                        Low
                                    </option>
                                </select>

                                <select
                                    value={
                                        typeFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTypeFilter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
                                >
                                    <option value="all">
                                        All bottleneck types
                                    </option>

                                    {bottleneckTypes.map(
                                        (type) => (
                                            <option
                                                key={
                                                    type
                                                }
                                                value={
                                                    type
                                                }
                                            >
                                                {type}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>


                        {/* ==================================================
                            RESULTS
                        ================================================== */}

                        {analyzing ? (
                            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-10 text-center">
                                <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-400" />

                                <h2 className="font-semibold">
                                    Analyzing project data...
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Reviewing blocked tasks, overdue
                                    work, dependencies, sprint timing,
                                    workload, capacity, and recorded
                                    delays.
                                </p>
                            </div>
                        ) : filteredBottlenecks.length ===
                          0 ? (
                            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-10 text-center">

                                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />

                                <h2 className="text-lg font-semibold">
                                    No bottlenecks detected
                                </h2>

                                <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">
                                    No available project data currently
                                    meets the configured detection
                                    thresholds.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">

                                {filteredBottlenecks.map(
                                    (
                                        bottleneck
                                    ) => (
                                        <BottleneckCard
                                            key={
                                                bottleneck.id
                                            }
                                            bottleneck={
                                                bottleneck
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <div className="flex items-center justify-between">

                <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                    {icon}
                </div>

                <span className="text-2xl font-bold">
                    {value}
                </span>
            </div>

            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
            </p>
        </div>
    );
}


// ============================================================
// BOTTLENECK CARD
// ============================================================

function BottleneckCard({
    bottleneck,
}) {
    const [expanded, setExpanded] =
        useState(false);

    const classes =
        severityClasses(
            bottleneck.severity
        );

    return (
        <div
            className={`rounded-xl border bg-slate-900/70 ${classes.border}`}
        >

            <div className="p-5">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex gap-3">

                        <div
                            className={`mt-1 shrink-0 ${classes.icon}`}
                        >
                            {normalizeStatus(
                                bottleneck.severity
                            ) === "high" ? (
                                <ShieldAlert className="h-6 w-6" />
                            ) : normalizeStatus(
                                  bottleneck.severity
                              ) ===
                              "medium" ? (
                                <AlertTriangle className="h-6 w-6" />
                            ) : (
                                <Info className="h-6 w-6" />
                            )}
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">

                                <h3 className="font-semibold text-white">
                                    {
                                        bottleneck.title
                                    }
                                </h3>

                                <span
                                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${classes.badge}`}
                                >
                                    {
                                        bottleneck.severity
                                    }
                                </span>

                                <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                                    {
                                        bottleneck.type
                                    }
                                </span>
                            </div>

                            <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">

                                <div>
                                    <span className="text-slate-500">
                                        Task:
                                    </span>{" "}
                                    {
                                        bottleneck.taskName
                                    }
                                </div>

                                <div>
                                    <span className="text-slate-500">
                                        Sprint:
                                    </span>{" "}
                                    {
                                        bottleneck.sprintName
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">

                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Impact score
                            </p>

                            <p
                                className={`mt-1 text-2xl font-bold ${classes.icon}`}
                            >
                                {Math.round(
                                    bottleneck.score
                                )}
                            </p>
                        </div>
                    </div>
                </div>


                {/* ======================================================
                    CONTRIBUTING FACTORS
                ====================================================== */}

                <div className="mt-5">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Contributing factors
                    </p>

                    <ul className="space-y-1.5">
                        {(
                            bottleneck.factors ??
                            []
                        ).map(
                            (
                                factor,
                                index
                            ) => (
                                <li
                                    key={`${bottleneck.id}-factor-${index}`}
                                    className="flex gap-2 text-sm text-slate-300"
                                >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />

                                    <span>
                                        {
                                            factor
                                        }
                                    </span>
                                </li>
                            )
                        )}
                    </ul>
                </div>


                {/* ======================================================
                    IMPACT + ACTION
                ====================================================== */}

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">

                        <div className="mb-2 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-amber-400" />

                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Potential impact
                            </span>
                        </div>

                        <p className="text-sm leading-6 text-slate-300">
                            {
                                bottleneck.impact
                            }
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">

                        <div className="mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-cyan-400" />

                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Suggested action
                            </span>
                        </div>

                        <p className="text-sm leading-6 text-slate-300">
                            {
                                bottleneck.action
                            }
                        </p>
                    </div>
                </div>


                {/* ======================================================
                    DETAILS
                ====================================================== */}

                <button
                    type="button"
                    onClick={() =>
                        setExpanded(
                            (value) =>
                                !value
                        )
                    }
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                    <span>
                        {expanded
                            ? "Hide data details"
                            : "View data details"}
                    </span>

                    <ChevronDown
                        className={`h-4 w-4 transition ${
                            expanded
                                ? "rotate-180"
                                : ""
                        }`}
                    />
                </button>


                {expanded && (
                    <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4">

                        <div className="grid gap-3 sm:grid-cols-2">

                            <DetailItem
                                label="Bottleneck type"
                                value={
                                    bottleneck.type
                                }
                            />

                            <DetailItem
                                label="Severity"
                                value={
                                    bottleneck.severity
                                }
                            />

                            <DetailItem
                                label="Task ID"
                                value={
                                    bottleneck.taskId ??
                                    "Not available"
                                }
                            />

                            <DetailItem
                                label="Sprint ID"
                                value={
                                    bottleneck.sprintId ??
                                    "Not available"
                                }
                            />
                        </div>

                        {bottleneck.sourceData && (
                            <div className="mt-4">

                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Source metrics
                                </p>

                                <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs leading-5 text-slate-400">
                                    {JSON.stringify(
                                        bottleneck.sourceData,
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-xs text-slate-500">
                {label}
            </p>

            <p className="mt-1 break-words text-sm text-slate-300">
                {String(value)}
            </p>
        </div>
    );
}