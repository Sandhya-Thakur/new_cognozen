import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { moodData } from "@/lib/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { mood, intensity, reasons } = body;

    console.log("Received mood data:", body); // Log received data

    // Insert data into the database
    const moodDataResult = await db
      .insert(moodData)
      .values({
        userId: userId,
        mood: mood,
        intensity: intensity,
        reasons: reasons,
        timestamp: new Date(),
      })
      .returning({
        insertedId: moodData.id,
      });

    // Log the result
    console.log("Mood data stored:", moodDataResult);

    return NextResponse.json({ message: "Mood data received and stored" });
  } catch (error) {
    console.error("Error in API:", error); // Log error
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}