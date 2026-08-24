import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="
                group
                relative
                flex
                h-10
                w-20
                items-center
                rounded-full
                border
                border-border
                bg-muted
                p-1
                transition-all
                duration-300
                hover:border-primary
                hover:shadow-md
                hover:shadow-primary/20
                focus:outline-none
                focus:ring-2
                focus:ring-ring
                focus:ring-offset-2
                focus:ring-offset-background
            "
            aria-label={
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            title={
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
        >
            {/* Background icons */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-between
                    px-2
                "
            >
                <Sun
                    size={15}
                    className={
                        isDark
                            ? "text-muted-foreground/60"
                            : "text-amber-500"
                    }
                />

                <Moon
                    size={15}
                    className={
                        isDark
                            ? "text-blue-400"
                            : "text-muted-foreground/60"
                    }
                />
            </div>

            {/* Sliding button */}

            <span
                className={`
                    relative
                    z-10
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-background
                    shadow-md
                    transition-transform
                    duration-300
                    ease-in-out
                    ${
                        isDark
                            ? "translate-x-10"
                            : "translate-x-0"
                    }
                `}
            >
                {isDark ? (
                    <Moon
                        size={16}
                        className="text-blue-400"
                    />
                ) : (
                    <Sun
                        size={16}
                        className="text-amber-500"
                    />
                )}
            </span>
        </button>
    );
}

export default ThemeToggle;