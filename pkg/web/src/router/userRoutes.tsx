import { ErrorTemplate } from "src/views/ErrorTemplate";
import { AppRoutes, EPermission } from "config/router";
import { TRoutes } from "types/router";

export const userRoutes: TRoutes = {
  [AppRoutes.onboarding]: {
    element: <></>,
    permissions: [EPermission.AUTH_OWNER],
  },
  [AppRoutes.dashboard.url]: {
    element: <></>,
    permissions: [EPermission.AUTH_OWNER, EPermission.AUTH_GUEST],
  },
  [AppRoutes.pageNotFound]: {
    element: <ErrorTemplate errorCode={404} />,
    permissions: [EPermission.AUTH_NOT_REQUIRED],
  },
};
