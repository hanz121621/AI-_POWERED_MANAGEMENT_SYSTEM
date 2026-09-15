
import { useState } from "react";
import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";

function ManagerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <ManagerSidebar
                isMobileOpen={isSidebarOpen}
                onCloseMobile={() => setIsSidebarOpen(false)}
            />

            {/* Main Application Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* Navbar */}
                <ManagerNavbar
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                />

                {/* Only this area scrolls */}
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-6">
                    <div className="mx-auto w-full max-w-[1800px] min-w-0">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}

export default ManagerLayout;

