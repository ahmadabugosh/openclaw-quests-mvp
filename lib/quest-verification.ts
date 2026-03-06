export type VerificationConfig = {
  challenge: string;
  instruction: string;
  command?: string;
  placeholder: string;
  validate: (input: string) => { valid: boolean; message: string };
};

export const QUEST_VERIFICATIONS: Record<number, VerificationConfig> = {
  1: {
    challenge: "Run this command in your terminal and paste the output below:",
    instruction: "This proves your terminal is working correctly.",
    command: 'echo "openclaw-ready-$(date +%Y)"',
    placeholder: "e.g. openclaw-ready-2026",
    validate: (input) => {
      const trimmed = input.trim().toLowerCase();
      if (trimmed.startsWith("openclaw-ready-")) {
        return { valid: true, message: "Terminal is working! 🎉" };
      }
      return { valid: false, message: "That doesn't look right. Make sure you run the exact command and paste the full output." };
    },
  },

  2: {
    challenge: "Run this command on your VPS and paste the output:",
    instruction: "This proves you're connected to a remote server.",
    command: "whoami && hostname",
    placeholder: "e.g. root\nmy-server-name",
    validate: (input) => {
      const trimmed = input.trim().toLowerCase();
      if (trimmed.includes("root") || trimmed.includes("ubuntu") || trimmed.includes("admin")) {
        return { valid: true, message: "You're in! Connected to your VPS 🏠" };
      }
      // Even if not root, if they have 2 lines it's likely valid
      const lines = trimmed.split("\n").filter((l) => l.length > 0);
      if (lines.length >= 2) {
        return { valid: true, message: "You're in! Connected to your VPS 🏠" };
      }
      return { valid: false, message: "Paste the full output of 'whoami && hostname' — it should show your username and server name on two lines." };
    },
  },

  3: {
    challenge: "Paste the first 8 characters of your OpenRouter API key AND your Telegram bot username:",
    instruction: "We just check the format — your full key stays secret!",
    placeholder: "e.g. sk-or-v1 @MyClawBot",
    validate: (input) => {
      const trimmed = input.trim();
      const hasKey = /sk-or-v1/i.test(trimmed) || /sk-/i.test(trimmed);
      const hasBot = /@\w+bot/i.test(trimmed) || /bot/i.test(trimmed);
      if (hasKey && hasBot) {
        return { valid: true, message: "Both keys ready! You're prepped 🔑" };
      }
      if (hasKey && !hasBot) {
        return { valid: false, message: "Got your API key prefix! Now also paste your Telegram bot username (the one ending in 'bot')." };
      }
      if (!hasKey && hasBot) {
        return { valid: false, message: "Got your bot username! Now also paste the first 8 characters of your OpenRouter key (starts with sk-or-v1)." };
      }
      return { valid: false, message: "Paste the first 8 chars of your OpenRouter key (like sk-or-v1) and your Telegram bot username (like @MyClawBot)." };
    },
  },

  4: {
    challenge: "Run this on your VPS and paste the output:",
    instruction: "This proves OpenClaw is installed on your server.",
    command: "openclaw --version",
    placeholder: "e.g. openclaw/0.42.0",
    validate: (input) => {
      const trimmed = input.trim().toLowerCase();
      if (trimmed.includes("openclaw") || /\d+\.\d+\.\d+/.test(trimmed)) {
        return { valid: true, message: "OpenClaw is installed! 🐣" };
      }
      return { valid: false, message: "That doesn't look like an OpenClaw version. Run 'openclaw --version' and paste the full output." };
    },
  },

  5: {
    challenge: "Run this on your VPS and paste the output showing Telegram is connected:",
    instruction: "This proves your agent is online and talking.",
    command: "openclaw status",
    placeholder: "Paste the status output...",
    validate: (input) => {
      const trimmed = input.trim().toLowerCase();
      if (trimmed.includes("telegram") || trimmed.includes("connected") || trimmed.includes("channel") || trimmed.includes("online")) {
        return { valid: true, message: "Your agent is online and talking! 💬" };
      }
      if (trimmed.includes("openclaw") || trimmed.includes("gateway") || trimmed.includes("running")) {
        return { valid: true, message: "Gateway is running! 💬" };
      }
      return { valid: false, message: "Paste the output of 'openclaw status' — it should show your Telegram channel as connected." };
    },
  },

  6: {
    challenge: "Copy your agent's very first reply to you and paste it here:",
    instruction: "This proves you had a real conversation with your agent!",
    placeholder: "Paste your agent's first message...",
    validate: (input) => {
      const trimmed = input.trim();
      if (trimmed.length > 20) {
        return { valid: true, message: "First conversation complete! Your agent is alive 🎉" };
      }
      return { valid: false, message: "Paste your agent's full reply — it should be at least a sentence or two." };
    },
  },

  7: {
    challenge: "Ask your agent 'What is your name?' and paste its reply:",
    instruction: "This proves your agent has an identity and is reading its memory files.",
    placeholder: "e.g. My name is Nova! I'm your AI assistant...",
    validate: (input) => {
      const trimmed = input.trim();
      if (trimmed.length > 10) {
        return { valid: true, message: "Your agent knows who it is! Memory is working 🧠" };
      }
      return { valid: false, message: "Paste your agent's reply when you ask 'What is your name?'" };
    },
  },

  8: {
    challenge: "Ask your agent 'List my cron jobs' and paste the reply showing at least one job:",
    instruction: "This proves you have a working automation set up.",
    placeholder: "e.g. You have 1 cron job: Daily motivation quote at 9am...",
    validate: (input) => {
      const trimmed = input.trim().toLowerCase();
      if (trimmed.includes("cron") || trimmed.includes("job") || trimmed.includes("schedule") || trimmed.includes("every") || trimmed.includes("daily") || trimmed.includes("hour") || trimmed.length > 30) {
        return { valid: true, message: "Automation is running! You're on autopilot 🤖" };
      }
      return { valid: false, message: "Paste your agent's reply when you ask it to list cron jobs. It should mention at least one scheduled task." };
    },
  },

  9: {
    challenge: "Ask your agent to search the web for something and paste a snippet of the results:",
    instruction: "This proves web search and skills are working.",
    placeholder: "e.g. Here are the top results for AI news...",
    validate: (input) => {
      const trimmed = input.trim();
      if (trimmed.length > 30) {
        return { valid: true, message: "Web search is working! Skills unlocked 🔍" };
      }
      return { valid: false, message: "Paste a snippet of your agent's web search results — should be at least a paragraph." };
    },
  },

  10: {
    challenge: "Paste your Twitter/X app name (from the developer portal):",
    instruction: "This proves you've created a developer app for your agent.",
    placeholder: "e.g. My OpenClaw Bot",
    validate: (input) => {
      const trimmed = input.trim();
      if (trimmed.length >= 3) {
        return { valid: true, message: "Social media connected! Your agent can tweet 🐦" };
      }
      return { valid: false, message: "Paste the name of the Twitter/X app you created in the developer portal." };
    },
  },

  11: {
    challenge: "SSH into your server (without typing a password) and paste the output of:",
    instruction: "If this works without a password prompt, your SSH keys are set up correctly!",
    command: "echo \"ssh-key-verified-$(whoami)\"",
    placeholder: "e.g. ssh-key-verified-root",
    validate: (input) => {
      const trimmed = input.trim().toLowerCase();
      if (trimmed.includes("ssh-key-verified")) {
        return { valid: true, message: "SSH keys working! Your server is secure 🔒" };
      }
      return { valid: false, message: "Run the command after SSH'ing in without a password. It should output 'ssh-key-verified-root'." };
    },
  },

  12: {
    challenge: "Paste the URL you see in your browser when viewing the OpenClaw dashboard:",
    instruction: "This proves the dashboard is running and accessible from your machine.",
    placeholder: "e.g. http://localhost:3000",
    validate: (input) => {
      const trimmed = input.trim().toLowerCase();
      if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1") || trimmed.includes("0.0.0.0")) {
        return { valid: true, message: "Mission Control is online! You're fully operational 🚀🦞" };
      }
      return { valid: false, message: "Paste the URL from your browser's address bar when viewing the dashboard (should be something like http://localhost:3000)." };
    },
  },
};
