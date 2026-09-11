
import {
    MessageSquare,
    Bell,
    AtSign,
    MessageCircle,
} from "lucide-react";

import ReceiveMessages from "@/components/contributor/developer/communication/ReceiveMessages";
import CommentOnTasks from "@/components/contributor/developer/communication/CommentOnTasks";
import MentionTeamMembers from "@/components/contributor/developer/communication/MentionTeamMembers";
import ViewNotifications from "@/components/contributor/developer/communication/ViewNotifications";

export default function Communication() {
    return (
        <div className="min-h-full w-full bg-slate-50 dark:bg-[#061426]">

            {/* =====================================================
                PAGE CONTAINER
            ===================================================== */}

            <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-4 md:px-6 lg:px-8">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <section className="mb-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* TITLE */}
                        <div className="flex min-w-0 items-center gap-3">

                            {/* ICON */}
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-cyan-100
                                    ring-1
                                    ring-cyan-200
                                    dark:bg-cyan-950/50
                                    dark:ring-cyan-900
                                "
                            >
                                <MessageSquare
                                    className="
                                        h-5
                                        w-5
                                        text-cyan-600
                                        dark:text-cyan-400
                                    "
                                />
                            </div>

                            {/* TEXT */}
                            <div className="min-w-0">

                                <h1
                                    className="
                                        truncate
                                        text-xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                        sm:text-2xl
                                        dark:text-white
                                    "
                                >
                                    Communication
                                </h1>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        leading-5
                                        text-slate-500
                                        sm:text-sm
                                        dark:text-slate-400
                                    "
                                >
                                    Manage messages, task discussions, mentions,
                                    and notifications.
                                </p>

                            </div>
                        </div>

                        {/* STATUS */}
                        <div
                            className="
                                hidden
                                shrink-0
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2
                                shadow-sm
                                sm:flex
                                dark:border-blue-900/60
                                dark:bg-[#0b1d35]
                            "
                        >
                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-emerald-500
                                "
                            />

                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    dark:text-slate-300
                                "
                            >
                                Communication Center
                            </span>
                        </div>

                    </div>

                </section>


                {/* =================================================
                    COMMUNICATION OVERVIEW
                ================================================= */}

                <section className="mb-6">

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                        {/* MESSAGES */}
                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-4
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#0b1d35]
                            "
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Messages
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-lg
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Team
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-cyan-100
                                        dark:bg-cyan-950/60
                                    "
                                >
                                    <MessageCircle
                                        className="
                                            h-4
                                            w-4
                                            text-cyan-600
                                            dark:text-cyan-400
                                        "
                                    />
                                </div>

                            </div>

                            <p
                                className="
                                    mt-2
                                    text-[11px]
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Receive and review team messages
                            </p>
                        </div>


                        {/* COMMENTS */}
                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-4
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#0b1d35]
                            "
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Discussions
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-lg
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Tasks
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-100
                                        dark:bg-blue-950/60
                                    "
                                >
                                    <MessageSquare
                                        className="
                                            h-4
                                            w-4
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    />
                                </div>

                            </div>

                            <p
                                className="
                                    mt-2
                                    text-[11px]
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Discuss work and task progress
                            </p>
                        </div>


                        {/* MENTIONS */}
                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-4
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#0b1d35]
                            "
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Mentions
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-lg
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Team Members
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-violet-100
                                        dark:bg-violet-950/60
                                    "
                                >
                                    <AtSign
                                        className="
                                            h-4
                                            w-4
                                            text-violet-600
                                            dark:text-violet-400
                                        "
                                    />
                                </div>

                            </div>

                            <p
                                className="
                                    mt-2
                                    text-[11px]
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Mention and collaborate with teammates
                            </p>
                        </div>

                    </div>

                </section>


                {/* =================================================
                    MESSAGES SECTION
                ================================================= */}

                <section className="mb-6">

                    <div className="mb-3 flex items-center justify-between">

                        <div>
                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Team Messages
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                View and respond to communication from your team.
                            </p>
                        </div>

                    </div>

                    <div
                        className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                            dark:border-blue-900/60
                            dark:bg-[#0b1d35]
                        "
                    >
                        <ReceiveMessages />
                    </div>

                </section>


                {/* =================================================
                    COLLABORATION SECTION
                ================================================= */}

                <section className="mb-6">

                    <div className="mb-3">

                        <h2
                            className="
                                text-base
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Collaboration
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Discuss tasks and communicate directly with team members.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                        {/* TASK COMMENTS */}
                        <div
                            className="
                                min-w-0
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b1d35]
                            "
                        >
                            <div
                                className="
                                    border-b
                                    border-slate-100
                                    px-4
                                    py-3
                                    dark:border-blue-900/50
                                "
                            >
                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Task Discussions
                                </h3>

                                <p
                                    className="
                                        mt-0.5
                                        text-[11px]
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Add and review comments on tasks.
                                </p>
                            </div>

                            <div className="p-1">
                                <CommentOnTasks />
                            </div>
                        </div>


                        {/* MENTIONS */}
                        <div
                            className="
                                min-w-0
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b1d35]
                            "
                        >
                            <div
                                className="
                                    border-b
                                    border-slate-100
                                    px-4
                                    py-3
                                    dark:border-blue-900/50
                                "
                            >
                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Team Mentions
                                </h3>

                                <p
                                    className="
                                        mt-0.5
                                        text-[11px]
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Mention teammates when collaboration is needed.
                                </p>
                            </div>

                            <div className="p-1">
                                <MentionTeamMembers />
                            </div>
                        </div>

                    </div>

                </section>


                {/* =================================================
                    NOTIFICATIONS SECTION
                ================================================= */}

                <section>

                    <div className="mb-3 flex items-center gap-2">

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-amber-100
                                dark:bg-amber-950/50
                            "
                        >
                            <Bell
                                className="
                                    h-4
                                    w-4
                                    text-amber-600
                                    dark:text-amber-400
                                "
                            />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Notifications
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Stay updated with important communication activity.
                            </p>
                        </div>

                    </div>


                    <div
                        className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                            dark:border-blue-900/60
                            dark:bg-[#0b1d35]
                        "
                    >
                        <ViewNotifications />
                    </div>

                </section>

            </div>
        </div>
    );
}
