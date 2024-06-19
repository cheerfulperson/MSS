import { Navigate } from "react-router-dom";

import { AppLoader } from "components/AppLoader";
import { AppRoutes } from "config/router";
import { useHomeContext } from "context/homeContext";
import { EmptyLayout } from "layouts/EmptyLayout";

export const Overview = () => {
  const { availableHomes, homeId, isLoading } = useHomeContext();

  if (isLoading) {
    return (
      <EmptyLayout>
        <AppLoader />
      </EmptyLayout>
    );
  }

  if (!availableHomes.length || !homeId) {
    return <Navigate to={AppRoutes.onboarding} />;
  }

  return <Navigate to={AppRoutes.dashboard.get(homeId)} />;
};
