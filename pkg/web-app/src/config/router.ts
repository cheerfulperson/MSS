export enum EPermission {
  AUTH_NOT_REQUIRED = "no_auth",
  AUTH_GUEST = "auth_guest",
  AUTH_OWNER = "auth_owner",
  AUTH_LOGIN = "auth_login",
}

export enum AppRoutes {
  ONBOARDING = "/onboarding",
  LOG_IN = "/log-in",
  SIGN_UP = "/sign-up",
  HOME = "home/:id",
  PAGE_NOT_FOUND = "*",
}
