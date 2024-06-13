import { ErrorTemplate } from "src/views/ErrorTemplate";
import { AppRoutes, EPermission } from "config/router";
import { TRoutes } from "types/router";
import { EmptyLayout } from "layouts/EmptyLayout";
import { Login } from "views/auth/Login";
import { GuestLogin } from "views/auth/GuestLogin";
import { Singup } from "views/auth/Singup";

export const authRoutes: TRoutes = {
  [AppRoutes.auth.logIn]: {
    element: <Login />,
    permissions: [EPermission.AUTH_LOGIN],
  },
  [AppRoutes.auth.logInGuest]: {
    element: <GuestLogin />,
    permissions: [EPermission.AUTH_LOGIN],
  },
  [AppRoutes.auth.signUp]: {
    element: <Singup />,
    permissions: [EPermission.AUTH_LOGIN],
  },
  [AppRoutes.pageNotFound]: {
    element: (
      <EmptyLayout>
        <ErrorTemplate errorCode={404} />
      </EmptyLayout>
    ),
    permissions: [EPermission.AUTH_NOT_REQUIRED],
  },
};
