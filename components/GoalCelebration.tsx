"use client";

import { useEffect, useRef } from "react";
import { FOLLOWER_GOAL } from "@/lib/milestones";

interface GoalCelebrationProps {
  active: boolean;
}

const COLORS = ["#9146ff", "#2ecc71", "#f0b429", "#ff6b9d", "#58a6ff", "#ffffff"];
const CONFETTI_KEY = "wirsingendann-confetti-250";

function fireConfetti(canvas: HTMLCanvasElement, durationMs: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rot: number;
    vr: number;
  };

  const particles: Particle[] = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    size: 4 + Math.random() * 6,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.2,
  }));

  const start = performance.now();
  let frame = 0;

  function tick(now: number) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.vr;
      if (p.y > canvas.height + 20) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
        p.vy = 2 + Math.random() * 3;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    frame = requestAnimationFrame(tick);
    if (now - start > durationMs) {
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener("resize", resize);
    }
  }

  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
  };
}

export function GoalCelebration({ active }: GoalCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    if (sessionStorage.getItem(CONFETTI_KEY)) return;
    sessionStorage.setItem(CONFETTI_KEY, "1");
    return fireConfetti(canvasRef.current, 9000);
  }, [active]);

  if (!active) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[100]"
        aria-hidden
      />
      <div
        role="status"
        className="relative z-[101] mx-auto max-w-5xl px-4 pt-4"
      >
        <div className="animate-goal-banner rounded-2xl border-2 border-[var(--color-twitch)] bg-gradient-to-r from-[var(--color-twitch)]/40 via-[#b07cff]/20 to-[var(--color-mw-green)]/30 px-6 py-5 text-center shadow-lg shadow-[var(--color-twitch)]/25">
          <p className="text-3xl" aria-hidden>
            🎸🥁🎤
          </p>
          <h2 className="font-[family-name:var(--font-display)] mt-2 text-2xl font-bold text-white sm:text-3xl">
            {FOLLOWER_GOAL} Follower — wir treten mit Band auf!
          </h2>
          <p className="mt-2 text-[#c9d1d9]">
            Mission Band: erfüllt. Den nächsten Maschinenraum-Stream gibt&apos;s
            mit voller Besetzung — Details folgen.
          </p>
        </div>
      </div>
    </>
  );
}
