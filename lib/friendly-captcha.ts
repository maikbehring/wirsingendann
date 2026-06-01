/** Friendly Captcha v2 — https://developer.friendlycaptcha.com/ */

export type FriendlyCaptchaRegion = "eu" | "global";

const SITEVERIFY_PATH = "/api/v2/captcha/siteverify";

export function getFriendlyCaptchaRegion(): FriendlyCaptchaRegion {
  const raw = process.env.FRIENDLY_CAPTCHA_REGION?.trim().toLowerCase();
  return raw === "global" ? "global" : "eu";
}

export function getFriendlyCaptchaApiBase(): string {
  return getFriendlyCaptchaRegion() === "eu"
    ? "https://eu.frcapi.com"
    : "https://global.frcapi.com";
}

export function isFriendlyCaptchaEnabled(): boolean {
  return Boolean(getFriendlyCaptchaSiteKey() && getFriendlyCaptchaApiKey());
}

export function getFriendlyCaptchaSiteKey(): string | null {
  const key =
    process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY?.trim();
  return key || null;
}

function getFriendlyCaptchaApiKey(): string | null {
  return process.env.FRIENDLY_CAPTCHA_API_KEY?.trim() || null;
}

export async function verifyFriendlyCaptchaToken(
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = getFriendlyCaptchaApiKey();
  if (!apiKey) {
    return {
      ok: false,
      error: "Captcha ist nicht konfiguriert (FRIENDLY_CAPTCHA_API_KEY fehlt).",
    };
  }

  const trimmed = token.trim();
  if (!trimmed || trimmed.length > 16_384) {
    return { ok: false, error: "Captcha ungültig — bitte erneut versuchen." };
  }

  const sitekey = getFriendlyCaptchaSiteKey();
  const body: Record<string, string> = { response: trimmed };
  if (sitekey) body.sitekey = sitekey;

  let res: Response;
  try {
    res = await fetch(`${getFriendlyCaptchaApiBase()}${SITEVERIFY_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
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
    error?: { error_code?: string; detail?: string };
  };

  if (data.success) return { ok: true };

  const code = data.error?.error_code ?? "unknown";
  console.warn("[friendly-captcha] verification failed:", code, data.error?.detail);

  if (code === "response_timeout" || code === "response_duplicate") {
    return {
      ok: false,
      error: "Captcha abgelaufen — bitte erneut bestätigen.",
    };
  }

  return {
    ok: false,
    error: "Captcha ungültig — bitte erneut bestätigen.",
  };
}
