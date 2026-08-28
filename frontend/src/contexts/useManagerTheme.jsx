import { useContext } from "react";
import ManagerThemeContext from "./ManagerThemeContext";

export function useManagerTheme() {
  const context = useContext(ManagerThemeContext);

  if (!context) {
    throw new Error(
      "useManagerTheme must be used inside ManagerThemeProvider"
    );
  }

  return context;
}