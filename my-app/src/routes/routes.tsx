import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import CommonLayout from "../layouts/common-layout";
import ErrorPage from "../layouts/error-page";
import LoadingPage from "../layouts/loading-page";

import { lazy } from "react";
import { ProtectedRoute } from "./protected-route";

const LoginPage = lazy(() => import("../components/auth/login-page"));
const SignUpPage = lazy(() => import("../components/auth/sign-up-page"));

const DashboardPage = lazy(
  () => import("../components/dashboard/dashboard-page")
);

const router = createBrowserRouter([
  {
    path: "/auth",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="sign-in" replace />,
      },
      {
        path: "sign-in",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback={<LoadingPage />}>
        <CommonLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "dashboard/workspaces/:workspaceId",
        element: <DashboardPage />,
      },
    ],
    loader: ProtectedRoute,
  },
]);

export default router;
