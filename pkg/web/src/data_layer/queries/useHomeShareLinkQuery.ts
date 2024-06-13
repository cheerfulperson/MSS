import { useQuery } from "data_layer/hooks/useQuery";

export const useHomeShareLinkQuery = (homeId?: string) => {
  const { data, isLoading } = useQuery<LinkResponse>(`home/${homeId}/link`, { enabled: !!homeId });

  return {
    link: data?.link,
    isLoading,
  };
};

interface LinkResponse {
  link: string;
}
