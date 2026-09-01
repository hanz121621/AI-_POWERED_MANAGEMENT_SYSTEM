import React, {
    useEffect,
    useState,
} from "react";

import {
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getProjectRisksAndIssues,
} from "../../../services/projectReportService";

function RiskIssues() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [risks, setRisks] = useState([]);
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
            loadRisks(projectId);
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

    const loadRisks = async (id) => {
        setLoading(true);

        try {
            const response =
                await getProjectRisksAndIssues(
                    id,
                    token
                );

            const data =
                Array.isArray(response)
                    ? response
                    : response?.data ||
                      response?.items ||
                      response?.risks ||
                      [];

            setRisks(data);
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to load risks and issues."
            );

            setRisks([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">

            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-3 text-red-600">
                    <AlertTriangle size={22} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Risks & Issues
                    </h2>

                    <p className="text-sm text-slate-500">
                        Monitor current project risks and issues.
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
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-slate-500">
                    Loading risks...
                </p>
            ) : risks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

                    <CheckCircle2
                        size={40}
                        className="mx-auto mb-3 text-green-500"
                    />

                    <p className="font-medium text-slate-700">
                        No risks or issues found
                    </p>

                </div>
            ) : (
                <div className="space-y-3">
                    {risks.map(
                        (risk, index) => (
                            <div
                                key={
                                    risk?.id ??
                                    risk?.riskId ??
                                    index
                                }
                                className="rounded-lg border border-slate-200 p-4"
                            >
                                <div className="flex justify-between gap-4">

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {risk?.title ??
                                                risk?.name ??
                                                risk?.issue ??
                                                "Risk / Issue"}
                                        </h3>

                                        {risk?.description && (
                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    risk.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <span className="h-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                        {risk?.severity ??
                                            risk?.priority ??
                                            "Unknown"}
                                    </span>

                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

        </div>
    );
}

export default RiskIssues;