// api/get-current-streak.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitCompletions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all habits for the user
    const userHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId));

    let longestStreak = 0;
    let longestStreakHabitName = '';

    for (const habit of userHabits) {
      // Get the habit completions, ordered by date
      const completions = await db
        .select()
        .from(habitCompletions)
        .where(eq(habitCompletions.habitId, habit.id))
        .orderBy(desc(habitCompletions.completedAt));

      let currentStreak = 0;
      let previousDate: Date | null = null;

      for (const completion of completions) {
        const completionDate = new Date(completion.completedAt);
        
        if (previousDate === null) {
          currentStreak = 1;
        } else {
          const dayDifference = Math.floor(
            (previousDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (dayDifference === 1) {
            currentStreak++;
          } else {
            break; // Streak is broken
          }
        }

        previousDate = completionDate;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        longestStreakHabitName = habit.name;
      }
    }

    return NextResponse.json({ 
      streak: longestStreak, 
      habitName: longestStreakHabitName 
    });

  } catch (error) {
    console.error("Error calculating current streak:", error);
    return NextResponse.json(
      { error: "An error occurred while calculating the current streak" },
      { status: 500 }
    );
  }
}