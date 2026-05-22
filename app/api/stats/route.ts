import { NextResponse } from "next/server";
import { FOLLOWER_GOAL, getTwitchFollowerCount, TWITCH_CHANNEL } from "@/lib/twitch";
import { getSongs } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [songs, twitch] = await Promise.all([getSongs(), getTwitchFollowerCount()]);
  const totalVotes = songs.reduce((sum, s) => sum + s.votes, 0);

  return NextResponse.json({
    followerGoal: FOLLOWER_GOAL,
    followerCurrent: twitch.count,
    followerChannel: twitch.channel,
    followerSource: twitch.source,
    followerFetchedAt: twitch.fetchedAt,
    followerError: twitch.error,
    twitchUrl: `https://www.twitch.tv/${TWITCH_CHANNEL}`,
    songCount: songs.length,
    totalVotes,
  });
}
