import { MutateFunction, QueryFunction } from "@tanstack/react-query";
import axios from "axios";

import { authToken } from "context/authContext";
import type { AuthRefreshBody } from "data_layer/mutations/useAuthMutations";
import { env } from "./env";

// Define a default query function that will receive the query key
export const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const [url, params, isPublic] = queryKey;
  if (typeof url === "string" && (!params || (!!params && typeof params === "object"))) {
    const { data } = await axios.get(`${env.API_URL}${url[0] === "/" ? url : `/${url}`}`, {
      params,
      headers:
        authToken && !isPublic
          ? {
              Authorization: `Bearer ${authToken}`,
            }
          : {},
    });
    return data;
  }
  throw new Error("Invalid QueryKey");
};

export type MutationMethod = "POST" | "PUT" | "DELETE" | "PATCH";
export type MutationVariables<Body extends Record<string, string | boolean | number | null | undefined | object> = {}> =
  {
    body: Body;
    isPublic?: boolean;
    /** [url, body, method] */
    mutationKey: [string, MutationMethod];
  };

// Define a default query function that will receive the query key
export const defaultMutationFn: MutateFunction<unknown, Error, MutationVariables, unknown> = async ({
  body,
  isPublic,
  mutationKey,
}) => {
  const [url, method = "POST"] = mutationKey;
  if (
    typeof url === "string" &&
    !!body &&
    typeof body === "object" &&
    (method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH")
  ) {
    const refreshToken = url.includes("auth/refresh") ? (body as AuthRefreshBody).refreshToken : undefined;
    const { data } = await axios[method.toLowerCase() as Lowercase<MutationMethod>](
      `${env.API_URL}${url[0] === "/" ? url : `/${url}`}`,
      body,
      {
        headers:
          authToken && !isPublic
            ? {
                Authorization: `Bearer ${refreshToken || authToken}`,
              }
            : {},
      }
    );
    return data;
  }
  throw new Error("Invalid MutationKey");
};
