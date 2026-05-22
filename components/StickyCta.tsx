"use client";

interface StickyCtaProps {
  remaining: number | null;
  twitchUrl: string;
  onSongClick: () => void;
}

export function StickyCta({
  remaining,
  twitchUrl,
  onSongClick,
}: StickyCtaProps) {
  const twitchLabel =
    remaining !== null && remaining <= 10
      ? `Folgen (${remaining})`
      : "Twitch folgen";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[#0d1117]/95 p-3 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-primary flex-1 rounded-lg bg-[var(--color-twitch)] py-3.5 text-center text-sm font-bold text-white"
        >
          {twitchLabel}
        </a>
        <button
          type="button"
          onClick={onSongClick}
          className="flex-1 rounded-lg border border-[var(--color-mw-green)] bg-[var(--color-mw-green)]/15 py-3.5 text-sm font-bold text-[var(--color-mw-green)]"
        >
          Song einreichen
        </button>
      </div>
    </div>
  );
}
