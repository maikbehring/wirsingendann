import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp, isValidUuid } from "@/lib/security";
import { deleteSong } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`admin-delete:${ip}`, 30, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSec ?? 30);
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "Ungültige Song-ID." }, { status: 400 });
  }

  const result = await deleteSong(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
