import { ReactElement } from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "layouts/AppLayout/index";
import { TRoutes } from "types/router";
import { userRoutes } from "./userRoutes";
import { useAuthContext } from "context/authContext";
import { UserRoles } from "types/user";
import styles from "./Router.module.scss";
import { guestRoutes } from "./guestRoutes";
import { AppRoutes } from "config/router";
import { authRoutes } from "./authRoutes";
import { EmptyLayout } from "layouts/EmptyLayout";
import { ErrorTemplate } from "components/ErrorTemplate";

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
  const { session } = useAuthContext();
  return (
    <>
      <main className={styles.main}>
        <ReactRoutes>
          {session.role === UserRoles.OWNER && (
            <Route element={<AppLayout />} path="/">
              {recursiveNestedRoutesReducer(userRoutes)}
            </Route>
          )}
          {session.role === UserRoles.GUEST && (
            <Route element={<AppLayout />} path="/">
              {recursiveNestedRoutesReducer(guestRoutes)}
            </Route>
          )}
          <Route element={<AppLayout />} path={AppRoutes.auth.url}>
            {recursiveNestedRoutesReducer(authRoutes)}
          </Route>
          <Route
            element={
              <EmptyLayout>
                <ErrorTemplate errorCode={404} />
              </EmptyLayout>
            }
            path={AppRoutes.pageNotFound}
          />
        </ReactRoutes>
      </main>
      <Toaster />
    </>
  );
};
