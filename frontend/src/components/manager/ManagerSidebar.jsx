import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  Users,
  CheckSquare,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  BrainCircuit,
} from "lucide-react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import { logoutUser } from "../../services/authService";

function ManagerSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/manager/dashboard",
    },

    {
      name: "Projects",
      icon: FolderKanban,
      path: "/manager/projects",
    },

    {
      name: "Sprint",
      icon: GitBranch,
      path: "/manager/sprints",
    },

    {
      name: "Team",
      icon: Users,
      path: "/manager/team",
    },

    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/manager/tasks",
    },

    {
      name: "Calendar",
      icon: Calendar,
      path: "/manager/calendar",
    },

    {
      name: "Files",
      icon: FileText,
      path: "/manager/files",
    },

    {
      name: "Notifications",
      icon: Bell,
      path: "/manager/notifications",
    },

    // ============================
    // AI FEATURES
    // ============================
    {
      name: "AI Features",
      icon: BrainCircuit,
      path: "/manager/ai-features",
    },

    {
      name: "Settings",
      icon: Settings,
      path: "/manager/settings",
    },
  ];

  // ============================
  // Logout
  // ============================
  const handleLogout = () => {
    // Remove current logged-in user
    logoutUser();

    // Go to login page
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        w-64
        h-screen
        bg-[#0f172a]
        text-white
        flex
        flex-col
        overflow-hidden
        z-50
      "
    >
      {/* ============================
          Logo
      ============================ */}

      <div
        className="
          h-20
          flex
          items-center
          px-6
          border-b
          border-gray-700
          flex-shrink-0
        "
      >
        <h1
          className="
            text-xl
            font-bold
            tracking-wide
            text-white
          "
        >
          AI-PMS
        </h1>
      </div>

      {/* ============================
          Navigation
      ============================ */}

      <nav
        className="
          flex-1
          px-4
          py-6
          space-y-2
          overflow-y-auto
        "
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-lg
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }
                `
              }
            >
              <Icon size={20} />

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* ============================
          Bottom User Section
      ============================ */}

      <div
        className="
          p-4
          bg-[#0f172a]
          border-t
          border-gray-700
          flex-shrink-0
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            mb-4
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-blue-600
              flex
              items-center
              justify-center
              font-bold
              text-white
            "
          >
            M
          </div>

          <div>
            <h3
              className="
                text-white
                font-semibold
                text-sm
              "
            >
              Manager
            </h3>

            <p
              className="
                text-gray-400
                text-xs
              "
            >
              Project Manager
            </p>
          </div>
        </div>

        {/* ============================
            Logout Button
        ============================ */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-2
            rounded-lg
            bg-red-600
            hover:bg-red-700
            active:bg-red-800
            text-white
            transition
            duration-200
            cursor-pointer
          "
        >
          <LogOut size={18} />

          <span>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default ManagerSidebar;