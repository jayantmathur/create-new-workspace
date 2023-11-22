"use client";

import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const Providers = ({ children, themeProps }: ProvidersProps) => (
  <ThemeProvider
    attribute="class"
    enableSystem={false}
    enableColorScheme
    disableTransitionOnChange
    {...themeProps}
  >
    {children}
  </ThemeProvider>
);

export default Providers;
