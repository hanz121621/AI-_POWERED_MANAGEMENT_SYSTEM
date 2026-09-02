import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
AlertCircle,
CheckCircle2,
Loader2,
Save,
Trash2,
} from "lucide-react";

import {
getProjectSpecification,
createProjectSpecification,
updateProjectSpecification,
deleteProjectSpecification,
EMPTY_PROJECT_SPECIFICATION,
} from "@/services/projectService";

// ============================================================
// PROJECT SPECIFICATION
// ============================================================

function ProjectSpecification({
projectId: projectIdProp,
}) {
const params = useParams();


const projectId =
    projectIdProp ??
    params?.projectId ??
    params?.id;

const [specification, setSpecification] =
    useState(
        EMPTY_PROJECT_SPECIFICATION
    );

const [loading, setLoading] =
    useState(true);

const [saving, setSaving] =
    useState(false);

const [deleting, setDeleting] =
    useState(false);

const [exists, setExists] =
    useState(false);

const [message, setMessage] =
    useState("");

const [error, setError] =
    useState("");


// ============================================================
// LOAD SPECIFICATION
// ============================================================


useEffect(() => {
    let mounted = true;

    async function loadSpecification() {
        if (!projectId) {
            if (mounted) {
                setLoading(false);
                setError(
                    "Project ID is required."
                );
            }

            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const data =
                await getProjectSpecification(
                    projectId
                );

            if (!mounted) {
                return;
            }

            if (data) {
                setSpecification({
                    objectives:
                        data.objectives ?? "",

                    scope:
                        data.scope ?? "",

                    functionalRequirements:
                        data.functionalRequirements ??
                        "",

                    nonFunctionalRequirements:
                        data.nonFunctionalRequirements ??
                        "",

                    deliverables:
                        data.deliverables ??
                        "",

                    technologyStack:
                        data.technologyStack ??
                        "",

                    assumptions:
                        data.assumptions ??
                        "",

                    constraints:
                        data.constraints ??
                        "",
                });

                setExists(true);
            } else {
                setSpecification(
                    EMPTY_PROJECT_SPECIFICATION
                );

                setExists(false);
            }
        } catch (err) {
            if (!mounted) {
                return;
            }

            /*
             * A 404 means this project does not have
             * a specification yet.
             *
             * This is not treated as a fatal page error.
             */
            if (
                err?.cause?.response?.status ===
                404
            ) {
                setSpecification(
                    EMPTY_PROJECT_SPECIFICATION
                );

                setExists(false);
                setError("");
            } else {
                setError(
                    err?.message ||
                    "Unable to load project specification."
                );
            }
        } finally {
            if (mounted) {
                setLoading(false);
            }
        }
    }

    loadSpecification();

    return () => {
        mounted = false;
    };
}, [projectId]);


// ============================================================
// INPUT CHANGE
// ============================================================


function handleChange(e) {
    const {
        name,
        value,
    } = e.target;

    setSpecification(
        (previous) => ({
            ...previous,
            [name]: value,
        })
    );

    setMessage("");
    setError("");
}

// ============================================================
// VALIDATION
// ============================================================


function validateSpecification() {
    if (
        !specification.objectives.trim()
    ) {
        return "Project objectives are required.";
    }

    if (
        !specification.scope.trim()
    ) {
        return "Project scope is required.";
    }

    if (
        !specification.functionalRequirements.trim()
    ) {
        return "Functional requirements are required.";
    }

    return null;
}


// ============================================================
// SAVE
// ============================================================


async function handleSave() {
    setMessage("");
    setError("");

    if (!projectId) {
        setError(
            "Project ID is required."
        );

        return;
    }

    const validationError =
        validateSpecification();

    if (validationError) {
        setError(
            validationError
        );

        return;
    }

    try {
        setSaving(true);

        let result;

        if (exists) {
            result =
                await updateProjectSpecification(
                    projectId,
                    specification
                );
        } else {
            result =
                await createProjectSpecification(
                    projectId,
                    specification
                );
        }

        if (!result.success) {
            setError(
                result.error ||
                "Unable to save project specification."
            );

            return;
        }

        setExists(true);

        if (
            result.specification
        ) {
            setSpecification({
                objectives:
                    result.specification.objectives ??
                    specification.objectives,

                scope:
                    result.specification.scope ??
                    specification.scope,

                functionalRequirements:
                    result.specification.functionalRequirements ??
                    specification.functionalRequirements,

                nonFunctionalRequirements:
                    result.specification.nonFunctionalRequirements ??
                    specification.nonFunctionalRequirements,

                deliverables:
                    result.specification.deliverables ??
                    specification.deliverables,

                technologyStack:
                    result.specification.technologyStack ??
                    specification.technologyStack,

                assumptions:
                    result.specification.assumptions ??
                    specification.assumptions,

                constraints:
                    result.specification.constraints ??
                    specification.constraints,
            });
        }

        setMessage(
            result.message ||
            (
                exists
                    ? "Project specification updated successfully."
                    : "Project specification created successfully."
            )
        );
    } catch (err) {
        setError(
            err?.message ||
            "Unable to save project specification."
        );
    } finally {
        setSaving(false);
    }
}


// ============================================================
// DELETE
// ============================================================


async function handleDelete() {
    setMessage("");
    setError("");

    if (!projectId) {
        setError(
            "Project ID is required."
        );

        return;
    }

    if (!exists) {
        setError(
            "There is no project specification to delete."
        );

        return;
    }

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this project specification?"
        );

    if (!confirmed) {
        return;
    }

    try {
        setDeleting(true);

        const result =
            await deleteProjectSpecification(
                projectId
            );

        if (!result.success) {
            setError(
                result.error ||
                "Unable to delete project specification."
            );

            return;
        }

        setSpecification(
            EMPTY_PROJECT_SPECIFICATION
        );

        setExists(false);

        setMessage(
            result.message ||
            "Project specification deleted successfully."
        );
    } catch (err) {
        setError(
            err?.message ||
            "Unable to delete project specification."
        );
    } finally {
        setDeleting(false);
    }
}


// ============================================================
// NO PROJECT ID
// ============================================================


if (!projectId) {
    return (
        <div className="p-6">
            <div className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-5
                text-red-700
            ">
                <div className="
                    flex
                    items-center
                    gap-3
                    font-semibold
                ">
                    <AlertCircle
                        size={20}
                    />

                    Project ID is missing.
                </div>

                <p className="
                    mt-2
                    text-sm
                ">
                    Open the project specification
                    from a specific project.
                </p>
            </div>
        </div>
    );
}


// ============================================================
// LOADING
// ============================================================


if (loading) {
    return (
        <div className="p-6">
            <div className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-10
                shadow-sm
                flex
                items-center
                justify-center
                gap-3
                text-gray-600
            ">
                <Loader2
                    size={20}
                    className="animate-spin"
                />

                Loading project specification...
            </div>
        </div>
    );
}


// ============================================================
// UI
// ============================================================


return (
    <div className="
        p-6
        bg-gray-50
        min-h-full
    ">

        {/* PAGE HEADER */}

        <div className="
            mb-6
            flex
            flex-col
            gap-2
            md:flex-row
            md:items-center
            md:justify-between
        ">

            <div>
                <h1 className="
                    text-2xl
                    font-bold
                    text-gray-900
                ">
                    Project Specification
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-gray-500
                ">
                    Define and manage the
                    specification for this project.
                </p>
            </div>

            <div className="
                text-xs
                text-gray-500
                bg-white
                border
                border-gray-200
                rounded-lg
                px-3
                py-2
            ">
                Project ID: {projectId}
            </div>
        </div>


        {/* SUCCESS MESSAGE */}

        {message && (
            <div className="
                mb-5
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-green-200
                bg-green-50
                px-4
                py-3
                text-sm
                text-green-700
            ">
                <CheckCircle2
                    size={18}
                />

                {message}
            </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
            <div className="
                mb-5
                flex
                items-start
                gap-3
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
                whitespace-pre-line
            ">
                <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                />

                {error}
            </div>
        )}


        {/* SPECIFICATION CARD */}

        <div className="
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
            overflow-hidden
        ">

            {/* CARD HEADER */}

            <div className="
                border-b
                border-gray-200
                px-6
                py-4
            ">

                <h2 className="
                    text-lg
                    font-semibold
                    text-gray-900
                ">
                    Project Details
                </h2>

                <p className="
                    mt-1
                    text-sm
                    text-gray-500
                ">
                    Complete the project requirements
                    and technical definition.
                </p>

            </div>


            {/* FORM */}

            <div className="
                p-6
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
            ">

                {/* OBJECTIVES */}

                <SpecificationField
                    label="Project Objectives"
                    name="objectives"
                    value={
                        specification.objectives
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="Enter the main objectives of the project."
                    required
                    rows={4}
                />


                {/* SCOPE */}

                <SpecificationField
                    label="Project Scope"
                    name="scope"
                    value={
                        specification.scope
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="Define what is included in the project scope."
                    required
                    rows={4}
                />


                {/* FUNCTIONAL REQUIREMENTS */}

                <SpecificationField
                    label="Functional Requirements"
                    name="functionalRequirements"
                    value={
                        specification.functionalRequirements
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="Describe the features and functions the system must provide."
                    required
                    rows={4}
                />


                {/* NON-FUNCTIONAL REQUIREMENTS */}

                <SpecificationField
                    label="Non-Functional Requirements"
                    name="nonFunctionalRequirements"
                    value={
                        specification.nonFunctionalRequirements
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="Security, performance, scalability, availability, etc."
                    rows={4}
                />


                {/* DELIVERABLES */}

                <SpecificationField
                    label="Deliverables"
                    name="deliverables"
                    value={
                        specification.deliverables
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="List the expected project deliverables."
                    rows={3}
                />


                {/* TECHNOLOGY STACK */}

                <SpecificationField
                    label="Technology Stack"
                    name="technologyStack"
                    value={
                        specification.technologyStack
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="React, .NET, PostgreSQL, etc."
                    rows={3}
                />


                {/* ASSUMPTIONS */}

                <SpecificationField
                    label="Project Assumptions"
                    name="assumptions"
                    value={
                        specification.assumptions
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="Document assumptions made during project planning."
                    rows={3}
                />


                {/* CONSTRAINTS */}

                <SpecificationField
                    label="Project Constraints"
                    name="constraints"
                    value={
                        specification.constraints
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="Budget, time, technology, resources, or other constraints."
                    rows={3}
                />

            </div>


            {/* ACTIONS */}

            <div className="
                border-t
                border-gray-200
                px-6
                py-4
                flex
                flex-col
                sm:flex-row
                gap-3
                justify-end
            ">

                <button
                    type="button"
                    onClick={
                        handleDelete
                    }
                    disabled={
                        deleting ||
                        saving ||
                        !exists
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-red-200
                        bg-white
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {deleting ? (
                        <Loader2
                            size={17}
                            className="animate-spin"
                        />
                    ) : (
                        <Trash2
                            size={17}
                        />
                    )}

                    {deleting
                        ? "Deleting..."
                        : "Delete Specification"
                    }

                </button>


                <button
                    type="button"
                    onClick={
                        handleSave
                    }
                    disabled={
                        saving ||
                        deleting
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {saving ? (
                        <Loader2
                            size={17}
                            className="animate-spin"
                        />
                    ) : (
                        <Save
                            size={17}
                        />
                    )}

                    {saving
                        ? "Saving..."
                        : exists
                            ? "Update Specification"
                            : "Save Specification"
                    }

                </button>

            </div>

        </div>

    </div>
);


}

// ============================================================
// REUSABLE SPECIFICATION FIELD
// ============================================================

function SpecificationField({
label,
name,
value,
onChange,
placeholder,
required = false,
rows = 4,
}) {
return ( <div>


        <label
            htmlFor={name}
            className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-800
            "
        >
            {label}

            {required && (
                <span className="text-red-500 ml-1">
                    *
                </span>
            )}
        </label>

        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="
                w-full
                resize-y
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
            "
        />

    </div>
);


}

export default ProjectSpecification;
