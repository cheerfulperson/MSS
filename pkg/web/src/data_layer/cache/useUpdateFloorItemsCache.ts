import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { GetFloorItemsResponse, UpdateDeviceValueResponse } from "types/api";

export const useUpdateFloorItemsCache = ({ floorId, homeId }: { floorId: string; homeId: string }) => {
  const queryClient = useQueryClient();

  const updateFloorItemsCache = useCallback(
    (floorItem: UpdateDeviceValueResponse["updatedValue"]) => {
      queryClient.setQueriesData<GetFloorItemsResponse>(
        {
          queryKey: [`home/${homeId}/floor/${floorId}/items`],
        },
        (oldData) => {
          if (!oldData) return oldData;
          const floorItems = oldData.floorItems.map((item) => {
            if (item.Device?.id === floorItem.Device.id) {
              return {
                ...item,
                Device: {
                  ...item.Device!,
                  DeviceValues: [
                    { ...item.Device!.DeviceValues[0]!, value: floorItem.value, treatLevel: floorItem.treatLevel },
                  ],
                },
              };
            }

            return item;
          });

          return {
            ...oldData,
            floorItems,
          };
        }
      );
    },
    [floorId, homeId, queryClient]
  );

  const updateFloorItemsManyCache = useCallback(
    (newFloorItems: UpdateDeviceValueResponse["updatedValue"][]) => {
      queryClient.setQueriesData<GetFloorItemsResponse>(
        {
          queryKey: [`home/${homeId}/floor/${floorId}/items`],
        },
        (oldData) => {
          if (!oldData) return oldData;
          const floorItems = oldData.floorItems.map((item) => {
            const updatedValue = newFloorItems.find((v) => v.Device.id === item.Device?.id);
            if (updatedValue) {
              return {
                ...item,
                Device: {
                  ...item.Device!,
                  DeviceValues: [
                    {
                      ...item.Device!.DeviceValues[0]!,
                      value: updatedValue.value,
                      treatLevel: updatedValue.treatLevel,
                    },
                  ],
                },
              };
            }

            return item;
          });

          return {
            ...oldData,
            floorItems,
          };
        }
      );
    },
    [floorId, homeId, queryClient]
  );

  return {
    updateFloorItemsCache,
    updateFloorItemsManyCache,
  };
};
