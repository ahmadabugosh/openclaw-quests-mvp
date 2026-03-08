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
    summary: "Get your terminal ready. This is your command center for everything that follows.",
    videoUrl: "/videos/quest-1-terminal-setup.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/open-terminal",
    steps: ["Find or install a terminal", "Open it up", "Run your first command"],
    guide: [
      {
        title: "Mac: Open the Terminal app",
        description: "Press Command + Spacebar to open Spotlight search. Type 'Terminal' and press Enter. That's it — you have a terminal!",
        tip: "Pin it to your dock — you'll be using it a lot from now on.",
      },
      {
        title: "Windows: Install Git Bash",
        description: "Windows doesn't ship with a great terminal for SSH. Download and install Git Bash — it gives you a Linux-like terminal on Windows.",
        command: "# Download from: https://git-scm.com/downloads/win",
        tip: "During installation, keep all the defaults. After installing, search for 'Git Bash' in your Start menu.",
      },
      {
        title: "Linux: You're already set!",
        description: "If you're on Linux, you already have a terminal. Open it from your applications menu or press Ctrl + Alt + T.",
      },
      {
        title: "Run your first command",
        description: "Type this into your terminal and press Enter. If you see a message, congratulations — your terminal works!",
        command: "echo \"Hello from my terminal!\"",
        tip: "Everything you type in the terminal is a 'command.' You're telling your computer what to do, one line at a time.",
      },
    ],
    helpLinks: [
      { label: "Git Bash download (Windows)", url: "https://git-scm.com/downloads/win" },
      { label: "Terminal basics for beginners", url: "https://www.freecodecamp.org/news/command-line-for-beginners/" },
    ],
  },
  {
    id: 2,
    title: "Give It a Home",
    summary: "Get a VPS (Virtual Private Server) and SSH into it. This is where your AI agent will live 24/7.",
    videoUrl: "/videos/quest-2-vps-setup.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/give-it-a-home",
    steps: ["Get a VPS", "Find your IP and password", "SSH in"],
    guide: [
      {
        title: "Sign up for a VPS provider",
        description: "Your agent needs a server to run on — a computer that's always on, always connected. Hetzner is the best value ($4/mo). DigitalOcean and Vultr are also solid choices.",
        tip: "Choose Ubuntu 22.04 or 24.04 as your operating system. Pick the cheapest plan with 2GB+ RAM.",
      },
      {
        title: "Create your server",
        description: "Click 'Create Server' in your provider's dashboard. Pick a region close to you, select Ubuntu, and choose the smallest plan. It'll be ready in about 30 seconds.",
      },
      {
        title: "Find your IP address and password",
        description: "After creation, your provider shows you an IP address (like 167.235.xx.xx) and a root password. Copy both — you need them to connect.",
        tip: "Some providers email the password instead. Check your inbox if you don't see it in the dashboard.",
      },
      {
        title: "SSH into your server",
        description: "Go back to your terminal from Quest 1. Type this command, replacing the IP with yours. When it asks 'Are you sure you want to continue?' type 'yes'. Then enter your password.",
        command: "ssh root@YOUR_SERVER_IP",
        tip: "When typing your password, nothing will appear on screen — that's normal! Just type it and press Enter.",
      },
      {
        title: "Copy and paste your root password",
        description: "It's better to copy and paste with your mouse/cursor (by right clicking) instead of your keyboard. Click paste with your mouse/cursor (by right clicking). Note: when you paste your password in the terminal it will look blank (you won't see anything being copied). Just make sure you paste it next to where it asks for the password and press enter.",
        tip: "The terminal hides password characters for security — even when pasting! This is normal behavior. Just paste and press Enter even though you see nothing.",
      },
      {
        title: "You're in!",
        description: "If you see a new prompt (usually ending in # or $), you're now controlling your remote server. Run this to confirm:",
        command: "hostname && uname -a",
      },
    ],
    helpLinks: [
      { label: "Hetzner Cloud — $4/mo VPS", url: "https://www.hetzner.com/cloud/" },
      { label: "DigitalOcean — $6/mo VPS", url: "https://www.digitalocean.com/" },
      { label: "Vultr — $6/mo VPS", url: "https://www.vultr.com/" },
      { label: "What is SSH?", url: "https://www.cloudflare.com/learning/access-management/what-is-ssh/" },
    ],
  },
  {
    id: 3,
    title: "Prep the Scene",
    summary: "Get your API keys ready before installing OpenClaw. You'll need an AI brain and a chat channel.",
    videoUrl: "/videos/quest3-prep-the-scene.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/prep-the-scene",
    steps: ["Get OpenRouter API key", "Create Telegram bot", "Copy bot token", "Save both for later"],
    guide: [
      {
        title: "Create an OpenRouter account",
        description: "OpenRouter gives you access to dozens of AI models (Claude, GPT, Llama, etc.) with one API key. Go to openrouter.ai and sign up.",
        command: "# Visit: https://openrouter.ai",
      },
      {
        title: "Get your API key",
        description: "After signing up, go to Keys → Create Key. Give it a name like 'OpenClaw' and copy the key. It looks like sk-or-v1-abc123...",
        command: "# Visit: https://openrouter.ai/keys",
        tip: "Save this key somewhere safe (a notes app, password manager). You'll paste it during installation.",
      },
      {
        title: "Add credits to OpenRouter",
        description: "OpenRouter is pay-as-you-go. Add $5-10 to start. Most messages cost fractions of a cent — $5 will last you weeks.",
        tip: "Claude 3.5 Haiku costs ~$0.001 per message. Claude Sonnet 4.5 is smarter but costs more (~$0.01/msg).",
      },
      {
        title: "Create a Telegram bot with BotFather",
        description: "Open Telegram on your phone or desktop. Search for @BotFather and start a chat. Send /newbot and follow the prompts.",
        command: "/newbot",
        tip: "BotFather asks for a display name (anything) and a username (must end in 'bot', e.g. MyClawBot).",
      },
      {
        title: "Copy your Telegram bot token",
        description: "After you create your bot, BotFather sends you a message with your bot token. It looks like this:\n\n123456789:ABCdefGHIjklMNOpqrSTUvwxYZ123456789\n\nTap and hold (mobile) or click (desktop) on the token to select it, then copy it.",
        tip: "The token is the long string of numbers and letters after 'Use this token to access the HTTP API:' in BotFather's message. If you lost it, you can get it again by sending /token to BotFather and selecting your bot.",
      },
      {
        title: "Save both keys",
        description: "You now have two things ready:\n\n1. OpenRouter API key (sk-or-v1-...)\n2. Telegram bot token (123456:ABC-...)\n\nKeep these handy — you'll paste them in the next quest during installation.",
        tip: "Paste them in a note on your phone so they're easy to copy during setup.",
      },
    ],
    helpLinks: [
      { label: "OpenRouter — get API key", url: "https://openrouter.ai/keys" },
      { label: "OpenRouter model pricing", url: "https://openrouter.ai/models" },
      { label: "Telegram BotFather", url: "https://t.me/BotFather" },
    ],
  },
  {
    id: 4,
    title: "Incubate",
    summary: "Install OpenClaw on your VPS with one command. Then configure your AI model and Telegram bot.",
    videoUrl: "/videos/quest4-install-openclaw-v2.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/incubate",
    steps: ["Run the installer", "Set your model", "Add your Telegram token"],
    guide: [
      {
        title: "SSH into your server (if not already connected)",
        description: "Open your terminal and connect to your VPS, just like in Quest 2. Remember to copy and paste your root password using right-click — the password will appear blank when you paste it.",
        command: "ssh root@YOUR_SERVER_IP",
      },
      {
        title: "Run the OpenClaw installer",
        description: "One command installs everything — Node.js, OpenClaw, and all dependencies. Just paste this and press Enter:",
        command: "curl -fsSL https://openclaw.ai/install.sh | bash",
        tip: "This takes 1-2 minutes. Grab a coffee ☕ — when it's done, you'll see a success message.",
      },
      {
        title: "Choose your AI model",
        description: "The installer will ask you to pick a model. We recommend one of these:\n\n• Claude Sonnet 4.5 — smartest, best for complex tasks (~$0.01/msg)\n• MiniMax — great value, very capable (~$0.002/msg)",
        tip: "You can always change your model later. Start with whichever feels right!",
      },
      {
        title: "Enter your OpenRouter API key",
        description: "When prompted, paste the OpenRouter API key you got in Quest 3 (the one starting with sk-or-v1-...).",
      },
      {
        title: "Enter your Telegram bot token",
        description: "When prompted, paste the Telegram bot token from Quest 3 (the one from BotFather starting with numbers).",
      },
      {
        title: "Installation complete!",
        description: "OpenClaw is now installed on your server. The installer sets up everything automatically. Your agent is almost ready to talk!",
        tip: "If anything went wrong, run the installer again — it's safe to re-run.",
      },
    ],
    helpLinks: [
      { label: "OpenClaw installation docs", url: "https://docs.openclaw.ai/get-started/install" },
      { label: "Troubleshooting installation", url: "https://docs.openclaw.ai/get-started/troubleshooting" },
      { label: "Model comparison guide", url: "https://resources.learnopenclaw.ai/choosing-a-model" },
    ],
  },
  {
    id: 5,
    title: "Teach It to Talk",
    summary: "Link your Telegram bot and start the gateway. Your agent comes alive!",
    videoUrl: "/videos/quest5-start-and-pair.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/teach-it-to-talk",
    steps: ["Start the gateway", "Get your pairing code", "Approve the pairing", "See it come online"],
    guide: [
      {
        title: "Start the OpenClaw gateway",
        description: "The gateway is what keeps your agent running and connected to Telegram. Start it with:",
        command: "openclaw gateway start",
      },
      {
        title: "Check Telegram for your pairing code",
        description: "Once the gateway starts, OpenClaw will send you a message on Telegram with a pairing code. Open Telegram and look for a message from your bot with the code.",
        tip: "If you don't see the message, check that your bot token is correct and that you've started a chat with your bot by searching for its username.",
      },
      {
        title: "Approve the Telegram pairing",
        description: "Go back to your server terminal and run this command, replacing YOURPAIRINGCODE with the code you received on Telegram:",
        command: "openclaw pairing approve telegram YOURPAIRINGCODE",
        tip: "If you missed the pairing code, run 'openclaw pairing list' to see pending pairings.",
      },
      {
        title: "Check that it's running",
        description: "Verify the gateway is up and your Telegram channel is connected:",
        command: "openclaw status",
        tip: "You should see a green status for Telegram. If it says 'disconnected', double-check your bot token.",
      },
      {
        title: "Send your bot a message!",
        description: "Open Telegram, find your bot by its username, and send 'Hello!' — if it replies, your agent is alive! 🎉",
        tip: "The first message might take a few seconds as the AI model warms up. After that, responses are fast.",
      },
    ],
    helpLinks: [
      { label: "Pairing & channels docs", url: "https://docs.openclaw.ai/channels/telegram" },
      { label: "Gateway management", url: "https://docs.openclaw.ai/core/gateway" },
      { label: "Troubleshooting connections", url: "https://docs.openclaw.ai/get-started/troubleshooting" },
    ],
  },
  {
    id: 6,
    title: "First Conversation",
    summary: "Have your first real conversation with your AI agent. Send at least 5 messages!",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/first-conversation",
    steps: ["Say hello", "Try different prompts", "Explore its abilities"],
    guide: [
      {
        title: "Say hello!",
        description: "Start simple. Send 'Hey, who are you?' to your bot on Telegram. Your agent will respond based on its default personality.",
      },
      {
        title: "Generate a profile picture for your bot",
        description: "Give your AI agent a face! Use any free AI image generator to create a profile picture. Good options include DALL-E (via Bing Image Creator), Midjourney (if you have access), or Leonardo.ai (free tier).",
        tip: "Prompt idea: 'A friendly AI robot assistant, professional profile picture style' or 'A cute lobster mascot, cartoon style'",
      },
      {
        title: "Set your bot's profile picture on Telegram",
        description: "Open Telegram and search for @BotFather. Send /mybots, select your bot, then tap 'Edit Bot' → 'Edit Botpic'. Upload the image you generated. Now your agent has a face!",
        tip: "You can also change your bot's name and description here. Make it your own!",
      },
      {
        title: "Ask it to do something useful",
        description: "Try asking it to search the web, summarize something, or help with a task. Here are some ideas:",
        command: "# Try these messages:\n\"Search the web for the latest AI news today\"\n\"What's the weather in Dubai?\"\n\"Write me a haiku about coding\"",
        tip: "Your agent has access to web search, file operations, code execution, and more. Try asking 'What tools do you have?'",
      },
      {
        title: "Test its knowledge",
        description: "Tell it something about yourself: 'My name is [your name] and I'm learning OpenClaw.' Later, ask 'What's my name?' — it remembers within the conversation!",
      },
      {
        title: "Ask it to read a file",
        description: "Your agent can read files on the server. Try asking it to look at its own config:",
        command: "# Message your bot:\n\"Read the AGENTS.md file and tell me what's in it\"",
      },
      {
        title: "Keep chatting — send at least 5 messages!",
        description: "The more you interact, the more you'll discover. Try asking it to write code, explain concepts, or plan something for you.",
        tip: "Fun experiment: ask 'What's the most creative thing you can do?' and see what happens!",
      },
    ],
    helpLinks: [
      { label: "Bing Image Creator (free DALL-E)", url: "https://www.bing.com/images/create" },
      { label: "Leonardo.ai (free image generator)", url: "https://leonardo.ai/" },
      { label: "Prompt ideas for OpenClaw", url: "https://resources.learnopenclaw.ai/prompting-openclaw" },
      { label: "How sessions work", url: "https://docs.openclaw.ai/core/sessions" },
      { label: "Available tools reference", url: "https://docs.openclaw.ai/tools" },
    ],
  },
  {
    id: 7,
    title: "Memory Lane",
    summary: "Give your agent long-term memory. Tell it about yourself so it remembers between sessions.",
    videoUrl: "/videos/quest7-identity-and-memory.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/memory-lane",
    steps: ["Tell your agent about yourself", "Ask it to update memory files", "Test recall"],
    guide: [
      {
        title: "Tell your agent to create its identity",
        description: "Instead of writing files manually, just tell your agent what to do! Message it on Telegram:",
        command: "# Message your bot:\n\"Create an IDENTITY.md file for yourself. Pick a name you like, choose an emoji, and describe your personality.\"",
        tip: "Your agent will create the file itself. You can suggest a name or let it choose — it's fun to see what it picks!",
      },
      {
        title: "Tell it about yourself",
        description: "Your agent has a USER.md file where it stores info about you. Just tell it naturally:",
        command: "# Message your bot:\n\"Update USER.md with my info: My name is [your name], I'm in [timezone], and I prefer step-by-step explanations. I'm currently learning OpenClaw.\"",
      },
      {
        title: "Set up long-term memory",
        description: "Ask your agent to create its memory structure. This is how it remembers things between conversations:",
        command: "# Message your bot:\n\"Create a MEMORY.md file and a memory/ directory for daily notes. In MEMORY.md, note that today is the day we first met.\"",
      },
      {
        title: "Test its memory",
        description: "In a new conversation (or after some time), ask your agent personal questions to see if it recalls what you told it:",
        command: "# Message your bot:\n\"What do you know about me?\"\n\"What's your name?\"",
        tip: "If it remembers — the memory system is working! Your agent now has continuity across sessions.",
      },
    ],
    helpLinks: [
      { label: "Memory system docs", url: "https://docs.openclaw.ai/core/memory" },
      { label: "Identity & personality guide", url: "https://resources.learnopenclaw.ai/agent-personality-guide" },
      { label: "Daily notes workflow", url: "https://resources.learnopenclaw.ai/openclaw-memory-workflow" },
    ],
  },
  {
    id: 8,
    title: "The Automator",
    summary: "Set up your first scheduled task. Make your agent do useful things on autopilot!",
    videoUrl: "/videos/quest8-cron-jobs.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/the-automator",
    steps: ["Create a cron job", "Wait for it to run", "Verify it worked"],
    guide: [
      {
        title: "What's a cron job?",
        description: "A cron job is a task that runs on a schedule — like an alarm clock for your agent. 'Every morning at 9am, search for AI news and send me a summary.' That's the power of automation.",
      },
      {
        title: "Ask your agent to create one",
        description: "Just tell your agent what you want, in plain English. It handles all the scheduling details:",
        command: "# Message your bot — pick one:\n\"Every morning at 9am, search the web for today's top AI news and send me a 3-bullet summary\"\n\"Remind me every day at 6pm to drink water 💧\"\n\"Every Monday at 10am, give me a motivational quote to start the week\"",
        tip: "Start simple! A daily reminder or news digest is perfect for your first automation.",
      },
      {
        title: "Verify the job was created",
        description: "Ask your agent to list your scheduled jobs to make sure it saved:",
        command: "# Message your bot:\n\"Show me all my cron jobs\"",
      },
      {
        title: "Wait for it to run (or test immediately)",
        description: "If you set a daily job, you can ask your agent to run it right now to test:",
        command: "# Message your bot:\n\"Run my cron job now so I can test it\"",
      },
      {
        title: "Check it ran successfully",
        description: "After it runs, ask for the status. You want to see 'lastStatus: ok':",
        command: "# Message your bot:\n\"Did my cron job run successfully? What was the status?\"",
        tip: "Congrats — your agent is now working for you 24/7! Power users run 10-20 automations: news digests, website monitoring, social media, email summaries, and more.",
      },
    ],
    helpLinks: [
      { label: "Cron scheduler docs", url: "https://docs.openclaw.ai/tools/cron" },
      { label: "Automation examples", url: "https://resources.learnopenclaw.ai/openclaw-automation-examples" },
      { label: "Cron expression helper", url: "https://crontab.guru/" },
    ],
  },
  {
    id: 9,
    title: "Skill Collector",
    summary: "Install skills from ClawHub and set up web search with the Brave API.",
    videoUrl: "/videos/quest9-skills-and-apis.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/skill-collector",
    steps: ["Browse ClawHub", "Install a skill", "Set up Brave Search API"],
    guide: [
      {
        title: "What are skills?",
        description: "Skills are pre-built instruction packages that teach your agent new abilities — like checking the weather, managing Google Calendar, or generating videos. Think of them as 'apps' for your agent.",
      },
      {
        title: "Install your first skill",
        description: "Ask your agent to browse and install a skill. The weather skill is a great starter — no API key required!",
        command: "# Message your bot:\n\"Search ClawHub for available skills and install the weather skill\"",
        tip: "After installing, test it: 'What's the weather in New York right now?'",
      },
      {
        title: "Set up Brave Search API for better web search",
        description: "Your agent can search the web by default, but adding a Brave Search API key gives it much better results. Go to brave.com/search/api and create a free account.",
        command: "# Visit: https://brave.com/search/api\n# Free tier: 2,000 searches/month",
      },
      {
        title: "Add your Brave API key",
        description: "Once you have your Brave API key, tell your agent to configure it:",
        command: "# Message your bot:\n\"Add my Brave Search API key to the config: YOUR_BRAVE_KEY_HERE\"",
        tip: "With Brave Search configured, your agent's web research becomes significantly more accurate and detailed.",
      },
      {
        title: "Test web search",
        description: "Try a research query to see the improved search in action:",
        command: "# Message your bot:\n\"Research the top 5 AI agent frameworks in 2026 and compare them\"",
      },
    ],
    helpLinks: [
      { label: "ClawHub — browse skills", url: "https://clawhub.com" },
      { label: "Brave Search API (free tier)", url: "https://brave.com/search/api" },
      { label: "Skills documentation", url: "https://docs.openclaw.ai/skills" },
      { label: "Creating your own skills", url: "https://docs.openclaw.ai/skills/creating" },
    ],
  },
  {
    id: 10,
    title: "Go Social",
    summary: "Connect your agent to X/Twitter. Now it can post, search, and engage for you.",
    videoUrl: "/videos/quest10-twitter-integration.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/go-social",
    steps: ["Create Twitter developer app", "Configure credentials", "Test connection"],
    guide: [
      {
        title: "Create an X.com account for your bot",
        description: "If you don't already have a separate X/Twitter account for your bot, create one now. Go to x.com and sign up with a new email address. Choose a username that represents your bot (e.g., @MyClawBot).",
        command: "# Visit: https://x.com",
        tip: "Use a separate email for your bot account. Gmail allows '+' addressing: yourname+botname@gmail.com counts as a unique email to X but goes to your main inbox.",
      },
      {
        title: "Create a Twitter/X developer account",
        description: "Log in to your bot's X account, then go to developer.x.com and sign up for a developer account. The free tier gives you enough API access to get started.",
        command: "# Visit: https://developer.x.com",
        tip: "Make sure you're logged into your BOT account, not your personal X account, before applying for developer access.",
      },
      {
        title: "Create a new app and get credentials",
        description: "In the developer portal, create a new Project and App. You'll need 4 credentials: API Key, API Secret, Access Token, and Access Token Secret.",
        tip: "Set your app permissions to 'Read and Write' if you want your agent to post tweets.",
      },
      {
        title: "Tell your agent to store the credentials",
        description: "Message your agent with the credentials so it can save them securely:",
        command: "# Message your bot:\n\"Save my Twitter API credentials:\nAPI Key: xxx\nAPI Secret: xxx\nAccess Token: xxx\nAccess Secret: xxx\"",
        tip: "Your agent stores these in a .env file on your server. They never leave your VPS.",
      },
      {
        title: "Test the connection",
        description: "Ask your agent to verify Twitter is working:",
        command: "# Message your bot:\n\"Test my Twitter connection — what's the latest tweet on my timeline?\"",
      },
      {
        title: "Try posting (optional!)",
        description: "If you're feeling brave, ask your agent to draft a tweet for your approval:",
        command: "# Message your bot:\n\"Draft a tweet about how I just set up my own AI agent with OpenClaw. Don't post it yet — show me first.\"",
        tip: "Always review before posting! Start with drafts until you're comfortable.",
      },
    ],
    helpLinks: [
      { label: "Twitter/X developer portal", url: "https://developer.x.com" },
      { label: "Twitter API setup guide", url: "https://resources.learnopenclaw.ai/twitter-api-setup" },
      { label: "Social media automation ideas", url: "https://resources.learnopenclaw.ai/social-media-automation" },
    ],
  },
  {
    id: 11,
    title: "Lock the Door",
    summary: "Set up SSH key authentication so you can log in securely without typing your password every time.",
    videoUrl: "/videos/quest11-ssh-keys-security.mp4",
    blogUrl: "https://resources.learnopenclaw.ai/lock-the-door",
    steps: ["Generate SSH key", "Copy it to your server", "Disable password login"],
    guide: [
      {
        title: "Why SSH keys?",
        description: "Right now you type your password every time you SSH in. SSH keys are like a digital keycard — more secure and no password needed. Plus, they protect your server from brute-force attacks.",
      },
      {
        title: "Generate an SSH key on YOUR computer (not the server)",
        description: "Open the terminal on your local machine (Mac/Windows/Linux — not the VPS) and run:",
        command: "ssh-keygen -t ed25519 -C \"your@email.com\"",
        tip: "Press Enter for all the prompts to use defaults. You can add a passphrase for extra security or leave it empty.",
      },
      {
        title: "Copy your key to the server",
        description: "This command sends your public key to the server so it recognizes your computer:",
        command: "ssh-copy-id root@YOUR_SERVER_IP",
        tip: "On Windows with Git Bash, if ssh-copy-id doesn't work, you can manually copy: cat ~/.ssh/id_ed25519.pub and paste it into ~/.ssh/authorized_keys on your server.",
      },
      {
        title: "Test it — log in without a password",
        description: "Disconnect from your server (type 'exit') and SSH back in. If it logs you in without asking for a password — it worked!",
        command: "exit\nssh root@YOUR_SERVER_IP",
        tip: "If it still asks for a password, check that the key permissions are correct: chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys (on the server).",
      },
      {
        title: "Disable password login (recommended)",
        description: "For maximum security, disable password authentication entirely. Only SSH keys will work. Ask your agent to do this:",
        command: "# Message your bot:\n\"Disable password authentication for SSH and only allow key-based login. Make sure to keep my current session alive while doing this.\"",
        tip: "⚠️ Only do this AFTER confirming key login works! Otherwise you could lock yourself out.",
      },
    ],
    helpLinks: [
      { label: "SSH key setup guide", url: "https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-22-04" },
      { label: "Server security best practices", url: "https://resources.learnopenclaw.ai/vps-security-basics" },
    ],
  },
  {
    id: 12,
    title: "Mission Control",
    summary: "Launch the OpenClaw dashboard and view it from your local machine. Your command center is ready!",
    videoUrl: "",
    blogUrl: "https://resources.learnopenclaw.ai/mission-control",
    steps: ["SSH into server", "Run dashboard command", "Copy tunnel command", "Open dashboard URL"],
    guide: [
      {
        title: "SSH into your server",
        description: "Open your terminal on your local machine and SSH into your VPS:",
        command: "ssh root@YOUR_SERVER_IP",
        tip: "Make sure you're connected to your server before running the dashboard command.",
      },
      {
        title: "Start the OpenClaw dashboard",
        description: "Run this command on your server. The dashboard will start and give you TWO important things: a tunnel command and a URL.",
        command: "openclaw dashboard",
        tip: "The output will say 'No GUI detected' and show you what to do next. Don't close this terminal — the dashboard needs to stay running!",
      },
      {
        title: "Copy and run the tunnel command LOCALLY",
        description: "OpenClaw will output a command that looks like this:\n\nssh -N -L 18789:127.0.0.1:18789 root@YOUR-SERVER-IP\n\nCopy that EXACT command. Open a NEW terminal tab on your LOCAL machine (not the server) and paste it there. Press Enter.",
        tip: "This terminal will appear to hang with no output — that's normal! It's creating a secure tunnel. Keep it open.",
      },
      {
        title: "Open the dashboard URL in your browser",
        description: "Back in the first terminal (on the server), OpenClaw also showed you a URL with a token, like:\n\nhttp://127.0.0.1:18789/#token=abc123xyz...\n\nCopy that ENTIRE URL (including the #token part). Open it in your browser (Chrome, Firefox, etc.) on your local machine.",
        tip: "The token in the URL is important — it authenticates you to the dashboard. Don't share it!",
      },
      {
        title: "Explore your Mission Control!",
        description: "You should now see your agent's dashboard! Explore the sections:\n\n• Sessions — your chat history\n• Cron Jobs — your scheduled automations\n• Status — system health\n• Logs — what your agent has been doing",
        tip: "This is your Mission Control. Monitor everything, manage automations, and see what your agent is up to — all from this dashboard.",
      },
      {
        title: "🎉 You've completed the journey!",
        description: "You went from zero to a fully operational AI agent with:\n✅ A VPS running 24/7\n✅ Telegram integration\n✅ Web search & skills\n✅ Automated tasks\n✅ Secure SSH access\n✅ A dashboard to monitor it all\n\nYour egg is ready to hatch! 🥚→🦞",
      },
    ],
    helpLinks: [
      { label: "Dashboard documentation", url: "https://docs.openclaw.ai/dashboard" },
      { label: "SSH port forwarding explained", url: "https://www.ssh.com/academy/ssh/tunneling/example" },
      { label: "OpenClaw community Discord", url: "https://discord.com/invite/clawd" },
    ],
  },
];

export function getQuestById(id: number): Quest | undefined {
  return QUESTS.find((quest) => quest.id === id);
}
