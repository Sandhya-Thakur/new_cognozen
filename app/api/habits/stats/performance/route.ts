import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitCompletions } from "@/lib/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { startOfDay, subDays, startOfWeek, startOfMonth, startOfYear, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'month';

    const now = new Date();
    let startDate: Date;
    let expectedCompletions: number;

    switch (range) {
      case 'day':
        startDate = startOfDay(now);
        expectedCompletions = 1;
        break;
      case 'week':
        startDate = startOfWeek(now);
        expectedCompletions = 7;
        break;
      case 'month':
        startDate = startOfMonth(now);
        expectedCompletions = 30; // Approximate
        break;
      case 'year':
        startDate = startOfYear(now);
        expectedCompletions = 365; // Approximate
        break;
      default:
        return NextResponse.json({ error: "Invalid range" }, { status: 400 });
    }

    const results = await db
      .select({
        habitId: habits.id,
        habitName: habits.name,
        frequency: habits.frequency,
        totalValue: sql<number>`COALESCE(SUM(${habitCompletions.value}), 0)`,
        actualCompletions: sql<number>`CAST(COUNT(${habitCompletions.id}) AS INTEGER)`,
      })
      .from(habits)
      .leftJoin(
        habitCompletions,
        and(
          eq(habits.id, habitCompletions.habitId),
          gte(habitCompletions.completedAt, startDate.toISOString()),
          sql`${habitCompletions.completedAt} <= ${endOfDay(now).toISOString()}`
        )
      )
      .where(eq(habits.userId, userId))
      .groupBy(habits.id, habits.name, habits.frequency)
      .execute();

    const processedResults = results.map(result => {
      let adjustedExpectedCompletions = expectedCompletions;

      // Adjust expected completions based on habit frequency
      switch (result.frequency) {
        case 'weekly':
          adjustedExpectedCompletions = Math.ceil(expectedCompletions / 7);
          break;
        case 'monthly':
          adjustedExpectedCompletions = Math.ceil(expectedCompletions / 30);
          break;
        // Add more cases if you have other frequencies
      }

      const performanceRate = (result.totalValue / (adjustedExpectedCompletions * result.actualCompletions)) * 100;

      return {
        habitId: result.habitId,
        habitName: result.habitName,
        rate: Math.min(performanceRate, 100), // Cap at 100%
      };
    });

    return NextResponse.json({ data: processedResults });
  } catch (error) {
    console.error("Error fetching habit performance statistics:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habit performance statistics" },
      { status: 500 }
    );
  }
}