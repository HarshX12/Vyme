import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { z } from "zod";

export const maxDuration = 30;

/* ------------------------------------------------------------------ */
/*  Product catalog                                                     */
/*  Edit freely — swap in real Kadence SKUs, prices and URLs.           */
/*  `glyph` + `tint` drive the card artwork (no image files needed).    */
/* ------------------------------------------------------------------ */

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  blurb: string;
  glyph: string;
  tint: string;
  url: string;
};

const CATALOG: Product[] = [
  {
    id: "yamaha-f310",
    name: "Yamaha F310 Acoustic",
    category: "Guitars",
    price: 9500,
    level: "beginner",
    blurb: "The default first acoustic — forgiving action, reliable tuning, holds resale value.",
    glyph: "🎸",
    tint: "#D97C4C",
    url: "#",
  },
  {
    id: "fender-cd60s",
    name: "Fender CD-60S",
    category: "Guitars",
    price: 16500,
    level: "beginner",
    blurb: "Solid spruce top and a rolled fretboard edge — noticeably easier on new fingers.",
    glyph: "🎸",
    tint: "#C2612F",
    url: "#",
  },
  {
    id: "squier-strat",
    name: "Squier Bullet Stratocaster",
    category: "Guitars",
    price: 14000,
    level: "beginner",
    blurb: "Classic three-pickup electric. Covers rock, blues, funk and pop without fuss.",
    glyph: "🎸",
    tint: "#B8532A",
    url: "#",
  },
  {
    id: "epiphone-lp-special",
    name: "Epiphone Les Paul Special",
    category: "Guitars",
    price: 24000,
    level: "intermediate",
    blurb: "Thicker humbucker tone for rock and metal, with real upgrade headroom.",
    glyph: "🎸",
    tint: "#8E3F1E",
    url: "#",
  },
  {
    id: "casio-cdp-s110",
    name: "Casio CDP-S110",
    category: "Digital Pianos",
    price: 32000,
    level: "beginner",
    blurb: "88 fully weighted keys in a slim body — the budget pick for proper technique.",
    glyph: "🎹",
    tint: "#7B6CF6",
    url: "#",
  },
  {
    id: "yamaha-p45",
    name: "Yamaha P-45",
    category: "Digital Pianos",
    price: 38000,
    level: "beginner",
    blurb: "Graded hammer action that gets closest to an acoustic feel at this price.",
    glyph: "🎹",
    tint: "#5B4BE0",
    url: "#",
  },
  {
    id: "yamaha-psr-e373",
    name: "Yamaha PSR-E373",
    category: "Digital Pianos",
    price: 21000,
    level: "beginner",
    blurb: "61 light-touch keys, hundreds of voices — best for casual and pop playing.",
    glyph: "🎹",
    tint: "#6D5FE8",
    url: "#",
  },
  {
    id: "stentor-student-ii",
    name: "Stentor Student II Violin",
    category: "Violins",
    price: 18000,
    level: "beginner",
    blurb: "Complete outfit with bow and case. Sized properly, it stays in tune and plays clean.",
    glyph: "🎻",
    tint: "#A8441F",
    url: "#",
  },
  {
    id: "cremona-sv75",
    name: "Cremona SV-75 Violin",
    category: "Violins",
    price: 13500,
    level: "beginner",
    blurb: "Entry student violin with a solid setup out of the box — good first-year instrument.",
    glyph: "🎻",
    tint: "#93401F",
    url: "#",
  },
  {
    id: "alesis-nitro-mesh",
    name: "Alesis Nitro Mesh Kit",
    category: "Drums",
    price: 42000,
    level: "beginner",
    blurb: "Mesh heads and headphone practice — real stick feel without annoying the neighbours.",
    glyph: "🥁",
    tint: "#2E7D6B",
    url: "#",
  },
  {
    id: "kadence-mandolin-a",
    name: "Kadence A-Style Mandolin",
    category: "Mandolins",
    price: 11500,
    level: "beginner",
    blurb: "Bright, punchy and compact — an easy second instrument if you already play guitar.",
    glyph: "🪕",
    tint: "#B07A2B",
    url: "#",
  },
  {
    id: "yamaha-yas280",
    name: "Yamaha YAS-280 Alto Sax",
    category: "Saxophones",
    price: 145000,
    level: "intermediate",
    blurb: "The standard student alto — consistent intonation and built to survive daily practice.",
    glyph: "🎷",
    tint: "#C9902B",
    url: "#",
  },
];

const CATALOG_SUMMARY = CATALOG.map(
  (p) => `${p.id} | ${p.name} | ${p.category} | ₹${p.price} | ${p.level}`
).join("\n");

/* ------------------------------------------------------------------ */
/*  System prompt                                                       */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are Vyme, a friendly and knowledgeable music instrument advisor for an Indian music store.

You have a fixed catalog. These are the ONLY products you may recommend:

${CATALOG_SUMMARY}

BEFORE you recommend anything, you must know all three of these:
1. Instrument type (guitar, piano, violin, drums, mandolin, saxophone)
2. Budget in INR
3. Who it's for and their level — the customer themselves or a gift, and beginner / intermediate / advanced

Ask for missing information ONE question at a time. Never ask for all three at once — it feels like a form.
Do NOT call the recommendInstruments tool until you have all three. If the customer names only an instrument, ask about budget next. If they give instrument and budget, ask about skill level or whether it's a gift.
If the customer explicitly says "just show me options" or refuses to answer, go ahead and recommend using sensible defaults.

Once you have all three:
- Call "recommendInstruments" with 1-3 matching product ids.
- Respect the budget: never suggest something far above what they said. If nothing fits, say so honestly and show the closest option.
- After calling the tool, write ONE short sentence (max 25 words) introducing the picks. Do not list products, prices or specs in your text — the cards show all of that.

Other rules:
- Prices are in INR. Never invent products, prices or ids outside the catalog.
- Keep every message short — two sentences maximum.
- Be warm and concise, like a good store advisor. Never pushy.`;

/* ------------------------------------------------------------------ */
/*  Route handler                                                       */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(3),
    tools: {
      recommendInstruments: tool({
        description:
          "Show product cards for 1-3 instruments from the catalog. Call this once you know what the customer needs.",
        inputSchema: z.object({
          productIds: z
            .array(z.string())
            .min(1)
            .max(3)
            .describe("Product ids from the catalog, e.g. ['yamaha-f310']"),
        }),
        execute: async ({ productIds }) => {
          const picks = productIds
            .map((id) => CATALOG.find((p) => p.id === id))
            .filter((p): p is Product => Boolean(p));

          return { products: picks };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
