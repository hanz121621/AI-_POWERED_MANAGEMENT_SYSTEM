
import { useState } from "react";
import { Outlet } from "react-router-dom";

import TeamLeaderSidebar from "@/components/contributor/shared/TeamLeaderSidebar";
import TeamLeaderNavbar from "@/components/contributor/shared/TeamLeaderNavbar";

function TeamLeaderLayout() {
    // ============================================================
    // SIDEBAR MOBILE STATE
    // ============================================================

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">

            {/* ==================================================
                MOBILE OVERLAY
            ================================================== */}

            {isSidebarOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        md:hidden
                    "
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                />
            )}

            {/* ==================================================
                TEAM LEADER SIDEBAR
            ================================================== */}

            <TeamLeaderSidebar
                isOpen={isSidebarOpen}
                onClose={() =>
                    setIsSidebarOpen(false)
                }
            />

            {/* ==================================================
                MAIN APPLICATION AREA
            ================================================== */}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* ==================================================
                    TEAM LEADER NAVBAR
                ================================================== */}

                <TeamLeaderNavbar
                    onToggleSidebar={() =>
                        setIsSidebarOpen(true)
                    }
                    sidebarOpen={isSidebarOpen}
                    onMenuClick={() =>
                        setIsSidebarOpen(true)
                    }
                />

                {/* ==================================================
                    MAIN CONTENT
                    ONLY THIS AREA SCROLLS
                ================================================== */}

                <main
                    className="
                        min-h-0
                        min-w-0
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        p-3
                        sm:p-4
                        md:p-6
                        lg:p-6
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1800px]
                            min-w-0
                        "
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TeamLeaderLayout;