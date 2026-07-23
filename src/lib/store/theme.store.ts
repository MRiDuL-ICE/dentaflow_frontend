import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        document.documentElement.setAttribute("data-theme", next);
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute("data-theme", theme);
      },
    }),
    {
      name: "dentaflow-theme",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useThemeStore;
