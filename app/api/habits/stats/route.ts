// app/api/habits/stats/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitCompletions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and, gte, desc } from "drizzle-orm";
import { subDays } from "date-fns";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .execute();

    const statsPromises = userHabits.map(async (habit) => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const completions = await db
        .select()
        .from(habitCompletions)
        .where(
          and(
            eq(habitCompletions.habitId, habit.id),
            gte(habitCompletions.completedAt, thirtyDaysAgo)
          )
        )
        .orderBy(desc(habitCompletions.completedAt))
        .execute();

      let currentStreak = 0;
      let longestStreak = 0;
      let streak = 0;
      let lastDate: Date | null = null;

      completions.forEach((completion) => {
        const completionDate = new Date(completion.completedAt);
        if (!lastDate || isConsecutiveDay(lastDate, completionDate)) {
          streak++;
        } else {
          longestStreak = Math.max(longestStreak, streak);
          streak = 1;
        }
        lastDate = completionDate;
      });

      currentStreak = streak;
      longestStreak = Math.max(longestStreak, currentStreak);

      const completionRate = (completions.length / 30) * 100;

      return {
        id: habit.id,
        name: habit.name,
        currentStreak,
        longestStreak,
        completionRate: Math.round(completionRate),
        totalCompletions: completions.length,
      };
    });

    const stats = await Promise.all(statsPromises);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching habit stats:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habit stats" },
      { status: 500 }
    );
  }
}

function isConsecutiveDay(date1: Date, date2: Date): boolean {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round(
    Math.abs((date1.getTime() - date2.getTime()) / oneDayInMilliseconds)
  );
  return diffInDays === 1;
}