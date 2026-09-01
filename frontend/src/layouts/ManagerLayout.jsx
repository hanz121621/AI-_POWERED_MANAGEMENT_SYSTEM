
// ============================================================
// AIPMS - MANAGER LAYOUT
// ============================================================

import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";
import ManagerThemeProvider from "@/contexts/ManagerThemeProvider";

function ManagerLayout() {
    return (
        <ManagerThemeProvider>
            <div className="flex min-h-screen bg-background text-foreground">

                {/* ==================================================
                    SIDEBAR
                ================================================== */}

                <ManagerSidebar />

                {/* ==================================================
                    MAIN AREA
                ================================================== */}

                <div className="ml-64 flex min-h-screen flex-1 flex-col bg-background">

                    {/* ==================================================
                        NAVBAR
                    ================================================== */}

                    <ManagerNavbar />

                    {/* ==================================================
                        PAGE CONTENT
                    ================================================== */}

                    <main
                        className="
                            min-h-[calc(100vh-80px)]
                            flex-1
                            bg-background
                            p-6
                            text-foreground
                            transition-colors
                            duration-300
                        "
                    >
                        <Outlet />
                    </main>

                </div>

            </div>
        </ManagerThemeProvider>
    );
}

export default ManagerLayout;