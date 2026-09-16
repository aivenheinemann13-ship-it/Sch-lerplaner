import { createContext, useContext, useEffect } from "react";
import { useAppData } from "./AppDataContext.jsx";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { state, actions } = useAppData();
  const { darkMode, accentColor, animationsEnabled } = state.settings;

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dataset.accent = accentColor;
  }, [accentColor]);

  useEffect(() => {
    document.documentElement.dataset.animations = animationsEnabled ? "on" : "off";
  }, [animationsEnabled]);

  const value = {
    darkMode,
    accentColor,
    animationsEnabled,
    toggleDarkMode: () => actions.updateSettings({ darkMode: !darkMode }),
    setAccentColor: (color) => actions.updateSettings({ accentColor: color }),
    toggleAnimations: () => actions.updateSettings({ animationsEnabled: !animationsEnabled }),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme muss innerhalb von ThemeProvider verwendet werden.");
  return ctx;
}
