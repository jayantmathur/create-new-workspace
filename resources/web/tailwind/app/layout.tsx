import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";
import Providers, { ThemeToggle } from "./providers";
import { rhd } from "./fonts";

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
    <html data-theme="business">
      <body
        className={`${rhd.className} grid place-items-center min-h-screen p-4 prose max-w-none`}
        data-gr-ext-installed=""
        data-new-gr-c-s-check-loaded="14.1045.0"
      >
        <Providers>
          <ThemeToggle />
          {children}
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
