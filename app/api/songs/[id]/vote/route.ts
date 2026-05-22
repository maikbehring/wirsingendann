import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  getClientIp,
  isValidUuid,
  readJsonBody,
} from "@/lib/security";
import { voteSong } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "Ungültige Song-ID." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const ipLimit = checkRateLimit(`vote-ip:${ip}`, 40, 60 * 1000);
  if (!ipLimit.allowed) {
    return rateLimitResponse(ipLimit.retryAfterSec ?? 30);
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.data as Record<string, unknown>;
  const voterId =
    typeof body.voterId === "string" ? body.voterId.trim() : "";

  if (!isValidUuid(voterId)) {
    return NextResponse.json({ error: "Ungültige Voter-ID." }, { status: 400 });
  }

  const voterLimit = checkRateLimit(`vote-voter:${voterId}`, 30, 60 * 1000);
  if (!voterLimit.allowed) {
    return rateLimitResponse(voterLimit.retryAfterSec ?? 30);
  }

  const result = await voteSong(id, voterId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({ votes: result.votes });
}
