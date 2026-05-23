import { NextResponse } from "next/server";
import { generateReading, type DivinationInput } from "@/lib/reading";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<DivinationInput>;

    if (!body.birthDate || typeof body.birthHour !== "number" || !body.gender) {
      return NextResponse.json(
        { error: "Missing required fields: birthDate, birthHour, gender" },
        { status: 400 },
      );
    }

    const result = await generateReading({
      name: body.name,
      gender: body.gender,
      birthDate: body.birthDate,
      birthHour: body.birthHour,
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to compute reading" },
      { status: 500 },
    );
  }
}
