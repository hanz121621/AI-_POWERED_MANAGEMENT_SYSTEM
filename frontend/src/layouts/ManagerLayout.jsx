
// ============================================================
// AIPMS - MANAGER LAYOUT
// ============================================================

import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";

function ManagerLayout() {
    return (
        <div className="flex min-h-screen bg-white">

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <ManagerSidebar />

            {/* ==================================================
                MAIN AREA
            ================================================== */}

            <div className="ml-64 flex min-h-screen flex-1 flex-col bg-white">

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
                        bg-white
                        p-6
                        text-slate-900
                    "
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default ManagerLayout;

