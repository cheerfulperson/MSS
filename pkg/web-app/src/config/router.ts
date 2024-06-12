export enum EPermission {
  AUTH_NOT_REQUIRED = "no_auth",
  AUTH_GUEST = "auth_guest",
  AUTH_OWNER = "auth_owner",
  AUTH_LOGIN = "auth_login",
}

export const AppRoutes = {
  auth: {
    logIn: "/auth/log-in",
    logInGuest: "/auth/guest/log-in",
    signUp: "/auth/sign-up",
    url: "/auth",
  },
  dashboard: {
    url: "/dashboard/:id",
    get: (id: string) => `/dashboard/${id}`,
  },
  onboarding: "/onboarding",
  pageNotFound: "*",
};
