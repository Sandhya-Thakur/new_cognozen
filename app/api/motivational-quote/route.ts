// api/motivational-quote/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your Vercel environment variables
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a motivational assistant. Provide a very short, inspiring quote for habit tracking."
        },
        {
          role: "user",
          content: "Generate a very short motivational line for habit tracking."
        }
      ],
    });

    const quote = completion.choices[0].message.content || "Stay motivated!";
    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Error generating motivational quote:", error);
    return NextResponse.json({ error: "Failed to generate motivational quote" }, { status: 500 });
  }
}