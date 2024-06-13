import { useMutation } from "../hooks/useMutation";
import { UserUnionRoles } from "types/user";

export const useAuthMutations = () => {
  const { isPending: isLoginProcessing, mutate: login } = useMutation<AuthLoginResponse, AuthLoginBody>("auth/login", {
    isPublic: true,
  });
  const { isPending: isSignupProcessing, mutate: signup } = useMutation<AuthSignupResponse, AuthSignupBody>(
    "auth/signup",
    {
      isPublic: true,
    }
  );
  const { isPending: isGuestLoginProcessing, mutate: loginGuest } = useMutation<
    AuthLoginGuestResponse,
    AuthLoginGuestBody
  >("auth/guest/signup", {
    isPublic: true,
  });
  const { isPending: isLogoutProcessing, mutate: logout } = useMutation<AuthLogoutResponse, AuthLogoutBody>(
    "auth/logout"
  );
  const { isPending: isRefreshing, mutate: refresh } = useMutation<AuthRefreshResponse, AuthRefreshBody>(
    "auth/refresh"
  );

  return {
    isGuestLoginProcessing,
    isLoginProcessing,
    isLogoutProcessing,
    isRefreshing,
    isSignupProcessing,
    login,
    loginGuest,
    logout,
    refresh,
    signup,
  };
};

export interface AuthLoginBody {
  email: string;
  password: string;
}
export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  role: UserUnionRoles;
}

export interface AuthLogoutBody {}
export interface AuthLogoutResponse {}

export interface AuthRefreshBody {
  refreshToken: string;
}
export interface AuthRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthLoginGuestBody {
  homeSlug?: string;
  name: string;
  password?: string;
  token?: string;
}
export interface AuthLoginGuestResponse {
  accessToken: string;
  refreshToken: string;
  role: UserUnionRoles;
}

export interface AuthSignupBody {
  email: string;
  name: string;
  password: string;
}
export interface AuthSignupResponse {
  accessToken: string;
  refreshToken: string;
  role: UserUnionRoles;
}
