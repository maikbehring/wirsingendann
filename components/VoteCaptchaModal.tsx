"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useCallback, useEffect, useRef, useState } from "react";

interface VoteCaptchaModalProps {
  open: boolean;
  siteKey: string;
  songTitle: string | null;
  onClose: () => void;
  onVerified: (token: string) => void;
}

export function VoteCaptchaModal({
  open,
  siteKey,
  songTitle,
  onClose,
  onVerified,
}: VoteCaptchaModalProps) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      turnstileRef.current?.reset();
    }
  }, [open]);

  const handleSuccess = useCallback(
    (token: string) => {
      setError(null);
      onVerified(token);
    },
    [onVerified]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="captcha-title"
        className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-[#8b949e] transition hover:bg-[#21262d] hover:text-white"
          aria-label="Schließen"
        >
          ✕
        </button>

        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-twitch)]">
          Kurz bestätigen
        </p>
        <h2
          id="captcha-title"
          className="font-[family-name:var(--font-display)] mt-2 pr-8 text-xl font-bold text-white"
        >
          Vote für {songTitle ? `„${songTitle}"` : "diesen Song"}
        </h2>
        <p className="mt-2 text-sm text-[#8b949e]">
          Ein Klick — damit Bots nicht die Hitparade manipulieren können.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex min-h-[65px] justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onSuccess={handleSuccess}
            onError={() =>
              setError("Captcha konnte nicht geladen werden — Seite neu laden.")
            }
            onExpire={() => {
              setError("Captcha abgelaufen — bitte erneut bestätigen.");
              turnstileRef.current?.reset();
            }}
            options={{
              theme: "dark",
              size: "normal",
              language: "de",
            }}
          />
        </div>

        <p className="mt-4 text-center text-[10px] text-[#484f58]">
          Geschützt durch Cloudflare Turnstile
        </p>
      </div>
    </div>
  );
}
