import { ReactElement, Suspense } from "react";
import { Route, Routes as ReactRoutes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout as AppLayoutDefault } from "layouts/AppLayout/index";
import { HOCs } from "hocs";
import { withUserProfile } from "hocs/withUserProfile";
import { TRoutes } from "types/router";
import { useAuthContext } from "context/authContext";
import { UserRoles } from "types/user";
import { AppRoutes } from "config/router";
import { EmptyLayout } from "layouts/EmptyLayout";
import { AuthLayout } from "layouts/AuthLayout";
import { AppLoader } from "components/AppLoader";
import { ErrorTemplate } from "src/views/common/ErrorTemplate";
import { userRoutes } from "./userRoutes";
import { guestRoutes } from "./guestRoutes";
import { authRoutes } from "./authRoutes";
import { commonRoutes } from "./commonRoutes";
import styles from "./Router.module.scss";

const AppLayout = HOCs(AppLayoutDefault, withUserProfile);

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
  const { isAuthorized, isLoading, session } = useAuthContext();
  return (
    <>
      <main className={styles.main}>
        <Suspense
          fallback={
            <EmptyLayout>
              <AppLoader />
            </EmptyLayout>
          }
        >
          <ReactRoutes>
            {session.role === UserRoles.OWNER && (
              <Route element={<AppLayout />} path="/">
                {recursiveNestedRoutesReducer(userRoutes)}
                {recursiveNestedRoutesReducer(commonRoutes)}
              </Route>
            )}
            {session.role === UserRoles.GUEST && (
              <Route element={<AppLayout />} path="/">
                {recursiveNestedRoutesReducer(guestRoutes)}
                {recursiveNestedRoutesReducer(commonRoutes)}
              </Route>
            )}
            {!isAuthorized && !isLoading && (
              <Route element={<Navigate replace to={AppRoutes.auth.logIn} />} path={AppRoutes.pageNotFound} />
            )}
            <Route element={<AuthLayout />} path={AppRoutes.auth.url}>
              {recursiveNestedRoutesReducer(authRoutes)}
            </Route>
            <Route
              element={<EmptyLayout>{isLoading ? <AppLoader /> : <ErrorTemplate errorCode={404} />}</EmptyLayout>}
              path={AppRoutes.pageNotFound}
            />
          </ReactRoutes>
        </Suspense>
      </main>
      <Toaster />
    </>
  );
};
