import "./globals.css";
// import { Analytics } from '@vercel/analytics/react';
import { Metadata } from "next";
import Theme, { ThemeToggle } from "./(theme)";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Created a Next.js with Tailwind CSS and TypeScript",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    <html className="dark" style={{ colorScheme: "dark" }}>
      <body className="fill-center h-[100svh] dark:text-gray-200">
        <Theme>
          <ThemeToggle />
          {children}
        </Theme>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
