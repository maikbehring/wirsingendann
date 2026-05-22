import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Song, SongsData } from "./types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "songs.json");

export const MAX_SONGS = 200;
export const MAX_VOTES_PER_VOTER = 50;

const EMPTY_DATA: SongsData = { songs: [], voterIds: {} };

async function ensureDataFile(): Promise<SongsData> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as SongsData;
    if (!Array.isArray(parsed.songs)) parsed.songs = [];
    if (!parsed.voterIds || typeof parsed.voterIds !== "object") {
      parsed.voterIds = {};
    }
    return parsed;
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(EMPTY_DATA, null, 2));
    return { ...EMPTY_DATA };
  }
}

async function writeData(data: SongsData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, DATA_FILE);
}

export async function getSongs(): Promise<Song[]> {
  const data = await ensureDataFile();
  return [...data.songs].sort(
    (a, b) => b.votes - a.votes || a.title.localeCompare(b.title)
  );
}

export async function addSong(
  title: string,
  artist: string,
  submittedBy: string,
  spotifyUrl: string | null
): Promise<{ ok: true; song: Song } | { ok: false; error: string }> {
  const data = await ensureDataFile();
  if (data.songs.length >= MAX_SONGS) {
    return { ok: false, error: "Hitparade ist voll — später nochmal versuchen." };
  }
  const song: Song = {
    id: uuidv4(),
    title: title.trim(),
    artist: artist.trim() || "Unbekannt",
    submittedBy: submittedBy.trim() || "Anonym aus dem Maschinenraum",
    ...(spotifyUrl ? { spotifyUrl } : {}),
    votes: 0,
    createdAt: new Date().toISOString(),
  };
  data.songs.push(song);
  await writeData(data);
  return { ok: true, song };
}

export async function voteSong(
  songId: string,
  voterId: string
): Promise<{ ok: boolean; votes?: number; error?: string }> {
  const data = await ensureDataFile();
  const song = data.songs.find((s) => s.id === songId);
  if (!song) return { ok: false, error: "Song nicht gefunden" };

  const voted = data.voterIds[voterId] || [];
  if (voted.includes(songId)) {
    return { ok: false, error: "Du hast diesen Song schon gevotet" };
  }
  if (voted.length >= MAX_VOTES_PER_VOTER) {
    return { ok: false, error: "Vote-Limit erreicht." };
  }

  song.votes += 1;
  data.voterIds[voterId] = [...voted, songId];
  await writeData(data);
  return { ok: true, votes: song.votes };
}

export async function deleteSong(
  songId: string
): Promise<{ ok: boolean; error?: string }> {
  const data = await ensureDataFile();
  const before = data.songs.length;
  data.songs = data.songs.filter((s) => s.id !== songId);
  if (data.songs.length === before) {
    return { ok: false, error: "Song nicht gefunden" };
  }

  for (const voterId of Object.keys(data.voterIds)) {
    data.voterIds[voterId] = data.voterIds[voterId].filter((id) => id !== songId);
    if (data.voterIds[voterId].length === 0) {
      delete data.voterIds[voterId];
    }
  }

  await writeData(data);
  return { ok: true };
}
