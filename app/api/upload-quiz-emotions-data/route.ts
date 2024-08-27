import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizEmotionsData } from "@/lib/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const timestamp = new Date().toISOString(); // Generate the current timestamp
    const surprise = body.output.emotion.Surprise;
    const neutral = body.output.emotion.Neutral;
    const sad = body.output.emotion.Sad;
    const happy = body.output.emotion.Happy;
    const fear = body.output.emotion.Fear;
    const disgust = body.output.emotion.Disgust;
    const angry = body.output.emotion.Angry;
    const dominantEmotion = body.output.dominantEmotion;

    console.log("Quiz emotions data:", body); // Log received data

    // Insert data into the database
    const quizEmotionsDataResult = await db
      .insert(quizEmotionsData)
      .values({
        angry: angry,
        disgust: disgust,
        fear: fear,
        happy: happy,
        neutral: neutral,
        sad: sad,
        surprise: surprise,
        dominantEmotion: dominantEmotion,
        timestamp: new Date(timestamp),
        userId: userId,
      })
      .returning({
        insertedId: quizEmotionsData.id,
      });

    // Log the result
    console.log(
      "Quiz emotions data stored:",
      quizEmotionsDataResult
    );

    return NextResponse.json({ message: "Quiz emotions data received" });
  } catch (error) {
    console.error("Error in API:", error); // Log error
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}