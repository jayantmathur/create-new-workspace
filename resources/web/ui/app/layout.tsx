import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";
import clsx from "clsx";
import Providers from "./providers";
import { rhd } from "@/config/fonts";

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
    <html lang="en" className="dark">
      <body className={rhd.className}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div
            className={clsx(
              "prose dark:prose-invert max-w-none min-h-screen p-4 antialiased"
            )}
          >
            {children}
          </div>
        </Providers>
        {/* <Analytics /> */}
        {/* <footer className="w-full flex items-center justify-center py-3"></footer> */}
      </body>
    </html>
  );
}
