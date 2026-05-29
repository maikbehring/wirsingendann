import { ACCOMPLISHED_ARTIST, ACCOMPLISHED_SONG, MILESTONE_100 } from "@/lib/milestones";

export function AccomplishedBanner() {
  return (
    <section
      aria-labelledby="accomplished-heading"
      className="relative z-[1] mx-auto max-w-5xl px-4 pt-6"
    >
      <div className="rounded-2xl border-2 border-[var(--color-mw-green)]/50 bg-gradient-to-br from-[var(--color-mw-green)]/15 via-[var(--color-panel)] to-[var(--color-twitch)]/10 p-6 sm:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-mw-green)]">
          ✓ {MILESTONE_100} Follower — erledigt
        </p>
        <h2
          id="accomplished-heading"
          className="font-[family-name:var(--font-display)] mt-3 text-center text-2xl font-bold text-white sm:text-3xl"
        >
          Wir haben{" "}
          <span className="text-[var(--color-mw-green)]">{ACCOMPLISHED_SONG}</span>{" "}
          gesungen
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#c9d1d9]">
          <strong className="text-white">{ACCOMPLISHED_ARTIST}</strong> — zu dritt im
          Maschinenraum. Danke an alle, die mitgemacht und gefolgt haben. Das
          Versprechen ist eingelöst.
        </p>
        <p className="mt-4 text-center text-sm text-[#8b949e]">
          🎤 Josefine · Maik · und die Community — live aus dem Maschinenraum
        </p>
      </div>
    </section>
  );
}
