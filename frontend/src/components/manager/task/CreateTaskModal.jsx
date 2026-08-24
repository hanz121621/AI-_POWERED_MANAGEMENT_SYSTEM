
import React, { useEffect, useState } from "react";
import { X, Plus, AlertCircle } from "lucide-react";

function CreateTaskModal({
  open,
  onClose,
  onCreate,
  projects = [],
  sprints = [],
  contributors = [],
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Development",
    priority: "Medium",
    contributor: "",
    effort: "",
    deadline: "",
    projectId: "",
    sprintId: "",
    dependencies: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        title: "",
        description: "",
        type: "Development",
        priority: "Medium",
        contributor: "",
        effort: "",
        deadline: "",
        projectId: "",
        sprintId: "",
        dependencies: "",
      });

      setError("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.contributor ||
      !form.effort ||
      !form.deadline ||
      !form.projectId ||
      !form.sprintId
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(form.effort) <= 0) {
      setError("Estimated effort must be greater than 0.");
      return;
    }

    const selectedContributor = contributors.find(
      (item) =>
        String(item.id) === String(form.contributor)
    );

    if (!selectedContributor) {
      setError("Contributor not found.");
      return;
    }

    const selectedProject = projects.find(
      (item) =>
        String(item.id) === String(form.projectId)
    );

    if (!selectedProject) {
      setError("Project not found.");
      return;
    }

    const selectedSprint = sprints.find(
      (item) =>
        String(item.id) === String(form.sprintId)
    );

    if (!selectedSprint) {
      setError("Sprint not found.");
      return;
    }

    if (
      selectedSprint.projectId &&
      String(selectedSprint.projectId) !==
        String(form.projectId)
    ) {
      setError(
        "The selected sprint does not belong to this project."
      );
      return;
    }

    const dependencies = form.dependencies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    onCreate({
      ...form,

      title: form.title.trim(),

      description: form.description.trim(),

      effort: Number(form.effort),

      dependencies,

      project: selectedProject.name,

      sprint: selectedSprint.name,

      contributorName:
        selectedContributor.name ||
        selectedContributor.fullName ||
        selectedContributor.username,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}

      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-800 bg-[#0f172a] shadow-2xl">
        {/* HEADER */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-800 bg-[#0f172a] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              Create New Task
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Create and assign development work to a contributor.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Task Title <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Implement user authentication"
              className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Task Description{" "}
              <span className="text-red-400">*</span>
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what needs to be implemented..."
              className="w-full resize-none rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* TYPE + PRIORITY */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Task Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="Development">
                  Development
                </option>

                <option value="Bug Fix">
                  Bug Fix
                </option>

                <option value="Testing">
                  Testing
                </option>

                <option value="Design">
                  Design
                </option>

                <option value="Documentation">
                  Documentation
                </option>

                <option value="Research">
                  Research
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">
                  Critical
                </option>
              </select>
            </div>
          </div>

          {/* PROJECT + SPRINT */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Project <span className="text-red-400">*</span>
              </label>

              <select
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="">
                  Select project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Related Sprint{" "}
                <span className="text-red-400">*</span>
              </label>

              <select
                name="sprintId"
                value={form.sprintId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="">
                  Select sprint
                </option>

                {sprints
                  .filter((sprint) => {
                    if (!form.projectId) {
                      return true;
                    }

                    return (
                      !sprint.projectId ||
                      String(sprint.projectId) ===
                        String(form.projectId)
                    );
                  })
                  .map((sprint) => (
                    <option
                      key={sprint.id}
                      value={sprint.id}
                    >
                      {sprint.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* CONTRIBUTOR */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Assigned Contributor{" "}
              <span className="text-red-400">*</span>
            </label>

            <select
              name="contributor"
              value={form.contributor}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">
                Select contributor
              </option>

              {contributors.map((contributor) => (
                <option
                  key={contributor.id}
                  value={contributor.id}
                >
                  {contributor.name ||
                    contributor.fullName ||
                    contributor.username}
                </option>
              ))}
            </select>
          </div>

          {/* EFFORT + DEADLINE */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Estimated Effort{" "}
                <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="effort"
                  value={form.effort}
                  onChange={handleChange}
                  min="1"
                  placeholder="Example: 8"
                  className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 pr-16 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  hours
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Deadline{" "}
                <span className="text-red-400">*</span>
              </label>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* DEPENDENCIES */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Task Dependencies
            </label>

            <input
              type="text"
              name="dependencies"
              value={form.dependencies}
              onChange={handleChange}
              placeholder="Example: TASK-101, TASK-102"
              className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              Optional. Separate multiple task IDs with commas.
            </p>
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Plus size={18} />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;

