// app/api/habits/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitDetails } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";

type HabitStatus = 'Check-in' | 'Daily Achieved' | 'On Track' | 'Completed' | 'Upcoming';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userHabits = await db
      .select({
        habits: habits,
        habit_details: habitDetails
      })
      .from(habits)
      .leftJoin(habitDetails, eq(habits.id, habitDetails.habitId))
      .where(eq(habits.userId, userId));

    const formattedHabits = userHabits.map(({ habits, habit_details }) => {
      const now = new Date();
      // Use timeOfDay instead of nextOccurrence
      const nextOccurrence = habits.timeOfDay ? new Date(`${now.toDateString()} ${habits.timeOfDay}`) : now;

      let status: HabitStatus;
      // We don't have lastCompletedAt, so we'll use a different logic for status
      if (habit_details?.challengeLength === habit_details?.timePerSession) {
        status = 'Completed';
      } else if (nextOccurrence > now) {
        status = 'Upcoming';
      } else if (habit_details?.challengeLength && habit_details.challengeLength > 0) {
        status = 'On Track';
      } else {
        status = 'Check-in';
      }

      const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      const frequency = habits.frequency ? habits.frequency.split(',').map(Number) : [];

      return {
        id: habits.id,
        name: habits.name,
        status,
        progress: {
          current: habit_details?.timePerSession || 0,
          total: habit_details?.challengeLength || 365,
        },
        streak: 0, // You may need to calculate this based on your business logic
        frequency: habits.frequency || '',
        frequencyDays: days.filter((_, index) => frequency.includes(index)),
        nextOccurrence: nextOccurrence.toLocaleString('en-US', {
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        habitType: habit_details?.habitType || 'Routine Habit',
        endDate: habit_details?.endDate,
      };
    });

    return NextResponse.json(formattedHabits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habits" },
      { status: 500 }
    );
  }
}


// PUT update habit
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const habitId = parseInt(params.id);
      const { name, description, frequency, timeOfDay, habitType, schedule, endDate, challengeLength, timePerSession, reminder, showOnScheduledTime, tags } = await req.json();
  
      const updatedHabit = await db.transaction(async (tx) => {
        const [habit] = await tx
          .update(habits)
          .set({ name, description, frequency, timeOfDay })
          .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
          .returning();
  
        if (!habit) {
          throw new Error("Habit not found");
        }
  
        const [habitDetail] = await tx
          .update(habitDetails)
          .set({ habitType, schedule, endDate, challengeLength, timePerSession, reminder, showOnScheduledTime, tags })
          .where(eq(habitDetails.habitId, habitId))
          .returning();
  
        return { ...habit, details: habitDetail };
      });
  
      return NextResponse.json(updatedHabit);
    } catch (error) {
      console.error("Error updating habit:", error);
      return NextResponse.json(
        { error: "An error occurred while updating the habit" },
        { status: 500 }
      );
    }
  }
  
  // DELETE habit
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const habitId = parseInt(params.id);
  
      await db.transaction(async (tx) => {
        await tx.delete(habitDetails).where(eq(habitDetails.habitId, habitId));
        const result = await tx.delete(habits).where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
        if (result.rowCount === 0) {
          throw new Error("Habit not found");
        }
      });
  
      return NextResponse.json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error("Error deleting habit:", error);
      return NextResponse.json(
        { error: "An error occurred while deleting the habit" },
        { status: 500 }
      );
    }
  }
  