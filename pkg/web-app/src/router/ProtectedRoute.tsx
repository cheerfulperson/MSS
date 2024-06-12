import { ReactElement } from "react";

import { EPermission } from "config/router";
import { useAuthContext } from "context/authContext";
import { ErrorTemplate } from "components/ErrorTemplate";
import { UserRoles } from "types/user";
import { EmptyLayout } from "layouts/EmptyLayout";
import { AppLoader } from "components/AppLoader";

interface IProtectedRoutesProps {
  children: ReactElement;
  permissions: Array<EPermission>;
}
/**
 *
 * @see https://auth0.github.io/auth0-react/modules.html#withAuthenticationRequired
 */

export const ProtectedRoute = ({ children, permissions }: IProtectedRoutesProps): ReactElement | null => {
  const { isAuthorized, isLoading, session } = useAuthContext();

  if (permissions.includes(EPermission.AUTH_NOT_REQUIRED)) {
    return children;
  }

  if (isLoading) {
    return (
      <EmptyLayout>
        <AppLoader />
      </EmptyLayout>
    );
  }

  if (isAuthorized && permissions.includes(EPermission.AUTH_LOGIN)) {
    return <ErrorTemplate errorCode={404} />;
  }

  if (!isAuthorized && (permissions.includes(EPermission.AUTH_GUEST) || permissions.includes(EPermission.AUTH_OWNER))) {
    return <ErrorTemplate errorCode={404} />;
  }

  if (isAuthorized && permissions.includes(EPermission.AUTH_OWNER) && session.role !== UserRoles.OWNER) {
    return <ErrorTemplate errorCode={404} />;
  }

  return children;
};
