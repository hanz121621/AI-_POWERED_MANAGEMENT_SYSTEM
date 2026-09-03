import { Outlet } from "react-router-dom";

import DeveloperNavbar from "@/components/contributor/shared/DeveloperNavbar";
import DeveloperSidebar from "@/components/contributor/shared/DeveloperSidebar";

function DeveloperLayout() {
    return (
        <div className="flex min-h-screen w-full overflow-x-hidden bg-background text-foreground">
            {/* Sidebar */}
            <DeveloperSidebar />

            {/* Main application area */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Navbar */}
                <DeveloperNavbar />

                {/* Page content */}
                <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-6">
                    <div className="mx-auto w-full max-w-[1800px] min-w-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DeveloperLayout;