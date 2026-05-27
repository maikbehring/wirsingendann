import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const VOTER_COOKIE = "wsd_voter";
const MAX_AGE_SEC = 60 * 60 * 24 * 365;

function secret(): string {
  return (
    process.env.VOTER_SECRET ||
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "wsd-voter-dev-only"
  );
}

function sign(voterId: string): string {
  return createHmac("sha256", secret()).update(voterId).digest("base64url");
}

export function createVoterToken(): string {
  const id = randomUUID();
  return `${id}.${sign(id)}`;
}

export function parseVoterToken(token: string | undefined): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const expected = sign(id);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    return timingSafeEqual(a, b) ? id.toLowerCase() : null;
  } catch {
    return null;
  }
}

export async function getVoterIdFromRequest(): Promise<string | null> {
  const jar = await cookies();
  return parseVoterToken(jar.get(VOTER_COOKIE)?.value);
}

export function attachVoterCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(VOTER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return response;
}

export function hashClientIp(ip: string): string {
  return createHmac("sha256", secret()).update(`ip:${ip}`).digest("hex").slice(0, 32);
}
