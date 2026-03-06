"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  agentName: string;
  onViewCertificate: () => void;
}

export function HatchCelebration({ agentName, onViewCertificate }: Props) {
  const [phase, setPhase] = useState<"shake" | "crack" | "hatch" | "reveal">("shake");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("crack"), 1500),
      setTimeout(() => setPhase("hatch"), 3000),
      setTimeout(() => {
        setPhase("reveal");
        fireConfetti();
      }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  async function fireConfetti() {
    try {
      const confetti = (await import("canvas-confetti")).default;
      // First burst
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      // Side bursts
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      }, 300);
      // Big finale
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ["#00ffcc", "#38bdf8", "#ff6b6b", "#fbbf24"] });
      }, 800);
    } catch {
      // confetti not available, no big deal
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
      <div className="text-center px-8 max-w-lg">
        {/* Shaking egg */}
        {phase === "shake" && (
          <div className="animate-shake">
            <svg viewBox="0 0 200 260" width="200" height="260" className="mx-auto">
              <ellipse cx="100" cy="140" rx="68" ry="90" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="2.5" />
              <g stroke="#8b7355" strokeWidth="2" fill="none">
                <polyline points="100,52 98,62 102,68 96,78 100,85 92,95 88,108" />
                <polyline points="118,58 122,68 116,78" />
                <polyline points="55,120 62,128 58,138 65,150" />
                <polyline points="148,115 142,125 146,135 138,148" />
                <polyline points="62,128 78,132 90,125 105,130 120,124 138,130" />
              </g>
            </svg>
            <p className="mt-4 text-xl text-cyan-300 animate-pulse">Something&apos;s happening...</p>
          </div>
        )}

        {/* Cracking open */}
        {phase === "crack" && (
          <div className="animate-pulse">
            <svg viewBox="0 0 200 260" width="200" height="260" className="mx-auto">
              <ellipse cx="100" cy="145" rx="75" ry="85" fill="#00ffcc" opacity="0.3" filter="url(#glow)" />
              <defs><filter id="glow"><feGaussianBlur stdDeviation="15" /></filter></defs>
              {/* Top half lifting */}
              <path d="M 40,130 Q 50,50 100,45 Q 150,50 160,130" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="2" transform="translate(0,-15) rotate(-5,100,130)" />
              {/* Bottom half */}
              <path d="M 35,130 Q 35,230 100,235 Q 165,230 165,130" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="2" />
              {/* Eyes peeking */}
              <circle cx="85" cy="115" r="8" fill="#1a1a2e" />
              <circle cx="115" cy="115" r="8" fill="#1a1a2e" />
              <circle cx="85" cy="113" r="4" fill="#00ffcc" />
              <circle cx="115" cy="113" r="4" fill="#00ffcc" />
            </svg>
            <p className="mt-4 text-xl text-cyan-300">It&apos;s breaking through! 🔥</p>
          </div>
        )}

        {/* Hatching */}
        {phase === "hatch" && (
          <div>
            <svg viewBox="0 0 240 260" width="240" height="260" className="mx-auto animate-bounce-slow">
              {/* Shell pieces scattered */}
              <path d="M 30,180 L 50,160 L 45,190 Z" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="1" transform="rotate(-20,40,175)" opacity="0.7" />
              <path d="M 190,175 L 210,155 L 205,185 Z" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="1" transform="rotate(15,200,170)" opacity="0.7" />
              <path d="M 80,200 L 95,185 L 100,205 Z" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="1" opacity="0.5" />
              <path d="M 150,195 L 165,180 L 160,200 Z" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="1" opacity="0.5" />
              {/* Bottom shell */}
              <path d="M 70,190 Q 70,240 120,245 Q 170,240 170,190" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="2" />
              {/* Baby lobster! */}
              <ellipse cx="120" cy="155" rx="35" ry="40" fill="#ff6b6b" />
              <ellipse cx="120" cy="165" rx="30" ry="25" fill="#ff4444" />
              {/* Eyes */}
              <circle cx="108" cy="140" r="10" fill="white" />
              <circle cx="132" cy="140" r="10" fill="white" />
              <circle cx="110" cy="138" r="5" fill="#1a1a2e" />
              <circle cx="134" cy="138" r="5" fill="#1a1a2e" />
              <circle cx="111" cy="136" r="2" fill="white" />
              <circle cx="135" cy="136" r="2" fill="white" />
              {/* Happy mouth */}
              <path d="M 112,155 Q 120,165 128,155" fill="none" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
              {/* Claws */}
              <ellipse cx="80" cy="160" rx="12" ry="8" fill="#ff6b6b" transform="rotate(-30,80,160)" />
              <ellipse cx="160" cy="160" rx="12" ry="8" fill="#ff6b6b" transform="rotate(30,160,160)" />
              {/* Antennae */}
              <line x1="105" y1="125" x2="90" y2="105" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
              <line x1="135" y1="125" x2="150" y2="105" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
              <circle cx="90" cy="105" r="3" fill="#ff4444" />
              <circle cx="150" cy="105" r="3" fill="#ff4444" />
            </svg>
            <p className="mt-4 text-2xl text-cyan-300 font-bold">Almost there...</p>
          </div>
        )}

        {/* Final reveal */}
        {phase === "reveal" && (
          <div className="animate-fade-in">
            <svg viewBox="0 0 240 220" width="240" height="220" className="mx-auto">
              {/* Glow */}
              <ellipse cx="120" cy="120" rx="90" ry="90" fill="#00ffcc" opacity="0.15" filter="url(#glow2)" />
              <defs><filter id="glow2"><feGaussianBlur stdDeviation="20" /></filter></defs>
              {/* Baby lobster - bigger */}
              <ellipse cx="120" cy="115" rx="45" ry="50" fill="#ff6b6b" />
              <ellipse cx="120" cy="128" rx="38" ry="32" fill="#ff4444" />
              {/* Eyes */}
              <circle cx="105" cy="98" r="13" fill="white" />
              <circle cx="135" cy="98" r="13" fill="white" />
              <circle cx="107" cy="96" r="6.5" fill="#1a1a2e" />
              <circle cx="137" cy="96" r="6.5" fill="#1a1a2e" />
              <circle cx="109" cy="93" r="2.5" fill="white" />
              <circle cx="139" cy="93" r="2.5" fill="white" />
              {/* Big smile */}
              <path d="M 107,118 Q 120,132 133,118" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
              {/* Claws raised in celebration */}
              <ellipse cx="65" cy="105" rx="15" ry="10" fill="#ff6b6b" transform="rotate(-45,65,105)" />
              <ellipse cx="175" cy="105" rx="15" ry="10" fill="#ff6b6b" transform="rotate(45,175,105)" />
              {/* Antennae */}
              <line x1="100" y1="78" x2="80" y2="55" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="140" y1="78" x2="160" y2="55" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="80" cy="55" r="4" fill="#ff4444" />
              <circle cx="160" cy="55" r="4" fill="#ff4444" />
              {/* Little tail */}
              <path d="M 120,160 Q 125,175 120,185 Q 115,195 120,200" fill="none" stroke="#ff4444" strokeWidth="3" strokeLinecap="round" />
              {/* Stars around */}
              <text x="45" y="70" fontSize="16" className="animate-spin-slow">✨</text>
              <text x="185" y="75" fontSize="14" className="animate-spin-slow">⭐</text>
              <text x="55" y="175" fontSize="12" className="animate-spin-slow">✨</text>
              <text x="180" y="165" fontSize="14" className="animate-spin-slow">⭐</text>
            </svg>

            <h1 className="mt-6 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-green-300 to-amber-300">
              🎉 IT HATCHED! 🎉
            </h1>
            <p className="mt-2 text-lg text-slate-300">
              Meet your agent, <span className="font-bold text-cyan-300">{agentName || "your new companion"}</span>!
            </p>
            <p className="mt-1 text-sm text-slate-500">
              You went from zero to a fully operational AI agent. That&apos;s incredible.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={onViewCertificate}
                className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-slate-900 transition-transform hover:scale-105"
              >
                🏆 View My Certificate
              </button>
              <button
                onClick={() => {
                  const text = `🦞 I just hatched my own AI agent with @OpenClaw!\n\n12 quests completed. From zero to a fully autonomous agent running 24/7.\n\nStart your journey → https://openclaw.ai`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-300"
              >
                Share on 𝕏
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-8px) rotate(-3deg); }
          20% { transform: translateX(8px) rotate(3deg); }
          30% { transform: translateX(-6px) rotate(-2deg); }
          40% { transform: translateX(6px) rotate(2deg); }
          50% { transform: translateX(-4px) rotate(-1deg); }
          60% { transform: translateX(4px) rotate(1deg); }
          70% { transform: translateX(-2px) rotate(0deg); }
          80% { transform: translateX(2px) rotate(0deg); }
        }
        .animate-shake { animation: shake 0.8s ease-in-out infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 1s ease-in-out infinite; }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes spin-slow {
          from { opacity: 0.5; }
          50% { opacity: 1; }
          to { opacity: 0.5; }
        }
        .animate-spin-slow { animation: spin-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
