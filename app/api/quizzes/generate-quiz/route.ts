// File: app/api/quizzes/generate-quiz/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizzes, quizQuestions } from "@/lib/db/schema";
import { Configuration, OpenAIApi } from "openai-edge";

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

    const { chatId, pdfName, difficulty = "medium" } = await req.json();

    // Generate quiz using OpenAI (replace with your PDF content)
    const prompt = `Create a quiz with 5 multiple choice questions about "${pdfName}". 
    Return JSON format:
    {
      "title": "Quiz Title",
      "description": "Brief description",
      "questions": [
        {
          "questionText": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "Why A is correct",
          "difficulty": "medium"
        }
      ]
    }`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const data = await response.json();
    const quizData = JSON.parse(data.choices[0].message?.content || "{}");

    // Save quiz to database
    const [quiz] = await db.insert(quizzes).values({
      chatId,
      title: quizData.title,
      description: quizData.description,
      totalQuestions: quizData.questions.length,
      difficulty,
      category: pdfName,
    }).returning();

    // Save questions
    const questionsToInsert = quizData.questions.map((q: any, index: number) => ({
      quizId: quiz.id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      order: index + 1,
      difficulty: q.difficulty || "medium",
    }));

    await db.insert(quizQuestions).values(questionsToInsert);

    return NextResponse.json({ quizId: quiz.id, quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}