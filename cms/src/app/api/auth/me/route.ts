import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ data: null });
  return NextResponse.json({
    data: { uid: session.uid, email: session.email, role: session.role },
  });
}
