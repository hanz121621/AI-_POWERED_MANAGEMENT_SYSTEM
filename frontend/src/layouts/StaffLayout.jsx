import { Outlet } from "react-router-dom";

import StaffNavbar from "@/components/contributor/shared/StaffNavbar";
import StaffSidebar from "@/components/contributor/shared/StaffSidebar";

function StaffLayout() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">

            {/* Fixed Sidebar */}
            <StaffSidebar />

            {/* Main Application Area */}
            <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">

                {/* Navbar */}
                <StaffNavbar />

                {/* Scrollable Content */}
                <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-4 md:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}

export default StaffLayout;