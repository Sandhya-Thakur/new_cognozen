// app/api/habits/completions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habitCompletions } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { subDays } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get('habitId');
    const days = parseInt(searchParams.get('days') || '30', 10);

    if (!habitId) {
      return NextResponse.json({ error: "Habit ID is required" }, { status: 400 });
    }

    const endDate = new Date();
    const startDate = subDays(endDate, days);

    const completions = await db
      .select({
        completedAt: habitCompletions.completedAt,
        value: habitCompletions.value,
      })
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, parseInt(habitId)),
          gte(habitCompletions.completedAt, startDate.toISOString())
        )
      )
      .execute();

    return NextResponse.json({ completions });
  } catch (error) {
    console.error("Error fetching habit completions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habit completions" },
      { status: 500 }
    );
  }
}