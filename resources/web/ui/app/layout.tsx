import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { rhd } from "@/config/fonts";
import Providers from "./providers";
import ThemeSwitch from "./theme-switch";
import Navbar from "@/components/navbar";
import ContactButton from "@/components/contactme";

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
          <main className="flex flex-col justify-between p-4 mb-[10svh]">
            {children}
          </main>
          <footer className="fixed bottom-0 right-0 left-0 p-4 z-0">
            <div className="relative">
              <Navbar className="absolute bottom-0 left-1/2 -translate-x-1/2" />
              <ContactButton className="absolute bottom-0 right-0" />
              <ThemeSwitch className="fixed top-4 right-4" />
            </div>
          </footer>
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
