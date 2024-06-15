import { useQuery } from "data_layer/hooks/useQuery";
import { GetFloorsResponse } from "types/api";

export const useFloorsQuery = (homeId?: string) => {
  const { data, isLoading } = useQuery<GetFloorsResponse>(`home/${homeId}/floor`, {
    enabled: !!homeId,
    retry: 3,
  });

  return {
    floors: data?.floors || [],
    isLoading,
  };
};
