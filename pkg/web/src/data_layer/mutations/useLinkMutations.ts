import { useMutation } from "data_layer/hooks/useMutation";

export const useLinkMutations = () => {
  const { isPending, mutate } = useMutation("home/link/check", {
    retry: false,
  });

  return {
    checkLink: mutate,
    isLoading: isPending,
  };
};
