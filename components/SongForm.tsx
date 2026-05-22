"use client";

import { useState } from "react";

interface SongFormProps {
  onSubmitted: () => void;
  twitchUrl?: string;
}

export function SongForm({ onSubmitted, twitchUrl }: SongFormProps) {
  const [title, setTitle] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, spotifyUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fehler beim Einreichen");
        return;
      }
      setTitle("");
      setSpotifyUrl("");
      setSuccess(true);
      onSubmitted();
      document.getElementById("hitparade")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setError("Netzwerkfehler — kurz warten und nochmal versuchen.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        id="song-form"
        className="rounded-2xl border-2 border-[var(--color-mw-green)]/50 bg-[var(--color-mw-green)]/10 p-6 text-center"
      >
        <p className="text-4xl" aria-hidden>
          🎉
        </p>
        <h2 className="font-[family-name:var(--font-display)] mt-2 text-xl font-bold text-white">
          Dein Song ist live in der Hitparade!
        </h2>
        <p className="mt-2 text-sm text-[#8b949e]">
          Nächster Schritt: Freunde zum Voten bitten — und falls noch nicht
          geschehen, auf Twitch folgen.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              document.getElementById("hitparade")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="w-full rounded-xl bg-[var(--color-mw-green)] py-3 font-bold text-[#0d1117]"
          >
            Zur Hitparade — jetzt voten lassen
          </button>
          {twitchUrl && (
            <a
              href={twitchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl border border-[var(--color-twitch)] py-3 font-semibold text-[var(--color-twitch)]"
            >
              Noch nicht gefolgt? Twitch öffnen →
            </a>
          )}
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-sm text-[#8b949e] hover:text-white"
          >
            Weiteren Song einreichen
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="song-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border-2 border-[var(--color-mw-green)]/30 bg-[var(--color-panel)] p-6 shadow-lg shadow-[var(--color-mw-green)]/5"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-[var(--color-mw-green)]/20 px-2 py-0.5 text-xs font-bold text-[var(--color-mw-green)]">
          Schritt 2
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
          Deinen Song einreichen
        </h2>
      </div>
      <p className="mb-5 text-sm text-[#8b949e]">
        Songtitel reicht — optional mit Spotify-Link zum Anhören.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-[#c9d1d9]">
            Songtitel *
          </label>
          <input
            id="title"
            required
            autoFocus
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Livin' on a Prayer"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[#0d1117] px-4 py-3.5 text-lg text-white placeholder:text-[#484f58] focus:border-[var(--color-mw-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-mw-green)]/40"
          />
        </div>
        <div>
          <label htmlFor="spotify" className="mb-1 block text-sm font-medium text-[#c9d1d9]">
            Spotify-Link <span className="font-normal text-[#484f58]">(optional)</span>
          </label>
          <input
            id="spotify"
            type="url"
            inputMode="url"
            maxLength={512}
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            placeholder="https://open.spotify.com/track/…"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[#0d1117] px-4 py-3 text-white placeholder:text-[#484f58] focus:border-[#1db954] focus:outline-none focus:ring-1 focus:ring-[#1db954]"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="mt-6 w-full rounded-xl bg-[var(--color-mw-green)] py-4 text-lg font-bold text-[#0d1117] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Wird eingetragen …" : "In die Hitparade — jetzt einreichen 🎵"}
      </button>
      <p className="mt-2 text-center text-xs text-[#484f58]">
        Kostenlos · sofort sichtbar · danach Freunde zum Voten einladen
      </p>
    </form>
  );
}
