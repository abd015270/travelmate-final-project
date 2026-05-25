import { createContext, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const colors = {
    background: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "white",
    text: darkMode ? "white" : "#0f172a",
    subText: darkMode ? "#cbd5e1" : "#475569",
    border: darkMode ? "#334155" : "#d1d5db",
    primary: "#2563eb",
    green: "#16a34a",
    orange: "#f97316",
    red: "#dc2626",
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}