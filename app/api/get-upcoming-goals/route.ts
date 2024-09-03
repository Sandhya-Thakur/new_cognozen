import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { goals } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const upcomingGoals = await db
      .select()
      .from(goals)
      .where(
        and(
          eq(goals.userId, userId),
          eq(goals.status, "in_progress"),
          sql`${goals.endDate} < CURRENT_DATE`
        )
      );

    return NextResponse.json({
      upcomingGoals: upcomingGoals.length
    });
  } catch (error) {
    console.error("Error fetching upcoming goals:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching upcoming goals" },
      { status: 500 }
    );
  }
}