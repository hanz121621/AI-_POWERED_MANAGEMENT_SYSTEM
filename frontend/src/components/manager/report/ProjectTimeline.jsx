import React, { useEffect, useState } from "react";

import {
    CalendarDays,
    AlertTriangle,
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getProjectTimeline,
} from "../../../services/projectReportService";

function ProjectTimeline() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [timeline, setTimeline] = useState([]);
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
            loadTimeline(projectId);
        }
    }, [projectId]);

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

    const loadTimeline = async (id) => {
        setLoading(true);
        setError("");

        try {
            const response =
                await getProjectTimeline(
                    id,
                    token
                );

            const data =
                Array.isArray(response)
                    ? response
                    : response?.data ||
                      response?.items ||
                      response?.milestones ||
                      [];

            setTimeline(data);
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to load project timeline."
            );

            setTimeline([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">

            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                    <CalendarDays size={22} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Project Timeline
                    </h2>

                    <p className="text-sm text-slate-500">
                        Milestones and project deadlines.
                    </p>
                </div>
            </div>

            <select
                value={projectId}
                onChange={(e) =>
                    setProjectId(e.target.value)
                }
                className="mb-6 w-full rounded-lg border border-slate-300 px-4 py-3"
            >
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

            {error && (
                <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
                    <div className="flex gap-2">
                        <AlertTriangle size={18} />
                        {error}
                    </div>
                </div>
            )}

            {loading ? (
                <p className="text-slate-500">
                    Loading timeline...
                </p>
            ) : timeline.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                    No timeline information available.
                </div>
            ) : (
                <div className="space-y-4">
                    {timeline.map(
                        (item, index) => (
                            <div
                                key={
                                    item?.id ??
                                    index
                                }
                                className="rounded-lg border border-slate-200 p-4"
                            >
                                <h3 className="font-semibold text-slate-900">
                                    {item?.title ??
                                        item?.name ??
                                        item?.milestone ??
                                        "Timeline Item"}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {item?.date ??
                                        item?.dueDate ??
                                        item?.endDate ??
                                        "Date not available"}
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}

        </div>
    );
}

export default ProjectTimeline;