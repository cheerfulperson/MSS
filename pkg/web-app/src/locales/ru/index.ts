import localeRu from "dayjs/locale/ru";

import app_layout from "./app_layout.json";
import common from "./common.json";
import date from "./date.json";
import form from "./forms.json";

export const ru = {
  app_layout,
  common,
  date,
  form,
};

export const dayjsRuLocale: typeof localeRu = {
  ...localeRu,
};
