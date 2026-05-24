import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const PUBLIC_ALLOWED = process.env.PUBLIC_ALLOWED_ORIGIN ?? "*";

export function withCors(res: NextResponse): NextResponse {
  res.headers.set("Access-Control-Allow-Origin", PUBLIC_ALLOWED);
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Vary", "Origin");
  return res;
}

export async function preflight(): Promise<NextResponse> {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}
