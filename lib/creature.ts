export type ChannelType = "telegram" | "discord" | "slack" | "whatsapp" | "unknown";
export type CronType = "time" | "search" | "message" | "other";
export type SoulTone = "cheerful" | "serious" | "playful" | "calm";

export type CreatureTraits = {
  baseColor: string;
  accessory: "clock" | "magnifying-glass" | "chat-bubble" | "spark";
  expression: "smile" | "focused" | "grin" | "calm";
  pattern: number;
  eyeStyle: number;
};

export type CreatureInput = {
  channelType?: string | null;
  firstCronType?: string | null;
  soulTone?: string | null;
  seed?: string;
};

const CHANNEL_COLORS: Record<ChannelType, string> = {
  telegram: "#2AABEE",
  discord: "#5865F2",
  slack: "#4A154B",
  whatsapp: "#25D366",
  unknown: "#14B8A6",
};

const CRON_ACCESSORY: Record<CronType, CreatureTraits["accessory"]> = {
  time: "clock",
  search: "magnifying-glass",
  message: "chat-bubble",
  other: "spark",
};

const SOUL_EXPRESSION: Record<SoulTone, CreatureTraits["expression"]> = {
  cheerful: "smile",
  serious: "focused",
  playful: "grin",
  calm: "calm",
};

export function generateCreature(input: CreatureInput): CreatureTraits {
  const seed = input.seed ?? `${input.channelType ?? ""}:${input.firstCronType ?? ""}:${input.soulTone ?? ""}`;

  return {
    baseColor: CHANNEL_COLORS[toChannelType(input.channelType)],
    accessory: CRON_ACCESSORY[toCronType(input.firstCronType)],
    expression: SOUL_EXPRESSION[toSoulTone(input.soulTone)],
    pattern: seededModulo(seed, 8),
    eyeStyle: seededModulo(`${seed}:eyes`, 5),
  };
}

function toChannelType(value?: string | null): ChannelType {
  if (!value) return "unknown";
  const v = value.toLowerCase();
  if (v.includes("telegram")) return "telegram";
  if (v.includes("discord")) return "discord";
  if (v.includes("slack")) return "slack";
  if (v.includes("whatsapp")) return "whatsapp";
  return "unknown";
}

function toCronType(value?: string | null): CronType {
  if (!value) return "other";
  const v = value.toLowerCase();
  if (v.includes("time") || v.includes("cron") || v.includes("schedule")) return "time";
  if (v.includes("search") || v.includes("web")) return "search";
  if (v.includes("message") || v.includes("chat")) return "message";
  return "other";
}

function toSoulTone(value?: string | null): SoulTone {
  if (!value) return "calm";
  const v = value.toLowerCase();
  if (v.includes("cheer")) return "cheerful";
  if (v.includes("serious")) return "serious";
  if (v.includes("play")) return "playful";
  return "calm";
}

function seededModulo(seed: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % modulo;
}
