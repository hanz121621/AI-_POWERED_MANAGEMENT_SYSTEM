
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="
                relative
                h-10
                w-10
                rounded-xl
                border-border
                bg-background
                text-foreground
                transition-all
                duration-300
                hover:bg-accent
                hover:text-accent-foreground
                hover:shadow-md
            "
        >
            {isDark ? (
                <Sun
                    size={18}
                    className="transition-transform duration-300"
                />
            ) : (
                <Moon
                    size={18}
                    className="transition-transform duration-300"
                />
            )}
        </Button>
    );
}

export default ThemeToggle;
