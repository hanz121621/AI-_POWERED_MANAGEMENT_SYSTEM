
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import StaffNavbar from "@/components/contributor/shared/StaffNavbar";
import StaffSidebar from "@/components/contributor/shared/StaffSidebar";

function StaffLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <StaffSidebar
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <StaffNavbar
                    sidebarOpen={sidebarOpen}
                    onMenuClick={() =>
                        setSidebarOpen(
                            (current) => !current
                        )
                    }
                />

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-6">
                    <div className="mx-auto w-full max-w-[1800px] min-w-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StaffLayout;

