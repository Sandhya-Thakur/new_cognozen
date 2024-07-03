import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emotionsData } from "@/lib/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const timestamp = new Date().toISOString(); // Generate the current timestamp
    const surprise = body.output.emotion.Surprise; // Extract the surprise emotion value
    const neutral = body.output.emotion.Neutral; // Extract the neutral emotion value
    const sad = body.output.emotion.Sad; // Extract the sad emotion value
    const happy = body.output.emotion.Happy; // Extract the happy emotion value
    const fear = body.output.emotion.Fear; // Extract the fear emotion value
    const disgust = body.output.emotion.Disgust; // Extract the disgust emotion value
    const angry = body.output.emotion.Angry; // Extract the angry emotion value
    const dominantEmotion = body.output.dominantEmotion; // Extract the dominant emotion value

    console.log("live data:", body); // Log received data

    // Insert data into the database
    const emotionsDataResult = await db
      .insert(emotionsData)
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
        insertedId: emotionsData.id,
      });

    // Log the result

    console.log(
      "Emotions data got stored after every 10 seconds:",
      emotionsDataResult
    );

    return NextResponse.json({ message: "Attention data received" });
  } catch (error) {
    console.error("Error in API:", error); // Log error
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
