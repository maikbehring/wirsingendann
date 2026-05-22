import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum — wirsingendann.de",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="gradient-maschinenraum min-h-screen px-4 py-16">
      <article className="mx-auto max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-8 text-[#c9d1d9]">
        <h1 className="font-[family-name:var(--font-display)] mb-6 text-2xl font-bold text-white">
          Impressum
        </h1>

        <p className="mb-6 text-sm text-[#8b949e]">
          Privates Fun-Projekt zur Song-Abstimmung im Rahmen des
          Mittwald-Maschinenraum-Streams.
        </p>

        <section className="space-y-4 text-sm leading-relaxed">
          <div>
            <h2 className="mb-1 font-semibold text-white">Verantwortlich</h2>
            <p>Maik Behring</p>
            <p>Bahnhofstraße 20</p>
            <p>32257 Bünde</p>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:hallo@maikbehring.de"
                className="text-[var(--color-twitch)] hover:underline"
              >
                hallo@maikbehring.de
              </a>
            </p>
          </div>

          <div>
            <h2 className="mb-1 font-semibold text-white">Hinweis</h2>
            <p className="text-[#8b949e]">
              Diese Seite ist ein unverbindliches Fan- bzw. Community-Projekt
              ohne gewerblichen Charakter. Songwünsche und Votes werden lokal
              gespeichert; es werden keine personenbezogenen Daten über das
              technisch Notwendige hinaus erhoben.
            </p>
          </div>
        </section>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-[var(--color-twitch)] hover:underline"
        >
          ← Zurück zur Hitparade
        </Link>
      </article>
    </div>
  );
}
