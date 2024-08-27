// app/api/habits/[id]/toggle/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habitId = parseInt(params.id);
    if (isNaN(habitId)) {
      return NextResponse.json({ error: "Invalid habit ID" }, { status: 400 });
    }

    // Check if the habit exists and belongs to the user
    const habit = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
      .execute();

    if (habit.length === 0) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Toggle the isActive status
    const updatedHabit = await db
      .update(habits)
      .set({ isActive: !habit[0].isActive })
      .where(eq(habits.id, habitId))
      .returning();

    return NextResponse.json({ 
      message: updatedHabit[0].isActive ? "Habit activated" : "Habit deactivated",
      habit: updatedHabit[0]
    });
  } catch (error) {
    console.error("Error toggling habit:", error);
    return NextResponse.json(
      { error: "An error occurred while toggling the habit" },
      { status: 500 }
    );
  }
}