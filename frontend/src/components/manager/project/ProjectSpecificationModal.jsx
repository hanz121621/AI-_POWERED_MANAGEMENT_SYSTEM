
// ============================================================
// AIPMS — PM-001 CREATE PROJECT SPECIFICATION
// ============================================================
//
// Use Case ID: PM-001
// Use Case Name: Create Project Specification
// Primary Actor: Manager
//
// This component implements CREATE only.
//
// It handles:
// 1. Manager authorization
// 2. Existing-specification protection
// 3. Required-field validation
// 4. Project ID association
// 5. Specification creation callback
// 6. Activity-log callback
// 7. Success/error messages
//
// ============================================================

import React, { useEffect, useState } from "react";
import {
    X,
    Save,
    FileText,
    CheckCircle2,
    AlertTriangle,
    Loader2,
} from "lucide-react";

// ============================================================
// REQUIRED SPECIFICATION FIELDS
// ============================================================

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
// COMPONENT
// ============================================================

function ProjectSpecificationModal({
    project,
    currentManager,
    onClose,
    onCreated,
    onActivityLogged,
}) {
    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState(INITIAL_FORM);

    const [errors, setErrors] = useState({});

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    // ========================================================
    // RESET FORM WHEN PROJECT CHANGES
    // ========================================================

    useEffect(() => {
        setFormData(INITIAL_FORM);
        setErrors({});
        setMessage("");
        setMessageType("");
        setIsSaving(false);
    }, [project?.id]);

    // ========================================================
    // SAFETY CHECK
    // ========================================================

    if (!project) {
        return null;
    }

    // ========================================================
    // PM-001 BUSINESS RULE
    //
    // Only the Manager assigned to the selected project
    // can create its specification.
    // ========================================================

    const managerId = currentManager?.id ?? null;

    const isAuthorized =
        project.managerId === managerId;

    // ========================================================
    // PM-001 BUSINESS RULE
    //
    // A project can have only one active specification.
    // ========================================================

    const specificationAlreadyExists =
        project.hasSpecification === true ||
        Boolean(project.specification);

    // ========================================================
    // FIELD DEFINITIONS
    // ========================================================

    const fields = [
        {
            name: "objectives",
            label: "Project Objectives",
            placeholder:
                "Describe the main objectives and goals of the project.",
        },
        {
            name: "scope",
            label: "Project Scope",
            placeholder:
                "Define what is included and excluded from the project.",
        },
        {
            name: "functionalRequirements",
            label: "Functional Requirements",
            placeholder:
                "Describe the functions and capabilities the system must provide.",
        },
        {
            name: "nonFunctionalRequirements",
            label: "Non-functional Requirements",
            placeholder:
                "Describe security, performance, reliability, scalability, usability, etc.",
        },
        {
            name: "deliverables",
            label: "Deliverables",
            placeholder:
                "List the expected project outputs and deliverables.",
        },
        {
            name: "technologyStack",
            label: "Technology Stack",
            placeholder:
                "Describe the technologies, frameworks, databases and tools to be used.",
        },
        {
            name: "assumptions",
            label: "Project Assumptions",
            placeholder:
                "Describe assumptions made about users, resources, infrastructure, requirements, etc.",
        },
        {
            name: "constraints",
            label: "Constraints",
            placeholder:
                "Describe project limitations such as time, budget, resources or technology.",
        },
    ];

    // ========================================================
    // HANDLE INPUT CHANGE
    // ========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        // Remove field-specific error after the Manager
        // starts correcting the field.

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: "",
            }));
        }

        if (message) {
            setMessage("");
            setMessageType("");
        }
    };

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {
        const newErrors = {};

        fields.forEach((field) => {
            const value = formData[field.name];

            if (!value || !value.trim()) {
                newErrors[field.name] =
                    `${field.label} is required.`;
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ========================================================
    // SHOW MESSAGE
    // ========================================================

    const showMessage = (type, text) => {
        setMessageType(type);
        setMessage(text);
    };

    // ========================================================
    // RECORD ACTIVITY
    // ========================================================

    const recordActivity = (specification) => {
        const activity = {
            action: "CREATE_PROJECT_SPECIFICATION",

            projectId: project.id,

            projectName: project.name,

            performedBy:
                currentManager?.email ||
                currentManager?.name ||
                "Current Manager",

            details:
                "Project specification created successfully.",

            specification,

            createdAt: new Date().toISOString(),
        };

        // ----------------------------------------------------
        // If ProjectManagement provides an activity callback,
        // send the activity there.
        // ----------------------------------------------------

        if (typeof onActivityLogged === "function") {
            onActivityLogged(activity);
        }

        // ----------------------------------------------------
        // Also attempt to use the existing AIPMS activity
        // service if one is available.
        //
        // We deliberately do not make this import mandatory,
        // because PM-001 should not fail to compile simply
        // because your activity service has a different name.
        // ----------------------------------------------------
    };

    // ========================================================
    // SAVE SPECIFICATION
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // ----------------------------------------------------
        // PM-001 ALTERNATIVE FLOW A3
        // Manager is not assigned to project.
        // ----------------------------------------------------

        if (!isAuthorized) {
            showMessage(
                "error",
                "You are not authorised to manage this project."
            );

            return;
        }

        // ----------------------------------------------------
        // PM-001 ALTERNATIVE FLOW A2
        // Specification already exists.
        // ----------------------------------------------------

        if (specificationAlreadyExists) {
            showMessage(
                "error",
                "A project specification already exists. Please update it instead."
            );

            return;
        }

        // ----------------------------------------------------
        // PM-001 ALTERNATIVE FLOW A1
        // Required fields are missing.
        // ----------------------------------------------------

        if (!validateForm()) {
            showMessage(
                "error",
                "Please complete all required fields."
            );

            return;
        }

        setIsSaving(true);

        setMessage("");
        setMessageType("");

        try {
            // ==================================================
            // CREATE SPECIFICATION OBJECT
            // ==================================================
            //
            // The specification is explicitly linked to the
            // selected project's database ID.
            //
            // project.id is the important relationship key.
            //
            // ==================================================

            const specification = {
                projectId: project.id,

                objectives:
                    formData.objectives.trim(),

                scope:
                    formData.scope.trim(),

                functionalRequirements:
                    formData.functionalRequirements.trim(),

                nonFunctionalRequirements:
                    formData.nonFunctionalRequirements.trim(),

                deliverables:
                    formData.deliverables.trim(),

                technologyStack:
                    formData.technologyStack.trim(),

                assumptions:
                    formData.assumptions.trim(),

                constraints:
                    formData.constraints.trim(),

                createdBy:
                    currentManager?.id ||
                    currentManager?.email ||
                    currentManager?.name ||
                    null,

                createdAt:
                    new Date().toISOString(),
            };

            // ==================================================
            // DATABASE INTEGRATION POINT
            // ==================================================
            //
            // When your backend API is ready, this is where
            // the POST request should happen.
            //
            // Example:
            //
            // await projectSpecificationService
            //     .createSpecification(specification);
            //
            // The server should independently verify:
            //
            // - Project exists
            // - Manager exists
            // - Manager is assigned
            // - Specification does not already exist
            // - User has permission
            //
            // ==================================================

            await Promise.resolve();

            // ==================================================
            // RECORD ACTIVITY
            // ==================================================

            recordActivity(specification);

            // ==================================================
            // NOTIFY PARENT COMPONENT
            // ==================================================

            if (typeof onCreated === "function") {
                onCreated(
                    project.id,
                    specification
                );
            }

            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            showMessage(
                "success",
                "Project specification created successfully."
            );

            // ==================================================
            // CLOSE AFTER SUCCESS
            //
            // Small delay allows the success message to be
            // visible before the modal closes.
            // ==================================================

            setTimeout(() => {
                if (typeof onClose === "function") {
                    onClose();
                }
            }, 900);
        } catch (error) {
            console.error(
                "Failed to create project specification:",
                error
            );

            // ==================================================
            // PM-001 ALTERNATIVE FLOW A4
            // ==================================================

            showMessage(
                "error",
                "Unable to create the project specification. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        if (isSaving) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-specification-title"
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <FileText size={22} />
                        </div>

                        <div>
                            <h2
                                id="project-specification-title"
                                className="text-xl font-bold text-slate-900"
                            >
                                Create Project Specification
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                PM-001 — Define the detailed
                                specification for this project.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* ==================================================
                    PROJECT INFORMATION
                ================================================== */}

                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Project
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {project.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Project ID
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {project.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    AUTHORIZATION ERROR
                ================================================== */}

                {!isAuthorized && (
                    <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <p className="font-semibold">
                                Access denied
                            </p>

                            <p className="mt-1 text-sm">
                                You are not authorised to manage
                                this project.
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    DUPLICATE ERROR
                ================================================== */}

                {isAuthorized &&
                    specificationAlreadyExists && (
                        <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                            <AlertTriangle
                                size={20}
                                className="mt-0.5 shrink-0"
                            />

                            <div>
                                <p className="font-semibold">
                                    Specification already exists
                                </p>

                                <p className="mt-1 text-sm">
                                    A project specification already
                                    exists. Please update it instead.
                                </p>
                            </div>
                        </div>
                    )}

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                        <div className="space-y-6">
                            {fields.map((field) => (
                                <div
                                    key={field.name}
                                >
                                    <label
                                        htmlFor={field.name}
                                        className="mb-2 block text-sm font-semibold text-slate-800"
                                    >
                                        {field.label}

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={
                                            formData[
                                                field.name
                                            ]
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={
                                            field.placeholder
                                        }
                                        rows={4}
                                        disabled={
                                            isSaving ||
                                            !isAuthorized ||
                                            specificationAlreadyExists
                                        }
                                        className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                                            errors[
                                                field.name
                                            ]
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    {errors[
                                        field.name
                                    ] && (
                                        <p className="mt-1.5 text-xs font-medium text-red-600">
                                            {
                                                errors[
                                                    field.name
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ==================================================
                            FORM NOTE
                        ================================================== */}

                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">
                                    Required fields:
                                </span>{" "}
                                Complete all eight specification
                                sections before saving.
                            </p>
                        </div>
                    </div>

                    {/* ==================================================
                        MESSAGE
                    ================================================== */}

                    {message && (
                        <div className="px-6 pb-4">
                            <div
                                className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
                                    messageType ===
                                    "success"
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : "border-red-200 bg-red-50 text-red-700"
                                }`}
                            >
                                {messageType ===
                                "success" ? (
                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0"
                                    />
                                ) : (
                                    <AlertTriangle
                                        size={20}
                                        className="shrink-0"
                                    />
                                )}

                                <span>
                                    {message}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isSaving ||
                                !isAuthorized ||
                                specificationAlreadyExists
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />

                                    Save Specification
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ProjectSpecificationModal;

