import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";
import ManagerThemeProvider from "@/contexts/ManagerThemeProvider";

function ManagerLayout() {
    return (
        <ManagerThemeProvider>
            <div className="flex min-h-screen bg-background text-foreground">

                {/* Sidebar */}
                <ManagerSidebar />

                {/* Main area */}
                <div className="ml-64 flex-1">

                    {/* Navbar */}
                    <ManagerNavbar />

                    {/* Manager pages */}
                    <main className="min-h-screen bg-background p-6">
                        <Outlet />
                    </main>

                </div>

            </div>
        </ManagerThemeProvider>
    );
}

export default ManagerLayout;