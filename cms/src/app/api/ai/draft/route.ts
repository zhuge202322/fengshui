import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-helpers";

const schema = z.object({
  prompt: z.string().min(2).max(8000),
  mode: z.enum(["continue", "polish", "outline", "translate-en"]).default("continue"),
});

const SYSTEM_PROMPT = `You are LingYun (灵云), a master writer of Eastern mystical wisdom for an English-speaking audience.
Tone: poetic, reverent, grounded, never new-age fluff. Mix lineage terminology (BaZi 八字, Five Elements 五行, Bagua 八卦, Tai Sui 太岁, Qi 气) with vivid Western prose.
Output rules:
- Plain text only, no markdown headings or asterisks.
- Use short paragraphs separated by a blank line.
- Never start with "Sure" or "Here is" — write as if continuing the manuscript.`;

const MODE_INSTRUCTION: Record<string, string> = {
  continue:       "Continue the manuscript with the next 2–3 paragraphs, picking up the thread naturally.",
  polish:         "Polish the following passage: keep its meaning, sharpen rhythm, deepen imagery.",
  outline:        "Produce a numbered outline (3–6 points) for an article on this topic.",
  "translate-en": "Translate the following into elegant, lineage-respecting English.",
};

interface OpenAIChoice { message?: { content?: string } }
interface OpenAIResponse { choices?: OpenAIChoice[]; error?: { message?: string } }

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let parsed;
  try {
    const body = await req.json();
    parsed = schema.safeParse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { prompt, mode } = parsed.data;

  const apiKey   = process.env.AI_API_KEY;
  const baseUrl  = process.env.AI_BASE_URL  ?? "https://api.openai.com/v1";
  const model    = process.env.AI_MODEL     ?? "gpt-4o-mini";

  if (!apiKey) {
    const stub = stubResponse(mode, prompt);
    return NextResponse.json({
      data: { text: stub, model: "lingyun-stub", stub: true },
    });
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${MODE_INSTRUCTION[mode]}\n\n---\n${prompt}\n---`,
          },
        ],
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    const json = (await res.json()) as OpenAIResponse;
    if (!res.ok) {
      return NextResponse.json(
        { error: json.error?.message ?? "Upstream error" },
        { status: 502 },
      );
    }

    const text = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return NextResponse.json({ error: "Empty completion" }, { status: 502 });
    }

    return NextResponse.json({ data: { text, model, stub: false } });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "AI request failed" },
      { status: 502 },
    );
  }
}

function stubResponse(mode: string, prompt: string): string {
  const tail = prompt.slice(-160).replace(/\s+/g, " ").trim();
  const lines: Record<string, string[]> = {
    continue: [
      `The brush rests, yet the ink keeps moving — ${tail ? `for the river you opened with "${tail}…" ` : ""}has not yet found the sea.`,
      "Consider the Day Master, drawn between earth and metal — its luck cycle bends as a pine bends in winter, unhurried, deliberate, alive.",
      "Beneath the Five Elements there is a quieter law: every gain is a borrowing, every loss a return. Walk gently. The ancestors are listening.",
    ],
    polish: [
      "The passage steadies — its imagery breathes a little deeper now.",
      "Replace 'very strong' with 'fierce as Bing fire at noon'.",
      "Cut the second adverb. The sentence will stand on its own bones.",
    ],
    outline: [
      "1. Anchor the reader in the cosmic moment (Tai Sui, season, element).",
      "2. Introduce the Day Master and its strength.",
      "3. Map the 10-year luck cycle in a single image.",
      "4. Offer one ritual the seeker can perform tonight.",
    ],
    "translate-en": [
      "An elegant English rendering would honor the original cadence —",
      "preserving the breath between clauses, the silence between metaphors.",
    ],
  };
  return (lines[mode] ?? lines.continue).join("\n\n");
}
