
import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  ListTodo,
  FileText,
  Layers3,
  GitBranch,
  User,
  Flag,
  Clock3,
  CalendarDays,
  Link2,
  CircleDot,
} from "lucide-react";

function UpdateTaskModal({
  open,
  onClose,
  onUpdate,
  task,
  projects = [],
  sprints = [],
  contributors = [],
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Development",
    priority: "Medium",
    contributor: "",
    effort: "",
    deadline: "",
    projectId: "",
    sprintId: "",
    status: "To Do",
    dependencies: [],
  });

  const [dependencyInput, setDependencyInput] =
    useState("");

  const [error, setError] = useState("");

  /*
   * =====================================================
   * LOAD SELECTED TASK
   * =====================================================
   */

  useEffect(() => {
    if (!open || !task) {
      return;
    }

    setFormData({
      title: task.title || "",
      description: task.description || "",
      type: task.type || "Development",
      priority: task.priority || "Medium",
      contributor:
        task.contributor !== undefined &&
        task.contributor !== null
          ? String(task.contributor)
          : "",
      effort:
        task.effort !== undefined &&
        task.effort !== null
          ? String(task.effort)
          : "",
      deadline: task.deadline || "",
      projectId:
        task.projectId !== undefined &&
        task.projectId !== null
          ? String(task.projectId)
          : "",
      sprintId:
        task.sprintId !== undefined &&
        task.sprintId !== null
          ? String(task.sprintId)
          : "",
      status: task.status || "To Do",
      dependencies: Array.isArray(task.dependencies)
        ? task.dependencies
        : [],
    });

    setDependencyInput("");
    setError("");
  }, [open, task]);

  /*
   * =====================================================
   * CLOSE WITH ESC
   * =====================================================
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  /*
   * =====================================================
   * INPUT HANDLER
   * =====================================================
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  /*
   * =====================================================
   * PROJECT CHANGE
   * =====================================================
   */

  const handleProjectChange = (event) => {
    const projectId = event.target.value;

    setFormData((current) => ({
      ...current,
      projectId,
      sprintId: "",
    }));

    setError("");
  };

  /*
   * =====================================================
   * DEPENDENCY ADD
   * =====================================================
   */

  const handleAddDependency = () => {
    const dependency = dependencyInput.trim();

    if (!dependency) {
      return;
    }

    if (
      dependency === task?.id
    ) {
      setError(
        "A task cannot depend on itself."
      );
      return;
    }

    if (
      formData.dependencies.includes(
        dependency
      )
    ) {
      setError(
        "This dependency has already been added."
      );
      return;
    }

    setFormData((current) => ({
      ...current,
      dependencies: [
        ...current.dependencies,
        dependency,
      ],
    }));

    setDependencyInput("");
    setError("");
  };

  /*
   * =====================================================
   * DEPENDENCY REMOVE
   * =====================================================
   */

  const handleRemoveDependency = (
    dependency
  ) => {
    setFormData((current) => ({
      ...current,
      dependencies:
        current.dependencies.filter(
          (item) =>
            item !== dependency
        ),
    }));
  };

  /*
   * =====================================================
   * SUBMIT
   * =====================================================
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!task) {
      setError("Task not found.");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.type ||
      !formData.priority ||
      !formData.contributor ||
      !formData.effort ||
      !formData.deadline ||
      !formData.projectId ||
      !formData.sprintId
    ) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    const effortNumber = Number(
      formData.effort
    );

    if (
      Number.isNaN(effortNumber) ||
      effortNumber <= 0
    ) {
      setError(
        "Estimated effort must be greater than 0."
      );
      return;
    }

    const contributorExists =
      contributors.some(
        (contributor) =>
          String(contributor.id) ===
          String(formData.contributor)
      );

    if (!contributorExists) {
      setError("Contributor not found.");
      return;
    }

    const projectExists =
      projects.some(
        (project) =>
          String(project.id) ===
          String(formData.projectId)
      );

    if (!projectExists) {
      setError("Project not found.");
      return;
    }

    const sprintExists =
      sprints.some(
        (sprint) =>
          String(sprint.id) ===
          String(formData.sprintId)
      );

    if (!sprintExists) {
      setError("Sprint not found.");
      return;
    }

    /*
     * Only allow sprints belonging
     * to the selected project.
     */

    const selectedSprint =
      sprints.find(
        (sprint) =>
          String(sprint.id) ===
          String(formData.sprintId)
      );

    if (
      selectedSprint &&
      String(selectedSprint.projectId) !==
        String(formData.projectId)
    ) {
      setError(
        "The selected sprint does not belong to the selected project."
      );
      return;
    }

    const selectedProject =
      projects.find(
        (project) =>
          String(project.id) ===
          String(formData.projectId)
      );

    const selectedContributor =
      contributors.find(
        (contributor) =>
          String(contributor.id) ===
          String(formData.contributor)
      );

    /*
     * Build updated task.
     */

    const updatedTask = {
      ...task,

      title:
        formData.title.trim(),

      description:
        formData.description.trim(),

      type:
        formData.type,

      priority:
        formData.priority,

      contributor:
        formData.contributor,

      contributorName:
        selectedContributor?.name ||
        "",

      effort:
        effortNumber,

      deadline:
        formData.deadline,

      projectId:
        formData.projectId,

      project:
        selectedProject?.name ||
        "",

      sprintId:
        formData.sprintId,

      sprint:
        selectedSprint?.name ||
        "",

      status:
        formData.status,

      dependencies:
        formData.dependencies,

      updatedAt:
        new Date().toISOString(),
    };

    /*
     * Send updated task to parent.
     */

    if (typeof onUpdate === "function") {
      onUpdate(updatedTask);
    }
  };

  /*
   * =====================================================
   * FILTER SPRINTS BY PROJECT
   * =====================================================
   */

  const availableSprints =
    sprints.filter(
      (sprint) =>
        String(sprint.projectId) ===
        String(formData.projectId)
    );

  /*
   * =====================================================
   * MODAL
   * =====================================================
   */

  if (!open || !task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#0f172a] shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <ListTodo size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Update Task
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Update {task.id} information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-6"
        >
          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm font-medium text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText
                size={17}
                className="text-blue-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Task Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* TITLE */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Task Title
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Description
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the task..."
                  className="w-full resize-none rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>

              {/* TYPE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Task Type
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
                >
                  <option value="Development">
                    Development
                  </option>

                  <option value="Research">
                    Research
                  </option>

                  <option value="Design">
                    Design
                  </option>

                  <option value="Testing">
                    Testing
                  </option>

                  <option value="Documentation">
                    Documentation
                  </option>

                  <option value="Bug Fix">
                    Bug Fix
                  </option>
                </select>
              </div>

              {/* PRIORITY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Flag size={14} />
                    Priority
                  </span>

                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <select
                  name="priority"
                  value={
                    formData.priority
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <CircleDot size={14} />
                    Status
                  </span>
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
                >
                  <option value="To Do">
                    To Do
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Blocked">
                    Blocked
                  </option>
                </select>
              </div>

              {/* CONTRIBUTOR */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} />
                    Assigned Contributor
                  </span>

                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <select
                  name="contributor"
                  value={
                    formData.contributor
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select contributor
                  </option>

                  {contributors.map(
                    (contributor) => (
                      <option
                        key={
                          contributor.id
                        }
                        value={
                          contributor.id
                        }
                      >
                        {contributor.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
              PROJECT / SPRINT
          ================================================= */}

          <div className="mb-6 rounded-2xl border border-gray-800 bg-[#020617]/40 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Layers3
                size={17}
                className="text-purple-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Project & Sprint
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* PROJECT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Project
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <select
                  name="projectId"
                  value={
                    formData.projectId
                  }
                  onChange={
                    handleProjectChange
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#0f172a] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select project
                  </option>

                  {projects.map(
                    (project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* SPRINT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <GitBranch size={14} />
                    Related Sprint
                  </span>

                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <select
                  name="sprintId"
                  value={
                    formData.sprintId
                  }
                  onChange={handleChange}
                  disabled={
                    !formData.projectId
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#0f172a] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    Select sprint
                  </option>

                  {availableSprints.map(
                    (sprint) => (
                      <option
                        key={sprint.id}
                        value={sprint.id}
                      >
                        {sprint.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
              SCHEDULE
          ================================================= */}

          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock3
                size={17}
                className="text-yellow-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Schedule & Effort
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* EFFORT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} />
                    Estimated Effort
                  </span>

                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    name="effort"
                    value={
                      formData.effort
                    }
                    onChange={handleChange}
                    placeholder="8"
                    className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 pr-16 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    hours
                  </span>
                </div>
              </div>

              {/* DEADLINE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    Deadline
                  </span>

                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={
                    formData.deadline
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              DEPENDENCIES
          ================================================= */}

          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <Link2
                size={17}
                className="text-purple-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Task Dependencies
              </h3>

              <span className="text-xs text-gray-600">
                Optional
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={
                  dependencyInput
                }
                onChange={(event) =>
                  setDependencyInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    event.preventDefault();
                    handleAddDependency();
                  }
                }}
                placeholder="Enter task ID, e.g. TASK-001"
                className="flex-1 rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
              />

              <button
                type="button"
                onClick={
                  handleAddDependency
                }
                className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-400 transition hover:bg-purple-500/20"
              >
                Add Dependency
              </button>
            </div>

            {formData.dependencies
              .length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.dependencies.map(
                  (dependency) => (
                    <div
                      key={dependency}
                      className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2"
                    >
                      <span className="text-xs font-semibold text-purple-300">
                        {dependency}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveDependency(
                            dependency
                          )
                        }
                        className="text-purple-400 transition hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <p className="mt-2 text-xs text-gray-600">
              Add the IDs of tasks that must be
              completed before this task.
            </p>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-700 bg-transparent px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <Save size={17} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTaskModal;

