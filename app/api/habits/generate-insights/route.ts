// app/api/habits/generate-insights/route.ts
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { habits, habitCompletions, habitInsights } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { subDays } from "date-fns";

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

    const { habitId } = await req.json();

    if (!habitId) {
      return NextResponse.json({ error: "Habit ID is required" }, { status: 400 });
    }

    // Fetch habit details and completions
    const habit = await db.select().from(habits).where(eq(habits.id, habitId)).execute();
    if (habit.length === 0) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const thirtyDaysAgo = subDays(new Date(), 30);
    const completions = await db
        .select()
        .from(habitCompletions)
        .where(
            and(
                eq(habitCompletions.habitId, habitId),
                gte(habitCompletions.completedAt, thirtyDaysAgo.toISOString()) // Convert to string representation
            )
        )
        .orderBy(desc(habitCompletions.completedAt))
        .execute();

    const completionRate = (completions.length / 30) * 100;

    const prompt = {
      role: "system" as const,
      content: `You are an AI assistant providing insights and recommendations based on a person's habit data. 
      Your responses should be encouraging, supportive, and tailored to the specific habit and completion pattern.
      Provide practical advice and strategies to help improve habit adherence and consistency.
      Format your response as a JSON object with the following structure:
      {
        "habitName": "The name of the habit",
        "analysis": {
          "title": "Analysis of Your [Habit Name] Habit",
          "description": "A brief analysis of the habit completion pattern"
        },
        "trends": ["An array of observed trends"],
        "recommendations": [
          {
            "title": "Recommendation title",
            "description": "Detailed description of the recommendation"
          }
        ],
        "conclusion": "A brief concluding statement"
      }`,
    };

    const userMessage = {
      role: "user" as const,
      content: `Generate insights and recommendations for a habit named "${habit[0].name}" with a ${completionRate.toFixed(2)}% completion rate over the last 30 days. Include an analysis of the completion pattern, observed trends, and at least three practical recommendations to improve habit adherence.`,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [prompt, userMessage],
    });

    const data = await response.json();
    const insightsString = data.choices[0].message?.content || "{}";

    // Parse the JSON string to an object
    const insightsObject = JSON.parse(insightsString);

    // Convert the insights object to a string for storage
    const contentString = JSON.stringify(insightsObject);

    // Insert the insights into the database
    const result = await db.insert(habitInsights).values({
      userId,
      habitId,
      content: contentString,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({
      message: "Habit insights generated and saved successfully",
      insights: insightsObject,
      savedRecord: result[0]
    });
  } catch (error) {
    console.error("Error generating habit insights:", error);
    return NextResponse.json(
      { error: "An error occurred while generating habit insights" },
      { status: 500 }
    );
  }
}