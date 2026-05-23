import {
  buildBaziChart,
  countFiveElements,
  deficientElement,
  dominantElement,
  getChineseZodiac,
  getWesternZodiac,
  type BaziChart,
  type FiveElement,
} from "./divination";

export interface DivinationInput {
  name?: string;
  gender: "male" | "female";
  birthDate: string;
  birthHour: number;
}

export interface DivinationResult {
  summary: string;
  chart: BaziChart;
  fiveElements: {
    counts: Record<FiveElement, number>;
    dominant: FiveElement;
    deficient: FiveElement;
    insight: string;
  };
  chineseZodiac: { animal: string; insight: string };
  westernZodiac: { name: string; symbol: string; element: FiveElement; insight: string };
  free: {
    personality: string;
    strengths: string[];
    challenges: string[];
  };
  premium: {
    teaser: string;
    sections: { title: string; preview: string }[];
  };
}

const FIVE_ELEMENT_INSIGHT: Record<FiveElement, string> = {
  Wood:  "Wood embodies growth, vision and benevolence. You are inclined toward expansion and creativity.",
  Fire:  "Fire embodies passion, charisma and propriety. You shine through others and ignite movements.",
  Earth: "Earth embodies stability, trust and nurturing. You are the anchor that others rely upon.",
  Metal: "Metal embodies precision, integrity and discernment. You cut through illusion with clarity.",
  Water: "Water embodies wisdom, adaptability and depth. You flow around obstacles and accumulate insight.",
};

const FIVE_ELEMENT_BALANCE: Record<FiveElement, string> = {
  Wood:  "Surround yourself with greenery, wear emerald tones, place living plants in the east of your home.",
  Fire:  "Welcome warm light, crimson decor and triangular shapes. Spend time near candles, fireplaces or sunrise.",
  Earth: "Anchor your space with ceramic, clay or yellow-ochre tones. Walk barefoot on natural ground when possible.",
  Metal: "Introduce white, silver or round metallic decor. Wind chimes in the west of your home invigorate Qi.",
  Water: "Flow with blues and blacks, place a small water feature in the north and drink mindfully throughout the day.",
};

const ZODIAC_INSIGHT: Record<string, string> = {
  Rat: "Resourceful, quick-witted and socially gifted; ascendant in years of communication and trade.",
  Ox: "Steadfast, dependable and patient; rewarded richly in cycles that demand endurance.",
  Tiger: "Brave, magnetic and dynamic; thrives where bold leadership is required.",
  Rabbit: "Gentle, elegant and diplomatic; flourishes in art, beauty and harmony.",
  Dragon: "Visionary, charismatic and powerful; destined for landmark achievements.",
  Snake: "Intuitive, wise and reflective; uncovers what others overlook.",
  Horse: "Free-spirited, energetic and persuasive; called toward movement and journeys.",
  Goat: "Compassionate, artistic and refined; blossoms in nurturing environments.",
  Monkey: "Inventive, witty and adaptable; reframes problems into opportunities.",
  Rooster: "Observant, disciplined and precise; rises through craft and order.",
  Dog: "Loyal, just and protective; trusted guardian in family and team.",
  Pig: "Generous, sincere and abundant; magnetizes prosperity through honest effort.",
};

const PERSONALITY_TEMPLATES: Record<FiveElement, string> = {
  Wood:  "You are an architect of growth — visionary, principled and quietly competitive. People trust your moral compass and instinct for the long game.",
  Fire:  "You are a luminous catalyst — expressive, persuasive and warm. Crowds remember your presence; ideas come alive when you speak them.",
  Earth: "You are the keeper of harmony — grounded, loyal and abundantly nurturing. Your steadiness becomes the foundation upon which others build.",
  Metal: "You are a discerning blade — refined, decisive and uncompromising in standards. You cut clutter from chaos with effortless precision.",
  Water: "You are a deep current — perceptive, adaptive and quietly powerful. You understand more than you speak, and shape outcomes from beneath the surface.",
};

const STRENGTHS_TEMPLATES: Record<FiveElement, string[]> = {
  Wood:  ["Long-term strategic vision", "Inspires others toward growth", "Strong sense of fairness and ethics"],
  Fire:  ["Magnetic charisma", "Ability to ignite movements", "Quick emotional intelligence"],
  Earth: ["Unshakable reliability", "Healing presence to others", "Mastery of resource cultivation"],
  Metal: ["Surgical clarity in decisions", "Aesthetic and craft mastery", "Strong professional discipline"],
  Water: ["Profound intuition", "Ability to adapt under pressure", "Deep wisdom and pattern recognition"],
};

const CHALLENGES_TEMPLATES: Record<FiveElement, string[]> = {
  Wood:  ["Can be rigid when challenged", "Sometimes overextends in pursuit of growth"],
  Fire:  ["Energy may burn out without rest", "Strong emotions can outpace strategy"],
  Earth: ["May resist necessary change", "Risks self-neglect when caring for others"],
  Metal: ["Perfectionism can isolate you", "Tends to suppress softer feelings"],
  Water: ["Depth can drift into melancholy", "Avoidance may replace confrontation"],
};

export function generateMockReading(input: DivinationInput): DivinationResult {
  const [yearStr, monthStr, dayStr] = input.birthDate.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const chart = buildBaziChart(year, month, day, input.birthHour);
  const counts = countFiveElements(chart);
  const dominant = dominantElement(counts);
  const deficient = deficientElement(counts);
  const animal = getChineseZodiac(year);
  const western = getWesternZodiac(month, day);

  const greetingName = input.name?.trim() ? input.name.trim() : "Seeker";

  return {
    summary: `${greetingName}, your celestial blueprint reveals a chart anchored by ${chart.day.element}, born under the ${animal} year and the western sign of ${western.name}. Your dominant elemental current is ${dominant}, while ${deficient} flows weakly — a key to rebalancing your fortune.`,
    chart,
    fiveElements: {
      counts,
      dominant,
      deficient,
      insight: `${FIVE_ELEMENT_INSIGHT[dominant]} To restore harmony, strengthen the deficient ${deficient}: ${FIVE_ELEMENT_BALANCE[deficient]}`,
    },
    chineseZodiac: {
      animal,
      insight: ZODIAC_INSIGHT[animal] ?? "",
    },
    westernZodiac: {
      name: western.name,
      symbol: western.symbol,
      element: western.element,
      insight: `As a ${western.name}, your archetypal force aligns with the ${western.element} current. ${FIVE_ELEMENT_INSIGHT[western.element]}`,
    },
    free: {
      personality: PERSONALITY_TEMPLATES[chart.day.element],
      strengths: STRENGTHS_TEMPLATES[chart.day.element],
      challenges: CHALLENGES_TEMPLATES[chart.day.element],
    },
    premium: {
      teaser:
        "Your full destiny reading unlocks the deeper currents — wealth gates, romance pillars, career timing, health constitution and the auspicious / inauspicious years of your 10-year luck cycles (大運).",
      sections: [
        {
          title: "Wealth & Career Trajectory",
          preview:
            "The wealth star in your chart reveals two pivotal windows in the coming decade. Your aligned career direction is …",
        },
        {
          title: "Love & Relationship Pillars",
          preview:
            "Your spouse palace shows a meaningful encounter forming in a specific season. The compatible element type is …",
        },
        {
          title: "Health & Vitality Constitution",
          preview:
            "Your body's elemental balance indicates vulnerability in a specific organ system. Restorative practices include …",
        },
        {
          title: "10-Year Luck Cycle (大運) Map",
          preview:
            "Decoded year by year — when to expand, when to consolidate, when to retreat. Your next breakthrough window is …",
        },
        {
          title: "Auspicious Names, Colors & Directions",
          preview:
            "Personalized name characters, color palette, lucky numbers and the most empowering geographic direction for you …",
        },
      ],
    },
  };
}

export async function generateReading(input: DivinationInput): Promise<DivinationResult> {
  const apiBase = process.env.LLM_API_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;

  if (!apiBase || !apiKey) {
    return generateMockReading(input);
  }

  try {
    return generateMockReading(input);
  } catch {
    return generateMockReading(input);
  }
}
