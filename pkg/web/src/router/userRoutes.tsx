import { AppRoutes, EPermission } from "config/router";
import { TRoutes } from "types/router";
import { HomeSettings } from "views/owner/HomeSettings";
import { ErrorTemplate } from "views/common/ErrorTemplate";
import { Dashboard } from "views/common/Dashboard";

export const userRoutes: TRoutes = {
  [AppRoutes.onboarding]: {
    element: <></>,
    permissions: [EPermission.AUTH_OWNER],
  },
  [AppRoutes.dashboard.url]: {
    element: <Dashboard />,
    permissions: [EPermission.AUTH_OWNER, EPermission.AUTH_GUEST],
  },
  [AppRoutes.homeSettings]: {
    element: <HomeSettings />,
    permissions: [EPermission.AUTH_OWNER],
  },
  [AppRoutes.pageNotFound]: {
    element: <ErrorTemplate errorCode={404} />,
    permissions: [EPermission.AUTH_NOT_REQUIRED],
  },
};
