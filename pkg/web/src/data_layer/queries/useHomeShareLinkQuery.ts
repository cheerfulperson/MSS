import { useQuery } from "data_layer/hooks/useQuery";
import { GetHomeLinkResponse } from "types/api";

export const useHomeShareLinkQuery = (homeId?: string) => {
  const { data, isLoading } = useQuery<GetHomeLinkResponse>(`home/${homeId}/link`, { enabled: !!homeId });

  return {
    link: data?.link,
    isLoading,
  };
};
