const MESSAGES = [
  "✓ 100 Follower — Angels (Robbie Williams) zu dritt gesungen",
  "🎸 Nächstes Ziel: 250 Follower = Auftritt mit Band",
  "📅 Nächster Stream nach Head in the Cloud · voraussichtlich Juli",
  "🎵 Songwünsche für die nächste Hitparade — weiter abstimmen",
  "⚡ Folge twitch.tv/mittwaldhosting für die Band-Mission",
  "▲ Voten lohnt sich — Gewinner-Song für den nächsten Stream",
];

export function Ticker() {
  const line = [...MESSAGES, ...MESSAGES].join("   ·   ");

  return (
    <div className="overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-panel)] py-2">
      <div className="animate-ticker flex whitespace-nowrap text-sm text-[#8b949e]">
        <span className="px-4">{line}</span>
        <span className="px-4" aria-hidden>
          {line}
        </span>
      </div>
    </div>
  );
}
