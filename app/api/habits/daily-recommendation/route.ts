// File: app/api/habits/daily-recommendation/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let isFeelFlow = true; // Toggle between FeelFlow and Habit-Tracker

export async function GET() {
  try {
    const appName = isFeelFlow ? "FeelFlow" : "Habit-Tracker";
    const prompt = isFeelFlow
      ? "Generate a mood-checking recommendation for the FeelFlow app."
      : "Generate a habit completion recommendation for the Habit-Tracker app.";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides very short recommendations for ${appName}.for a daily recommendation related to ${isFeelFlow ? 'mood checking' : 'habit completion'}.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const description = completion.choices[0]?.message?.content;

    if (!description) {
      throw new Error("No response content from OpenAI");
    }

    // Toggle for next request
    isFeelFlow = !isFeelFlow;

    return NextResponse.json({ appName, description: description.trim() });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}