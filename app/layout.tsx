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

const siteUrl = "https://quests.openclaw.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OpenClaw Quests — Hatch your AI agent",
  description: "Complete real OpenClaw setup quests, hatch your agent, and share your Operator Level 1 badge.",
  openGraph: {
    title: "OpenClaw Quests — Hatch your AI agent",
    description: "Complete setup quests, crack the egg, and unlock your shareable hatched creature badge.",
    url: siteUrl,
    siteName: "OpenClaw Quests",
    type: "website",
    images: [
      {
        url: "/file.svg",
        width: 1200,
        height: 630,
        alt: "OpenClaw Quests egg hatching preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenClaw Quests — Hatch your AI agent",
    description: "Complete setup quests and hatch your OpenClaw creature.",
    images: ["/file.svg"],
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
      </body>
    </html>
  );
}
