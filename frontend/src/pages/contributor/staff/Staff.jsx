import {
    BriefcaseBusiness,
    ClipboardList,
    MessageSquare,
    Upload,
    Send,
    Award,
    CheckCircle2,
} from "lucide-react";

// ============================================================
// STAFF COMPONENTS
// ============================================================

import ViewMyWork from "@/components/contributor/staff/ViewMyWork";
import UpdateTaskStatus from "@/components/contributor/staff/UpdateTaskStatus";
import AddTaskComment from "@/components/contributor/staff/AddTaskComment";
import UploadWorkFiles from "@/components/contributor/staff/UploadWorkFiles";
import SubmitCompletedWork from "@/components/contributor/staff/SubmitCompletedWork";
import PerformSpecializedWork from "@/components/contributor/staff/PerformSpecializedWork";

// ============================================================
// STAFF PAGE
//
// STAFF WORK MANAGEMENT
//
// CONT-STAFF-001  View Assigned Work
// CONT-STAFF-002  Update Task Status
// CONT-STAFF-003  Add Task Comment
// CONT-STAFF-004  Upload Work Files
// CONT-STAFF-005  Submit Completed Work
// CONT-STAFF-006  Perform Specialized Work
//
// AUTHORITY:
//
// Manager
//    ↓
// Assigns Work
//    ↓
// Team Leader
//    ↓
// Coordinates
//    ↓
// Staff
//    ↓
// Performs Specialized Work
//    ↓
// Submit for Review
//    ↓
// Manager
//    ↓
// Final Approval
// ============================================================

function Staff() {
    return (
        <div
            className="
                min-h-screen
                bg-slate-50
                p-4
                sm:p-6
                dark:bg-[#081b33]
            "
        >
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="mb-8">
                <div className="flex items-start gap-4">
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            dark:bg-blue-950/60
                            dark:text-blue-400
                        "
                    >
                        <BriefcaseBusiness className="h-6 w-6" />
                    </div>

                    <div>
                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                                sm:text-3xl
                                dark:text-white
                            "
                        >
                            My Work
                        </h1>

                        <p
                            className="
                                mt-1
                                max-w-3xl
                                text-sm
                                leading-6
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            View your assigned work, update
                            task progress, communicate with
                            your team, upload work files,
                            and submit completed work for
                            Manager review.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                STAFF WORKFLOW
            ================================================== */}

            <div
                className="
                    mb-8
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2
                        className="
                            h-5
                            w-5
                            text-blue-500
                        "
                    />

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Staff Work Workflow
                    </h2>
                </div>

                <div
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-5
                    "
                >
                    {/* STEP 1 */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                            dark:border-slate-700
                            dark:bg-[#081b33]
                        "
                    >
                        <div
                            className="
                                mb-2
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-600
                                dark:bg-blue-950
                                dark:text-blue-400
                            "
                        >
                            1
                        </div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            View Work
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Review assigned tasks.
                        </p>
                    </div>

                    {/* STEP 2 */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                            dark:border-slate-700
                            dark:bg-[#081b33]
                        "
                    >
                        <div
                            className="
                                mb-2
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-600
                                dark:bg-blue-950
                                dark:text-blue-400
                            "
                        >
                            2
                        </div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Perform Work
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Work according to specialization.
                        </p>
                    </div>

                    {/* STEP 3 */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                            dark:border-slate-700
                            dark:bg-[#081b33]
                        "
                    >
                        <div
                            className="
                                mb-2
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-600
                                dark:bg-blue-950
                                dark:text-blue-400
                            "
                        >
                            3
                        </div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Update
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Update status and progress.
                        </p>
                    </div>

                    {/* STEP 4 */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                            dark:border-slate-700
                            dark:bg-[#081b33]
                        "
                    >
                        <div
                            className="
                                mb-2
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-600
                                dark:bg-blue-950
                                dark:text-blue-400
                            "
                        >
                            4
                        </div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Submit
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Submit completed work.
                        </p>
                    </div>

                    {/* STEP 5 */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                            dark:border-slate-700
                            dark:bg-[#081b33]
                        "
                    >
                        <div
                            className="
                                mb-2
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-green-100
                                text-sm
                                font-bold
                                text-green-600
                                dark:bg-green-950
                                dark:text-green-400
                            "
                        >
                            5
                        </div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Manager Review
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Manager approves or requests
                            modification.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                USE CASE 1
                CONT-STAFF-001
                VIEW ASSIGNED WORK
            ================================================== */}

            <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-100
                            text-blue-600
                            dark:bg-blue-950/60
                            dark:text-blue-400
                        "
                    >
                        <ClipboardList className="h-5 w-5" />
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            CONT-STAFF-001
                        </p>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            View Assigned Work
                        </h2>
                    </div>
                </div>

                <ViewMyWork />
            </section>

            {/* ==================================================
                USE CASE 2
                CONT-STAFF-002
                UPDATE TASK STATUS
            ================================================== */}

            <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-indigo-100
                            text-indigo-600
                            dark:bg-indigo-950/60
                            dark:text-indigo-400
                        "
                    >
                        <ClipboardList className="h-5 w-5" />
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-indigo-600
                                dark:text-indigo-400
                            "
                        >
                            CONT-STAFF-002
                        </p>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Update Task Status
                        </h2>
                    </div>
                </div>

                <UpdateTaskStatus />
            </section>

            {/* ==================================================
                USE CASE 3
                CONT-STAFF-003
                ADD TASK COMMENT
            ================================================== */}

            <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-cyan-100
                            text-cyan-600
                            dark:bg-cyan-950/60
                            dark:text-cyan-400
                        "
                    >
                        <MessageSquare className="h-5 w-5" />
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-cyan-600
                                dark:text-cyan-400
                            "
                        >
                            CONT-STAFF-003
                        </p>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Add Task Comment
                        </h2>
                    </div>
                </div>

                <AddTaskComment />
            </section>

            {/* ==================================================
                USE CASE 4
                CONT-STAFF-004
                UPLOAD WORK FILES
            ================================================== */}

            <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-orange-100
                            text-orange-600
                            dark:bg-orange-950/60
                            dark:text-orange-400
                        "
                    >
                        <Upload className="h-5 w-5" />
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-orange-600
                                dark:text-orange-400
                            "
                        >
                            CONT-STAFF-004
                        </p>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Upload Work Files
                        </h2>
                    </div>
                </div>

                <UploadWorkFiles />
            </section>

            {/* ==================================================
                USE CASE 5
                CONT-STAFF-005
                SUBMIT COMPLETED WORK
            ================================================== */}

            <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-green-100
                            text-green-600
                            dark:bg-green-950/60
                            dark:text-green-400
                        "
                    >
                        <Send className="h-5 w-5" />
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-green-600
                                dark:text-green-400
                            "
                        >
                            CONT-STAFF-005
                        </p>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Submit Completed Work
                        </h2>
                    </div>
                </div>

                <SubmitCompletedWork />
            </section>

            {/* ==================================================
                USE CASE 6
                CONT-STAFF-006
                PERFORM SPECIALIZED WORK
            ================================================== */}

            <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-purple-100
                            text-purple-600
                            dark:bg-purple-950/60
                            dark:text-purple-400
                        "
                    >
                        <Award className="h-5 w-5" />
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-purple-600
                                dark:text-purple-400
                            "
                        >
                            CONT-STAFF-006
                        </p>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Perform Specialized Work
                        </h2>
                    </div>
                </div>

                <PerformSpecializedWork />
            </section>

            {/* ==================================================
                AUTHORITY / BUSINESS RULE
            ================================================== */}

            <section>
                <div
                    className="
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5
                        dark:border-blue-900
                        dark:bg-blue-950/20
                    "
                >
                    <div className="flex items-start gap-3">
                        <Award
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                                text-blue-600
                                dark:text-blue-400
                            "
                        />

                        <div>
                            <h3
                                className="
                                    font-semibold
                                    text-blue-900
                                    dark:text-blue-200
                                "
                            >
                                Staff Authority
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-blue-800
                                    dark:text-blue-300
                                "
                            >
                                Staff members are
                                execution-focused.
                                Their specialization
                                supports appropriate
                                work assignment and
                                professional capability,
                                but it does not provide
                                management authority.
                            </p>

                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-col
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-blue-900
                                    dark:text-blue-200
                                    sm:flex-row
                                    sm:items-center
                                    sm:gap-3
                                "
                            >
                                <span>
                                    Manager
                                </span>

                                <span className="hidden sm:inline">
                                    →
                                </span>

                                <span>
                                    Team Leader
                                </span>

                                <span className="hidden sm:inline">
                                    →
                                </span>

                                <span>
                                    Staff
                                </span>

                                <span className="hidden sm:inline">
                                    →
                                </span>

                                <span>
                                    Submit for Review
                                </span>

                                <span className="hidden sm:inline">
                                    →
                                </span>

                                <span>
                                    Manager Approval
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Staff;