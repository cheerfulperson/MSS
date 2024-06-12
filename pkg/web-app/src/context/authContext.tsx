import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createContainer } from "unstated-next";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import * as jwt from "jwt-decode";

import { UserUnionRoles } from "types/user";
import { AuthCookies } from "config/auth";
import { isJwtExpired } from "utils/isJwtExpired";
import { AuthLoginBody, useAuthMutations } from "data_layer/mutations/useAuthMutations";
import { AppRoutes } from "config/router";

export let authToken: string | undefined = Cookies.get(AuthCookies.ACCESS_TOKEN);

interface AuthState {
  accessToken?: string;
  expiredAt?: number;
  isAuthorized: boolean;
  isLoading: boolean;
  refreshToken?: string;
  role?: UserUnionRoles;
}

const worker = new Worker(new URL("./refreshTokenWorker.js", import.meta.url));

const useAuth = () => {
  const {
    isLoginProcessing,
    isLogoutProcessing,
    isRefreshing,
    login: makeLogin,
    logout: makeLogout,
    refresh,
  } = useAuthMutations();
  const navigate = useNavigate();
  const workerRef = useRef<Parameters<(typeof worker)["addEventListener"]>[1]>();
  const cookiesData = useMemo(() => {
    return {
      accessToken: Cookies.get(AuthCookies.ACCESS_TOKEN),
      refreshToken: Cookies.get(AuthCookies.REFRESH_TOKEN),
      role: Cookies.get(AuthCookies.ROLE),
    };
  }, []);

  const [state, setState] = useState<AuthState>({
    isAuthorized: false,
    isLoading: true,
    accessToken: cookiesData.accessToken,
    refreshToken: cookiesData.refreshToken,
    role: cookiesData.role as UserUnionRoles,
  });

  const logout = useCallback(() => {
    makeLogout(
      {},
      {
        onSettled: () => {
          Cookies.remove(AuthCookies.REFRESH_TOKEN);
          Cookies.remove(AuthCookies.ACCESS_TOKEN);
          Cookies.remove(AuthCookies.ROLE);
          setState(() => ({
            isAuthorized: false,
            isLoading: false,
          }));
          if (workerRef.current) {
            worker.removeEventListener("message", workerRef.current);
          }
          navigate(AppRoutes.auth.logIn);
        },
      }
    );
  }, [makeLogout, navigate]);

  const refreshToken = useCallback(() => {
    if (state.refreshToken && !isRefreshing) {
      refresh(
        { refreshToken: state.refreshToken },
        {
          onSuccess: (data) => {
            authToken = data.accessToken;
            Cookies.set(AuthCookies.REFRESH_TOKEN, data.refreshToken);
            Cookies.set(AuthCookies.ACCESS_TOKEN, data.accessToken);
            setState((prev) => ({
              ...prev,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              isAuthorized: true,
            }));
          },
          onError: () => {
            logout();
            setState(() => ({
              isAuthorized: false,
              isLoading: false,
            }));
          },
        }
      );
    }
  }, [isRefreshing, logout, refresh, state.refreshToken]);

  const login = useCallback(
    (payload: AuthLoginBody, cbs?: Parameters<typeof makeLogin>[1]) => {
      makeLogin(payload, {
        ...cbs,
        onSuccess: (data, ...args) => {
          authToken = data.accessToken;
          Cookies.set(AuthCookies.REFRESH_TOKEN, data.refreshToken);
          Cookies.set(AuthCookies.ROLE, data.role);
          Cookies.set(AuthCookies.ACCESS_TOKEN, data.accessToken);
          setState((prev) => ({
            ...prev,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthorized: true,
            role: data.role,
          }));
          cbs?.onSuccess?.(data, ...args);
        },
      });
    },
    [makeLogin]
  );

  useEffect(() => {
    if (state.accessToken) {
      authToken = state.accessToken;
      const expireAt = jwt.jwtDecode(state.accessToken).exp! * 1000;
      if (isJwtExpired(expireAt)) {
        return refreshToken();
      }
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthorized: true,
      }));
      if (workerRef.current) {
        worker.removeEventListener("message", workerRef.current);
      }
      workerRef.current = async (e: Event) => {
        const event = e as MessageEvent;
        if (event.data) {
          refreshToken();
        }
      };
      worker.postMessage({ expireAt });
      worker.addEventListener("message", workerRef.current);
    } else {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.accessToken]);

  return {
    session: state,
    isLoading: state.isLoading,
    isAuthorized: state.isAuthorized,
    isLoginProcessing,
    isLogoutProcessing,
    login,
    logout,
  };
};

const AuthContainer = createContainer(useAuth);

export const useAuthContext = AuthContainer.useContainer;
export const AuthProvider = AuthContainer.Provider;
