import { NextResponse } from "next/server";
import { isAdminConfigured, isAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    authenticated: await isAdminSession(),
    configured: isAdminConfigured(),
  });
}
