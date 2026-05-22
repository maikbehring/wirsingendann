const VOTER_KEY = "wirsingendann-voter-id";

export function getVoterId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

export function getVotedSongIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("wirsingendann-voted");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markVoted(songId: string): void {
  const voted = getVotedSongIds();
  if (!voted.includes(songId)) {
    localStorage.setItem(
      "wirsingendann-voted",
      JSON.stringify([...voted, songId])
    );
  }
}
