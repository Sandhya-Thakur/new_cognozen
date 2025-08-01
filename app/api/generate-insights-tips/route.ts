import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { insightsAndTips, moodData } from "@/lib/db/schema";
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

    // Fetch the latest mood data
    const latestMoodData = await db
      .select()
      .from(moodData)
      .where(eq(moodData.userId, userId))
      .orderBy(desc(moodData.timestamp))
      .limit(1);

    if (latestMoodData.length === 0) {
      return NextResponse.json({ error: "No mood data found" }, { status: 404 });
    }

    const { mood, reasons } = latestMoodData[0];

    const prompt = {
      role: "system" as const,
      content: `You are an empathetic AI assistant providing insights and tips based on a person's mood and the reasons behind it.
      Your responses should be supportive, encouraging, and tailored to the specific mood and reasons.
      Provide practical advice and strategies to help improve or maintain the person's emotional well-being.
      Format your response as a JSON object with the following structure:
      {
        "mood": "The mood being addressed",
        "understanding": {
          "title": "Understanding the Mood: [Mood]",
          "description": "A brief explanation of the mood and its context"
        },
        "impacts": ["An array of potential impacts"],
        "strategies": [
          {
            "title": "Strategy title",
            "description": "Detailed description of the strategy"
          }
        ],
        "conclusion": "A brief concluding statement"
      }`,
    };

    const userMessage = {
      role: "user" as const,
      content: `Generate insights and tips for someone feeling ${mood}. ${
        reasons && reasons.length > 0
          ? `The reasons for this mood are: ${reasons.join(", ")}.`
          : "No specific reasons were provided for this mood."
      } Include a brief explanation of the mood considering ${
        reasons && reasons.length > 0 ? "these reasons" : "the lack of specific reasons"
      }, its potential impacts, and at least three practical strategies to manage or improve this emotional state.`,
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
    const result = await db.insert(insightsAndTips).values({
      userId,
      mood,
      content: contentString,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({
      message: "Insights generated and saved successfully",
      insights: insightsObject,
      savedRecord: result[0]
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "An error occurred while generating insights" },
      { status: 500 }
    );
  }
}