import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const TOKEN_NAME = "lingyun_cms_session";
const ONE_WEEK = 60 * 60 * 24 * 7;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  uid: string;
  email: string;
  role: "ADMIN" | "EDITOR";
}

export async function createSession(payload: Omit<SessionPayload, "iat" | "exp">) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ONE_WEEK}s`)
    .sign(getSecretKey());

  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK,
    path: "/",
  });
}

export async function destroySession() {
  cookies().delete(TOKEN_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(TOKEN_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Response("Unauthorized", { status: 401 });
  return session;
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}
