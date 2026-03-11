import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/app/components/web3-provider";
import { AudioPlayer } from "@/app/components/audio-player";
import { DiscordHelp } from "@/app/components/discord-help";

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
  title: "Learn OpenClaw Course - Hatch Your AI Agent",
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
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-S69KMKWBGX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-S69KMKWBGX');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '161559441193871');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=161559441193871&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
        {children}
        </Web3Provider>
        <DiscordHelp />
        <footer className="no-print border-t border-slate-800 bg-slate-950 py-6 text-sm text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <a href="https://learnopenclaw.ai" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">LearnOpenClaw.ai</a>
              <span className="hidden sm:inline">•</span>
              <a href="http://twitter.com/hatchopenclaw" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">Follow us on 𝕏</a>
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
