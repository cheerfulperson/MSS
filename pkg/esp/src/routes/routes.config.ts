import { LoginPage, MainPage } from "../pages";
import { PageComponent } from "../types";

interface TRouterConfig {
  protected?: boolean;
  component: PageComponent;
}

type TRouter = Record<ERoutes, TRouterConfig>;

export enum ERoutes {
  ANY = "*",
  LOGIN = "/login",
  MAIN = '/',
}

export const routes: TRouter = {
  [ERoutes.LOGIN]: {
    component: LoginPage,
  },
  [ERoutes.ANY]: {
    component: LoginPage,
  },
  [ERoutes.MAIN]: {
    component: MainPage,
  },
};
