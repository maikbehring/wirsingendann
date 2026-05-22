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
  voterIds: Record<string, string[]>;
}
