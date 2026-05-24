import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { createSession, findUserByEmail, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await verifyPassword(password, user.password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    await createSession({
      uid: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      data: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
