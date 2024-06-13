import { resources } from "./config";

// import the original type declarations
import "react-i18next";

type TResources = (typeof resources)["en"] | (typeof resources)["ru"];

// react-i18next versions higher than 11.11.0
declare module "react-i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    resources: TResources;
  }
}

declare module "i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    resources: TResources;
  }
}
