"use client";

/**
 * Cracking Egg SVG — 13 stages (0 = pristine, 12 = fully hatched).
 * Each completed quest adds more cracks and glow.
 */
export function CrackingEgg({ stage }: { stage: number }) {
  const s = Math.max(0, Math.min(stage, 12));
  const glowOpacity = Math.min(s * 0.07, 0.8);
  const glowColor = s >= 10 ? "#00ffcc" : "#38bdf8";
  const wobble = s >= 3 && s < 12;

  return (
    <div className={`relative inline-block ${wobble ? "animate-wobble" : ""}`}>
      <svg viewBox="0 0 200 260" width="180" height="234" xmlns="http://www.w3.org/2000/svg">
        {/* Inner glow */}
        {s > 0 && (
          <ellipse cx="100" cy="145" rx={55 + s * 2} ry={75 + s * 2} fill={glowColor} opacity={glowOpacity} filter="url(#blur)" />
        )}
        <defs>
          <filter id="blur"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>

        {/* Egg shell */}
        <ellipse cx="100" cy="140" rx="68" ry="90" fill="#e8dcc8" stroke="#c4b89c" strokeWidth="2.5" />

        {/* Speckles */}
        <circle cx="75" cy="110" r="3" fill="#d4c8a8" opacity="0.6" />
        <circle cx="120" cy="100" r="2.5" fill="#d4c8a8" opacity="0.5" />
        <circle cx="90" cy="170" r="2" fill="#d4c8a8" opacity="0.5" />
        <circle cx="115" cy="155" r="3.5" fill="#d4c8a8" opacity="0.4" />

        {/* Crack lines — progressively revealed */}
        <g stroke="#8b7355" strokeWidth="1.8" fill="none" strokeLinecap="round">
          {/* Stage 1: tiny top crack */}
          {s >= 1 && <polyline points="100,52 98,62 102,68" />}

          {/* Stage 2: crack extends down */}
          {s >= 2 && <polyline points="102,68 96,78 100,85" />}

          {/* Stage 3: second crack from top-right */}
          {s >= 3 && <polyline points="118,58 122,68 116,78" />}

          {/* Stage 4: left side crack appears */}
          {s >= 4 && <polyline points="55,120 62,128 58,138" />}

          {/* Stage 5: right side crack */}
          {s >= 5 && <polyline points="148,115 142,125 146,135" />}

          {/* Stage 6: top crack branches */}
          {s >= 6 && <polyline points="100,85 92,95 88,108" />}
          {s >= 6 && <polyline points="100,85 108,92 114,105" />}

          {/* Stage 7: lower left crack */}
          {s >= 7 && <polyline points="58,138 65,150 60,162" />}

          {/* Stage 8: lower right crack */}
          {s >= 8 && <polyline points="146,135 138,148 142,160" />}

          {/* Stage 9: big zigzag across middle */}
          {s >= 9 && <polyline points="62,128 78,132 90,125 105,130 120,124 138,130" />}

          {/* Stage 10: crack web intensifies */}
          {s >= 10 && <polyline points="88,108 80,118 75,130" />}
          {s >= 10 && <polyline points="114,105 125,115 130,128" />}

          {/* Stage 11: shell fragments separating */}
          {s >= 11 && <polyline points="60,162 68,175 62,188" />}
          {s >= 11 && <polyline points="142,160 135,172 140,185" />}
          {s >= 11 && <polyline points="90,125 85,140 90,155" />}

          {/* Stage 12: fully cracked open — top separating */}
          {s >= 12 && (
            <>
              <polyline points="75,95 70,85 65,78" strokeWidth="2.5" />
              <polyline points="125,95 130,85 135,78" strokeWidth="2.5" />
              <polyline points="80,70 75,60 78,50" strokeWidth="2.5" />
              <polyline points="120,70 125,60 122,50" strokeWidth="2.5" />
            </>
          )}
        </g>

        {/* At stage 12: claw peeking through */}
        {s >= 12 && (
          <g>
            <circle cx="92" cy="90" r="6" fill="#1a1a2e" />
            <circle cx="112" cy="90" r="6" fill="#1a1a2e" />
            <circle cx="92" cy="88" r="3" fill="#00ffcc" />
            <circle cx="112" cy="88" r="3" fill="#00ffcc" />
            <ellipse cx="102" cy="98" rx="4" ry="2" fill="#ff6b6b" />
          </g>
        )}
      </svg>

      {/* Stage label */}
      <div className="mt-2 text-center text-sm text-slate-400">
        {s === 0 && "Pristine egg 🥚"}
        {s >= 1 && s <= 3 && "First cracks appearing..."}
        {s >= 4 && s <= 6 && "Cracks spreading! 🔍"}
        {s >= 7 && s <= 9 && "Something's moving inside... 👀"}
        {s >= 10 && s <= 11 && "Almost ready to hatch! ✨"}
        {s >= 12 && "🦞 HATCHING! 🦞"}
      </div>

      <style jsx>{`
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        .animate-wobble {
          animation: wobble 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
