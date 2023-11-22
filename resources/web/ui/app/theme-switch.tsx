"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div role="tablist" className="tabs tabs-boxed">
      {themes.map((item) => (
        <input
          key={item.name}
          type="radio"
          name={item.name}
          role="tab"
          className="tab capitalize"
          aria-label={`${item.name} Mode`}
          checked={theme === item.name}
          onChange={toggleTheme}
        />
      ))}
    </div>
  );
};

export default Component;
