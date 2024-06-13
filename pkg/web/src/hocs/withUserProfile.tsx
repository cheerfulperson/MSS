import React from "react";

import { useSuspenseQuery } from "data_layer/hooks/useSuspenseQuery";

export const withUserProfile = <Props extends object = {}>(Component: React.ComponentType<Props>) => {
  const WithUserProfile: React.FC<Props> = (props) => {
    useSuspenseQuery("user/profile", { retry: false, refetchOnMount: false, refetchOnReconnect: false });
    return <Component {...props} />;
  };

  return WithUserProfile;
};
