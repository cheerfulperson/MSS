import { AppRoutes, EPermission } from "config/router";
import { Overview } from "views/Overview";
import { TRoutes } from "types/router";

export const commonRoutes: TRoutes = {
  [AppRoutes.onboarding]: {
    element: <></>,
    permissions: [EPermission.AUTH_OWNER],
  },
  [AppRoutes.overview]: {
    element: <Overview />,
    permissions: [EPermission.AUTH_OWNER, EPermission.AUTH_GUEST],
  },
};
