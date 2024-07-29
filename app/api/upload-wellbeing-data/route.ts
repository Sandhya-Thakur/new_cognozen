import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emotionalWellbeingGoals } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required and must be a non-empty string" }, { status: 400 });
    }

    const result = await db
      .insert(emotionalWellbeingGoals)
      .values({
        userId,
        content: content.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ 
      message: "Goal saved successfully", 
      goal: result[0] 
    }, { status: 201 });

  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json({ 
      error: "An error occurred while saving the goal",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}