import apiClient from "@/query/api-client";
import { jwtDecode } from "jwt-decode";
import ENDPOINTS from "@/routes/endpoints";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessTokenPayload } from "@/types/auth";

interface AuthState {
  token: string | null;
  refresh_token: string | null;
  expireIn?: number;
}

interface AuthActions {
  setAuth: (
    token: string | null,
    refresh_token: string | null,
    expireIn?: number
  ) => void;
  logout: () => void;
  refreshUserToken: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      refresh_token: null,
      setAuth: (token, refresh_token, expireIn) =>
        set({ token, refresh_token, expireIn }),
      logout: () => set({ token: null, refresh_token: null }),
      refreshUserToken: async () => {
        const refreshToken = get().refresh_token;

        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          const response = await apiClient.post<{
            access_token: string;
            refresh_token: string;
          }>(ENDPOINTS.REFRESH_TOKEN, {
            refresh_token: refreshToken,
          });

          if (!response) {
            throw new Error("No response from server");
          }

          const { access_token, refresh_token } = response.data;

          const decoded = jwtDecode<AccessTokenPayload>(access_token);
          const expireIn = decoded.exp - Math.floor(Date.now() / 1000);

          get().setAuth(access_token, refresh_token, expireIn);
        } catch (error) {
          console.error("Error refreshing token:", error);
          get().logout();
        }
      },
    }),
    {
      name: "user-auth",
    }
  )
);

export default useAuthStore;
