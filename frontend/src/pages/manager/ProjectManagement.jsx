import React from "react";
import {
  FolderKanban,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

import ProjectCard from "../../components/manager/project/ProjectCard";
import ProjectStatsCard from "../../components/manager/project/ProjectStatsCard";

function ProjectManagement() {
  const projects = [
    {
      id: 1,
      name: "AI-Powered Project Management System",
      description:
        "AI based project planning, monitoring and collaboration platform.",
      status: "Active",
      progress: 75,
      deadline: "August 30, 2026",
      team: 12,
    },
    {
      id: 2,
      name: "FieldSync",
      description:
        "Offline-first rural reporting and data synchronization system.",
      status: "Planning",
      progress: 40,
      deadline: "October 15, 2026",
      team: 8,
    },
    {
      id: 3,
      name: "Library Management System",
      description: "University library automation system.",
      status: "Completed",
      progress: 100,
      deadline: "July 20, 2026",
      team: 5,
    },
  ];

  const projectStats = [
    {
      title: "Total Projects",
      value: "24",
      icon: FolderKanban,
      color: "bg-blue-600",
    },
    {
      title: "Active Projects",
      value: "12",
      icon: Clock,
      color: "bg-purple-600",
    },
    {
      title: "Completed",
      value: "8",
      icon: CheckCircle,
      color: "bg-green-600",
    },
    {
      title: "AI Risks",
      value: "4",
      icon: AlertTriangle,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <main className="min-h-screen">
        <div className="px-6 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Project Management
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage projects, specifications, timelines and progress.
            </p>
          </div>

          {/* Statistics */}
          <section className="mb-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {projectStats.map((item) => (
                <div
                  key={item.title}
                  className="
                    rounded-xl
                    border border-gray-800
                    bg-[#0f172a]
                    shadow-lg
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:border-blue-500/50
                  "
                >
                  <ProjectStatsCard
                    title={item.title}
                    value={item.value}
                    icon={item.icon}
                    color={item.color}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Projects Header */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Assigned Projects
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Track progress and manage your assigned projects.
                </p>
              </div>

              <div className="hidden rounded-full border border-gray-700 bg-[#0f172a] px-4 py-2 text-sm text-gray-400 sm:block">
                {projects.length} Projects
              </div>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProjectManagement;