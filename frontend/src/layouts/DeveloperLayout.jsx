import { useState } from "react";
import { Outlet } from "react-router-dom";

import DeveloperSidebar from "@/components/contributor/shared/DeveloperSidebar";
import DeveloperNavbar from "@/components/contributor/shared/DeveloperNavbar";

function DeveloperLayout() {
    // Track whether the sidebar is open on mobile
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

            {/* Developer Sidebar */}
            <DeveloperSidebar
                isMobileOpen={isSidebarOpen}
                onCloseMobile={() => setIsSidebarOpen(false)}
            />

            {/* Main Application Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* Developer Navbar */}
                <DeveloperNavbar
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

export default DeveloperLayout;