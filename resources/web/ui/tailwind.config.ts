import type { Config } from "tailwindcss";

const themeCommons = {
  secondary: "#5b21b6",
  accent: "#fef08a",
  neutral: "#6b7280",
  info: "#67e8f9",
  success: "#15803d",
  warning: "#f97316",
  error: "#dc2626",
};

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#ffffff",
          "base-100": "#1f1f1f",
          ...themeCommons,
        },
        light: {
          primary: "#1f1f1f",
          "base-100": "#ffffff",
          ...themeCommons,
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: "var(--rhd), var(--rhm), sans-serif",
    },
  },
  // darkMode: "class",
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
export default config;
