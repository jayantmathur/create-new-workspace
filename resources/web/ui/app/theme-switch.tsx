"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const themes = [
  {
    name: "light",
    icon: <SunIcon className="w-4" />,
  },
  {
    name: "dark",
    icon: <MoonIcon className="w-4" />,
  },
];

const Component = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
    setTheme("dark");
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <Tabs
      radius="full"
      variant="solid"
      aria-label="Tabs radius"
      selectedKey={theme}
      onSelectionChange={toggleTheme}
    >
      {themes.map((item) => (
        <Tab
          key={item.name}
          title={
            <div className="flex items-center space-x-2">
              {item.icon}
              <span className="capitalize hidden sm:inline">
                {item.name} Mode
              </span>
            </div>
          }
        />
      ))}
    </Tabs>
  );
};

export default Component;
