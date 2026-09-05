import { Outlet } from "react-router-dom";

import AdminSidebar from "@/components/admin/shared/AdminSidebar";
import AdminNavbar from "@/components/admin/shared/AdminNavbar";

function AdminLayout() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            
            {/* Fixed Sidebar Area */}
            <AdminSidebar />

            {/* Main Application Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                
                {/* Navbar */}
                <AdminNavbar />

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

export default AdminLayout;