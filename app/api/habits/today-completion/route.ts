// app/api/habits/today-completion
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habitCompletions, habits } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const todaysCompletions = await db
      .select({
        habitId: habitCompletions.habitId,
        completedAt: habitCompletions.completedAt,
        value: habitCompletions.value,
      })
      .from(habitCompletions)
      .innerJoin(habits, eq(habits.id, habitCompletions.habitId))
      .where(
        and(
          eq(habits.userId, userId),
          eq(habitCompletions.completedAt, today)
        )
      )
      .execute();

    return NextResponse.json({ completions: todaysCompletions });
  } catch (error) {
    console.error("Error fetching today's habit completions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habit completions" },
      { status: 500 }
    );
  }
}