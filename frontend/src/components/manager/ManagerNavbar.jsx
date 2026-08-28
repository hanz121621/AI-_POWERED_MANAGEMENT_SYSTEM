import { Bell, Search, Sun, Moon } from "lucide-react";

import { useManagerTheme } from "@/contexts/useManagerTheme";

function ManagerNavbar() {
  const { theme, toggleTheme } = useManagerTheme();

  return (
    <header
      className="
        sticky
        top-0
        z-40
        flex
        h-20
        items-center
        justify-between
        border-b
        border-border
        bg-background
        px-8
        text-foreground
        transition-colors
        duration-300
      "
    >
      {/* Search */}
      <div className="relative w-96">
        <Search
          size={20}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <input
          type="text"
          placeholder="Search projects..."
          className="
            w-full
            rounded-lg
            border
            border-border
            bg-muted
            py-3
            pl-10
            pr-4
            text-foreground
            outline-none
            placeholder:text-muted-foreground
            focus:ring-2
            focus:ring-ring
            transition-colors
            duration-300
          "
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* ==================================================
            MANAGER THEME TOGGLE
        ================================================== */}
        <button
          type="button"
          onClick={toggleTheme}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-border
            bg-muted
            text-foreground
            transition-all
            duration-300
            hover:bg-accent
            hover:text-accent-foreground
          "
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="
            relative
            rounded-full
            p-3
            text-muted-foreground
            transition
            hover:bg-accent
            hover:text-accent-foreground
          "
          aria-label="Notifications"
        >
          <Bell size={22} />

          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-primary
              font-bold
              text-primary-foreground
            "
          >
            M
          </div>

          <div>
            <p className="font-semibold text-foreground">
              Manager
            </p>

            <p className="text-sm text-muted-foreground">
              manager@email.com
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}

export default ManagerNavbar;