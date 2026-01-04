import useAuthStore from "@/store/auth-store";
import { redirect, type LoaderFunctionArgs } from "react-router-dom";

export const ProtectedRoute = async ({ request }: LoaderFunctionArgs) => {
  const token = useAuthStore.getState().token;
  const isTokenExpired = useAuthStore.getState().isTokenExpired;
  const refreshUserToken = useAuthStore.getState().refreshUserToken;

  if (token && isTokenExpired()) {
    await refreshUserToken();
  }

  if (token && !isTokenExpired()) {
    return null;
  }

  const url = new URL(request.url);
  const redirectTo = `/auth/sign-in?redirectTo=${encodeURIComponent(
    url.pathname + url.search
  )}`;
  return redirect(redirectTo);
};
