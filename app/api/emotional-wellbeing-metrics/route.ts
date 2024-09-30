import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { moodData } from "@/lib/db/schema";
import { sql, and, eq, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const fetchMoodData = async (startDate: Date, endDate: Date) => {
      return await db
        .select({
          avgIntensity: sql<number>`COALESCE(AVG(${moodData.intensity}), 0)`,
        })
        .from(moodData)
        .where(
          and(
            eq(moodData.userId, userId),
            gte(moodData.timestamp, sql`${startDate}`),
            sql`${moodData.timestamp} < ${endDate}`
          )
        );
    };

    const [todayMood] = await fetchMoodData(today, new Date());
    const [yesterdayMood] = await fetchMoodData(yesterday, today);

    const todayScore = Number(todayMood?.avgIntensity || 0);
    const yesterdayScore = Number(yesterdayMood?.avgIntensity || 0);

    let change = 0;
    if (yesterdayScore !== 0) {
      change = ((todayScore - yesterdayScore) / yesterdayScore) * 100;
    } else if (todayScore !== 0) {
      change = 100;
    }

    const emotionalWellbeing = {
      todayScore: Number(todayScore.toFixed(2)),
      yesterdayScore: Number(yesterdayScore.toFixed(2)),
      change: Number(change.toFixed(2)),
    };

    console.log("Emotional wellbeing data:", emotionalWellbeing);

    return NextResponse.json(emotionalWellbeing);
  } catch (error) {
    console.error("Failed to fetch emotional wellbeing data", error);
    return NextResponse.json(
      {
        error: "Failed to fetch emotional wellbeing data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}