"use client";

interface FollowerMissionProps {
  current: number | null;
  goal: number;
  channel: string;
  loading?: boolean;
  error?: string | null;
  fetchedAt?: string | null;
  twitchUrl?: string;
  simulated?: boolean;
}

export function FollowerMission({
  current,
  goal,
  channel,
  loading,
  error,
  fetchedAt,
  twitchUrl = "https://www.twitch.tv/mittwaldhosting",
  simulated,
}: FollowerMissionProps) {
  const count = current ?? 0;
  const pct =
    current !== null ? Math.min(100, Math.round((count / goal) * 100)) : 0;
  const remaining = current !== null ? Math.max(0, goal - count) : null;
  const nextSlot = current !== null ? count + 1 : null;

  return (
    <section
      aria-labelledby="mission-heading"
      className="overflow-hidden rounded-2xl border-2 border-[var(--color-twitch)]/40 bg-gradient-to-br from-[var(--color-twitch)]/20 via-[var(--color-panel)] to-[var(--color-panel)] p-6 shadow-xl shadow-[var(--color-twitch)]/10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p
            id="mission-heading"
            className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl"
          >
            {loading
              ? "Mission lädt …"
              : remaining !== null && remaining > 0
                ? `Noch ${remaining} Follower bis zum Singen`
                : "Ziel erreicht — Singen steht an!"}
          </p>
          <p className="mt-2 text-[#c9d1d9]">
            {error ? (
              <span className="text-amber-400">{error}</span>
            ) : loading ? (
              "Live-Daten von Twitch …"
            ) : nextSlot ? (
              <>
                Du kannst{" "}
                <strong className="text-[var(--color-twitch)]">
                  Follower #{nextSlot}
                </strong>{" "}
                sein — folge{" "}
                <strong className="text-white">@{channel}</strong> und bring uns
                der Karaoke-Strafe näher.
              </>
            ) : null}
          </p>
          {simulated && !loading && (
            <p className="mt-2 text-xs font-medium text-amber-400">
              Vorschau-Modus (Simulation) — nicht die echte Twitch-Zahl
            </p>
          )}
          {!loading && !error && (
            <ul className="mt-4 space-y-1 text-sm text-[#8b949e]">
              <li>✓ Kostenlos — Twitch-Account reicht</li>
              <li>✓ Danach Song einreichen & Freunde zum Voten holen</li>
              <li>✓ Live-Stream 28.05. aus dem Maschinenraum</li>
            </ul>
          )}
        </div>

        <a
          href={twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-primary shrink-0 inline-flex items-center justify-center rounded-xl bg-[var(--color-twitch)] px-6 py-4 text-center text-base font-bold text-white shadow-lg shadow-[var(--color-twitch)]/40 transition hover:scale-[1.02] hover:brightness-110 sm:min-w-[200px]"
        >
          Jetzt folgen
          <br />
          <span className="text-xs font-normal opacity-90">twitch.tv/{channel}</span>
        </a>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-[#8b949e]">
          <span>Fortschritt zur 100-Follower-Marke</span>
          <span>
            {loading ? "…" : `${pct}%`}
          </span>
        </div>
        <div className="h-5 overflow-hidden rounded-full bg-[#21262d]">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-[var(--color-twitch)] via-[#b07cff] to-[var(--color-mw-green)] transition-all duration-700 ${
              loading ? "w-1/3 animate-pulse" : ""
            }`}
            style={loading ? undefined : { width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-[#8b949e]">
          {loading ? (
            "Zähler wird geladen …"
          ) : (
            <>
              <span className="text-2xl font-bold text-white">{count}</span>
              <span className="text-[#484f58]"> / {goal}</span> Follower
              {fetchedAt && (
                <span className="block text-xs text-[#484f58] mt-1">
                  Live-Stand · @{channel}
                </span>
              )}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
