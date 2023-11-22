import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";

import { cn } from "@/lib/utils";
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
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "prose dark:prose-invert max-w-none p-4 flex flex-col justify-between antialiased",
          rhd.className,
        )}
      >
        <Providers themeProps={{ defaultTheme: "dark" }}>
          {children}
          <footer className="fixed z-10 bottom-0 left-0 right-0 p-4 flex flex-row justify-center sm:justify-end">
            <ThemeSwitch />
          </footer>
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
