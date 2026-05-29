import { FOLLOWER_GOAL } from "@/lib/milestones";

interface FinalCtaProps {
  remaining: number | null;
  twitchUrl: string;
  onSongClick: () => void;
}

export function FinalCta({
  remaining,
  twitchUrl,
  onSongClick,
}: FinalCtaProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-twitch)]/30 bg-gradient-to-r from-[var(--color-twitch)]/15 to-[var(--color-mw-green)]/10 p-8 text-center">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
        {remaining !== null && remaining > 0
          ? `Hilf uns die ${remaining} Follower bis ${FOLLOWER_GOAL} zu schaffen`
          : "Band-Mission erfüllt — bis zum nächsten Stream!"}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-[#8b949e]">
        Nach „Head in the Cloud“ geht der Maschinenraum weiter — voraussichtlich
        im Juli, dann mit Band. Folge auf Twitch und stimme in der Hitparade mit.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-primary inline-flex justify-center rounded-xl bg-[var(--color-twitch)] px-8 py-3.5 font-bold text-white"
        >
          Auf Twitch folgen
        </a>
        <button
          type="button"
          onClick={onSongClick}
          className="inline-flex justify-center rounded-xl border border-[var(--color-mw-green)] px-8 py-3.5 font-bold text-[var(--color-mw-green)]"
        >
          Song einreichen
        </button>
      </div>
    </section>
  );
}
