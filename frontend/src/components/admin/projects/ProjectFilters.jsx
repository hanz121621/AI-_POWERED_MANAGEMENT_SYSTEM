import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

// ============================================================
// PROJECT FILTERS
//
// PROJ-001: View All Projects
// ============================================================

function ProjectFilters({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
}) {

    const statuses = [
        "All",
        "Planning",
        "Active",
        "Completed",
        "Archived",
    ];


    return (

        <div
            className="
                mb-6
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div
                    className="
                        relative
                        w-full
                        lg:max-w-md
                    "
                >

                    <Search
                        size={18}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />


                    <Input
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Search projects, managers or teams..."
                        className="pl-10"
                    />

                </div>


                {/* ==================================================
                    STATUS FILTER
                ================================================== */}

                <div
                    className="
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                    {statuses.map((status) => (

                        <button
                            key={status}
                            type="button"
                            onClick={() =>
                                setStatusFilter(status)
                            }
                            className={`
                                rounded-lg
                                border
                                px-4
                                py-2
                                text-sm
                                font-medium
                                transition-all

                                ${
                                    statusFilter === status

                                        ? `
                                            border-blue-600
                                            bg-blue-600
                                            text-white
                                            shadow-md
                                        `

                                        : `
                                            border-slate-200
                                            bg-white
                                            text-slate-600
                                            hover:border-blue-300
                                            hover:bg-blue-50
                                            hover:text-blue-600
                                            dark:border-slate-700
                                            dark:bg-slate-900
                                            dark:text-slate-300
                                            dark:hover:border-blue-500
                                            dark:hover:bg-blue-950/40
                                            dark:hover:text-blue-400
                                        `
                                }
                            `}
                        >
                            {status}
                        </button>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default ProjectFilters;