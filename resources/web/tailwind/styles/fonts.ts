import { Red_Hat_Display, Red_Hat_Mono } from "next/font/google";

export const rhd = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--rhd",
});

export const rhm = Red_Hat_Mono({
  subsets: ["latin"],
  variable: "--rhm",
});