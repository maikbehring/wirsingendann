const MESSAGES = [
  "⚡ Jetzt folgen auf twitch.tv/mittwaldhosting — jeder Follower zählt",
  "🎵 Song einreichen = 1 Minute · Titel reicht",
  "🎤 Bei 100 Followern singen Fine & Maik den Hitparaden-Gewinner",
  "📅 Stream 28.05.2026 · 14–17 Uhr · Maschinenraum live",
  "▲ Nach dem Einreichen: Freunde zum Voten einladen",
  "🔥 Du kannst der entscheidende Follower sein",
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
