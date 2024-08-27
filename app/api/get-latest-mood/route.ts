// api/get-latest-mood

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
      .select()
      .from(moodData)
      .where(eq(moodData.userId, userId))
      .orderBy(desc(moodData.timestamp))
      .limit(1);

    if (latestMood.length === 0) {
      return NextResponse.json({ mood: null });
    }

    return NextResponse.json({ mood: latestMood[0].mood });
  } catch (error) {
    console.error("Error fetching latest mood:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the latest mood" },
      { status: 500 }
    );
  }
}