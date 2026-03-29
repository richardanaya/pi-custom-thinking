import { homedir } from "node:os";
import { join } from "node:path";
import { readFile, access } from "node:fs/promises";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

// Default thinking styles inspired by various personas
const DEFAULT_STYLES: ThinkingStyles = {
  loading: {
    name: "Classic Loading",
    messages: [
      "Loading...",
      "Please wait...",
      "Processing...",
      "Working...",
      "Computing...",
    ],
  },
  creative: {
    name: "Creative",
    messages: [
      "Brewing ideas...",
      "Stirring thoughts...",
      "Weaving words...",
      "Gathering inspiration...",
      "Connecting neurons...",
      "Synthesizing concepts...",
      "Sculpting a response...",
      "Arranging pixels of wisdom...",
    ],
  },
  tech: {
    name: "Tech Jargon",
    messages: [
      "Compiling thoughts...",
      "Optimizing neural weights...",
      "Querying knowledge base...",
      "Executing inference...",
      "Propagating gradients...",
      "Tokenizing intent...",
      "Running forward pass...",
      "Synchronizing tensors...",
    ],
  },
  zen: {
    name: "Zen",
    messages: [
      "Breathe in...",
      "Finding center...",
      "Contemplating...",
      "In the moment...",
      "Stillness before response...",
      "Mindful processing...",
      "Seeking clarity...",
      "Observing thoughts...",
    ],
  },
  pirate: {
    name: "Pirate",
    messages: [
      "Consultin' the map...",
      "Hoisting the mainsail...",
      "Polishing me parrot...",
      "Counting doubloons...",
      "Navigating by stars...",
      "Preparing the rum...",
      "Scrubbing the deck...",
      "Charting a course...",
    ],
  },
  chef: {
    name: "Chef",
    messages: [
      "Preheating the oven...",
      "Chopping fresh ideas...",
      "Reducing the sauce...",
      "Plating a response...",
      "Seasoning to taste...",
      "Kneading the dough...",
      "Tasting for balance...",
      "Garnishing the answer...",
    ],
  },
  wizard: {
    name: "Wizard",
    messages: [
      "Consulting the grimoire...",
      "Channeling mana...",
      "Casting divination...",
      "Reading the runes...",
      "Brewing a potion...",
      "Summoning a familiar...",
      "Waving the wand...",
      "Deciphering ancient texts...",
    ],
  },
  space: {
    name: "Space",
    messages: [
      "Engaging thrusters...",
      "Calculating trajectory...",
      "Scanning sector...",
      "Aligning coordinates...",
      "Orbiting solution...",
      "Deploying satellites...",
      "Docking with knowledge base...",
      "Houston, we have an idea...",
    ],
  },
  philosopher: {
    name: "Philosopher",
    messages: [
      "Pondering the essence of thought...",
      "Questioning the nature of knowing...",
      "Sifting through dialectic...",
      "Contemplating the categorical imperative...",
      "Dancing with the absurd...",
      "Seeking the form of the good...",
      "Unveiling the veil of ignorance...",
      "Distilling wisdom from chaos...",
      "Inquiring within...",
      "Balancing the golden mean...",
    ],
  },
};

// Types for the configuration
interface ThinkingStyle {
  name: string;
  messages: string[];
}

interface ThinkingStyles {
  [key: string]: ThinkingStyle;
}

interface Config {
  currentStyle?: string;
  styles?: ThinkingStyles;
}

// State
let config: Config = {};
let configPath: string;
let lastMessageIndex = -1;

/**
 * Get a random message from the current style, never repeating the last one
 */
function getNextMessage(style: ThinkingStyle): string {
  const count = style.messages.length;

  // Edge cases
  if (count === 0) {
    return "Thinking...";
  }
  if (count === 1) {
    return style.messages[0];
  }

  // Pick a random index different from the last one
  let index: number;
  do {
    index = Math.floor(Math.random() * count);
  } while (index === lastMessageIndex);

  lastMessageIndex = index;
  return style.messages[index];
}

/**
 * Get the current style with fallback to default
 */
function getCurrentStyle(): ThinkingStyle {
  const styleKey = config.currentStyle || "philosopher";
  const styles = { ...DEFAULT_STYLES, ...config.styles };
  return styles[styleKey] || DEFAULT_STYLES.philosopher;
}

/**
 * Load configuration from ~/.custom-thinking.json
 */
async function loadConfig(): Promise<void> {
  try {
    await access(configPath);
    const content = await readFile(configPath, "utf-8");
    const userConfig = JSON.parse(content) as Config;
    config = {
      ...userConfig,
      styles: { ...DEFAULT_STYLES, ...userConfig.styles },
    };
  } catch {
    // File doesn't exist or is invalid, use defaults
    config = {
      currentStyle: "philosopher",
      styles: DEFAULT_STYLES,
    };
  }
}

export default async function (pi: ExtensionAPI) {
  configPath = join(homedir(), ".custom-thinking.json");
  await loadConfig();

  // Set custom working message when agent starts
  pi.on("agent_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    const style = getCurrentStyle();
    const message = getNextMessage(style);

    // Set the working message with keyboard shortcut hint
    // The UI will append " (Ctrl+C to interrupt)" automatically
    ctx.ui.setWorkingMessage(message);
  });

  // Rotate message on each new turn
  pi.on("turn_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    const style = getCurrentStyle();
    const message = getNextMessage(style);
    ctx.ui.setWorkingMessage(message);
  });
}
