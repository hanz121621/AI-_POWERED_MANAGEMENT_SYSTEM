// ============================================================
// PROJECT DASHBOARD REPORT
// src/components/manager/report/ViewProjectDashboard.jsx
// ============================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    BarChart3,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    ListChecks,
    Users,
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getProjectDashboard,
} from "../../../services/projectReportService";

function ViewProjectDashboard() {
    const [projects, setProjects] =
        useState([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const accessToken =
        localStorage.getItem(
            "aipms_access_token"
        ) ||
        localStorage.getItem(
            "accessToken"
        ) ||
        localStorage.getItem("token") ||
        null;

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (selectedProjectId) {
            loadDashboard(
                selectedProjectId
            );
        }
    }, [selectedProjectId]);

    const loadProjects = async () => {
        setLoading(true);
        setError("");

        try {
            const response =
                await getAuthorizedManagerProjects(
                    accessToken
                );

            const list =
                Array.isArray(response)
                    ? response
                    : Array.isArray(
                          response?.data
                      )
                    ? response.data
                    : Array.isArray(
                          response?.projects
                      )
                    ? response.projects
                    : [];

            setProjects(list);

            if (list.length > 0) {
                const id =
                    list[0]?.id ??
                    list[0]?.projectId ??
                    list[0]?.ProjectId;

                setSelectedProjectId(
                    String(id)
                );
            }
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadDashboard = async (
        projectId
    ) => {
        setLoading(true);
        setError("");

        try {
            const response =
                await getProjectDashboard(
                    projectId,
                    accessToken
                );

            setDashboard(
                response?.data ??
                    response ??
                    null
            );
        } catch (err) {
            setDashboard(null);

            setError(
                err?.message ||
                    "Unable to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const value = (
        keys,
        fallback = 0
    ) => {
        for (const key of keys) {
            if (
                dashboard?.[key] !==
                    undefined &&
                dashboard?.[key] !== null
            ) {
                return dashboard[key];
            }
        }

        return fallback;
    };

    const totalTasks = value([
        "totalTasks",
        "taskCount",
        "TotalTasks",
    ]);

    const completedTasks = value([
        "completedTasks",
        "completedTaskCount",
        "CompletedTasks",
    ]);

    const activeSprints = value([
        "activeSprints",
        "activeSprintCount",
        "ActiveSprints",
    ]);

    const teamMembers = value([
        "teamMembers",
        "memberCount",
        "totalMembers",
        "TeamMembers",
    ]);

    const completionRate =
        Number(totalTasks) > 0
            ? Math.round(
                  (Number(
                      completedTasks
                  ) /
                      Number(
                          totalTasks
                      )) *
                      100
              )
            : 0;

    return (
        <div className="p-6">

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Project Dashboard
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Project overview and performance.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        loadDashboard(
                            selectedProjectId
                        )
                    }
                    disabled={
                        loading ||
                        !selectedProjectId
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh
                </button>

            </div>

            <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Project
                </label>

                <select
                    value={
                        selectedProjectId
                    }
                    onChange={(event) =>
                        setSelectedProjectId(
                            event.target.value
                        )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                    {projects.map(
                        (project) => {
                            const id =
                                project?.id ??
                                project?.projectId ??
                                project?.ProjectId;

                            return (
                                <option
                                    key={id}
                                    value={id}
                                >
                                    {project?.name ??
                                        project?.projectName ??
                                        project?.title ??
                                        "Unnamed Project"}
                                </option>
                            );
                        }
                    )}
                </select>

            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    <div className="flex gap-2">
                        <AlertTriangle
                            size={18}
                        />
                        {error}
                    </div>
                </div>
            )}

            {!loading && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Total Tasks"
                        value={
                            totalTasks
                        }
                        icon={
                            <ListChecks
                                size={22}
                            />
                        }
                    />

                    <StatCard
                        title="Completed Tasks"
                        value={
                            completedTasks
                        }
                        icon={
                            <CheckCircle2
                                size={22}
                            />
                        }
                    />

                    <StatCard
                        title="Active Sprints"
                        value={
                            activeSprints
                        }
                        icon={
                            <BarChart3
                                size={22}
                            />
                        }
                    />

                    <StatCard
                        title="Team Members"
                        value={
                            teamMembers
                        }
                        icon={
                            <Users
                                size={22}
                            />
                        }
                    />

                </div>
            )}

            {!loading && dashboard && (
                <div className="mt-6 rounded-xl border border-slate-200 p-6">

                    <div className="mb-3 flex justify-between">

                        <span className="text-sm font-medium text-slate-600">
                            Task Completion
                        </span>

                        <span className="font-bold text-slate-900">
                            {completionRate}%
                        </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                        <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                                width: `${Math.min(
                                    Math.max(
                                        completionRate,
                                        0
                                    ),
                                    100
                                )}%`,
                            }}
                        />

                    </div>

                </div>
            )}

        </div>
    );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    title,
    value,
    icon,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {Number(
                            value || 0
                        ).toLocaleString()}
                    </p>
                </div>

                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    {icon}
                </div>

            </div>

        </div>
    );
}

export default ViewProjectDashboard;