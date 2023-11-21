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
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  daisyui: {
    themes: [
      {
        dark: {
          "base-100": "#1f1f1f",
          primary: "#ffffff",
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
      fontFamily: "var(--rhd), var(--rhm),sans-serif",
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
export default config;
