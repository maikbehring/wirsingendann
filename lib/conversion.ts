export function getUrgencyHeadline(remaining: number | null): string {
  if (remaining === null) return "Fine & Maik singen euer Lied — bei 100 Followern";
  if (remaining <= 5) return `Nur noch ${remaining} Follower bis zum Sing-Zwang`;
  if (remaining <= 20) return `Nur noch ${remaining} Follower — dann wird gesungen`;
  return `Noch ${remaining} Follower bis Fine & Maik singen müssen`;
}

export function getFollowerCta(remaining: number | null): string {
  if (remaining !== null && remaining <= 10) {
    return `Jetzt folgen — nur ${remaining} fehlen`;
  }
  return "Kostenlos auf Twitch folgen";
}
