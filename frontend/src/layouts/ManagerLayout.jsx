
// ============================================================
// AIPMS - MANAGER LAYOUT
// ============================================================

import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";

function ManagerLayout() {
    return (
        <div
            className="
                flex
                min-h-screen
                bg-slate-50
                text-slate-900
                transition-colors
                duration-200
                dark:bg-slate-950
                dark:text-slate-100
            "
        >

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <ManagerSidebar />

            {/* ==================================================
                MAIN AREA
            ================================================== */}

            <div
                className="
                    ml-64
                    flex
                    min-h-screen
                    flex-1
                    flex-col
                    bg-slate-50
                    dark:bg-slate-950
                "
            >

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
                        bg-slate-50
                        p-6
                        text-slate-900
                        transition-colors
                        duration-200
                        dark:bg-slate-950
                        dark:text-slate-100
                    "
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default ManagerLayout;
