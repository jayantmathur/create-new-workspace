"use client";
import { ThemeProvider, useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi2";

const Provider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class">{children}</ThemeProvider>
);

const Button = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggleTheme}
      className="btn border-none absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-200"
    >
      {resolvedTheme === "dark" ? (
        <HiSun className=" text-orange-300" />
      ) : (
        <HiMoon />
      )}
    </button>
  );
};

export default Provider;
export { Button };
