// ============================================================
// AIPMS — UPDATE SPRINT MODAL
//
// SP-002 — Update Sprint
//
// Location:
// src/components/manager/sprint/UpdateSprintModal.jsx
//
// Purpose:
// Allows Manager to update:
// - Sprint Name
// - Start Date
// - End Date
// - Sprint Goal
//
// Compatible with SprintManagement.jsx
// ============================================================

import React, { useEffect, useState } from "react";

import {
    X,
    Save,
    AlertTriangle,
    CalendarDays,
    Target,
} from "lucide-react";

// ============================================================
// DATE HELPER
// ============================================================

const convertDateToInputFormat = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    const value = String(dateValue).trim();

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    // Handle values such as:
    // August 18, 2026
    // August 10, 2026
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const year = parsedDate.getFullYear();

    const month = String(
        parsedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        parsedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// ============================================================
// DISPLAY DATE HELPER
// ============================================================

const formatDateForStorage = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    const value = String(dateValue).trim();

    // Keep existing YYYY-MM-DD values
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return value;
    }

    return parsedDate.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );
};

// ============================================================
// COMPONENT
// ============================================================

function UpdateSprintModal({
    onClose,
    sprint,
    onUpdated,
}) {
    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        goal: "",
    });

    // ========================================================
    // ERROR STATE
    // ========================================================

    const [error, setError] = useState("");

    // ========================================================
    // SAVING STATE
    // ========================================================

    const [isSaving, setIsSaving] = useState(false);

    // ========================================================
    // LOAD SELECTED SPRINT
    // ========================================================

    useEffect(() => {
        if (!sprint) {
            return;
        }

        setFormData({
            name: sprint.name || "",

            startDate:
                convertDateToInputFormat(
                    sprint.startDate
                ),

            endDate:
                convertDateToInputFormat(
                    sprint.endDate
                ),

            goal: sprint.goal || "",
        });

        setError("");
        setIsSaving(false);
    }, [sprint]);

    // ========================================================
    // DO NOT RENDER WITHOUT SPRINT
    // ========================================================

    if (!sprint) {
        return null;
    }

    // ========================================================
    // HANDLE INPUT CHANGE
    // ========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {
        const name =
            String(formData.name || "").trim();

        const goal =
            String(formData.goal || "").trim();

        // ----------------------------------------------------
        // NAME
        // ----------------------------------------------------

        if (!name) {
            return "Sprint name is required.";
        }

        if (name.length < 2) {
            return "Sprint name must contain at least 2 characters.";
        }

        // ----------------------------------------------------
        // START DATE
        // ----------------------------------------------------

        if (!formData.startDate) {
            return "Sprint start date is required.";
        }

        // ----------------------------------------------------
        // END DATE
        // ----------------------------------------------------

        if (!formData.endDate) {
            return "Sprint end date is required.";
        }

        // ----------------------------------------------------
        // DATE VALIDATION
        // ----------------------------------------------------

        const startDate = new Date(
            `${formData.startDate}T00:00:00`
        );

        const endDate = new Date(
            `${formData.endDate}T00:00:00`
        );

        if (
            Number.isNaN(
                startDate.getTime()
            )
        ) {
            return "Sprint start date is invalid.";
        }

        if (
            Number.isNaN(
                endDate.getTime()
            )
        ) {
            return "Sprint end date is invalid.";
        }

        if (endDate <= startDate) {
            return "Sprint end date must be after the start date.";
        }

        // ----------------------------------------------------
        // GOAL
        // ----------------------------------------------------

        if (!goal) {
            return "Sprint goal is required.";
        }

        // ----------------------------------------------------
        // VALIDATED DATA
        // ----------------------------------------------------

        return {
            name,
            startDate:
                formData.startDate,
            endDate:
                formData.endDate,
            goal,
        };
    };

    // ========================================================
    // HANDLE SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prevent double click
        if (isSaving) {
            return;
        }

        setError("");

        // ----------------------------------------------------
        // VALIDATE
        // ----------------------------------------------------

        const validationResult =
            validateForm();

        if (
            typeof validationResult ===
            "string"
        ) {
            setError(
                validationResult
            );
            return;
        }

        // ----------------------------------------------------
        // CHECK ID
        // ----------------------------------------------------

        if (
            sprint.id === undefined ||
            sprint.id === null
        ) {
            setError(
                "The selected sprint does not have a valid ID."
            );
            return;
        }

        // ----------------------------------------------------
        // CHECK UPDATE HANDLER
        // ----------------------------------------------------

        if (
            typeof onUpdated !==
            "function"
        ) {
            setError(
                "The sprint update handler is not available."
            );
            return;
        }

        setIsSaving(true);

        // ----------------------------------------------------
        // UPDATED SPRINT
        // ----------------------------------------------------

        const updatedSprint = {
            ...sprint,

            name:
                validationResult.name,

            // Keep date format compatible
            // with the existing SprintManagement
            startDate:
                formatDateForStorage(
                    validationResult.startDate
                ),

            endDate:
                formatDateForStorage(
                    validationResult.endDate
                ),

            goal:
                validationResult.goal,
        };

        // ----------------------------------------------------
        // SEND TO PARENT
        //
        // SprintManagement expects:
        //
        // handleSprintUpdated(
        //     sprintId,
        //     updatedSprint
        // )
        // ----------------------------------------------------

        try {
            await onUpdated(
                sprint.id,
                updatedSprint
            );

            // Parent successfully updated sprint
            onClose();
        } catch (submitError) {
            console.error(
                "Failed to update sprint:",
                submitError
            );

            setError(
                submitError?.message ||
                    "Failed to update the sprint. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/40
                px-4 py-6
            "
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget &&
                    !isSaving
                ) {
                    onClose();
                }
            }}
        >
            {/* ==================================================
                MODAL
            ================================================== */}

            <div
                className="
                    max-h-[90vh]
                    w-full max-w-lg
                    overflow-y-auto
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    shadow-2xl
                "
                role="dialog"
                aria-modal="true"
                aria-labelledby="update-sprint-title"
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex items-start
                        justify-between
                        border-b border-slate-200
                        bg-gradient-to-r
                        from-violet-50
                        via-white
                        to-blue-50
                        px-6 py-5
                    "
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl
                                    bg-violet-100
                                    text-violet-600
                                "
                            >
                                <CalendarDays
                                    size={20}
                                />
                            </div>

                            <div>
                                <h2
                                    id="update-sprint-title"
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Update Sprint
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Update the sprint schedule
                                    and sprint goal.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close update sprint dialog"
                        className="
                            rounded-lg
                            p-2
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 px-6 py-6"
                >
                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            role="alert"
                            className="
                                flex items-start
                                gap-3
                                rounded-xl
                                border border-red-200
                                bg-red-50
                                px-4 py-3
                                text-sm
                                font-medium
                                text-red-700
                            "
                        >
                            <AlertTriangle
                                size={18}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-red-600
                                "
                            />

                            <span>
                                {error}
                            </span>
                        </div>
                    )}

                    {/* ==================================================
                        SPRINT NAME
                    ================================================== */}

                    <div>
                        <label
                            htmlFor="update-sprint-name"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            Sprint Name
                        </label>

                        <input
                            id="update-sprint-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSaving}
                            placeholder="Enter sprint name"
                            autoFocus
                            className="
                                w-full
                                rounded-xl
                                border border-slate-300
                                bg-white
                                px-3.5 py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-violet-500
                                focus:ring-2
                                focus:ring-violet-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                            "
                        />
                    </div>

                    {/* ==================================================
                        DATES
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        "
                    >
                        {/* START DATE */}

                        <div>
                            <label
                                htmlFor="update-sprint-start-date"
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Start Date
                            </label>

                            <input
                                id="update-sprint-start-date"
                                name="startDate"
                                type="date"
                                value={
                                    formData.startDate
                                }
                                onChange={handleChange}
                                disabled={isSaving}
                                className="
                                    w-full
                                    rounded-xl
                                    border border-slate-300
                                    bg-white
                                    px-3.5 py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-violet-500
                                    focus:ring-2
                                    focus:ring-violet-100
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-100
                                "
                            />
                        </div>

                        {/* END DATE */}

                        <div>
                            <label
                                htmlFor="update-sprint-end-date"
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                End Date
                            </label>

                            <input
                                id="update-sprint-end-date"
                                name="endDate"
                                type="date"
                                value={
                                    formData.endDate
                                }
                                onChange={handleChange}
                                disabled={isSaving}
                                className="
                                    w-full
                                    rounded-xl
                                    border border-slate-300
                                    bg-white
                                    px-3.5 py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-violet-500
                                    focus:ring-2
                                    focus:ring-violet-100
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-100
                                "
                            />
                        </div>
                    </div>

                    {/* ==================================================
                        SPRINT GOAL
                    ================================================== */}

                    <div>
                        <label
                            htmlFor="update-sprint-goal"
                            className="
                                mb-1.5
                                flex items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            <Target
                                size={16}
                                className="text-violet-600"
                            />

                            Sprint Goal
                        </label>

                        <textarea
                            id="update-sprint-goal"
                            name="goal"
                            rows={4}
                            value={formData.goal}
                            onChange={handleChange}
                            disabled={isSaving}
                            placeholder="Describe what this sprint should accomplish..."
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border border-slate-300
                                bg-white
                                px-3.5 py-3
                                text-sm
                                leading-6
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-violet-500
                                focus:ring-2
                                focus:ring-violet-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                            "
                        />
                    </div>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-slate-200
                            pt-5
                        "
                    >
                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="
                                rounded-xl
                                border border-slate-300
                                bg-white
                                px-5 py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>

                        {/* SAVE */}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gradient-to-r
                                from-violet-600
                                to-blue-600
                                px-5 py-2.5
                                text-sm
                                font-bold
                                text-white
                                shadow-sm
                                transition
                                hover:from-violet-700
                                hover:to-blue-700
                                hover:shadow-md
                                focus:outline-none
                                focus:ring-2
                                focus:ring-violet-300
                                focus:ring-offset-2
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            <Save size={17} />

                            {isSaving
                                ? "Saving..."
                                : "Save Changes"}
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

export default UpdateSprintModal;