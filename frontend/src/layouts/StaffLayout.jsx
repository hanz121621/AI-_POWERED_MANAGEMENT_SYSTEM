import StaffNavbar from "@/components/contributor/shared/StaffNavbar";
import StaffSidebar from "@/components/contributor/shared/StaffSidebar";
import { Outlet } from "react-router-dom";

function StaffLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#081b33]">

            {/* ==================================================
                SIDEBAR
            ================================================== */}
            <StaffSidebar />

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}
            <div className="lg:pl-64">

                {/* NAVBAR */}
                <StaffNavbar />

                {/* ==================================================
                    PAGE CONTENT

                    The current Staff route is rendered here.
                    Do NOT put StaffDashboard directly here.
                ================================================== */}
                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

export default StaffLayout;