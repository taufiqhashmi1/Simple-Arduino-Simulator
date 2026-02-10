import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated Metadata for Professional Deployment
export const metadata: Metadata = {
  title: "Arduino Simulator | OSHW Screening",
  description: "Interactive drag-and-drop Arduino simulation built with Next.js, Wokwi, and React DnD.",
  icons: {
    icon: '/favicon.ico',
  },
};

// Ensure proper scaling on mobile devices
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}