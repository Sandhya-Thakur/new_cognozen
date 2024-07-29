import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emotionalWellbeingGoals } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await db
      .select()
      .from(emotionalWellbeingGoals)
      .where(eq(emotionalWellbeingGoals.userId, userId))
      .orderBy(desc(emotionalWellbeingGoals.createdAt));

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching emotional wellbeing goals:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching goals" },
      { status: 500 }
    );
  }
}