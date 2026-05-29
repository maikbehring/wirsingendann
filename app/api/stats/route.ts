import { NextResponse } from "next/server";
import { getSettings, resolveFollowerCount } from "@/lib/settings";
import { getSongs } from "@/lib/store";
import { FOLLOWER_GOAL, MILESTONE_100 } from "@/lib/milestones";
import { getTwitchFollowerCount, TWITCH_CHANNEL } from "@/lib/twitch";

export const dynamic = "force-dynamic";

export async function GET() {
  const [songs, twitch, settings] = await Promise.all([
    getSongs(),
    getTwitchFollowerCount(),
    getSettings(),
  ]);
  const totalVotes = songs.reduce((sum, s) => sum + s.votes, 0);
  const resolved = resolveFollowerCount(twitch.count, settings, FOLLOWER_GOAL);
  const leader = songs[0]?.title ?? null;

  const milestone100Reached =
    resolved.count !== null && resolved.count >= MILESTONE_100;

  return NextResponse.json({
    followerGoal: FOLLOWER_GOAL,
    milestone100: MILESTONE_100,
    milestone100Reached,
    followerCurrent: resolved.count,
    followerLive: twitch.count,
    followerSimulated: resolved.simulated,
    goalReached: resolved.goalReached,
    bandGoalReached: resolved.goalReached,
    followerChannel: twitch.channel,
    followerSource: resolved.simulated ? "simulation" : twitch.source,
    followerFetchedAt: twitch.fetchedAt,
    followerError: twitch.error,
    twitchUrl: `https://www.twitch.tv/${TWITCH_CHANNEL}`,
    songCount: songs.length,
    totalVotes,
    leaderTitle: leader,
  });
}
