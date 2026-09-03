import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";

function ManagerLayout() {
    return (
        <div
            className="
                flex
                min-h-screen
                w-full
                overflow-x-hidden
                bg-slate-50
                text-slate-900
                transition-colors
                duration-200
                dark:bg-slate-950
                dark:text-slate-100
            "
        >
            {/* Sidebar */}
            <ManagerSidebar />

            {/* Main application area */}
            <div
                className="
                    ml-64
                    flex
                    min-w-0
                    min-h-screen
                    flex-1
                    flex-col
                    bg-slate-50
                    dark:bg-slate-950
                "
            >
                {/* Navbar */}
                <ManagerNavbar />

                {/* Page content */}
                <main
                    className="
                        min-w-0
                        min-h-[calc(100vh-80px)]
                        flex-1
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