"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Tabs defaultValue="dark" onValueChange={toggleTheme}>
      <TabsList>
        {themes.map(({ name, icon }) => (
          <TabsTrigger key={name} value={name} className="flex gap-2">
            {icon}
            <div className="capitalize hidden sm:inline">{name} Mode</div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default Component;
