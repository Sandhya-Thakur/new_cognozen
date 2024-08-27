import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { habits, habitCompletions, moodHabitCorrelations } from "@/lib/db/schema";
import { eq, and, gte, desc, inArray } from "drizzle-orm";
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

    const { habitIds, latestMood } = await req.json();
    if (!latestMood) {
      return NextResponse.json({ error: "Latest mood is required" }, { status: 400 });
    }

    const thirtyDaysAgo = subDays(new Date(), 30);

    const habitsToAnalyze = await db
      .select()
      .from(habits)
      .where(and(eq(habits.userId, userId), inArray(habits.id, habitIds)));

    const correlations = await Promise.all(habitsToAnalyze.map(async (habit) => {
      const completions = await db
        .select()
        .from(habitCompletions)
        .where(
          and(
            eq(habitCompletions.habitId, habit.id),
            gte(habitCompletions.completedAt, thirtyDaysAgo.toISOString())
          )
        )
        .orderBy(desc(habitCompletions.completedAt));

      if (completions.length === 0) {
        return null;
      }

      const prompt = {
        role: "system" as const,
        content: `You are an AI assistant analyzing the correlation between a habit and the latest mood. 
        Provide insights on the potential relationship between the habit and the current mood.
        Format your response as a JSON object with the following structure:
        {
          "habitName": "The name of the habit",
          "mood": "The latest mood",
          "correlationStrength": A number between -1 and 1 representing the potential correlation strength,
          "analysis": "A brief analysis of the potential relationship between the habit and the latest mood"
        }`
      };

      const userMessage = {
        role: "user" as const,
        content: `Analyze the potential correlation between the habit "${habit.name}" and the latest mood "${latestMood}". 
        Consider the habit's recent completion data: ${JSON.stringify(completions)}
        Provide a potential correlation strength and a brief analysis.`
      };

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [prompt, userMessage],
      });

      const data = await response.json();
      const correlationString = data.choices[0].message?.content || "{}";
      const correlationObject = JSON.parse(correlationString);

      const [savedCorrelation] = await db.insert(moodHabitCorrelations).values({
        userId,
        habitId: habit.id,
        correlationData: correlationObject,
      }).returning();

      return {
        ...correlationObject,
        savedRecord: savedCorrelation
      };
    }));

    const validCorrelations = correlations.filter(corr => corr !== null);

    return NextResponse.json({
      message: "Mood-habit correlations generated and saved successfully",
      correlations: validCorrelations
    });
  } catch (error) {
    console.error("Error generating mood-habit correlation:", error);
    return NextResponse.json(
      { error: "An error occurred while generating mood-habit correlation" },
      { status: 500 }
    );
  }
}