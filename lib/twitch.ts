const TWITCH_LOGIN = process.env.TWITCH_CHANNEL || "mittwaldhosting";
const CACHE_MS = 5 * 60 * 1000;

let cached: { count: number; source: string; fetchedAt: string } | null = null;
let cachedAt = 0;

async function getAppAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string | null> {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });
  const res = await fetch(`https://id.twitch.tv/oauth2/token?${params}`, {
    method: "POST",
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function getBroadcasterId(
  login: string,
  clientId: string,
  token: string
): Promise<string | null> {
  const res = await fetch(
    `https://api.twitch.tv/helix/users?login=${encodeURIComponent(login)}`,
    {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 86400 },
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { data?: { id: string }[] };
  return data.data?.[0]?.id ?? null;
}

async function fetchViaHelix(login: string): Promise<number | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const token = await getAppAccessToken(clientId, clientSecret);
  if (!token) return null;

  const broadcasterId = await getBroadcasterId(login, clientId, token);
  if (!broadcasterId) return null;

  const res = await fetch(
    `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}&first=1`,
    {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;

  const data = (await res.json()) as { total?: number };
  return typeof data.total === "number" ? data.total : null;
}

async function fetchViaDecapi(login: string): Promise<number | null> {
  const res = await fetch(
    `https://decapi.me/twitch/followcount/${encodeURIComponent(login)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const text = (await res.text()).trim();
  const count = parseInt(text, 10);
  return Number.isFinite(count) ? count : null;
}

export async function getTwitchFollowerCount(): Promise<{
  count: number | null;
  channel: string;
  source: string | null;
  fetchedAt: string | null;
  error?: string;
}> {
  const channel = TWITCH_LOGIN;
  const now = Date.now();

  if (cached && now - cachedAt < CACHE_MS) {
    return {
      count: cached.count,
      channel,
      source: cached.source,
      fetchedAt: cached.fetchedAt,
    };
  }

  let count: number | null = null;
  let source: string | null = null;

  count = await fetchViaHelix(channel);
  if (count !== null) {
    source = "twitch-helix";
  } else {
    count = await fetchViaDecapi(channel);
    if (count !== null) source = "twitch-live";
  }

  const fetchedAt = new Date().toISOString();

  if (count !== null) {
    cached = { count, source: source!, fetchedAt };
    cachedAt = now;
    return { count, channel, source, fetchedAt };
  }

  return {
    count: null,
    channel,
    source: null,
    fetchedAt: null,
    error: "Follower-Zahl konnte nicht von Twitch geladen werden.",
  };
}

export const TWITCH_CHANNEL = TWITCH_LOGIN;
export const FOLLOWER_GOAL = 100;
