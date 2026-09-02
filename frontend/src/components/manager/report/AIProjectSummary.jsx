
import React, { useEffect, useState } from "react";

import {
    Sparkles,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    Clock3,
    ListTodo,
    Users,
    Activity,
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getProjectDashboard,
    getProjectRisksAndIssues,
} from "../../../services/projectReportService";

function AIProjectSummary() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");

    const [dashboard, setDashboard] = useState(null);
    const [risks, setRisks] = useState([]);

    const [loadingProjects, setLoadingProjects] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const [error, setError] = useState("");

    const token =
        localStorage.getItem("aipms_access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        null;

    // ============================================================
    // LOAD MANAGER PROJECTS
    // ============================================================

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoadingProjects(true);
        setError("");

        try {
            const response =
                await getAuthorizedManagerProjects(token);

            const data = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                ? response.data
                : [];

            setProjects(data);

            if (data.length > 0) {
                const firstProjectId =
                    data[0]?.id ??
                    data[0]?.projectId ??
                    "";

                setProjectId(String(firstProjectId));
            }
        } catch (err) {
            console.error(
                "Failed to load manager projects:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load manager projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    };

    // ============================================================
    // HELPERS
    // ============================================================

    const getValue = (object, ...keys) => {
        for (const key of keys) {
            if (
                object &&
                object[key] !== undefined &&
                object[key] !== null
            ) {
                return object[key];
            }
        }

        return null;
    };

    const getNumber = (object, ...keys) => {
        const value = getValue(object, ...keys);

        const number = Number(value);

        return Number.isFinite(number) ? number : 0;
    };

    const getArray = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        return [];
    };

    const getProjectName = () => {
        const project = projects.find((item) => {
            const id =
                item?.id ??
                item?.projectId;

            return String(id) === String(projectId);
        });

        return (
            project?.name ??
            project?.projectName ??
            dashboard?.projectName ??
            "Selected Project"
        );
    };

    // ============================================================
    // GENERATE PROJECT SUMMARY
    // ============================================================

    const generateSummary = async () => {
        if (!projectId) {
            setError("Please select a project.");
            return;
        }

        setLoadingSummary(true);
        setError("");

        try {
            const [dashboardResponse, risksResponse] =
                await Promise.all([
                    getProjectDashboard(
                        projectId,
                        token
                    ),

                    getProjectRisksAndIssues(
                        projectId,
                        {},
                        token
                    ),
                ]);

            const dashboardData =
                dashboardResponse?.data ??
                dashboardResponse ??
                null;

            const risksData =
                getArray(risksResponse);

            setDashboard(dashboardData);
            setRisks(risksData);
        } catch (err) {
            console.error(
                "Failed to generate project summary:",
                err
            );

            setDashboard(null);
            setRisks([]);

            setError(
                err?.message ||
                    "Unable to generate project summary."
            );
        } finally {
            setLoadingSummary(false);
        }
    };

    // ============================================================
    // SUMMARY DATA
    // ============================================================

    const totalTasks = getNumber(
        dashboard,
        "totalTasks",
        "TotalTasks"
    );

    const completedTasks = getNumber(
        dashboard,
        "completedTasks",
        "CompletedTasks"
    );

    const inProgressTasks = getNumber(
        dashboard,
        "inProgressTasks",
        "InProgressTasks"
    );

    const todoTasks = getNumber(
        dashboard,
        "todoTasks",
        "TodoTasks"
    );

    const blockedTasks = getNumber(
        dashboard,
        "blockedTasks",
        "BlockedTasks"
    );

    const overdueTasks = getNumber(
        dashboard,
        "overdueTasks",
        "OverdueTasks"
    );

    const remainingTasks = getNumber(
        dashboard,
        "remainingTasks",
        "RemainingTasks"
    );

    const projectProgress = getNumber(
        dashboard,
        "overallProjectProgress",
        "OverallProjectProgress"
    );

    const sprintProgress = getNumber(
        dashboard,
        "sprintProgressPercentage",
        "SprintProgressPercentage"
    );

    const teamProgress = getNumber(
        dashboard,
        "teamProgressPercentage",
        "TeamProgressPercentage"
    );

    const teamMemberCount = getNumber(
        dashboard,
        "teamMemberCount",
        "TeamMemberCount"
    );

    const estimatedHours = getNumber(
        dashboard,
        "estimatedWorkHours",
        "EstimatedWorkHours"
    );

    const actualHours = getNumber(
        dashboard,
        "actualWorkHours",
        "ActualWorkHours"
    );

    const projectName = getProjectName();

    const activeSprintName =
        getValue(
            dashboard,
            "activeSprintName",
            "ActiveSprintName"
        ) || "No active sprint";

    const sprintStatus =
        getValue(
            dashboard,
            "activeSprintStatus",
            "ActiveSprintStatus"
        ) || "N/A";

    const teamName =
        getValue(
            dashboard,
            "teamName",
            "TeamName"
        ) || "No team assigned";

    const projectDeadline =
        getValue(
            dashboard,
            "projectDeadline",
            "ProjectDeadline"
        );

    // ============================================================
    // HEALTH CALCULATION
    // ============================================================

    const criticalRiskCount = risks.filter((risk) => {
        const severity = String(
            getValue(
                risk,
                "severity",
                "Severity",
                "riskLevel",
                "RiskLevel"
            ) || ""
        ).toLowerCase();

        return (
            severity.includes("critical") ||
            severity.includes("high")
        );
    }).length;

    const health =
        criticalRiskCount > 0 ||
        blockedTasks > 0 ||
        overdueTasks > 0
            ? "Needs Attention"
            : projectProgress >= 75
            ? "Healthy"
            : projectProgress >= 40
            ? "On Track"
            : "Needs Attention";

    const healthClass =
        health === "Healthy"
            ? "bg-emerald-100 text-emerald-700"
            : health === "On Track"
            ? "bg-blue-100 text-blue-700"
            : "bg-amber-100 text-amber-700";

    // ============================================================
    // SUMMARY TEXT
    // ============================================================

    const getSummaryText = () => {
        if (!dashboard) {
            return "";
        }

        let text = "";

        text += `${projectName} is currently at approximately `;
        text += `${projectProgress.toFixed(1)}% overall project progress. `;

        if (totalTasks > 0) {
            text += `The project has ${totalTasks} total tasks, `;
            text += `with ${completedTasks} completed and `;
            text += `${remainingTasks} remaining. `;
        } else {
            text += "There are currently no tasks recorded for this project. ";
        }

        if (inProgressTasks > 0) {
            text += `${inProgressTasks} task${
                inProgressTasks === 1 ? " is" : "s are"
            } currently in progress. `;
        }

        if (blockedTasks > 0) {
            text += `There ${
                blockedTasks === 1 ? "is" : "are"
            } ${blockedTasks} blocked task${
                blockedTasks === 1 ? "" : "s"
            } that require attention. `;
        }

        if (overdueTasks > 0) {
            text += `There ${
                overdueTasks === 1 ? "is" : "are"
            } ${overdueTasks} overdue task${
                overdueTasks === 1 ? "" : "s"
            }. `;
        }

        if (activeSprintName !== "No active sprint") {
            text += `The active sprint is "${activeSprintName}" `;
            text += `with approximately ${sprintProgress.toFixed(
                1
            )}% progress and a status of ${sprintStatus}. `;
        } else {
            text += "There is currently no active sprint. ";
        }

        text += `The project team is ${teamName}. `;

        if (teamMemberCount > 0) {
            text += `The team has ${teamMemberCount} member${
                teamMemberCount === 1 ? "" : "s"
            }. `;
        }

        if (teamProgress > 0) {
            text += `Team progress is approximately ${teamProgress.toFixed(
                1
            )}%. `;
        }

        if (risks.length > 0) {
            text += `${
                risks.length
            } risk or issue${
                risks.length === 1 ? "" : "s"
            } ${
                risks.length === 1 ? "has" : "have"
            } been identified. `;
        } else {
            text +=
                "No risks or issues were returned by the project risk endpoint. ";
        }

        if (projectDeadline) {
            const deadline = new Date(projectDeadline);

            if (!Number.isNaN(deadline.getTime())) {
                text += `The project deadline is ${deadline.toLocaleDateString()}. `;
            }
        }

        if (
            estimatedHours > 0 ||
            actualHours > 0
        ) {
            text += `Recorded workload is ${actualHours} actual hours against ${estimatedHours} estimated hours.`;
        }

        return text;
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">

            {/* HEADER */}
            <div className="mb-6 flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                        <Sparkles size={24} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            AI Project Summary
                        </h2>

                        <p className="text-sm text-slate-500">
                            Generate an intelligent overview using the
                            project's current dashboard and risk data.
                        </p>
                    </div>

                </div>

                {dashboard && (
                    <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${healthClass}`}
                    >
                        {health}
                    </span>
                )}

            </div>

            {/* PROJECT SELECTOR */}
            <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Project
                </label>

                <select
                    value={projectId}
                    onChange={(event) => {
                        setProjectId(event.target.value);
                        setDashboard(null);
                        setRisks([]);
                        setError("");
                    }}
                    disabled={loadingProjects}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">
                        {loadingProjects
                            ? "Loading projects..."
                            : "Select a project"}
                    </option>

                    {projects.map((project) => {
                        const id =
                            project?.id ??
                            project?.projectId;

                        return (
                            <option
                                key={id}
                                value={id}
                            >
                                {project?.name ??
                                    project?.projectName ??
                                    "Unnamed Project"}
                            </option>
                        );
                    })}
                </select>

            </div>

            {/* GENERATE BUTTON */}
            <button
                type="button"
                onClick={generateSummary}
                disabled={
                    loadingSummary ||
                    loadingProjects ||
                    !projectId
                }
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <RefreshCw
                    size={18}
                    className={
                        loadingSummary
                            ? "animate-spin"
                            : ""
                    }
                />

                {loadingSummary
                    ? "Generating..."
                    : "Generate Summary"}
            </button>

            {/* ERROR */}
            {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* SUMMARY */}
            {dashboard && (
                <div className="mt-6">

                    {/* SUMMARY TEXT */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">

                        <div className="mb-4 flex items-center gap-2">

                            <Sparkles
                                size={20}
                                className="text-amber-600"
                            />

                            <h3 className="font-semibold text-slate-900">
                                Project Overview
                            </h3>

                        </div>

                        <p className="leading-7 text-slate-700">
                            {getSummaryText()}
                        </p>

                    </div>

                    {/* METRICS */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                                <Activity size={18} />
                                <span className="text-sm">
                                    Project Progress
                                </span>
                            </div>

                            <div className="text-2xl font-bold text-slate-900">
                                {projectProgress.toFixed(1)}%
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                                <ListTodo size={18} />
                                <span className="text-sm">
                                    Completed Tasks
                                </span>
                            </div>

                            <div className="text-2xl font-bold text-slate-900">
                                {completedTasks}
                                <span className="ml-1 text-sm font-normal text-slate-500">
                                    / {totalTasks}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                                <Users size={18} />
                                <span className="text-sm">
                                    Team Members
                                </span>
                            </div>

                            <div className="text-2xl font-bold text-slate-900">
                                {teamMemberCount}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-500">
                                <AlertTriangle size={18} />
                                <span className="text-sm">
                                    Risks / Issues
                                </span>
                            </div>

                            <div className="text-2xl font-bold text-slate-900">
                                {risks.length}
                            </div>
                        </div>

                    </div>

                    {/* PROJECT DETAILS */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        {/* TASK STATUS */}
                        <div className="rounded-xl border border-slate-200 p-5">

                            <h3 className="mb-4 font-semibold text-slate-900">
                                Task Status
                            </h3>

                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        Completed
                                    </span>

                                    <span className="font-semibold text-emerald-600">
                                        {completedTasks}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        In Progress
                                    </span>

                                    <span className="font-semibold text-blue-600">
                                        {inProgressTasks}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        To Do
                                    </span>

                                    <span className="font-semibold text-slate-600">
                                        {todoTasks}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        Blocked
                                    </span>

                                    <span className="font-semibold text-red-600">
                                        {blockedTasks}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-600">
                                        Overdue
                                    </span>

                                    <span className="font-semibold text-amber-600">
                                        {overdueTasks}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* SPRINT */}
                        <div className="rounded-xl border border-slate-200 p-5">

                            <h3 className="mb-4 font-semibold text-slate-900">
                                Active Sprint
                            </h3>

                            <div className="mb-4">

                                <p className="text-lg font-semibold text-slate-900">
                                    {activeSprintName}
                                </p>

                                <p className="text-sm text-slate-500">
                                    Status: {sprintStatus}
                                </p>

                            </div>

                            <div className="mb-2 flex justify-between text-sm">

                                <span className="text-slate-600">
                                    Sprint Progress
                                </span>

                                <span className="font-semibold text-slate-900">
                                    {sprintProgress.toFixed(1)}%
                                </span>

                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                sprintProgress
                                            )
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    {/* RISKS */}
                    {risks.length > 0 && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">

                            <div className="mb-4 flex items-center gap-2">

                                <AlertTriangle
                                    size={20}
                                    className="text-red-600"
                                />

                                <h3 className="font-semibold text-red-800">
                                    Risks & Issues
                                </h3>

                            </div>

                            <div className="space-y-3">

                                {risks.slice(0, 10).map(
                                    (risk, index) => {

                                        const title =
                                            getValue(
                                                risk,
                                                "title",
                                                "Title",
                                                "name",
                                                "Name",
                                                "description",
                                                "Description"
                                            ) ||
                                            `Risk / Issue ${index + 1}`;

                                        const severity =
                                            getValue(
                                                risk,
                                                "severity",
                                                "Severity",
                                                "riskLevel",
                                                "RiskLevel"
                                            ) || "Unknown";

                                        return (
                                            <div
                                                key={
                                                    risk?.id ??
                                                    risk?.riskId ??
                                                    index
                                                }
                                                className="rounded-lg border border-red-100 bg-white p-4"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {title}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                        {severity}
                                                    </span>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    )}

                    {/* POSITIVE INDICATORS */}
                    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                        <div className="mb-3 flex items-center gap-2">

                            <CheckCircle2
                                size={20}
                                className="text-emerald-600"
                            />

                            <h3 className="font-semibold text-emerald-800">
                                Project Indicators
                            </h3>

                        </div>

                        <ul className="space-y-2 text-sm text-emerald-800">

                            {completedTasks > 0 && (
                                <li>
                                    • {completedTasks} task
                                    {completedTasks === 1
                                        ? ""
                                        : "s"} completed.
                                </li>
                            )}

                            {blockedTasks === 0 && (
                                <li>
                                    • No blocked tasks were reported.
                                </li>
                            )}

                            {overdueTasks === 0 && (
                                <li>
                                    • No overdue tasks were reported.
                                </li>
                            )}

                            {risks.length === 0 && (
                                <li>
                                    • No risks or issues were returned.
                                </li>
                            )}

                            {teamMemberCount > 0 && (
                                <li>
                                    • {teamMemberCount} team member
                                    {teamMemberCount === 1
                                        ? ""
                                        : "s"} assigned.
                                </li>
                            )}

                        </ul>

                    </div>

                </div>
            )}

            {/* EMPTY STATE */}
            {!dashboard &&
                !loadingSummary &&
                !error && (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                        <Sparkles
                            size={32}
                            className="mx-auto mb-3 text-slate-400"
                        />

                        <p className="font-medium text-slate-700">
                            Select a project and generate its summary.
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            The summary is generated from the project's
                            current dashboard and risk information.
                        </p>

                    </div>
                )}

        </div>
    );
}

export default AIProjectSummary;
