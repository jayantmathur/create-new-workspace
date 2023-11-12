"use client";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

type Themes = {
  light: string;
  dark: string;
};

const defaultThemes: Themes = {
  light: "corporate",
  dark: "business",
};

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    enableSystem={false}
    defaultTheme={defaultThemes.dark}
    themes={[defaultThemes.light, defaultThemes.dark]}
  >
    {children}
  </ThemeProvider>
);

const ThemeToggle = () => {
  const { light, dark } = defaultThemes;
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === dark ? light : dark);

  const styles = `btn-sm btn-circle border-none absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 grid place-items-center p-2`;

  useEffect(() => {
    setTheme(dark);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <button className={styles} onClick={toggleTheme}>
      {theme === dark ? (
        <SunIcon className="text-yellow-400" />
      ) : (
        <MoonIcon className="text-gray-200" />
      )}
    </button>
  );
};

export default Providers;
export { defaultThemes, ThemeToggle };
