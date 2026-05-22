"use client";

import { useCallback, useEffect, useState } from "react";
import { ConversionHero } from "./ConversionHero";
import { GoalCelebration } from "./GoalCelebration";
import { FinalCta } from "./FinalCta";
import { FollowerMission } from "./FollowerMission";
import { Footer } from "./Footer";
import { HowItWorks } from "./HowItWorks";
import { SongForm } from "./SongForm";
import { SongList } from "./SongList";
import { StickyCta } from "./StickyCta";
import { Ticker } from "./Ticker";

interface Stats {
  followerCurrent: number | null;
  followerGoal: number;
  followerChannel: string;
  followerFetchedAt: string | null;
  followerError?: string;
  followerSimulated?: boolean;
  goalReached?: boolean;
  leaderTitle?: string | null;
  twitchUrl: string;
  songCount: number;
  totalVotes: number;
}

function scrollToSongForm() {
  document.getElementById("song-form")?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    followerCurrent: null,
    followerGoal: 100,
    followerChannel: "mittwaldhosting",
    followerFetchedAt: null,
    twitchUrl: "https://www.twitch.tv/mittwaldhosting",
    songCount: 0,
    totalVotes: 0,
  });

  const loadStats = useCallback(() => {
    setStatsLoading(true);
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setStats({
          followerCurrent: data.followerCurrent ?? null,
          followerGoal: data.followerGoal ?? 100,
          followerChannel: data.followerChannel ?? "mittwaldhosting",
          followerFetchedAt: data.followerFetchedAt ?? null,
          followerError: data.followerError,
          followerSimulated: data.followerSimulated ?? false,
          goalReached: data.goalReached ?? false,
          leaderTitle: data.leaderTitle ?? null,
          twitchUrl: data.twitchUrl ?? "https://www.twitch.tv/mittwaldhosting",
          songCount: data.songCount ?? 0,
          totalVotes: data.totalVotes ?? 0,
        });
      })
      .catch(() => {
        setStats((s) => ({
          ...s,
          followerError: "Statistiken konnten nicht geladen werden.",
        }));
      })
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, refreshKey]);

  const remaining =
    stats.followerCurrent !== null
      ? Math.max(0, stats.followerGoal - stats.followerCurrent)
      : null;

  const handleSubmitted = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="gradient-maschinenraum min-h-screen pb-24 md:pb-0">
      <Ticker />

      <GoalCelebration
        active={!statsLoading && Boolean(stats.goalReached)}
        leaderTitle={stats.leaderTitle}
      />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 grid-bg" />

        <ConversionHero
          remaining={remaining}
          current={stats.followerCurrent}
          goal={stats.followerGoal}
          loading={statsLoading}
          twitchUrl={stats.twitchUrl}
          songCount={stats.songCount}
          onSongClick={scrollToSongForm}
        />

        <main className="relative mx-auto max-w-5xl space-y-8 px-4 pb-16">
          <FollowerMission
            current={stats.followerCurrent}
            goal={stats.followerGoal}
            channel={stats.followerChannel}
            loading={statsLoading}
            error={stats.followerError}
            fetchedAt={stats.followerFetchedAt}
            twitchUrl={stats.twitchUrl}
            simulated={stats.followerSimulated}
          />

          <HowItWorks />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Follower live",
                value: statsLoading ? "…" : (stats.followerCurrent ?? "—"),
                sub: stats.followerSimulated
                  ? "Admin-Simulation aktiv"
                  : `Ziel: ${stats.followerGoal}`,
                highlight: true,
              },
              {
                label: "Songwünsche",
                value: statsLoading ? "…" : stats.songCount,
                sub: stats.songCount === 0 ? "Sei der Erste!" : "in der Hitparade",
              },
              {
                label: "Community-Votes",
                value: statsLoading ? "…" : stats.totalVotes,
                sub: "Stimmen gesamt",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border p-4 text-center ${
                  item.highlight
                    ? "border-[var(--color-twitch)]/50 bg-[var(--color-twitch)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-panel)]"
                }`}
              >
                <p className="text-xs uppercase tracking-wide text-[#8b949e]">
                  {item.label}
                </p>
                <p className="font-[family-name:var(--font-display)] mt-1 text-3xl font-bold text-white">
                  {item.value}
                </p>
                <p className="text-xs text-[#8b949e]">{item.sub}</p>
              </div>
            ))}
          </div>

          <section id="mitmachen" aria-labelledby="mitmachen-heading">
            <h2
              id="mitmachen-heading"
              className="font-[family-name:var(--font-display)] mb-6 text-center text-2xl font-bold text-white"
            >
              Jetzt mitmachen
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="order-1">
                <SongForm
                  onSubmitted={handleSubmitted}
                  twitchUrl={stats.twitchUrl}
                />
              </div>
              <div className="order-2">
                <SongList
                  refreshKey={refreshKey}
                  onSuggestClick={scrollToSongForm}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center text-sm text-[#8b949e]">
            <p className="mb-2 font-semibold text-[#c9d1d9]">
              Stream am 28.05.2026 · 14–17 Uhr
            </p>
            <p>
              Roadmap · Kundenlive · KI-Stunde — interaktiv, kein Vortrag. Du
              stellst Fragen, wir antworten live.
            </p>
            <p className="mt-4 italic text-[var(--color-twitch)]">
              „VON SINGEN HAB ICH NIX GESAGT“ — Josefine (trotzdem wird’s
              lustig)
            </p>
          </section>

          <FinalCta
            remaining={remaining}
            twitchUrl={stats.twitchUrl}
            onSongClick={scrollToSongForm}
          />
        </main>

        <Footer />
      </div>

      <StickyCta
        remaining={remaining}
        twitchUrl={stats.twitchUrl}
        onSongClick={scrollToSongForm}
      />
    </div>
  );
}
