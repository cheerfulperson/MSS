import { DefinedInitialDataOptions, QueryKey, useQuery as defaultUseQuery } from "@tanstack/react-query";

type DefaultQueryKey = [string, Record<string, string | boolean | number | null | undefined> | undefined];

type UseQueryOptions<TQueryFnData = unknown, TQueryKey extends QueryKey = DefaultQueryKey> = Omit<
  DefinedInitialDataOptions<TQueryFnData, Error, TQueryFnData, TQueryKey>,
  "queryKey" | "initialData"
> & { initialData?: TQueryFnData };

export const useQuery = <TQueryFnData = unknown, TQueryKey extends QueryKey = DefaultQueryKey>(
  key: DefaultQueryKey | string,
  options: UseQueryOptions<TQueryFnData, TQueryKey> & { isPublic?: boolean } = {
    initialData: undefined,
  }
) => {
  const data = defaultUseQuery<TQueryFnData, Error, TQueryFnData, TQueryKey>({
    queryKey: [...(typeof key === "string" ? [key, undefined] : key), options.isPublic] as unknown as TQueryKey,
    ...options,
  });
  return data;
};
