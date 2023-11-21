"use client";
import { useState, useEffect } from "react";
// import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Component = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Tabs
      radius="full"
      aria-label="Tabs radius"
      selectedKey={theme}
      onSelectionChange={toggleTheme}
    >
      <Tab
        key="light"
        title={
          <div className="flex items-center space-x-2">
            <SunIcon className="w-4" />
            <span>Light Mode</span>
          </div>
        }
      />
      <Tab
        key="dark"
        title={
          <div className="flex items-center space-x-2">
            <span>Dark Mode</span>
            <MoonIcon className="w-4" />
          </div>
        }
      />
    </Tabs>
  );
};

export default Component;
