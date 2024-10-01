// app/api/get-last-insights/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insightsAndTips } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lastInsight = await db
      .select()
      .from(insightsAndTips)
      .where(eq(insightsAndTips.userId, userId))
      .orderBy(desc(insightsAndTips.createdAt))
      .limit(1);

    if (lastInsight.length === 0) {
      return NextResponse.json({ insights: null, mood: null, createdAt: null });
    }

    const insights = JSON.parse(lastInsight[0].content);

    return NextResponse.json({
      insights: insights,
      mood: lastInsight[0].mood,
      createdAt: lastInsight[0].createdAt
    });
  } catch (error) {
    console.error("Error fetching last insights:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the last insights" },
      { status: 500 }
    );
  }
}