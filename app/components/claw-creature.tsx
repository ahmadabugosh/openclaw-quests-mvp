import type { CreatureTraits } from "@/lib/creature";

type ClawCreatureProps = {
  traits: CreatureTraits;
  className?: string;
};

export function ClawCreature({ traits, className }: ClawCreatureProps) {
  const eyeY = 72 + traits.eyeStyle * 2;
  const stripeOffset = traits.pattern * 8;

  return (
    <svg viewBox="0 0 240 240" role="img" aria-label="Your hatched OpenClaw creature" className={className}>
      <defs>
        <linearGradient id="shell-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="120" r="108" fill="#020617" />
      <ellipse cx="120" cy="138" rx="76" ry="62" fill={traits.baseColor} />
      <ellipse cx="120" cy="126" rx="62" ry="46" fill="url(#shell-glow)" />

      <path d={`M70 ${112 + stripeOffset % 14} Q120 88 170 ${112 + stripeOffset % 14}`} stroke="#0f172a" strokeOpacity="0.35" strokeWidth="5" fill="none" />
      <path d={`M76 ${130 + stripeOffset % 10} Q120 104 164 ${130 + stripeOffset % 10}`} stroke="#0f172a" strokeOpacity="0.25" strokeWidth="4" fill="none" />

      <circle cx="96" cy={eyeY} r="8" fill="#020617" />
      <circle cx="144" cy={eyeY} r="8" fill="#020617" />
      <circle cx="99" cy={eyeY - 2} r="2" fill="#f8fafc" />
      <circle cx="147" cy={eyeY - 2} r="2" fill="#f8fafc" />

      {traits.expression === "smile" && <path d="M96 156 Q120 174 144 156" stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />}
      {traits.expression === "focused" && <path d="M96 160 L144 160" stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />}
      {traits.expression === "grin" && <path d="M94 156 Q120 184 146 156" stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />}
      {traits.expression === "calm" && <path d="M102 162 Q120 168 138 162" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />}

      {traits.accessory === "clock" && (
        <g transform="translate(164 64)">
          <circle r="16" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2="-8" stroke="#334155" strokeWidth="2" />
          <line x1="0" y1="0" x2="6" y2="0" stroke="#334155" strokeWidth="2" />
        </g>
      )}
      {traits.accessory === "magnifying-glass" && (
        <g transform="translate(165 66)">
          <circle r="11" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          <line x1="8" y1="8" x2="18" y2="18" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {traits.accessory === "chat-bubble" && (
        <path d="M154 58 h34 a8 8 0 0 1 8 8 v14 a8 8 0 0 1-8 8 h-12 l-8 8 v-8 h-14 a8 8 0 0 1-8-8 v-14 a8 8 0 0 1 8-8z" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
      )}
      {traits.accessory === "spark" && (
        <path d="M174 52 l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
      )}
    </svg>
  );
}
