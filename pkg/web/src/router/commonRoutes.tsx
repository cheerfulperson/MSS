import { AppRoutes, EPermission } from "config/router";
import { Overview } from "src/views/common/Overview";
import { TRoutes } from "types/router";

export const commonRoutes: TRoutes = {
  [AppRoutes.overview]: {
    element: <Overview />,
    permissions: [EPermission.AUTH_OWNER, EPermission.AUTH_GUEST],
  },
};
