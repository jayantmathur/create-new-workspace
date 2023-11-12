"use client";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";


type Themes = {
  light?: string;
  dark?: string;
};

const defaultThemes: Themes = {
  light: "corporate",
  dark: "business",
};

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme={defaultThemes.dark} themes={[defaultThemes.light, defaultThemes.dark]}>{children}</ThemeProvider>
);


const ThemeToggle = ({ light = defaultThemes.light, dark = defaultThemes.dark }: Themes) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(resolvedTheme === dark ? light : dark);

  const styles = `btn-xs btn-circle border-none absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 grid place-items-center`;

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button className={styles} onClick={toggleTheme} >
      {resolvedTheme === dark ? (
        <SunIcon className="text-orange-400" />
      ) : (
        <MoonIcon className="text-gray-200" />
      )}
    </button>
  );
};

export default Providers;
export { defaultThemes, ThemeToggle };
