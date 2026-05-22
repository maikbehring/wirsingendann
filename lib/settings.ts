import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

export interface AppSettings {
  /** Ersetzt die Twitch-Live-Zahl (Admin-Vorschau). */
  followerOverride: number | null;
  /** Ziel als erreicht darstellen (100 Follower + Konfetti). */
  simulateGoalReached: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  followerOverride: null,
  simulateGoalReached: false,
};

async function readSettingsFile(): Promise<AppSettings> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      followerOverride:
        typeof parsed.followerOverride === "number"
          ? Math.max(0, Math.min(9999, Math.floor(parsed.followerOverride)))
          : null,
      simulateGoalReached: Boolean(parsed.simulateGoalReached),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

async function writeSettingsFile(settings: AppSettings): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${SETTINGS_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(settings, null, 2), "utf-8");
  await fs.rename(tmp, SETTINGS_FILE);
}

export async function getSettings(): Promise<AppSettings> {
  return readSettingsFile();
}

export async function updateSettings(
  patch: Partial<AppSettings>
): Promise<AppSettings> {
  const current = await readSettingsFile();
  const next: AppSettings = { ...current };

  if ("followerOverride" in patch) {
    const v = patch.followerOverride;
    next.followerOverride =
      v === null || v === undefined
        ? null
        : Math.max(0, Math.min(9999, Math.floor(v)));
  }
  if ("simulateGoalReached" in patch) {
    next.simulateGoalReached = Boolean(patch.simulateGoalReached);
  }

  await writeSettingsFile(next);
  return next;
}

export function resolveFollowerCount(
  liveCount: number | null,
  settings: AppSettings,
  goal: number
): {
  count: number | null;
  simulated: boolean;
  goalReached: boolean;
} {
  let count = liveCount;
  let simulated = false;

  if (settings.simulateGoalReached) {
    count = goal;
    simulated = true;
  } else if (settings.followerOverride !== null) {
    count = settings.followerOverride;
    simulated = true;
  }

  const goalReached = count !== null && count >= goal;
  return { count, simulated, goalReached };
}
