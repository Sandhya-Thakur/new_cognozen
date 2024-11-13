import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const habitName = searchParams.get('habitName');

  if (!habitName) {
    return NextResponse.json({ error: "Habit name is required" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a motivational assistant. Provide a two liner, inspiring message for a specific habit."
        },
        {
          role: "user",
          content: `Generate a short motivational message for the habit: "${habitName}".`
        }
      ],
      max_tokens: 50
    });

    const motivationalLine = completion.choices[0].message.content || `Stay committed to your ${habitName} habit!`;

    return NextResponse.json({ motivationalLine });
  } catch (error) {
    console.error("Error generating motivational line:", error);
    return NextResponse.json({ error: "Failed to generate motivational line" }, { status: 500 });
  }
}