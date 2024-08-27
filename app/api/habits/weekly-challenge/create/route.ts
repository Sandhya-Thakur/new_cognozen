// app/api/weekly-challenge/create/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { weeklyChallenge } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, startDate, endDate, habitId, targetValue } = await req.json();

    const [newChallenge] = await db
      .insert(weeklyChallenge)
      .values({
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        habitId,
        targetValue,
      })
      .returning();

    return NextResponse.json({ message: "Challenge created successfully", challenge: newChallenge });
  } catch (error) {
    console.error("Error creating weekly challenge:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the weekly challenge" },
      { status: 500 }
    );
  }
}