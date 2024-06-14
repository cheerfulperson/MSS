import { AppRoutes, EPermission } from "config/router";
import { TRoutes } from "types/router";
import { ErrorTemplate } from "views/common/ErrorTemplate";
import { Dashboard } from "views/common/Dashboard/Dashboard";

export const guestRoutes: TRoutes = {
  [AppRoutes.dashboard.url]: {
    element: <Dashboard />,
    permissions: [EPermission.AUTH_OWNER, EPermission.AUTH_GUEST],
  },
  [AppRoutes.pageNotFound]: {
    element: <ErrorTemplate errorCode={404} />,
    permissions: [EPermission.AUTH_NOT_REQUIRED],
  },
};
