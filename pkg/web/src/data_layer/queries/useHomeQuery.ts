import { useQuery } from "data_layer/hooks/useQuery";
import { GetHomeResponse } from "types/api";

export const useHomeQuery = (props: { enabled?: boolean; homeId: string }) => {
  const { data, error, isLoading } = useQuery<GetHomeResponse | undefined>(`home/${props.homeId}`, {
    refetchOnMount: false,
    networkMode: "offlineFirst",
    refetchOnReconnect: false,
    enabled: props?.enabled,
  });

  return { data, error, isLoading };
};
