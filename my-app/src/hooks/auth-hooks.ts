import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import useAuthStore from "@/store/auth-store";
import type { AccessTokenPayload } from "@/types/auth";
import type { AuthResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import type { ErrorResponse } from "react-router-dom";

export const useRegister = () => {
  return useMutation<
    AuthResponse,
    AxiosError<ErrorResponse>,
    { name: string; email: string; password: string }
  >({
    mutationKey: ["register"],
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      const response = await apiClient.post<AuthResponse>(
        ENDPOINTS.REGISTER,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token, refresh_token } = data.data;
      const setAuth = useAuthStore.getState().setAuth;
      const decodedToken = jwtDecode<AccessTokenPayload>(access_token);
      const expireIn = decodedToken.exp - Math.floor(Date.now() / 1000);
      setAuth(access_token, refresh_token, expireIn);
    },
  });
};

export const useLogin = () => {
  return useMutation<
    AuthResponse,
    AxiosError<ErrorResponse>,
    { email: string; password: string }
  >({
    mutationKey: ["login"],
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiClient.post<AuthResponse>(
        ENDPOINTS.LOGIN,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token, refresh_token } = data.data;
      const setAuth = useAuthStore.getState().setAuth;
      const decodedToken = jwtDecode<AccessTokenPayload>(access_token);
      const expireIn = decodedToken.exp - Math.floor(Date.now() / 1000);
      setAuth(access_token, refresh_token, expireIn);
    },
  });
};

export const useLogout = () => {
  return useMutation<AuthResponse, AxiosError<ErrorResponse>, void>({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const refresh_token = useAuthStore.getState().refresh_token;
      if (!refresh_token) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post<AuthResponse>(ENDPOINTS.LOGOUT, {
        refresh_token,
      });
      return response.data;
    },
    onSuccess: () => {
      const clearAuth = useAuthStore.getState().logout;
      clearAuth();
    },
  });
};
