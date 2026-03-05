export type Quest = {
  id: number;
  title: string;
  summary: string;
  videoUrl: string;
  blogUrl: string;
  steps: string[];
};

export const QUESTS: Quest[] = [
  {
    id: 1,
    title: "Open the Terminal",
    summary: "SSH into your VPS and confirm OpenClaw can run there.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/open-terminal",
    steps: [
      "Create or locate your VPS instance.",
      "SSH into the machine using your terminal.",
      "Run a simple command like `uname -a` to verify access.",
    ],
  },
  {
    id: 2,
    title: "Give It a Home",
    summary: "Install OpenClaw on your VPS.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/install-openclaw",
    steps: [
      "Install Node.js and required system packages.",
      "Run the OpenClaw installer script.",
      "Verify with `openclaw --version`.",
    ],
  },
  {
    id: 3,
    title: "Choose a Brain",
    summary: "Configure your AI provider and model.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/choose-a-brain",
    steps: [
      "Create an account with a supported model provider.",
      "Generate an API key.",
      "Add provider + model to your OpenClaw config.",
    ],
  },
  {
    id: 4,
    title: "Teach It to Talk",
    summary: "Connect Telegram, Discord, or another messaging channel.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/connect-channel",
    steps: [
      "Create a bot/app in your chosen channel.",
      "Store the token in OpenClaw secrets/config.",
      "Start gateway and confirm channel is active.",
    ],
  },
  {
    id: 5,
    title: "First Conversation",
    summary: "Send at least five messages to your agent.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/first-conversation",
    steps: [
      "Message your bot from the connected channel.",
      "Ask 5 different prompts.",
      "Confirm session history is captured.",
    ],
  },
  {
    id: 6,
    title: "Name Your Agent",
    summary: "Create IDENTITY.md with your agent name and style.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/name-your-agent",
    steps: [
      "Create `IDENTITY.md` in your workspace.",
      "Set your agent name and role.",
      "Restart and verify the agent responds with identity.",
    ],
  },
  {
    id: 7,
    title: "Memory Lane",
    summary: "Add memory scaffolding for continuity.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/memory-lane",
    steps: [
      "Create `MEMORY.md` or `USER.md`.",
      "Add a few durable facts.",
      "Confirm file exists with non-empty content.",
    ],
  },
  {
    id: 8,
    title: "Time Keeper",
    summary: "Schedule your first cron job.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/time-keeper",
    steps: [
      "Create a simple reminder cron job.",
      "Ensure the job is enabled.",
      "List cron jobs to verify persistence.",
    ],
  },
  {
    id: 9,
    title: "Web Explorer",
    summary: "Trigger web_search usage through your agent.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/web-explorer",
    steps: [
      "Ask your agent to research a topic online.",
      "Confirm web results are returned.",
      "Verify tool usage appears in session history.",
    ],
  },
  {
    id: 10,
    title: "The Automator",
    summary: "Run an automatic cron task successfully.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/the-automator",
    steps: [
      "Create a recurring cron task.",
      "Wait for one execution cycle.",
      "Confirm lastStatus is `ok`.",
    ],
  },
  {
    id: 11,
    title: "Skill Collector",
    summary: "Install one non-default skill from ClawHub.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/skill-collector",
    steps: [
      "Browse available skills.",
      "Install one new skill package.",
      "Verify it appears in your skills directory.",
    ],
  },
  {
    id: 12,
    title: "Go Social",
    summary: "Connect X/Twitter credentials.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    blogUrl: "https://resources.learnopenclaw.ai/go-social",
    steps: [
      "Create a Twitter developer app.",
      "Store API credentials securely.",
      "Verify OpenClaw detects Twitter integration.",
    ],
  },
];

export function getQuestById(id: number): Quest | undefined {
  return QUESTS.find((quest) => quest.id === id);
}
