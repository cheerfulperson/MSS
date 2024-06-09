import dayjs from "dayjs";
import { ItemType } from "antd/es/menu/interface";

import { dayjsRuLocale } from "./ru";

export * from "./en";
export * from "./ru";

export const initDayjsLocales = () => {
  dayjs.locale("ru", dayjsRuLocale);
};

export const languages = [
  {
    key: "en",
    label: "English",
  },
  {
    key: "ru",
    label: "Русский",
  },
];
