/** Cloudflare Turnstile — Siteverify (https://developers.cloudflare.com/turnstile/) */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Test-Keys (immer bestanden) — nur für lokale Entwicklung ohne eigene Keys */
const DEV_SITE_KEY = "1x00000000000000000000AA";
const DEV_SECRET_KEY = "1x0000000000000000000000000000000AA";

export function isTurnstileEnabled(): boolean {
  return Boolean(getTurnstileSiteKey() && getTurnstileSecretKey());
}

export function getTurnstileSiteKey(): string | null {
  const configured = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return DEV_SITE_KEY;
  return null;
}

function getTurnstileSecretKey(): string | null {
  const configured = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return DEV_SECRET_KEY;
  return null;
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = getTurnstileSecretKey();
  if (!secret) {
    return {
      ok: false,
      error: "Captcha ist nicht konfiguriert (TURNSTILE_SECRET_KEY fehlt).",
    };
  }

  const trimmed = token.trim();
  if (!trimmed || trimmed.length > 2048) {
    return { ok: false, error: "Captcha ungültig — bitte erneut versuchen." };
  }

  const body = new URLSearchParams({
    secret,
    response: trimmed,
  });
  if (remoteIp && remoteIp !== "unknown") {
    body.set("remoteip", remoteIp);
  }

  let res: Response;
  try {
    res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      error: "Captcha-Prüfung vorübergehend nicht erreichbar.",
    };
  }

  if (!res.ok) {
    return { ok: false, error: "Captcha-Prüfung fehlgeschlagen." };
  }

  const data = (await res.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  if (data.success) return { ok: true };

  const codes = data["error-codes"]?.join(", ") ?? "unknown";
  console.warn("[turnstile] verification failed:", codes);

  return {
    ok: false,
    error: "Captcha abgelaufen oder ungültig — bitte erneut bestätigen.",
  };
}
