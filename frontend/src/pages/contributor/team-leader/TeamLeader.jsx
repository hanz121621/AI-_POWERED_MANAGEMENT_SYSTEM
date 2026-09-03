import React from "react";
import {
    Users,
    ClipboardList,
    TrendingUp,
    UserRoundCog,
    MessageSquare,
    BarChart3,
    FolderKanban,
} from "lucide-react";

// Team Management
import ViewAssignedTeam from "@/components/contributor/teamleader/team-management/ViewAssignedTeam";
import ViewTeamTasks from "@/components/contributor/teamleader/team-management/ViewTeamTasks";
import MonitorTeamProgress from "@/components/contributor/teamleader/team-management/MonitorTeamProgress";
import CoordinateTeamWork from "@/components/contributor/teamleader/team-management/CoordinateTeamWork";
import ViewTeamPerformance from "@/components/contributor/teamleader/team-management/ViewTeamPerformance";

// Project / Sprint Participation
import ViewAssignedProjects from "@/components/contributor/teamleader/project-participation/ViewAssignedProjects";
import ViewSprintProgress from "@/components/contributor/teamleader/sprint-participation/ViewSprintProgress";

// Reports
import TeamPerformanceReport from "@/components/contributor/teamleader/reports/TeamPerformanceReport";

// Communication
import CommunicateWithManager from "@/components/contributor/teamleader/communication/CommunicateWithManager";
import MentionTeamMembers from "@/components/contributor/teamleader/communication/MentionTeamMembers";
import ReceiveMessages from "@/components/contributor/teamleader/communication/ReceiveMessages";
import ViewNotifications from "@/components/contributor/teamleader/communication/ViewNotifications";

const TeamLeader = () => {
    return (
        <div className="space-y-8">
            {/* ============================================================
                HEADER
            ============================================================ */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Team Leader
                </h1>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Coordinate your team, monitor work, manage projects,
                    track performance, and communicate with the Manager.
                </p>
            </div>

            {/* ============================================================
                1. MY TEAM
            ============================================================ */}
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <Users className="h-6 w-6 text-gray-700 dark:text-gray-300" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            My Team
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            View and manage your assigned team members.
                        </p>
                    </div>
                </div>

                <ViewAssignedTeam />
            </section>

            {/* ============================================================
                2. ASSIGNED PROJECTS
            ============================================================ */}
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <FolderKanban className="h-6 w-6 text-gray-700 dark:text-gray-300" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Assigned Projects
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            View projects assigned to your team.
                        </p>
                    </div>
                </div>

                <ViewAssignedProjects />
            </section>

            {/* ============================================================
                3. TEAM TASKS
            ============================================================ */}
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <ClipboardList className="h-6 w-6 text-gray-700 dark:text-gray-300" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Team Tasks
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            View and coordinate tasks assigned to your team.
                        </p>
                    </div>
                </div>

                <ViewTeamTasks />
            </section>

            {/* ============================================================
                4. TEAM PROGRESS
            ============================================================ */}
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-gray-700 dark:text-gray-300" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Team Progress
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Monitor sprint and overall team progress.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <MonitorTeamProgress />
                    <ViewSprintProgress />
                </div>
            </section>

            {/* ============================================================
                5. COORDINATE TEAM WORK
            ============================================================ */}
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <UserRoundCog className="h-6 w-6 text-gray-700 dark:text-gray-300" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Coordinate Team Work
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Organize work, assign responsibilities, and
                            coordinate team activities.
                        </p>
                    </div>
                </div>

                <CoordinateTeamWork />
            </section>

            {/* ============================================================
                6. COMMUNICATION
            ============================================================ */}
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-gray-700 dark:text-gray-300" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Communication
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Communicate with the Manager and team members.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <CommunicateWithManager />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <ReceiveMessages />
                        <MentionTeamMembers />
                    </div>

                    <ViewNotifications />
                </div>
            </section>

            {/* ============================================================
                7. TEAM PERFORMANCE
            ============================================================ */}
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-gray-700 dark:text-gray-300" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Team Performance
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Review team performance and generate performance
                            reports.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <ViewTeamPerformance />
                    <TeamPerformanceReport />
                </div>
            </section>
        </div>
    );
};

export default TeamLeader;