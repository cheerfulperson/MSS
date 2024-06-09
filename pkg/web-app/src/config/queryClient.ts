import { MutateFunction, QueryFunction } from "@tanstack/react-query";
import axios from "axios";

import { authToken } from "context/authContext";

// Define a default query function that will receive the query key
export const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const [url, params] = queryKey;
  if (typeof url === "string" && (!params || (!!params && typeof params === "object"))) {
    const { data } = await axios.get(`${process.env.API_URL!}${url[0] === "/" ? url : `/${url}`}`, {
      params,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return data;
  }
  throw new Error("Invalid QueryKey");
};

export type MutationMethod = "POST" | "PUT" | "DELETE" | "PATCH";
export type MutationVariables<Body extends Record<string, string | boolean | number | null | undefined | object> = {}> =
  {
    /** [url, body, method] */
    mutationKey: [string, MutationMethod];
    body: Body;
  };

// Define a default query function that will receive the query key
export const defaultMutationFn: MutateFunction<unknown, Error, MutationVariables, unknown> = async ({
  mutationKey,
  body,
}) => {
  const [url, method = "POST"] = mutationKey;
  if (
    typeof url === "string" &&
    !!body &&
    typeof body === "object" &&
    (method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH")
  ) {
    const { data } = await axios[method.toLowerCase() as Lowercase<MutationMethod>](
      `${process.env.API_URL!}${url[0] === "/" ? url : `/${url}`}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return data;
  }
  throw new Error("Invalid MutationKey");
};
