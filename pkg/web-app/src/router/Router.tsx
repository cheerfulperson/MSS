import { ReactElement } from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoute } from "./ProtectedRoute";
import { routes, TRoutes } from "./router.config";
import { AppLayout } from "layouts/AppLayout/index";
import styles from "./Router.module.scss";

const recursiveNestedRoutesReducer = (routes: TRoutes) => {
  return Object.keys(routes).reduce((acc, key) => {
    const nestedRoutes = routes[key].nestedRoutes;
    if (nestedRoutes) {
      return [
        ...acc,
        <Route
          element={<ProtectedRoute permissions={routes[key].permissions}>{routes[key].element}</ProtectedRoute>}
          key={key}
          path={key}
        >
          {recursiveNestedRoutesReducer(nestedRoutes)}
        </Route>,
      ];
    }
    return [
      ...acc,
      <Route
        element={<ProtectedRoute permissions={routes[key].permissions}>{routes[key].element}</ProtectedRoute>}
        key={key}
        path={key}
      />,
    ];
  }, [] as ReactElement[]);
};

export const Routes = (): ReactElement => {
  return (
    <>
      <main className={styles.main}>
        <ReactRoutes>
          <Route element={<AppLayout />} path="/">
            {recursiveNestedRoutesReducer(routes).map((route) => route)}
          </Route>
        </ReactRoutes>
      </main>
      <Toaster />
    </>
  );
};
