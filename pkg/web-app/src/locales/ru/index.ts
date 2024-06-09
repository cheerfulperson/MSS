import localeRu from "dayjs/locale/ru";
import common from "./common.json";
import date from "./date.json";

export const ru = {
  common,
  date,
};

export const dayjsRuLocale: typeof localeRu = {
  ...localeRu,
};
