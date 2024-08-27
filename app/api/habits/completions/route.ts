// app/api/habits/completions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habitCompletions, habits } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and, gte } from "drizzle-orm";
import { subDays, eachDayOfInterval, format } from "date-fns";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get('habitId');
    const days = parseInt(searchParams.get('days') || '365', 10);

    if (!habitId) {
      return NextResponse.json({ error: "Habit ID is required" }, { status: 400 });
    }

    const endDate = new Date();
    const startDate = subDays(endDate, days);
    startDate.setHours(0, 0, 0, 0); // Set to beginning of the day

    const completions = await db
      .select({
        completedAt: habitCompletions.completedAt,
        value: habitCompletions.value,
      })
      .from(habitCompletions)
      .innerJoin(habits, eq(habits.id, habitCompletions.habitId))
      .where(
        and(
          eq(habits.userId, userId),
          eq(habitCompletions.habitId, parseInt(habitId)),
          gte(habitCompletions.completedAt, startDate.toISOString())
        )
      )
      .execute();

    // Create a map of completions by date
    const completionMap = new Map(
      completions.map(c => [format(new Date(c.completedAt), 'yyyy-MM-dd'), c.value])
    );

    // Generate an array of all dates in the range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    // Create the final array of completions, including days with no completions
    const formattedCompletions = allDates.map(date => ({
      completedDate: format(date, 'yyyy-MM-dd'),
      value: completionMap.get(format(date, 'yyyy-MM-dd')) || 0
    }));

    return NextResponse.json({ completions: formattedCompletions });
  } catch (error) {
    console.error("Error fetching habit completions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habit completions" },
      { status: 500 }
    );
  }
}