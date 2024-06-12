import { ErrorTemplate } from "components/ErrorTemplate";
import { AppRoutes, EPermission } from "config/router";
import { Onboarding } from "views/Onboarding";
import { Home } from "views/Home";
import { TRoutes } from "types/router";

export const userRoutes: TRoutes = {
  [AppRoutes.onboarding]: {
    element: <Onboarding />,
    permissions: [EPermission.AUTH_OWNER],
  },
  [AppRoutes.dashboard.url]: {
    element: <Home />,
    permissions: [EPermission.AUTH_OWNER, EPermission.AUTH_GUEST],
  },
  [AppRoutes.pageNotFound]: {
    element: <ErrorTemplate errorCode={404} />,
    permissions: [EPermission.AUTH_NOT_REQUIRED],
  },
};
