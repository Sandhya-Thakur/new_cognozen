// app/api/habits/complete/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habitCompletions, habits } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habitId, completedAt, value } = await req.json();

    // Validate the habit belongs to the user
    const habit = await db.select().from(habits).where(eq(habits.id, habitId)).execute();
    if (habit.length === 0 || habit[0].userId !== userId) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Insert the completion
    const [newCompletion] = await db.insert(habitCompletions).values({
      habitId: habitId,
      completedAt: new Date(completedAt).toISOString(), // Convert to ISO string
      value: value || 1,
    }).returning();

    return NextResponse.json({
      message: "Habit completion added successfully",
      completion: newCompletion
    });
  } catch (error) {
    console.error("Error adding habit completion:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the habit completion" },
      { status: 500 }
    );
  }
}