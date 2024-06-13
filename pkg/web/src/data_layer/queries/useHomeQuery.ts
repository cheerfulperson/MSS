import { useQuery } from "data_layer/hooks/useQuery";

export const useHomeQuery = (props: { enabled?: boolean; homeId: string }) => {
  const { data, error, isLoading } = useQuery<HomeResponse | undefined>(`home/${props.homeId}`, {
    refetchOnMount: false,
    networkMode: "offlineFirst",
    refetchOnReconnect: false,
    enabled: props?.enabled,
  });

  return { data, error, isLoading };
};

type HomeResponse = {
  address: {
    address1: string;
    address2: string;
    city: string;
    id: string;
    state: string;
    zip: string;
  };
  id: string;
  name: string;
  secured: boolean;
  securedAt: string;
  slug: string;
};
