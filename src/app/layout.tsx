import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Instagram Unfollowers Finder",
  description:
    "You can use this tool to find out who isn’t following you back on Instagram.",
  keywords: [
    "istagram unfollowers",
    "instagram tracker",
    "followers assistance",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
    },
  },
  openGraph: {
    title: "Instagram Unfollowers Finder",
    description:
      "You can use this tool to find out who isn’t following you back on Instagram.",
    url: "https://instagram-unfollowers-finder.vercel.app/",
    siteName: "Instagram Unfollowers Finder",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
