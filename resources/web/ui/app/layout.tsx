import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";

import {cn} from "@/lib/utils";
import { rhd } from "@/config/fonts";
import Providers from "./providers";
import ThemeSwitch from "./theme-switch";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Created a Next.js with Tailwind CSS and TypeScript",
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon-1024.png",
    apple: "/icons/favicon-1024.png",
  },
  manifest: "/manifest.webmanifest",
  keywords: ["Next.js", "Tailwind CSS", "TypeScript"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }}>
      <body className={rhd.className}>
        <Providers themeProps={{ defaultTheme: "dark" }}>
          <div
            className={cn(
              "prose dark:prose-invert max-w-none flex min-h-screen flex-col justify-between p-4 antialiased"
            )}
          >
            {children}
            <footer className="grid place-items-center sm:place-items-end">
              <ThemeSwitch />
            </footer>
          </div>
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
