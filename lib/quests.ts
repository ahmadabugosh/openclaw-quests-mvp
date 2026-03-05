export type GuideStep = {
  title: string;
  description: string;
  command?: string;
  tip?: string;
};

export type Quest = {
  id: number;
  title: string;
  summary: string;
  videoUrl: string;
  blogUrl: string;
  steps: string[];
  guide: GuideStep[];
  helpLinks: { label: string; url: string }[];
};

export const QUESTS: Quest[] = [
  {
    id: 1,
    title: "Open the Terminal",
    summary: "SSH into your VPS for the very first time. This is where your AI agent will live.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/open-terminal",
    steps: ["Get a VPS", "Open your terminal", "SSH into the server"],
    guide: [
      {
        title: "Get a VPS from a cloud provider",
        description: "You need a server for OpenClaw to run on. Any Linux VPS with 2GB+ RAM works. Popular choices: Hetzner ($4/mo), DigitalOcean ($6/mo), or Vultr ($6/mo).",
        tip: "Hetzner has the best price-to-performance. Choose Ubuntu 22.04 or 24.04 as your OS.",
      },
      {
        title: "Find your server's IP address",
        description: "After creating your VPS, the provider will show you an IP address (like 167.235.xx.xx) and a root password. Save both — you'll need them next.",
      },
      {
        title: "Open a terminal on your computer",
        description: "On Mac: open the Terminal app (search 'Terminal' in Spotlight). On Windows: use PowerShell or install Windows Terminal from the Microsoft Store. On Linux: you already know 😉",
      },
      {
        title: "SSH into your server",
        description: "Type this command, replacing the IP with yours. When prompted, type 'yes' to accept the fingerprint, then enter your password.",
        command: "ssh root@YOUR_SERVER_IP",
        tip: "If you see a '$' or '#' prompt — congrats, you're in! You're now controlling a remote server.",
      },
      {
        title: "Verify you're connected",
        description: "Run a quick command to make sure everything works. You should see info about your server's operating system.",
        command: "uname -a && cat /etc/os-release | head -3",
      },
    ],
    helpLinks: [
      { label: "Hetzner VPS signup", url: "https://www.hetzner.com/cloud/" },
      { label: "DigitalOcean VPS signup", url: "https://www.digitalocean.com/" },
      { label: "SSH explained for beginners", url: "https://www.cloudflare.com/learning/access-management/what-is-ssh/" },
    ],
  },
  {
    id: 2,
    title: "Give It a Home",
    summary: "Install OpenClaw on your VPS. One command and your AI agent has a home.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/install-openclaw",
    steps: ["Install Node.js", "Install OpenClaw", "Verify installation"],
    guide: [
      {
        title: "Install Node.js (if not already installed)",
        description: "OpenClaw needs Node.js to run. This command installs Node.js 22 using the official NodeSource setup script.",
        command: "curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs",
        tip: "After installing, verify with: node --version (should show v22.x.x)",
      },
      {
        title: "Install OpenClaw globally",
        description: "This installs the OpenClaw CLI tool so you can run it from anywhere on your server.",
        command: "npm install -g openclaw",
      },
      {
        title: "Initialize your OpenClaw workspace",
        description: "This creates the configuration files and workspace directory where your agent will live.",
        command: "openclaw init",
        tip: "This creates ~/.openclaw/ with your config file and workspace directory.",
      },
      {
        title: "Verify the installation",
        description: "Check that OpenClaw is installed and shows a version number.",
        command: "openclaw --version",
      },
    ],
    helpLinks: [
      { label: "OpenClaw installation docs", url: "https://docs.openclaw.ai/get-started/install" },
      { label: "Node.js downloads", url: "https://nodejs.org/en/download" },
      { label: "OpenClaw GitHub repo", url: "https://github.com/openclaw/openclaw" },
    ],
  },
  {
    id: 3,
    title: "Choose a Brain",
    summary: "Pick an AI model and set up your API keys. This is what makes your agent smart.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/choose-a-brain",
    steps: ["Choose a provider", "Get an API key", "Configure OpenClaw"],
    guide: [
      {
        title: "Choose your AI provider",
        description: "OpenClaw works with many AI providers. The easiest way to start is with OpenRouter — it gives you access to dozens of models (Claude, GPT, Llama, etc.) with one API key.",
        tip: "We recommend starting with OpenRouter + Claude Sonnet. Best balance of smart and affordable.",
      },
      {
        title: "Create an OpenRouter account and get an API key",
        description: "Go to openrouter.ai, create a free account, then go to Keys and create a new API key. Copy it — you'll need it next.",
        command: "# Visit: https://openrouter.ai/keys",
      },
      {
        title: "Add credits to your account",
        description: "OpenRouter is pay-as-you-go. Add $5-10 of credits to get started. Most models cost fractions of a cent per message.",
        tip: "Claude 3.5 Haiku is extremely cheap (~$0.001 per message) and great for most tasks.",
      },
      {
        title: "Configure OpenClaw with your key and model",
        description: "Open your OpenClaw config file and add your provider settings. Set the model and API key.",
        command: "nano ~/.openclaw/openclaw.json\n\n# Add to the config:\n# \"defaultModel\": \"openrouter/anthropic/claude-sonnet-4-5\"\n# Under providers, add your OPENROUTER_API_KEY",
        tip: "You can also use the Anthropic API directly or any OpenAI-compatible provider.",
      },
      {
        title: "Test your configuration",
        description: "Start OpenClaw to make sure it can reach your AI provider.",
        command: "openclaw gateway start",
      },
    ],
    helpLinks: [
      { label: "OpenRouter — get API key", url: "https://openrouter.ai/keys" },
      { label: "Anthropic API", url: "https://console.anthropic.com/" },
      { label: "OpenClaw model configuration", url: "https://docs.openclaw.ai/models/providers" },
      { label: "Model pricing comparison", url: "https://openrouter.ai/models" },
    ],
  },
  {
    id: 4,
    title: "Teach It to Talk",
    summary: "Connect a messaging channel so you can chat with your agent from your phone.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/connect-channel",
    steps: ["Create a Telegram bot", "Add the token to OpenClaw", "Start chatting"],
    guide: [
      {
        title: "Open Telegram and find @BotFather",
        description: "BotFather is Telegram's official tool for creating bots. Search for @BotFather in Telegram and start a chat with it.",
      },
      {
        title: "Create a new bot",
        description: "Send /newbot to BotFather. It'll ask for a display name and username. The username must end in 'bot' (e.g., MyOpenClawBot).",
        command: "/newbot",
        tip: "BotFather will give you a token like 123456:ABC-DEF... — copy this!",
      },
      {
        title: "Add the bot token to OpenClaw config",
        description: "Open your OpenClaw config and add the Telegram channel configuration with your bot token.",
        command: "nano ~/.openclaw/openclaw.json\n\n# Add under \"channels\":\n# \"telegram\": { \"token\": \"YOUR_BOT_TOKEN\" }",
      },
      {
        title: "Restart OpenClaw",
        description: "Restart the gateway to pick up the new Telegram configuration.",
        command: "openclaw gateway restart",
      },
      {
        title: "Message your bot!",
        description: "Find your bot on Telegram by its username and send it a message. If everything's configured, it should reply!",
        tip: "If it doesn't reply, check the logs: openclaw gateway logs",
      },
    ],
    helpLinks: [
      { label: "Telegram bot setup guide", url: "https://docs.openclaw.ai/channels/telegram" },
      { label: "Discord integration (alternative)", url: "https://docs.openclaw.ai/channels/discord" },
      { label: "BotFather", url: "https://t.me/BotFather" },
    ],
  },
  {
    id: 5,
    title: "First Conversation",
    summary: "Have your first real conversation with your AI agent. Send at least 5 messages!",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/first-conversation",
    steps: ["Send messages", "Try different prompts", "Explore capabilities"],
    guide: [
      {
        title: "Say hello!",
        description: "Start simple. Send 'Hey, who are you?' to your bot on Telegram. Your agent will respond based on its default personality.",
      },
      {
        title: "Ask it to do something useful",
        description: "Try: 'Search the web for the latest news about AI agents' or 'What's the weather in Dubai?' — see how it uses its tools.",
        tip: "Your agent has access to web search, file reading/writing, and more — try asking it to do real tasks!",
      },
      {
        title: "Test its memory",
        description: "Tell it something about yourself: 'My name is [your name] and I'm learning OpenClaw.' Then in a later message, ask 'What's my name?' to see if it remembers within the session.",
      },
      {
        title: "Ask it to read a file",
        description: "Your workspace has files the agent can read. Try: 'Read the AGENTS.md file and summarize it for me.'",
        command: "# Message your bot:\n\"Read the AGENTS.md file and tell me what's in it\"",
      },
      {
        title: "Send at least 5 messages total",
        description: "Keep chatting! The more you interact, the more you'll discover what your agent can do. You need at least 5 messages to complete this quest.",
        tip: "Fun prompts to try: 'Write me a haiku about AI' or 'What tools do you have access to?'",
      },
    ],
    helpLinks: [
      { label: "Prompt ideas for OpenClaw", url: "https://resources.learnopenclaw.ai/prompting-openclaw" },
      { label: "How sessions work", url: "https://docs.openclaw.ai/core/sessions" },
    ],
  },
  {
    id: 6,
    title: "Name Your Agent",
    summary: "Give your agent a name and identity. This is where it starts becoming yours.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/name-your-agent",
    steps: ["Create IDENTITY.md", "Choose a name", "Customize personality"],
    guide: [
      {
        title: "Navigate to your workspace",
        description: "OpenClaw stores workspace files that your agent reads on startup. This is where personality files live.",
        command: "cd ~/.openclaw/workspace",
      },
      {
        title: "Create IDENTITY.md",
        description: "This file tells your agent who it is. Create it with your chosen name and personality.",
        command: "cat > IDENTITY.md << 'EOF'\n# My Agent Identity\n\n- **Name:** [Choose a name!]\n- **Vibe:** Friendly and helpful\n- **Emoji:** 🤖\nEOF",
        tip: "Popular names: Atlas, Nova, Sage, Echo, Pixel — or make up your own!",
      },
      {
        title: "Optionally create SOUL.md for deeper personality",
        description: "SOUL.md is where you can define your agent's communication style, values, and tone. It's like writing a character sheet.",
        command: "cat > SOUL.md << 'EOF'\n# Soul\n\nYou are [name], a helpful AI assistant.\nBe direct and friendly. Skip the corporate speak.\nUse emoji when it fits naturally.\nEOF",
      },
      {
        title: "Restart and test",
        description: "Restart your agent and ask it 'What's your name?' — it should respond with the identity you set!",
        command: "openclaw gateway restart",
      },
    ],
    helpLinks: [
      { label: "Identity & personality docs", url: "https://docs.openclaw.ai/core/identity" },
      { label: "SOUL.md examples", url: "https://resources.learnopenclaw.ai/agent-personality-guide" },
    ],
  },
  {
    id: 7,
    title: "Memory Lane",
    summary: "Give your agent long-term memory so it remembers things between sessions.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/memory-lane",
    steps: ["Create memory files", "Add facts", "Test recall"],
    guide: [
      {
        title: "Create MEMORY.md in your workspace",
        description: "MEMORY.md is your agent's long-term memory. Things written here persist across sessions — it's how your agent 'remembers' you.",
        command: "cat > ~/.openclaw/workspace/MEMORY.md << 'EOF'\n# Memory\n\n## About My Human\n- Name: [your name]\n- Timezone: [your timezone]\n- Interests: [what you're working on]\n\n## Key Decisions\n- Started learning OpenClaw on [today's date]\nEOF",
      },
      {
        title: "Create USER.md with info about yourself",
        description: "USER.md is specifically about you — your preferences, communication style, and context your agent should know.",
        command: "cat > ~/.openclaw/workspace/USER.md << 'EOF'\n# About You\n\n- **Name:** [your name]\n- **Timezone:** [e.g., GMT+4]\n- **Style:** I prefer step-by-step explanations\nEOF",
      },
      {
        title: "Create a daily memory directory",
        description: "For daily notes, create a memory directory. Your agent can write daily logs here automatically.",
        command: "mkdir -p ~/.openclaw/workspace/memory",
      },
      {
        title: "Test it",
        description: "Message your agent: 'What do you know about me?' — it should pull info from MEMORY.md and USER.md.",
        tip: "Over time, you can ask your agent to 'remember' things and it'll update these files itself!",
      },
    ],
    helpLinks: [
      { label: "Memory system docs", url: "https://docs.openclaw.ai/core/memory" },
      { label: "Daily notes workflow", url: "https://resources.learnopenclaw.ai/openclaw-memory-workflow" },
    ],
  },
  {
    id: 8,
    title: "Time Keeper",
    summary: "Set up your first cron job — make your agent do things on a schedule!",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/time-keeper",
    steps: ["Understand cron jobs", "Create a reminder", "Verify it exists"],
    guide: [
      {
        title: "What's a cron job?",
        description: "A cron job is a task that runs on a schedule. You can tell your agent to do things like 'every morning at 9am, send me a weather update' or 'every hour, check for new emails.' This is where OpenClaw gets really powerful.",
      },
      {
        title: "Ask your agent to create a cron job",
        description: "The easiest way! Just message your agent with a request like this:",
        command: "# Message your bot:\n\"Set a reminder to send me a motivational quote every day at 9am\"",
        tip: "Your agent will use the cron tool to create this automatically. You don't need to write any code!",
      },
      {
        title: "Verify the job was created",
        description: "Ask your agent to list cron jobs to confirm it was saved.",
        command: "# Message your bot:\n\"Show me my cron jobs\"",
      },
      {
        title: "Understanding the schedule",
        description: "Cron schedules look like '0 9 * * *' which means 'at 9:00 AM every day.' Your agent handles this translation for you — just describe what you want in plain English.",
        tip: "Try: 'Remind me every Friday at 5pm that the weekend has started 🎉'",
      },
    ],
    helpLinks: [
      { label: "Cron scheduler docs", url: "https://docs.openclaw.ai/tools/cron" },
      { label: "Cron expression helper", url: "https://crontab.guru/" },
      { label: "Cron job examples", url: "https://resources.learnopenclaw.ai/openclaw-cron-examples" },
    ],
  },
  {
    id: 9,
    title: "Web Explorer",
    summary: "Your agent can search the internet. Ask it to research something for you!",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/web-explorer",
    steps: ["Ask a research question", "Review results", "Try fetching a page"],
    guide: [
      {
        title: "Ask your agent to search the web",
        description: "Your agent has built-in web search. Just ask it to look something up, and it'll use Brave Search to find results.",
        command: "# Message your bot:\n\"Search the web for the best productivity apps in 2026\"",
      },
      {
        title: "Try a more specific research task",
        description: "Give your agent a real task that requires web research. It can search, read pages, and summarize findings.",
        command: "# Message your bot:\n\"Research the top 5 AI agent frameworks, compare their features, and tell me which one is best for beginners\"",
      },
      {
        title: "Ask it to read a specific webpage",
        description: "Your agent can fetch and read the contents of any public URL. Try sending it an article link.",
        command: "# Message your bot:\n\"Read this page and summarize it: https://docs.openclaw.ai\"",
        tip: "This is incredibly useful for research, summarizing long articles, or monitoring websites.",
      },
    ],
    helpLinks: [
      { label: "Web search tool docs", url: "https://docs.openclaw.ai/tools/web-search" },
      { label: "Web fetch tool docs", url: "https://docs.openclaw.ai/tools/web-fetch" },
    ],
  },
  {
    id: 10,
    title: "The Automator",
    summary: "Create a cron job that actually runs successfully. Watch your agent work on autopilot!",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/the-automator",
    steps: ["Create a recurring task", "Wait for it to run", "Confirm success"],
    guide: [
      {
        title: "Create a useful automated task",
        description: "Let's make something actually useful. Ask your agent to set up a recurring task that delivers value. Here are some ideas:",
        command: "# Ideas — message your bot with one of these:\n\"Every morning at 8am, search for today's top tech news and send me a summary\"\n\"Every 6 hours, check if my website is up and alert me if it's down\"\n\"Every day at 10am, give me a random fun fact\"",
      },
      {
        title: "Wait for the first execution",
        description: "Depending on the schedule, you may need to wait a bit. For testing, you can ask your agent to create a job that runs every 5 minutes.",
        command: "# For quick testing:\n\"Create a cron job that runs every 5 minutes and sends me the current time\"",
        tip: "Once it runs successfully, you can update it to a more reasonable schedule.",
      },
      {
        title: "Verify it ran successfully",
        description: "Ask your agent to check the status of your cron jobs. Look for 'lastStatus: ok' — that means it ran without errors.",
        command: "# Message your bot:\n\"Check the status of my cron jobs — did they run successfully?\"",
      },
      {
        title: "You're now running AI automation!",
        description: "Congrats — your agent is now doing real work on autopilot. This is the core superpower of OpenClaw: set it up once, and it keeps working for you 24/7.",
        tip: "Power users run 10-20 cron jobs: news digests, social media monitoring, email summaries, website checks, and more.",
      },
    ],
    helpLinks: [
      { label: "Automation examples", url: "https://resources.learnopenclaw.ai/openclaw-automation-examples" },
      { label: "Cron troubleshooting", url: "https://docs.openclaw.ai/tools/cron/troubleshooting" },
    ],
  },
  {
    id: 11,
    title: "Skill Collector",
    summary: "Install a skill from ClawHub to give your agent new abilities.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/skill-collector",
    steps: ["Browse ClawHub", "Install a skill", "Test it"],
    guide: [
      {
        title: "What are skills?",
        description: "Skills are pre-built instruction packages that teach your agent how to do specific things — like managing Google Calendar, posting to Twitter, generating videos, or checking the weather. Think of them as 'apps' for your agent.",
      },
      {
        title: "Browse available skills",
        description: "Ask your agent to search ClawHub for skills, or browse the website directly.",
        command: "# Message your bot:\n\"Search ClawHub for available skills I can install\"",
        tip: "Popular starter skills: weather, gog (Google Workspace), coding-agent",
      },
      {
        title: "Install a skill",
        description: "Ask your agent to install a skill. The weather skill is a great first choice — no API key required!",
        command: "# Message your bot:\n\"Install the weather skill from ClawHub\"",
      },
      {
        title: "Test your new skill",
        description: "Try using the skill you just installed. If you installed weather, ask about the forecast!",
        command: "# Message your bot:\n\"What's the weather in New York right now?\"",
        tip: "Each skill comes with its own instructions. Your agent reads them automatically and knows how to use the skill.",
      },
    ],
    helpLinks: [
      { label: "ClawHub — browse skills", url: "https://clawhub.com" },
      { label: "Skills documentation", url: "https://docs.openclaw.ai/skills" },
      { label: "Creating your own skills", url: "https://docs.openclaw.ai/skills/creating" },
    ],
  },
  {
    id: 12,
    title: "Go Social",
    summary: "Connect your agent to X/Twitter. Now it can post, search, and engage for you.",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/go-social",
    steps: ["Create Twitter developer app", "Configure credentials", "Test connection"],
    guide: [
      {
        title: "Create a Twitter/X developer account",
        description: "Go to developer.x.com and sign up for a developer account. The free tier gives you enough API access to get started.",
        command: "# Visit: https://developer.x.com",
      },
      {
        title: "Create a new app and get credentials",
        description: "In the developer portal, create a new app. You'll need 4 credentials: API Key, API Secret, Access Token, and Access Token Secret.",
        tip: "Make sure to set your app permissions to 'Read and Write' if you want your agent to post tweets.",
      },
      {
        title: "Store credentials securely on your VPS",
        description: "Create a .env file with your Twitter credentials. Never commit these to git!",
        command: "cat > ~/.openclaw/workspace/.env.twitter << 'EOF'\nTWITTER_API_KEY=your_api_key_here\nTWITTER_API_SECRET=your_api_secret_here\nTWITTER_ACCESS_TOKEN=your_access_token_here\nTWITTER_ACCESS_SECRET=your_access_secret_here\nEOF",
      },
      {
        title: "Test the connection",
        description: "Ask your agent to verify the Twitter connection by reading your timeline or profile.",
        command: "# Message your bot:\n\"Check if my Twitter/X connection is working — what's my latest tweet?\"",
      },
      {
        title: "Try posting (optional)",
        description: "If you're feeling brave, ask your agent to draft and post a tweet!",
        command: "# Message your bot:\n\"Draft a tweet about how I just set up my own AI agent with OpenClaw\"",
        tip: "Start with drafting tweets for your approval before enabling auto-posting.",
      },
    ],
    helpLinks: [
      { label: "Twitter/X developer portal", url: "https://developer.x.com" },
      { label: "Twitter API setup guide", url: "https://resources.learnopenclaw.ai/twitter-api-setup" },
      { label: "Social media automation ideas", url: "https://resources.learnopenclaw.ai/social-media-automation" },
    ],
  },
];

export function getQuestById(id: number): Quest | undefined {
  return QUESTS.find((quest) => quest.id === id);
}
