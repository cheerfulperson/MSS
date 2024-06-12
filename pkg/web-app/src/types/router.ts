import { ReactElement } from "react";

import { EPermission } from "config/router";

export interface IRoute {
  element: ReactElement;
  nestedRoutes?: Record<string, IRoute>;
  permissions: Array<EPermission>;
}

export type TRoutes = Record<string, IRoute>;
