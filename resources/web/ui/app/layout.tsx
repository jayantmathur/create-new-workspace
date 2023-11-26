import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { rhd } from "@/config/fonts";
import Providers from "./providers";
import ThemeSwitch from "./theme-switch";
import Navbar from "@/components/navbar";

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
          "prose dark:prose-invert max-w-none min-h-screen antialiased",
          rhd.className,
        )}
      >
        <Providers themeProps={{ defaultTheme: "dark" }}>
          <main className="flex flex-col justify-between p-4">{children}</main>
          <footer className="fixed bottom-0 w-full flex flex-row justify-center gap-8 p-4">
            {/* <Navbar /> */}
            <ThemeSwitch />
          </footer>
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
