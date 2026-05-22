"use client";

import { getFollowerCta, getUrgencyHeadline } from "@/lib/conversion";

interface ConversionHeroProps {
  remaining: number | null;
  current: number | null;
  goal: number;
  loading: boolean;
  twitchUrl: string;
  songCount: number;
  onSongClick: () => void;
}

export function ConversionHero({
  remaining,
  current,
  goal,
  loading,
  twitchUrl,
  songCount,
  onSongClick,
}: ConversionHeroProps) {
  const headline = loading
    ? "Lade Live-Mission …"
    : getUrgencyHeadline(remaining);
  const twitchCta = getFollowerCta(remaining);

  return (
    <header className="relative mx-auto max-w-5xl px-4 pb-6 pt-10 text-center sm:pt-12">
      {!loading && remaining !== null && remaining <= 15 && (
        <p className="mb-4 inline-flex animate-cta-pulse items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/15 px-4 py-1.5 text-sm font-semibold text-amber-200">
          🔥 Fast geschafft — jeder Follower zählt jetzt
        </p>
      )}

      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#8b949e]">
        wirsingendann.de · Community-Mission
      </p>

      <h1 className="font-[family-name:var(--font-display)] mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
        {headline}
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8b949e]">
        <strong className="text-white">2 Klicks</strong> und du bist dabei: Twitch
        folgen + Songwunsch einreichen. Bei{" "}
        <strong className="text-white">{goal} Followern</strong> singen Josefine &
        Maik den Gewinner-Song aus der Hitparade — live im Maschinenraum.
      </p>

      <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-primary group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-twitch)] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[var(--color-twitch)]/30 transition hover:scale-[1.02] hover:brightness-110"
        >
          <span>{twitchCta}</span>
          <span className="text-sm font-normal opacity-90">→ 30 Sek.</span>
        </a>
        <button
          type="button"
          onClick={onSongClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-mw-green)] bg-[var(--color-mw-green)]/10 px-8 py-4 text-lg font-bold text-[var(--color-mw-green)] transition hover:bg-[var(--color-mw-green)]/20"
        >
          Song einreichen
          <span className="text-sm font-normal opacity-80">→ 1 Min.</span>
        </button>
      </div>

      <p className="mt-4 text-xs text-[#484f58]">
        Kostenlos · kein Login auf dieser Seite ·{" "}
        {loading ? (
          "Live-Zähler lädt …"
        ) : (
          <>
            aktuell{" "}
            <strong className="text-[#8b949e]">{current ?? "—"}</strong> / {goal}{" "}
            Follower
            {songCount > 0 && (
              <>
                {" "}
                · <strong className="text-[#8b949e]">{songCount}</strong> Songs in
                der Hitparade
              </>
            )}
          </>
        )}
      </p>

      <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2 text-xs text-[#8b949e]">
        <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
          📅 Stream 28.05. · 14–17 Uhr
        </span>
        <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
          🎤 Gewinner-Song wird gesungen
        </span>
        <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
          ▲ Community votet
        </span>
      </div>
    </header>
  );
}
