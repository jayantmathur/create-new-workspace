import './globals.css';
// import { Analytics } from '@vercel/analytics/react';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
	themeColor: 'black',
	width: 'device-width',
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	userScalable: 'no',
	viewportFit: 'cover'
};

export const metadata: Metadata = {
	title: 'My Next.js App',
	description: 'Created a Next.js with Tailwind CSS and TypeScript',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default'
	},
	formatDetection: {
		telephone: false
	},
	manifest: '/manifest.webmanifest',
	icons: [{ rel: 'shortcut icon', url: '/favicon.ico' }],
	keywords: ['Next.js', 'Tailwind CSS', 'TypeScript']
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<body className="fill-center h-[100svh]">
				{children}
				{/* <Analytics /> */}
			</body>
		</html>
	);
}
