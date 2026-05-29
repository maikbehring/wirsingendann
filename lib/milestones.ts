export const FOLLOWER_GOAL = 250;
export const MILESTONE_100 = 100;

export const ACCOMPLISHED_SONG = "Angels";
export const ACCOMPLISHED_ARTIST = "Robbie Williams";

export function getUrgencyHeadline(remaining: number | null): string {
  if (remaining === null) return "250 Follower — dann mit Band live";
  if (remaining <= 10) return `Nur noch ${remaining} Follower bis zum Band-Auftritt`;
  if (remaining <= 40) return `Noch ${remaining} Follower — Band wartet im Proberaum`;
  return `Noch ${remaining} Follower bis wir mit Band auftreten`;
}

export function getFollowerCta(remaining: number | null): string {
  if (remaining !== null && remaining <= 15) {
    return `Folgen — nur ${remaining} bis zur Band`;
  }
  return "Auf Twitch folgen";
}
