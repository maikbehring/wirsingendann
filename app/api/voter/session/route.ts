import { NextResponse } from "next/server";
import {
  attachVoterCookie,
  createVoterToken,
  getVoterIdFromRequest,
} from "@/lib/voter-session";

export const dynamic = "force-dynamic";

/** Stellt httpOnly Voter-Cookie bereit — nicht per curl uuidgen fälschbar. */
export async function GET() {
  const existing = await getVoterIdFromRequest();
  if (existing) {
    return NextResponse.json({ voterId: existing, new: false });
  }
  const token = createVoterToken();
  const voterId = token.split(".")[0]!.toLowerCase();
  const res = NextResponse.json({ voterId, new: true });
  return attachVoterCookie(res, token);
}
