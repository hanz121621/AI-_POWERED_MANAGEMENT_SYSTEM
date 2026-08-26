
import {
    Code2,
    ListTodo,
    PlayCircle,
    RefreshCw,
    ShieldAlert,
    Send,
    MessageSquare,
    Wrench,
} from "lucide-react";

// ============================================================
// DEVELOPER USE CASE COMPONENTS
// ============================================================

import ViewDevelopmentWork from "@/components/contributor/developer/ViewDevelopmentWork";
import PerformDevelopmentTask from "@/components/contributor/developer/PerformDevelopmentTask";
import UpdateDevelopmentTaskStatus from "@/components/contributor/developer/UpdateDevelopmentTaskStatus";
import ReportTechnicalBlocker from "@/components/contributor/developer/ReportTechnicalBlocker";
import SubmitDevelopmentWork from "@/components/contributor/developer/SubmitDevelopmentWork";
import ParticipateTechnicalReview from "@/components/contributor/developer/ParticipateTechnicalReview";
import AddTechnicalComments from "@/components/contributor/developer/AddTechnicalComments";
import PerformSpecializedDevelopmentWork from "@/components/contributor/developer/PerformSpecializedDevelopmentWork";

// ============================================================
// DEVELOPER PAGE
// CONT-DEV-001 → CONT-DEV-008
// ============================================================

function Developer() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#081b33] p-4 sm:p-6 lg:p-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                            <Code2 size={28} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                                Developer Work Management
                            </h1>

                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                Manage assigned development work, technical tasks,
                                blockers, reviews, and specialization.
                            </p>
                        </div>

                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/40">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                            Role
                        </p>

                        <p className="mt-1 font-semibold text-blue-900 dark:text-blue-200">
                            Developer
                        </p>
                    </div>

                </div>
            </div>

            {/* ==================================================
                AUTHORITY / WORKFLOW INFORMATION
            ================================================== */}

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0d2745]">

                <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                        <Wrench size={20} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Developer Workflow
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Development work follows the assigned-task and review workflow.
                        </p>
                    </div>

                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">

                    <span className="rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        Manager
                    </span>

                    <span className="text-slate-400">→</span>

                    <span className="rounded-lg bg-blue-100 px-3 py-2 font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        Assigned Development Work
                    </span>

                    <span className="text-slate-400">→</span>

                    <span className="rounded-lg bg-indigo-100 px-3 py-2 font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        Developer
                    </span>

                    <span className="text-slate-400">→</span>

                    <span className="rounded-lg bg-amber-100 px-3 py-2 font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        Review
                    </span>

                    <span className="text-slate-400">→</span>

                    <span className="rounded-lg bg-green-100 px-3 py-2 font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        Manager / Reviewer
                    </span>

                </div>

            </div>

            {/* ==================================================
                USE CASE 001
                VIEW DEVELOPMENT WORK
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<ListTodo size={20} />}
                    number="CONT-DEV-001"
                    title="View Assigned Development Work"
                    description="View development tasks assigned according to team, project, sprint, and specialization."
                />

                <ViewDevelopmentWork />

            </section>

            {/* ==================================================
                USE CASE 002
                PERFORM DEVELOPMENT TASK
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<PlayCircle size={20} />}
                    number="CONT-DEV-002"
                    title="Perform Development Task"
                    description="Perform technical work according to assigned requirements and specialization."
                />

                <PerformDevelopmentTask />

            </section>

            {/* ==================================================
                USE CASE 003
                UPDATE DEVELOPMENT TASK STATUS
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<RefreshCw size={20} />}
                    number="CONT-DEV-003"
                    title="Update Development Task Status"
                    description="Maintain accurate progress and task status throughout the development workflow."
                />

                <UpdateDevelopmentTaskStatus />

            </section>

            {/* ==================================================
                USE CASE 004
                REPORT TECHNICAL BLOCKER
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<ShieldAlert size={20} />}
                    number="CONT-DEV-004"
                    title="Report Technical Blocker"
                    description="Report technical issues that prevent progress on an assigned development task."
                />

                <ReportTechnicalBlocker />

            </section>

            {/* ==================================================
                USE CASE 005
                SUBMIT DEVELOPMENT WORK
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<Send size={20} />}
                    number="CONT-DEV-005"
                    title="Submit Development Work for Review"
                    description="Submit completed technical work for review by the appropriate reviewer or Manager."
                />

                <SubmitDevelopmentWork />

            </section>

            {/* ==================================================
                USE CASE 006
                PARTICIPATE IN TECHNICAL REVIEW
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<MessageSquare size={20} />}
                    number="CONT-DEV-006"
                    title="Participate in Technical Review"
                    description="Review feedback, make requested changes, respond to comments, and resubmit work."
                />

                <ParticipateTechnicalReview />

            </section>

            {/* ==================================================
                USE CASE 007
                ADD TECHNICAL COMMENTS
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<MessageSquare size={20} />}
                    number="CONT-DEV-007"
                    title="Add Technical Comments"
                    description="Document implementation details, technical decisions, dependencies, errors, testing, and blockers."
                />

                <AddTechnicalComments />

            </section>

            {/* ==================================================
                USE CASE 008
                SPECIALIZED DEVELOPMENT WORK
            ================================================== */}

            <section className="mb-8">

                <SectionHeader
                    icon={<Code2 size={20} />}
                    number="CONT-DEV-008"
                    title="Perform Specialized Development Work"
                    description="Perform development work according to the Developer's registered specialization."
                />

                <PerformSpecializedDevelopmentWork />

            </section>

            {/* ==================================================
                DEVELOPER AUTHORITY RULE
            ================================================== */}

            <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">

                <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
                        <ShieldAlert size={20} />
                    </div>

                    <div>

                        <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                            Developer Authority Rule
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-300">
                            Specialization is a capability and assignment attribute,
                            not a permission level. Developers can perform assigned
                            technical work, update their assigned tasks, communicate
                            technical information, report blockers, and submit work
                            for review.
                        </p>

                        <p className="mt-2 text-sm font-medium text-amber-900 dark:text-amber-200">
                            Developers cannot create projects, change team assignments,
                            change another user's specialization, or approve their
                            own completed work.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
    icon,
    number,
    title,
    description,
}) {
    return (
        <div className="mb-4 flex items-start gap-3">

            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                {icon}
            </div>

            <div>

                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {number}
                </p>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>

            </div>

        </div>
    );
}

export default Developer;
