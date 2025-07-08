import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { moodData, suggestedActivities } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mood } = body;

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    // Fetch the latest mood data to get reasons if available
    const latestMoodData = await db
      .select()
      .from(moodData)
      .where(eq(moodData.userId, userId))
      .orderBy(desc(moodData.timestamp))
      .limit(1);

    let reasons: string[] = [];
    if (latestMoodData.length > 0) {
      reasons = latestMoodData[0].reasons || [];
    }

    const prompt = {
      role: "system" as const,
      content: `You are an empathetic AI assistant that suggests personalized activities based on a person's mood.
      Your responses should be supportive, practical, and tailored to help improve or maintain their emotional well-being.
      
      Format your response as a JSON object with the following structure:
      {
        "activities": [
          {
            "title": "Activity title (keep it short and engaging)",
            "description": "A detailed description of the activity and how it can help with the current mood"
          }
        ]
      }
      
      Provide exactly 5 activities that are:
      - Practical and achievable
      - Specific to the mood provided
      - Varied in type (physical, mental, social, creative, etc.)
      - Actionable with clear steps`,
    };

    const userMessage = {
      role: "user" as const,
      content: `Generate 5 personalized mood-boosting activities for someone feeling ${mood}. ${
        reasons && reasons.length > 0
          ? `The reasons for this mood are: ${reasons.join(", ")}.`
          : "No specific reasons were provided for this mood."
      } 
      
      Consider these factors:
      - The current mood: ${mood}
      - The person wants activities that will help them feel better or maintain their current positive state
      - Activities should be diverse and cater to different preferences
      - Each activity should have a clear title and detailed description
      
      Make sure each activity is specific, actionable, and designed to positively impact their emotional state.`,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [prompt, userMessage],
    });

    const data = await response.json();
    const activitiesString = data.choices[0].message?.content || "{}";

    // Parse the JSON string to an object
    const activitiesObject = JSON.parse(activitiesString);

    // Save to database
    const result = await db.insert(suggestedActivities).values({
      userId,
      mood,
      activities: JSON.stringify(activitiesObject.activities),
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({
      message: "Activities generated successfully",
      activities: activitiesObject.activities,
      mood: mood,
      savedRecord: result[0]
    });
  } catch (error) {
    console.error("Error generating activities:", error);
    return NextResponse.json(
      { error: "An error occurred while generating activities" },
      { status: 500 }
    );
  }
}