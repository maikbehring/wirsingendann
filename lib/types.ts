export interface Song {
  id: string;
  title: string;
  artist: string;
  submittedBy: string;
  spotifyUrl?: string;
  votes: number;
  createdAt: string;
}

export interface SongsData {
  songs: Song[];
  /** @deprecated Legacy — weiterhin für Abwärtskompatibilität */
  voterIds: Record<string, string[]>;
  /** Gehashte Client-IP → Song-IDs (1 Vote pro IP pro Song) */
  ipVotes: Record<string, string[]>;
}
