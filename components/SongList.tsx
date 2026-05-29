"use client";

import { useCallback, useEffect, useState } from "react";
import type { Song } from "@/lib/types";
import { ensureVoterSession, getVotedSongIds, markVoted } from "@/lib/voter";

function rankEmoji(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

interface SongListProps {
  refreshKey: number;
  onSuggestClick?: () => void;
}

export function SongList({ refreshKey, onSuggestClick }: SongListProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [voteError, setVoteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data.songs || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setVotedIds(getVotedSongIds());
    ensureVoterSession().catch(() => {});
    load();
  }, [load, refreshKey]);

  async function handleVote(songId: string) {
    setVoteError(null);
    let voterId: string;
    try {
      voterId = await ensureVoterSession();
    } catch {
      setVoteError("Session konnte nicht geladen werden — Seite neu laden.");
      return;
    }
    const res = await fetch(`/api/songs/${songId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ voterId }),
    });
    const data = await res.json();

    if (!res.ok) {
      setVoteError(data.error);
      if (res.status === 409) {
        markVoted(songId);
        setVotedIds(getVotedSongIds());
      }
      return;
    }

    markVoted(songId);
    setVotedIds(getVotedSongIds());
    setSongs((prev) =>
      [...prev]
        .map((s) => (s.id === songId ? { ...s, votes: data.votes } : s))
        .sort((a, b) => b.votes - a.votes)
    );
  }

  if (loading) {
    return (
      <div
        id="hitparade"
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-12 text-center text-[#8b949e]"
      >
        Hitparade wird geladen …
      </div>
    );
  }

  const leader = songs[0];

  return (
    <div
      id="hitparade"
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
    >
      <h2 className="font-[family-name:var(--font-display)] mb-1 text-xl font-bold text-white">
        🏆 Live-Hitparade
      </h2>
      <p className="mb-5 text-sm text-[#8b949e]">
        {leader ? (
          <>
            Spitzenreiter:{" "}
            <strong className="text-white">{leader.title}</strong> mit{" "}
            <strong className="text-[var(--color-mw-green)]">
              {leader.votes} Votes
            </strong>{" "}
            — hol deinen Song nach oben!
          </>
        ) : (
          "Noch leer — der erste Eintrag hat die besten Chancen für den Band-Stream."
        )}
      </p>

      {voteError && (
        <p className="mb-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {voteError}
        </p>
      )}

      {songs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-mw-green)]/40 bg-[var(--color-mw-green)]/5 py-10 text-center">
          <p className="text-lg font-semibold text-white">
            Die Hitparade wartet auf dich
          </p>
          <p className="mt-2 text-sm text-[#8b949e]">
            Erster Song = maximale Sichtbarkeit. Dauert eine Minute.
          </p>
          {onSuggestClick && (
            <button
              type="button"
              onClick={onSuggestClick}
              className="mt-6 rounded-xl bg-[var(--color-mw-green)] px-6 py-3 font-bold text-[#0d1117]"
            >
              Jetzt ersten Song einreichen
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {songs.map((song, index) => {
            const voted = votedIds.includes(song.id);
            const rank = index + 1;
            return (
              <li
                key={song.id}
                className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-4 transition ${
                  rank === 1
                    ? "border-[var(--color-twitch)]/50 bg-[var(--color-twitch)]/10 animate-pulse-glow"
                    : "border-[var(--color-border)] bg-[#0d1117]/60"
                }`}
              >
                <span className="w-10 text-center text-lg font-bold text-[#8b949e]">
                  {rankEmoji(rank)}
                </span>
                <div className="min-w-0 flex-1">
                  {rank === 1 && (
                    <span className="mb-1 inline-block rounded text-[10px] font-bold uppercase tracking-wide text-[var(--color-twitch)]">
                      Favorit für den Band-Stream
                    </span>
                  )}
                  <p className="font-semibold text-white truncate">{song.title}</p>
                  {song.spotifyUrl && (
                    <p className="text-xs text-[#1db954]">Mit Spotify-Link</p>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {song.spotifyUrl && (
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[#1db954]/40 bg-[#1db954]/15 px-3 py-2 text-sm font-semibold text-[#1db954] transition hover:bg-[#1db954]/25"
                    >
                      ▶ Spotify
                    </a>
                  )}
                  <span className="min-w-[3ch] text-right font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-mw-green)]">
                    {song.votes}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleVote(song.id)}
                    disabled={voted}
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                      voted
                        ? "cursor-not-allowed bg-[#21262d] text-[#484f58]"
                        : "bg-[var(--color-mw-green)] text-[#0d1117] hover:brightness-110"
                    }`}
                  >
                    {voted ? "✓ Vote" : "▲ Vote"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {songs.length > 0 && onSuggestClick && (
        <button
          type="button"
          onClick={onSuggestClick}
          className="mt-4 w-full text-center text-sm text-[var(--color-mw-green)] hover:underline"
        >
          + Eigenen Song einreichen
        </button>
      )}
    </div>
  );
}
