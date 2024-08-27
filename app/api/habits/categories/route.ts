// app/api/habits/categories/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userHabits = await db
      .select({
        id: habits.id,
        name: habits.name,
        isActive: habits.isActive,
      })
      .from(habits)
      .where(eq(habits.userId, userId))
      .execute();

    // For simplicity, we're putting all habits in one category
    const allHabits = {
      name: 'All Habits',
      habits: userHabits,
      totalHabits: userHabits.length,
    };

    return NextResponse.json({ categories: [allHabits] });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habits" },
      { status: 500 }
    );
  }
}