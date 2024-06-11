import { useFetch } from "./useFetch";

interface IConfig {
  ssid?: string | null;
  homeSlug?: string | null;
}

interface IListenerParams {
  isAuthorized: boolean;
  config: IConfig;
}

export const useAuth = () => {
  const session = sessionStorage.getItem("config");
  let isAuthorized = sessionStorage.getItem("isAuthorized") === "true";
  let config: IConfig = session ? JSON.parse(session) : {};
  let objListener: (params: IListenerParams) => void = () => {};

  const { request } = useFetch();

  const authObj = {
    isAuthorized,
    config,
    registerAuthListener(cb: (params: IListenerParams) => void) {
      objListener = cb;
    },
    checkAuth(onDone?: (isAuth: boolean) => void) {
      request<IConfig>({ type: "get", path: "config" }).then((value) => {
        config = value;
        isAuthorized = !!value.ssid;
        objListener({ config, isAuthorized: !!value.ssid });
        sessionStorage.setItem("config", JSON.stringify(value));
        sessionStorage.setItem("isAuthorized", `${isAuthorized}`);
        if (onDone) {
          onDone(isAuthorized);
        }
      });
    },
  };

  return authObj;
};
