// api/get-latest-mood/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { moodData } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const latestMood = await db
      .select({
        mood: moodData.mood,
        reasons: moodData.reasons,
        intensity: moodData.intensity,
        timestamp: moodData.timestamp,
      })
      .from(moodData)
      .where(eq(moodData.userId, userId))
      .orderBy(desc(moodData.timestamp))
      .limit(1);

    if (latestMood.length === 0) {
      return NextResponse.json({ mood: null, reasons: null, intensity: null, timestamp: null });
    }

    return NextResponse.json({
      mood: latestMood[0].mood,
      reasons: latestMood[0].reasons,
      intensity: latestMood[0].intensity,
      timestamp: latestMood[0].timestamp,
    });
  } catch (error) {
    console.error("Error fetching latest mood:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the latest mood" },
      { status: 500 }
    );
  }
}