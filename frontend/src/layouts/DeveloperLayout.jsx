
import { Outlet } from "react-router-dom";

import DeveloperNavbar from "@/components/contributor/shared/DeveloperNavbar";
import DeveloperSidebar from "@/components/contributor/shared/DeveloperSidebar";

function DeveloperLayout() {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">

            {/* Fixed Sidebar */}
            <DeveloperSidebar />

            {/* Main Application Area */}
            <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">

                {/* Navbar */}
                <DeveloperNavbar />

                {/* Scrollable Page Content */}
                <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-4 md:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}

export default DeveloperLayout;
