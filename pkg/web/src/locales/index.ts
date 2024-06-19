import dayjs from "dayjs";

import { dayjsRuLocale } from "./ru";

export * from "./en";
export * from "./ru";
export * from "./be";

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
  {
    key: "be",
    label: "Беларуская мова",
  }
];
