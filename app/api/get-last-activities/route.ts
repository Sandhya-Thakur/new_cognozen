// api/get-last-activities

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { suggestedActivities } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lastActivity = await db
      .select()
      .from(suggestedActivities)
      .where(eq(suggestedActivities.userId, userId))
      .orderBy(desc(suggestedActivities.createdAt))
      .limit(1);

    if (lastActivity.length === 0) {
      return NextResponse.json({ activities: null, mood: null, createdAt: null });
    }

    const activities = JSON.parse(lastActivity[0].activities);

    return NextResponse.json({
      activities: activities,
      mood: lastActivity[0].mood,
      createdAt: lastActivity[0].createdAt
    });
  } catch (error) {
    console.error("Error fetching last activities:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the last activities" },
      { status: 500 }
    );
  }
}