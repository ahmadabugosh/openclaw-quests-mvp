import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/app/components/web3-provider";
import { AudioPlayer } from "@/app/components/audio-player";

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
        <Web3Provider>
        {children}
        </Web3Provider>
        <footer className="no-print border-t border-slate-800 bg-slate-950 py-6 text-sm text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <a href="https://learnopenclaw.ai" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">LearnOpenClaw.ai</a>
              <span className="hidden sm:inline">•</span>
              <a href="https://x.com/LearnOpenClaw" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">Follow us on 𝕏</a>
              <span className="hidden sm:inline">•</span>
              <span>Built by <a href="https://x.com/aabugosh" target="_blank" rel="noreferrer" className="text-amber-400/70 hover:text-amber-300 transition-colors">@aabugosh</a></span>
            </div>
            <AudioPlayer />
          </div>
        </footer>
      </body>
    </html>
  );
}
