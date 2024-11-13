import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { habits, habitCompletions } from "@/lib/db/schema";
import { eq, and, not, inArray, or, gte, lte } from "drizzle-orm";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const today = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);

    // Fetch all active habits for the user
    const userHabits = await db
      .select()
      .from(habits)
      .where(
        and(
          eq(habits.userId, userId),
          eq(habits.isActive, true),
          or(
            eq(habits.frequency, 'daily'),
            and(eq(habits.frequency, 'weekly'), gte(habits.createdAt, sql`${weekStart}`)),
            and(eq(habits.frequency, 'monthly'), gte(habits.createdAt, sql`${monthStart}`))
          )
        )
      )
      .execute();

    // Fetch completions for today
    const completions = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          inArray(habitCompletions.habitId, userHabits.map(h => h.id)),
          gte(habitCompletions.completedAt, sql`${today}`),
          lte(habitCompletions.completedAt, sql`${endOfDay(now)}`)
        )
      )
      .execute();

    // Filter out completed habits
    const completedHabitIds = new Set(completions.map(c => c.habitId));
    const incompleteHabits = userHabits.filter(habit => !completedHabitIds.has(habit.id));

    return NextResponse.json({ incompleteHabits });
  } catch (error) {
    console.error("Error fetching incomplete habits:", error);
    return NextResponse.json({ error: "Failed to fetch incomplete habits" }, { status: 500 });
  }
}