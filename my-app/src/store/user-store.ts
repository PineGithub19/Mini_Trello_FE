import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light" | "system";

interface UserState {
  theme: Theme;
}

interface UserActions {
  setTheme: (theme: Theme) => void;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "user-store",
    }
  )
);
