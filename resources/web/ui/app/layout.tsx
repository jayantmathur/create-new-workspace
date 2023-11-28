import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { rhd } from "@/config/fonts";
import Providers from "./providers";
import ThemeSwitch from "./theme-switch";
import Navbar from "@/components/navbar";
// import Title from "@/components/title";

export const metadata: Metadata = {
  title: "My Next.js Website",
  description: "A next.js website created with Tailwind CSS and TypeScript.",
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
  const hfclass =
    "fixed z-40 w-full grid grid-flow-col place-items-start bg-background p-2";

  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "prose dark:prose-invert max-w-none w-full min-h-screen antialiased",
          rhd.className,
        )}
      >
        <Providers themeProps={{ defaultTheme: "dark" }}>
          <header className={cn(hfclass, "top-0 place-content-between")}>
            {/* <Title /> */}
            <ThemeSwitch />
          </header>
          <main className="px-4 py-20">{children}</main>
          <footer className={cn(hfclass, "bottom-0")}>
            <Navbar className="place-self-center" />
          </footer>
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
