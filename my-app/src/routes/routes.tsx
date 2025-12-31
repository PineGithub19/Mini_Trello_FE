import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import CommonLayout from "../layouts/common-layout";
import ErrorPage from "../layouts/error-page";
import LoadingPage from "../layouts/loading-page";

import { lazy } from "react";

const LoginPage = lazy(() => import("../components/auth/login-page"));
const SignUpPage = lazy(() => import("../components/auth/sign-up-page"));

const router = createBrowserRouter([
  {
    path: "/auth",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback={<LoadingPage />}>
        <CommonLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <SignUpPage />,
      },
    ],
  },
]);

export default router;
