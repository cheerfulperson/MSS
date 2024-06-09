import { ConfigProvider, theme as antdThemes } from "antd";
import { ReactNode, createContext, useCallback, useContext, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextResult {
  changeTheme: (theme: Theme) => void;
  theme: Theme;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextResult | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>("light");

  const changeTheme = useCallback((theme: Theme) => {
    setTheme(theme);
  }, []);

  const value: ThemeContextResult = {
    changeTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: theme === "light" ? antdThemes.defaultAlgorithm : antdThemes.darkAlgorithm,
          cssVar: true,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
