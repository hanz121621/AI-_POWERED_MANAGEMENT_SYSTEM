import { useState } from "react";
import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";

function ManagerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div
            className="
                flex
                h-screen
                w-full
                overflow-hidden
                bg-slate-50
                text-slate-900
                transition-colors
                duration-200
                dark:bg-slate-950
                dark:text-slate-100
            "
        >
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        md:hidden
                    "
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <ManagerSidebar
                isMobileOpen={isSidebarOpen}
                onCloseMobile={() => setIsSidebarOpen(false)}
            />

            {/* Main application area */}
            <div
                className="
                    flex
                    min-h-0
                    min-w-0
                    flex-1
                    flex-col
                    overflow-hidden
                    bg-slate-50
                    dark:bg-slate-950
                    md:ml-64
                "
            >
                {/* Navbar */}
                <ManagerNavbar
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                />

                {/* ONLY THIS AREA SCROLLS */}
                <main
                    className="
                        min-h-0
                        min-w-0
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        bg-slate-50
                        p-3
                        text-slate-900
                        transition-colors
                        duration-200
                        sm:p-4
                        md:p-6
                        lg:p-6
                        dark:bg-slate-950
                        dark:text-slate-100
                    "
                >
                    <div className="mx-auto w-full max-w-[1800px] min-w-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ManagerLayout;



