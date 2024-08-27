// app/api/habits/create/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, frequency, timeOfDay } = await req.json();

    if (!name || !frequency) {
      return NextResponse.json({ error: "Name and frequency are required" }, { status: 400 });
    }

    const newHabit = await db.insert(habits).values({
      userId,
      name,
      description,
      frequency,
      timeOfDay,
    }).returning();

    return NextResponse.json({
      message: "Habit created successfully",
      habit: newHabit[0]
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the habit" },
      { status: 500 }
    );
  }
}