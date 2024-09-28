import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { attentionData, emotionsData } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { sql, and, eq, gt, between, desc } from "drizzle-orm";
import { AttentionData, EmotionsData } from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "edge";

interface ReadingMetric {
  label: string;
  value: number;
  change: number;
  progress: number;
  avgAttention: number;
  topEmotions: { emotion: string; count: number }[];
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return redirect("/sign-in");
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Count PDF reading sessions (unique timestamps in attentionData)
    const currentReadingSessions = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${attentionData.timestamp})`,
      })
      .from(attentionData)
      .where(
        and(
          eq(attentionData.userId, userId),
          gt(attentionData.timestamp, thirtyDaysAgo)
        )
      );

    // Get average attention level
    const avgAttention = await db
      .select({ avg: sql<number>`AVG(${attentionData.level})` })
      .from(attentionData)
      .where(
        and(
          eq(attentionData.userId, userId),
          gt(attentionData.timestamp, thirtyDaysAgo)
        )
      );

    // Get dominant emotions
    const emotions = await db
      .select({
        emotion: emotionsData.dominantEmotion,
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(emotionsData)
      .where(
        and(
          eq(emotionsData.userId, userId),
          gt(emotionsData.timestamp, thirtyDaysAgo)
        )
      )
      .groupBy(emotionsData.dominantEmotion)
      .orderBy(desc(sql<number>`COUNT(*)`))
      .limit(3);

    // Previous period reading sessions
    const previousReadingSessions = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${attentionData.timestamp})`,
      })
      .from(attentionData)
      .where(
        and(
          eq(attentionData.userId, userId),
          between(attentionData.timestamp, sixtyDaysAgo, thirtyDaysAgo)
        )
      );

    const currentCount = currentReadingSessions[0]?.count ?? 0;
    const previousCount = previousReadingSessions[0]?.count ?? 0;

    const change =
      previousCount > 0
        ? ((currentCount - previousCount) / previousCount) * 100
        : 100;

    const progress = Math.min((currentCount / 30) * 100, 100); // Assuming a goal of 1 reading session per day

    const readingMetric: ReadingMetric = {
      label: "PDF Reading Sessions",
      value: currentCount,
      change: parseFloat(change.toFixed(2)),
      progress: Math.round(progress),
      avgAttention: parseFloat((avgAttention[0]?.avg ?? 0).toFixed(2)),
      topEmotions: emotions.map((e) => ({
        emotion: e.emotion,
        count: Number(e.count),
      })),
    };

    console.log("Returning reading metric:", readingMetric);
    return NextResponse.json(readingMetric);
  } catch (error) {
    console.error("Failed to fetch reading metrics", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reading metrics",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
