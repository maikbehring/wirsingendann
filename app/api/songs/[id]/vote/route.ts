import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  getClientIp,
  isValidUuid,
  MAX_VOTE_BODY_BYTES,
  readJsonBody,
} from "@/lib/security";
import { voteSong } from "@/lib/store";
import {
  isFriendlyCaptchaEnabled,
  verifyFriendlyCaptchaToken,
} from "@/lib/friendly-captcha";
import {
  getVoterIdFromRequest,
  hashClientIp,
} from "@/lib/voter-session";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "Ungültige Song-ID." }, { status: 400 });
  }

  const voterId = await getVoterIdFromRequest();
  if (!voterId) {
    return NextResponse.json(
      { error: "Keine gültige Voter-Session. Bitte Seite neu laden." },
      { status: 401 }
    );
  }

  const ip = getClientIp(request);
  const ipKey = hashClientIp(ip);

  const ipLimit = checkRateLimit(`vote-ip:${ipKey}`, 12, 60 * 1000);
  if (!ipLimit.allowed) {
    return rateLimitResponse(ipLimit.retryAfterSec ?? 30);
  }

  const parsed = await readJsonBody(request, MAX_VOTE_BODY_BYTES);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.data as Record<string, unknown>;
  const bodyVoterId =
    typeof body.voterId === "string" ? body.voterId.trim().toLowerCase() : "";

  if (bodyVoterId && bodyVoterId !== voterId) {
    return NextResponse.json({ error: "Ungültige Voter-Session." }, { status: 403 });
  }

  if (isFriendlyCaptchaEnabled()) {
    const captchaToken =
      typeof body.captchaToken === "string"
        ? body.captchaToken.trim()
        : typeof body.turnstileToken === "string"
          ? body.turnstileToken.trim()
          : "";
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha fehlt — bitte erneut voten und bestätigen." },
        { status: 400 }
      );
    }
    const captcha = await verifyFriendlyCaptchaToken(captchaToken);
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: 403 });
    }
  }

  const result = await voteSong(id, voterId, ipKey);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({ votes: result.votes });
}
