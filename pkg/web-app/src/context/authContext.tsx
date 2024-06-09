import { useState } from "react";
import { createContainer } from "unstated-next";

import { UserUnionRoles } from "types/user";

export let authToken: string | undefined = undefined;

interface AuthState {
  accessToken?: string;
  isAuthorized: boolean;
  isLoading: boolean;
  role?: UserUnionRoles;
}

const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthorized: true,
    isLoading: false,
  });

  const setRefreshToken = () => {};

  const refreshToken = () => {};

  return {
    ...state,
    setRefreshToken,
    refreshToken,
  };
};

const AuthContainer = createContainer(useAuth);

export const useAuthContext = AuthContainer.useContainer;
export const AuthProvider = AuthContainer.Provider;
