import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export const useCopyToClipboard = () => {
  const { t } = useTranslation(["toast"]);
  const copy = useCallback(
    async (value: string) => {
      if (!navigator.clipboard) {
        return;
      }
      await navigator.clipboard.writeText(value);
      toast.success(t("toast:copied_to_clipboard"));
    },
    [t]
  );

  return {
    copy,
  };
};
