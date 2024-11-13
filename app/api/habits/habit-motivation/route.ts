import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all active habits for the user
    const userHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .execute();

    // Generate motivational lines for each habit
    const habitMotivations = await Promise.all(userHabits.map(async (habit) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a motivational assistant. Provide a very short, inspiring quote for a specific habit."
          },
          {
            role: "user",
            content: `Generate a very short motivational line for the habit: "${habit.name}".`
          }
        ],
      });

      const motivationalLine = completion.choices[0].message.content || `Stay motivated with your ${habit.name} habit!`;

      return {
        id: habit.id,
        name: habit.name,
        motivationalLine
      };
    }));

    return NextResponse.json({ habitMotivations });
  } catch (error) {
    console.error("Error generating motivational quotes:", error);
    return NextResponse.json({ error: "Failed to generate motivational quotes" }, { status: 500 });
  }
}