"use client";

import { FOLLOWER_GOAL, getFollowerCta, getUrgencyHeadline } from "@/lib/milestones";

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
    ? "Lade nächste Mission …"
    : getUrgencyHeadline(remaining);
  const twitchCta = getFollowerCta(remaining);

  return (
    <header className="relative mx-auto max-w-5xl px-4 pb-6 pt-8 text-center sm:pt-10">
      {!loading && remaining !== null && remaining <= 25 && (
        <p className="mb-4 inline-flex animate-cta-pulse items-center gap-2 rounded-full border border-[var(--color-twitch)]/50 bg-[var(--color-twitch)]/15 px-4 py-1.5 text-sm font-semibold text-[#c9d1d9]">
          🎸 Nächstes Ziel: Band-Auftritt bei {FOLLOWER_GOAL} Followern
        </p>
      )}

      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#8b949e]">
        wirsingendann.de · Road to {goal}
      </p>

      <h1 className="font-[family-name:var(--font-display)] mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
        {headline}
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8b949e]">
        Die 100er-Marke ist geschafft —{" "}
        <strong className="text-white">Angels</strong> wurde gesungen. Jetzt
        geht&apos;s Richtung{" "}
        <strong className="text-white">{goal} Follower</strong>: Dann spielen wir
        mit Band im nächsten Stream. Songwünsche für die Hitparade laufen
        weiter.
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
        {loading ? (
          "Live-Zähler lädt …"
        ) : (
          <>
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

      <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2 text-xs text-[#8b949e]">
        <span className="rounded-full border border-[var(--color-mw-green)]/40 bg-[var(--color-mw-green)]/10 px-3 py-1 text-[var(--color-mw-green)]">
          ✓ 100 Follower · Angels gesungen
        </span>
        <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
          🎸 Ziel: Band bei {goal}
        </span>
        <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
          📅 Nächster Stream · ca. Juli
        </span>
      </div>
    </header>
  );
}
