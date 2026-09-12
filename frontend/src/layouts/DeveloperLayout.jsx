import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import DeveloperNavbar from "@/components/contributor/shared/DeveloperNavbar";
import DeveloperSidebar from "@/components/contributor/shared/DeveloperSidebar";

function DeveloperLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar with Escape
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    // Close mobile sidebar when entering desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
    <DeveloperSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
    />

    <div className="flex h-full min-w-0 flex-1 flex-col lg:ml-64">
        <DeveloperNavbar
            sidebarOpen={sidebarOpen}
            onMenuClick={() =>
                setSidebarOpen((current) => !current)
            }
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-4 md:px-6 lg:px-8">
                <Outlet />
            </div>
        </main>
    </div>
</div>
    );
}

export default DeveloperLayout;