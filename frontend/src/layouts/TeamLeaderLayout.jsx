
import TeamLeaderNavbar from "@/components/contributor/shared/TeamLeaderNavbar";
import TeamLeaderSidebar from "@/components/contributor/shared/TeamLeaderSidebar";
import { Outlet } from "react-router-dom";

function TeamLeaderLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#081b33]">

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <TeamLeaderSidebar />

            {/* ==================================================
                MAIN AREA
            ================================================== */}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* ==================================================
                    NAVBAR
                ================================================== */}

                <TeamLeaderNavbar />

                {/* ==================================================
                    PAGE CONTENT
                ================================================== */}

                <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

export default TeamLeaderLayout;

