// app/api/habits/dashboard/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitCompletions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and, gte, sql } from "drizzle-orm";
import { startOfDay, subDays, startOfMonth, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const today = startOfDay(now);
    const tenDaysAgo = subDays(today, 10);
    const monthStart = startOfMonth(now);

    const habitData = await db
      .select({
        id: habits.id,
        name: habits.name,
        frequency: habits.frequency,
        timeOfDay: habits.timeOfDay,
        createdAt: habits.createdAt,
        todayCompletions: sql<number>`COALESCE(SUM(CASE WHEN ${habitCompletions.completedAt} >= ${today.toISOString()} THEN 1 ELSE 0 END), 0)`,
        tenDayCompletions: sql<number>`COALESCE(SUM(CASE WHEN ${habitCompletions.completedAt} >= ${tenDaysAgo.toISOString()} THEN 1 ELSE 0 END), 0)`,
        monthCompletions: sql<number>`COALESCE(SUM(CASE WHEN ${habitCompletions.completedAt} >= ${monthStart.toISOString()} THEN 1 ELSE 0 END), 0)`,
        totalCompletions: sql<number>`COUNT(${habitCompletions.id})`,
      })
      .from(habits)
      .leftJoin(habitCompletions, eq(habits.id, habitCompletions.habitId))
      .where(and(eq(habits.userId, userId), eq(habits.isActive, true)))
      .groupBy(habits.id)
      .execute();

    const processedData = habitData.map(habit => {
      const totalDays = differenceInDays(now, new Date(habit.createdAt));
      const tenDays = Math.min(totalDays, 10);
      const monthDays = Math.min(totalDays, differenceInDays(now, monthStart));

      let expectedCompletions;
      switch (habit.frequency) {
        case 'daily':
          expectedCompletions = totalDays;
          break;
        case 'weekly':
          expectedCompletions = differenceInWeeks(now, new Date(habit.createdAt)) + 1;
          break;
        case 'monthly':
          expectedCompletions = differenceInMonths(now, new Date(habit.createdAt)) + 1;
          break;
        default:
          expectedCompletions = totalDays;
      }

      const calculateRate = (completions: number, period: number) => 
        Math.min((completions / (expectedCompletions * (period / totalDays))) * 100, 100);

      return {
        ...habit,
        todayCompletionRate: calculateRate(habit.todayCompletions, 1),
        tenDayCompletionRate: calculateRate(habit.tenDayCompletions, tenDays),
        monthCompletionRate: calculateRate(habit.monthCompletions, monthDays),
        overallCompletionRate: calculateRate(habit.totalCompletions, totalDays),
      };
    });

    return NextResponse.json({
      habits: processedData,
      liveData: processedData.map(h => ({ name: h.name, completionRate: h.overallCompletionRate })),
      todayData: processedData.map(h => ({ name: h.name, completionRate: h.todayCompletionRate })),
      tenDaysData: processedData.map(h => ({ name: h.name, completionRate: h.tenDayCompletionRate })),
      monthData: processedData.map(h => ({ name: h.name, completionRate: h.monthCompletionRate })),
    });
  } catch (error) {
    console.error("Error fetching habit dashboard data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habit dashboard data" },
      { status: 500 }
    );
  }
}