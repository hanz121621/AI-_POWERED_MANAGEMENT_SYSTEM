
import { useState } from "react";

import {
    FolderKanban,
    LayoutDashboard,
    UsersRound,
} from "lucide-react";

import ViewAssignedProjects from "@/components/contributor/teamleader/project-participation/ViewAssignedProjects";
import ViewProjectDetails from "@/components/contributor/teamleader/project-participation/ViewProjectDetails";

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);

    const handleSelectProject = (project) => {
        setSelectedProject(project);
    };

    const handleBack = () => {
        setSelectedProject(null);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                                <FolderKanban className="h-6 w-6 text-indigo-600" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                        Project Participation
                                    </h1>
                                </div>

                                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                                    View assigned projects, understand project
                                    responsibilities, and monitor your team's
                                    participation and progress.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <UsersRound className="h-5 w-5 text-indigo-600" />

                            <div>
                                <p className="text-xs text-slate-400">
                                    Role
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    Team Leader
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex items-center gap-2 text-sm">
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />

                    <span className="text-slate-400">
                        Project Participation
                    </span>

                    <span className="text-slate-300">
                        /
                    </span>

                    <span className="font-medium text-slate-700">
                        {selectedProject
                            ? "Project Details"
                            : "Assigned Projects"}
                    </span>

                    {selectedProject?.name && (
                        <>
                            <span className="text-slate-300">
                                /
                            </span>

                            <span className="max-w-xs truncate font-medium text-indigo-600">
                                {selectedProject.name}
                            </span>
                        </>
                    )}
                </div>

                {selectedProject ? (
                    <ViewProjectDetails
                        project={selectedProject}
                        onBack={handleBack}
                    />
                ) : (
                    <ViewAssignedProjects
                        onSelectProject={handleSelectProject}
                    />
                )}
            </div>
        </div>
    );
}
