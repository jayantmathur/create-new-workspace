"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

import {cn} from "@/lib/utils";

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
    <div role="tablist" className="tabs tabs-boxed">
      {themes.map((item) => (
        <a
          key={item.name}
          role="tab" 
          className={cn("tab", {
            "tab-active": theme === item.name,
          })}
          onClick={toggleTheme}
        >
          <div className="flex items-center space-x-2">
              {item.icon}
              <span className="capitalize hidden sm:inline">
                {item.name} Mode
              </span>
            </div>
        </a>
      ))}
    </div>
  );
};

export default Component;
