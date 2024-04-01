import { useAuth, useLocation } from "../hooks";
import { LoadingPage } from "../pages";
import { appendToRoot } from "../utils";
import { ERoutes, routes } from "./routes.config";

export class Router {
  public init() {
    const { registerAuthListener, checkAuth } = useAuth();
    const { registerNewListener, pathname } = useLocation();

    const renderLogin = () => appendToRoot(routes[ERoutes.LOGIN].component.render().element);
    appendToRoot(LoadingPage.render().element);
    checkAuth();
    registerAuthListener(({ isAuthorized }) => {
      LoadingPage.remove();
      const renderTree = (pathname: string) => {
        const routerConfig = Object.entries(routes);
        routerConfig.forEach(([_, data]) => {
          return data.component.remove();
        });
        if (routerConfig.some(([path]) => path === pathname)) {
          return routerConfig.forEach(([path, data]) => {
            if (path === pathname) {
              if (data.protected && !isAuthorized) {
                return renderLogin();
              }
              return appendToRoot(data.component.render().element);
            }
          });
        }
        if (!isAuthorized) {
          return renderLogin();
        }
        appendToRoot(routes[ERoutes.ANY].component.render().element);
      };

      renderTree(pathname);

      registerNewListener(({ pathname }) => {
        console.log(pathname);
        renderTree(pathname);
      });
    });
  }
}
