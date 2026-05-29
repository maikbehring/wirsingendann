import { FOLLOWER_GOAL } from "@/lib/milestones";

export function HowItWorks() {
  const steps = [
    {
      n: "✓",
      title: "100 Follower — geschafft",
      desc: "Angels von Robbie Williams — zu dritt gesungen. Versprechen eingelöst.",
      accent: "var(--color-mw-green)",
    },
    {
      n: "1",
      title: "Auf Twitch folgen",
      desc: `Jeder Follower zählt Richtung ${FOLLOWER_GOAL} — dann Band im Stream.`,
      accent: "var(--color-twitch)",
    },
    {
      n: "2",
      title: "Song & Votes",
      desc: "Hitparade für den nächsten Maschinenraum — Titel reichen, optional Spotify.",
      accent: "#f0b429",
    },
  ];

  return (
    <section
      aria-labelledby="how-heading"
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
    >
      <h2
        id="how-heading"
        className="font-[family-name:var(--font-display)] mb-6 text-center text-xl font-bold text-white"
      >
        Mission Update — was als Nächstes kommt
      </h2>
      <ol className="grid gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.title}
            className="relative rounded-xl border border-[var(--color-border)] bg-[#0d1117]/80 p-4 pt-8"
          >
            <span
              className="absolute -top-3 left-4 flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-bold text-white"
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
