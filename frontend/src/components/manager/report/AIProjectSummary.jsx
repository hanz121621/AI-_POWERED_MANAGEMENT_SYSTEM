import React, {
    useEffect,
    useState,
} from "react";

import {
    Sparkles,
    RefreshCw,
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getAIProjectSummary,
} from "../../../services/projectReportService";

function AIProjectSummary() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token =
        localStorage.getItem("aipms_access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        null;

    useEffect(() => {
        loadProjects();
    }, []);

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
            setError(
                err?.message ||
                    "Unable to load projects."
            );
        }
    };

    const generateSummary = async () => {
        if (!projectId) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response =
                await getAIProjectSummary(
                    projectId,
                    token
                );

            setSummary(
                response?.data ??
                    response ??
                    null
            );
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to generate AI project summary."
            );

            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">

            <div className="mb-6 flex items-center gap-3">

                <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
                    <Sparkles size={22} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        AI Project Summary
                    </h2>

                    <p className="text-sm text-slate-500">
                        Generate an AI-powered project overview.
                    </p>
                </div>

            </div>

            <select
                value={projectId}
                onChange={(e) =>
                    setProjectId(
                        e.target.value
                    )
                }
                className="mb-5 w-full rounded-lg border border-slate-300 px-4 py-3"
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

            <button
                type="button"
                onClick={
                    generateSummary
                }
                disabled={
                    loading ||
                    !projectId
                }
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
                <RefreshCw
                    size={18}
                    className={
                        loading
                            ? "animate-spin"
                            : ""
                    }
                />

                {loading
                    ? "Generating..."
                    : "Generate Summary"}
            </button>

            {error && (
                <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {summary && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">

                    <div className="mb-4 flex items-center gap-2">
                        <Sparkles
                            size={20}
                            className="text-amber-600"
                        />

                        <h3 className="font-semibold text-slate-900">
                            AI Summary
                        </h3>
                    </div>

                    <div className="whitespace-pre-wrap leading-7 text-slate-700">
                        {summary?.summary ??
                            summary?.content ??
                            summary?.text ??
                            JSON.stringify(
                                summary,
                                null,
                                2
                            )}
                    </div>

                </div>
            )}

        </div>
    );
}

export default AIProjectSummary;