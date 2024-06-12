import { ErrorTemplate } from "components/ErrorTemplate";
import { AppRoutes, EPermission } from "config/router";
import { Home } from "views/Home";
import { TRoutes } from "types/router";
import { EmptyLayout } from "layouts/EmptyLayout";

export const authRoutes: TRoutes = {
  [AppRoutes.auth.logIn]: {
    element: <Home />,
    permissions: [EPermission.AUTH_GUEST],
  },
  [AppRoutes.auth.logInGuest]: {
    element: <Home />,
    permissions: [EPermission.AUTH_GUEST],
  },
  [AppRoutes.auth.signUp]: {
    element: <Home />,
    permissions: [EPermission.AUTH_GUEST],
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
