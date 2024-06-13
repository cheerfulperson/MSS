import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContainer } from "unstated-next";

import { useAuthContext } from "./authContext";
import { useUserProfileQuery } from "data_layer/queries/useUserProfileQuery";
import { AppRoutes } from "config/router";
import { useHomeQuery } from "data_layer/queries/useHomeQuery";

const storageId = "homeId";

const useHome = () => {
  const navigate = useNavigate();
  const { isAuthorized } = useAuthContext();
  const { data, isLoading: isUserProfileLoading } = useUserProfileQuery({ enabled: isAuthorized });
  const availableHomes = data?.Homes || [];

  const storedHomeId = localStorage.getItem(storageId);
  const validHomeId = !!availableHomes.find((h) => h.id === storedHomeId);
  const firstHomeId = availableHomes[0]?.id;
  const initialHomeId = validHomeId ? storedHomeId : firstHomeId;

  const [homeId, setHomeId] = useState<string | null>(initialHomeId);

  const { data: home, isLoading } = useHomeQuery({ enabled: !!homeId && isAuthorized, homeId: homeId || "" });

  const changeHome = useCallback(
    (newHomeId: string) => {
      if (newHomeId === homeId) return navigate(AppRoutes.dashboard.get(newHomeId));
      localStorage.setItem(storageId, newHomeId);
      setHomeId(newHomeId);
      navigate(AppRoutes.dashboard.get(newHomeId));
    },
    [homeId, navigate]
  );

  useEffect(() => {
    if (initialHomeId) {
      setHomeId(initialHomeId);
    }
  }, [initialHomeId]);

  useEffect(() => {
    if (!validHomeId) {
      localStorage.setItem(storageId, firstHomeId);
    }
  }, [validHomeId, firstHomeId]);

  return {
    isLoading: isUserProfileLoading || isLoading,
    availableHomes,
    homeId,
    home,
    changeHome,
  };
};

const HomeContainer = createContainer(useHome);

export const useHomeContext = HomeContainer.useContainer;
export const HomeProvider = HomeContainer.Provider;
