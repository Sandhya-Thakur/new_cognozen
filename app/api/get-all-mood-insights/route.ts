// app/api/get-mood-insights/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { insightsAndTips } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

interface MoodInsight {
  id: number;  // Changed from string to number
  date: string;
  mood: string;
  understanding: {
    title: string;
    description: string;
  };
  impacts: string[];
  strategies: Array<{
    title: string;
    description: string;
  }>;
  conclusion: string;
}

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "today";

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate = new Date(today);
    let endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);

    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const rawData = await db
      .select()
      .from(insightsAndTips)
      .where(
        and(
          eq(insightsAndTips.userId, userId),
          gte(insightsAndTips.createdAt, startDate),
          lte(insightsAndTips.createdAt, endDate)
        )
      )
      .orderBy(insightsAndTips.createdAt);

    if (rawData.length === 0) {
      return NextResponse.json({ error: `No insights found for ${period}` }, { status: 404 });
    }

    const processedData: MoodInsight[] = rawData.map(item => {
      const parsedContent = JSON.parse(item.content);
      return {
        id: item.id,  // This should now correctly be a number
        date: item.createdAt.toISOString(),
        mood: parsedContent.mood,
        understanding: parsedContent.understanding,
        impacts: parsedContent.impacts,
        strategies: parsedContent.strategies,
        conclusion: parsedContent.conclusion
      };
    });

    return NextResponse.json(processedData);
  } catch (error) {
    console.error(`Failed to fetch ${period}'s insights`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${period}'s insights` },
      { status: 500 },
    );
  }
}