import { NextResponse } from "next/server";
import { getTurnstileSiteKey, isTurnstileEnabled } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteKey = getTurnstileSiteKey();
  return NextResponse.json({
    enabled: isTurnstileEnabled(),
    siteKey: siteKey ?? null,
  });
}
