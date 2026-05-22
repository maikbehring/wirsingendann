import { NextResponse } from "next/server";
import {
  attachSessionCookie,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp, readJsonBody } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin-Login ist nicht konfiguriert (ADMIN_PASSWORD fehlt)." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSec ?? 60);
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.data as Record<string, unknown>;
  const password = typeof body.password === "string" ? body.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  return attachSessionCookie(res);
}
