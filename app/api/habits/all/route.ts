//app/api/habits/all/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and, or, gte, lte } from "drizzle-orm";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
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


    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Assuming week starts on Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const todaysHabits = await db
      .select()
      .from(habits)
      .where(
        and(
          eq(habits.userId, userId),
          eq(habits.isActive, true),
          or(
            eq(habits.frequency, 'daily'),
            and(
              eq(habits.frequency, 'weekly'),
              gte(habits.createdAt, weekStart),
              lte(habits.createdAt, weekEnd)
            ),
            and(
              eq(habits.frequency, 'monthly'),
              gte(habits.createdAt, monthStart),
              lte(habits.createdAt, monthEnd)
            )
          )
        )
      )
      .execute();

    // Filter habits based on time of day
    const currentHour = now.getHours();
    const filteredHabits = todaysHabits.filter(habit => {
      switch (habit.timeOfDay) {
        case 'morning':
          return currentHour < 12;
        case 'afternoon':
          return currentHour >= 12 && currentHour < 18;
        case 'evening':
          return currentHour >= 18;
        default:
          return true; // If no specific time is set, include the habit
      }
    });

    return NextResponse.json({ habits: filteredHabits });
  } catch (error) {
    console.error("Error fetching today's habits:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habits" },
      { status: 500 }
    );
  }
}