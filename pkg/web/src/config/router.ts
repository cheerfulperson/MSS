export enum EPermission {
  AUTH_NOT_REQUIRED = "no_auth",
  AUTH_GUEST = "auth_guest",
  AUTH_OWNER = "auth_owner",
  AUTH_LOGIN = "auth_login",
}

export const AppRoutes = {
  algorithm: {
    url: "/algorithm/:algorithmId",
    get: (id: string) => `/algorithm/${id}`,
  },
  algorithms: "/algorithms",
  auth: {
    logIn: "/auth/login",
    logInGuest: "/auth/guest/login",
    signUp: "/auth/signup",
    url: "/auth",
  },
  dashboard: {
    url: "/dashboard/:homeId",
    get: (id: string) => `/dashboard/${id}`,
  },
  device: {
    url: "/device/:deviceId",
    get: (id: string) => `/device/${id}`,
  },
  homeSettings: "/home/settings",
  planeEditor: "/plane-editor",
  devices: "/devices",
  onboarding: "/onboarding",
  overview: "/",
  pageNotFound: "*",
};
