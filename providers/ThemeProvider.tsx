import { createContext, useContext, useEffect, useState } from "react";
import { ITheme, darkTheme, lightTheme } from "../lib/config/theme";
import * as SecureStore from "expo-secure-store";

export interface ThemeContextProps {
  theme: ITheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useProvideTheme();
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

function useProvideTheme(): ThemeContextProps {
  const [theme, setTheme] = useState<ITheme>(lightTheme);

  useEffect(() => {
    SecureStore.getItemAsync("theme").then((storedTheme) => {
      if (storedTheme) {
        setTheme(storedTheme === "dark" ? darkTheme : lightTheme);
      }
    });
  }, []);

  const toggleTheme = () => {
    setTheme(theme.mode === "light" ? darkTheme : lightTheme);
    SecureStore.setItemAsync(
      "theme",
      theme.mode === "light" ? "dark" : "light"
    );
  };
  return {
    theme,
    toggleTheme,
  };
}

export function useTheme() {
  return useContext(ThemeContext);
}
