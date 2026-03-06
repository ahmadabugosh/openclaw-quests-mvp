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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carefree-cooperation-production-787e.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OpenClaw Quests — Hatch your AI agent",
  description: "Complete 12 real OpenClaw setup quests, hatch your AI agent, and earn a verified on-chain credential on Base.",
  openGraph: {
    title: "OpenClaw Quests — Hatch your AI agent 🦞",
    description: "Complete 12 quests. Hatch your AI agent. Earn a verified on-chain credential on Base.",
    url: siteUrl,
    siteName: "OpenClaw Quests",
    type: "website",
    images: [
      {
        url: "/api/og?name=OpenClaw+Operator",
        width: 1200,
        height: 630,
        alt: "OpenClaw Quests Certificate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenClaw Quests — Hatch your AI agent 🦞",
    description: "12 quests. Hatch your agent. Earn a verified on-chain credential.",
    images: ["/api/og?name=OpenClaw+Operator"],
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
