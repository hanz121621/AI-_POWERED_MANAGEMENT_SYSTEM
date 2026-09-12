import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import TeamLeaderSidebar from "@/components/contributor/shared/TeamLeaderSidebar";
import TeamLeaderNavbar from "@/components/contributor/shared/TeamLeaderNavbar";

function TeamLeaderLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            {/* Sidebar */}
            <TeamLeaderSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main application area */}
            <div className="flex h-full min-w-0 flex-1 flex-col lg:ml-72">
                <TeamLeaderNavbar
                    sidebarOpen={sidebarOpen}
                    onMenuClick={() =>
                        setSidebarOpen((current) => !current)
                    }
                />

                {/* ONLY THIS AREA SCROLLS */}
                <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-4 md:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TeamLeaderLayout;