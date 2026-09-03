import { Outlet } from "react-router-dom";

import TeamLeaderSidebar from "@/components/contributor/shared/TeamLeaderSidebar";
import TeamLeaderNavbar from "@/components/contributor/shared/TeamLeaderNavbar";

function TeamLeaderLayout() {
    return (
        <div className="flex min-h-screen w-full overflow-x-hidden bg-background text-foreground">
            {/* Sidebar */}
            <TeamLeaderSidebar />

            {/* Main application area */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Navbar */}
                <TeamLeaderNavbar />

                {/* Page content */}
                <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-6">
                    <div className="mx-auto w-full max-w-[1800px] min-w-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TeamLeaderLayout;