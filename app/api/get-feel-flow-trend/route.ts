import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { moodData } from "@/lib/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

type MoodType = "Happy" | "Content" | "Calm" | "Neutral" | "Bored" | "Frustrated" | "Sad" | "Depressed";

const moodValues: Record<MoodType, number> = {
  "Happy": 7,
  "Content": 6,
  "Calm": 5,
  "Neutral": 4,
  "Bored": 3,
  "Frustrated": 2,
  "Sad": 1,
  "Depressed": 0
};

function isMoodType(mood: string): mood is MoodType {
  return mood in moodValues;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the latest two check-ins to calculate the trend
    const latestCheckIns = await db
      .select()
      .from(moodData)
      .where(eq(moodData.userId, userId))
      .orderBy(desc(moodData.timestamp))
      .limit(2);

    let trendPercentage = 0;
    if (latestCheckIns.length === 2) {
      const latestMood = latestCheckIns[0].mood;
      const previousMood = latestCheckIns[1].mood;
      
      if (isMoodType(latestMood) && isMoodType(previousMood)) {
        const latestMoodValue = moodValues[latestMood];
        const previousMoodValue = moodValues[previousMood];
        trendPercentage = ((latestMoodValue - previousMoodValue) / previousMoodValue) * 100;
      }
    }

    // Get today's check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckIns = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${moodData.timestamp})::integer`,
        mood: moodData.mood,
      })
      .from(moodData)
      .where(
        and(
          eq(moodData.userId, userId),
          sql`${moodData.timestamp}::date = ${today}::date`
        )
      )
      .orderBy(moodData.timestamp);

    // Process todayCheckIns into the format needed for the chart
    const chartData = Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      value: 0,
      mood: "Neutral" as MoodType,
    }));

    todayCheckIns.forEach((checkIn) => {
      if (isMoodType(checkIn.mood)) {
        chartData[checkIn.hour].value = moodValues[checkIn.mood];
        chartData[checkIn.hour].mood = checkIn.mood;
      }
    });

    return NextResponse.json({
      trendPercentage: parseFloat(trendPercentage.toFixed(2)),
      chartData,
    });
  } catch (error) {
    console.error("Error fetching mood trend:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the mood trend" },
      { status: 500 }
    );
  }
}