
import { useState } from "react";
import {
    Code2,
    CheckCircle2,
    AlertCircle,
    UserRound,
    BriefcaseBusiness,
    Layers3,
    Send,
} from "lucide-react";

// ============================================================
// DEVELOPER SPECIALIZATION OPTIONS
// ============================================================

const SPECIALIZATIONS = [
    "Frontend Development",
    "Backend Development",
    "Full-Stack Development",
    "Mobile Development",
    "Database Development",
    "DevOps",
    "Other",
];

// ============================================================
// COMPONENT
// ============================================================

function PerformSpecializedDevelopmentWork() {
    const [specialization, setSpecialization] = useState(
        "Frontend Development"
    );

    const [taskTitle, setTaskTitle] = useState("");
    const [progress, setProgress] = useState(0);
    const [workDescription, setWorkDescription] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ========================================================
    // HANDLE SUBMIT
    // ========================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!taskTitle.trim()) {
            setError("Please enter the assigned development task.");
            return;
        }

        if (!workDescription.trim()) {
            setError("Please describe the development work performed.");
            return;
        }

        if (progress < 0 || progress > 100) {
            setError("Progress must be between 0 and 100.");
            return;
        }

        // ----------------------------------------------------
        // Frontend demonstration
        // Backend API can be connected later.
        // ----------------------------------------------------

        console.log("SPECIALIZED DEVELOPMENT WORK", {
            specialization,
            taskTitle,
            progress,
            workDescription,
        });

        setMessage(
            "Specialized development work recorded successfully."
        );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <Code2 size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Specialized Development Work
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Perform assigned technical work according to
                            your registered specialization.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                AUTHORITY INFORMATION
            ================================================== */}

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                    />

                    <div>
                        <h2 className="font-semibold text-blue-900 dark:text-blue-300">
                            Specialization is not a permission level
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-blue-800 dark:text-blue-300/80">
                            Your specialization identifies your technical
                            capability and helps the system assign suitable
                            development work. It does not give management
                            authority.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {message && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
                    <CheckCircle2 size={20} />

                    <span className="text-sm font-medium">
                        {message}
                    </span>
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                    <AlertCircle size={20} />

                    <span className="text-sm font-medium">
                        {error}
                    </span>
                </div>
            )}

            {/* ==================================================
                SPECIALIZATION
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                        <UserRound size={20} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Developer Specialization
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Select the specialization associated with the
                            assigned development work.
                        </p>
                    </div>
                </div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Specialization
                </label>

                <select
                    value={specialization}
                    onChange={(event) =>
                        setSpecialization(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                >
                    {SPECIALIZATIONS.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {/* ==================================================
                WORK FORM
            ================================================== */}

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]"
            >
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <BriefcaseBusiness size={20} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Assigned Development Work
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Record progress against your assigned technical
                            task.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    TASK TITLE
                ================================================== */}

                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Development Task
                    </label>

                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(event) =>
                            setTaskTitle(event.target.value)
                        }
                        placeholder="Enter assigned development task"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    />
                </div>

                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Work Progress
                        </label>

                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {progress}%
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(event) =>
                            setProgress(Number(event.target.value))
                        }
                        className="w-full"
                    />

                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Development Work Description
                    </label>

                    <textarea
                        value={workDescription}
                        onChange={(event) =>
                            setWorkDescription(event.target.value)
                        }
                        rows={6}
                        placeholder="Describe the technical work performed, implementation details, issues, testing, or other relevant information..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    />
                </div>

                {/* ==================================================
                    CURRENT SPECIALIZATION
                ================================================== */}

                <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#081b33]">
                    <div className="flex items-center gap-3">
                        <Layers3
                            size={20}
                            className="text-violet-500"
                        />

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Current Specialization
                            </p>

                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                {specialization}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0d2340]"
                >
                    <Send size={18} />

                    Record Development Progress
                </button>
            </form>

            {/* ==================================================
                BUSINESS RULES
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]">
                <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">
                    Developer Authority
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            Developer Can
                        </p>

                        <ul className="space-y-1 text-sm text-emerald-700/80 dark:text-emerald-400/80">
                            <li>• Perform assigned development tasks</li>
                            <li>• Update assigned task progress</li>
                            <li>• Add technical information</li>
                            <li>• Submit work for review</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                        <p className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
                            Developer Cannot
                        </p>

                        <ul className="space-y-1 text-sm text-red-700/80 dark:text-red-400/80">
                            <li>• Create projects</li>
                            <li>• Change team assignments</li>
                            <li>• Change another user's specialization</li>
                            <li>• Approve their own completed work</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerformSpecializedDevelopmentWork;
