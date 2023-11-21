import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";
import clsx from "clsx";
import Providers, { ThemeToggle } from "./providers";
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
    <html lang="en" className='dark'>
      <body
        className={clsx("grid place-items-center min-h-screen p-4 bg-background font-sans antialiased", rhd.className)}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
        <div className="relative flex flex-col h-screen">
          <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
        {/* <Analytics /> */}
        {/* <footer className="w-full flex items-center justify-center py-3">
                
            </footer> */} 
      </body>
    </html>
  );
}
