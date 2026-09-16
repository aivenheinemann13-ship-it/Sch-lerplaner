import { createContext, useContext, useEffect } from "react";
import { useAppData } from "./AppDataContext.jsx";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { state, actions } = useAppData();
  const { darkMode, accentColor, accentColorCustom, animationsEnabled } = state.settings;

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dataset.accent = accentColor;
    if (accentColor === "custom" && accentColorCustom) {
      document.documentElement.style.setProperty("--accent", accentColorCustom);
      document.documentElement.style.setProperty("--accent-bg", accentColorCustom + "15");
    }
  }, [accentColor, accentColorCustom]);

  useEffect(() => {
    document.documentElement.dataset.animations = animationsEnabled ? "on" : "off";
  }, [animationsEnabled]);

  const value = {
    darkMode,
    accentColor,
    accentColorCustom,
    animationsEnabled,
    toggleDarkMode: () => actions.updateSettings({ darkMode: !darkMode }),
    setAccentColor: (color) => actions.updateSettings({ accentColor: color }),
    setAccentColorCustom: (color) => actions.updateSettings({ accentColorCustom: color }),
    toggleAnimations: () => actions.updateSettings({ animationsEnabled: !animationsEnabled }),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme muss innerhalb von ThemeProvider verwendet werden.");
  return ctx;
}
