import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  daisyui: {
    themes: ["business", "corporate"],
  },
  theme: {
    extend: {
      fontFamily: "var(--rdh), sans-serif",
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
export default config;
