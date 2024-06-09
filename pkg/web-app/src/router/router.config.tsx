import { ReactElement } from "react";

import { ErrorTemplate } from "components/ErrorTemplate";
import { AppRoutes, EPermission } from "config/router";
import { Onboarding } from "views/Onboarding";
import { Home } from "views/Home";

export interface IRoute {
  element: ReactElement;
  nestedRoutes?: Record<string, IRoute>;
  permissions: Array<EPermission>;
}

export type TRoutes = Record<string, IRoute>;

export const routes: TRoutes = {
  [AppRoutes.ONBOARDING]: {
    element: <Onboarding />,
    permissions: [EPermission.AUTH_OWNER],
  },
  [AppRoutes.HOME]: {
    element: <Home />,
    permissions: [EPermission.AUTH_OWNER, EPermission.AUTH_GUEST],
  },
  [AppRoutes.PAGE_NOT_FOUND]: {
    element: <ErrorTemplate errorCode={404} />,
    permissions: [EPermission.AUTH_NOT_REQUIRED],
  },
};
