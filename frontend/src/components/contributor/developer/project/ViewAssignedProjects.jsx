import { useEffect, useState } from "react";
import {
    FolderKanban,
    CalendarDays,
    UserRound,
    RefreshCw,
    AlertCircle,
    ArrowUpRight,
} from "lucide-react";

import { getMyDeveloperProjects } from "@/services/projectService";

export default function ViewAssignedProjects({ onSelectProject }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchProjects = async () => {
            try {
                const data = await getMyDeveloperProjects();

                if (cancelled) return;

                setProjects(Array.isArray(data) ? data : []);
                setError("");
            } catch (err) {
                if (cancelled) return;

                setProjects([]);
                setError(
                    err?.message ||
                    "Unable to load your assigned projects."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProjects();

        return () => {
            cancelled = true;
        };
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getMyDeveloperProjects();

            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            setProjects([]);
            setError(
                err?.message ||
                "Unable to load your assigned projects."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not set";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not set";
        }

        return parsedDate.toLocaleDateString();
    };

    const getProgress = (project) => {
        const value = Number(
            project?.progressPercentage ??
            project?.progress ??
            0
        );

        return Math.min(
            100,
            Math.max(0, value)
        );
    };

    const getStatus = (project) => {
        return (
            project?.statusName ||
            project?.status ||
            "Unknown"
        );
    };

    if (loading) {
        return (
            <section className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="flex min-h-[300px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <RefreshCw className="h-6 w-6 animate-spin" />
                        <p>Loading your assigned projects...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">
                            Assigned Projects
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Projects assigned to your teams.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadProjects}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                    <div>
                        <p className="font-medium text-destructive">
                            Unable to load projects
                        </p>

                        <p className="mt-1 text-muted-foreground">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {!error && projects.length === 0 && (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                        <FolderKanban className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-base font-semibold">
                        No assigned projects
                    </h3>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        You are not currently assigned to any active team
                        with projects.
                    </p>
                </div>
            )}

            {projects.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project, index) => {
                        const projectId = project?.id;
                        const projectName =
                            project?.name ||
                            "Unnamed Project";

                        const progress =
                            getProgress(project);

                        return (
                            <article
                                key={
                                    projectId ??
                                    `${projectName}-${index}`
                                }
                                className="group rounded-xl border border-border/70 bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <FolderKanban className="h-5 w-5 text-primary" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold">
                                                {projectName}
                                            </h3>

                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {getStatus(project)}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                        {getStatus(project)}
                                    </span>
                                </div>

                                <p className="mb-5 line-clamp-3 text-sm text-muted-foreground">
                                    {project?.description ||
                                        "No project description available."}
                                </p>

                                <div className="mb-5">
                                    <div className="mb-2 flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Progress
                                        </span>

                                        <span className="font-medium">
                                            {progress}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-border/70 pt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <UserRound className="h-4 w-4 text-muted-foreground" />

                                        <span className="text-muted-foreground">
                                            Manager:
                                        </span>

                                        <span className="truncate font-medium">
                                            {project?.managerName ||
                                                "Not assigned"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />

                                        <span className="text-muted-foreground">
                                            Start:
                                        </span>

                                        <span className="font-medium">
                                            {formatDate(
                                                project?.startDate
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectProject?.(
                                            project
                                        )
                                    }
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                                >
                                    View Project Details
                                    <ArrowUpRight className="h-4 w-4" />
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}