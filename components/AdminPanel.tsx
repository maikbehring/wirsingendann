"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Song } from "@/lib/types";

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [simulateGoal, setSimulateGoal] = useState(false);
  const [overrideCount, setOverrideCount] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  const loadSongs = useCallback(async () => {
    const res = await fetch("/api/songs", { cache: "no-store" });
    const data = await res.json();
    setSongs(data.songs || []);
  }, []);

  const loadSettings = useCallback(async () => {
    const res = await fetch("/api/admin/settings", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setSimulateGoal(Boolean(data.settings?.simulateGoalReached));
    const ov = data.settings?.followerOverride;
    setOverrideCount(ov === null || ov === undefined ? "" : String(ov));
  }, []);

  async function patchSettings(
    patch: Record<string, unknown>,
    message: string
  ) {
    setSettingsLoading(true);
    setSettingsMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsMsg(data.error || "Speichern fehlgeschlagen");
        return;
      }
      setSimulateGoal(Boolean(data.settings?.simulateGoalReached));
      const ov = data.settings?.followerOverride;
      setOverrideCount(ov === null || ov === undefined ? "" : String(ov));
      setSettingsMsg(message);
    } finally {
      setSettingsLoading(false);
    }
  }

  const checkSession = useCallback(async () => {
    const res = await fetch("/api/admin/me", { cache: "no-store" });
    const data = await res.json();
    setConfigured(data.configured ?? false);
    setAuthenticated(data.authenticated ?? false);
    setLoading(false);
    if (data.authenticated) {
      await Promise.all([loadSongs(), loadSettings()]);
    }
  }, [loadSongs, loadSettings]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error || "Login fehlgeschlagen");
      return;
    }
    setPassword("");
    setAuthenticated(true);
    await Promise.all([loadSongs(), loadSettings()]);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setSongs([]);
  }

  async function handleDelete(song: Song) {
    if (!confirm(`„${song.title}" wirklich löschen?`)) return;
    setActionError("");
    setDeletingId(song.id);
    try {
      const res = await fetch(`/api/songs/${song.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Löschen fehlgeschlagen");
        return;
      }
      setSongs((prev) => prev.filter((s) => s.id !== song.id));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <p className="text-center text-[#8b949e] py-12">Admin wird geladen …</p>
    );
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-200">
        <p className="font-semibold">Admin nicht konfiguriert</p>
        <p className="mt-2 text-sm">
          Setze <code className="text-white">ADMIN_PASSWORD</code> in der{" "}
          <code className="text-white">.env</code> (min. 8 Zeichen) und starte
          den Server neu.
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <form
        onSubmit={handleLogin}
        className="mx-auto max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
      >
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
          Admin-Login
        </h2>
        <p className="mt-2 text-sm text-[#8b949e]">
          Songs in der Hitparade verwalten und löschen.
        </p>
        <label htmlFor="admin-password" className="mt-5 block text-sm text-[#c9d1d9]">
          Passwort
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[#0d1117] px-4 py-3 text-white focus:border-[var(--color-twitch)] focus:outline-none"
        />
        {loginError && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {loginError}
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-[var(--color-twitch)] py-3 font-bold text-white"
        >
          Anmelden
        </button>
        <Link href="/" className="mt-4 block text-center text-sm text-[#8b949e] hover:text-white">
          ← Zur Hitparade
        </Link>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
            Hitparade verwalten
          </h2>
          <p className="text-sm text-[#8b949e]">
            {songs.length} Song{songs.length === 1 ? "" : "s"} · eingeloggt als
            Admin
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadSongs}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[#c9d1d9] hover:bg-[#21262d]"
          >
            Aktualisieren
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[#8b949e] hover:text-white"
          >
            Abmelden
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
        <h3 className="font-[family-name:var(--font-display)] font-bold text-white">
          250-Follower simulieren (Band)
        </h3>
        <p className="mt-1 text-sm text-[#8b949e]">
          Zeigt Konfetti + Band-Mission erfüllt — nur für Tests/Vorschau.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={settingsLoading}
            onClick={() =>
              patchSettings(
                { simulateGoalReached: true },
                "250 Follower simuliert — Startseite öffnen"
              )
            }
            className="rounded-lg bg-[var(--color-mw-green)] px-4 py-2 text-sm font-bold text-[#0d1117] disabled:opacity-50"
          >
            250 Follower simulieren
          </button>
          <button
            type="button"
            disabled={settingsLoading}
            onClick={() =>
              patchSettings(
                { simulateGoalReached: false, followerOverride: null },
                "Simulation beendet — wieder Live-Daten"
              )
            }
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[#c9d1d9] disabled:opacity-50"
          >
            Simulation aus
          </button>
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-[var(--color-twitch)] px-4 py-2 text-sm font-semibold text-[var(--color-twitch)]"
          >
            Startseite ansehen ↗
          </Link>
        </div>
        {simulateGoal && (
          <p className="mt-3 text-sm text-amber-300">Simulation ist aktiv.</p>
        )}
        <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-[var(--color-border)] pt-4">
          <div>
            <label className="block text-xs text-[#8b949e]">
              Oder Follower-Zahl manuell (optional)
            </label>
            <input
              type="number"
              min={0}
              max={9999}
              value={overrideCount}
              onChange={(e) => setOverrideCount(e.target.value)}
              placeholder="z.B. 95"
              className="mt-1 w-28 rounded-lg border border-[var(--color-border)] bg-[#0d1117] px-3 py-2 text-white"
            />
          </div>
          <button
            type="button"
            disabled={settingsLoading}
            onClick={() => {
              const n = overrideCount.trim() === "" ? null : Number(overrideCount);
              patchSettings(
                { followerOverride: n, simulateGoalReached: false },
                n === null ? "Override entfernt" : `Anzeige: ${n} Follower`
              );
            }}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[#c9d1d9]"
          >
            Zahl setzen
          </button>
        </div>
        {settingsMsg && (
          <p className="mt-3 text-sm text-[var(--color-mw-green)]">{settingsMsg}</p>
        )}
      </section>

      {actionError && (
        <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {actionError}
        </p>
      )}

      {songs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--color-border)] py-12 text-center text-[#8b949e]">
          Keine Songs in der Hitparade.
        </p>
      ) : (
        <ul className="space-y-2">
          {songs.map((song) => (
            <li
              key={song.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate">{song.title}</p>
                <p className="text-xs text-[#8b949e]">
                  {song.votes} Votes
                  {song.spotifyUrl ? " · Spotify" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(song)}
                disabled={deletingId === song.id}
                className="rounded-lg bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-600/30 disabled:opacity-50"
              >
                {deletingId === song.id ? "…" : "Löschen"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <Link href="/" className="inline-block text-sm text-[#8b949e] hover:text-white">
        ← Zur öffentlichen Hitparade
      </Link>
    </div>
  );
}
