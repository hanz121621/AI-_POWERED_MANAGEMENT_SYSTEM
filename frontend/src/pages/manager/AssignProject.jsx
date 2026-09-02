
import React, { useState } from "react";

import {
    FolderKanban,
    Users,
    Calendar,
    Flag,
} from "lucide-react";

// ============================================================
// AIPMS - ASSIGN PROJECT
// Manager page content
//
// IMPORTANT:
// This page intentionally does NOT render:
// - ManagerSidebar
// - ManagerNavbar
//
// They are provided by ManagerLayout.
// ============================================================

function AssignProject() {
    const [project, setProject] = useState("");
    const [member, setMember] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [date, setDate] = useState("");

    // ============================================================
    // ASSIGN PROJECT
    // ============================================================

    const handleAssign = (e) => {
        e.preventDefault();

        console.log({
            project,
            member,
            priority,
            date,
        });

        alert("Project Assigned Successfully");
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div
            className="
                min-h-full
                bg-slate-50
                text-slate-900
                transition-colors
                duration-200
                dark:bg-slate-950
                dark:text-slate-100
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8">

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-slate-900
                        dark:text-slate-100
                    "
                >
                    Assign Project
                </h1>

                <p
                    className="
                        mt-2
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Assign projects to team members and manage
                    responsibilities
                </p>

            </div>

            {/* ==================================================
                FORM CARD
            ================================================== */}

            <div
                className="
                    max-w-3xl
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    shadow-sm
                    transition-colors
                    duration-200
                    dark:border-slate-800
                    dark:bg-slate-900
                "
            >

                <form
                    onSubmit={handleAssign}
                    className="space-y-6"
                >

                    {/* ==================================================
                        PROJECT
                    ================================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            <FolderKanban size={18} />

                            Select Project
                        </label>

                        <select
                            value={project}
                            onChange={(e) =>
                                setProject(e.target.value)
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-slate-100
                                dark:focus:border-blue-500
                                dark:focus:ring-blue-900
                            "
                        >
                            <option
                                value=""
                                className="
                                    bg-white
                                    text-slate-900
                                    dark:bg-slate-800
                                    dark:text-slate-100
                                "
                            >
                                Choose project
                            </option>

                            <option>
                                AI Project Management System
                            </option>

                            <option>
                                FieldSync Platform
                            </option>

                            <option>
                                Library Management System
                            </option>

                        </select>

                    </div>

                    {/* ==================================================
                        MEMBER
                    ================================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            <Users size={18} />

                            Assign Member
                        </label>

                        <select
                            value={member}
                            onChange={(e) =>
                                setMember(e.target.value)
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-slate-100
                                dark:focus:border-blue-500
                                dark:focus:ring-blue-900
                            "
                        >
                            <option
                                value=""
                                className="
                                    bg-white
                                    text-slate-900
                                    dark:bg-slate-800
                                    dark:text-slate-100
                                "
                            >
                                Choose team member
                            </option>

                            <option>
                                John Developer
                            </option>

                            <option>
                                Sarah Designer
                            </option>

                            <option>
                                Michael Tester
                            </option>

                        </select>

                    </div>

                    {/* ==================================================
                        PRIORITY
                    ================================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            <Flag size={18} />

                            Priority
                        </label>

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-slate-100
                                dark:focus:border-blue-500
                                dark:focus:ring-blue-900
                            "
                        >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>

                    </div>

                    {/* ==================================================
                        DEADLINE
                    ================================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            <Calendar size={18} />

                            Deadline
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-slate-100
                                dark:focus:border-blue-500
                                dark:focus:ring-blue-900
                            "
                        />

                    </div>

                    {/* ==================================================
                        SUBMIT
                    ================================================== */}

                    <button
                        type="submit"
                        className="
                            w-full
                            rounded-lg
                            bg-blue-600
                            py-3
                            font-semibold
                            text-white
                            transition
                            duration-200
                            hover:bg-blue-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:ring-offset-2
                            dark:focus:ring-offset-slate-900
                        "
                    >
                        Assign Project
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AssignProject;
