import {
    Users,
    ClipboardList,
    TrendingUp,
    UserRoundCog,
    MessageSquare,
    BarChart3,
} from "lucide-react";

import ViewAssignedTeam from "@/components/contributor/teamleader/ViewAssignedTeam";
import ViewTeamTasks from "@/components/contributor/teamleader/ViewTeamTasks";
import MonitorTeamProgress from "@/components/contributor/teamleader/MonitorTeamProgress";
import CoordinateTeamWork from "@/components/contributor/teamleader/CoordinateTeamWork";
import CommunicateWithManager from "@/components/contributor/teamleader/CommunicateWithManager";
import ViewTeamPerformance from "@/components/contributor/teamleader/ViewTeamPerformance";

/* ============================================================
   TEAM LEADER PAGE
   ============================================================ */

function TeamLeader() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#081b33]">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            dark:bg-blue-950/60
                            dark:text-blue-400
                        "
                    >
                        <Users className="h-6 w-6" />
                    </div>

                    <div>
                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Team Leader
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Coordinate your team, monitor work,
                            and communicate with the Manager.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                USE CASE 1
                CONT-LEADER-001
                VIEW ASSIGNED TEAM
            ================================================== */}

            <section className="mb-6">
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <Users className="h-5 w-5 text-blue-500" />

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        My Team
                    </h2>
                </div>

                <ViewAssignedTeam />
            </section>

            {/* ==================================================
                USE CASE 2
                CONT-LEADER-002
                VIEW TEAM TASKS
            ================================================== */}

            <section className="mb-6">
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <ClipboardList className="h-5 w-5 text-blue-500" />

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Team Tasks
                    </h2>
                </div>

                <ViewTeamTasks />
            </section>

            {/* ==================================================
                USE CASE 3
                CONT-LEADER-003
                MONITOR TEAM PROGRESS
            ================================================== */}

            <section className="mb-6">
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <TrendingUp className="h-5 w-5 text-blue-500" />

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Team Progress
                    </h2>
                </div>

                <MonitorTeamProgress />
            </section>

            {/* ==================================================
                USE CASE 4
                CONT-LEADER-004
                COORDINATE TEAM WORK
            ================================================== */}

            <section className="mb-6">
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <UserRoundCog className="h-5 w-5 text-blue-500" />

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Coordinate Team Work
                    </h2>
                </div>

                <CoordinateTeamWork />
            </section>

            {/* ==================================================
                USE CASE 5
                CONT-LEADER-005
                COMMUNICATE WITH MANAGER
            ================================================== */}

            <section className="mb-6">
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <MessageSquare className="h-5 w-5 text-blue-500" />

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Communicate with Manager
                    </h2>
                </div>

                <CommunicateWithManager />
            </section>

            {/* ==================================================
                USE CASE 6
                CONT-LEADER-006
                VIEW TEAM PERFORMANCE
            ================================================== */}

            <section>
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <BarChart3 className="h-5 w-5 text-blue-500" />

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Team Performance
                    </h2>
                </div>

                <ViewTeamPerformance />
            </section>
        </div>
    );
}

export default TeamLeader;