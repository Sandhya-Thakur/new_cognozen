import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emotionalWellbeingGoals } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goalId = parseInt(params.id);
    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const { completed } = await req.json();
    if (typeof completed !== 'boolean') {
      return NextResponse.json({ error: "Invalid completion status" }, { status: 400 });
    }

    const updatedGoal = await db
      .update(emotionalWellbeingGoals)
      .set({ completed, updatedAt: new Date() })
      .where(eq(emotionalWellbeingGoals.id, goalId))
      .returning();

    if (updatedGoal.length === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json({ goal: updatedGoal[0] });
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the goal" },
      { status: 500 }
    );
  }
}