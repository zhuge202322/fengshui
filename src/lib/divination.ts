export type FiveElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export const HEAVENLY_STEMS = [
  "Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui",
] as const;
export const HEAVENLY_STEMS_CN = [
  "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸",
] as const;

export const EARTHLY_BRANCHES = [
  "Zi", "Chou", "Yin", "Mao", "Chen", "Si",
  "Wu", "Wei", "Shen", "You", "Xu", "Hai",
] as const;
export const EARTHLY_BRANCHES_CN = [
  "子", "丑", "寅", "卯", "辰", "巳",
  "午", "未", "申", "酉", "戌", "亥",
] as const;

export const STEM_ELEMENT: FiveElement[] = [
  "Wood", "Wood", "Fire", "Fire", "Earth",
  "Earth", "Metal", "Metal", "Water", "Water",
];

export const BRANCH_ELEMENT: FiveElement[] = [
  "Water", "Earth", "Wood", "Wood", "Earth", "Fire",
  "Fire", "Earth", "Metal", "Metal", "Earth", "Water",
];

export const CHINESE_ZODIAC = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
] as const;

export const WESTERN_ZODIAC: ReadonlyArray<{
  name: string;
  symbol: string;
  element: FiveElement;
  range: [string, string];
}> = [
  { name: "Capricorn",   symbol: "♑", element: "Earth", range: ["12-22", "01-19"] },
  { name: "Aquarius",    symbol: "♒", element: "Metal", range: ["01-20", "02-18"] },
  { name: "Pisces",      symbol: "♓", element: "Water", range: ["02-19", "03-20"] },
  { name: "Aries",       symbol: "♈", element: "Fire",  range: ["03-21", "04-19"] },
  { name: "Taurus",      symbol: "♉", element: "Earth", range: ["04-20", "05-20"] },
  { name: "Gemini",      symbol: "♊", element: "Metal", range: ["05-21", "06-20"] },
  { name: "Cancer",      symbol: "♋", element: "Water", range: ["06-21", "07-22"] },
  { name: "Leo",         symbol: "♌", element: "Fire",  range: ["07-23", "08-22"] },
  { name: "Virgo",       symbol: "♍", element: "Earth", range: ["08-23", "09-22"] },
  { name: "Libra",       symbol: "♎", element: "Metal", range: ["09-23", "10-22"] },
  { name: "Scorpio",     symbol: "♏", element: "Water", range: ["10-23", "11-21"] },
  { name: "Sagittarius", symbol: "♐", element: "Fire",  range: ["11-22", "12-21"] },
];

export const TWO_HOUR_BRANCH_INDEX = (hour: number): number => {
  const h = (hour + 1) % 24;
  return Math.floor(h / 2);
};

const BASE_YEAR_STEM_INDEX = 4;
const BASE_YEAR_BRANCH_INDEX = 4;
const BASE_YEAR = 1984;

export function getYearPillarIndex(year: number) {
  const offset = year - BASE_YEAR;
  const stem = ((BASE_YEAR_STEM_INDEX + offset) % 10 + 10) % 10;
  const branch = ((BASE_YEAR_BRANCH_INDEX + offset) % 12 + 12) % 12;
  return { stem, branch };
}

export function getChineseZodiac(year: number) {
  const { branch } = getYearPillarIndex(year);
  return CHINESE_ZODIAC[branch];
}

export function getWesternZodiac(month: number, day: number) {
  const mmdd = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  for (const sign of WESTERN_ZODIAC) {
    const [start, end] = sign.range;
    if (start <= end) {
      if (mmdd >= start && mmdd <= end) return sign;
    } else {
      if (mmdd >= start || mmdd <= end) return sign;
    }
  }
  return WESTERN_ZODIAC[0];
}

function daysFromBase(year: number, month: number, day: number) {
  const target = Date.UTC(year, month - 1, day);
  const base = Date.UTC(1900, 0, 31);
  return Math.floor((target - base) / 86400000);
}

export function getDayPillarIndex(year: number, month: number, day: number) {
  const offset = daysFromBase(year, month, day);
  const stem = ((offset % 10) + 10) % 10;
  const branch = ((offset % 12) + 12) % 12;
  return { stem, branch };
}

export function getMonthPillarIndex(year: number, month: number) {
  const yearStem = getYearPillarIndex(year).stem;
  const monthBranch = (month + 1) % 12;
  const startStemMap = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stem = (startStemMap[yearStem] + (month - 1)) % 10;
  return { stem, branch: monthBranch };
}

export function getHourPillarIndex(
  year: number,
  month: number,
  day: number,
  hour: number,
) {
  const dayStem = getDayPillarIndex(year, month, day).stem;
  const branch = TWO_HOUR_BRANCH_INDEX(hour);
  const startStemMap = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const stem = (startStemMap[dayStem] + branch) % 10;
  return { stem, branch };
}

export interface BaziChart {
  year:  { stem: string; branch: string; stemCN: string; branchCN: string; element: FiveElement; branchElement: FiveElement };
  month: { stem: string; branch: string; stemCN: string; branchCN: string; element: FiveElement; branchElement: FiveElement };
  day:   { stem: string; branch: string; stemCN: string; branchCN: string; element: FiveElement; branchElement: FiveElement };
  hour:  { stem: string; branch: string; stemCN: string; branchCN: string; element: FiveElement; branchElement: FiveElement };
}

export function buildBaziChart(
  year: number,
  month: number,
  day: number,
  hour: number,
): BaziChart {
  const y = getYearPillarIndex(year);
  const m = getMonthPillarIndex(year, month);
  const d = getDayPillarIndex(year, month, day);
  const h = getHourPillarIndex(year, month, day, hour);

  const pack = (idx: { stem: number; branch: number }) => ({
    stem: HEAVENLY_STEMS[idx.stem],
    stemCN: HEAVENLY_STEMS_CN[idx.stem],
    branch: EARTHLY_BRANCHES[idx.branch],
    branchCN: EARTHLY_BRANCHES_CN[idx.branch],
    element: STEM_ELEMENT[idx.stem],
    branchElement: BRANCH_ELEMENT[idx.branch],
  });

  return { year: pack(y), month: pack(m), day: pack(d), hour: pack(h) };
}

export function countFiveElements(chart: BaziChart): Record<FiveElement, number> {
  const counts: Record<FiveElement, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0,
  };
  ([chart.year, chart.month, chart.day, chart.hour] as const).forEach((p) => {
    counts[p.element] += 1;
    counts[p.branchElement] += 1;
  });
  return counts;
}

export function dominantElement(counts: Record<FiveElement, number>): FiveElement {
  return (Object.keys(counts) as FiveElement[]).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b,
  );
}

export function deficientElement(counts: Record<FiveElement, number>): FiveElement {
  return (Object.keys(counts) as FiveElement[]).reduce((a, b) =>
    counts[a] <= counts[b] ? a : b,
  );
}
