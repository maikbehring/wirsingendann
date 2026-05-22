const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_BODY_BYTES = 4096;

/** Steuerzeichen & HTML-Tags entfernen (Stored-XSS-Schutz). */
export function sanitizeText(
  value: string,
  maxLength: number
): string {
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLength);
}

export function isValidUuid(id: string): boolean {
  return UUID_RE.test(id) && id.length <= 36;
}

export async function readJsonBody(
  request: Request
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  const length = request.headers.get("content-length");
  if (length && parseInt(length, 10) > MAX_BODY_BYTES) {
    return { ok: false, status: 413, error: "Anfrage zu groß." };
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, status: 400, error: "Ungültige Anfrage." };
  }

  if (raw.length > MAX_BODY_BYTES) {
    return { ok: false, status: 413, error: "Anfrage zu groß." };
  }

  if (!raw.trim()) {
    return { ok: true, data: {} };
  }

  try {
    return { ok: true, data: JSON.parse(raw) };
  } catch {
    return { ok: false, status: 400, error: "Ungültiges JSON." };
  }
}

const SPOTIFY_PATH =
  /^\/(intl-[a-z]{2}\/)?(track|album|playlist|episode|show)\/[a-zA-Z0-9]+/;

/** Optional: nur https-Links zu open.spotify.com oder spotify: URIs. */
export function parseSpotifyUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const uri = trimmed.match(
    /^spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)$/i
  );
  if (uri) {
    return `https://open.spotify.com/${uri[1].toLowerCase()}/${uri[2]}`;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;

    const host = url.hostname.toLowerCase();
    if (host === "open.spotify.com" && SPOTIFY_PATH.test(url.pathname)) {
      const path = url.pathname.replace(/^\/intl-[a-z]{2}\//, "/");
      return `https://open.spotify.com${path.split("?")[0]}`;
    }
    if (
      (host === "spotify.link" || host === "www.spotify.link") &&
      /^\/[a-zA-Z0-9_-]{4,64}$/.test(url.pathname)
    ) {
      return `https://${host}${url.pathname}`;
    }
  } catch {
    return null;
  }

  return null;
}

/** Nur hinter Reverse-Proxy TRUST_PROXY=true setzen (sonst spoofbares X-Forwarded-For). */
export function getClientIp(request: Request): string {
  const trustProxy = process.env.TRUST_PROXY === "true";
  if (trustProxy) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() || "unknown";
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
  }
  return "direct";
}
