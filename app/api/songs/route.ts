import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  getClientIp,
  parseSpotifyUrl,
  readJsonBody,
  sanitizeText,
} from "@/lib/security";
import { addSong, getSongs } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const songs = await getSongs();
  return NextResponse.json({ songs });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`song:${ip}`, 8, 60 * 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSec ?? 60);
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.data as Record<string, unknown>;
  const title = sanitizeText(
    typeof body.title === "string" ? body.title : "",
    120
  );
  const artist = sanitizeText(
    typeof body.artist === "string" ? body.artist : "",
    80
  );
  const submittedBy = sanitizeText(
    typeof body.submittedBy === "string" ? body.submittedBy : "",
    60
  );

  if (!title) {
    return NextResponse.json(
      { error: "Bitte einen Songtitel angeben (max. 120 Zeichen)." },
      { status: 400 }
    );
  }

  const spotifyRaw =
    typeof body.spotifyUrl === "string" ? body.spotifyUrl : "";
  const spotifyUrl = parseSpotifyUrl(spotifyRaw);
  if (spotifyRaw.trim() && !spotifyUrl) {
    return NextResponse.json(
      {
        error:
          "Ungültiger Spotify-Link. Bitte open.spotify.com (Track, Album, …) oder spotify:track:… verwenden.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await addSong(title, artist, submittedBy, spotifyUrl);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }
    return NextResponse.json({ song: result.song }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Etwas ist schiefgelaufen." }, { status: 500 });
  }
}
