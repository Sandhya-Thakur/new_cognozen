import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { suggestedActivities } from "@/lib/db/schema";

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

    const { mood } = await req.json();

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const prompt = {
      role: "system" as const,
      content: `You are an AI assistant providing suggested activities based on a person's mood. 
      Your suggestions should be tailored to help improve or maintain the person's emotional well-being.
      Provide 5 activities that are suitable for the given mood.
      Format your response as a JSON array of objects, each with a 'title' and 'description' field.`,
    };

    const userMessage = {
      role: "user" as const,
      content: `Generate 5 suggested activities for someone feeling ${mood}. Each activity should be relevant and helpful for this emotional state.`,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [prompt, userMessage],
    });

    const data = await response.json();
    const activitiesString = data.choices[0].message?.content || "[]";
    const activities = JSON.parse(activitiesString);

    // Insert the activities into the database
    const result = await db.insert(suggestedActivities).values({
      userId,
      mood,
      activities: activitiesString,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({
      message: "Activities generated and saved successfully",
      activities: activities,
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