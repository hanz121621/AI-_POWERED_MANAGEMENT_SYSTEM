import React, {
    useEffect,
    useState,
} from "react";

import {
    ListChecks,
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getProjectSprints,
    getSprintProgress,
} from "../../../services/projectReportService";

function SprintProgressReport() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [sprints, setSprints] = useState([]);
    const [sprintId, setSprintId] = useState("");
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token =
        localStorage.getItem("aipms_access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        null;

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (projectId) {
            loadSprints(projectId);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId && sprintId) {
            loadProgress(
                projectId,
                sprintId
            );
        }
    }, [projectId, sprintId]);

    const loadProjects = async () => {
        try {
            const response =
                await getAuthorizedManagerProjects(token);

            const data =
                Array.isArray(response)
                    ? response
                    : response?.data || [];

            setProjects(data);

            if (data.length) {
                setProjectId(
                    String(
                        data[0]?.id ??
                            data[0]?.projectId
                    )
                );
            }
        } catch (err) {
            setError(err?.message || "Unable to load projects.");
        }
    };

    const loadSprints = async (id) => {
        setLoading(true);
        setSprintId("");

        try {
            const response =
                await getProjectSprints(
                    id,
                    token
                );

            const data =
                Array.isArray(response)
                    ? response
                    : response?.data ||
                      response?.items ||
                      response?.sprints ||
                      [];

            setSprints(data);
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to load sprints."
            );
            setSprints([]);
        } finally {
            setLoading(false);
        }
    };

    const loadProgress = async (
        project,
        sprint
    ) => {
        setLoading(true);

        try {
            const response =
                await getSprintProgress(
                    project,
                    sprint,
                    token
                );

            setProgress(
                response?.data ??
                    response ??
                    null
            );
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to load sprint progress."
            );
            setProgress(null);
        } finally {
            setLoading(false);
        }
    };

    const get = (
        keys,
        fallback = 0
    ) => {
        for (const key of keys) {
            if (
                progress?.[key] !==
                    undefined &&
                progress?.[key] !== null
            ) {
                return progress[key];
            }
        }

        return fallback;
    };

    return (
        <div className="p-6">

            <div className="mb-6 flex items-center gap-3">

                <div className="rounded-lg bg-green-100 p-3 text-green-600">
                    <ListChecks size={22} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Sprint Progress
                    </h2>

                    <p className="text-sm text-slate-500">
                        Sprint task completion and progress.
                    </p>
                </div>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <select
                    value={projectId}
                    onChange={(e) =>
                        setProjectId(
                            e.target.value
                        )
                    }
                    className="rounded-lg border border-slate-300 px-4 py-3"
                >
                    {projects.map(
                        (project) => {
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
                        }
                    )}
                </select>

                <select
                    value={sprintId}
                    onChange={(e) =>
                        setSprintId(
                            e.target.value
                        )
                    }
                    className="rounded-lg border border-slate-300 px-4 py-3"
                >
                    <option value="">
                        Select Sprint
                    </option>

                    {sprints.map(
                        (sprint) => {
                            const id =
                                sprint?.id ??
                                sprint?.sprintId;

                            return (
                                <option
                                    key={id}
                                    value={id}
                                >
                                    {sprint?.name ??
                                        sprint?.sprintName ??
                                        "Sprint"}
                                </option>
                            );
                        }
                    )}
                </select>

            </div>

            {error && (
                <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {loading && (
                <p className="mt-6 text-slate-500">
                    Loading sprint report...
                </p>
            )}

            {!loading && progress && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <Metric
                        title="Total Tasks"
                        value={get([
                            "totalTasks",
                            "taskCount",
                            "TotalTasks",
                        ])}
                    />

                    <Metric
                        title="Completed"
                        value={get([
                            "completedTasks",
                            "completedTaskCount",
                            "CompletedTasks",
                        ])}
                    />

                    <Metric
                        title="Remaining"
                        value={get([
                            "remainingTasks",
                            "pendingTasks",
                            "RemainingTasks",
                        ])}
                    />

                    <Metric
                        title="Progress"
                        value={`${get([
                            "completionRate",
                            "progress",
                            "percentage",
                        ])}%`}
                    />

                </div>
            )}

        </div>
    );
}

function Metric({
    title,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
                {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
                {value}
            </p>
        </div>
    );
}

export default SprintProgressReport;