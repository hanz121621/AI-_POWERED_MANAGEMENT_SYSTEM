import { useEffect, useState } from "react";

import ManagerThemeContext from "./ManagerThemeContext";

const MANAGER_THEME_KEY = "aipms_manager_theme";

const DEFAULT_MANAGER_THEME = "dark";

function getInitialTheme() {
  if (typeof window === "undefined") {
    return DEFAULT_MANAGER_THEME;
  }

  const savedTheme = localStorage.getItem(MANAGER_THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return DEFAULT_MANAGER_THEME;
}

function ManagerThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(MANAGER_THEME_KEY, theme);

    // Apply theme ONLY to the manager application area
    document.documentElement.setAttribute(
      "data-manager-theme",
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };

  return (
    <ManagerThemeContext.Provider value={value}>
      {children}
    </ManagerThemeContext.Provider>
  );
}

export default ManagerThemeProvider;