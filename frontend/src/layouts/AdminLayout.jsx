import { Outlet } from "react-router-dom";

import AdminSidebar from "@/components/admin/shared/AdminSidebar";
import AdminNavbar from "@/components/admin/shared/AdminNavbar";

function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col bg-background text-foreground">
                {/* Admin Navbar */}
                <AdminNavbar />

                {/* Page Content */}
                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;