import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp, readJsonBody } from "@/lib/security";
import { getSettings, updateSettings } from "@/lib/settings";
import { FOLLOWER_GOAL } from "@/lib/twitch";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  const settings = await getSettings();
  return NextResponse.json({ settings, followerGoal: FOLLOWER_GOAL });
}

export async function PATCH(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`admin-settings:${ip}`, 20, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSec ?? 30);
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.data as Record<string, unknown>;
  const patch: {
    followerOverride?: number | null;
    simulateGoalReached?: boolean;
  } = {};

  if ("simulateGoalReached" in body) {
    patch.simulateGoalReached = Boolean(body.simulateGoalReached);
  }
  if ("followerOverride" in body) {
    const v = body.followerOverride;
    if (v === null) {
      patch.followerOverride = null;
    } else if (typeof v === "number" && Number.isFinite(v)) {
      patch.followerOverride = v;
    } else {
      return NextResponse.json(
        { error: "followerOverride muss Zahl oder null sein." },
        { status: 400 }
      );
    }
  }

  const settings = await updateSettings(patch);
  return NextResponse.json({ settings, followerGoal: FOLLOWER_GOAL });
}
