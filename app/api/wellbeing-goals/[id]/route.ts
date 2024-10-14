// app/api/wellbeing-goals/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emotionalWellbeingGoals } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";

export const runtime = "edge";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goalId = parseInt(params.id, 10);
    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const { content, completed } = await req.json();
    if (content === undefined && completed === undefined) {
      return NextResponse.json({ error: "Either content or completed status must be provided" }, { status: 400 });
    }

    const updateData: Partial<typeof emotionalWellbeingGoals.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (content !== undefined) {
      updateData.content = content.trim();
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const result = await db
      .update(emotionalWellbeingGoals)
      .set(updateData)
      .where(
        and(
          eq(emotionalWellbeingGoals.id, goalId),
          eq(emotionalWellbeingGoals.userId, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Goal not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json({
      error: "An error occurred while updating the goal",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goalId = parseInt(params.id, 10);
    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const result = await db
      .delete(emotionalWellbeingGoals)
      .where(
        and(
          eq(emotionalWellbeingGoals.id, goalId),
          eq(emotionalWellbeingGoals.userId, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Goal not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Goal deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the goal",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}