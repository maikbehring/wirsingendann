import { NextResponse } from "next/server";
import {
  getFriendlyCaptchaRegion,
  getFriendlyCaptchaSiteKey,
  isFriendlyCaptchaEnabled,
} from "@/lib/friendly-captcha";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    enabled: isFriendlyCaptchaEnabled(),
    siteKey: getFriendlyCaptchaSiteKey(),
    region: getFriendlyCaptchaRegion(),
    provider: "friendly-captcha",
  });
}
