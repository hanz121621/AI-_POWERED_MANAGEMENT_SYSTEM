import DeveloperNavbar from "@/components/contributor/shared/DeveloperNavbar";
import DeveloperSidebar from "@/components/contributor/shared/DeveloperSidebar";
import { Outlet } from "react-router-dom";

function DeveloperLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#081b33]">

            {/* ==================================================
                SIDEBAR
            ================================================== */}
            <DeveloperSidebar />

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}
            <div className="lg:pl-64">

                {/* NAVBAR */}
                <DeveloperNavbar />

                {/* ==================================================
                    PAGE CONTENT

                    The current Developer route is rendered here.
                    Do NOT put DeveloperDashboard directly here.
                ================================================== */}
                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

export default DeveloperLayout;