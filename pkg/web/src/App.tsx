import { useState } from "react";
import { MutationFunction, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import i18n from "locales/config";
import { initDayjsLocales } from "locales";
import { defaultMutationFn, defaultQueryFn } from "config/queryClient";
import { AuthProvider } from "context/authContext";
import { ThemeProvider } from "context/themeContext";
import { Routes } from "router/Router";
import { HomeProvider } from "context/homeContext";
import { MqttProvider } from "context/mqttContext";

i18n.init();
initDayjsLocales();

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: defaultQueryFn,
          },
          mutations: {
            mutationFn: defaultMutationFn as MutationFunction<unknown, unknown>,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <HomeProvider>
              <MqttProvider>
                <Routes />
              </MqttProvider>
            </HomeProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
