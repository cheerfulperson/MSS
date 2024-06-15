import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContainer } from "unstated-next";

import { useAuthContext } from "./authContext";
import { useUserProfileQuery } from "data_layer/queries/useUserProfileQuery";
import { AppRoutes } from "config/router";
import { useHomeQuery } from "data_layer/queries/useHomeQuery";
import { useFloorsQuery } from "data_layer/queries/useFloorsQuery";

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
  const { floors, isLoading: isFloorsLoading } = useFloorsQuery(homeId || "");

  const firstFloor = floors[0]?.id;
  const [floorId, setFloorId] = useState<string | null>(firstFloor);

  const changeHome = useCallback(
    (newHomeId: string) => {
      if (newHomeId === homeId) return navigate(AppRoutes.dashboard.get(newHomeId));
      localStorage.setItem(storageId, newHomeId);
      setHomeId(newHomeId);
      navigate(AppRoutes.dashboard.get(newHomeId));
    },
    [homeId, navigate]
  );

  const changeFloor = useCallback((id: string) => {
    setFloorId(id);
  }, []);

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

  useEffect(() => {
    setFloorId((floorId) => (floorId ? floorId : firstFloor));
  }, [firstFloor]);

  return {
    availableHomes,
    changeFloor,
    changeHome,
    floors,
    floor: floors.find((f) => f.id === floorId),
    home,
    homeId,
    isFloorsLoading,
    isLoading: isUserProfileLoading || isLoading,
  };
};

const HomeContainer = createContainer(useHome);

export const useHomeContext = HomeContainer.useContainer;
export const HomeProvider = HomeContainer.Provider;
