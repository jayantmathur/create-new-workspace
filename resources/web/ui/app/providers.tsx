"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const Providers = ({ children, themeProps }: ProvidersProps) => (
  <NextThemesProvider enableColorScheme enableSystem={false} {...themeProps}>
    {children}
  </NextThemesProvider>
);

export default Providers;
