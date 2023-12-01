"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProviderProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const Provider = ({ children, themeProps }: ProviderProps) => (
  <NextThemeProvider
    attribute="class"
    enableSystem={false}
    enableColorScheme
    disableTransitionOnChange
    {...themeProps}
  >
    {children}
  </NextThemeProvider>
);

export default Provider;
