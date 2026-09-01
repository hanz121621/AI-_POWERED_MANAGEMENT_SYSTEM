import React, {
    useEffect,
    useState,
} from "react";

import {
    Users,
} from "lucide-react";

import {
    getAuthorizedManagerProjects,
    getTeamPerformance,
} from "../../../services/projectReportService";

function TeamPerformanceReport() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [members, setMembers] = useState([]);
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
            loadPerformance(projectId);
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

    const loadPerformance = async (
        id
    ) => {
        setLoading(true);

        try {
            const response =
                await getTeamPerformance(
                    id,
                    token
                );

            const data =
                Array.isArray(response)
                    ? response
                    : response?.data ||
                      response?.items ||
                      response?.members ||
                      [];

            setMembers(data);
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to load team performance."
            );

            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">

            <div className="mb-6 flex items-center gap-3">

                <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                    <Users size={22} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Team Performance
                    </h2>

                    <p className="text-sm text-slate-500">
                        Team productivity and contribution.
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
                className="mb-6 w-full rounded-lg border border-slate-300 px-4 py-3"
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

            {error && (
                <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-slate-500">
                    Loading team performance...
                </p>
            ) : members.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                    No team performance data available.
                </div>
            ) : (
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b border-slate-200 text-left">
                                <th className="px-4 py-3">
                                    Member
                                </th>

                                <th className="px-4 py-3">
                                    Completed
                                </th>

                                <th className="px-4 py-3">
                                    Total Tasks
                                </th>

                                <th className="px-4 py-3">
                                    Performance
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {members.map(
                                (
                                    member,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            member?.id ??
                                            member?.userId ??
                                            index
                                        }
                                        className="border-b border-slate-100"
                                    >
                                        <td className="px-4 py-4 font-medium">
                                            {member?.name ??
                                                member?.fullName ??
                                                member?.email ??
                                                "Member"}
                                        </td>

                                        <td className="px-4 py-4">
                                            {member?.completedTasks ??
                                                0}
                                        </td>

                                        <td className="px-4 py-4">
                                            {member?.totalTasks ??
                                                0}
                                        </td>

                                        <td className="px-4 py-4">
                                            {member?.performance ??
                                                member?.completionRate ??
                                                0}
                                            %
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

export default TeamPerformanceReport;