export function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Auf Twitch folgen",
      desc: "30 Sekunden — @mittwaldhosting — und du zählst für die 100er-Marke.",
      accent: "var(--color-twitch)",
    },
    {
      n: "2",
      title: "Song einreichen",
      desc: "Nur Songtitel — optional Spotify-Link zum Anhören.",
      accent: "var(--color-mw-green)",
    },
    {
      n: "3",
      title: "Votes sammeln",
      desc: "Teile deinen Eintrag. Der Spitzenreiter wird zum Sing-Zwang für Fine & Maik.",
      accent: "#f0b429",
    },
  ];

  return (
    <section aria-labelledby="how-heading" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
      <h2
        id="how-heading"
        className="font-[family-name:var(--font-display)] mb-6 text-center text-xl font-bold text-white"
      >
        So landet dein Lied im Stream
      </h2>
      <ol className="grid gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.n}
            className="relative rounded-xl border border-[var(--color-border)] bg-[#0d1117]/80 p-4 pt-8"
          >
            <span
              className="absolute -top-3 left-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: step.accent }}
            >
              {step.n}
            </span>
            <h3 className="font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-[#8b949e]">{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
