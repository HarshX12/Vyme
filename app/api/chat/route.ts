import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

export const maxDuration = 30;

// ---- 1. Canned response bank -------------------------------------------
// Add/edit freely. Keys are matched against the user's latest message
// (case-insensitive, substring match). First match wins.
const RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["guitar", "acoustic", "electric guitar"],
    reply:
      "For guitars, it really comes down to genre and budget. If you're starting out, an acoustic like the Yamaha F310 or Fender CD-60S gives you a solid, forgiving feel under ₹8,000–15,000. If you're leaning electric — rock, blues, metal — a Squier Stratocaster or Epiphone Les Paul Special is a great entry point with real upgrade headroom. What's your budget and the genre you're drawn to?",
  },
  {
    keywords: ["piano", "keyboard", "keys"],
    reply:
      "For piano/keyboard, the big question is whether you want weighted (hammer-action) keys for classical technique, or a lighter synth-action keyboard for portability and versatility. A Yamaha P-45 or Casio CDP-S110 covers weighted keys well for beginners. If you just want to noodle and learn basics, a 61-key portable keyboard is cheaper and more flexible. Are you thinking classical training or more casual/pop playing?",
  },
  {
    keywords: ["drum", "drums", "percussion"],
    reply:
      "Drums are a space and budget question first — acoustic kits need a room (and patient neighbors), while electronic kits like the Alesis Nitro Mesh let you practice with headphones. For beginners on a budget, I'd lean electronic: quieter, cheaper, and you can still develop real technique. Do you have space for an acoustic kit, or is this an apartment setup?",
  },
  {
    keywords: ["violin", "strings", "cello"],
    reply:
      "Violins are very size- and fit-dependent, especially for younger players — getting the right body size matters more than the brand at the beginner level. A standard student outfit (violin + bow + case) from Cremona or Stentor is a reliable starting point. Is this for a child or an adult beginner? That changes the sizing conversation a lot.",
  },
  {
    keywords: ["budget", "cheap", "affordable"],
    reply:
      "Totally get wanting to start cheap and not overcommit. The honest advice: spend just enough that the instrument doesn't fight you — a genuinely bad beginner instrument (bad intonation, high action, cheap keys) is the #1 reason people quit in month one. Tell me which instrument you're considering and I'll point you to the sweet spot between 'too cheap to enjoy' and 'overspending on gear you'll outgrow.'",
  },
  {
    keywords: ["skill", "beginner", "intermediate", "advanced", "level"],
    reply:
      "Your skill level changes what actually matters in an instrument. Beginners should optimize for playability and forgiveness over features — cheap gear that's hard to play kills motivation fast. Intermediate players start caring about tone and build quality. Advanced players usually already know exactly what they want. Where would you place yourself, and on which instrument?",
  },
];

const FALLBACK_REPLY =
  "I can help you find the right instrument — tell me what you're interested in (guitar, piano, drums, violin, etc.), your budget, and your skill level, and I'll point you in the right direction.";

function pickReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  for (const entry of RESPONSES) {
    if (entry.keywords.some((k) => msg.includes(k))) {
      return entry.reply;
    }
  }
  return FALLBACK_REPLY;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- 2. Route handler ----------------------------------------------------
// Streams a canned reply word-by-word through the same UI Message Stream
// protocol useChat expects — no real model call, no API key, no cost,
// and no test-only dependencies (safe for production builds).
export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastUserMessage =
    [...messages].reverse().find((m: any) => m.role === "user")?.content ??
    (() => {
      const last = messages?.[messages.length - 1];
      const part = last?.parts?.find((p: any) => p.type === "text");
      return part?.text ?? "";
    })();

  const replyText = pickReply(
    typeof lastUserMessage === "string"
      ? lastUserMessage
      : JSON.stringify(lastUserMessage)
  );

  const words = replyText.split(" ");
  const messageId = `mock-${Date.now()}`;

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      await sleep(400); // brief "thinking" pause

      writer.write({ type: "text-start", id: messageId });

      for (let i = 0; i < words.length; i++) {
        const delta = i === 0 ? words[i] : " " + words[i];
        writer.write({ type: "text-delta", id: messageId, delta });
        await sleep(35); // typing speed — tune as you like
      }

      writer.write({ type: "text-end", id: messageId });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
