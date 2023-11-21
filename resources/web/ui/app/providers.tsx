"use client";

import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import ThemeSwitch from "./theme-switch";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const Providers = ({ children, themeProps }: ProvidersProps) => {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ThemeSwitch />
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default Providers;
