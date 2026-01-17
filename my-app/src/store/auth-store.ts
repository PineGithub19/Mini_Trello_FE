import apiClient from "@/query/api-client";
import { jwtDecode } from "jwt-decode";
import ENDPOINTS from "@/routes/endpoints";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessTokenPayload } from "@/types/auth";

interface AuthState {
  userId: string | null;
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
  isTokenExpired: () => boolean;
  getAccountId: () => string | null;
  refreshUserToken: () => Promise<void>;
  getUserId: () => string | null;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userId: null,
      token: null,
      refresh_token: null,
      setAuth: (token, refresh_token, expireIn) =>
        set(() => {
          let userId: string | null = null;

          if (token) {
            try {
              const decoded = jwtDecode<AccessTokenPayload>(token);
              userId = decoded.sub ?? null;
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          }

          return { token, refresh_token, expireIn, userId };
        }),
      logout: () => set({ token: null, refresh_token: null, userId: null }),
      isTokenExpired: () => {
        const expireIn = get().expireIn;
        if (expireIn === undefined) return true;

        const threshold = 60; // seconds

        return expireIn <= threshold;
      },
      getAccountId: () => {
        const token = get().token;
        if (!token) return null;

        try {
          const decoded = jwtDecode<AccessTokenPayload>(token);
          return decoded.sub;
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      },
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
      getUserId: () => {
        const token = get().token;
        if (!token) return null;

        try {
          const decoded = jwtDecode<AccessTokenPayload>(token);
          return decoded.sub;
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      },
    }),
    {
      name: "user-auth",
    }
  )
);

export default useAuthStore;
