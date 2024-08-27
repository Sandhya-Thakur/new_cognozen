import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizAttentionData } from "@/lib/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const level = parseFloat(body.output.attention); // Ensure level is parsed as a float
    const timestamp = new Date().toISOString(); // Generate the current timestamp

    console.log("Quiz attention data:", body); // Log received data

    // Insert data into the database
    const quizAttentionDataResult = await db
      .insert(quizAttentionData)
      .values({
        level: level,
        timestamp: new Date(timestamp),
        userId: userId,
      })
      .returning({
        insertedId: quizAttentionData.id,
      });

    // Log the result
    console.log(
      "Quiz attention data stored:",
      quizAttentionDataResult,
    );

    return NextResponse.json({ message: "Quiz attention data received" });
  } catch (error) {
    console.error("Error in API:", error); // Log error
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}