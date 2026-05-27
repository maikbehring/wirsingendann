const VOTED_KEY = "wirsingendann-voted";

let sessionPromise: Promise<string> | null = null;

/** Holt signierte Voter-ID vom Server (httpOnly-Cookie). */
export async function ensureVoterSession(): Promise<string> {
  if (sessionPromise) return sessionPromise;
  sessionPromise = fetch("/api/voter/session", { credentials: "include" })
    .then(async (res) => {
      if (!res.ok) throw new Error("Voter-Session fehlgeschlagen");
      const data = (await res.json()) as { voterId?: string };
      if (!data.voterId) throw new Error("Keine Voter-ID");
      return data.voterId;
    })
    .catch((err) => {
      sessionPromise = null;
      throw err;
    });
  return sessionPromise;
}

export function getVotedSongIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markVoted(songId: string): void {
  const voted = getVotedSongIds();
  if (!voted.includes(songId)) {
    localStorage.setItem(VOTED_KEY, JSON.stringify([...voted, songId]));
  }
}
