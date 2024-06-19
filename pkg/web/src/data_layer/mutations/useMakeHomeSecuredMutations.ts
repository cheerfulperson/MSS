import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useMutation } from "data_layer/hooks/useMutation";
import { MakeHomeSecuredBody, MakeHomeSecuredResponse } from "types/api";
import toast from "react-hot-toast";

export const useMakeHomeSecuredMutations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["toast"]);
  const { isPending, mutate } = useMutation<MakeHomeSecuredResponse, MakeHomeSecuredBody>("home/secured", {
    retry: false,
  });

  const makeSecured = useCallback(
    (body: MakeHomeSecuredBody) => {
      mutate(body, {
        onSuccess(data) {
          toast.success(t(data.home.secured ? "toast:home_secured" : "toast:home_unsecured"), {
            position: "bottom-center",
          });
          queryClient.setQueriesData(
            {
              queryKey: [`home/${body.id}`],
            },
            (prev) => {
              if (!prev) {
                return prev;
              }

              return {
                ...prev,
                secured: data.home.secured,
              };
            }
          );
        },
      });
    },
    [mutate, queryClient, t]
  );

  return {
    makeSecured,
    isLoading: isPending,
  };
};
