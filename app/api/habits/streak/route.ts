import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitCompletions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and, desc } from "drizzle-orm";
import { startOfDay, endOfDay, subDays, isEqual, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's timezone from the request headers or use a default
    const userTimeZone = req.headers.get('x-user-timezone') || 'UTC';
    const now = toZonedTime(new Date(), userTimeZone);

    // Fetch all active habits for the user
    const userHabits = await db
      .select()
      .from(habits)
      .where(and(eq(habits.userId, userId), eq(habits.isActive, true)))
      .execute();

    const habitStreaks = await Promise.all(userHabits.map(async (habit) => {
      // Fetch all completions for this habit, ordered by date descending
      const completions = await db
        .select()
        .from(habitCompletions)
        .where(eq(habitCompletions.habitId, habit.id))
        .orderBy(desc(habitCompletions.completedAt))
        .execute();

      let streakDays = 0;
      let currentDate = startOfDay(now);

      if (habit.frequency === 'daily') {
        for (let i = 0; i < completions.length; i++) {
          const completionDate = startOfDay(completions[i].completedAt);
          if (isEqual(completionDate, currentDate) || isEqual(completionDate, subDays(currentDate, 1))) {
            streakDays++;
            currentDate = subDays(currentDate, 1);
          } else {
            break;
          }
        }
      } else if (habit.frequency === 'weekly') {
        let weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        let weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        let weeklyStreak = 0;

        for (const completion of completions) {
          const completionDate = startOfDay(completion.completedAt);
          if (completionDate >= weekStart && completionDate <= weekEnd) {
            weeklyStreak++;
            weekEnd = subDays(weekStart, 1);
            weekStart = startOfWeek(weekEnd, { weekStartsOn: 1 });
          } else if (completionDate < weekStart) {
            break;
          }
        }

        streakDays = weeklyStreak * 7; // Convert weeks to days
      } else if (habit.frequency === 'monthly') {
        let monthStart = startOfMonth(currentDate);
        let monthEnd = endOfMonth(currentDate);
        let monthlyStreak = 0;

        for (const completion of completions) {
          const completionDate = startOfDay(completion.completedAt);
          if (completionDate >= monthStart && completionDate <= monthEnd) {
            monthlyStreak++;
            monthEnd = subDays(monthStart, 1);
            monthStart = startOfMonth(monthEnd);
          } else if (completionDate < monthStart) {
            break;
          }
        }

        streakDays = monthlyStreak * 30; // Approximating months to 30 days
      }

      return {
        id: habit.id,
        name: habit.name,
        streakDays: streakDays,
        frequency: habit.frequency
      };
    }));

    return NextResponse.json({ habitStreaks });
  } catch (error) {
    console.error("Error fetching habit streaks:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habit streaks" },
      { status: 500 }
    );
  }
}