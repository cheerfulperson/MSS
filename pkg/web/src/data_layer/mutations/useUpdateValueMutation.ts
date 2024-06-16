import { useCallback } from "react";

import { useMutation } from "data_layer/hooks/useMutation";
import { UpdateDeviceValueBody, UpdateDeviceValueResponse } from "types/api";
import { useUpdateFloorItemsCache } from "data_layer/cache/useUpdateFloorItemsCache";

export const useUpdateValueMutation = (props: { floorId: string; homeId: string }) => {
  const { isPending, mutate } = useMutation<UpdateDeviceValueResponse, UpdateDeviceValueBody>("home/device/update");
  const { updateFloorItemsCache } = useUpdateFloorItemsCache(props);

  const updateValue = useCallback(
    (body: UpdateDeviceValueBody, cbs?: Parameters<typeof mutate>[1]) => {
      mutate(body, {
        ...cbs,
        onSuccess(data, variables, context) {
          updateFloorItemsCache(data.updatedValue);
          cbs?.onSuccess?.(data, variables, context);
        },
      });
    },
    [mutate, updateFloorItemsCache]
  );

  return {
    updateValue,
    isLoading: isPending,
  };
};
