import { UseMutationOptions, useMutation as defaultUseMutation } from "@tanstack/react-query";

import { MutationMethod, MutationVariables } from "config/queryClient";

type UseMutationHookOptions<TMutationFnData = unknown> = Omit<
  UseMutationOptions<TMutationFnData, Error, MutationVariables>,
  "mutationKey"
> & {
  isPublic?: boolean;
  method?: MutationMethod;
};

export const useMutation = <TMutationFnData = unknown, TMutationFnBody extends MutationVariables["body"] = {}>(
  url: string,
  options?: UseMutationHookOptions<TMutationFnData>
) => {
  const {
    mutate: defaultMutate,
    mutateAsync: defaultMutateAsync,
    ...data
  } = defaultUseMutation<TMutationFnData, Error, MutationVariables<TMutationFnBody>>({
    ...options,
  });

  const mutate = (body: TMutationFnBody, opts?: Parameters<typeof defaultMutate>[1]) =>
    defaultMutate({ body, isPublic: options?.isPublic, mutationKey: [url, options?.method || "POST"] }, opts);

  const mutateAsync = (body: TMutationFnBody, opts?: Parameters<typeof defaultMutate>[1]) =>
    defaultMutateAsync({ body, isPublic: options?.isPublic, mutationKey: [url, options?.method || "POST"] }, opts);

  return {
    ...data,
    mutate,
    mutateAsync,
  };
};
