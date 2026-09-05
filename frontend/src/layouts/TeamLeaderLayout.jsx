
import { Outlet } from "react-router-dom";

import TeamLeaderSidebar from "@/components/contributor/shared/TeamLeaderSidebar";
import TeamLeaderNavbar from "@/components/contributor/shared/TeamLeaderNavbar";

function TeamLeaderLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <TeamLeaderSidebar />

            <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
                <TeamLeaderNavbar />

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default TeamLeaderLayout;
