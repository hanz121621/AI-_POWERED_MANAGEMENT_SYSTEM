import React from "react";
import { Outlet } from "react-router-dom";

import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerNavbar from "@/components/manager/ManagerNavbar";

function ManagerLayout() {
  return (
    <div className="flex min-h-screen bg-[#020617]">

      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1">

        {/* Navbar */}
        <ManagerNavbar />

        {/* Pages */}
        <main className="min-h-screen bg-[#020617] p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default ManagerLayout;