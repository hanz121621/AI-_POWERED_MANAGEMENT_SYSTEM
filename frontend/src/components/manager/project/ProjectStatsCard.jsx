
import React from "react";

// ============================================================
// AIPMS — MANAGER PROJECT STATS CARD
//
// Design:
// - White card
// - Slate borders/text
// - Colorful gradient accent
// - Soft icon background
// - Professional hover effect
// ============================================================

function ProjectStatsCard({
    title,
    value,
    icon: Icon,
    color = "from-blue-500 to-cyan-600",
    iconBg = "bg-blue-100",
    iconColor = "text-blue-600",
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">

            {/* ==================================================
                TOP COLOR ACCENT
            ================================================== */}

            <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`}
            />

            {/* ==================================================
                CARD CONTENT
            ================================================== */}

            <div className="flex items-center justify-between gap-4">

                {/* ==================================================
                    TEXT
                ================================================== */}

                <div className="min-w-0">

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>

                </div>

                {/* ==================================================
                    ICON
                ================================================== */}

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                    {Icon && (
                        <Icon
                            size={22}
                            className={iconColor}
                        />
                    )}
                </div>

            </div>

            {/* ==================================================
                BOTTOM COLOR ACCENT
            ================================================== */}

            <div
                className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${color}`}
            />

        </div>
    );
}

export default ProjectStatsCard;

