import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8 text-center text-xs text-[#484f58]">
      <p>
        wirsingendann.de · Songvote für den Mittwald-Maschinenraum-Stream
      </p>
      <p className="mt-1">
        Virtuelle Kuchen wurden verworfen. Singen bleibt. 🎂❌ 🎤✅
      </p>
      <p className="mt-3 flex justify-center gap-4">
        <Link
          href="/impressum"
          className="text-[#8b949e] underline-offset-2 hover:text-[#c9d1d9] hover:underline"
        >
          Impressum
        </Link>
        <Link
          href="/admin"
          className="text-[#484f58] underline-offset-2 hover:text-[#8b949e] hover:underline"
        >
          Admin
        </Link>
      </p>
    </footer>
  );
}
