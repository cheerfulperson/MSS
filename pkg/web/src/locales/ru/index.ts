import localeRu from "dayjs/locale/ru";

import app_layout from "./app_layout.json";
import common from "./common.json";
import date from "./date.json";
import enums from './enums.json';
import form from "./forms.json";
import toast from "./toast.json";

export const ru = {
  app_layout,
  common,
  date,
  enums,
  form,
  toast,
};

export const dayjsRuLocale: typeof localeRu = {
  ...localeRu,
};
