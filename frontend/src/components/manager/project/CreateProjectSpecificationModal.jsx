
import React, { useState } from "react";

import {
    X,
    Save,
    FileText,
    AlertCircle,
    Sparkles,
} from "lucide-react";

const INITIAL_FORM = {
    objectives: "",
    scope: "",
    functionalRequirements: "",
    nonFunctionalRequirements: "",
    deliverables: "",
    technologyStack: "",
    assumptions: "",
    constraints: "",
};

// ============================================================
// CREATE PROJECT SPECIFICATION
//
// Use Case:
// - Create Project Specification
//
// Design:
// - Same colorful professional style as Sprint Management
// - Violet / blue / cyan gradient header
// - Slate-50 background
// - White cards
// - Rounded 2xl containers
// - Colorful field focus states
// ============================================================

function CreateProjectSpecification({
    project,
    currentManager,
    onClose,
    onCreated,
}) {
    // ========================================================
    // FORM STATE
    // ========================================================

    const [form, setForm] = useState(INITIAL_FORM);

    // ========================================================
    // ERROR / SAVE STATE
    // ========================================================

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // ========================================================
    // SAFETY CHECK
    // ========================================================

    if (!project) {
        return null;
    }

    // ========================================================
    // HANDLE FIELD CHANGE
    // ========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            general: "",
        }));
    };

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validate = () => {
        const newErrors = {};

        Object.entries(form).forEach(([key, value]) => {
            if (!String(value).trim()) {
                newErrors[key] = "This field is required.";
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // ----------------------------------------------------
        // MANAGER AUTHORIZATION
        // ----------------------------------------------------

        if (!currentManager) {
            setErrors({
                general:
                    "You are not authorised to manage this project.",
            });

            return;
        }

        if (project.managerId !== currentManager.id) {
            setErrors({
                general:
                    "You are not authorised to manage this project.",
            });

            return;
        }

        // ----------------------------------------------------
        // EXISTING SPECIFICATION CHECK
        // ----------------------------------------------------

        if (project.hasSpecification) {
            setErrors({
                general:
                    "A project specification already exists. Please update it instead.",
            });

            return;
        }

        // ----------------------------------------------------
        // FORM VALIDATION
        // ----------------------------------------------------

        if (!validate()) {
            setErrors((previous) => ({
                ...previous,
                general:
                    "Please complete all required fields.",
            }));

            return;
        }

        try {
            setSaving(true);

            /*
             * Temporary local implementation.
             *
             * Replace this section later with:
             *
             * await projectSpecificationService.create(...)
             */

            const specification = {
                ...form,

                projectId: project.id,

                createdBy: currentManager.id,

                createdAt: new Date().toISOString(),
            };

            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );

            onCreated(project.id, specification);
        } catch (error) {
            console.error(
                "Failed to create project specification:",
                error
            );

            setErrors({
                general:
                    "Unable to create the project specification. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // SPECIFICATION FIELDS
    // ========================================================

    const fields = [
        {
            name: "objectives",
            label: "Project Objectives",
            description:
                "Define the main objectives and expected outcomes of the project.",
            placeholder:
                "Define the main objectives of the project.",
            focus:
                "focus:border-violet-500 focus:ring-violet-100",
        },

        {
            name: "scope",
            label: "Project Scope",
            description:
                "Describe what is included and excluded from the project.",
            placeholder:
                "Describe what is included and excluded from the project.",
            focus:
                "focus:border-blue-500 focus:ring-blue-100",
        },

        {
            name: "functionalRequirements",
            label: "Functional Requirements",
            description:
                "Describe the functions and capabilities the system must provide.",
            placeholder:
                "Describe the functions and capabilities the system must provide.",
            focus:
                "focus:border-cyan-500 focus:ring-cyan-100",
        },

        {
            name: "nonFunctionalRequirements",
            label: "Non-functional Requirements",
            description:
                "Describe security, performance, reliability, scalability, and usability requirements.",
            placeholder:
                "Describe security, performance, reliability, scalability and usability requirements.",
            focus:
                "focus:border-emerald-500 focus:ring-emerald-100",
        },

        {
            name: "deliverables",
            label: "Deliverables",
            description:
                "List the products, documents, or results expected from the project.",
            placeholder:
                "List the expected project deliverables.",
            focus:
                "focus:border-violet-500 focus:ring-violet-100",
        },

        {
            name: "technologyStack",
            label: "Technology Stack",
            description:
                "Specify the technologies, frameworks, databases, and platforms used.",
            placeholder:
                "Specify the technologies, frameworks, databases and platforms.",
            focus:
                "focus:border-blue-500 focus:ring-blue-100",
        },

        {
            name: "assumptions",
            label: "Project Assumptions",
            description:
                "Describe assumptions made during project planning and development.",
            placeholder:
                "Describe assumptions made during project planning.",
            focus:
                "focus:border-amber-500 focus:ring-amber-100",
        },

        {
            name: "constraints",
            label: "Constraints",
            description:
                "Describe time, resource, technical, or organizational limitations.",
            placeholder:
                "Describe time, resource, technical or organizational constraints.",
            focus:
                "focus:border-orange-500 focus:ring-orange-100",
        },
    ];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm">

            <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl">

                {/* ==================================================
                    COLORFUL HEADER
                ================================================== */}

                <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 px-6 py-6 text-white sm:px-7">

                    {/* Decorative circles */}

                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                    <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

                    <div className="relative flex items-center justify-between gap-4">

                        {/* HEADER */}

                        <div className="flex min-w-0 items-center gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                <FileText
                                    size={28}
                                    className="text-white"
                                />

                            </div>

                            <div className="min-w-0">

                                <div className="mb-1 flex items-center gap-2">

                                    <Sparkles
                                        size={16}
                                        className="shrink-0 text-cyan-200"
                                    />

                                    <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                        Project Workspace
                                    </span>

                                </div>

                                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                                    Create Project Specification
                                </h2>

                                <p className="mt-1 truncate text-sm text-white/80">
                                    {project.name}
                                </p>

                            </div>

                        </div>

                        {/* CLOSE BUTTON */}

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            aria-label="Close"
                            className="shrink-0 rounded-xl p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X size={21} />
                        </button>

                    </div>

                </div>

                {/* ==================================================
                    SCROLLABLE CONTENT
                ================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto">

                    <div className="px-5 py-6 sm:px-7">

                        {/* ==================================================
                            GENERAL ERROR
                        ================================================== */}

                        {errors.general && (
                            <div
                                role="alert"
                                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm"
                            >

                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <span>
                                    {errors.general}
                                </span>

                            </div>
                        )}

                        {/* ==================================================
                            PROJECT INFORMATION
                        ================================================== */}

                        <div className="mb-6 overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">

                            <div className="h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500" />

                            <div className="p-5">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

                                        <FileText size={21} />

                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                                            Project
                                        </p>

                                        <p className="mt-1 text-base font-bold text-slate-900">
                                            {project.name}
                                        </p>

                                        {project.description && (
                                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                                {project.description}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            SPECIFICATION FORM CARD
                        ================================================== */}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            {/* FORM HEADER */}

                            <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 via-blue-50 to-cyan-50 px-5 py-5 sm:px-6">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                                        <FileText size={19} />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-bold text-slate-900">
                                            Project Specification
                                        </h3>

                                        <p className="mt-0.5 text-sm text-slate-500">
                                            Complete all required project specification fields.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* FORM */}

                            <form
                                id="create-project-specification-form"
                                onSubmit={handleSubmit}
                                className="space-y-6 p-5 sm:p-6"
                            >

                                {fields.map(
                                    ({
                                        name,
                                        label,
                                        description,
                                        placeholder,
                                        focus,
                                    }) => (
                                        <div
                                            key={name}
                                            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-slate-300"
                                        >

                                            {/* LABEL */}

                                            <label
                                                htmlFor={`create-${name}`}
                                                className="mb-1.5 block text-sm font-bold text-slate-700"
                                            >

                                                {label}

                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>

                                            </label>

                                            {/* DESCRIPTION */}

                                            <p className="mb-2.5 text-xs leading-5 text-slate-500">
                                                {description}
                                            </p>

                                            {/* TEXTAREA */}

                                            <textarea
                                                id={`create-${name}`}
                                                name={name}
                                                value={form[name]}
                                                onChange={
                                                    handleChange
                                                }
                                                rows={4}
                                                disabled={saving}
                                                placeholder={
                                                    placeholder
                                                }
                                                className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
                                                    errors[name]
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                        : `border-slate-300 ${focus}`
                                                }`}
                                            />

                                            {/* ERROR */}

                                            {errors[name] && (
                                                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">

                                                    <AlertCircle
                                                        size={14}
                                                    />

                                                    <span>
                                                        {
                                                            errors[
                                                                name
                                                            ]
                                                        }
                                                    </span>

                                                </div>
                                            )}

                                        </div>
                                    )
                                )}

                            </form>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <X size={17} />

                            Cancel

                        </button>

                        {/* SAVE */}

                        <button
                            type="submit"
                            form="create-project-specification-form"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {saving ? (
                                <>
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            className="opacity-25"
                                        />

                                        <path
                                            d="M21 12a9 9 0 0 0-9-9"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={17} />

                                    Save Specification
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CreateProjectSpecification;

